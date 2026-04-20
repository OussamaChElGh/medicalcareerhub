import { Question, Specialty, BlogPost } from './types';

export const BLOG_POSTS: BlogPost[] = [
  {
    title: "Innovaciones en Cirugía Robótica de Alta Precisión",
    date: "14 de Marzo, 2024",
    author: "Dr. Alberto Ruiz",
    category: "Cirugía Avanzada",
    image: "https://picsum.photos/seed/robotic-surgery/800/450",
    excerpt: "Analizamos el impacto de los nuevos sistemas de asistencia robótica en la reducción de tiempos quirúrgicos y mejora de la recuperación postoperatoria...",
    content: "La integración de la robótica en el quirófano ha transformado la manera en que abordamos patologías complejas. Los sistemas actuales permiten una visión tridimensional magnificada y una destreza en los movimientos que supera las capacidades humanas limitadas por el temblor fisiológico.\n\nEn este artículo técnico, exploramos cómo la implementación de estas tecnologías ha reducido significativamente las complicaciones intraoperatorias en procedimientos oncológicos pélvicos y torácicos. La clave del éxito no reside solo en la máquina, sino en la curva de aprendizaje y la simbiosis entre el cirujano y el sistema digital."
  },
  {
    title: "Nuevos Paradigmas en el Abordaje de Enfermedades Emergentes",
    date: "02 de Junio, 2024",
    author: "Dra. Elena Castellanos",
    category: "Epidemiología",
    image: "https://picsum.photos/seed/medical-virus/800/450",
    excerpt: "Un estudio exhaustivo sobre las dinámicas de transmisión de nuevos patógenos y las estrategias de respuesta en salud pública...",
    content: "La epidemiología moderna se enfrenta a retos sin precedentes debido a la globalización y el cambio ambiental. Los virus emergentes presentan patrones de mutación que desafían los protocolos de respuesta tradicionales.\n\nHemos identificado la necesidad de fortalecer los sistemas de vigilancia genómica y triaje avanzado para detectar brotes antes de que se conviertan en crisis sanitarias. La prevención comunitaria y el intercambio de datos en tiempo real entre instituciones globales son las herramientas más eficaces para proteger la salud de la población en la próxima década."
  },
  {
    title: "Medicina Personalizada: El Futuro de la Terapéutica",
    date: "28 de Septiembre, 2024",
    author: "Dr. Marcos Vidal",
    category: "Genética Clínica",
    image: "https://picsum.photos/seed/genetics-medicine/800/450",
    excerpt: "Cómo el análisis genómico profundo está permitiendo diseñar tratamientos adaptados a las características moleculares de cada paciente...",
    content: "La medicina ya no es 'talla única'. Gracias al abaratamiento de la secuenciación del exoma completo, estamos entrando en la era de la precisión absoluta. Los protocolos terapéuticos ahora consideran las variaciones genéticas individuales que determinan la respuesta a fármacos y la susceptibilidad a efectos secundarios.\n\nEste cambio de paradigma es especialmente visible en la oncología personalizada y la neurología regenerativa, donde los biomarcadores específicos guían cada decisión clínica, optimizando los resultados y mejorando la calidad de vida de los pacientes de forma personalizada."
  }
];

export const QUICK_QUESTIONS: Question[] = [
  {
    id: 1,
    label: "Pregunta I de XII",
    text: "Ante una situación de parálisis clínica en un paciente crítico, ¿cuál es su prioridad inmediata?",
    options: [
      { id: '1a', text: "El diagnóstico diferencial exhaustivo", sigil: "", alignment: "INTERNAL_MEDICINE" },
      { id: '1b', text: "La estabilización de las constantes vitales", sigil: "", alignment: "EMERGENCY" },
      { id: '1c', text: "La intervención técnica resolutiva", sigil: "", alignment: "SURGERY" },
      { id: '1d', text: "La valoración del soporte fisiológico basal", sigil: "", alignment: "PEDIATRICS" },
    ]
  },
  {
    id: 2,
    label: "Pregunta II de XII",
    text: "¿Cuál considera que es el principal origen de la mayoría de las patologías actuales?",
    options: [
      { id: '2a', text: "Disfunciones mecánicas o estructurales", sigil: "", alignment: "SURGERY" },
      { id: '2b', text: "Trastornos en el equilibrio biopsicosocial", sigil: "", alignment: "PSYCHIATRY" },
      { id: '2c', text: "Factores genéticos y moleculares", sigil: "", alignment: "GENETICS" },
      { id: '2d', text: "El impacto del entorno y estilo de vida", sigil: "", alignment: "FAMILY_MEDICINE" },
    ]
  },
  {
    id: 3,
    label: "Pregunta III de XII",
    text: "Al recibir un cuadro clínico con síntomas contradictorios, ¿qué metodología prefiere?",
    options: [
      { id: '3a', text: "Análisis sistemático de datos y literatura", sigil: "", alignment: "INTERNAL_MEDICINE" },
      { id: '3b', text: "Tratamiento dirigido al síntoma predominante", sigil: "", alignment: "EMERGENCY" },
      { id: '3c', text: "Observación longitudinal de la evolución", sigil: "", alignment: "PSYCHIATRY" },
      { id: '3d', text: "Enfoque holístico considerando al entorno", sigil: "", alignment: "FAMILY_MEDICINE" },
    ]
  },
  {
    id: 4,
    label: "Pregunta IV de XII",
    text: "¿Qué tipo de resolución clínica le resulta más satisfactoria?",
    options: [
      { id: '4a', text: "El éxito en un soporte vital avanzado", sigil: "", alignment: "EMERGENCY" },
      { id: '4b', text: "El hallazgo de un diagnóstico inusual", sigil: "", alignment: "INTERNAL_MEDICINE" },
      { id: '4c', text: "La excelencia técnica en un procedimiento", sigil: "", alignment: "SURGERY" },
      { id: '4d', text: "La mejora del bienestar en pacientes crónicos", sigil: "", alignment: "PALLIATIVE" },
    ]
  },
  {
    id: 5,
    label: "Pregunta V de XII",
    text: "¿En qué nivel de la biología humana prefiere centrar su estudio?",
    options: [
      { id: '5a', text: "Sistemas orgánicos y hemodinámica", sigil: "", alignment: "CARDIOLOGY" },
      { id: '5b', text: "Aparato locomotor y biomecánica", sigil: "", alignment: "TRAUMATOLOGY" },
      { id: '5c', text: "Nivel tisular y celular", sigil: "", alignment: "PATHOLOGY" },
      { id: '5d', text: "Sistema nervioso superior y funcionalidad", sigil: "", alignment: "NEUROLOGY" },
    ]
  },
  {
    id: 6,
    label: "Pregunta VI de XII",
    text: "¿Con qué herramienta de trabajo se siente más identificado profesionalmente?",
    options: [
      { id: '6a', text: "Instrumental quirúrgico de precisión", sigil: "", alignment: "SURGERY" },
      { id: '6b', text: "La entrevista clínica y la anamnesis", sigil: "", alignment: "PSYCHIATRY" },
      { id: '6c', text: "Tecnología de imagen diagnóstica", sigil: "", alignment: "RADIOLOGY" },
      { id: '6d', text: "Técnicas de exploración especializada", sigil: "", alignment: "OPHTHALMOLOGY" },
    ]
  },
  {
    id: 7,
    label: "Pregunta VII de XII",
    text: "¿En qué entorno asistencial prefiere desarrollar su actividad?",
    options: [
      { id: '7a', text: "Áreas de cuidados críticos y urgencias", sigil: "", alignment: "EMERGENCY" },
      { id: '7b', text: "Investigación traslacional o básica", sigil: "", alignment: "RESEARCH" },
      { id: '7c', text: "Salud reproductiva y ciclo vital", sigil: "", alignment: "GYNAECOLOGY" },
      { id: '7d', text: "Área quirúrgica de alta complejidad", sigil: "", alignment: "SURGERY" },
    ]
  },
  {
    id: 8,
    label: "Pregunta VIII de XII",
    text: "Ante un conflicto entre la evidencia clínica y los valores del paciente, ¿cuál es su prioridad?",
    options: [
      { id: '8a', text: "Garantizar la autonomía del paciente", sigil: "", alignment: "FAMILY_MEDICINE" },
      { id: '8b', text: "Optimizar la toma de decisiones basada en datos", sigil: "", alignment: "INTERNAL_MEDICINE" },
      { id: '8c', text: "Ejecutar la mejor opción técnica disponible", sigil: "", alignment: "SURGERY" },
      { id: '8d', text: "Minimizar el impacto del sufrimiento", sigil: "", alignment: "PALLIATIVE" },
    ]
  },
  {
    id: 9,
    label: "Pregunta IX de XII",
    text: "¿Cuál es su principal motivación en la práctica de la medicina?",
    options: [
      { id: '9a', text: "La acción inmediata ante la gravedad", sigil: "", alignment: "EMERGENCY" },
      { id: '9b', text: "El cuidado integral del desarrollo humano", sigil: "", alignment: "PEDIATRICS" },
      { id: '9c', text: "El flujo de la fisiología cardiovascular", sigil: "", alignment: "CARDIOLOGY" },
      { id: '9d', text: "El dominio de la técnica reconstructiva", sigil: "", alignment: "TRAUMATOLOGY" },
    ]
  },
  {
    id: 10,
    label: "Pregunta X de XII",
    text: "¿Cuál de estas situaciones le supone un mayor reto intelectual?",
    options: [
      { id: '10a', text: "Complicaciones imprevistas en quirófano", sigil: "", alignment: "SURGERY" },
      { id: '10b', text: "La interpretación de pruebas histológicas difíciles", sigil: "", alignment: "PATHOLOGY" },
      { id: '10c', text: "La gestión de una parada cardiorrespiratoria", sigil: "", alignment: "EMERGENCY" },
      { id: '10d', text: "El manejo de patologías en neonatos críticos", sigil: "", alignment: "PEDIATRICS" },
    ]
  },
  {
    id: 11,
    label: "Pregunta XI de XII",
    text: "¿Cómo se define a sí mismo dentro del equipo de salud?",
    options: [
      { id: '11a', text: "El líder organizativo en la crisis", sigil: "", alignment: "EMERGENCY" },
      { id: '11b', text: "El reparador de deficiencias estructurales", sigil: "", alignment: "TRAUMATOLOGY" },
      { id: '11c', text: "El gestor de terapias sistémicas agresivas", sigil: "", alignment: "ONCOLOGY" },
      { id: '11d', text: "El profesional centrado en el bienestar final", sigil: "", alignment: "PALLIATIVE" },
    ]
  },
  {
    id: 12,
    label: "Pregunta XII de XII",
    text: "Ante el uso de nuevas tecnologías experimentales, ¿cuál es su aproximación?",
    options: [
      { id: '12a', text: "Su uso pragmático en casos desesperados", sigil: "", alignment: "EMERGENCY" },
      { id: '12b', text: "Su estudio concienzudo antes de la aplicación", sigil: "", alignment: "RESEARCH" },
      { id: '12c', text: "Priorizar métodos menos invasivos y probados", sigil: "", alignment: "PALLIATIVE" },
      { id: '12d', text: "Evaluar el impacto en el genograma del paciente", sigil: "", alignment: "GENETICS" },
    ]
  }
];

export const EXTENSIVE_QUESTIONS: Question[] = [
  {
    id: 1,
    label: "Pregunta I de LX",
    text: "Ante una situación de parálisis clínica en un paciente crítico, ¿cuál es su prioridad inmediata?",
    options: [
      { id: '1a', text: "El diagnóstico diferencial exhaustivo", sigil: "", alignment: "INTERNAL_MEDICINE" },
      { id: '1b', text: "La estabilización de las constantes vitales", sigil: "", alignment: "EMERGENCY" },
      { id: '1c', text: "La intervención técnica resolutiva", sigil: "", alignment: "SURGERY" },
      { id: '1d', text: "La valoración del soporte fisiológico basal", sigil: "", alignment: "PEDIATRICS" },
    ]
  },
  {
    id: 2,
    label: "Pregunta II de LX",
    text: "¿Cuál considera que es el principal origen de la mayoría de las patologías actuales?",
    options: [
      { id: '2a', text: "Disfunciones mecánicas o estructurales", sigil: "", alignment: "SURGERY" },
      { id: '2b', text: "Trastornos en el equilibrio biopsicosocial", sigil: "", alignment: "PSYCHIATRY" },
      { id: '2c', text: "Factores genéticos y moleculares", sigil: "", alignment: "GENETICS" },
      { id: '2d', text: "El impacto del entorno y estilo de vida", sigil: "", alignment: "FAMILY_MEDICINE" },
    ]
  },
  {
    id: 3,
    label: "Pregunta III de LX",
    text: "Al recibir un cuadro clínico con síntomas contradictorios, ¿qué metodología prefiere?",
    options: [
      { id: '3a', text: "Análisis sistemático de datos y literatura", sigil: "", alignment: "INTERNAL_MEDICINE" },
      { id: '3b', text: "Tratamiento dirigido al síntoma predominante", sigil: "", alignment: "EMERGENCY" },
      { id: '3c', text: "Observación longitudinal de la evolución", sigil: "", alignment: "PSYCHIATRY" },
      { id: '3d', text: "Enfoque holístico considerando al entorno", sigil: "", alignment: "FAMILY_MEDICINE" },
    ]
  },
  {
    id: 4,
    label: "Pregunta IV de LX",
    text: "¿Qué tipo de resolución clínica le resulta más satisfactoria?",
    options: [
      { id: '4a', text: "El éxito en un soporte vital avanzado", sigil: "", alignment: "EMERGENCY" },
      { id: '4b', text: "El hallazgo de un diagnóstico inusual", sigil: "", alignment: "INTERNAL_MEDICINE" },
      { id: '4c', text: "La excelencia técnica en un procedimiento", sigil: "", alignment: "SURGERY" },
      { id: '4d', text: "La mejora del bienestar en pacientes crónicos", sigil: "", alignment: "PALLIATIVE" },
    ]
  },
  {
    id: 5,
    label: "Pregunta V de LX",
    text: "¿En qué nivel de la biología humana prefiere centrar su estudio?",
    options: [
      { id: '5a', text: "Sistemas orgánicos y hemodinámica", sigil: "", alignment: "CARDIOLOGY" },
      { id: '5b', text: "Aparato locomotor y biomecánica", sigil: "", alignment: "TRAUMATOLOGY" },
      { id: '5c', text: "Nivel tisular y celular", sigil: "", alignment: "PATHOLOGY" },
      { id: '5d', text: "Sistema nervioso superior y funcionalidad", sigil: "", alignment: "NEUROLOGY" },
    ]
  },
  {
    id: 6,
    label: "Pregunta VI de LX",
    text: "¿Con qué herramienta de trabajo se siente más identificado profesionalmente?",
    options: [
      { id: '6a', text: "Instrumental quirúrgico de precisión", sigil: "", alignment: "SURGERY" },
      { id: '6b', text: "La entrevista clínica y la anamnesis", sigil: "", alignment: "PSYCHIATRY" },
      { id: '6c', text: "Tecnología de imagen diagnóstica", sigil: "", alignment: "RADIOLOGY" },
      { id: '6d', text: "Técnicas de exploración especializada", sigil: "", alignment: "OPHTHALMOLOGY" },
    ]
  },
  {
    id: 7,
    label: "Pregunta VII de LX",
    text: "¿En qué entorno asistencial prefiere desarrollar su actividad?",
    options: [
      { id: '7a', text: "Áreas de cuidados críticos y urgencias", sigil: "", alignment: "EMERGENCY" },
      { id: '7b', text: "Investigación traslacional o básica", sigil: "", alignment: "RESEARCH" },
      { id: '7c', text: "Salud reproductiva y ciclo vital", sigil: "", alignment: "GYNAECOLOGY" },
      { id: '7d', text: "Área quirúrgica de alta complejidad", sigil: "", alignment: "SURGERY" },
    ]
  },
  {
    id: 8,
    label: "Pregunta VIII de LX",
    text: "Ante un conflicto entre la evidencia clínica y los valores del paciente, ¿cuál es su prioridad?",
    options: [
      { id: '8a', text: "Garantizar la autonomía del paciente", sigil: "", alignment: "FAMILY_MEDICINE" },
      { id: '8b', text: "Optimizar la toma de decisiones basada en datos", sigil: "", alignment: "INTERNAL_MEDICINE" },
      { id: '8c', text: "Ejecutar la mejor opción técnica disponible", sigil: "", alignment: "SURGERY" },
      { id: '8d', text: "Minimizar el impacto del sufrimiento", sigil: "", alignment: "PALLIATIVE" },
    ]
  },
  {
    id: 9,
    label: "Pregunta IX de LX",
    text: "¿Cuál es su principal motivación en la práctica de la medicina?",
    options: [
      { id: '9a', text: "La acción inmediata ante la gravedad", sigil: "", alignment: "EMERGENCY" },
      { id: '9b', text: "El cuidado integral del desarrollo humano", sigil: "", alignment: "PEDIATRICS" },
      { id: '9c', text: "El flujo de la fisiología cardiovascular", sigil: "", alignment: "CARDIOLOGY" },
      { id: '9d', text: "El dominio de la técnica reconstructiva", sigil: "", alignment: "TRAUMATOLOGY" },
    ]
  },
  {
    id: 10,
    label: "Pregunta X de LX",
    text: "¿Cuál de estas situaciones le supone un mayor reto intelectual?",
    options: [
      { id: '10a', text: "Complicaciones imprevistas en quirófano", sigil: "", alignment: "SURGERY" },
      { id: '10b', text: "La interpretación de pruebas histológicas difíciles", sigil: "", alignment: "PATHOLOGY" },
      { id: '10c', text: "La gestión de una parada cardiorrespiratoria", sigil: "", alignment: "EMERGENCY" },
      { id: '10d', text: "El manejo de patologías en neonatos críticos", sigil: "", alignment: "PEDIATRICS" },
    ]
  },
  {
    id: 11,
    label: "Pregunta XI de LX",
    text: "¿Cómo se define a sí mismo dentro del equipo de salud?",
    options: [
      { id: '11a', text: "El líder organizativo en la crisis", sigil: "", alignment: "EMERGENCY" },
      { id: '11b', text: "El reparador de deficiencias estructurales", sigil: "", alignment: "TRAUMATOLOGY" },
      { id: '11c', text: "El gestor de terapias sistémicas agresivas", sigil: "", alignment: "ONCOLOGY" },
      { id: '11d', text: "El profesional centrado en el bienestar final", sigil: "", alignment: "PALLIATIVE" },
    ]
  },
  {
    id: 12,
    label: "Pregunta XII de LX",
    text: "Ante el uso de nuevas tecnologías experimentales, ¿cuál es su aproximación?",
    options: [
      { id: '12a', text: "Su uso pragmático en casos desesperados", sigil: "", alignment: "EMERGENCY" },
      { id: '12b', text: "Su estudio concienzudo antes de la aplicación", sigil: "", alignment: "RESEARCH" },
      { id: '12c', text: "Priorizar métodos menos invasivos y probados", sigil: "", alignment: "PALLIATIVE" },
      { id: '12d', text: "Evaluar el impacto en el genograma del paciente", sigil: "", alignment: "GENETICS" },
    ]
  },
  {
    id: 13,
    label: "Pregunta XIII de LX",
    text: "¿Cuál de estos procesos biológicos le resulta más fascinante para su estudio?",
    options: [
      { id: '13a', text: "La hemodinámica y el ciclo cardíaco", sigil: "", alignment: "CARDIOLOGY" },
      { id: '13b', text: "La homeostasis en el entorno quirúrgico", sigil: "", alignment: "SURGERY" },
      { id: '13c', text: "La transmisión del impulso electrofisiológico", sigil: "", alignment: "NEUROLOGY" },
      { id: '13d', text: "La interacción inmunológica en la comunidad", sigil: "", alignment: "FAMILY_MEDICINE" },
    ]
  },
  {
    id: 14,
    label: "Pregunta XIV de LX",
    text: "¿En qué área hospitalaria preferiría realizar una subespecialización?",
    options: [
      { id: '14a', text: "Anatomía patológica y diagnóstico tisular", sigil: "", alignment: "PATHOLOGY" },
      { id: '14b', text: "Imagenología de alta resolución", sigil: "", alignment: "RADIOLOGY" },
      { id: '14c', text: "Obstetricia y medicina fetal", sigil: "", alignment: "GYNAECOLOGY" },
      { id: '14d', text: "Gestión de la cronicidad en atención primaria", sigil: "", alignment: "FAMILY_MEDICINE" },
    ]
  },
  {
    id: 15,
    label: "Pregunta XV de LX",
    text: "Al identificar un error de procedimiento en un equipo multidisciplinar, su reacción es:",
    options: [
      { id: '15a', text: "Brindar apoyo técnico e informar internamente", sigil: "", alignment: "SURGERY" },
      { id: '15b', text: "Seguir los canales oficiales de seguridad del paciente", sigil: "", alignment: "INTERNAL_MEDICINE" },
      { id: '15c', text: "Intervenir directamente para asegurar la estabilidad", sigil: "", alignment: "EMERGENCY" },
      { id: '15d', text: "Registrar y analizar el evento para investigación", sigil: "", alignment: "RESEARCH" },
    ]
  },
  {
    id: 16,
    label: "Pregunta XVI de LX",
    text: "¿Qué rango de edad del paciente prefiere tratar predominantemente?",
    options: [
      { id: '16a', text: "Pacientes con patologías neurológicas complejas", sigil: "", alignment: "NEUROLOGY" },
      { id: '16b', text: "Pacientes pediátricos en estado crítico", sigil: "", alignment: "PEDIATRICS" },
      { id: '16c', text: "Adultos con patología quirúrgica abdominal", sigil: "", alignment: "SURGERY" },
      { id: '16d', text: "Pacientes con manifestaciones dermatológicas", sigil: "", alignment: "DERMATOLOGY" },
    ]
  },
  {
    id: 17,
    label: "Pregunta XVII de LX",
    text: "La tecnología médica es para usted...",
    options: [
      { id: '17a', text: "Una extensión necesaria para el radiodiagnóstico", sigil: "", alignment: "RADIOLOGY" },
      { id: '17b', text: "Un soporte complementario a la atención primaria", sigil: "", alignment: "FAMILY_MEDICINE" },
      { id: '17c', text: "La clave para descifrar el código genético", sigil: "", alignment: "GENETICS" },
      { id: '17d', text: "Un arma crítica contra la proliferación neoplásica", sigil: "", alignment: "ONCOLOGY" },
    ]
  },
  {
    id: 18,
    label: "Pregunta XVIII de LX",
    text: "¿En qué área de la salud mental prefiere centrarse?",
    options: [
      { id: '18a', text: "Psicoterapia y manejo conductual", sigil: "", alignment: "PSYCHIATRY" },
      { id: '18b', text: "Neurocirugía y restauración funcional", sigil: "", alignment: "NEUROSURGERY" },
      { id: '18c', text: "Oftalmología e innovación tecnológica", sigil: "", alignment: "OPHTHALMOLOGY" },
      { id: '18d', text: "Pediatría y prevención del desarrollo", sigil: "", alignment: "PEDIATRICS" },
    ]
  },
  {
    id: 19,
    label: "Pregunta XIX de LX",
    text: "¿Cuál es su nivel de tolerancia al riesgo en quirófano?",
    options: [
      { id: '19a', text: "Alta, centrado en la resolución técnica agresiva", sigil: "", alignment: "SURGERY" },
      { id: '19b', text: "Moderada, basada en el consenso clínico", sigil: "", alignment: "INTERNAL_MEDICINE" },
      { id: '19c', text: "Extrema, en situaciones de soporte vital", sigil: "", alignment: "EMERGENCY" },
      { id: '19d', text: "Mínima, priorizando la terapia oncológica conservadora", sigil: "", alignment: "ONCOLOGY" },
    ]
  },
  {
    id: 20,
    label: "Pregunta XX de LX",
    text: "¿Qué opina sobre la jerarquía profesional en el entorno clínico?",
    options: [
      { id: '20a', text: "Esencial para la toma de decisiones quirúrgicas", sigil: "", alignment: "SURGERY" },
      { id: '20b', text: "Debe ser horizontal y basada en el conocimiento", sigil: "", alignment: "INTERNAL_MEDICINE" },
      { id: '20c', text: "Primordial para la coordinación en emergencias", sigil: "", alignment: "EMERGENCY" },
      { id: '20d', text: "Secundaria ante el bienestar integral del paciente", sigil: "", alignment: "PALLIATIVE" },
    ]
  },
  {
    id: 21,
    label: "Pregunta XXI de LX",
    text: "¿Cuál es su principal objetivo en un servicio de urgencias?",
    options: [
      { id: '21a', text: "Lograr el retorno a la circulación espontánea", sigil: "", alignment: "EMERGENCY" },
      { id: '21b', text: "Identificar la etiología del colapso súbito", sigil: "", alignment: "RESEARCH" },
      { id: '21c', text: "Proporcionar soporte vital y consuelo familiar", sigil: "", alignment: "FAMILY_MEDICINE" },
      { id: '21d', text: "Preservar la agudeza visual en traumatismos oculares", sigil: "", alignment: "OPHTHALMOLOGY" },
    ]
  },
  {
    id: 22,
    label: "Pregunta XXII de LX",
    text: "Si tuviera que combatir una patología severa, ¿qué método elegiría?",
    options: [
      { id: '22a', text: "Radioterapia dirigida y citostáticos", sigil: "", alignment: "ONCOLOGY" },
      { id: '22b', text: "Reducción y osteosíntesis en fracturas complejas", sigil: "", alignment: "TRAUMATOLOGY" },
      { id: '22c', text: "Neuromodulación en patología degenerativa", sigil: "", alignment: "NEUROLOGY" },
      { id: '22d', text: "Intervencionismo mínimamente invasivo", sigil: "", alignment: "RADIOLOGY" },
    ]
  },
  {
    id: 23,
    label: "Pregunta XXIII de LX",
    text: "¿Qué aspecto de la formación médica le resultó más arduo?",
    options: [
      { id: '23a', text: "La gestión del estrés en rotaciones críticas", sigil: "", alignment: "EMERGENCY" },
      { id: '23b', text: "La profundidad teórica de la fisiopatología", sigil: "", alignment: "RESEARCH" },
      { id: '23c', text: "El contacto inicial con la muerte digna", sigil: "", alignment: "PALLIATIVE" },
      { id: '23d', text: "La fatiga durante guardias quirúrgicas", sigil: "", alignment: "SURGERY" },
    ]
  },
  {
    id: 24,
    label: "Pregunta XXIV de LX",
    text: "¿Cómo visualiza el futuro de su especialidad?",
    options: [
      { id: '24a', text: "Más resolutiva gracias a la monitorización", sigil: "", alignment: "EMERGENCY" },
      { id: '24b', text: "Integrada plenamente con la pediatría social", sigil: "", alignment: "PEDIATRICS" },
      { id: '24c', text: "Definida por la medicina personalizada genómica", sigil: "", alignment: "GENETICS" },
      { id: '24d', text: "Transformada por técnicas de imagen molecular", sigil: "", alignment: "DERMATOLOGY" },
    ]
  },
  {
    id: 25,
    label: "Pregunta XXV de LX",
    text: "Ante un brote de enfermedad infecciosa en una comunidad, ¿su primer paso es?",
    options: [
      { id: '25a', text: "Iniciar un estudio epidemiológico de contactos", sigil: "", alignment: "RESEARCH" },
      { id: '25b', text: "Reforzar el triaje y la atención en urgencias", sigil: "", alignment: "EMERGENCY" },
      { id: '25c', text: "Identificar el agente infeccioso en laboratorio", sigil: "", alignment: "INTERNAL_MEDICINE" },
      { id: '25d', text: "Informar a la población para evitar el pánico", sigil: "", alignment: "FAMILY_MEDICINE" },
    ]
  },
  {
    id: 26,
    label: "Pregunta XXVI de LX",
    text: "¿Qué le atrae más del estudio anatómico de un órgano?",
    options: [
      { id: '26a', text: "Su funcionalidad mecánica y flujos", sigil: "", alignment: "CARDIOLOGY" },
      { id: '26b', text: "Sus alteraciones celulares oncológicas", sigil: "", alignment: "ONCOLOGY" },
      { id: '26c', text: "Su relación sistémica con el organismo", sigil: "", alignment: "INTERNAL_MEDICINE" },
      { id: '26d', text: "Su capacidad de reparación y regeneración", sigil: "", alignment: "TRAUMATOLOGY" },
    ]
  },
  {
    id: 27,
    label: "Pregunta XXVII de LX",
    text: "Si se encuentra con un caso de pronóstico infausto, ¿cuál es su actitud?",
    options: [
      { id: '27a', text: "Revisar opciones quirúrgicas extremas", sigil: "", alignment: "SURGERY" },
      { id: '27b', text: "Buscar ensayos clínicos experimentación", sigil: "", alignment: "EMERGENCY" },
      { id: '27c', text: "Planificar una transición digna a paliativos", sigil: "", alignment: "PALLIATIVE" },
      { id: '27d', text: "Estudiar la fisiopatología de la evolución", sigil: "", alignment: "PATHOLOGY" },
    ]
  },
  {
    id: 28,
    label: "Pregunta XXVIII de LX",
    text: "¿Cuál de estos 'mapas' diagnósticos prefiere?",
    options: [
      { id: '28a', text: "El árbol arterial y venoso", sigil: "", alignment: "CARDIOLOGY" },
      { id: '28b', text: "La arquitectura neuronal central", sigil: "", alignment: "NEUROLOGY" },
      { id: '28c', text: "La representación radiológica tridimensional", sigil: "", alignment: "RADIOLOGY" },
      { id: '28d', text: "La secuencia de bases genéticas", sigil: "", alignment: "GENETICS" },
    ]
  },
  {
    id: 29,
    label: "Pregunta XXIX de LX",
    text: "Ante un parto que presenta complicaciones obstétricas súbitas:",
    options: [
      { id: '29a', text: "Priorizo la seguridad materna y neonatal", sigil: "", alignment: "GYNAECOLOGY" },
      { id: '29b', text: "Solicito intervención de cirugía de emergencia", sigil: "", alignment: "EMERGENCY" },
      { id: '29c', text: "Evalúo la vitalidad fetal inmediata", sigil: "", alignment: "PEDIATRICS" },
      { id: '29d', text: "Estabilizo y coordino el traslado a unidad de críticos", sigil: "", alignment: "FAMILY_MEDICINE" },
    ]
  },
  {
    id: 30,
    label: "Pregunta XXX de LX",
    text: "¿Qué representa un síntoma para usted?",
    options: [
      { id: '30a', text: "Una desviación del orden celular", sigil: "", alignment: "ONCOLOGY" },
      { id: '30b', text: "Una variable en un rompecabezas diagnóstico", sigil: "", alignment: "INTERNAL_MEDICINE" },
      { id: '30c', text: "Un indicador de compromiso vital", sigil: "", alignment: "EMERGENCY" },
      { id: '30d', text: "Una manifestación externa de un problema interno", sigil: "", alignment: "DERMATOLOGY" },
    ]
  },
  {
    id: 31,
    label: "Pregunta XXXI de LX",
    text: "Si tuviera que priorizar el avance en un área específica de la salud pública:",
    options: [
      { id: '31a', text: "La optimización de los servicios de salud mental", sigil: "", alignment: "PSYCHIATRY" },
      { id: '31b', text: "La mejora de la calidad de vida en pacientes crónicos", sigil: "", alignment: "PALLIATIVE" },
      { id: '31c', text: "La prevención de patologías sensoriales degenerativas", sigil: "", alignment: "OPHTHALMOLOGY" },
      { id: '31d', text: "El desarrollo de terapias dirigidas contra patologías sistémicas", sigil: "", alignment: "ONCOLOGY" },
    ]
  },
  {
    id: 32,
    label: "Pregunta XXXII de LX",
    text: "¿Qué cualidad considera más relevante en un entorno clínico de alto nivel?",
    options: [
      { id: '32a', text: "La precisión técnica y el dominio tecnológico", sigil: "", alignment: "RADIOLOGY" },
      { id: '32b', text: "La resiliencia y adaptación en pacientes complejos", sigil: "", alignment: "PEDIATRICS" },
      { id: '32c', text: "El análisis profundo de la biología molecular", sigil: "", alignment: "GENETICS" },
      { id: '32d', text: "La capacidad de acompañamiento en situaciones terminales", sigil: "", alignment: "PALLIATIVE" },
    ]
  },
  {
    id: 33,
    label: "Pregunta XXXIII de LX",
    text: "Finalmente, ¿cómo definiría su identidad profesional dentro del ecosistema médico?",
    options: [
      { id: '33a', text: "Un experto en intervención resolutiva técnica", sigil: "", alignment: "SURGERY" },
      { id: '33b', text: "Un clínico analista de variables diagnósticas", sigil: "", alignment: "INTERNAL_MEDICINE" },
      { id: '33c', text: "Un gestor integral de la salud del individuo", sigil: "", alignment: "FAMILY_MEDICINE" },
      { id: '33d', text: "Un investigador impulsor del avance científico", sigil: "", alignment: "RESEARCH" },
    ]
  },
  {
    id: 34,
    label: "Pregunta XXXIV de LX",
    text: "¿Qué prefiere manejar en su práctica diaria?",
    options: [
      { id: '34a', text: "Gases arteriales y parámetros ventilatorios", sigil: "", alignment: "INTENSIVE_CARE" },
      { id: '34b', text: "Manejo de fármacos de alta complejidad", sigil: "", alignment: "PHARMACOLOGY" },
      { id: '34c', text: "Técnicas de endoscopia e intervencionismo", sigil: "", alignment: "GASTROENTEROLOGY" },
      { id: '34d', text: "Algoritmos de imagen molecular", sigil: "", alignment: "NUCLEAR_MEDICINE" },
    ]
  },
  {
    id: 35,
    label: "Pregunta XXXV de LX",
    text: "¿Cuál es su opinión sobre la telemedicina?",
    options: [
      { id: '35a', text: "Útil para el seguimiento remoto de crónicos", sigil: "", alignment: "FAMILY_MEDICINE" },
      { id: '35b', text: "Ideal para el triaje inicial en áreas rurales", sigil: "", alignment: "EMERGENCY" },
      { id: '35c', text: "Limitada por la falta de exploración física", sigil: "", alignment: "INTERNAL_MEDICINE" },
      { id: '35d', text: "Un canal excelente para la salud mental", sigil: "", alignment: "PSYCHIATRY" },
    ]
  },
  {
    id: 36,
    label: "Pregunta XXXVI de LX",
    text: "Al observar una disfunción en el filtrado renal, ¿qué opción prefiere?",
    options: [
      { id: '36a', text: "Soporte mediante depuración extrarrenal", sigil: "", alignment: "NEPHROLOGY" },
      { id: '36b', text: "Intervención quirúrgica sobre la vía urinaria", sigil: "", alignment: "UROLOGY" },
      { id: '36c', text: "Estudio histológico mediante biopsia renal", sigil: "", alignment: "PATHOLOGY" },
      { id: '36d', text: "Balance hídrico y manejo hemodinámico", sigil: "", alignment: "CARDIOLOGY" },
    ]
  },
  {
    id: 37,
    label: "Pregunta XXXVII de LX",
    text: "Ante un paciente con dificultad respiratoria aguda:",
    options: [
      { id: '37a', text: "Estudio funcional mediante espirometría", sigil: "", alignment: "PULMONOLOGY" },
      { id: '37b', text: "Manejo avanzado de la vía aérea en inducción", sigil: "", alignment: "ANESTHESIOLOGY" },
      { id: '37c', text: "Valoración de posible componente alérgico", sigil: "", alignment: "IMMUNOLOGY" },
      { id: '37d', text: "Exploración física sistemática y auscultación", sigil: "", alignment: "INTERNAL_MEDICINE" },
    ]
  },
  {
    id: 38,
    label: "Pregunta XXXVIII de LX",
    text: "¿Qué aspecto de la patología osteoarticular le resulta más interesante?",
    options: [
      { id: '38a', text: "Mecanismos inflamatorios y autoinmunes", sigil: "", alignment: "RHEUMATOLOGY" },
      { id: '38b', text: "Resolución quirúrgica de fracturas", sigil: "", alignment: "TRAUMATOLOGY" },
      { id: '38c', text: "Protocolos de rehabilitación post-quirúrgica", sigil: "", alignment: "REHAB" },
      { id: '38d', text: "Manejo de la fragilidad ósea en geriatría", sigil: "", alignment: "GERIATRICS" },
    ]
  },
  {
    id: 39,
    label: "Pregunta XXXIX de LX",
    text: "¿Cuál es su enfoque ante una anemia de etiología incierta?",
    options: [
      { id: '39a', text: "Estudio hematológico y de médula ósea", sigil: "", alignment: "HEMATOLOGY" },
      { id: '39b', text: "Descarte de pérdidas digestivas ocultas", sigil: "", alignment: "GASTROENTEROLOGY" },
      { id: '39c', text: "Evaluación de déficit nutricional en oncología", sigil: "", alignment: "ONCOLOGY" },
      { id: '39d', text: "Optimización de la reserva funcional cardíaca", sigil: "", alignment: "CARDIOLOGY" },
    ]
  },
  {
    id: 40,
    label: "Pregunta XL de LX",
    text: "¿Cómo gestiona el periodo intraoperatorio crónico?",
    options: [
      { id: '40a', text: "Mantenimiento estable del plano anestésico", sigil: "", alignment: "ANESTHESIOLOGY" },
      { id: '40b', text: "Monitorización continua neurofisiológica", sigil: "", alignment: "NEUROLOGY" },
      { id: '40c', text: "Ejecución técnica del procedimiento principal", sigil: "", alignment: "SURGERY" },
      { id: '40d', text: "Asegurar la oxigenación y el intercambio gaseoso", sigil: "", alignment: "PULMONOLOGY" },
    ]
  },
  {
    id: 41,
    label: "Pregunta XLI de LX",
    text: "Ante un cuadro de infección sistémica grave:",
    options: [
      { id: '41a', text: "Identificar el patógeno mediante hemocultivos", sigil: "", alignment: "MICROBIOLOGY" },
      { id: '41b', text: "Analizar la respuesta inmunitaria del huésped", sigil: "", alignment: "IMMUNOLOGY" },
      { id: '41c', text: "Implementar medidas de salud pública", sigil: "", alignment: "PREVENTIVE" },
      { id: '41d', text: "Iniciar antibioterapia dirigida de amplio espectro", sigil: "", alignment: "INFECTOLOGY" },
    ]
  },
  {
    id: 42,
    label: "Pregunta XLII de LX",
    text: "¿Cuál es su prioridad en el manejo del paciente con deterioro cognitivo?",
    options: [
      { id: '42a', text: "Preservación de la funcionalidad en la vejez", sigil: "", alignment: "GERIATRICS" },
      { id: '42b', text: "Diagnóstico diferencial mediante neuroimagen", sigil: "", alignment: "NEUROLOGY" },
      { id: '42c', text: "Manejo de síntomas psiquiátricos asociados", sigil: "", alignment: "PSYCHIATRY" },
      { id: '42d', text: "Planificación del cuidado y soporte domiciliario", sigil: "", alignment: "PALLIATIVE" },
    ]
  },
  {
    id: 43,
    label: "Pregunta XLIII de LX",
    text: "En un paciente con secuelas funcionales tras un traumatismo:",
    options: [
      { id: '43a', text: "Diseño de un programa de rehabilitación motora", sigil: "", alignment: "REHAB" },
      { id: '43b', text: "Cirugía ortopédica reconstructiva", sigil: "", alignment: "TRAUMATOLOGY" },
      { id: '43c', text: "Valoración de la aptitud laboral posterior", sigil: "", alignment: "OCCUPATIONAL" },
      { id: '43d', text: "Reparación tisular y cobertura cutánea", sigil: "", alignment: "DERMATOLOGY" },
    ]
  },
  {
    id: 44,
    label: "Pregunta XLIV de LX",
    text: "¿Cómo aborda una patología vascular obstructiva?",
    options: [
      { id: '44a', text: "Revascularización quirúrgica directa", sigil: "", alignment: "VASCULAR" },
      { id: '44b', text: "Tratamiento médico antiagregante", sigil: "", alignment: "INTERNAL_MEDICINE" },
      { id: '44c', text: "Procedimiento endovascular percutáneo", sigil: "", alignment: "RADIOLOGY" },
      { id: '44d', text: "Control de factores de riesgo cardiovascular", sigil: "", alignment: "CARDIOLOGY" },
    ]
  },
  {
    id: 45,
    label: "Pregunta XLV de LX",
    text: "Ante un defecto anatómico facial complejo:",
    options: [
      { id: '45a', text: "Cirugía plástica y reconstructiva facial", sigil: "", alignment: "PLASTIC_SURGERY" },
      { id: '45b', text: "Tratamiento dermatológico local persistente", sigil: "", alignment: "DERMATOLOGY" },
      { id: '45c', text: "Adaptación funcional en pacientes geriátricos", sigil: "", alignment: "GERIATRICS" },
      { id: '45d', text: "Cirugía oral y maxilofacial avanzada", sigil: "", alignment: "MAXILLOFACIAL" },
    ]
  },
  {
    id: 46,
    label: "Pregunta XLVI de LX",
    text: "Si un paciente pediátrico presenta un retraso en el crecimiento pondoestatural:",
    options: [
      { id: '46a', text: "Estudio del eje hormonal y endocrino", sigil: "", alignment: "ENDOCRINOLOGY" },
      { id: '46b', text: "Valoración de absorción en el sistema digestivo", sigil: "", alignment: "GASTROENTEROLOGY" },
      { id: '46c', text: "Descarte de patología base en pediatría social", sigil: "", alignment: "PEDIATRICS" },
      { id: '46d', text: "Análisis de variantes genéticas del crecimiento", sigil: "", alignment: "GENETICS" },
    ]
  },
  {
    id: 47,
    label: "Pregunta XLVII de LX",
    text: "Si la estabilidad hemodinámica del paciente se ve comprometida súbitamente:",
    options: [
      { id: '47a', text: "Aseguro el gasto cardíaco y la perfusión", sigil: "", alignment: "CARDIOLOGY" },
      { id: '47b', text: "Optimo la ventilación y oxigenación tisular", sigil: "", alignment: "PULMONOLOGY" },
      { id: '47c', text: "Evalúo la función renal y el equilibrio hídrico", sigil: "", alignment: "NEPHROLOGY" },
      { id: '47d', text: "Mantengo el soporte vital en unidad de cuidados intensivos", sigil: "", alignment: "INTENSIVE_CARE" },
    ]
  },
  {
    id: 48,
    label: "Pregunta XLVIII de LX",
    text: "¿Cuál considera que es el mayor desafío ético actual?",
    options: [
      { id: '48a', text: "La gestión de tóxicos y seguridad ambiental", sigil: "", alignment: "TOXICOLOGY" },
      { id: '48b', text: "El abordaje de la cronicidad y el envejecimiento poblacional", sigil: "", alignment: "GERIATRICS" },
      { id: '48c', text: "La responsabilidad legal en la praxis médica", sigil: "", alignment: "LEGAL_MEDICINE" },
      { id: '48d', text: "La salud mental en el entorno laboral", sigil: "", alignment: "OCCUPATIONAL" },
    ]
  },
  {
    id: 49,
    label: "Pregunta XLIX de LX",
    text: "¿Qué avance tecnológico considera más transformador para el cuidado del paciente?",
    options: [
      { id: '49a', text: "Exoesqueletos y robótica en rehabilitación funcional", sigil: "", alignment: "REHAB" },
      { id: '49b', text: "Medicina nuclear y radioisótopos terapéuticos", sigil: "", alignment: "NUCLEAR_MEDICINE" },
      { id: '49c', text: "Protocolos avanzados de sedación paliativa", sigil: "", alignment: "PALLIATIVE" },
      { id: '49d', text: "Sistemas de inteligencia artificial en radiodiagnóstico", sigil: "", alignment: "RADIOLOGY" },
    ]
  },
  {
    id: 50,
    label: "Pregunta L de LX",
    text: "Al finalizar su evaluación, ¿en qué área siente que su perfil es más sólido?",
    options: [
      { id: '50a', text: "Resolución de crisis agudas y triaje", sigil: "", alignment: "EMERGENCY" },
      { id: '50b', text: "Peritaje y medicina legal y forense", sigil: "", alignment: "LEGAL_MEDICINE" },
      { id: '50c', text: "Atención continuada y medicina de familia", sigil: "", alignment: "FAMILY_MEDICINE" },
      { id: '50d', text: "Enfermedades infecciosas y medicina preventiva", sigil: "", alignment: "INFECTOLOGY" },
    ]
  },
  {
    id: 51,
    label: "Pregunta LI de LX",
    text: "¿Cómo abordaría una patología del sistema auditivo complexa?",
    options: [
      { id: '51a', text: "Intervención quirúrgica sobre el oído medio", sigil: "", alignment: "ENT" },
      { id: '51b', text: "Estudio electrofisiológico de potenciales evocados", sigil: "", alignment: "NEUROPHYSIOLOGY" },
      { id: '51c', text: "Manejo farmacológico de la sintomatología", sigil: "", alignment: "ANESTHESIOLOGY" },
      { id: '51d', text: "Evaluación del impacto neuropsicológico", sigil: "", alignment: "PSYCHIATRY" },
    ]
  },
  {
    id: 52,
    label: "Pregunta LII de LX",
    text: "Ante un traumatismo craneoencefálico grave:",
    options: [
      { id: '52a', text: "Intervención neuroquirúrgica inmediata", sigil: "", alignment: "NEUROSURGERY" },
      { id: '52b', text: "Control de la presión intracraneal en UCI", sigil: "", alignment: "INTENSIVE_CARE" },
      { id: '52c', text: "Monitorización por TC multidetector", sigil: "", alignment: "RADIOLOGY" },
      { id: '52d', text: "Valoración médico-legal de las secuelas", sigil: "", alignment: "LEGAL_MEDICINE" },
    ]
  },
  {
    id: 53,
    label: "Pregunta LIII de LX",
    text: "En una patología de la caja torácica que compromete la expansión:",
    options: [
      { id: '53a', text: "Reconstrucción de la pared torácica", sigil: "", alignment: "THORACIC_SURGERY" },
      { id: '53b', text: "Drenaje pleural y reexpansión pulmonar", sigil: "", alignment: "PULMONOLOGY" },
      { id: '53c', text: "Corrección de malformaciones vasculares asociadas", sigil: "", alignment: "VASCULAR" },
      { id: '53d', text: "Control analgésico de la mecánica ventilatoria", sigil: "", alignment: "PALLIATIVE" },
    ]
  },
  {
    id: 54,
    label: "Pregunta LIV de LX",
    text: "¿Cuál es su enfoque en la medicina deportiva de élite?",
    options: [
      { id: '54a', text: "Optimización del rendimiento y prevención de lesiones", sigil: "", alignment: "SPORTS_MEDICINE" },
      { id: '54b', text: "Recuperación funcional tras cirugía ortopédica", sigil: "", alignment: "REHAB" },
      { id: '54c', text: "Manejo de la inflamación articular crónica", sigil: "", alignment: "RHEUMATOLOGY" },
      { id: '54d', text: "Estudio del perfil metabólico del deportista", sigil: "", alignment: "ENDOCRINOLOGY" },
    ]
  },
  {
    id: 55,
    label: "Pregunta LV de LX",
    text: "Ante una intoxicación aguda por agentes desconocidos:",
    options: [
      { id: '55a', text: "Búsqueda del antídoto específico", sigil: "", alignment: "PHARMACOLOGY" },
      { id: '55b', text: "Identificación de toxinas en fluidos biológicos", sigil: "", alignment: "MICROBIOLOGY" },
      { id: '55c', text: "Manejo clínico del paciente intoxicado", sigil: "", alignment: "TOXICOLOGY" },
      { id: '55d', text: "Valoración de la respuesta inflamatoria sistémica", sigil: "", alignment: "IMMUNOLOGY" },
    ]
  },
  {
    id: 56,
    label: "Pregunta LVI de LX",
    text: "¿Qué información prioriza al analizar una muestra biológica?",
    options: [
      { id: '56a', text: "Alteraciones en la morfología celular", sigil: "", alignment: "PATHOLOGY" },
      { id: '56b', text: "Variantes genéticas y polimorfismos", sigil: "", alignment: "GENETICS" },
      { id: '56c', text: "Presencia de microorganismos patógenos", sigil: "", alignment: "MICROBIOLOGY" },
      { id: '56d', text: "Parámetros de función renal y aclaramiento", sigil: "", alignment: "NEPHROLOGY" },
    ]
  },
  {
    id: 57,
    label: "Pregunta LVII de LX",
    text: "Si se detecta una malformación congénita en un neonato:",
    options: [
      { id: '57a', text: "Corrección quirúrgica pediátrica temprana", sigil: "", alignment: "PAEDIATRIC_SURGERY" },
      { id: '57b', text: "Soporte vital neonatal intensivo", sigil: "", alignment: "NEONATOLOGY" },
      { id: '57c', text: "Asesoramiento genético a los progenitores", sigil: "", alignment: "GENETICS" },
      { id: '57d', text: "Seguimiento muldisciplinar en pediatría", sigil: "", alignment: "PEDIATRICS" },
    ]
  },
  {
    id: 58,
    label: "Pregunta LVIII de LX",
    text: "¿Cómo abordaría un trastorno en la conducción nerviosa periférica?",
    options: [
      { id: '58a', text: "Estudio de conducción nerviosa y electromiografía", sigil: "", alignment: "NEUROPHYSIOLOGY" },
      { id: '58b', text: "Tratamiento médico de la neuropatía", sigil: "", alignment: "NEUROLOGY" },
      { id: '58c', text: "Resolución quirúrgica de síndromes de atrapamiento", sigil: "", alignment: "NEUROSURGERY" },
      { id: '58d', text: "Manejo del dolor neuropático persistente", sigil: "", alignment: "PALLIATIVE" },
    ]
  },
  {
    id: 59,
    label: "Pregunta LIX de LX",
    text: "¿Cuál es el pilar que sostiene su práctica profesional?",
    options: [
      { id: '59a', text: "La precisión técnica del acto médico", sigil: "", alignment: "SURGERY" },
      { id: '59b', text: "El razonamiento clínico profundo", sigil: "", alignment: "INTERNAL_MEDICINE" },
      { id: '59c', text: "La atención centrada en la persona", sigil: "", alignment: "FAMILY_MEDICINE" },
      { id: '59d', text: "La generación de evidencia científica", sigil: "", alignment: "RESEARCH" },
    ]
  },
  {
    id: 60,
    label: "Pregunta LX de LX",
    text: "¿En qué entorno se siente más realizado profesionalmente?",
    options: [
      { id: '60a', text: "En áreas de cuidados críticos y agudos", sigil: "", alignment: "EMERGENCY" },
      { id: '60b', text: "En el análisis diagnóstico microscópico", sigil: "", alignment: "PATHOLOGY" },
      { id: '60c', text: "En la gestión integral de la salud comunitaria", sigil: "", alignment: "FAMILY_MEDICINE" },
      { id: '60d', text: "En la restauración estética y funcional tisular", sigil: "", alignment: "PLASTIC_SURGERY" },
    ]
  }
];

export const SPECIALTIES_MAP: Record<string, Specialty> = {
  "SURGERY": {
    id: "SURGERY",
    name: "Cirugía General",
    description: "Para profesionales con alta capacidad técnica y decisión clínica. Se centra en la intervención directa y la resolución manual de patologías estructurales.",
    alternatives: ["Traumatología", "Urología"],
    rationale: "Su capacidad de concentración y destreza técnica son fundamentales para el éxito en el quirófano.",
    hogwartsHouse: "Slytherin"
  },
  "EMERGENCY": {
    id: "EMERGENCY",
    name: "Medicina de Urgencias y Emergencias",
    description: "Especialidad dedicada a la estabilización inmediata de pacientes con compromiso vital agudo. Requiere rapidez mental y gestión del estrés.",
    alternatives: ["Medicina Intensiva", "Anestesiología"],
    rationale: "Su capacidad de respuesta bajo presión y pensamiento ágil son ideales para el entorno de urgencias.",
    hogwartsHouse: "Gryffindor"
  },
  "INTERNAL_MEDICINE": {
    id: "INTERNAL_MEDICINE",
    name: "Medicina Interna",
    description: "Especialidad troncal de carácter integral. Se enfoca en el diagnóstico complejo y la gestión de pacientes pluripatológicos mediante el razonamiento deductivo.",
    alternatives: ["Oncología", "Infectología"],
    rationale: "Su enfoque analítico y metódico le permite resolver los enigmas diagnósticos más complejos.",
    hogwartsHouse: "Ravenclaw"
  },
  "PSYCHIATRY": {
    id: "PSYCHIATRY",
    name: "Psiquiatría",
    description: "Dedicada al estudio y tratamiento de los trastornos mentales. Requiere una profunda comprensión de la conducta humana y la neuroquímica social.",
    alternatives: ["Neurología", "Psicología Clínica"],
    rationale: "Su empatía y capacidad para interpretar la comunicación no verbal son esenciales en salud mental.",
    hogwartsHouse: "Ravenclaw"
  },
  "PEDIATRICS": {
    id: "PEDIATRICS",
    name: "Pediatría",
    description: "Especialidad centrada en el desarrollo y la salud desde el nacimiento hasta la adolescencia. Combina medicina clínica con prevención y desarrollo.",
    alternatives: ["Neonatología", "Medicina Familiar"],
    rationale: "Su sensibilidad hacia el desarrollo humano y su paciencia lo vinculan con el cuidado infantil.",
    hogwartsHouse: "Hufflepuff"
  },
  "FAMILY_MEDICINE": {
    id: "FAMILY_MEDICINE",
    name: "Medicina Familiar y Comunitaria",
    description: "Eje del sistema de salud. Enfocada en la atención primaria, la continuidad asistencial y la relación médico-paciente a largo plazo.",
    alternatives: ["Geriatría", "Medicina Comunitaria"],
    rationale: "Su visión holística del individuo y su entorno lo posicionan como el líder de la atención primaria.",
    hogwartsHouse: "Hufflepuff"
  },
  "CARDIOLOGY": {
    id: "CARDIOLOGY",
    name: "Cardiología",
    description: "Estudio del sistema cardiovascular. Combina el manejo clínico de patologías crónicas con procedimientos intervencionistas de alta complejidad.",
    alternatives: ["Cirugía Cardiovascular", "Hemodinámica"],
    rationale: "Su interés por la hemodinámica y la fisiología cardiovascular lo sitúa en el centro de la medicina crítica.",
    hogwartsHouse: "Slytherin"
  },
  "TRAUMATOLOGY": {
    id: "TRAUMATOLOGY",
    name: "Cirugía Ortopédica y Traumatología",
    description: "Tratamiento quirúrgico y médico del aparato locomotor. Se centra en la restauración funcional de la estructura ósea y muscular.",
    alternatives: ["Rehabilitación", "Medicina del Deporte"],
    rationale: "Su sentido de la estructura y su enfoque en la restauración funcional mecánica son sus mejores bazas.",
    hogwartsHouse: "Gryffindor"
  },
  "PATHOLOGY": {
    id: "PATHOLOGY",
    name: "Anatomía Patológica",
    description: "El diagnóstico definitivo mediante el estudio de tejidos descansa en esta especialidad. Fundamental para el manejo oncológico y la investigación clínica.",
    alternatives: ["Medicina Legal", "Microbiología"],
    rationale: "Su atención al detalle microscópico es decisiva para determinar el tratamiento adecuado.",
    hogwartsHouse: "Ravenclaw"
  },
  "RADIOLOGY": {
    id: "RADIOLOGY",
    name: "Radiodiagnóstico",
    description: "Uso de tecnologías de imagen para el diagnóstico y tratamiento. Es el soporte visual indispensable de la medicina moderna.",
    alternatives: ["Medicina Nuclear", "Radioterapia"],
    rationale: "Su capacidad de abstracción espacial y destreza interpretativa lo definen como un radiólogo nato.",
    hogwartsHouse: "Ravenclaw"
  },
  "RESEARCH": {
    id: "RESEARCH",
    name: "Investigación Biomédica",
    description: "Desarrollo de conocimiento científico básico y aplicado. Imprescindible para el avance de terapias y la comprensión de enfermedades.",
    alternatives: ["Farmacología", "Epidemiología"],
    rationale: "Su curiosidad científica y rigor metodológico impulsan el progreso de la medicina.",
    hogwartsHouse: "Ravenclaw"
  },
  "PALLIATIVE": {
    id: "PALLIATIVE",
    name: "Cuidados Paliativos",
    description: "Gestión de la calidad de vida y el control de síntomas en pacientes con enfermedades avanzadas. Humanismo y bienestar ante todo.",
    alternatives: ["Geriatría", "Algología"],
    rationale: "Su compasión y capacidad para gestionar el final de la vida aportan dignidad al proceso asistencial.",
    hogwartsHouse: "Hufflepuff"
  },
  "GENETICS": {
    id: "GENETICS",
    name: "Genética Clínica",
    description: "Diagnóstico y asesoramiento en enfermedades hereditarias. Analiza las bases fundamentales de la salud desde el genograma.",
    alternatives: ["Reproducción Asistida", "Embriología"],
    rationale: "Su fascinación por los mecanismos moleculares y la herencia biológica lo guían aquí.",
    hogwartsHouse: "Ravenclaw"
  },
  "DERMATOLOGY": {
    id: "DERMATOLOGY",
    name: "Dermatología Médico-Quirúrgica",
    description: "Diagnóstico y tratamiento de patologías cutáneas. Combina el diagnóstico visual con la cirugía menor y la estética.",
    alternatives: ["Alergología", "Cirugía Plástica"],
    rationale: "Su agudeza visual y capacidad de diagnóstico macroscópico son características de esta especialidad.",
    hogwartsHouse: "Slytherin"
  },
  "NEUROLOGY": {
    id: "NEUROLOGY",
    name: "Neurología",
    description: "Estudio del sistema nervioso central y periférico. Se encarga de patologías complejas como el ictus, parkinson o demencias.",
    alternatives: ["Neurocirugía", "Neurofisiología"],
    rationale: "Su interés por el sistema más complejo de la biología humana lo dirige al estudio neurológico.",
    hogwartsHouse: "Ravenclaw"
  },
  "GYNAECOLOGY": {
    id: "GYNAECOLOGY",
    name: "Obstetricia y Ginecología",
    description: "Cuidado integral de la salud de la mujer y el proceso de gestación. Una especialidad médico-quirúrgica de gran responsabilidad.",
    alternatives: ["Medicina Fetal", "Reproducción"],
    rationale: "Su compromiso con la salud reproductiva y el inicio del ciclo vital son su motor profesional.",
    hogwartsHouse: "Gryffindor"
  },
  "OPHTHALMOLOGY": {
    id: "OPHTHALMOLOGY",
    name: "Oftalmología",
    description: "Tratamiento de las patologías del ojo y anexos. Combina el manejo clínico con la microcirugía de alta precisión.",
    alternatives: ["Optometría Avanzada"],
    rationale: "Su valoración de la visión como función crítica lo enfoca hacia la salud ocular.",
    hogwartsHouse: "Slytherin"
  },
  "ONCOLOGY": {
    id: "ONCOLOGY",
    name: "Oncología Médica",
    description: "Tratamiento sistémico del cáncer. Coordina terapias complejas en un entorno multidisciplinar de alta carga emocional.",
    alternatives: ["Radioterapia", "Hematología"],
    rationale: "Su determinación y resiliencia en la lucha contra la enfermedad sistémica son ejemplares.",
    hogwartsHouse: "Ravenclaw"
  },
  "ENDOCRINOLOGY": {
    id: "ENDOCRINOLOGY",
    name: "Endocrinología y Nutrición",
    description: "Estudio del sistema hormonal y el metabolismo. Vital para el manejo de patologías prevalentes como la diabetes y la obesidad.",
    alternatives: ["Nutrición", "Diabetología"],
    rationale: "Su comprensión de los equilibrios metabólicos finos lo define como un clínico sistémico.",
    hogwartsHouse: "Ravenclaw"
  },
  "GASTROENTEROLOGY": {
    id: "GASTROENTEROLOGY",
    name: "Aparato Digestivo",
    description: "Estudio de las patologías del tracto digestivo y glándulas anejas. Combina clínica con técnicas endoscópicas.",
    alternatives: ["Hepatología", "Endoscopia Digestiva"],
    rationale: "Su capacidad diagnóstica en sistemas de procesamiento nutricional es muy alta.",
    hogwartsHouse: "Ravenclaw"
  },
  "UROLOGY": {
    id: "UROLOGY",
    name: "Urología",
    description: "Especialidad quirúrgica que trata el aparato urinario y reproductor masculino. Amplio rango de patología oncológica y funcional.",
    alternatives: ["Nefrología", "Andrología"],
    rationale: "Su enfoque resolutivo y técnico se ajusta perfectamente al perfil urológico.",
    hogwartsHouse: "Slytherin"
  },
  "NEPHROLOGY": {
    id: "NEPHROLOGY",
    name: "Nefrología",
    description: "Estudio de la función renal y el equilibrio hidroelectrolítico. Clave en el manejo de la hipertensión y el paciente crítico.",
    alternatives: ["Diálisis", "Hipertensión Arterial"],
    rationale: "Su precisión en el manejo de volúmenes y filtrado biológico es sobresaliente.",
    hogwartsHouse: "Ravenclaw"
  },
  "PULMONOLOGY": {
    id: "PULMONOLOGY",
    name: "Neumología",
    description: "Tratamiento de las enfermedades del aparato respiratorio. Fundamental en patología infecciosa, obstructiva y oncológica torácica.",
    alternatives: ["Alergología", "Neumología Intervencionista"],
    rationale: "Su prioridad por la función respiratoria esencial lo guía hacia esta especialidad.",
    hogwartsHouse: "Ravenclaw"
  },
  "RHEUMATOLOGY": {
    id: "RHEUMATOLOGY",
    name: "Reumatología",
    description: "Estudio de las enfermedades autoinmunes sistémicas y del aparato locomotor de carácter no quirúrgico.",
    alternatives: ["Rehabilitación", "Inmunología"],
    rationale: "Su interés por los procesos inflamatorios complejos y la movilidad funcional lo definen.",
    hogwartsHouse: "Ravenclaw"
  },
  "HEMATOLOGY": {
    id: "HEMATOLOGY",
    name: "Hematología y Hemoterapia",
    description: "Diagnóstico y tratamiento de las enfermedades de la sangre y órganos hematopoyéticos. Incluye el manejo de laboratorios y trasplantes.",
    alternatives: ["Hemoterapia", "Inmunología"],
    rationale: "Su interés por la fisiología sanguínea y onco-hematología lo posiciona en esta rama.",
    hogwartsHouse: "Ravenclaw"
  },
  "ANESTHESIOLOGY": {
    id: "ANESTHESIOLOGY",
    name: "Anestesiología y Reanimación",
    description: "Control del soporte vital y el dolor durante procesos quirúrgicos. El anestesista es el guardián de la homeostasis Intraoperatoria.",
    alternatives: ["Unidad del Dolor", "Reanimación Postquirúrgica"],
    rationale: "Su control sobre variables críticas y serenidad en quirófano son sus mayores activos.",
    hogwartsHouse: "Gryffindor"
  },
  "INFECTOLOGY": {
    id: "INFECTOLOGY",
    name: "Enfermedades Infecciosas",
    description: "Diagnóstico y manejo de patologías causadas por agentes biológicos. Crucial para la salud pública y el manejo del paciente complejo.",
    alternatives: ["Microbiología", "Epidemiología"],
    rationale: "Su capacidad de rastreo etiológico y lucha contra patógenos lo hacen un infectólogo ideal.",
    hogwartsHouse: "Ravenclaw"
  },
  "IMMUNOLOGY": {
    id: "IMMUNOLOGY",
    name: "Inmunología",
    description: "Estudio del sistema de defensa biológica. Clave para entender trasplantes, vacunas y enfermedades autoinmunes.",
    alternatives: ["Alergología", "Investigación Clínica"],
    rationale: "Su interés por los mecanismos de reconocimiento molecular y defensa sistémica es clave.",
    hogwartsHouse: "Ravenclaw"
  },
  "GERIATRICS": {
    id: "GERIATRICS",
    name: "Geriatría",
    description: "Atención integral al anciano, enfocada en mantener la funcionalidad y gestionar la fragilidad en la etapa final de la vida.",
    alternatives: ["Cuidados Paliativos", "Neurología"],
    rationale: "Su respeto por el envejecimiento activo y cuidado integral lo vinculan con esta etapa vital.",
    hogwartsHouse: "Hufflepuff"
  },
  "REHAB": {
    id: "REHAB",
    name: "Medicina Física y Rehabilitación",
    description: "Diagnóstico y tratamiento de la discapacidad funcional. El objetivo es restaurar la máxima capacidad física y social del individuo.",
    alternatives: ["Fisiatría", "Traumatología"],
    rationale: "Su perseverancia en la recuperación funcional del paciente es el motor de su carrera.",
    hogwartsHouse: "Hufflepuff"
  },
  "PLASTIC_SURGERY": {
    id: "PLASTIC_SURGERY",
    name: "Cirugía Plástica, Estética y Reparadora",
    description: "Intervenciones que buscan la restauración de la función y la forma tras traumatismos, cáncer o anomalías congénitas.",
    alternatives: ["Cirugía de Quemados", "Microcirugía"],
    rationale: "Su equilibrio entre estética funcional y técnica reconstructiva lo definen.",
    hogwartsHouse: "Slytherin"
  },
  "INTENSIVE_CARE": {
    id: "INTENSIVE_CARE",
    name: "Medicina Intensiva",
    description: "Cuidado de los pacientes más críticos del hospital. Monitorización avanzada y soporte técnico vital constante.",
    alternatives: ["Anestesiología", "Urgencias"],
    rationale: "Su resistencia al estrés y control de situaciones límite son excepcionales.",
    hogwartsHouse: "Gryffindor"
  },
  "NUCLEAR_MEDICINE": {
    id: "NUCLEAR_MEDICINE",
    name: "Medicina Nuclear",
    description: "Uso de radiotrazadores para diagnóstico funcional y tratamiento metabólico selectivo.",
    alternatives: ["Radiodiagnóstico", "Imagen Molecular"],
    rationale: "Su visión moderna del diagnóstico funcional a nivel molecular lo posiciona aquí.",
    hogwartsHouse: "Ravenclaw"
  },
  "LEGAL_MEDICINE": {
    id: "LEGAL_MEDICINE",
    name: "Medicina Legal y Forense",
    description: "Aplicación del conocimiento médico con fines judiciales y periciales. Es la voz experta ante la ley.",
    alternatives: ["Toxicología", "Antropología Forense"],
    rationale: "Su rigor metodológico y búsqueda de la evidencia fáctica lo guían al ámbito forense.",
    hogwartsHouse: "Ravenclaw"
  },
  "ALLERGOLOGY": {
    id: "ALLERGOLOGY",
    name: "Alergología",
    description: "Tratamiento de las reacciones de hipersensibilidad. Analiza la interacción del organismo con agentes externos alergénicos.",
    alternatives: ["Inmunología", "Dermatología"],
    rationale: "Su detalle en la identificación de desencadenantes externos le da una ventaja clínica.",
    hogwartsHouse: "Ravenclaw"
  },
  "TOXICOLOGY": {
    id: "TOXICOLOGY",
    name: "Toxicología Clínica",
    description: "Manejo de intoxicaciones y estudio del efecto de sustancias químicas en el organismo humano.",
    alternatives: ["Farmacología", "Medicina Legal"],
    rationale: "Su conocimiento sobre las interacciones químicas y su toxicidad es su pilar.",
    hogwartsHouse: "Ravenclaw"
  },
  "MAXILLOFACIAL": {
    id: "MAXILLOFACIAL",
    name: "Cirugía Oral y Maxilofacial",
    description: "Especialidad médica de base quirúrgica que trata las patologías de la cara, boca, cabeza y cuello.",
    alternatives: ["Odontología Especializada", "Cirugía Plástica"],
    rationale: "Su destreza en estructuras complejas cráneo-faciales es la de un cirujano de élite.",
    hogwartsHouse: "Slytherin"
  },
  "NEONATOLOGY": {
    id: "NEONATOLOGY",
    name: "Neonatología",
    description: "Cuidado del recién nacido en situaciones de riesgo o patología, especialmente en grandes prematuros.",
    alternatives: ["Pediatría", "Medicina Intensiva Pediátrica"],
    rationale: "Su especial atención a los primeros momentos de la vida y su fragilidad lo definen.",
    hogwartsHouse: "Gryffindor"
  },
  "MICROBIOLOGY": {
    id: "MICROBIOLOGY",
    name: "Microbiología Clínica",
    description: "Diagnóstico de agentes patógenos e identificación de resistencias antimicrobianas. Base del control de infecciones.",
    alternatives: ["Infectología", "Patología"],
    rationale: "Su interés por el mundo microscópico y la etiología biológica es fundamental.",
    hogwartsHouse: "Ravenclaw"
  },
  "PREVENTIVE": {
    id: "PREVENTIVE",
    name: "Medicina Preventiva y Salud Pública",
    description: "Especialidad enfocada en la promoción de salud y prevención de enfermedades a nivel poblacional.",
    alternatives: ["Epidemiología", "Salud Comunitaria"],
    rationale: "Su visión estratégica y comunitaria prioriza la salud del colectivo ante todo.",
    hogwartsHouse: "Ravenclaw"
  },
  "OCCUPATIONAL": {
    id: "OCCUPATIONAL",
    name: "Medicina del Trabajo",
    description: "Enfocada en la salud de los trabajadores y la prevención de riesgos laborales vinculados a la actividad profesional.",
    alternatives: ["Prevención de Riesgos", "Ergonomía"],
    rationale: "Su enfoque en el bienestar en el entorno laboral asegura la sostenibilidad del esfuerzo humano.",
    hogwartsHouse: "Hufflepuff"
  },
  "VASCULAR": {
    id: "VASCULAR",
    name: "Angiología y Cirugía Vascular",
    description: "Tratamiento médico y quirúrgico de las patologías del sistema circulatorio, excepto el corazón.",
    alternatives: ["Radiología Intervencionista", "Cirugía General"],
    rationale: "Su habilidad técnica en la reconstrucción de conductos vitales lo sitúa aquí.",
    hogwartsHouse: "Slytherin"
  },
  "ENT": {
    id: "ENT",
    name: "Otorrinolaringología",
    description: "Tratamiento de las enfermedades del oído, nariz y laringe, así como cirugía de cabeza y cuello.",
    alternatives: ["Audiología", "Cirugía de Base de Cráneo"],
    rationale: "Su interés por los órganos de los sentidos y la comunicación humana es clave.",
    hogwartsHouse: "Slytherin"
  },
  "NEUROSURGERY": {
    id: "NEUROSURGERY",
    name: "Neurocirugía",
    description: "Especialidad quirúrgica que interviene sobre el cerebro, médula espinal y nervios periféricos.",
    alternatives: ["Neurología", "Cirugía Vertebral"],
    rationale: "Posee la destreza necesaria para operar sobre el sistema más sensible y delicado.",
    hogwartsHouse: "Slytherin"
  },
  "THORACIC_SURGERY": {
    id: "THORACIC_SURGERY",
    name: "Cirugía Torácica",
    description: "Intervenciones quirúrgicas en pulmones, pleura, mediastino y pared torácica.",
    alternatives: ["Neumología", "Cirugía Vascular"],
    rationale: "Su capacidad de gestión técnica en el espacio intratorácico es su signo distintivo.",
    hogwartsHouse: "Slytherin"
  },
  "SPORTS_MEDICINE": {
    id: "SPORTS_MEDICINE",
    name: "Medicina de la Educación Física y del Deporte",
    description: "Atención médica al deportista, prevención de lesiones y optimización del rendimiento físico.",
    alternatives: ["Traumatología", "Fisiología del Esfuerzo"],
    rationale: "Su enfoque en el rendimiento máximo y la fisiología del ejercicio lo definen.",
    hogwartsHouse: "Gryffindor"
  },
  "PHARMACOLOGY": {
    id: "PHARMACOLOGY",
    name: "Farmacología Clínica",
    description: "Especialidad centrada en el uso seguro y eficiente de los medicamentos en el ser humano.",
    alternatives: ["Investigación", "Terapéutica Médica"],
    rationale: "Su interés por la cinética y dinámica de los fármacos lo convierte en un experto en prescripción.",
    hogwartsHouse: "Ravenclaw"
  },
  "PAEDIATRIC_SURGERY": {
    id: "PAEDIATRIC_SURGERY",
    name: "Cirugía Pediátrica",
    description: "Intervenciones quirúrgicas adaptadas a la anatomía y fisiología desde el feto hasta el adolescente.",
    alternatives: ["Pediatría", "Cirugía de Malformaciones"],
    rationale: "Su adaptación técnica a los pacientes más frágiles y pequeños es su mayor virtud.",
    hogwartsHouse: "Slytherin"
  },
  "NEUROPHYSIOLOGY": {
    id: 'NEUROPHYSIOLOGY',
    name: "Neurofisiología Clínica",
    description: "Diagnóstico funcional del sistema nervioso mediante pruebas electrofisiológicas avanzadas.",
    alternatives: ["Neurología", "Neurociencia"],
    rationale: "Su interés por los registros eléctricos y el mapeo funcional neurobiológico es notable.",
    hogwartsHouse: "Ravenclaw"
  },
  "CHILD_PSYCHIATRY": {
    id: "CHILD_PSYCHIATRY",
    name: "Psiquiatría Infantil y de la Adolescencia",
    description: "Cuidado de la salud mental en las etapas clave del desarrollo infantojuvenil.",
    alternatives: ["Pediatría", "Neuropsiquiatría"],
    rationale: "Su compromiso con la formación de una psique equilibrada desde la infancia es su sello.",
    hogwartsHouse: "Hufflepuff"
  },
  "CARDIOVASCULAR_SURGERY": {
    id: "CARDIOVASCULAR_SURGERY",
    name: "Cirugía Cardiovascular",
    description: "Tratamiento quirúrgico del corazón y de los grandes vasos sanguíneos centrales.",
    alternatives: ["Cardiología", "Tecnología Extracorpórea"],
    rationale: "Su valor para intervenir sobre el órgano motor central de la vida lo define.",
    hogwartsHouse: "Gryffindor"
  }
};
