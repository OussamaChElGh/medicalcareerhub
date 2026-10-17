import fs from 'fs';
import { QUICK_QUESTION_SET } from '../src/data/questions.quick';
import { EXTENSIVE_CORE_QUESTIONS, EXTENSIVE_BRANCH_BANK } from '../src/data/questions.extensive';
import { QuickOption, QuickQuestion } from '../src/types';

function formatScores(scores: Record<string, number> | undefined): string {
  if (!scores || Object.keys(scores).length === 0) return '—';
  return Object.entries(scores)
    .map(([key, value]) => `${key}:${value}`)
    .join(', ');
}

function optionRow(option: QuickOption): string {
  const parts = [option.text];

  if (option.scores) parts.push(`scores ${formatScores(option.scores)}`);
  if (option.constraintScores) {
    parts.push(`constraints ${formatScores(option.constraintScores)}`);
  }
  if (option.matchValue) parts.push(`match ${option.matchValue}`);

  return `| ${option.id} | ${parts.join(' · ')} |`;
}

function questionBlock(question: QuickQuestion): string {
  const lines: string[] = [];
  const target = question.branchAxis ?? question.targetDimension ?? question.matchDimension ?? '—';

  lines.push(`### ${question.id}`);
  lines.push('');
  lines.push(`**Pregunta:** ${question.prompt}`);
  if (question.help) lines.push(`**Ayuda:** ${question.help}`);
  lines.push('');
  lines.push(
    `**Bloque:** ${question.block ?? 'legacy'} · **Tipo:** ${question.kind} · **Eje:** ${target} · **Peso:** ${
      question.weight ?? 1
    }`,
  );
  lines.push('');

  if (question.options && question.options.length > 0) {
    lines.push('| Opción | Contenido |');
    lines.push('|---|---|');
    for (const option of question.options) {
      lines.push(optionRow(option));
    }
    lines.push('');
  }

  if (question.statements && question.statements.length > 0) {
    lines.push('| Afirmación | Dimensión | Inversa |');
    lines.push('|---|---|---|');
    for (const statement of question.statements) {
      lines.push(
        `| ${statement.id}: ${statement.text} | ${statement.dimension} | ${
          statement.reverse ? 'sí' : 'no'
        } |`,
      );
    }
    lines.push('');
  }

  return lines.join('\n');
}

function section(title: string, questions: QuickQuestion[]): string {
  const header = `## ${title} (${questions.length})\n`;
  return [header, ...questions.map(questionBlock)].join('\n');
}

function main(): void {
  const lines: string[] = [
    '# Banco de preguntas v1',
    '',
    'Documento generado automáticamente desde `src/data`. No editar a mano.',
    '',
    '## Resumen',
    '',
    `- Gratuito: ${QUICK_QUESTION_SET.questions.length} ítems.`,
    `- Central: ${EXTENSIVE_CORE_QUESTIONS.length} ítems.`,
    `- Desempate: ${EXTENSIVE_BRANCH_BANK.length} ítems.`,
    `- Banco total: ${QUICK_QUESTION_SET.questions.length + EXTENSIVE_CORE_QUESTIONS.length + EXTENSIVE_BRANCH_BANK.length} ítems.`,
    '',
    'Cada usuario responde 14 gratuitos + 18 centrales + 8–12 de desempate adaptativo = 40–44 ítems.',
    '',
    section('Test gratuito', QUICK_QUESTION_SET.questions),
    section('Bloque central', EXTENSIVE_CORE_QUESTIONS),
    section('Banco de desempate', EXTENSIVE_BRANCH_BANK),
  ];

  fs.mkdirSync('docs', { recursive: true });
  fs.writeFileSync('docs/question-bank-v1.md', lines.join('\n'), 'utf8');
  console.log('Generado docs/question-bank-v1.md');
}

main();
