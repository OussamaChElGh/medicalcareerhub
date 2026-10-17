import {
  AnswerRecord,
  AxisComparison,
  ConfidenceResult,
  ConstraintKey,
  DuelResult,
  EnvironmentKey,
  MatchReason,
  NumericDimensionId,
  OutcomeKey,
  PopulationKey,
  QuestionSet,
  QuizResult,
  SpecialtyMatch,
  SpecialtyProfile,
  SystemKey,
  UserProfile,
} from '../types';
import {
  CONSTRAINT_KEYS,
  DIMENSION_LABELS,
  ENVIRONMENT_LABELS,
  NUMERIC_DIMENSIONS,
  OUTCOME_LABELS,
  POPULATION_LABELS,
  SYSTEM_LABELS,
} from '../data/dimensions';
import { ACTIVE_SPECIALTIES, SPECIALTY_CATALOG_VERSION } from '../data/specialties';
import { QUICK_QUESTION_SET } from '../data/questions.quick';

export const SCHEMA_VERSION = '2.1.0';
export const SCORING_VERSION = '2.0.0';

const AFFINITY_WEIGHTS = {
  numeric: 0.65,
  population: 0.08,
  outcome: 0.09,
  environment: 0.08,
  systems: 0.1,
};

const MIN_NUMERIC_COVERAGE = 0.5;
const DUEL_GAP_THRESHOLD = 3;
const BAND_ALTA_DELTA = 4;
const BAND_MEDIA_DELTA = 12;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

interface WeightedValue {
  value: number;
  weight: number;
}

function average(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function weightedAverage(values: WeightedValue[]): number | null {
  if (values.length === 0) return null;
  const totalWeight = values.reduce((sum, item) => sum + item.weight, 0);
  if (totalWeight === 0) return null;
  return values.reduce((sum, item) => sum + item.value * item.weight, 0) / totalWeight;
}

function toScale0to4(value: number): number {
  return clamp(value, 1, 5) - 1;
}

function addNumericObservations(
  observations: Record<NumericDimensionId, WeightedValue[]>,
  scores: Partial<Record<NumericDimensionId, number>> | undefined,
  weight: number,
  valueOverride?: number,
): void {
  if (!scores) return;
  for (const [dimension, rawValue] of Object.entries(scores) as [NumericDimensionId, number][]) {
    observations[dimension].push({
      value: clamp(valueOverride ?? rawValue, 0, 4),
      weight,
    });
  }
}

function addConstraintObservations(
  observations: Record<ConstraintKey, WeightedValue[]>,
  scores: Partial<Record<ConstraintKey, number>> | undefined,
  weight: number,
  valueOverride?: number,
): void {
  if (!scores) return;
  for (const [key, rawValue] of Object.entries(scores) as [ConstraintKey, number][]) {
    observations[key].push({
      value: clamp(valueOverride ?? rawValue, 0, 4),
      weight,
    });
  }
}

function averageConstraint(profile: UserProfile, keys: ConstraintKey[]): number | null {
  return average(
    keys
      .map((key) => profile.constraints[key])
      .filter((value): value is number => value !== null),
  );
}

export function aggregateProfile(answers: AnswerRecord[], questionSet: QuestionSet): UserProfile {
  const answerMap = new Map<string, AnswerRecord>();
  for (const answer of answers) {
    answerMap.set(answer.questionId, answer);
  }

  const observations: Record<NumericDimensionId, WeightedValue[]> = {
    A1: [],
    A2: [],
    A3: [],
    A4: [],
    A5: [],
    A8: [],
  };

  const constraintObservations: Record<ConstraintKey, WeightedValue[]> = {
    uncertainty: [],
    suffering: [],
    pressure: [],
    death: [],
    guards: [],
    predictability: [],
    flexibility: [],
    research: [],
  };

  const populations = new Set<PopulationKey>();
  const outcomes = new Set<OutcomeKey>();
  const environments = new Set<EnvironmentKey>();
  const systems = new Set<SystemKey>();
  const rejectedSystems = new Set<SystemKey>();
  let answeredCount = 0;

  for (const question of questionSet.questions) {
    const answer = answerMap.get(question.id);
    if (!answer || answer.skipped) continue;

    answeredCount += 1;
    const weight = question.weight ?? 1;

    switch (question.kind) {
      case 'forced': {
        const option = question.options?.find((candidate) => candidate.id === answer.optionId);
        addNumericObservations(observations, option?.scores, weight);
        addConstraintObservations(constraintObservations, option?.constraintScores, weight);

        if (question.matchDimension && option?.matchValue) {
          if (question.matchDimension === 'A6') {
            populations.add(option.matchValue as PopulationKey);
          } else if (question.matchDimension === 'A7') {
            outcomes.add(option.matchValue as OutcomeKey);
          } else if (question.matchDimension === 'A9') {
            environments.add(option.matchValue as EnvironmentKey);
          } else if (question.matchDimension === 'A10') {
            const target = question.matchMode === 'reject' ? rejectedSystems : systems;
            target.add(option.matchValue as SystemKey);
          }
        }
        break;
      }

      case 'maxdiff': {
        const most = question.options?.find((candidate) => candidate.id === answer.mostId);
        addNumericObservations(observations, most?.scores, weight);
        addConstraintObservations(constraintObservations, most?.constraintScores, weight);

        const least = question.options?.find((candidate) => candidate.id === answer.leastId);
        if (least && least.id !== most?.id) {
          addNumericObservations(observations, least.scores, weight, 0);
        }
        break;
      }

      case 'rating': {
        if (question.dimension && typeof answer.value === 'number') {
          observations[question.dimension].push({
            value: toScale0to4(answer.value),
            weight,
          });
        }
        break;
      }

      case 'ratingGroup': {
        for (const statement of question.statements ?? []) {
          const rawValue = answer.values?.[statement.id];
          if (typeof rawValue === 'number') {
            const scaled = toScale0to4(rawValue);
            constraintObservations[statement.id].push({
              value: statement.reverse ? 4 - scaled : scaled,
              weight,
            });
          }
        }
        break;
      }

      case 'multi': {
        const selectedIds = (answer.optionIds ?? []).slice(0, question.maxSelections ?? 99);
        for (const optionId of selectedIds) {
          const option = question.options?.find((candidate) => candidate.id === optionId);
          if (!option?.matchValue) continue;

          if (question.matchDimension === 'A6') {
            populations.add(option.matchValue as PopulationKey);
          } else if (question.matchDimension === 'A7') {
            outcomes.add(option.matchValue as OutcomeKey);
          } else if (question.matchDimension === 'A9') {
            environments.add(option.matchValue as EnvironmentKey);
          } else if (question.matchDimension === 'A10') {
            systems.add(option.matchValue as SystemKey);
          }
        }
        break;
      }
    }
  }

  const numeric = {} as Record<NumericDimensionId, number | null>;
  for (const dimension of NUMERIC_DIMENSIONS) {
    numeric[dimension] = weightedAverage(observations[dimension]);
  }

  const constraints = {} as Record<ConstraintKey, number | null>;
  for (const key of CONSTRAINT_KEYS) {
    constraints[key] = weightedAverage(constraintObservations[key]);
  }

  return {
    numeric,
    constraints,
    populations: [...populations],
    outcomes: [...outcomes],
    environments: [...environments],
    systems: [...systems],
    rejectedSystems: [...rejectedSystems],
    answeredCount,
  };
}

function numericFit(profile: UserProfile, specialty: SpecialtyProfile): number | null {
  let distance = 0;
  let count = 0;

  for (const dimension of NUMERIC_DIMENSIONS) {
    const userValue = profile.numeric[dimension];
    if (userValue === null) continue;
    distance += Math.abs(userValue - specialty.numeric[dimension]);
    count += 1;
  }

  if (count === 0) return null;
  return clamp(1 - distance / (4 * count), 0, 1);
}

function overlapFit(selected: string[], offered: string[], universal = 'all'): number | null {
  if (selected.length === 0) return null;

  const selectedSpecific = selected.filter((value) => value !== universal);
  const offeredUniversal = offered.includes(universal);

  // Las elecciones concretas mandan. "Todas las edades" o "varios sistemas"
  // solo actúan como cobertura amplia cuando no hay una coincidencia específica.
  if (selectedSpecific.length > 0) {
    const matches = selectedSpecific.filter((value) => offered.includes(value)).length;
    if (matches > 0) return matches / selectedSpecific.length;
    if (offeredUniversal) return 0.75;
    if (selected.includes(universal)) return 0.6;
    return 0;
  }

  if (selected.includes(universal)) {
    return offeredUniversal ? 0.6 : 0.45;
  }

  return offeredUniversal ? 0.75 : 0;
}

function buildReasons(profile: UserProfile, specialty: SpecialtyProfile): {
  reasons: MatchReason[];
  frictions: MatchReason[];
} {
  const reasons: MatchReason[] = [];
  const frictions: MatchReason[] = [];

  for (const dimension of NUMERIC_DIMENSIONS) {
    const userValue = profile.numeric[dimension];
    if (userValue === null) continue;

    const specialtyValue = specialty.numeric[dimension];
    const gap = Math.abs(userValue - specialtyValue);
    const reason: MatchReason = {
      dimension,
      label: DIMENSION_LABELS[dimension],
      userValue: round1(userValue),
      specialtyValue,
      gap: round1(gap),
    };

    if (gap <= 0.75 && userValue >= 2 && specialtyValue >= 2) {
      reasons.push(reason);
    }
    if (gap >= 1.5) {
      frictions.push(reason);
    }
  }

  reasons.sort((first, second) => first.gap - second.gap);
  frictions.sort((first, second) => second.gap - first.gap);

  return {
    reasons: reasons.slice(0, 3),
    frictions: frictions.slice(0, 2),
  };
}

function buildConstraintNotes(profile: UserProfile, specialty: SpecialtyProfile): string[] {
  const notes: string[] = [];
  const emotionalTolerance = averageConstraint(profile, [
    'uncertainty',
    'suffering',
    'pressure',
    'death',
  ]);

  if (emotionalTolerance !== null && emotionalTolerance + 1 < specialty.constraints.emotionalLoad) {
    notes.push('Alta exposición emocional');
  }

  const guards = profile.constraints.guards;
  if (guards !== null && guards <= 1 && specialty.constraints.guards >= 3) {
    notes.push('Guardias frecuentes');
  }

  const predictability = profile.constraints.predictability;
  if (predictability !== null && predictability >= 3 && specialty.constraints.predictability <= 1) {
    notes.push('Horario poco predecible');
  }

  const flexibility = profile.constraints.flexibility;
  if (flexibility !== null && flexibility >= 3 && specialty.constraints.flexibility <= 1) {
    notes.push('Poca flexibilidad de ejercicio');
  }

  const research = profile.constraints.research;
  if (research !== null && research >= 3 && specialty.constraints.research <= 1) {
    notes.push('Pocas oportunidades de investigación');
  }

  return notes;
}

function computeMatch(profile: UserProfile, specialty: SpecialtyProfile): SpecialtyMatch | null {
  const numeric = numericFit(profile, specialty);
  if (numeric === null) return null;

  const population = overlapFit(profile.populations, specialty.populations, 'all');
  const outcome = overlapFit(profile.outcomes, specialty.outcomes);
  const environment = overlapFit(profile.environments, specialty.environments);
  let system = overlapFit(profile.systems, specialty.systems, 'multisystem');
  const rejection = overlapFit(profile.rejectedSystems, specialty.systems, 'multisystem');

  if (system !== null && rejection !== null) {
    system = Math.max(0, system - rejection * 0.5);
  }

  const components = [
    { fit: numeric, weight: AFFINITY_WEIGHTS.numeric },
    { fit: population, weight: AFFINITY_WEIGHTS.population },
    { fit: outcome, weight: AFFINITY_WEIGHTS.outcome },
    { fit: environment, weight: AFFINITY_WEIGHTS.environment },
    { fit: system, weight: AFFINITY_WEIGHTS.systems },
  ].filter((component): component is { fit: number; weight: number } => component.fit !== null);

  const totalWeight = components.reduce((sum, component) => sum + component.weight, 0);
  const score =
    totalWeight === 0
      ? 0
      : (100 * components.reduce((sum, component) => sum + component.fit * component.weight, 0)) /
        totalWeight;

  const { reasons, frictions } = buildReasons(profile, specialty);

  return {
    specialty,
    score,
    band: 'A explorar',
    reasons,
    frictions,
    constraintNotes: buildConstraintNotes(profile, specialty),
    breakdown: {
      numericFit: round1(numeric * 100),
      populationFit: population === null ? 0 : round1(population * 100),
      outcomeFit: outcome === null ? 0 : round1(outcome * 100),
      environmentFit: environment === null ? 0 : round1(environment * 100),
      systemFit: system === null ? 0 : round1(system * 100),
    },
  };
}

function assignBands(matches: SpecialtyMatch[]): void {
  if (matches.length === 0) return;

  const topScore = matches[0].score;
  matches.forEach((match, index) => {
    const delta = topScore - match.score;

    if (index === 0 && match.score >= 65) {
      match.band = 'Alta';
    } else if (match.score >= 80) {
      match.band = 'Alta';
    } else if (match.score >= 65) {
      match.band = 'Media';
    } else if (delta <= BAND_ALTA_DELTA) {
      match.band = 'Alta';
    } else if (delta <= BAND_MEDIA_DELTA) {
      match.band = 'Media';
    } else {
      match.band = 'A explorar';
    }
  });
}

function computeConfidence(profile: UserProfile, matches: SpecialtyMatch[]): ConfidenceResult {
  const numericCoverage =
    NUMERIC_DIMENSIONS.filter((dimension) => profile.numeric[dimension] !== null).length /
    NUMERIC_DIMENSIONS.length;

  const matchCoverage =
    [
      profile.populations.length,
      profile.outcomes.length,
      profile.environments.length,
      profile.systems.length,
    ].filter((count) => count > 0).length / 4;

  const breadth = Math.min(1, profile.answeredCount / 30);
  const coverage = 0.6 * numericCoverage + 0.2 * matchCoverage + 0.2 * breadth;

  const top = matches.slice(0, 3);
  const separation = top.length >= 2 ? top[0].score - top[top.length - 1].score : 0;

  const values = NUMERIC_DIMENSIONS.map((dimension) => profile.numeric[dimension]).filter(
    (value): value is number => value !== null,
  );
  const mean = values.length > 0 ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
  const variance =
    values.length > 0
      ? values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length
      : 0;
  const differentiation = Math.sqrt(variance);

  let level: ConfidenceResult['level'];
  if (coverage >= 0.8 && separation >= 8 && differentiation >= 0.6) {
    level = 'alta';
  } else if (coverage < MIN_NUMERIC_COVERAGE || separation < 3 || differentiation < 0.25) {
    level = 'baja';
  } else {
    level = 'media';
  }

  return {
    level,
    coverage: round1(coverage * 100),
    separation: round1(separation),
    differentiation: round1(differentiation),
  };
}

function computeDuel(matches: SpecialtyMatch[], profile: UserProfile): DuelResult | null {
  if (matches.length < 2) return null;

  const [first, second] = matches;
  const availableAxes = NUMERIC_DIMENSIONS.filter(
    (dimension) => profile.numeric[dimension] !== null,
  );

  if (availableAxes.length === 0) return null;

  const gap = first.score - second.score;

  const sharedAxes = availableAxes.filter((dimension) => {
    const userValue = profile.numeric[dimension] as number;
    return (
      Math.abs(userValue - first.specialty.numeric[dimension]) <= 0.75 &&
      Math.abs(userValue - second.specialty.numeric[dimension]) <= 0.75
    );
  });

  const comparison: AxisComparison[] = availableAxes.map((dimension) => {
    const userValue = profile.numeric[dimension] as number;
    const firstValue = first.specialty.numeric[dimension];
    const secondValue = second.specialty.numeric[dimension];
    const firstGap = Math.abs(userValue - firstValue);
    const secondGap = Math.abs(userValue - secondValue);
    const difference = Math.abs(firstGap - secondGap);

    return {
      dimension,
      label: DIMENSION_LABELS[dimension],
      userValue: round1(userValue),
      firstValue,
      secondValue,
      firstGap: round1(firstGap),
      secondGap: round1(secondGap),
      winner: difference < 0.25 ? 'tie' : firstGap < secondGap ? 'first' : 'second',
    };
  });

  const decisiveAxes = comparison
    .filter((axis) => Math.abs(axis.firstGap - axis.secondGap) >= 0.25)
    .sort(
      (firstAxis, secondAxis) =>
        Math.abs(secondAxis.firstGap - secondAxis.secondGap) -
        Math.abs(firstAxis.firstGap - firstAxis.secondGap),
    )
    .slice(0, 3)
    .map((axis) => axis.dimension);

  return {
    isClose: gap <= DUEL_GAP_THRESHOLD,
    gap: round1(gap),
    sharedAxes,
    decisiveAxes,
    comparison,
  };
}

export interface ScoreQuizConfig {
  questionSet: QuestionSet;
  specialties: SpecialtyProfile[];
  versions?: Partial<QuizResult['versions']>;
}

export function scoreQuiz(answers: AnswerRecord[], config: ScoreQuizConfig): QuizResult {
  const profile = aggregateProfile(answers, config.questionSet);
  const activeSpecialties = config.specialties.filter((specialty) => specialty.status === 'active');

  const matches = activeSpecialties
    .map((specialty) => computeMatch(profile, specialty))
    .filter((match): match is SpecialtyMatch => match !== null);

  matches.sort((first, second) => {
    if (second.score !== first.score) return second.score - first.score;
    return first.specialty.id.localeCompare(second.specialty.id);
  });

  assignBands(matches);
  const confidence = computeConfidence(profile, matches);

  const warnings: string[] = [];
  if (matches.length === 0) {
    warnings.push('No hay suficientes respuestas para calcular un perfil.');
  }
  if (confidence.level === 'baja') {
    warnings.push(
      'El resultado es orientativo: faltan respuestas o el perfil está poco definido.',
    );
  }

  const duel = confidence.level === 'baja' ? null : computeDuel(matches, profile);

  const roundedMatches = matches.map((match) => ({
    ...match,
    score: round1(match.score),
  }));

  return {
    profile,
    matches: roundedMatches,
    top: roundedMatches.slice(0, 5),
    confidence,
    duel,
    warnings,
    versions: {
      schema: SCHEMA_VERSION,
      questionSet: config.questionSet.version,
      catalog: SPECIALTY_CATALOG_VERSION,
      scoring: SCORING_VERSION,
      ...config.versions,
    },
  };
}

export function scoreQuickQuiz(answers: AnswerRecord[]): QuizResult {
  return scoreQuiz(answers, {
    questionSet: QUICK_QUESTION_SET,
    specialties: ACTIVE_SPECIALTIES,
  });
}

export function describeProfile(profile: UserProfile): string[] {
  const parts: string[] = [];

  for (const dimension of NUMERIC_DIMENSIONS) {
    const value = profile.numeric[dimension];
    if (value !== null) {
      parts.push(`${DIMENSION_LABELS[dimension]}: ${round1(value)}/4`);
    }
  }

  if (profile.populations.length > 0) {
    parts.push(
      `Población: ${profile.populations.map((key) => POPULATION_LABELS[key]).join(', ')}`,
    );
  }
  if (profile.outcomes.length > 0) {
    parts.push(`Resultado: ${profile.outcomes.map((key) => OUTCOME_LABELS[key]).join(', ')}`);
  }
  if (profile.environments.length > 0) {
    parts.push(
      `Entornos: ${profile.environments.map((key) => ENVIRONMENT_LABELS[key]).join(', ')}`,
    );
  }
  if (profile.systems.length > 0) {
    parts.push(
      `Sistemas: ${profile.systems.map((key) => SYSTEM_LABELS[key]).join(', ')}`,
    );
  }

  return parts;
}
