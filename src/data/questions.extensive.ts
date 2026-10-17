import { QuickQuestion } from '../types';

/**
 * Banco extensivo v1.
 *
 * - Los 18 ítems centrales refuerzan los ejes del test gratuito.
 * - Los 16 ítems de desempate se seleccionan según el duelo del resultado gratuito.
 * - Ningún ítem repite literalmente una pregunta del test gratuito.
 */
export const EXTENSIVE_CORE_QUESTIONS: QuickQuestion[] = [
  {
    id: 'e1_no_response',
    order: 13,
    kind: 'forced',
    block: 'core',
    targetDimension: 'A1',
    prompt: 'Un paciente no mejora a pesar del tratamiento. ¿Qué haces primero?',
    options: [
      {
        id: 'e1_a',
        text: 'Revisar el diagnóstico y buscar explicaciones alternativas.',
        scores: { A1: 4, A8: 3, A4: 2, A5: 2 },
      },
      {
        id: 'e1_b',
        text: 'Ajustar el tratamiento y observar la respuesta.',
        scores: { A1: 3, A4: 3, A5: 3, A2: 1 },
      },
      {
        id: 'e1_c',
        text: 'Pedir pruebas complementarias dirigidas.',
        scores: { A1: 3, A8: 4, A5: 1, A2: 1 },
      },
      {
        id: 'e1_d',
        text: 'Revisar el contexto personal y social que puede estar influyendo.',
        scores: { A5: 4, A4: 3, A1: 2, A8: 1 },
      },
    ],
  },
  {
    id: 'e2_research_question',
    order: 14,
    kind: 'forced',
    block: 'core',
    targetDimension: 'A8',
    prompt: 'Si pudieras responder una pregunta de investigación, ¿cuál elegirías?',
    options: [
      {
        id: 'e2_a',
        text: '¿Qué mecanismo molecular explica la enfermedad?',
        scores: { A8: 4, A1: 4 },
      },
      {
        id: 'e2_b',
        text: '¿Qué tratamiento funciona mejor en ensayos clínicos?',
        scores: { A8: 3, A1: 3 },
      },
      {
        id: 'e2_c',
        text: '¿Qué factores de riesgo predisponen a la población?',
        scores: { A8: 3, A1: 2 },
      },
      {
        id: 'e2_d',
        text: '¿Cómo afecta la enfermedad a la calidad de vida?',
        scores: { A5: 4, A4: 3, A8: 1 },
      },
    ],
  },
  {
    id: 'e3_invasiveness',
    order: 15,
    kind: 'forced',
    block: 'core',
    targetDimension: 'A2',
    prompt: '¿Qué nivel de invasión te resultaría aceptable en tu trabajo diario?',
    options: [
      {
        id: 'e3_a',
        text: 'Cirugía mayor y procedimientos abiertos.',
        scores: { A2: 4, A1: 1, A3: 3 },
      },
      {
        id: 'e3_b',
        text: 'Procedimientos mínimamente invasivos y endoscópicos.',
        scores: { A2: 3, A1: 2, A3: 3 },
      },
      {
        id: 'e3_c',
        text: 'Técnicas diagnósticas y punciones.',
        scores: { A2: 2, A1: 3, A8: 3 },
      },
      {
        id: 'e3_d',
        text: 'Ninguna: prefiero el manejo médico.',
        scores: { A2: 0, A1: 4, A5: 3 },
      },
    ],
  },
  {
    id: 'e4_structural_problem',
    order: 16,
    kind: 'forced',
    block: 'core',
    targetDimension: 'A2',
    prompt: 'Ante un problema estructural, ¿qué solución te atrae más?',
    options: [
      {
        id: 'e4_a',
        text: 'Repararlo quirúrgicamente.',
        scores: { A2: 4, A1: 1, A3: 3 },
      },
      {
        id: 'e4_b',
        text: 'Resolverlo mediante un procedimiento guiado.',
        scores: { A2: 3, A1: 3, A3: 2 },
      },
      {
        id: 'e4_c',
        text: 'Rehabilitar la función.',
        scores: { A2: 1, A4: 4, A5: 3, A1: 2 },
      },
      {
        id: 'e4_d',
        text: 'Tratarlo médicamente y acompañar la adaptación.',
        scores: { A2: 0, A1: 4, A4: 3, A5: 3 },
      },
    ],
  },
  {
    id: 'e5_interruption',
    order: 17,
    kind: 'forced',
    block: 'core',
    targetDimension: 'A3',
    prompt: 'Estás en consulta y surge una urgencia. ¿Qué haces?',
    options: [
      {
        id: 'e5_a',
        text: 'La atiendo yo y retomo la consulta después.',
        scores: { A3: 4, A2: 2, A5: 3 },
      },
      {
        id: 'e5_b',
        text: 'La derivo al servicio correspondiente.',
        scores: { A3: 2, A1: 3, A5: 2 },
      },
      {
        id: 'e5_c',
        text: 'La incorporo a la agenda como prioridad.',
        scores: { A3: 3, A1: 3, A4: 3 },
      },
      {
        id: 'e5_d',
        text: 'Aviso al equipo y sigo con lo programado.',
        scores: { A3: 1, A5: 2, A4: 3, A2: 1 },
      },
    ],
  },
  {
    id: 'e6_workday',
    order: 18,
    kind: 'forced',
    block: 'core',
    targetDimension: 'A3',
    prompt: '¿Cómo te gustaría que fuera una jornada habitual?',
    options: [
      {
        id: 'e6_a',
        text: 'Guardias y urgencias imprevisibles.',
        scores: { A3: 4, A2: 2, A5: 2 },
      },
      {
        id: 'e6_b',
        text: 'Quirófano o sala de procedimientos programados.',
        scores: { A3: 1, A2: 4, A5: 1 },
      },
      {
        id: 'e6_c',
        text: 'Consulta con agenda y seguimiento.',
        scores: { A3: 1, A4: 4, A5: 4 },
      },
      {
        id: 'e6_d',
        text: 'Laboratorio o sala de diagnóstico.',
        scores: { A3: 0, A5: 0, A8: 4, A1: 3 },
      },
    ],
  },
  {
    id: 'e7_frustration',
    order: 19,
    kind: 'forced',
    block: 'core',
    targetDimension: 'A4',
    prompt: '¿Qué te frustraría más en tu trabajo?',
    options: [
      {
        id: 'e7_a',
        text: 'No ver la evolución de los pacientes.',
        scores: { A4: 4, A5: 3 },
      },
      {
        id: 'e7_b',
        text: 'Perder el contacto directo con ellos.',
        scores: { A5: 4, A4: 3 },
      },
      {
        id: 'e7_c',
        text: 'No resolver el episodio agudo.',
        scores: { A3: 4, A2: 3 },
      },
      {
        id: 'e7_d',
        text: 'No entender la causa del problema.',
        scores: { A1: 4, A8: 3 },
      },
    ],
  },
  {
    id: 'e8_bad_news',
    order: 20,
    kind: 'forced',
    block: 'core',
    targetDimension: 'A4',
    prompt: 'Si tuvieras que dar una mala noticia, ¿cómo preferirías hacerlo?',
    options: [
      {
        id: 'e8_a',
        text: 'En una relación de seguimiento, con tiempo.',
        scores: { A4: 4, A5: 4 },
        constraintScores: { death: 3, suffering: 3 },
      },
      {
        id: 'e8_b',
        text: 'En urgencias, con el equipo.',
        scores: { A3: 4, A5: 2 },
        constraintScores: { pressure: 3, suffering: 2 },
      },
      {
        id: 'e8_c',
        text: 'Derivando al especialista.',
        scores: { A5: 1, A4: 2, A3: 2 },
      },
      {
        id: 'e8_d',
        text: 'Con una entrevista estructurada y un protocolo.',
        scores: { A1: 3, A5: 3, A4: 2 },
      },
    ],
  },
  {
    id: 'e9_interview',
    order: 21,
    kind: 'forced',
    block: 'core',
    targetDimension: 'A5',
    prompt: '¿Qué parte de la entrevista clínica disfrutas más?',
    options: [
      {
        id: 'e9_a',
        text: 'Escuchar la historia personal.',
        scores: { A5: 4, A4: 3, A1: 2 },
      },
      {
        id: 'e9_b',
        text: 'Explorar físicamente al paciente.',
        scores: { A5: 3, A2: 3, A1: 2 },
      },
      {
        id: 'e9_c',
        text: 'Explicar el diagnóstico y el tratamiento.',
        scores: { A5: 4, A1: 3 },
      },
      {
        id: 'e9_d',
        text: 'Tomar decisiones técnicas a partir de los datos.',
        scores: { A5: 1, A1: 4, A8: 3 },
      },
    ],
  },
  {
    id: 'e10_rejection_activities',
    order: 22,
    kind: 'maxdiff',
    block: 'core',
    targetDimension: 'A5',
    prompt: '¿Qué actividad te atrae más y cuál menos?',
    help: 'La que descartes también cuenta: buscamos lo que no querrías hacer a diario.',
    options: [
      {
        id: 'e10_a',
        text: 'Hablar con familias en situaciones difíciles.',
        scores: { A5: 4, A4: 2, A1: 1, A2: 1, A3: 1, A8: 1 },
      },
      {
        id: 'e10_b',
        text: 'Realizar procedimientos manuales repetitivos.',
        scores: { A2: 4, A1: 1, A3: 2, A4: 1, A5: 1, A8: 0 },
      },
      {
        id: 'e10_c',
        text: 'Analizar datos y pruebas durante horas.',
        scores: { A8: 4, A1: 3, A5: 1, A2: 1, A3: 1, A4: 1 },
      },
      {
        id: 'e10_d',
        text: 'Gestionar urgencias imprevisibles.',
        scores: { A3: 4, A2: 2, A5: 2, A1: 2, A4: 1, A8: 1 },
      },
    ],
  },
  {
    id: 'e11_subject',
    order: 23,
    kind: 'forced',
    block: 'core',
    targetDimension: 'A8',
    prompt: '¿Qué asignatura te gustaría volver a estudiar?',
    options: [
      {
        id: 'e11_a',
        text: 'Anatomía.',
        scores: { A8: 1, A2: 3, A1: 2 },
      },
      {
        id: 'e11_b',
        text: 'Fisiología.',
        scores: { A8: 4, A1: 4, A5: 1 },
      },
      {
        id: 'e11_c',
        text: 'Bioquímica y biología molecular.',
        scores: { A8: 4, A1: 4 },
      },
      {
        id: 'e11_d',
        text: 'Epidemiología y salud pública.',
        scores: { A8: 3, A5: 2 },
      },
    ],
  },
  {
    id: 'e12_article',
    order: 24,
    kind: 'forced',
    block: 'core',
    targetDimension: 'A8',
    prompt: '¿Qué artículo leerías primero?',
    options: [
      {
        id: 'e12_a',
        text: 'Un mecanismo molecular.',
        scores: { A8: 4, A1: 4 },
      },
      {
        id: 'e12_b',
        text: 'Un ensayo clínico.',
        scores: { A8: 3, A1: 3 },
      },
      {
        id: 'e12_c',
        text: 'Una guía de práctica clínica.',
        scores: { A1: 3, A5: 3 },
      },
      {
        id: 'e12_d',
        text: 'Un estudio cualitativo sobre la experiencia del paciente.',
        scores: { A5: 4, A4: 3, A8: 1 },
      },
    ],
  },
  {
    id: 'e13_tolerance',
    order: 25,
    kind: 'ratingGroup',
    block: 'core',
    targetDimension: 'C1',
    allowUnknown: true,
    prompt: '¿Cuánto te costaría sostener estas situaciones?',
    help: '1 = me costaría muchísimo · 5 = no me costaría nada. Si no las has vivido, marca "No lo sé".',
    statements: [
      {
        id: 'uncertainty',
        text: 'Tomar decisiones sin tener todos los datos.',
        dimension: 'C1',
        reverse: true,
      },
      {
        id: 'death',
        text: 'Acompañar a un paciente que se está muriendo.',
        dimension: 'C1',
        reverse: true,
      },
      {
        id: 'suffering',
        text: 'Ver sufrir a un paciente sin poder aliviarlo del todo.',
        dimension: 'C1',
        reverse: true,
      },
      {
        id: 'pressure',
        text: 'Sostener una discusión difícil con un familiar.',
        dimension: 'C1',
        reverse: true,
      },
    ],
  },
  {
    id: 'e14_population',
    order: 26,
    kind: 'forced',
    block: 'core',
    matchDimension: 'A6',
    prompt: 'Si tuvieras que elegir una población principal, ¿cuál sería?',
    options: [
      {
        id: 'e14_a',
        text: 'Recién nacidos y niños.',
        matchValue: 'pediatric',
      },
      {
        id: 'e14_b',
        text: 'Adultos.',
        matchValue: 'adult',
      },
      {
        id: 'e14_c',
        text: 'Personas mayores.',
        matchValue: 'elderly',
      },
      {
        id: 'e14_d',
        text: 'Embarazo y salud de la mujer.',
        matchValue: 'pregnancy',
      },
    ],
  },
  {
    id: 'e15_sacrifice',
    order: 27,
    kind: 'ratingGroup',
    block: 'core',
    targetDimension: 'C2',
    prompt: '¿Qué estarías dispuesto a sacrificar por una especialidad que te apasione?',
    help: '1 = nada dispuesto · 5 = totalmente dispuesto.',
    statements: [
      { id: 'guards', text: 'Dormir menos por las guardias.', dimension: 'C2' },
      { id: 'predictability', text: 'Renunciar a un horario predecible.', dimension: 'C2' },
      { id: 'flexibility', text: 'Renunciar a la flexibilidad de horarios.', dimension: 'C2' },
      { id: 'research', text: 'Renunciar a tiempo de investigación.', dimension: 'C2' },
    ],
  },
  {
    id: 'e16_non_negotiable',
    order: 28,
    kind: 'forced',
    block: 'core',
    targetDimension: 'C2',
    prompt: '¿Qué condición no negociarías al elegir especialidad?',
    options: [
      {
        id: 'e16_a',
        text: 'Un horario predecible.',
        constraintScores: { predictability: 4, guards: 2 },
      },
      {
        id: 'e16_b',
        text: 'No hacer guardias.',
        constraintScores: { guards: 0, predictability: 3 },
      },
      {
        id: 'e16_c',
        text: 'Tener tiempo para investigar.',
        constraintScores: { research: 4, flexibility: 2 },
      },
      {
        id: 'e16_d',
        text: 'Poder combinar práctica pública y privada.',
        constraintScores: { flexibility: 4, research: 2 },
      },
    ],
  },
  {
    id: 'e17_outcome',
    order: 29,
    kind: 'forced',
    block: 'core',
    matchDimension: 'A7',
    prompt: 'Si solo pudieras conseguir uno de estos resultados, ¿cuál elegirías?',
    options: [
      {
        id: 'e17_a',
        text: 'Curar o resolver el episodio.',
        matchValue: 'cure',
      },
      {
        id: 'e17_b',
        text: 'Controlar una enfermedad crónica.',
        matchValue: 'chronic',
      },
      {
        id: 'e17_c',
        text: 'Restaurar la función y la calidad de vida.',
        matchValue: 'function',
      },
      {
        id: 'e17_d',
        text: 'Aliviar el sufrimiento y acompañar el final.',
        matchValue: 'palliative',
      },
    ],
  },
  {
    id: 'e18_environment',
    order: 30,
    kind: 'forced',
    block: 'core',
    matchDimension: 'A9',
    prompt: 'Si pudieras elegir un entorno principal, ¿cuál sería?',
    options: [
      {
        id: 'e18_a',
        text: 'Urgencias.',
        matchValue: 'emergency',
      },
      {
        id: 'e18_b',
        text: 'Quirófano o sala de procedimientos.',
        matchValue: 'or',
      },
      {
        id: 'e18_c',
        text: 'Consulta o planta.',
        matchValue: 'consultation',
      },
      {
        id: 'e18_d',
        text: 'Laboratorio o imagen.',
        matchValue: 'lab',
      },
    ],
  },
];

/**
 * Batería de desempate: dos ítems por eje.
 * El selector escoge 2 por cada eje decisivo (hasta 3 ejes).
 */
export const EXTENSIVE_BRANCH_BANK: QuickQuestion[] = [
  {
    id: 'ba1_pattern',
    order: 31,
    kind: 'forced',
    block: 'branch',
    branchAxis: 'A1',
    weight: 2,
    prompt: 'Ante un caso que no encaja en ningún patrón, ¿qué haces?',
    options: [
      {
        id: 'ba1_a',
        text: 'Busco el detalle que explica la excepción.',
        scores: { A1: 4, A8: 3 },
      },
      {
        id: 'ba1_b',
        text: 'Trato lo más urgente y reevalúo.',
        scores: { A3: 4, A1: 2 },
      },
      {
        id: 'ba1_c',
        text: 'Pido más pruebas.',
        scores: { A8: 4, A1: 3 },
      },
      {
        id: 'ba1_d',
        text: 'Consulto con un colega.',
        scores: { A5: 3, A1: 2 },
      },
    ],
  },
  {
    id: 'ba1_satisfaction',
    order: 32,
    kind: 'forced',
    block: 'branch',
    branchAxis: 'A1',
    weight: 2,
    prompt: '¿Qué te resulta más satisfactorio?',
    options: [
      {
        id: 'ba1_e',
        text: 'Entender el mecanismo.',
        scores: { A1: 4, A8: 4 },
      },
      {
        id: 'ba1_f',
        text: 'Resolver el caso.',
        scores: { A1: 3, A2: 3 },
      },
      {
        id: 'ba1_g',
        text: 'Ejecutar la técnica.',
        scores: { A2: 4, A1: 1 },
      },
      {
        id: 'ba1_h',
        text: 'Acompañar la evolución.',
        scores: { A4: 4, A5: 4 },
      },
    ],
  },
  {
    id: 'ba2_procedure_type',
    order: 33,
    kind: 'forced',
    block: 'branch',
    branchAxis: 'A2',
    weight: 2,
    prompt: '¿Qué procedimiento elegirías?',
    options: [
      {
        id: 'ba2_a',
        text: 'Cirugía abierta compleja.',
        scores: { A2: 4, A1: 1, A3: 3 },
      },
      {
        id: 'ba2_b',
        text: 'Cirugía mínimamente invasiva.',
        scores: { A2: 4, A1: 2, A8: 3 },
      },
      {
        id: 'ba2_c',
        text: 'Endoscopia diagnóstica o terapéutica.',
        scores: { A2: 3, A1: 2, A8: 3 },
      },
      {
        id: 'ba2_d',
        text: 'Técnica no invasiva.',
        scores: { A2: 1, A1: 4, A5: 3 },
      },
    ],
  },
  {
    id: 'ba2_morning',
    order: 34,
    kind: 'forced',
    block: 'branch',
    branchAxis: 'A2',
    weight: 2,
    prompt: '¿Cómo preferirías pasar la mañana?',
    options: [
      {
        id: 'ba2_e',
        text: 'En quirófano.',
        scores: { A2: 4 },
      },
      {
        id: 'ba2_f',
        text: 'En sala de procedimientos.',
        scores: { A2: 3, A1: 2 },
      },
      {
        id: 'ba2_g',
        text: 'En consulta.',
        scores: { A2: 1, A5: 4, A4: 3 },
      },
      {
        id: 'ba2_h',
        text: 'En laboratorio.',
        scores: { A2: 1, A5: 0, A8: 4 },
      },
    ],
  },
  {
    id: 'ba3_unpredictability',
    order: 35,
    kind: 'forced',
    block: 'branch',
    branchAxis: 'A3',
    weight: 2,
    prompt: '¿Qué nivel de imprevisibilidad prefieres?',
    options: [
      {
        id: 'ba3_a',
        text: 'Alta: cada día es distinto.',
        scores: { A3: 4, A2: 2 },
      },
      {
        id: 'ba3_b',
        text: 'Media: con picos ocasionales.',
        scores: { A3: 2, A1: 3 },
      },
      {
        id: 'ba3_c',
        text: 'Baja: agenda estable.',
        scores: { A3: 1, A4: 3 },
      },
      {
        id: 'ba3_d',
        text: 'Nula: todo programado.',
        scores: { A3: 0, A2: 3 },
      },
    ],
  },
  {
    id: 'ba3_priority',
    order: 36,
    kind: 'forced',
    block: 'branch',
    branchAxis: 'A3',
    weight: 2,
    prompt: '¿Qué haces cuando tienes dos tareas urgentes a la vez?',
    options: [
      {
        id: 'ba3_e',
        text: 'Priorizo por riesgo vital.',
        scores: { A3: 4, A1: 3 },
      },
      {
        id: 'ba3_f',
        text: 'Delego una.',
        scores: { A5: 3, A3: 2 },
      },
      {
        id: 'ba3_g',
        text: 'Las hago en paralelo.',
        scores: { A3: 3, A2: 2 },
      },
      {
        id: 'ba3_h',
        text: 'Sigo el protocolo.',
        scores: { A1: 3, A3: 1 },
      },
    ],
  },
  {
    id: 'ba4_followup',
    order: 37,
    kind: 'forced',
    block: 'branch',
    branchAxis: 'A4',
    weight: 2,
    prompt: '¿Qué tipo de seguimiento prefieres?',
    options: [
      {
        id: 'ba4_a',
        text: 'Durante años.',
        scores: { A4: 4, A5: 4 },
      },
      {
        id: 'ba4_b',
        text: 'Durante meses.',
        scores: { A4: 3, A5: 3 },
      },
      {
        id: 'ba4_c',
        text: 'Episodios concretos.',
        scores: { A4: 1, A5: 2, A3: 3 },
      },
      {
        id: 'ba4_d',
        text: 'Sin seguimiento.',
        scores: { A4: 0, A5: 1, A2: 2 },
      },
    ],
  },
  {
    id: 'ba4_satisfaction',
    order: 38,
    kind: 'forced',
    block: 'branch',
    branchAxis: 'A4',
    weight: 2,
    prompt: '¿Qué te daría más satisfacción?',
    options: [
      {
        id: 'ba4_e',
        text: 'Ver una mejoría lenta.',
        scores: { A4: 4, A5: 3 },
      },
      {
        id: 'ba4_f',
        text: 'Resolver una crisis.',
        scores: { A3: 4, A2: 3, A4: 1 },
      },
      {
        id: 'ba4_g',
        text: 'Diagnosticar algo raro.',
        scores: { A1: 4, A8: 3, A4: 1 },
      },
      {
        id: 'ba4_h',
        text: 'Operar con éxito.',
        scores: { A2: 4, A1: 1, A4: 0 },
      },
    ],
  },
  {
    id: 'ba5_relationship',
    order: 39,
    kind: 'forced',
    block: 'branch',
    branchAxis: 'A5',
    weight: 2,
    prompt: '¿Qué parte de la relación clínica prefieres?',
    options: [
      {
        id: 'ba5_a',
        text: 'Escuchar.',
        scores: { A5: 4, A4: 3 },
      },
      {
        id: 'ba5_b',
        text: 'Explorar.',
        scores: { A5: 3, A2: 3 },
      },
      {
        id: 'ba5_c',
        text: 'Explicar.',
        scores: { A5: 4, A1: 2 },
      },
      {
        id: 'ba5_d',
        text: 'Decidir.',
        scores: { A5: 1, A1: 4 },
      },
    ],
  },
  {
    id: 'ba5_contact_level',
    order: 40,
    kind: 'forced',
    block: 'branch',
    branchAxis: 'A5',
    weight: 2,
    prompt: '¿Cuánto contacto directo quieres?',
    options: [
      {
        id: 'ba5_e',
        text: 'Todo el día.',
        scores: { A5: 4, A4: 3 },
      },
      {
        id: 'ba5_f',
        text: 'Varias horas.',
        scores: { A5: 3, A4: 2 },
      },
      {
        id: 'ba5_g',
        text: 'Puntual.',
        scores: { A5: 1, A2: 3 },
      },
      {
        id: 'ba5_h',
        text: 'Casi ninguno.',
        scores: { A5: 0, A8: 4 },
      },
    ],
  },
  {
    id: 'ba8_science',
    order: 41,
    kind: 'forced',
    block: 'branch',
    branchAxis: 'A8',
    weight: 2,
    prompt: '¿Qué ciencia te atrae más?',
    options: [
      {
        id: 'ba8_a',
        text: 'Anatomía.',
        scores: { A8: 1, A2: 4 },
      },
      {
        id: 'ba8_b',
        text: 'Fisiología.',
        scores: { A8: 4, A1: 4 },
      },
      {
        id: 'ba8_c',
        text: 'Genética y biología molecular.',
        scores: { A8: 4, A1: 3 },
      },
      {
        id: 'ba8_d',
        text: 'Epidemiología y salud pública.',
        scores: { A8: 3 },
      },
    ],
  },
  {
    id: 'ba8_reading',
    order: 42,
    kind: 'forced',
    block: 'branch',
    branchAxis: 'A8',
    weight: 2,
    prompt: '¿Qué lectura elegirías?',
    options: [
      {
        id: 'ba8_e',
        text: 'Un caso clínico.',
        scores: { A8: 1, A1: 4, A5: 3 },
      },
      {
        id: 'ba8_f',
        text: 'Una revisión fisiopatológica.',
        scores: { A8: 4, A1: 4 },
      },
      {
        id: 'ba8_g',
        text: 'Un artículo molecular.',
        scores: { A8: 4, A1: 4 },
      },
      {
        id: 'ba8_h',
        text: 'Una guía de práctica clínica.',
        scores: { A8: 2, A5: 3, A1: 2 },
      },
    ],
  },
  {
    id: 'bc1_hardest',
    order: 43,
    kind: 'ratingGroup',
    block: 'branch',
    branchAxis: 'C1',
    weight: 2,
    allowUnknown: true,
    prompt: '¿Cuánto te costaría sostener estas situaciones?',
    help: '1 = muchísimo · 5 = nada. Si no las has vivido, marca "No lo sé".',
    statements: [
      {
        id: 'death',
        text: 'Acompañar el final de la vida.',
        dimension: 'C1',
        reverse: true,
      },
      {
        id: 'suffering',
        text: 'Ver sufrimiento que no se puede eliminar.',
        dimension: 'C1',
        reverse: true,
      },
      {
        id: 'pressure',
        text: 'Tomar decisiones con presión.',
        dimension: 'C1',
        reverse: true,
      },
      {
        id: 'uncertainty',
        text: 'Trabajar sin certezas.',
        dimension: 'C1',
        reverse: true,
      },
    ],
  },
  {
    id: 'bc1_conflict',
    order: 44,
    kind: 'forced',
    block: 'branch',
    branchAxis: 'C1',
    weight: 2,
    prompt: 'Un paciente te pide algo que consideras inadecuado. ¿Qué haces?',
    options: [
      {
        id: 'bc1_a',
        text: 'Escucho y negocio.',
        scores: { A5: 4, A1: 2 },
        constraintScores: { pressure: 3, suffering: 3 },
      },
      {
        id: 'bc1_b',
        text: 'Explico la evidencia.',
        scores: { A1: 3, A5: 3 },
        constraintScores: { pressure: 2, uncertainty: 1 },
      },
      {
        id: 'bc1_c',
        text: 'Derivo.',
        scores: { A5: 1, A4: 2 },
        constraintScores: { pressure: 1, uncertainty: 2 },
      },
      {
        id: 'bc1_d',
        text: 'Sigo el protocolo.',
        scores: { A1: 3, A3: 2 },
        constraintScores: { pressure: 2, uncertainty: 1 },
      },
    ],
  },
  {
    id: 'bc2_priority',
    order: 45,
    kind: 'forced',
    block: 'branch',
    branchAxis: 'C2',
    weight: 2,
    prompt: '¿Qué condición priorizarías?',
    options: [
      {
        id: 'bc2_a',
        text: 'Un horario predecible.',
        constraintScores: { predictability: 4, guards: 2 },
      },
      {
        id: 'bc2_b',
        text: 'No hacer guardias.',
        constraintScores: { guards: 0, predictability: 3 },
      },
      {
        id: 'bc2_c',
        text: 'Tiempo para investigar.',
        constraintScores: { research: 4, flexibility: 2 },
      },
      {
        id: 'bc2_d',
        text: 'Flexibilidad de ejercicio.',
        constraintScores: { flexibility: 4, research: 2 },
      },
    ],
  },
  {
    id: 'bc2_importance',
    order: 46,
    kind: 'ratingGroup',
    block: 'branch',
    branchAxis: 'C2',
    weight: 2,
    prompt: '¿Cuánto te importa cada condición?',
    help: '1 = nada · 5 = muchísimo.',
    statements: [
      { id: 'guards', text: 'Trabajar fines de semana y noches.', dimension: 'C2' },
      { id: 'predictability', text: 'Poder planificar vacaciones con antelación.', dimension: 'C2' },
      { id: 'flexibility', text: 'Tener un segundo trabajo o actividad privada.', dimension: 'C2' },
      { id: 'research', text: 'Publicar artículos y dar clase.', dimension: 'C2' },
    ],
  },
  {
    id: 'ba3_change',
    order: 47,
    kind: 'forced',
    block: 'branch',
    branchAxis: 'A3',
    weight: 2,
    prompt: '¿Cómo reaccionas a un cambio de última hora?',
    options: [
      {
        id: 'ba3_i',
        text: 'Me adapto y reorganizo el día.',
        scores: { A3: 4, A1: 2, A5: 2 },
      },
      {
        id: 'ba3_j',
        text: 'Priorizo lo que no puede esperar.',
        scores: { A3: 3, A1: 3, A4: 2 },
      },
      {
        id: 'ba3_k',
        text: 'Delego una parte del trabajo.',
        scores: { A3: 2, A5: 3, A4: 2 },
      },
      {
        id: 'ba3_l',
        text: 'Intento mantener el plan previsto.',
        scores: { A3: 0, A4: 3, A1: 2 },
      },
    ],
  },
  {
    id: 'ba4_no_return',
    order: 48,
    kind: 'forced',
    block: 'branch',
    branchAxis: 'A4',
    weight: 2,
    prompt: 'Un paciente no vuelve a la consulta. ¿Qué haces?',
    options: [
      {
        id: 'ba4_i',
        text: 'Intento localizarlo y entender qué ha pasado.',
        scores: { A4: 4, A5: 3, A1: 1 },
      },
      {
        id: 'ba4_j',
        text: 'Reviso si quedó alguna prueba pendiente.',
        scores: { A4: 3, A1: 3, A8: 2 },
      },
      {
        id: 'ba4_k',
        text: 'Lo derivo a otro profesional.',
        scores: { A4: 1, A5: 1, A3: 3 },
      },
      {
        id: 'ba4_l',
        text: 'Lo registro y sigo con el siguiente paciente.',
        scores: { A4: 0, A3: 3, A5: 1, A1: 1 },
      },
    ],
  },
  {
    id: 'ba8_biology',
    order: 49,
    kind: 'forced',
    block: 'branch',
    branchAxis: 'A8',
    weight: 2,
    prompt: '¿Qué nivel de biología te atrae más?',
    options: [
      {
        id: 'ba8_i',
        text: 'La anatomía macroscópica.',
        scores: { A8: 1, A2: 4, A1: 1 },
      },
      {
        id: 'ba8_j',
        text: 'La fisiología de los sistemas.',
        scores: { A8: 4, A1: 4, A5: 1 },
      },
      {
        id: 'ba8_k',
        text: 'La biología celular.',
        scores: { A8: 4, A1: 3, A2: 1 },
      },
      {
        id: 'ba8_l',
        text: 'La biología molecular y la genética.',
        scores: { A8: 4, A1: 3, A2: 0 },
      },
    ],
  },
  {
    id: 'ba1_ambiguity',
    order: 50,
    kind: 'forced',
    block: 'branch',
    branchAxis: 'A1',
    weight: 2,
    prompt: 'Cuando dos explicaciones son plausibles, ¿qué haces?',
    options: [
      {
        id: 'ba1_i',
        text: 'Busco la prueba que las distinga.',
        scores: { A1: 4, A8: 3, A2: 1 },
      },
      {
        id: 'ba1_j',
        text: 'Trato primero la más grave.',
        scores: { A3: 4, A1: 2, A2: 2 },
      },
      {
        id: 'ba1_k',
        text: 'Espero la evolución para decidir.',
        scores: { A4: 4, A1: 2, A5: 2 },
      },
      {
        id: 'ba1_l',
        text: 'Consulto con otro especialista.',
        scores: { A5: 3, A1: 2, A8: 1 },
      },
    ],
  },
  {
    id: 'ba1_mental_model',
    order: 51,
    kind: 'forced',
    block: 'branch',
    branchAxis: 'A1',
    weight: 2,
    prompt: '¿Qué te ayuda más a entender un caso?',
    options: [
      {
        id: 'ba1_m',
        text: 'Construir un mapa fisiopatológico.',
        scores: { A1: 4, A8: 4 },
      },
      {
        id: 'ba1_n',
        text: 'Ver la anatomía y las relaciones espaciales.',
        scores: { A1: 2, A2: 4, A8: 1 },
      },
      {
        id: 'ba1_o',
        text: 'Comparar con casos parecidos.',
        scores: { A1: 4, A8: 2, A4: 1 },
      },
      {
        id: 'ba1_p',
        text: 'Hablar con el paciente y su familia.',
        scores: { A5: 4, A4: 3, A1: 1 },
      },
    ],
  },
  {
    id: 'ba2_hands_on',
    order: 52,
    kind: 'forced',
    block: 'branch',
    branchAxis: 'A2',
    weight: 2,
    prompt: '¿Cuánto tiempo querrías pasar con las manos en un procedimiento?',
    options: [
      {
        id: 'ba2_i',
        text: 'La mayor parte de mi jornada.',
        scores: { A2: 4, A1: 1, A3: 2 },
      },
      {
        id: 'ba2_j',
        text: 'Varias horas al día.',
        scores: { A2: 3, A1: 2, A5: 2 },
      },
      {
        id: 'ba2_k',
        text: 'Solo cuando sea necesario.',
        scores: { A2: 1, A1: 3, A5: 3 },
      },
      {
        id: 'ba2_l',
        text: 'Prefiero no hacer procedimientos.',
        scores: { A2: 0, A1: 4, A5: 3 },
      },
    ],
  },
  {
    id: 'ba2_tool',
    order: 53,
    kind: 'forced',
    block: 'branch',
    branchAxis: 'A2',
    weight: 2,
    prompt: '¿Qué herramienta te resultaría más satisfactoria?',
    options: [
      {
        id: 'ba2_m',
        text: 'El bisturí.',
        scores: { A2: 4, A1: 1, A8: 0 },
      },
      {
        id: 'ba2_n',
        text: 'El endoscopio.',
        scores: { A2: 3, A1: 2, A8: 3 },
      },
      {
        id: 'ba2_o',
        text: 'El ecógrafo o el TAC.',
        scores: { A2: 1, A1: 3, A8: 3 },
      },
      {
        id: 'ba2_p',
        text: 'El microscopio.',
        scores: { A2: 0, A1: 4, A8: 4 },
      },
    ],
  },
  {
    id: 'ba5_difficult_conversation',
    order: 54,
    kind: 'forced',
    block: 'branch',
    branchAxis: 'A5',
    weight: 2,
    prompt: '¿Qué conversación te resultaría más llevadera?',
    options: [
      {
        id: 'ba5_i',
        text: 'Explicar un diagnóstico grave.',
        scores: { A5: 4, A4: 3, A1: 1 },
      },
      {
        id: 'ba5_j',
        text: 'Hablar de hábitos y prevención.',
        scores: { A5: 4, A4: 3, A1: 2 },
      },
      {
        id: 'ba5_k',
        text: 'Revisar pruebas y resultados.',
        scores: { A5: 1, A8: 4, A1: 3 },
      },
      {
        id: 'ba5_l',
        text: 'Coordinar derivaciones.',
        scores: { A5: 1, A4: 2, A3: 3 },
      },
    ],
  },
  {
    id: 'ba5_bedside',
    order: 55,
    kind: 'forced',
    block: 'branch',
    branchAxis: 'A5',
    weight: 2,
    prompt: '¿Qué parte del trabajo hospitalario prefieres?',
    options: [
      {
        id: 'ba5_m',
        text: 'Pasar consulta a pie de cama.',
        scores: { A5: 4, A4: 3, A3: 2 },
      },
      {
        id: 'ba5_n',
        text: 'Revisar el historial y las pruebas.',
        scores: { A5: 1, A8: 4, A1: 3 },
      },
      {
        id: 'ba5_o',
        text: 'Hablar con las familias.',
        scores: { A5: 4, A4: 3, A1: 1 },
      },
      {
        id: 'ba5_p',
        text: 'Coordinar el equipo.',
        scores: { A5: 2, A4: 2, A3: 3 },
      },
    ],
  },
  {
    id: 'bc1_tolerance_scenarios',
    order: 56,
    kind: 'ratingGroup',
    block: 'branch',
    branchAxis: 'C1',
    weight: 2,
    allowUnknown: true,
    prompt: '¿Cuánto te costaría sostener estas situaciones?',
    help: '1 = muchísimo · 5 = nada. Si no las has vivido, marca SNo lo sé⬝.',
    statements: [
      {
        id: 'uncertainty',
        text: 'Tomar decisiones sin poder consultar.',
        dimension: 'C1',
        reverse: true,
      },
      {
        id: 'suffering',
        text: 'Ver a un paciente joven con una enfermedad grave.',
        dimension: 'C1',
        reverse: true,
      },
      {
        id: 'pressure',
        text: 'Mantener la calma ante una agresión.',
        dimension: 'C1',
        reverse: true,
      },
      {
        id: 'death',
        text: 'Hablar del final de la vida con un paciente lúcido.',
        dimension: 'C1',
        reverse: true,
      },
    ],
  },
  {
    id: 'bc1_tolerance_extreme',
    order: 57,
    kind: 'ratingGroup',
    block: 'branch',
    branchAxis: 'C1',
    weight: 2,
    allowUnknown: true,
    prompt: '¿Cuánto te costaría sostener estas situaciones?',
    help: '1 = muchísimo · 5 = nada. Si no las has vivido, marca SNo lo sé⬝.',
    statements: [
      {
        id: 'uncertainty',
        text: 'Cambiar de tratamiento sin estar seguro.',
        dimension: 'C1',
        reverse: true,
      },
      {
        id: 'suffering',
        text: 'Acompañar a una familia que no acepta el pronóstico.',
        dimension: 'C1',
        reverse: true,
      },
      {
        id: 'pressure',
        text: 'Decidir en una parada cardiorrespiratoria.',
        dimension: 'C1',
        reverse: true,
      },
      {
        id: 'death',
        text: 'Firmar una limitación del esfuerzo terapéutico.',
        dimension: 'C1',
        reverse: true,
      },
    ],
  },
  {
    id: 'bc2_lifestyle',
    order: 58,
    kind: 'ratingGroup',
    block: 'branch',
    branchAxis: 'C2',
    weight: 2,
    prompt: '¿Cuánto te importa cada condición?',
    help: '1 = nada · 5 = muchísimo.',
    statements: [
      { id: 'guards', text: 'Tener guardias frecuentes.', dimension: 'C2' },
      { id: 'predictability', text: 'Saber tu horario con semanas de antelación.', dimension: 'C2' },
      { id: 'flexibility', text: 'Poder reducir la jornada o cambiar de centro.', dimension: 'C2' },
      { id: 'research', text: 'Tener un día protegido para investigación.', dimension: 'C2' },
    ],
  },
  {
    id: 'bc2_tradeoff',
    order: 59,
    kind: 'forced',
    block: 'branch',
    branchAxis: 'C2',
    weight: 2,
    prompt: 'Si tuvieras que elegir, ¿qué preferirías?',
    options: [
      {
        id: 'bc2_e',
        text: 'Más tiempo libre aunque haya guardias.',
        constraintScores: { guards: 4, predictability: 2 },
      },
      {
        id: 'bc2_f',
        text: 'Horario estable aunque sea menos flexible.',
        constraintScores: { predictability: 4, flexibility: 1 },
      },
      {
        id: 'bc2_g',
        text: 'Más investigación aunque el sueldo sea menor.',
        constraintScores: { research: 4, flexibility: 2 },
      },
      {
        id: 'bc2_h',
        text: 'Más flexibilidad aunque el horario sea irregular.',
        constraintScores: { flexibility: 4, predictability: 1 },
      },
    ],
  },
  {
    id: 'ba3_crisis',
    order: 60,
    kind: 'forced',
    block: 'branch',
    branchAxis: 'A3',
    weight: 2,
    prompt: '¿Qué haces cuando el volumen de trabajo se dispara?',
    options: [
      {
        id: 'ba3_m',
        text: 'Priorizo por gravedad y sigo.',
        scores: { A3: 4, A1: 3, A4: 1 },
      },
      {
        id: 'ba3_n',
        text: 'Pido refuerzos y reorganizo.',
        scores: { A3: 3, A5: 3, A4: 2 },
      },
      {
        id: 'ba3_o',
        text: 'Trabajo más rápido aunque baje el detalle.',
        scores: { A3: 2, A1: 1, A2: 3 },
      },
      {
        id: 'ba3_p',
        text: 'Mantengo el ritmo y termino lo previsto.',
        scores: { A3: 0, A4: 3, A1: 2 },
      },
    ],
  },
  {
    id: 'ba4_long_term',
    order: 61,
    kind: 'forced',
    block: 'branch',
    branchAxis: 'A4',
    weight: 2,
    prompt: '¿Qué te atrae de seguir a un paciente durante años?',
    options: [
      {
        id: 'ba4_m',
        text: 'Conocer cómo evoluciona.',
        scores: { A4: 4, A5: 3, A1: 2 },
      },
      {
        id: 'ba4_n',
        text: 'Ajustar el tratamiento poco a poco.',
        scores: { A4: 4, A1: 3, A2: 1 },
      },
      {
        id: 'ba4_o',
        text: 'Prevenir problemas futuros.',
        scores: { A4: 3, A5: 3, A1: 2 },
      },
      {
        id: 'ba4_p',
        text: 'Prefiero resolver episodios concretos.',
        scores: { A4: 0, A3: 3, A5: 2 },
      },
    ],
  },
  {
    id: 'ba8_research',
    order: 62,
    kind: 'forced',
    block: 'branch',
    branchAxis: 'A8',
    weight: 2,
    prompt: '¿Qué tipo de estudio te gustaría leer o hacer?',
    options: [
      {
        id: 'ba8_m',
        text: 'Un estudio anatómico.',
        scores: { A8: 1, A2: 4, A1: 1 },
      },
      {
        id: 'ba8_n',
        text: 'Un estudio fisiológico.',
        scores: { A8: 4, A1: 4, A5: 1 },
      },
      {
        id: 'ba8_o',
        text: 'Un estudio genético.',
        scores: { A8: 4, A1: 3, A2: 0 },
      },
      {
        id: 'ba8_p',
        text: 'Un estudio epidemiológico.',
        scores: { A8: 2, A5: 3, A1: 2 },
      },
    ],
  },
  {
    id: 'ba10_procedure',
    order: 64,
    kind: 'maxdiff',
    block: 'branch',
    branchAxis: 'A10',
    weight: 2,
    prompt: '¿Qué tipo de procedimiento te atrae más y cuál menos?',
    help: 'Piensa en la técnica, no en la especialidad.',
    options: [
      {
        id: 'ba10_a',
        text: 'Cateterismo cardiaco o electrofisiología.',
        scores: { A2: 4, A8: 2, A3: 3, A5: 1, A1: 2, A4: 1 },
      },
      {
        id: 'ba10_b',
        text: 'Biopsia de médula ósea o aféresis.',
        scores: { A2: 4, A8: 4, A1: 3, A4: 2, A5: 1, A3: 1 },
      },
      {
        id: 'ba10_c',
        text: 'Diálisis o acceso vascular.',
        scores: { A2: 4, A8: 3, A4: 4, A5: 2, A1: 2, A3: 2 },
      },
      {
        id: 'ba10_d',
        text: 'Endoscopia digestiva o broncoscopia.',
        scores: { A2: 3, A8: 3, A1: 2, A3: 2, A4: 2, A5: 2 },
      },
    ],
  },
  {
    id: 'ba10_setting',
    order: 65,
    kind: 'forced',
    block: 'branch',
    branchAxis: 'A10',
    weight: 2,
    prompt: '¿Dónde te gustaría pasar más tiempo?',
    options: [
      {
        id: 'ba10_e',
        text: 'En la sala de imagen cardiaca.',
        scores: { A8: 3, A2: 3, A5: 1, A4: 2 },
      },
      {
        id: 'ba10_f',
        text: 'En el laboratorio de hematología.',
        scores: { A8: 4, A5: 0, A2: 2, A4: 2 },
      },
      {
        id: 'ba10_g',
        text: 'En la unidad de diálisis.',
        scores: { A8: 3, A5: 3, A4: 4, A2: 2 },
      },
      {
        id: 'ba10_h',
        text: 'En la sala de endoscopia.',
        scores: { A8: 2, A5: 2, A4: 2, A2: 3 },
      },
    ],
  },
  {
    id: 'ba10_trajectory',
    order: 66,
    kind: 'forced',
    block: 'branch',
    branchAxis: 'A10',
    weight: 2,
    prompt: 'Si tuvieras que elegir un problema principal, ¿cuál sería?',
    options: [
      {
        id: 'ba10_i',
        text: 'Síndrome coronario agudo.',
        scores: { A3: 4, A2: 3, A1: 2, A4: 1 },
      },
      {
        id: 'ba10_j',
        text: 'Anemia grave o trastorno de coagulación.',
        scores: { A4: 3, A8: 4, A1: 3, A3: 1 },
      },
      {
        id: 'ba10_k',
        text: 'Enfermedad renal crónica o diálisis.',
        scores: { A4: 4, A8: 3, A5: 3, A3: 1 },
      },
      {
        id: 'ba10_l',
        text: 'Sepsis o fracaso multiorgánico.',
        scores: { A3: 4, A2: 3, A5: 2, A4: 2 },
      },
    ],
  },
  {
    id: 'ba10_rejection',
    order: 63,
    kind: 'forced',
    block: 'branch',
    branchAxis: 'A10',
    weight: 2,
    matchDimension: 'A10',
    matchMode: 'reject',
    prompt: '¿Qué área preferirías evitar en tu práctica?',
    help: 'No hay una respuesta correcta; sirve para afinar el perfil.',
    options: [
      { id: 'ba10_m', text: 'Problemas cardiovasculares.', matchValue: 'cardiovascular' },
      { id: 'ba10_n', text: 'Problemas hematológicos.', matchValue: 'hematologic' },
      { id: 'ba10_o', text: 'Problemas renales.', matchValue: 'renal' },
      { id: 'ba10_p', text: 'Problemas respiratorios.', matchValue: 'respiratory' },
    ],
  },
];

export const EXTENSIVE_CORE_VERSION = '1.0.0';



