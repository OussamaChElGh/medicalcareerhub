import { QUICK_QUESTION_SET } from '../src/data/questions.quick';
import { EXTENSIVE_CORE_QUESTIONS, EXTENSIVE_BRANCH_BANK } from '../src/data/questions.extensive';
import { NUMERIC_DIMENSIONS } from '../src/data/dimensions';
import { NumericDimensionId, QuickQuestion } from '../src/types';

interface AuditSet {
  label: string;
  questions: QuickQuestion[];
}

const SETS: AuditSet[] = [
  { label: 'Gratuito', questions: QUICK_QUESTION_SET.questions },
  { label: 'Central', questions: EXTENSIVE_CORE_QUESTIONS },
  { label: 'Desempate', questions: EXTENSIVE_BRANCH_BANK },
];

function scoreRange(question: QuickQuestion, dimension: NumericDimensionId): number | null {
  const values = (question.options ?? [])
    .map((option) => option.scores?.[dimension])
    .filter((value): value is number => typeof value === 'number');

  if (values.length < 2) return null;
  return Math.max(...values) - Math.min(...values);
}

function optionTotal(question: QuickQuestion, optionIndex: number): number {
  const option = question.options?.[optionIndex];
  if (!option) return 0;
  return Object.values(option.scores ?? {}).reduce((sum, value) => sum + value, 0);
}

function auditSet(set: AuditSet): number {
  console.log(`\n=== ${set.label} (${set.questions.length} ítems) ===`);

  const coverage: Record<string, number> = {};
  for (const dimension of NUMERIC_DIMENSIONS) coverage[dimension] = 0;

  let critical = 0;

  for (const question of set.questions) {
    if (question.kind === 'ratingGroup' || question.kind === 'rating' || question.kind === 'multi') {
      continue;
    }

    for (const dimension of NUMERIC_DIMENSIONS) {
      const range = scoreRange(question, dimension);
      if (range !== null && range >= 1) coverage[dimension] += 1;
    }

    const target = question.targetDimension ?? question.branchAxis;
    if (target && (NUMERIC_DIMENSIONS as string[]).includes(target)) {
      const range = scoreRange(question, target as NumericDimensionId);
      if (range === null || range < 1) {
        critical += 1;
        console.log(
          `CRÍTICO ${question.id}: el eje objetivo ${target} no discrimina (rango ${range ?? 'sin datos'}).`,
        );
      }
    }
  }

  console.log(
    'Cobertura:',
    NUMERIC_DIMENSIONS.map((dimension) => `${dimension}=${coverage[dimension]}`).join(' · '),
  );

  for (const question of set.questions) {
    const options = question.options ?? [];
    if (options.length < 2) continue;

    const totals = options.map((_, index) => optionTotal(question, index));
    const range = Math.max(...totals) - Math.min(...totals);
    if (range >= 6) {
      console.log(
        `Deseabilidad ${question.id}: totales ${totals.join('/')} (rango ${range}).`,
      );
    }
  }

  return critical;
}

function auditMatchCoverage(): void {
  const matchCounts = { A6: 0, A7: 0, A9: 0, A10: 0 };
  for (const question of [...EXTENSIVE_CORE_QUESTIONS, ...EXTENSIVE_BRANCH_BANK]) {
    if (question.matchDimension) matchCounts[question.matchDimension] += 1;
  }

  console.log('\n=== Refuerzo de match ===');
  console.log(
    `A6 población=${matchCounts.A6} · A7 resultado=${matchCounts.A7} · A9 entorno=${matchCounts.A9} · A10 sistemas=${matchCounts.A10}`,
  );

  const branchAxes: Record<string, number> = {};
  for (const question of EXTENSIVE_BRANCH_BANK) {
    if (!question.branchAxis) continue;
    branchAxes[question.branchAxis] = (branchAxes[question.branchAxis] ?? 0) + 1;
  }
  console.log('Banco de desempate:', branchAxes);

  const rejectionItems = EXTENSIVE_CORE_QUESTIONS.filter(
    (question) => question.kind === 'maxdiff',
  );
  console.log(`Ítems de rechazo (maxdiff) en el central: ${rejectionItems.length}`);
}

function main(): void {
  console.log('=== Auditoría del banco de preguntas v1 ===');

  let critical = 0;
  for (const set of SETS) {
    critical += auditSet(set);
  }
  auditMatchCoverage();

  console.log('\n=== Resultado ===');
  if (critical > 0) {
    console.log(`Hay ${critical} ítem(s) con el eje objetivo sin discriminación.`);
    process.exit(1);
  }

  console.log('OK: todos los ítems con eje objetivo discriminan al menos 1 punto.');
}

main();
