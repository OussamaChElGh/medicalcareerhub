import fs from 'fs';
import { ACTIVE_SPECIALTIES } from '../src/data/specialties';
import {
  ENVIRONMENT_LABELS,
  NUMERIC_DIMENSIONS,
  OUTCOME_LABELS,
  POPULATION_LABELS,
  SYSTEM_LABELS,
} from '../src/data/dimensions';
import { SpecialtyProfile } from '../src/types';

function numericLine(specialty: SpecialtyProfile): string {
  return NUMERIC_DIMENSIONS.map((dimension) => `${dimension}:${specialty.numeric[dimension]}`).join(
    ', ',
  );
}

function labelList<T extends string>(values: T[], labels: Record<T, string>): string {
  return values.map((value) => labels[value] ?? value).join(', ');
}

function detail(specialty: SpecialtyProfile): string {
  const evidence =
    specialty.evidence && Object.keys(specialty.evidence).length > 0
      ? Object.entries(specialty.evidence)
          .map(([dimension, text]) => `- **${dimension}:** ${text}`)
          .join('\n')
      : '- Sin justificación registrada todavía.';

  return [
    `### ${specialty.name} (\`${specialty.id}\`)`,
    '',
    `- **Tipo:** ${specialty.type}`,
    `- **Familia:** ${specialty.family}`,
    `- **Estado:** ${specialty.status}`,
    `- **Descripción:** ${specialty.description}`,
    `- **Perfil:** ${numericLine(specialty)}`,
    `- **Población:** ${labelList(specialty.populations, POPULATION_LABELS)}`,
    `- **Resultados:** ${labelList(specialty.outcomes, OUTCOME_LABELS)}`,
    `- **Entornos:** ${labelList(specialty.environments, ENVIRONMENT_LABELS)}`,
    `- **Sistemas:** ${labelList(specialty.systems, SYSTEM_LABELS)}`,
    `- **Restricciones:** ${Object.entries(specialty.constraints)
      .map(([key, value]) => `${key}:${value}`)
      .join(', ')}`,
    `- **Alternativas:** ${specialty.alternatives.join(', ')}`,
    `- **Fuente:** ${specialty.source ?? 'No registrada'}`,
    '',
    '**Evidencia:**',
    evidence,
    '',
  ].join('\n');
}

function main(): void {
  const byType = ACTIVE_SPECIALTIES.reduce<Record<string, number>>((counts, specialty) => {
    counts[specialty.type] = (counts[specialty.type] ?? 0) + 1;
    return counts;
  }, {});

  const reviewCounts = ACTIVE_SPECIALTIES.reduce<Record<string, number>>(
    (counts, specialty) => {
      const status = specialty.reviewStatus ?? 'legacy';
      counts[status] = (counts[status] ?? 0) + 1;
      return counts;
    },
    {},
  );

  const lines: string[] = [
    '# Catálogo de especialidades v1',
    '',
    'Documento generado automáticamente desde `src/data/specialties.ts`. No editar a mano.',
    '',
    '## Resumen',
    '',
    `- Total: ${ACTIVE_SPECIALTIES.length} fichas.`,
    `- MIR: ${byType.MIR ?? 0}.`,
    `- ACE: ${byType.ACE ?? 0}.`,
    `- Áreas: ${byType.AREA ?? 0}.`,
    `- Perfiles preliminares: ${reviewCounts.draft ?? 0}.`,
    '',
    '## Fichas',
    '',
    ...ACTIVE_SPECIALTIES.map(detail),
  ];

  fs.mkdirSync('docs', { recursive: true });
  fs.writeFileSync('docs/catalog-51.md', lines.join('\n'), 'utf8');
  console.log('Generado docs/catalog-51.md');
}

main();
