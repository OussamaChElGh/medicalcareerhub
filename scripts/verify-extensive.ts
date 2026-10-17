import assert from 'node:assert/strict';
import { QUICK_QUESTION_SET } from '../src/data/questions.quick';
import { EXTENSIVE_CORE_QUESTIONS } from '../src/data/questions.extensive';
import { ACTIVE_SPECIALTIES } from '../src/data/specialties';
import {
  buildScoringQuestionSet,
  getExtensiveDisplayQuestions,
  pickBranchAxes,
  selectBranchQuestions,
} from '../src/lib/branching';
import { scoreQuiz, scoreQuickQuiz } from '../src/lib/scoring';
import {
  AnswerRecord,
  QuickOption,
  QuickQuestion,
  QuizResult,
  SpecialtyProfile,
  UserProfile,
} from '../src/types';

const FREE_ANSWERS: AnswerRecord[] = [
  { questionId: 'q1_style', optionId: 'q1_b' },
  { questionId: 'q2_rhythm', optionId: 'q2_a' },
  { questionId: 'q3_procedures', optionId: 'q3_a' },
  { questionId: 'q4_activities', mostId: 'q4_b', leastId: 'q4_c' },
  { questionId: 'q5_continuity', optionId: 'q5_b' },
  { questionId: 'q6_contact', optionId: 'q6_c' },
  { questionId: 'q7_reasoning', optionId: 'q7_b' },
  { questionId: 'q8_environment', optionIds: ['q8_or', 'q8_ward'] },
  { questionId: 'q9_population', optionIds: ['q9_adult', 'q9_all'] },
  { questionId: 'q10_outcome', optionIds: ['q10_cure', 'q10_function'] },
  {
    questionId: 'q11_conditions',
    values: { guards: 5, predictability: 2, flexibility: 2, research: 1 },
  },
  {
    questionId: 'q12_emotional',
    values: { uncertainty: 4, suffering: 2, pressure: 5, death: 2 },
  },
  { questionId: 'q13_systems', optionIds: ['q13_musculoskeletal', 'q13_digestive'] },
  { questionId: 'q14_diagnostics', optionId: 'q14_d' },
];

function targetProfileFromSpecialty(specialty: SpecialtyProfile): UserProfile {
  return {
    numeric: specialty.numeric,
    constraints: {
      uncertainty: specialty.constraints.emotionalLoad,
      suffering: specialty.constraints.emotionalLoad,
      pressure: specialty.constraints.emotionalLoad,
      death: specialty.constraints.emotionalLoad,
      guards: specialty.constraints.guards,
      predictability: specialty.constraints.predictability,
      flexibility: specialty.constraints.flexibility,
      research: specialty.constraints.research,
    },
    populations: [...specialty.populations],
    outcomes: [...specialty.outcomes],
    environments: [...specialty.environments],
    systems: [...specialty.systems],
    rejectedSystems: [],
    answeredCount: 0,
  };
}

function optionScore(option: QuickOption, target: UserProfile): number {
  let score = 0;

  for (const [dimension, value] of Object.entries(option.scores ?? {})) {
    score += value * (target.numeric[dimension as keyof UserProfile['numeric']] ?? 2);
  }

  for (const [key, value] of Object.entries(option.constraintScores ?? {})) {
    score += value * (target.constraints[key as keyof UserProfile['constraints']] ?? 2);
  }

  return score;
}

function bestOption(question: QuickQuestion, target: UserProfile): QuickOption {
  const options = question.options ?? [];
  assert.ok(options.length > 0, `${question.id}: no tiene opciones.`);
  return options.reduce((best, option) =>
    optionScore(option, target) > optionScore(best, target) ? option : best,
  );
}

function answerForQuestion(question: QuickQuestion, target: UserProfile): AnswerRecord {
  switch (question.kind) {
    case 'forced': {
      if (question.matchDimension) {
        if (question.matchDimension === 'A10' && question.matchMode === 'reject') {
          const avoid = (question.options ?? []).find(
            (option) =>
              typeof option.matchValue === 'string' &&
              !target.systems.includes(option.matchValue as UserProfile['systems'][number]),
          );
          if (avoid) {
            return { questionId: question.id, optionId: avoid.id };
          }
        }

        const targetValues: string[] =
          question.matchDimension === 'A6'
            ? target.populations
            : question.matchDimension === 'A7'
              ? target.outcomes
              : question.matchDimension === 'A9'
                ? target.environments
                : target.systems;
        const match = (question.options ?? []).find(
          (option) =>
            typeof option.matchValue === 'string' &&
            targetValues.includes(option.matchValue),
        );
        if (match) {
          return { questionId: question.id, optionId: match.id };
        }
      }

      return {
        questionId: question.id,
        optionId: bestOption(question, target).id,
      };
    }

    case 'maxdiff': {
      const options = question.options ?? [];
      const sorted = [...options].sort(
        (first, second) => optionScore(second, target) - optionScore(first, target),
      );
      return {
        questionId: question.id,
        mostId: sorted[0]?.id,
        leastId: sorted[sorted.length - 1]?.id,
      };
    }

    case 'ratingGroup': {
      const values: Record<string, number | null> = {};
      for (const statement of question.statements ?? []) {
        const targetValue = target.constraints[statement.id] ?? 2;
        let raw = Math.max(1, Math.min(5, Math.round(targetValue) + 1));
        if (statement.reverse) raw = 6 - raw;
        values[statement.id] = raw;
      }
      return { questionId: question.id, values };
    }

    case 'multi': {
      if (question.matchDimension === 'A10') {
        const options = (question.options ?? []).filter(
          (option) =>
            typeof option.matchValue === 'string' &&
            target.systems.includes(option.matchValue as UserProfile['systems'][number]),
        );
        return {
          questionId: question.id,
          optionIds: options
            .slice(0, question.maxSelections ?? 2)
            .map((option) => option.id),
        };
      }

      return {
        questionId: question.id,
        optionIds: (question.options ?? [])
          .slice(0, question.maxSelections ?? 1)
          .map((option) => option.id),
      };
    }

    case 'rating':
      return {
        questionId: question.id,
        value: Math.max(1, Math.min(5, Math.round((question.dimension ? target.numeric[question.dimension] : 2) ?? 2) + 1)),
      };
  }
}

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

function randomAnswerForQuestion(question: QuickQuestion): AnswerRecord {
  switch (question.kind) {
    case 'forced':
      return {
        questionId: question.id,
        optionId: pick(question.options ?? []).id,
      };

    case 'maxdiff': {
      const options = shuffle(question.options ?? []);
      return {
        questionId: question.id,
        mostId: options[0]?.id,
        leastId: options[1]?.id,
      };
    }

    case 'multi': {
      const options = shuffle(question.options ?? []);
      const count = 1 + randomInt(Math.min(2, options.length));
      return {
        questionId: question.id,
        optionIds: options.slice(0, count).map((option) => option.id),
      };
    }

    case 'ratingGroup': {
      const values: Record<string, number | null> = {};
      for (const statement of question.statements ?? []) {
        values[statement.id] =
          question.allowUnknown && Math.random() < 0.15 ? null : 1 + randomInt(5);
      }
      return { questionId: question.id, values };
    }

    case 'rating':
      return { questionId: question.id, value: 1 + randomInt(5) };
  }
}

function pairGap(result: QuizResult, firstId: string, secondId: string): number {
  const first = result.matches.find((match) => match.specialty.id === firstId);
  const second = result.matches.find((match) => match.specialty.id === secondId);
  if (!first || !second) {
    throw new Error(`No se encontraron ${firstId} o ${secondId}.`);
  }
  return first.score - second.score;
}

function verifyBranchSelection(): void {
  const freeResult = scoreQuickQuiz(FREE_ANSWERS);
  const branch = selectBranchQuestions(freeResult);
  const axes = pickBranchAxes(freeResult);

  console.log('--- Selección de desempate ---');
  console.log(`Ejes: ${axes.join(', ')}`);
  console.log(`Ítems: ${branch.map((question) => question.id).join(', ')}`);

  assert.ok(
    branch.length >= 8 && branch.length <= 12,
    `El test extensivo debe seleccionar entre 8 y 12 ítems de desempate; hay ${branch.length}.`,
  );
  assert.equal(
    new Set(branch.map((question) => question.id)).size,
    branch.length,
    'No puede haber ítems duplicados.',
  );
  assert.ok(axes.length >= 1, 'Debe haber al menos un eje de desempate.');

  for (const question of branch) {
    assert.ok(question.branchAxis, `${question.id}: falta branchAxis.`);
    assert.ok(axes.includes(question.branchAxis!), `${question.id}: eje no seleccionado.`);
    assert.equal(question.weight, 2, `${question.id}: el peso de desempate debe ser 2.`);
    assert.ok(
      !QUICK_QUESTION_SET.questions.some((freeQuestion) => freeQuestion.id === question.id),
      `${question.id}: no puede repetirse del test gratuito.`,
    );
  }
}

function verifyExtensiveFlow(): void {
  const freeResult = scoreQuickQuiz(FREE_ANSWERS);
  const branch = selectBranchQuestions(freeResult);
  const combinedQuestionSet = buildScoringQuestionSet(QUICK_QUESTION_SET, branch);
  const displayQuestions = getExtensiveDisplayQuestions(branch);
  const surgery = ACTIVE_SPECIALTIES.find((specialty) => specialty.id === 'SURGERY');

  assert.ok(surgery, 'Falta la especialidad de referencia.');
  assert.equal(
    displayQuestions.length,
    18 + branch.length,
    `El bloque nuevo debe tener ${18 + branch.length} ítems (18 + ${branch.length}).`,
  );
  assert.equal(
    combinedQuestionSet.questions.length,
    QUICK_QUESTION_SET.questions.length + 18 + branch.length,
    'El recorrido completo debe incluir las 14 gratuitas, 18 centrales y los ítems de desempate.',
  );

  const allIds = combinedQuestionSet.questions.map((question) => question.id);
  assert.equal(new Set(allIds).size, allIds.length, 'Los ítems del recorrido completo no pueden repetirse.');

  const coreAnswers = EXTENSIVE_CORE_QUESTIONS.map((question) =>
    answerForQuestion(question, freeResult.profile),
  );
  const branchAnswers = branch.map((question) =>
    answerForQuestion(question, targetProfileFromSpecialty(surgery)),
  );

  const extensiveResult = scoreQuiz([...FREE_ANSWERS, ...coreAnswers, ...branchAnswers], {
    questionSet: combinedQuestionSet,
    specialties: ACTIVE_SPECIALTIES,
  });

  console.log('\n--- Flujo extensivo ---');
  console.log(
    `Confianza: ${freeResult.confidence.coverage}%   ${extensiveResult.confidence.coverage}% (${extensiveResult.confidence.level})`,
  );
  console.log(
    `Top 5: ${extensiveResult.top.map((match) => `${match.specialty.name} (${match.score.toFixed(1)})`).join(' | ')}`,
  );

  assert.equal(
    extensiveResult.profile.answeredCount,
    QUICK_QUESTION_SET.questions.length + 18 + branch.length,
    `Deben contarse ${QUICK_QUESTION_SET.questions.length + 18 + branch.length} respuestas.`,
  );
  assert.equal(extensiveResult.top.length, 5, 'El resultado extensivo debe mostrar top 5.');
  assert.ok(
    extensiveResult.confidence.coverage >= freeResult.confidence.coverage,
    'La confianza extensiva no puede ser menor que la gratuita.',
  );
  assert.equal(
    extensiveResult.confidence.coverage,
    100,
    'La cobertura extensiva debe ser completa.',
  );
  assert.ok(
    extensiveResult.matches.every((match) => Number.isFinite(match.score)),
    'Todas las puntuaciones deben ser finitas.',
  );
  assert.ok(
    [
      'SURGERY',
      'TRAUMATOLOGY',
      'THORACIC_SURGERY',
      'UROLOGY',
      'CARDIOVASCULAR_SURGERY',
      'VASCULAR',
      'PLASTIC_SURGERY',
      'NEUROSURGERY',
    ].includes(extensiveResult.top[0].specialty.id),
    'El resultado de un perfil quirúrgico debe encabezarse por una especialidad quirúrgica.',
  );
}

function verifyBranchFlip(): void {
  const freeResult = scoreQuickQuiz(FREE_ANSWERS);
  const branch = selectBranchQuestions(freeResult);
  const combinedQuestionSet = buildScoringQuestionSet(QUICK_QUESTION_SET, branch);
  const surgery = ACTIVE_SPECIALTIES.find((specialty) => specialty.id === 'SURGERY');
  const trauma = ACTIVE_SPECIALTIES.find((specialty) => specialty.id === 'TRAUMATOLOGY');

  assert.ok(surgery && trauma, 'Faltan Cirugía o Traumatología.');

  const coreAnswers = EXTENSIVE_CORE_QUESTIONS.map((question) =>
    answerForQuestion(question, freeResult.profile),
  );
  const surgeryBranch = branch.map((question) =>
    answerForQuestion(question, targetProfileFromSpecialty(surgery)),
  );
  const traumaBranch = branch.map((question) =>
    answerForQuestion(question, targetProfileFromSpecialty(trauma)),
  );

  const surgeryResult = scoreQuiz([...FREE_ANSWERS, ...coreAnswers, ...surgeryBranch], {
    questionSet: combinedQuestionSet,
    specialties: ACTIVE_SPECIALTIES,
  });
  const traumaResult = scoreQuiz([...FREE_ANSWERS, ...coreAnswers, ...traumaBranch], {
    questionSet: combinedQuestionSet,
    specialties: ACTIVE_SPECIALTIES,
  });

  const surgeryGapWhenSurgery = pairGap(surgeryResult, 'SURGERY', 'TRAUMATOLOGY');
  const surgeryGapWhenTrauma = pairGap(traumaResult, 'SURGERY', 'TRAUMATOLOGY');

  console.log('\n--- Desempate dirigido ---');
  console.log(`Ventaja de Cirugía respondiendo por Cirugía: ${surgeryGapWhenSurgery.toFixed(1)}`);
  console.log(`Ventaja de Cirugía respondiendo por Traumatología: ${surgeryGapWhenTrauma.toFixed(1)}`);

  assert.ok(
    surgeryGapWhenSurgery > surgeryGapWhenTrauma,
    'El desempate debe responder al perfil de cada especialidad.',
  );
}

function verifyExtensiveStability(): void {
  const freeResult = scoreQuickQuiz(FREE_ANSWERS);
  const branch = selectBranchQuestions(freeResult);
  const combinedQuestionSet = buildScoringQuestionSet(QUICK_QUESTION_SET, branch);
  const displayQuestions = getExtensiveDisplayQuestions(branch);
  const surgery = ACTIVE_SPECIALTIES.find((specialty) => specialty.id === 'SURGERY');

  assert.ok(surgery, 'Falta Cirugía.');

  const coreAnswers = EXTENSIVE_CORE_QUESTIONS.map((question) =>
    answerForQuestion(question, freeResult.profile),
  );
  const branchAnswers = branch.map((question) =>
    answerForQuestion(question, targetProfileFromSpecialty(surgery)),
  );
  const baselineAnswers = [...coreAnswers, ...branchAnswers];
  const baseline = scoreQuiz([...FREE_ANSWERS, ...baselineAnswers], {
    questionSet: combinedQuestionSet,
    specialties: ACTIVE_SPECIALTIES,
  });
  const baselineTop = baseline.top[0]?.specialty.id;

  assert.ok(baselineTop, 'El resultado extensivo debe tener un primer puesto.');

  const runs = 100;
  let stable = 0;

  for (let run = 0; run < runs; run += 1) {
    const question = pick(displayQuestions);
    const replacement = randomAnswerForQuestion(question);
    const perturbed = baselineAnswers
      .filter((answer) => answer.questionId !== question.id)
      .concat(replacement);

    const result = scoreQuiz([...FREE_ANSWERS, ...perturbed], {
      questionSet: combinedQuestionSet,
      specialties: ACTIVE_SPECIALTIES,
    });

    if (result.top[0]?.specialty.id === baselineTop) stable += 1;
  }

  const stability = stable / runs;
  console.log(`Estabilidad extensiva del primer puesto: ${(stability * 100).toFixed(1)}%`);
  assert.ok(
    stability >= 0.85,
    `Estabilidad extensiva insuficiente: ${(stability * 100).toFixed(1)}%.`,
  );
}

function main(): void {
  console.log('=== Verificación del test extensivo v1 ===');
  verifyBranchSelection();
  verifyExtensiveFlow();
  verifyBranchFlip();
  verifyExtensiveStability();
  console.log('\nOK: el test extensivo pasa las comprobaciones.');
}

main();

