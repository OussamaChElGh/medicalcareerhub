import assert from 'node:assert/strict';
import { ACTIVE_SPECIALTIES } from '../src/data/specialties';
import { NUMERIC_DIMENSIONS } from '../src/data/dimensions';
import { QUICK_QUESTION_SET } from '../src/data/questions.quick';
import { scoreQuickQuiz } from '../src/lib/scoring';
import { AnswerRecord, QuickOption, QuickQuestion, SpecialtyProfile } from '../src/types';

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
          question.allowUnknown && Math.random() < 0.1 ? null : 1 + randomInt(5);
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

function verifyFields(): void {
  const ids = new Set<string>();
  const typeCounts: Record<string, number> = {};
  const reviewCounts: Record<string, number> = {};
  let withAllPopulation = 0;
  let missingEvidence = 0;

  for (const specialty of ACTIVE_SPECIALTIES) {
    assert.ok(!ids.has(specialty.id), `ID duplicado: ${specialty.id}.`);
    ids.add(specialty.id);

    assert.ok(specialty.name.trim().length > 0, `${specialty.id}: falta el nombre.`);
    assert.ok(
      specialty.description.trim().length > 0,
      `${specialty.id}: falta la descripción.`,
    );
    assert.ok(
      ['MIR', 'ACE', 'AREA'].includes(specialty.type),
      `${specialty.id}: tipo inválido.`,
    );
    assert.ok(specialty.family.trim().length > 0, `${specialty.id}: falta la familia.`);
    assert.ok(
      specialty.populations.length > 0,
      `${specialty.id}: faltan poblaciones.`,
    );
    assert.ok(specialty.outcomes.length > 0, `${specialty.id}: faltan resultados.`);
    assert.ok(
      specialty.environments.length > 0,
      `${specialty.id}: faltan entornos.`,
    );
    assert.ok(
      specialty.systems.length > 0,
      `${specialty.id}: faltan sistemas.`,
    );
    assert.ok(
      specialty.alternatives.length >= 2,
      `${specialty.id}: se esperaban al menos 2 alternativas.`,
    );

    if (specialty.populations.includes('all')) withAllPopulation += 1;

    typeCounts[specialty.type] = (typeCounts[specialty.type] ?? 0) + 1;
    const reviewStatus = specialty.reviewStatus ?? 'legacy';
    reviewCounts[reviewStatus] = (reviewCounts[reviewStatus] ?? 0) + 1;

    for (const dimension of NUMERIC_DIMENSIONS) {
      const value = specialty.numeric[dimension];
      assert.ok(
        Number.isInteger(value) && value >= 0 && value <= 4,
        `${specialty.id}: ${dimension} debe ser un entero 0-4.`,
      );
      if (value >= 3 && !specialty.evidence?.[dimension]) {
        missingEvidence += 1;
      }
    }

    for (const [key, value] of Object.entries(specialty.constraints)) {
      assert.ok(
        Number.isInteger(value) && value >= 0 && value <= 4,
        `${specialty.id}: la restricción ${key} debe ser un entero 0-4.`,
      );
    }
  }

  assert.equal(ACTIVE_SPECIALTIES.length, 51, 'El catálogo debe tener 51 fichas.');
  assert.equal(ids.size, 51, 'Debe haber 51 IDs únicos.');

  console.log('=== Catálogo ===');
  console.log(`Fichas: ${ACTIVE_SPECIALTIES.length}`);
  console.log('Tipos:', typeCounts);
  console.log('Estado de revisión:', reviewCounts);
  console.log(`Fichas con población "all": ${withAllPopulation}`);
  if (missingEvidence > 0) {
    console.log(
      `Aviso: ${missingEvidence} valores ≥ 3 no tienen justificación en "evidence".`,
    );
  }
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
    if (winner) wins[winner.specialty.id] = (wins[winner.specialty.id] ?? 0) + 1;
    for (const match of result.top) {
      appearances[match.specialty.id] = (appearances[match.specialty.id] ?? 0) + 1;
    }
  }

  const sorted = Object.entries(wins).sort((first, second) => second[1] - first[1]);
  const maxId = sorted[0][0];
  const maxRate = sorted[0][1] / runs;

  console.log('\n=== Reparto aleatorio (5000 perfiles) ===');
  console.log('Especialidad          Top 1    Top 5');
  for (const [id, count] of sorted) {
    console.log(
      `${id.padEnd(22)} ${((count / runs) * 100).toFixed(1).padStart(6)}% ${((appearances[id] / runs) * 100).toFixed(1).padStart(6)}%`,
    );
  }

  const unreachable = Object.entries(appearances).filter(([, count]) => count === 0);
  assert.equal(
    unreachable.length,
    0,
    `Especialidades nunca presentes en el top 5: ${unreachable.map(([id]) => id).join(', ')}.`,
  );

  assert.ok(
    maxRate < 0.35,
    `Posible sesgo estructural: ${maxId} gana el ${(maxRate * 100).toFixed(1)}% de los perfiles aleatorios.`,
  );
}

function targetConstraint(specialty: SpecialtyProfile, key: string): number {
  if (['uncertainty', 'suffering', 'pressure', 'death'].includes(key)) {
    return specialty.constraints.emotionalLoad;
  }
  return specialty.constraints[key as keyof SpecialtyProfile['constraints']] ?? 2;
}

/**
 * Simula a un usuario cuyas preferencias se parecen al perfil de la especialidad.
 * Se elige la opción más cercana, no la que suma más puntos: el producto de puntos
 * favorecía opciones con puntuaciones altas en todas las dimensiones.
 */
function optionDistance(option: QuickOption, specialty: SpecialtyProfile): number {
  let distance = 0;
  let count = 0;

  for (const [dimension, score] of Object.entries(option.scores ?? {})) {
    const target = specialty.numeric[dimension as keyof SpecialtyProfile['numeric']];
    if (target === undefined) continue;
    distance += Math.abs(score - target);
    count += 1;
  }

  for (const [key, score] of Object.entries(option.constraintScores ?? {})) {
    distance += Math.abs(score - targetConstraint(specialty, key));
    count += 1;
  }

  return count === 0 ? 99 : distance / count;
}

function targetAnswer(question: QuickQuestion, specialty: SpecialtyProfile): AnswerRecord {
  if (question.kind === 'forced') {
    const options = question.options ?? [];

    if (question.matchDimension === 'A10' && question.matchMode === 'reject') {
      const avoid = options.find(
        (option) =>
          typeof option.matchValue === 'string' &&
          !specialty.systems.includes(option.matchValue as SpecialtyProfile['systems'][number]),
      );
      if (avoid) return { questionId: question.id, optionId: avoid.id };
    }

    if (question.matchDimension) {
      const targetValues: string[] =
        question.matchDimension === 'A6'
          ? specialty.populations
          : question.matchDimension === 'A7'
            ? specialty.outcomes
            : question.matchDimension === 'A9'
              ? specialty.environments
              : specialty.systems;
      const match = options.find(
        (option) =>
          typeof option.matchValue === 'string' &&
          targetValues.includes(option.matchValue),
      );
      if (match) return { questionId: question.id, optionId: match.id };
    }

    const best = options.reduce((first, second) =>
      optionDistance(first, specialty) <= optionDistance(second, specialty) ? first : second,
    );
    return { questionId: question.id, optionId: best.id };
  }

  if (question.kind === 'maxdiff') {
    const options = [...(question.options ?? [])].sort(
      (first, second) => optionDistance(first, specialty) - optionDistance(second, specialty),
    );
    return {
      questionId: question.id,
      mostId: options[0]?.id,
      leastId: options[options.length - 1]?.id,
    };
  }

  if (question.kind === 'multi') {
    let targetValues: string[] = [];
    if (question.matchDimension === 'A6') targetValues = specialty.populations;
    else if (question.matchDimension === 'A7') targetValues = specialty.outcomes;
    else if (question.matchDimension === 'A9') targetValues = specialty.environments;
    else if (question.matchDimension === 'A10') targetValues = specialty.systems;

    const options = (question.options ?? [])
      .filter((option) => targetValues.includes(option.matchValue ?? ''))
      .slice(0, question.maxSelections ?? 2);

    return { questionId: question.id, optionIds: options.map((option) => option.id) };
  }

  if (question.kind === 'ratingGroup') {
    const values: Record<string, number | null> = {};
    for (const statement of question.statements ?? []) {
      const target = targetConstraint(specialty, statement.id);
      values[statement.id] = statement.reverse
        ? 1 + (4 - Math.round(target))
        : 1 + Math.round(target);
    }
    return { questionId: question.id, values };
  }

  return {
    questionId: question.id,
    value: 1 + Math.round(specialty.numeric[question.dimension ?? 'A1'] ?? 2),
  };
}

function verifyCoherentProfiles(): void {
  const rows = ACTIVE_SPECIALTIES.map((specialty) => {
    const answers = QUICK_QUESTION_SET.questions.map((question) =>
      targetAnswer(question, specialty),
    );
    const result = scoreQuickQuiz(answers);
    const rank = result.matches.findIndex(
      (match) => match.specialty.id === specialty.id,
    ) + 1;

    return {
      id: specialty.id,
      type: specialty.type,
      rank,
      top1: result.top[0]?.specialty.id ?? '—',
    };
  }).sort((first, second) => second.rank - first.rank);

  console.log('\n=== Alcanzabilidad con perfiles coherentes ===');
  console.log('Especialidad          Tipo  Puesto  Top 1');
  for (const row of rows) {
    console.log(
      `${row.id.padEnd(22)} ${row.type.padEnd(5)} ${String(row.rank).padStart(6)}  ${row.top1}`,
    );
  }

  const top5Count = rows.filter((row) => row.rank <= 5).length;
  const top10Count = rows.filter((row) => row.rank <= 10).length;
  const outside5 = rows.filter((row) => row.rank > 5);
  const nonMirOutside10 = rows.filter((row) => row.type !== 'MIR' && row.rank > 10);

  console.log(`\nTop 5 con perfil coherente: ${top5Count}/${rows.length}`);
  console.log(`Top 10 con perfil coherente: ${top10Count}/${rows.length}`);
  if (outside5.length > 0) {
    console.log(
      `Fuera del top 5: ${outside5.map((row) => `${row.id}(${row.rank})`).join(', ')}.`,
    );
  }

  assert.equal(
    top5Count,
    rows.length,
    `Se esperaban las ${rows.length} especialidades en el top 5; hay ${top5Count}.`,
  );
  assert.equal(
    top10Count,
    rows.length,
    `Se esperaban las ${rows.length} especialidades en el top 10; hay ${top10Count}.`,
  );
  assert.equal(
    nonMirOutside10.length,
    0,
    `Las ACE/áreas deben estar en el top 10: ${nonMirOutside10
      .map((row) => `${row.id}(${row.rank})`)
      .join(', ')}.`,
  );

  console.log(
    'Nota: con perfiles coherentes, las 51 son alcanzables; en perfiles ambiguos o aleatorios el test gratuito sigue siendo un cribado.',
  );
}

function main(): void {
  console.log('=== Verificación del catálogo de 51 especialidades ===');
  verifyFields();
  verifyReachability();
  verifyCoherentProfiles();
  console.log('\nOK: el catálogo pasa las comprobaciones.');
}

main();
