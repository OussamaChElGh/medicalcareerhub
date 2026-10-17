import fs from 'fs';
import { QUICK_QUESTION_SET } from '../src/data/questions.quick';
import { EXTENSIVE_CORE_QUESTIONS, EXTENSIVE_BRANCH_BANK } from '../src/data/questions.extensive';
import { NUMERIC_DIMENSIONS } from '../src/data/dimensions';
import type { PilotSession } from '../src/lib/pilot';
import { AnswerRecord, QuickQuestion } from '../src/types';

const ALL_QUESTIONS: QuickQuestion[] = [
  ...QUICK_QUESTION_SET.questions,
  ...EXTENSIVE_CORE_QUESTIONS,
  ...EXTENSIVE_BRANCH_BANK,
];

function findAnswer(session: PilotSession, questionId: string): AnswerRecord | undefined {
  return session.answers.find((answer) => answer.questionId === questionId);
}

function hasAnswer(session: PilotSession, question: QuickQuestion): boolean {
  const answer = findAnswer(session, question.id);
  if (!answer || answer.skipped) return false;

  switch (question.kind) {
    case 'forced':
      return Boolean(answer.optionId);
    case 'maxdiff':
      return Boolean(answer.mostId || answer.leastId);
    case 'multi':
      return Array.isArray(answer.optionIds) && answer.optionIds.length > 0;
    case 'ratingGroup':
      return Boolean(answer.values && Object.keys(answer.values).length > 0);
    case 'rating':
      return typeof answer.value === 'number';
  }
}

function answerDistribution(
  sessions: PilotSession[],
  question: QuickQuestion,
): { shown: number; counts: Map<string, number> } {
  const counts = new Map<string, number>();
  let shown = 0;

  for (const session of sessions) {
    const answer = findAnswer(session, question.id);
    if (!answer || answer.skipped) continue;

    if (question.kind === 'forced' && answer.optionId) {
      shown += 1;
      counts.set(answer.optionId, (counts.get(answer.optionId) ?? 0) + 1);
    }

    if (question.kind === 'maxdiff') {
      if (answer.mostId) {
        shown += 1;
        counts.set(`most:${answer.mostId}`, (counts.get(`most:${answer.mostId}`) ?? 0) + 1);
      }
      if (answer.leastId) {
        counts.set(`least:${answer.leastId}`, (counts.get(`least:${answer.leastId}`) ?? 0) + 1);
      }
    }

    if (question.kind === 'multi' && answer.optionIds) {
      shown += 1;
      for (const optionId of answer.optionIds) {
        counts.set(optionId, (counts.get(optionId) ?? 0) + 1);
      }
    }

    if (question.kind === 'ratingGroup' && answer.values) {
      shown += 1;
      for (const [statementId, value] of Object.entries(answer.values)) {
        const key = `${statementId}:${value === null ? 'ns' : value}`;
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
    }

    if (question.kind === 'rating' && typeof answer.value === 'number') {
      shown += 1;
      counts.set(String(answer.value), (counts.get(String(answer.value)) ?? 0) + 1);
    }
  }

  return { shown, counts };
}

function pearson(xs: number[], ys: number[]): number {
  const n = Math.min(xs.length, ys.length);
  if (n < 3) return 0;

  const meanX = xs.reduce((sum, value) => sum + value, 0) / n;
  const meanY = ys.reduce((sum, value) => sum + value, 0) / n;

  let numerator = 0;
  let denominatorX = 0;
  let denominatorY = 0;

  for (let index = 0; index < n; index += 1) {
    const dx = xs[index] - meanX;
    const dy = ys[index] - meanY;
    numerator += dx * dy;
    denominatorX += dx * dx;
    denominatorY += dy * dy;
  }

  if (denominatorX === 0 || denominatorY === 0) return 0;
  return numerator / Math.sqrt(denominatorX * denominatorY);
}

function itemCorrelations(
  sessions: PilotSession[],
  question: QuickQuestion,
): { label: string; r: number; n: number }[] {
  const results: { label: string; r: number; n: number }[] = [];

  if (question.kind === 'forced' || question.kind === 'maxdiff') {
    for (const dimension of NUMERIC_DIMENSIONS) {
      const xs: number[] = [];
      const ys: number[] = [];

      for (const session of sessions) {
        const answer = findAnswer(session, question.id);
        if (!answer || answer.skipped) continue;
        const optionId =
          question.kind === 'forced'
            ? answer.optionId
            : answer.mostId ?? answer.leastId;
        const option = question.options?.find((candidate) => candidate.id === optionId);
        const score = option?.scores?.[dimension];
        const profileScore = session.profile.numeric[dimension];
        if (typeof score === 'number' && typeof profileScore === 'number') {
          xs.push(score);
          ys.push(profileScore);
        }
      }

      if (xs.length >= 10) {
        results.push({
          label: `${dimension}`,
          r: pearson(xs, ys),
          n: xs.length,
        });
      }
    }
  }

  const statements = question.statements ?? [];
  for (const statement of statements) {
    const xs: number[] = [];
    const ys: number[] = [];

    for (const session of sessions) {
      const answer = findAnswer(session, question.id);
      const raw = answer?.values?.[statement.id];
      const profileScore = session.profile.constraints[statement.id];
      if (typeof raw === 'number' && typeof profileScore === 'number') {
        const value = statement.reverse ? 6 - raw : raw;
        xs.push(value);
        ys.push(profileScore);
      }
    }

    if (xs.length >= 10) {
      results.push({
        label: `${statement.id}`,
        r: pearson(xs, ys),
        n: xs.length,
      });
    }
  }

  return results;
}

function main(): void {
  const args = process.argv.slice(2);
  const file = args.find((arg) => !arg.startsWith('--')) ?? 'data/pilot-sessions.json';
  const write = args.includes('--write');

  if (!fs.existsSync(file)) {
    console.log(`No existe ${file}.`);
    console.log('Exporta las sesiones desde el botón "Piloto" y guarda el JSON en esa ruta.');
    return;
  }

  const sessions = JSON.parse(fs.readFileSync(file, 'utf8')) as PilotSession[];
  if (!Array.isArray(sessions) || sessions.length === 0) {
    console.log('El archivo no contiene sesiones.');
    return;
  }

  const free = sessions.filter((session) => session.mode === 'free');
  const extensive = sessions.filter((session) => session.mode === 'extensive');
  const meanDuration = (items: PilotSession[]) =>
    items.length === 0
      ? 0
      : items.reduce((sum, session) => sum + session.durationMs, 0) / items.length / 1000;

  const lines: string[] = [
    '# Informe de piloto v1',
    '',
    `Generado: ${new Date().toISOString()}`,
    '',
    '## Resumen',
    '',
    `- Sesiones: ${sessions.length}`,
    `- Gratuitas: ${free.length}`,
    `- Extensivas: ${extensive.length}`,
    `- Duración media gratuita: ${meanDuration(free).toFixed(1)} s`,
    `- Duración media extensiva: ${meanDuration(extensive).toFixed(1)} s`,
    '',
    '## Top 1',
    '',
    '| Especialidad | Veces | % |',
    '|---|---:|---:|',
  ];

  const topCounts = new Map<string, number>();
  for (const session of sessions) {
    const top = session.matches[0];
    if (top) topCounts.set(top.name, (topCounts.get(top.name) ?? 0) + 1);
  }

  const sortedTop = [...topCounts.entries()].sort((a, b) => b[1] - a[1]);
  for (const [name, count] of sortedTop) {
    lines.push(`| ${name} | ${count} | ${((count / sessions.length) * 100).toFixed(1)} % |`);
  }
  lines.push('');

  lines.push('## Confianza', '', '| Nivel | Veces | % |', '|---|---:|---:|');
  const confidenceCounts = new Map<string, number>();
  for (const session of sessions) {
    confidenceCounts.set(
      session.confidence.level,
      (confidenceCounts.get(session.confidence.level) ?? 0) + 1,
    );
  }
  for (const [level, count] of confidenceCounts) {
    lines.push(`| ${level} | ${count} | ${((count / sessions.length) * 100).toFixed(1)} % |`);
  }
  lines.push('');

  lines.push('## Ítems problemáticos');
  lines.push('');
  const flags: string[] = [];

  for (const question of ALL_QUESTIONS) {
    const sessionsForQuestion = sessions.filter((session) => hasAnswer(session, question));
    if (sessionsForQuestion.length === 0) continue;

    const { shown, counts } = answerDistribution(sessionsForQuestion, question);
    if (shown === 0) continue;

    const options = question.options ?? [];
    if (options.length > 0) {
      for (const option of options) {
        const count = counts.get(option.id) ?? 0;
        if (shown >= 10 && count === 0) {
          flags.push(`${question.id}: la opción ${option.id} no fue elegida nunca (${shown} respuestas).`);
        }
        if (shown >= 10 && count / shown > 0.8) {
          flags.push(
            `${question.id}: la opción ${option.id} concentra el ${((count / shown) * 100).toFixed(
              0,
            )} % de las respuestas.`,
          );
        }
      }
    }

    for (const correlation of itemCorrelations(sessionsForQuestion, question)) {
      if (correlation.r < 0.2) {
        flags.push(
          `${question.id} · ${correlation.label}: correlación ítem-perfil baja (r=${correlation.r.toFixed(
            2,
          )}, n=${correlation.n}).`,
        );
      }
    }
  }

  if (flags.length === 0) {
    lines.push('Sin alertas con los criterios actuales.');
  } else {
    for (const flag of flags) lines.push(`- ${flag}`);
  }
  lines.push('');

  lines.push('## Notas');
  lines.push('');
  lines.push(
    '- Las correlaciones son una aproximación ítem-perfil, no una validación psicométrica.',
  );
  lines.push('- Las sesiones gratuitas no incluyen los ítems de desempate; por eso algunos ítems tienen menos respuestas.');
  lines.push('- Revisar los comentarios cualitativos antes de cambiar ítems.');

  const report = lines.join('\n');
  console.log(report);

  if (write) {
    fs.mkdirSync('docs', { recursive: true });
    fs.writeFileSync('docs/pilot-report.md', report, 'utf8');
    console.log('\nGenerado docs/pilot-report.md');
  }
}

main();
