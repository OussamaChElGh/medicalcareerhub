import { QUICK_QUESTION_SET } from '../src/data/questions.quick';
import { scoreQuickQuiz } from '../src/lib/scoring';
import { AnswerRecord, QuickQuestion } from '../src/types';

interface Persona {
  name: string;
  answers: AnswerRecord[];
  expectedInTop3: string[];
}

const forced = (questionId: string, optionId: string): AnswerRecord => ({ questionId, optionId });
const maxdiff = (questionId: string, mostId: string, leastId: string): AnswerRecord => ({
  questionId,
  mostId,
  leastId,
});
const multi = (questionId: string, optionIds: string[]): AnswerRecord => ({
  questionId,
  optionIds,
});
const group = (questionId: string, values: Record<string, number | null>): AnswerRecord => ({
  questionId,
  values,
});

const PERSONAS: Persona[] = [
  {
    name: 'Quirúrgica',
    expectedInTop3: ['SURGERY', 'TRAUMATOLOGY', 'ANESTHESIOLOGY', 'EMERGENCY', 'INTENSIVE_CARE'],
    answers: [
      forced('q1_style', 'q1_b'),
      forced('q2_rhythm', 'q2_a'),
      forced('q3_procedures', 'q3_a'),
      maxdiff('q4_activities', 'q4_b', 'q4_c'),
      forced('q5_continuity', 'q5_b'),
      forced('q6_contact', 'q6_c'),
      forced('q7_reasoning', 'q7_b'),
      multi('q8_environment', ['q8_or', 'q8_ward']),
      multi('q9_population', ['q9_adult', 'q9_all']),
      multi('q10_outcome', ['q10_cure', 'q10_function']),
      group('q11_conditions', { guards: 5, predictability: 2, flexibility: 2, research: 1 }),
      group('q12_emotional', { uncertainty: 4, suffering: 2, pressure: 5, death: 2 }),
      multi('q13_systems', ['q13_musculoskeletal', 'q13_digestive']),
      forced('q14_diagnostics', 'q14_d'),
    ],
  },
  {
    name: 'Diagnóstica',
    expectedInTop3: ['RADIOLOGY', 'PATHOLOGY', 'INTERNAL_MEDICINE', 'NUCLEAR_MEDICINE'],
    answers: [
      forced('q1_style', 'q1_a'),
      forced('q2_rhythm', 'q2_d'),
      forced('q3_procedures', 'q3_d'),
      maxdiff('q4_activities', 'q4_a', 'q4_b'),
      forced('q5_continuity', 'q5_b'),
      forced('q6_contact', 'q6_d'),
      forced('q7_reasoning', 'q7_c'),
      multi('q8_environment', ['q8_imaging', 'q8_lab']),
      multi('q9_population', ['q9_all']),
      multi('q10_outcome', ['q10_diagnosis', 'q10_knowledge']),
      group('q11_conditions', { guards: 1, predictability: 5, flexibility: 4, research: 5 }),
      group('q12_emotional', { uncertainty: 3, suffering: 2, pressure: 3, death: 2 }),
      multi('q13_systems', ['q13_multisystem', 'q13_nervous']),
      forced('q14_diagnostics', 'q14_d'),
    ],
  },
  {
    name: 'Continuidad',
    expectedInTop3: ['FAMILY_MEDICINE', 'INTERNAL_MEDICINE', 'PEDIATRICS', 'PALLIATIVE'],
    answers: [
      forced('q1_style', 'q1_c'),
      forced('q2_rhythm', 'q2_b'),
      forced('q3_procedures', 'q3_c'),
      maxdiff('q4_activities', 'q4_c', 'q4_d'),
      forced('q5_continuity', 'q5_a'),
      forced('q6_contact', 'q6_a'),
      forced('q7_reasoning', 'q7_a'),
      multi('q8_environment', ['q8_consultation', 'q8_ward']),
      multi('q9_population', ['q9_all', 'q9_elderly']),
      multi('q10_outcome', ['q10_chronic', 'q10_prevention']),
      group('q11_conditions', { guards: 2, predictability: 5, flexibility: 4, research: 2 }),
      group('q12_emotional', { uncertainty: 3, suffering: 4, pressure: 3, death: 4 }),
      multi('q13_systems', ['q13_multisystem']),
      forced('q14_diagnostics', 'q14_d'),
    ],
  },
  {
    name: 'Aguda',
    expectedInTop3: ['EMERGENCY', 'INTENSIVE_CARE', 'ANESTHESIOLOGY', 'CARDIOVASCULAR_SURGERY'],
    answers: [
      forced('q1_style', 'q1_b'),
      forced('q2_rhythm', 'q2_a'),
      forced('q3_procedures', 'q3_b'),
      maxdiff('q4_activities', 'q4_b', 'q4_c'),
      forced('q5_continuity', 'q5_b'),
      forced('q6_contact', 'q6_b'),
      forced('q7_reasoning', 'q7_a'),
      multi('q8_environment', ['q8_emergency', 'q8_ward']),
      multi('q9_population', ['q9_adult', 'q9_all']),
      multi('q10_outcome', ['q10_stabilize', 'q10_cure']),
      group('q11_conditions', { guards: 5, predictability: 1, flexibility: 2, research: 2 }),
      group('q12_emotional', { uncertainty: 5, suffering: 4, pressure: 5, death: 3 }),
      multi('q13_systems', ['q13_cardiovascular', 'q13_respiratory']),
      forced('q14_diagnostics', 'q14_a'),
    ],
  },
  {
    name: 'Paliativa',
    expectedInTop3: ['PALLIATIVE', 'FAMILY_MEDICINE', 'PSYCHIATRY', 'GERIATRICS'],
    answers: [
      forced('q1_style', 'q1_c'),
      forced('q2_rhythm', 'q2_c'),
      forced('q3_procedures', 'q3_d'),
      maxdiff('q4_activities', 'q4_c', 'q4_b'),
      forced('q5_continuity', 'q5_a'),
      forced('q6_contact', 'q6_a'),
      forced('q7_reasoning', 'q7_a'),
      multi('q8_environment', ['q8_ward', 'q8_home']),
      multi('q9_population', ['q9_adult', 'q9_elderly']),
      multi('q10_outcome', ['q10_palliative', 'q10_chronic']),
      group('q11_conditions', { guards: 2, predictability: 4, flexibility: 3, research: 1 }),
      group('q12_emotional', { uncertainty: 3, suffering: 5, pressure: 3, death: 5 }),
      multi('q13_systems', ['q13_multisystem']),
      forced('q14_diagnostics', 'q14_d'),
    ],
  },
  {
    name: 'Indecisa',
    expectedInTop3: [],
    answers: [
      forced('q1_style', 'q1_a'),
      forced('q2_rhythm', 'q2_c'),
      forced('q3_procedures', 'q3_b'),
      maxdiff('q4_activities', 'q4_a', 'q4_d'),
      forced('q5_continuity', 'q5_c'),
      forced('q6_contact', 'q6_b'),
      forced('q7_reasoning', 'q7_a'),
      multi('q8_environment', ['q8_consultation', 'q8_imaging']),
      multi('q9_population', ['q9_all']),
      multi('q10_outcome', ['q10_diagnosis', 'q10_chronic']),
      group('q11_conditions', { guards: 3, predictability: 3, flexibility: 3, research: 3 }),
      group('q12_emotional', { uncertainty: null, suffering: null, pressure: 3, death: null }),
      multi('q13_systems', ['q13_multisystem']),
      forced('q14_diagnostics', 'q14_d'),
    ],
  },
  {
    name: 'Pediátrica',
    expectedInTop3: ['PEDIATRICS', 'NEONATOLOGY', 'PAEDIATRIC_SURGERY', 'CHILD_PSYCHIATRY'],
    answers: [
      forced('q1_style', 'q1_c'),
      forced('q2_rhythm', 'q2_b'),
      forced('q3_procedures', 'q3_c'),
      maxdiff('q4_activities', 'q4_c', 'q4_d'),
      forced('q5_continuity', 'q5_a'),
      forced('q6_contact', 'q6_a'),
      forced('q7_reasoning', 'q7_a'),
      multi('q8_environment', ['q8_consultation', 'q8_ward']),
      multi('q9_population', ['q9_pediatric']),
      multi('q10_outcome', ['q10_chronic', 'q10_prevention']),
      group('q11_conditions', { guards: 2, predictability: 5, flexibility: 4, research: 2 }),
      group('q12_emotional', { uncertainty: 3, suffering: 4, pressure: 3, death: 4 }),
      multi('q13_systems', ['q13_multisystem']),
      forced('q14_diagnostics', 'q14_d'),
    ],
  },
  {
    name: 'Salud mental',
    expectedInTop3: ['PSYCHIATRY', 'CHILD_PSYCHIATRY', 'PALLIATIVE', 'FAMILY_MEDICINE'],
    answers: [
      forced('q1_style', 'q1_c'),
      forced('q2_rhythm', 'q2_b'),
      forced('q3_procedures', 'q3_d'),
      maxdiff('q4_activities', 'q4_c', 'q4_b'),
      forced('q5_continuity', 'q5_a'),
      forced('q6_contact', 'q6_a'),
      forced('q7_reasoning', 'q7_a'),
      multi('q8_environment', ['q8_consultation']),
      multi('q9_population', ['q9_all']),
      multi('q10_outcome', ['q10_chronic', 'q10_palliative']),
      group('q11_conditions', { guards: 2, predictability: 4, flexibility: 4, research: 3 }),
      group('q12_emotional', { uncertainty: 4, suffering: 5, pressure: 3, death: 4 }),
      multi('q13_systems', ['q13_mental']),
      forced('q14_diagnostics', 'q14_d'),
    ],
  },
  {
    name: 'Quirúrgica técnica',
    expectedInTop3: ['TRAUMATOLOGY', 'SURGERY', 'UROLOGY', 'ENT'],
    answers: [
      forced('q1_style', 'q1_b'),
      forced('q2_rhythm', 'q2_a'),
      forced('q3_procedures', 'q3_b'),
      maxdiff('q4_activities', 'q4_b', 'q4_c'),
      forced('q5_continuity', 'q5_b'),
      forced('q6_contact', 'q6_c'),
      forced('q7_reasoning', 'q7_b'),
      multi('q8_environment', ['q8_or', 'q8_ward']),
      multi('q9_population', ['q9_adult']),
      multi('q10_outcome', ['q10_cure', 'q10_function']),
      group('q11_conditions', { guards: 4, predictability: 2, flexibility: 2, research: 2 }),
      group('q12_emotional', { uncertainty: 3, suffering: 2, pressure: 4, death: 2 }),
      multi('q13_systems', ['q13_musculoskeletal']),
      forced('q14_diagnostics', 'q14_d'),
    ],
  },
  {
    name: 'Preventiva',
    expectedInTop3: ['PREVENTIVE', 'OCCUPATIONAL', 'FAMILY_MEDICINE', 'RESEARCH'],
    answers: [
      forced('q1_style', 'q1_a'),
      forced('q2_rhythm', 'q2_b'),
      forced('q3_procedures', 'q3_d'),
      maxdiff('q4_activities', 'q4_a', 'q4_d'),
      forced('q5_continuity', 'q5_a'),
      forced('q6_contact', 'q6_c'),
      forced('q7_reasoning', 'q7_c'),
      multi('q8_environment', ['q8_consultation', 'q8_lab']),
      multi('q9_population', ['q9_all']),
      multi('q10_outcome', ['q10_prevention', 'q10_diagnosis']),
      group('q11_conditions', { guards: 1, predictability: 5, flexibility: 4, research: 4 }),
      group('q12_emotional', { uncertainty: 3, suffering: 3, pressure: 2, death: 2 }),
      multi('q13_systems', ['q13_multisystem']),
      forced('q14_diagnostics', 'q14_d'),
    ],
  },
];

function mulberry32(seed: number): () => number {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const random = mulberry32(0x5eed1234);

function pick<T>(values: T[]): T {
  return values[Math.floor(random() * values.length)];
}

function shuffle<T>(values: T[]): T[] {
  const copy = [...values];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function answerForQuestion(question: QuickQuestion): AnswerRecord | null {
  const existing = PERSONAS[0].answers.find((answer) => answer.questionId === question.id);
  const template = existing ?? null;
  if (!template) return null;

  switch (question.kind) {
    case 'forced':
      return { questionId: question.id, optionId: pick(question.options ?? []).id };
    case 'maxdiff': {
      const options = shuffle(question.options ?? []);
      return { questionId: question.id, mostId: options[0]?.id, leastId: options[1]?.id };
    }
    case 'multi':
      return {
        questionId: question.id,
        optionIds: shuffle(question.options ?? [])
          .slice(0, 1 + Math.floor(random() * Math.min(2, question.options?.length ?? 1)))
          .map((option) => option.id),
      };
    case 'ratingGroup': {
      const values: Record<string, number | null> = {};
      for (const statement of question.statements ?? []) {
        values[statement.id] =
          question.allowUnknown && random() < 0.15 ? null : 1 + Math.floor(random() * 5);
      }
      return { questionId: question.id, values };
    }
    case 'rating':
      return { questionId: question.id, value: 1 + Math.floor(random() * 5) };
  }
}

function optionDistance(first: { scores?: Record<string, number>; constraintScores?: Record<string, number> }, second: { scores?: Record<string, number>; constraintScores?: Record<string, number> }): number {
  let distance = 0;
  let count = 0;
  for (const key of new Set([...Object.keys(first.scores ?? {}), ...Object.keys(second.scores ?? {})])) {
    distance += Math.abs((first.scores?.[key] ?? 0) - (second.scores?.[key] ?? 0));
    count += 1;
  }
  for (const key of new Set([...Object.keys(first.constraintScores ?? {}), ...Object.keys(second.constraintScores ?? {})])) {
    distance += Math.abs((first.constraintScores?.[key] ?? 0) - (second.constraintScores?.[key] ?? 0));
    count += 1;
  }
  return count === 0 ? 0 : distance / count;
}

function nearMissAnswer(question: QuickQuestion, answer: AnswerRecord): AnswerRecord | null {
  switch (question.kind) {
    case 'forced': {
      const options = question.options ?? [];
      const selected = options.find((option) => option.id === answer.optionId);
      const candidates = options.filter((option) => option.id !== answer.optionId);
      if (!selected || candidates.length === 0) return null;
      const best = candidates.reduce((first, second) =>
        optionDistance(first, selected) <= optionDistance(second, selected) ? first : second,
      );
      return { questionId: question.id, optionId: best.id };
    }

    case 'maxdiff':
      if (!answer.mostId || !answer.leastId) return null;
      return { questionId: question.id, mostId: answer.leastId, leastId: answer.mostId };

    case 'multi': {
      const options = question.options ?? [];
      const selected = answer.optionIds ?? [];
      const unselected = options.filter((option) => !selected.includes(option.id));
      if (selected.length === 0 || unselected.length === 0) return null;
      const replacement = unselected.find((option) => {
        const current = options.find((candidate) => candidate.id === selected[0]);
        return current?.matchValue === option.matchValue;
      });
      const next = replacement ?? unselected[0];
      return {
        questionId: question.id,
        optionIds: [...selected.slice(1), next.id],
      };
    }

    case 'ratingGroup': {
      const values = { ...(answer.values ?? {}) };
      const entries = Object.entries(values).filter(([, value]) => typeof value === 'number');
      if (entries.length === 0) return null;
      const [statementId, rawValue] = entries[0];
      const value = rawValue as number;
      values[statementId] = value >= 5 ? value - 1 : value + 1;
      return { questionId: question.id, values };
    }

    case 'rating':
      if (typeof answer.value !== 'number') return null;
      return {
        questionId: question.id,
        value: answer.value >= 5 ? answer.value - 1 : answer.value + 1,
      };
  }
}

interface Metric {
  top1: number[];
  top3: number[];
  top5: number[];
  rankShift: number[];
}

function emptyMetric(): Metric {
  return { top1: [], top3: [], top5: [], rankShift: [] };
}

function topSet(ids: string[], size: number): Set<string> {
  return new Set(ids.slice(0, size));
}

function overlapSize(first: Set<string>, second: Set<string>): number {
  let count = 0;
  for (const value of first) if (second.has(value)) count += 1;
  return count;
}

function evaluate(
  persona: Persona,
  perturbed: AnswerRecord[],
  baselineIds: string[],
  baselineTop1: string,
  metric: Metric,
): void {
  const result = scoreQuickQuiz(perturbed);
  const ids = result.matches.map((match) => match.specialty.id);
  const nextTop1 = ids[0] ?? '';
  metric.top1.push(nextTop1 === baselineTop1 ? 1 : 0);
  metric.top3.push(overlapSize(topSet(ids, 3), topSet(baselineIds, 3)) / 3);
  metric.top5.push(overlapSize(topSet(ids, 5), topSet(baselineIds, 5)) / 5);
  const baselineRank = ids.indexOf(baselineTop1);
  metric.rankShift.push(baselineRank < 0 ? ids.length : baselineRank + 1);
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function pct(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

function main(): void {
  const near = emptyMetric();
  const randomMetric = emptyMetric();
  const flipsByQuestion = new Map<string, { near: number; random: number; total: number }>();
  const personaStats = new Map<string, { top1: number; total: number }>();

  for (const question of QUICK_QUESTION_SET.questions) {
    flipsByQuestion.set(question.id, { near: 0, random: 0, total: 0 });
  }

  for (const persona of PERSONAS) {
    const baseline = scoreQuickQuiz(persona.answers);
    const baselineIds = baseline.matches.map((match) => match.specialty.id);
    const baselineTop1 = baselineIds[0] ?? '';
    const personaStat = { top1: 0, total: 0 };

    for (const question of QUICK_QUESTION_SET.questions) {
      const answer = persona.answers.find((item) => item.questionId === question.id);
      if (!answer) continue;

      const nearMiss = nearMissAnswer(question, answer);
      if (nearMiss) {
        const perturbed = persona.answers.filter((item) => item.questionId !== question.id).concat(nearMiss);
        evaluate(persona, perturbed, baselineIds, baselineTop1, near);
        const stats = flipsByQuestion.get(question.id)!;
        const nextTop1 = scoreQuickQuiz(perturbed).matches[0]?.specialty.id;
        if (nextTop1 !== baselineTop1) stats.near += 1;
        stats.total += 1;
        personaStat.total += 1;
        if (nextTop1 === baselineTop1) personaStat.top1 += 1;
      }

      const randomAnswer = answerForQuestion(question);
      if (randomAnswer) {
        const perturbed = persona.answers.filter((item) => item.questionId !== question.id).concat(randomAnswer);
        evaluate(persona, perturbed, baselineIds, baselineTop1, randomMetric);
        const stats = flipsByQuestion.get(question.id)!;
        const nextTop1 = scoreQuickQuiz(perturbed).matches[0]?.specialty.id;
        if (nextTop1 !== baselineTop1) stats.random += 1;
        personaStat.total += 1;
        if (nextTop1 === baselineTop1) personaStat.top1 += 1;
      }
    }

    personaStats.set(persona.name, personaStat);
  }

  console.log('=== Estabilidad del test gratuito ===');
  console.log(`Personas: ${PERSONAS.length} · preguntas: ${QUICK_QUESTION_SET.questions.length}`);
  console.log('\n--- Cambio cercano (segunda opción más próxima) ---');
  console.log(`Top 1 estable: ${pct(average(near.top1))}`);
  console.log(`Top 3 conservado: ${pct(average(near.top3))}`);
  console.log(`Top 5 conservado: ${pct(average(near.top5))}`);
  console.log(`Puesto medio del top 1 original: ${average(near.rankShift).toFixed(2)}`);

  console.log('\n--- Cambio aleatorio ---');
  console.log(`Top 1 estable: ${pct(average(randomMetric.top1))}`);
  console.log(`Top 3 conservado: ${pct(average(randomMetric.top3))}`);
  console.log(`Top 5 conservado: ${pct(average(randomMetric.top5))}`);
  console.log(`Puesto medio del top 1 original: ${average(randomMetric.rankShift).toFixed(2)}`);

  console.log('\n--- Por persona ---');
  for (const [name, stat] of personaStats) {
    console.log(`${name.padEnd(22)} ${pct(stat.top1 / Math.max(1, stat.total))}`);
  }

  console.log('\n--- Preguntas con más cambios de top 1 ---');
  const questionRows = [...flipsByQuestion.entries()]
    .map(([id, stats]) => ({ id, ...stats }))
    .sort((first, second) => second.near + second.random - (first.near + first.random));
  for (const row of questionRows.slice(0, 8)) {
    console.log(
      `${row.id.padEnd(22)} near ${row.near} · random ${row.random} · total ${row.total}`,
    );
  }

  const nearTop1 = average(near.top1);
  const nearTop3 = average(near.top3);
  const nearTop5 = average(near.top5);
  const randomTop1 = average(randomMetric.top1);

  if (process.argv.includes('--strict')) {
    if (nearTop1 < 0.8) {
      throw new Error(`Estabilidad cercana del top 1 insuficiente: ${pct(nearTop1)} < 80.0%.`);
    }
    if (nearTop3 < 0.85) {
      throw new Error(`Conservación cercana del top 3 insuficiente: ${pct(nearTop3)} < 85.0%.`);
    }
    if (nearTop5 < 0.85) {
      throw new Error(`Conservación cercana del top 5 insuficiente: ${pct(nearTop5)} < 85.0%.`);
    }
    if (randomTop1 < 0.8) {
      throw new Error(`Estabilidad aleatoria del top 1 insuficiente: ${pct(randomTop1)} < 80.0%.`);
    }
  }
}

main();
