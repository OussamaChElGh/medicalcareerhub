import assert from 'node:assert/strict';
import { QUICK_QUESTION_SET } from '../src/data/questions.quick';
import { ACTIVE_SPECIALTIES } from '../src/data/specialties';
import { AnswerRecord, QuickQuestion, QuickOption } from '../src/types';
import { scoreQuickQuiz } from '../src/lib/scoring';
import { buildDuelTeaser, buildFreeHeadline, confidenceLabel } from '../src/lib/narrative';

interface Persona {
  name: string;
  answers: AnswerRecord[];
  expectedInTop3: string[];
  expectedConfidence?: 'alta' | 'media' | 'baja';
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
    expectedInTop3: [
      'SURGERY',
      'TRAUMATOLOGY',
      'ANESTHESIOLOGY',
      'EMERGENCY',
      'INTENSIVE_CARE',
      'THORACIC_SURGERY',
      'UROLOGY',
      'CARDIOVASCULAR_SURGERY',
      'VASCULAR',
      'PLASTIC_SURGERY',
      'NEUROSURGERY',
    ],
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
      group('q11_conditions', {
        guards: 5,
        predictability: 2,
        flexibility: 2,
        research: 1,
      }),
      group('q12_emotional', {
        uncertainty: 4,
        suffering: 2,
        pressure: 5,
        death: 2,
      }),
      multi('q13_systems', ['q13_musculoskeletal', 'q13_digestive']),
      forced('q14_diagnostics', 'q14_d'),
    ],
  },
  {
    name: 'Diagnóstica',
    expectedInTop3: [
      'RADIOLOGY',
      'PATHOLOGY',
      'INTERNAL_MEDICINE',
      'NUCLEAR_MEDICINE',
      'MICROBIOLOGY',
      'GENETICS',
      'NEUROPHYSIOLOGY',
      'IMMUNOLOGY',
    ],
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
      group('q11_conditions', {
        guards: 1,
        predictability: 5,
        flexibility: 4,
        research: 5,
      }),
      group('q12_emotional', {
        uncertainty: 3,
        suffering: 2,
        pressure: 3,
        death: 2,
      }),
      multi('q13_systems', ['q13_multisystem', 'q13_nervous']),
      forced('q14_diagnostics', 'q14_d'),
    ],
  },
  {
    name: 'Continuidad',
    expectedInTop3: [
      'FAMILY_MEDICINE',
      'INTERNAL_MEDICINE',
      'PEDIATRICS',
      'PALLIATIVE',
      'PREVENTIVE',
      'OCCUPATIONAL',
      'ENDOCRINOLOGY',
      'GERIATRICS',
      'REHAB',
      'ALLERGOLOGY',
      'RHEUMATOLOGY',
    ],
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
      group('q11_conditions', {
        guards: 2,
        predictability: 5,
        flexibility: 4,
        research: 2,
      }),
      group('q12_emotional', {
        uncertainty: 3,
        suffering: 4,
        pressure: 3,
        death: 4,
      }),
      multi('q13_systems', ['q13_multisystem']),
      forced('q14_diagnostics', 'q14_d'),
    ],
  },
  {
    name: 'Aguda',
    expectedInTop3: [
      'EMERGENCY',
      'INTENSIVE_CARE',
      'ANESTHESIOLOGY',
      'CARDIOVASCULAR_SURGERY',
      'THORACIC_SURGERY',
      'NEUROSURGERY',
      'TRAUMATOLOGY',
      'SURGERY',
      'TOXICOLOGY',
    ],
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
      group('q11_conditions', {
        guards: 5,
        predictability: 1,
        flexibility: 2,
        research: 2,
      }),
      group('q12_emotional', {
        uncertainty: 5,
        suffering: 4,
        pressure: 5,
        death: 3,
      }),
      multi('q13_systems', ['q13_cardiovascular', 'q13_respiratory']),
      forced('q14_diagnostics', 'q14_a'),
    ],
  },
  {
    name: 'Paliativa',
    expectedInTop3: [
      'PALLIATIVE',
      'FAMILY_MEDICINE',
      'PSYCHIATRY',
      'GERIATRICS',
      'ONCOLOGY',
      'REHAB',
      'CHILD_PSYCHIATRY',
      'ALLERGOLOGY',
    ],
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
      group('q11_conditions', {
        guards: 2,
        predictability: 4,
        flexibility: 3,
        research: 1,
      }),
      group('q12_emotional', {
        uncertainty: 3,
        suffering: 5,
        pressure: 3,
        death: 5,
      }),
      multi('q13_systems', ['q13_multisystem']),
      forced('q14_diagnostics', 'q14_d'),
    ],
  },
  {
    name: 'Indecisa',
    expectedInTop3: [],
    expectedConfidence: 'media',
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
      group('q11_conditions', {
        guards: 3,
        predictability: 3,
        flexibility: 3,
        research: 3,
      }),
      group('q12_emotional', {
        uncertainty: null,
        suffering: null,
        pressure: 3,
        death: null,
      }),
      multi('q13_systems', ['q13_multisystem']),
      forced('q14_diagnostics', 'q14_d'),
    ],
  },
];

function randomInt(max: number): number {
  return Math.floor(Math.random() * max);
}

function pick<T>(values: T[]): T {
  return values[randomInt(values.length)];
}

function shuffle<T>(values: T[]): T[] {
  const copy = [...values];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInt(index + 1);
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function pickTwo<T>(values: T[]): [T, T] {
  if (values.length < 2) {
    throw new Error('Se necesitan al menos dos opciones para maxdiff.');
  }
  const shuffled = shuffle(values);
  return [shuffled[0], shuffled[1]];
}

function randomAnswerForQuestion(question: QuickQuestion): AnswerRecord {
  switch (question.kind) {
    case 'forced': {
      const options = question.options ?? [];
      return { questionId: question.id, optionId: pick(options).id };
    }
    case 'maxdiff': {
      const [most, least] = pickTwo(question.options ?? []);
      return { questionId: question.id, mostId: most.id, leastId: least.id };
    }
    case 'multi': {
      const options = question.options ?? [];
      const max = Math.min(question.maxSelections ?? 1, options.length);
      const count = 1 + randomInt(max);
      return {
        questionId: question.id,
        optionIds: shuffle(options)
          .slice(0, count)
          .map((option) => option.id),
      };
    }
    case 'ratingGroup': {
      const values: Record<string, number | null> = {};
      for (const statement of question.statements ?? []) {
        values[statement.id] =
          question.allowUnknown && Math.random() < 0.15
            ? null
            : 1 + randomInt(5);
      }
      return { questionId: question.id, values };
    }
    case 'rating':
      return { questionId: question.id, value: 1 + randomInt(5) };
  }
}

function randomAnswers(): AnswerRecord[] {
  return QUICK_QUESTION_SET.questions.map(randomAnswerForQuestion);
}

function printResult(persona: Persona): void {
  const result = scoreQuickQuiz(persona.answers);
  const topLine = result.top
    .map((match) => `${match.specialty.name} (${match.score.toFixed(1)}, ${match.band})`)
    .join(' | ');

  console.log(`\n--- ${persona.name} ---`);
  console.log(`Confianza: ${confidenceLabel(result.confidence)} · cobertura ${result.confidence.coverage}% · separación ${result.confidence.separation} · diferenciación ${result.confidence.differentiation}`);
  console.log(`Top 5: ${topLine || '(vacío)'}`);
  if (result.top[0]) {
    console.log(`Titular: ${buildFreeHeadline(result.top[0])}`);
  }
  if (result.duel && result.top[1]) {
    console.log(`Duelo: ${buildDuelTeaser(result.duel, result.top[0], result.top[1])}`);
  }
  if (result.warnings.length > 0) {
    console.log(`Avisos: ${result.warnings.join(' ')}`);
  }
}

function verifyPersonas(): void {
  for (const persona of PERSONAS) {
    const result = scoreQuickQuiz(persona.answers);

    assert.equal(result.top.length, 5, `${persona.name}: el resultado gratuito debe mostrar 5 especialidades.`);
    assert.equal(
      new Set(result.top.map((match) => match.specialty.id)).size,
      result.top.length,
      `${persona.name}: no puede haber especialidades duplicadas en el top 5.`,
    );

    for (let index = 1; index < result.matches.length; index += 1) {
      assert.ok(
        result.matches[index - 1].score >= result.matches[index].score,
        `${persona.name}: los resultados deben estar ordenados por puntuación.`,
      );
    }

    if (persona.expectedInTop3.length > 0) {
      const topIds = result.top.slice(0, 3).map((match) => match.specialty.id);
      assert.ok(
        topIds.some((id) => persona.expectedInTop3.includes(id)),
        `${persona.name}: se esperaba alguna de ${persona.expectedInTop3.join(', ')} en el top 3, pero salió ${topIds.join(', ')}.`,
      );
    }

    if (persona.expectedConfidence) {
      assert.notEqual(
        result.confidence.level,
        persona.expectedConfidence === 'media' ? 'alta' : 'invalida',
        `${persona.name}: la confianza no debería ser alta.`,
      );
    }

    if (result.top[0]) {
      assert.notEqual(
        result.top[0].band,
        'A explorar',
        `${persona.name}: la primera especialidad no debería quedar en “A explorar”.`,
      );
    }

    if (result.duel && result.duel.gap === 0) {
      assert.equal(
        result.duel.decisiveAxes.length,
        0,
        `${persona.name}: un empate exacto no puede tener ejes de desempate.`,
      );
    }
  }
}

function verifyEmptyAnswers(): void {
  const empty = scoreQuickQuiz([]);
  assert.equal(empty.matches.length, 0, 'Sin respuestas no debe haber ranking.');
  assert.equal(empty.top.length, 0, 'Sin respuestas el top debe estar vacío.');
  assert.equal(empty.confidence.level, 'baja', 'Sin respuestas la confianza debe ser baja.');

  const skipped = scoreQuickQuiz([{ questionId: 'q1_style', skipped: true }]);
  assert.equal(skipped.matches.length, 0, 'Con todo omitido no debe haber ranking.');
}

function verifyReachability(): void {
  const runs = 5000;
  const wins: Record<string, number> = {};
  const appearances: Record<string, number> = {};
  for (const specialty of ACTIVE_SPECIALTIES) {
    wins[specialty.id] = 0;
    appearances[specialty.id] = 0;
  }

  for (let run = 0; run < runs; run += 1) {
    const result = scoreQuickQuiz(randomAnswers());
    const winner = result.top[0];
    if (winner) {
      wins[winner.specialty.id] = (wins[winner.specialty.id] ?? 0) + 1;
    }
    for (const match of result.top) {
      appearances[match.specialty.id] = (appearances[match.specialty.id] ?? 0) + 1;
    }
  }

  const sorted = Object.entries(wins).sort((first, second) => second[1] - first[1]);
  const maxId = sorted[0][0];
  const maxRate = sorted[0][1] / runs;

  console.log('\n--- Reparto aleatorio (5000 perfiles) ---');
  console.log('Especialidad          Top 1    Top 5');
  for (const [id, count] of sorted) {
    console.log(
      `${id.padEnd(20)} ${((count / runs) * 100).toFixed(1).padStart(6)}% ${((appearances[id] / runs) * 100).toFixed(1).padStart(7)}%`,
    );
  }

  for (const [id, count] of Object.entries(appearances)) {
    assert.ok(count > 0, `La especialidad ${id} nunca aparece en el top 5: no es alcanzable.`);
  }

  assert.ok(
    maxRate < 0.35,
    `Posible sesgo estructural: ${maxId} gana el ${(maxRate * 100).toFixed(1)}% de los perfiles aleatorios.`,
  );
}

function verifyStability(): void {
  let stable = 0;
  let total = 0;

  for (const persona of PERSONAS) {
    const baseline = scoreQuickQuiz(persona.answers).top[0]?.specialty.id;
    if (!baseline) continue;

    for (let run = 0; run < 100; run += 1) {
      const question = pick(QUICK_QUESTION_SET.questions);
      const perturbed = persona.answers
        .filter((answer) => answer.questionId !== question.id)
        .concat(randomAnswerForQuestion(question));
      const next = scoreQuickQuiz(perturbed).top[0]?.specialty.id;
      total += 1;
      if (next === baseline) stable += 1;
    }
  }

  const stability = total === 0 ? 0 : stable / total;
  console.log(`\nEstabilidad del primer puesto ante un cambio: ${(stability * 100).toFixed(1)}%`);
  assert.ok(stability >= 0.6, `Estabilidad demasiado baja: ${(stability * 100).toFixed(1)}%.`);
}

function main(): void {
  console.log('=== Verificación del motor de scoring v1 ===');
  console.log(`Especialidades activas: ${ACTIVE_SPECIALTIES.length}`);
  console.log(`Preguntas: ${QUICK_QUESTION_SET.questions.length}`);

  verifyPersonas();
  verifyEmptyAnswers();
  verifyReachability();
  console.log('\nEstabilidad: ejecuta `npm run verify:stability` para el arnés determinista.');

  for (const persona of PERSONAS) {
    printResult(persona);
  }

  console.log('\nOK: todas las comprobaciones han pasado.');
}

main();
