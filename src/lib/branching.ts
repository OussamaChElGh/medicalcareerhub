import { EXTENSIVE_BRANCH_BANK, EXTENSIVE_CORE_QUESTIONS } from '../data/questions.extensive';
import { CONSTRAINT_GROUP, NUMERIC_DIMENSIONS } from '../data/dimensions';
import {
  ConstraintDimensionId,
  ConstraintKey,
  NumericDimensionId,
  QuestionSet,
  QuickQuestion,
  QuizResult,
  UserProfile,
} from '../types';

export type BranchAxis = NumericDimensionId | ConstraintDimensionId | 'A10';

function addAxis(axes: BranchAxis[], axis: BranchAxis, maxAxes: number): void {
  if (axes.length < maxAxes && !axes.includes(axis)) {
    axes.push(axis);
  }
}

function axisValue(profile: UserProfile, axis: BranchAxis): number {
  if (axis === 'A10') return 2;

  if (axis === 'C1' || axis === 'C2') {
    const keys = (Object.keys(CONSTRAINT_GROUP) as ConstraintKey[]).filter(
      (key) => CONSTRAINT_GROUP[key] === axis,
    );
    const values = keys
      .map((key) => profile.constraints[key])
      .filter((value): value is number => value !== null);
    if (values.length === 0) return 2;
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }

  return profile.numeric[axis] ?? 2;
}

function questionAxisStats(
  question: QuickQuestion,
  axis: BranchAxis,
): { center: number; range: number } | null {
  if (axis === 'A10') return { center: 2, range: 4 };

  if (question.kind === 'ratingGroup' || question.kind === 'rating') {
    return { center: 2, range: 4 };
  }

  const values: number[] = [];
  for (const option of question.options ?? []) {
    if (axis === 'C1' || axis === 'C2') {
      for (const [key, value] of Object.entries(option.constraintScores ?? {})) {
        if (CONSTRAINT_GROUP[key as ConstraintKey] === axis) values.push(value);
      }
    } else if (typeof option.scores?.[axis] === 'number') {
      values.push(option.scores[axis] as number);
    }
  }

  if (values.length === 0) return null;

  const minimum = Math.min(...values);
  const maximum = Math.max(...values);
  return {
    center: (minimum + maximum) / 2,
    range: maximum - minimum,
  };
}

/**
 * Elige hasta tres ejes donde el top 1 y el top 2 se juegan el primer puesto.
 * Prioriza los ejes de desempate del resultado gratuito y, si faltan, los que
 * más difieren entre las dos especialidades.
 */
export function pickBranchAxes(result: QuizResult, maxAxes = 6): BranchAxis[] {
  const axes: BranchAxis[] = [];

  for (const axis of result.duel?.decisiveAxes ?? []) {
    addAxis(axes, axis, maxAxes);
    if (axes.length >= maxAxes) return axes;
  }

  const first = result.top[0]?.specialty;
  const second = result.top[1]?.specialty;

  if (first && second) {
    const emotionalDifference = Math.abs(
      first.constraints.emotionalLoad - second.constraints.emotionalLoad,
    );
    if (emotionalDifference >= 1.5) addAxis(axes, 'C1', maxAxes);

    const conditionsDifference =
      Math.abs(first.constraints.guards - second.constraints.guards) +
      Math.abs(first.constraints.predictability - second.constraints.predictability) +
      Math.abs(first.constraints.flexibility - second.constraints.flexibility) +
      Math.abs(first.constraints.research - second.constraints.research);
    if (conditionsDifference >= 4) addAxis(axes, 'C2', maxAxes);

    const systemsDifference =
      first.systems.some((system) => !second.systems.includes(system)) ||
      second.systems.some((system) => !first.systems.includes(system));
    if (systemsDifference) addAxis(axes, 'A10', maxAxes);

    const numericByDifference = [...NUMERIC_DIMENSIONS].sort(
      (firstAxis, secondAxis) =>
        Math.abs(second.numeric[secondAxis] - first.numeric[secondAxis]) -
        Math.abs(second.numeric[firstAxis] - first.numeric[firstAxis]),
    );
    for (const axis of numericByDifference) {
      addAxis(axes, axis, maxAxes);
      if (axes.length >= maxAxes) return axes;
    }
  }

  const numericFallback = [...NUMERIC_DIMENSIONS].sort(
    (firstAxis, secondAxis) =>
      Math.abs((result.profile.numeric[secondAxis] ?? 2) - 2) -
      Math.abs((result.profile.numeric[firstAxis] ?? 2) - 2),
  );
  for (const axis of numericFallback) {
    addAxis(axes, axis, maxAxes);
  }

  return axes.slice(0, maxAxes);
}

/**
 * Selecciona dos ítems por cada eje de desempate. La selección es determinista
 * y nunca repite un ítem del test gratuito.
 */
/**
 * Número de ítems de desempate según la incertidumbre del resultado gratuito.
 * Más incertidumbre = más ítems, usando el mismo banco.
 */
export function branchItemTarget(result: QuizResult): number {
  const gap = result.duel?.gap ?? 0;

  if (result.confidence.level === 'alta' && gap >= 5) return 8;
  if (result.confidence.level === 'media' && gap >= 2) return 10;
  return 12;
}

export function selectBranchQuestions(
  result: QuizResult,
  targetCount = branchItemTarget(result),
): QuickQuestion[] {
  const maxAxes = Math.ceil(targetCount / 2);
  const axes = pickBranchAxes(result, maxAxes);
  const selected: QuickQuestion[] = [];

  for (const axis of axes) {
    if (selected.length >= targetCount) break;

    const candidates = EXTENSIVE_BRANCH_BANK.filter(
      (question) => question.branchAxis === axis,
    );
    const userValue = axisValue(result.profile, axis);

    const ranked = [...candidates].sort((first, second) => {
      const firstStats = questionAxisStats(first, axis);
      const secondStats = questionAxisStats(second, axis);
      const firstDistance = firstStats ? Math.abs(firstStats.center - userValue) : 99;
      const secondDistance = secondStats ? Math.abs(secondStats.center - userValue) : 99;

      if (firstDistance !== secondDistance) return firstDistance - secondDistance;

      const firstRange = firstStats?.range ?? 0;
      const secondRange = secondStats?.range ?? 0;
      if (firstRange !== secondRange) return secondRange - firstRange;

      return first.order - second.order;
    });

    let taken = 0;
    for (const question of ranked) {
      if (taken >= 2 || selected.length >= targetCount) break;
      if (!selected.some((item) => item.id === question.id)) {
        selected.push(question);
        taken += 1;
      }
    }
  }

  if (selected.length < targetCount) {
    for (const question of EXTENSIVE_BRANCH_BANK) {
      if (selected.length >= targetCount) break;
      if (!selected.some((item) => item.id === question.id)) {
        selected.push(question);
      }
    }
  }

  return selected.slice(0, targetCount);
}

export function getExtensiveDisplayQuestions(branchQuestions: QuickQuestion[]): QuickQuestion[] {
  return [...EXTENSIVE_CORE_QUESTIONS, ...branchQuestions];
}

export function buildScoringQuestionSet(
  freeQuestionSet: QuestionSet,
  branchQuestions: QuickQuestion[],
): QuestionSet {
  return {
    id: `${freeQuestionSet.id}+extensive`,
    version: `${freeQuestionSet.version}+extensive-1.0.0`,
    questions: [
      ...freeQuestionSet.questions,
      ...EXTENSIVE_CORE_QUESTIONS,
      ...branchQuestions,
    ],
  };
}
