import {
  ConstraintKey,
  DimensionDefinition,
  DimensionId,
  EnvironmentKey,
  NumericDimensionId,
  OutcomeKey,
  PopulationKey,
  SystemKey,
} from '../types';

export const NUMERIC_DIMENSIONS: NumericDimensionId[] = ['A1', 'A2', 'A3', 'A4', 'A5', 'A8'];

export const MATCH_DIMENSIONS: ('A6' | 'A7' | 'A9' | 'A10')[] = ['A6', 'A7', 'A9', 'A10'];

export const CONSTRAINT_DIMENSIONS: ('C1' | 'C2')[] = ['C1', 'C2'];

export const ALL_DIMENSIONS: DimensionId[] = [
  ...NUMERIC_DIMENSIONS,
  ...MATCH_DIMENSIONS,
  ...CONSTRAINT_DIMENSIONS,
];

export const DIMENSIONS: Record<DimensionId, DimensionDefinition> = {
  A1: {
    id: 'A1',
    label: 'Estilo cognitivo',
    shortLabel: 'Cognición',
    kind: 'numeric',
    description: 'Cómo prefieres enfrentarte a un problema clínico.',
    lowLabel: 'Resolución técnica',
    highLabel: 'Integración diagnóstica',
  },
  A2: {
    id: 'A2',
    label: 'Peso de los procedimientos',
    shortLabel: 'Procedimientos',
    kind: 'numeric',
    description: 'Cuánto espacio quieres que ocupen las técnicas y la intervención.',
    lowLabel: 'Sin procedimientos',
    highLabel: 'Procedimientos centrales',
  },
  A3: {
    id: 'A3',
    label: 'Ritmo asistencial',
    shortLabel: 'Ritmo',
    kind: 'numeric',
    description: 'Preferencia por lo urgente y cambiante frente a lo planificado.',
    lowLabel: 'Programado',
    highLabel: 'Urgente e imprevisible',
  },
  A4: {
    id: 'A4',
    label: 'Continuidad',
    shortLabel: 'Continuidad',
    kind: 'numeric',
    description: 'Seguimiento longitudinal frente a episodios concretos.',
    lowLabel: 'Episódico',
    highLabel: 'Seguimiento durante años',
  },
  A5: {
    id: 'A5',
    label: 'Contacto clínico',
    shortLabel: 'Contacto',
    kind: 'numeric',
    description: 'Intensidad de la relación directa con el paciente.',
    lowLabel: 'Contacto indirecto',
    highLabel: 'Relación directa intensa',
  },
  A6: {
    id: 'A6',
    label: 'Población diana',
    shortLabel: 'Población',
    kind: 'match',
    description: 'Edad y contexto de los pacientes con los que quieres trabajar.',
  },
  A7: {
    id: 'A7',
    label: 'Resultado buscado',
    shortLabel: 'Resultado',
    kind: 'match',
    description: 'Qué tipo de resultado profesional te gustaría producir.',
  },
  A8: {
    id: 'A8',
    label: 'Contenido científico',
    shortLabel: 'Ciencia',
    kind: 'numeric',
    description: 'Qué tipo de conocimiento quieres seguir estudiando.',
    lowLabel: 'Anatomía y estructura',
    highLabel: 'Mecanismos y biología molecular',
  },
  A9: {
    id: 'A9',
    label: 'Entorno de trabajo',
    shortLabel: 'Entorno',
    kind: 'match',
    description: 'Los espacios físicos y asistenciales donde te gustaría trabajar.',
  },
  A10: {
    id: 'A10',
    label: 'Sistema o área de contenido',
    shortLabel: 'Sistema',
    kind: 'match',
    description: 'El sistema, órgano o área de conocimiento que más te interesa estudiar.',
  },
  C1: {
    id: 'C1',
    label: 'Tolerancia emocional',
    shortLabel: 'Carga emocional',
    kind: 'constraint',
    description: 'Cuánto puedes sostener la incertidumbre, el sufrimiento y la muerte.',
  },
  C2: {
    id: 'C2',
    label: 'Condiciones laborales',
    shortLabel: 'Condiciones',
    kind: 'constraint',
    description: 'Qué prioridades vitales deben respetar tus condiciones de trabajo.',
  },
};

export const DIMENSION_LABELS: Record<DimensionId, string> = Object.fromEntries(
  ALL_DIMENSIONS.map((id) => [id, DIMENSIONS[id].label]),
) as Record<DimensionId, string>;

export const POPULATION_LABELS: Record<PopulationKey, string> = {
  neonatal: 'Recién nacidos',
  pediatric: 'Niños y adolescentes',
  adult: 'Adultos',
  elderly: 'Personas mayores',
  pregnancy: 'Embarazo y salud de la mujer',
  all: 'Todas las edades',
};

export const OUTCOME_LABELS: Record<OutcomeKey, string> = {
  cure: 'Curar o resolver un episodio',
  chronic: 'Controlar una enfermedad crónica',
  function: 'Restaurar función y calidad de vida',
  palliative: 'Aliviar sufrimiento y acompañar el final',
  prevention: 'Prevenir enfermedades',
  diagnosis: 'Dar un diagnóstico preciso',
  knowledge: 'Generar conocimiento',
  stabilize: 'Estabilizar una situación crítica',
};

export const ENVIRONMENT_LABELS: Record<EnvironmentKey, string> = {
  emergency: 'Urgencias / UCI',
  or: 'Quirófano / salas de procedimientos',
  ward: 'Planta de hospitalización',
  consultation: 'Consulta / ambulatorio',
  lab: 'Laboratorio',
  imaging: 'Imagen',
  home: 'Domicilio',
};

export const SYSTEM_LABELS: Record<SystemKey, string> = {
  cardiovascular: 'Cardiovascular',
  respiratory: 'Respiratorio',
  digestive: 'Digestivo',
  renal: 'Renal / urinario',
  hematologic: 'Hematológico',
  immune: 'Inmunitario',
  nervous: 'Nervioso',
  musculoskeletal: 'Musculoesquelético',
  endocrine: 'Endocrino / metabólico',
  skin: 'Piel',
  sensory: 'Órganos de los sentidos',
  reproductive: 'Reproductivo',
  mental: 'Salud mental',
  multisystem: 'Varios sistemas',
};

export const CONSTRAINT_KEYS: ConstraintKey[] = [
  'uncertainty',
  'suffering',
  'pressure',
  'death',
  'guards',
  'predictability',
  'flexibility',
  'research',
];

export const CONSTRAINT_LABELS: Record<ConstraintKey, string> = {
  uncertainty: 'Incertidumbre',
  suffering: 'Sufrimiento ajeno',
  pressure: 'Presión temporal',
  death: 'Final de la vida',
  guards: 'Guardias',
  predictability: 'Horario predecible',
  flexibility: 'Flexibilidad profesional',
  research: 'Investigación y docencia',
};

export const CONSTRAINT_GROUP: Record<ConstraintKey, 'C1' | 'C2'> = {
  uncertainty: 'C1',
  suffering: 'C1',
  pressure: 'C1',
  death: 'C1',
  guards: 'C2',
  predictability: 'C2',
  flexibility: 'C2',
  research: 'C2',
};
