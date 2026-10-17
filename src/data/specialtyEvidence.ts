import { DimensionId } from '../types';

/**
 * Justificación interna inicial para los valores numéricos ≥ 3.
 *
 * Estas notas ayudan a mantener el catálogo coherente, pero no constituyen
 * validación clínica externa. Ninguna ficha se marca como revisada desde este
 * archivo.
 */
export const REVIEW_EVIDENCE: Record<string, Partial<Record<DimensionId, string>>> = {
  INTERNAL_MEDICINE: {
    A3: 'Combina urgencias, planta y consulta con guardias; el ritmo es variable y exige priorizar.',
    A5: 'La relación con el paciente y la familia es intensa en pluripatología y decisiones complejas.',
  },
  INTENSIVE_CARE: {
    A1: 'El diagnóstico fisiopatológico y la integración de datos prevalecen en la toma de decisiones.',
    A8: 'Requiere fisiología, monitorización y evidencia de soporte vital avanzado.',
  },
  ANESTHESIOLOGY: {
    A3: 'La actividad combina cirugía programada y urgencias, con guardias y presión temporal.',
  },
  SURGERY: {
    A3: 'Alterna cirugía programada y urgente; las guardias y la disponibilidad condicionan el ritmo.',
  },
  TRAUMATOLOGY: {
    A3: 'La urgencia traumatológica y las guardias son parte central del servicio.',
  },
  RADIOLOGY: {
    A8: 'Integra anatomía, física de la imagen y tecnología para interpretar estudios.',
  },
  PSYCHIATRY: {
    A1: 'El razonamiento clínico se centra en la formulación biopsicosocial y el diagnóstico longitudinal.',
  },
  PEDIATRICS: {
    A1: 'El diagnóstico pediátrico exige integrar desarrollo, contexto familiar y presentación atípica.',
    A3: 'Combina consulta programada, urgencias pediátricas y guardias.',
    A5: 'La relación con el niño y su familia es intensa y continua.',
  },
  PALLIATIVE: {
    A1: 'El razonamiento se orienta a control de síntomas, pronóstico y decisiones compartidas.',
  },
  CARDIOLOGY: {
    A4: 'Seguimiento longitudinal de insuficiencia cardiaca, arritmias y prevención secundaria.',
    A5: 'Relación clínica intensa en consulta, planta y decisiones de revascularización.',
    A8: 'Integra fisiología cardiovascular, imagen, hemodinámica y ensayos clínicos.',
  },
  GASTROENTEROLOGY: {
    A1: 'Diagnóstico diferencial amplio con endoscopia, imagen y datos analíticos.',
    A5: 'Contacto directo en consulta, endoscopia y seguimiento de enfermedad digestiva.',
    A8: 'Combina fisiología digestiva, hepatología, endoscopia y evidencia.',
  },
  PULMONOLOGY: {
    A1: 'Integra síntomas, función pulmonar, imagen y diagnóstico diferencial.',
    A4: 'Seguimiento de asma, EPOC, fibrosis quística y enfermedad intersticial.',
    A5: 'Relación clínica en consulta, hospitalización y técnicas broncoscópicas.',
  },
  NEPHROLOGY: {
    A2: 'Accesos vasculares, biopsia renal y técnicas de diálisis forman parte del trabajo.',
    A5: 'Relación longitudinal intensa en enfermedad renal crónica y diálisis.',
    A8: 'Requiere fisiología renal, inmunología, farmacología y manejo de líquidos.',
  },
  ENDOCRINOLOGY: {
    A1: 'Razonamiento fisiopatológico y diagnóstico diferencial hormonal.',
    A5: 'Consulta longitudinal y educación terapéutica en enfermedades crónicas.',
  },
  NEUROLOGY: {
    A5: 'La exploración y la relación clínica son centrales en enfermedades neurológicas crónicas.',
    A8: 'Integra neuroanatomía, fisiología, imagen y neurofisiología.',
  },
  HEMATOLOGY: {
    A1: 'Diagnóstico integrado de citopenias, neoplasias hematológicas y coagulopatías.',
    A2: 'Médula ósea, biopsias, aféresis y procedimientos diagnósticos y terapéuticos.',
    A4: 'Seguimiento prolongado de neoplasias, hemoglobinopatías y trasplante.',
    A5: 'Relación intensa en enfermedad hematológica maligna y crónica.',
  },
  ONCOLOGY: {
    A1: 'Razonamiento diagnóstico y toma de decisiones oncológicas complejas.',
    A5: 'Relación longitudinal intensa con paciente y familia durante tratamiento y final de vida.',
    A8: 'Integra biología tumoral, ensayos clínicos y evidencia terapéutica.',
  },
  INFECTOLOGY: {
    A4: 'Seguimiento de infecciones crónicas, VIH, tuberculosis y tratamientos prolongados.',
    A5: 'Relación clínica longitudinal, adherencia y manejo de enfermedades transmisibles.',
    A8: 'Requiere microbiología, inmunología, farmacología y epidemiología.',
  },
  RHEUMATOLOGY: {
    A1: 'Diagnóstico diferencial de enfermedades autoinmunes y sistémicas.',
    A5: 'Consulta longitudinal y relación intensa en enfermedades crónicas.',
  },
  DERMATOLOGY: {
    A1: 'Diagnóstico visual y correlación clinicopatológica.',
    A4: 'Seguimiento de dermatosis crónicas, psoriasis y neoplasias cutáneas.',
  },
  UROLOGY: {
    A4: 'Seguimiento de patología prostática, urolitiasis y neoplasias urológicas.',
  },
  OPHTHALMOLOGY: {
    A1: 'Diagnóstico visual, exploración oftalmológica e interpretación de imagen.',
  },
  ENT: {
    A1: 'Diagnóstico otorrinolaringológico con exploración y pruebas funcionales.',
    A4: 'Seguimiento de patología crónica auditiva, rinosinusal y oncológica.',
  },
  GYNAECOLOGY: {
    A1: 'Razonamiento obstétrico-ginecológico con ecografía, clínica y decisiones urgentes.',
    A2: 'Cirugía ginecológica, obstétrica y procedimientos diagnósticos.',
    A3: 'Combina guardias obstétricas, urgencias y cirugía programada.',
  },
  ALLERGOLOGY: {
    A1: 'Diagnóstico etiológico mediante historia, pruebas cutáneas y exposición.',
    A8: 'Integra inmunología, alérgenos, mecanismos de hipersensibilidad y evidencia.',
  },
  GERIATRICS: {
    A1: 'Valoración integral y razonamiento geriátrico con pluripatología y fragilidad.',
    A5: 'Relación longitudinal intensa con paciente y cuidadores.',
  },
  REHAB: {
    A5: 'Relación terapéutica prolongada y trabajo con equipo multidisciplinar.',
  },
  PLASTIC_SURGERY: {
    A4: 'Seguimiento de reconstrucción, cicatrización y resultados funcionales y estéticos.',
    A5: 'La relación clínica y las expectativas del paciente son centrales.',
  },
  MAXILLOFACIAL: {
    A4: 'Seguimiento de cirugía oral, traumatología facial y reconstrucción.',
    A5: 'Contacto clínico y quirúrgico longitudinal con el paciente.',
  },
  PAEDIATRIC_SURGERY: {
    A3: 'Combina cirugía pediátrica programada, urgencias y guardias.',
    A4: 'Seguimiento del paciente pediátrico y de malformaciones congénitas.',
    A5: 'Relación con el niño y la familia en un contexto quirúrgico.',
  },
  NEUROSURGERY: {
    A1: 'Razonamiento neuroanatómico y toma de decisiones quirúrgicas complejas.',
    A4: 'Seguimiento de patología neuroquirúrgica y rehabilitación.',
  },
  NUCLEAR_MEDICINE: {
    A1: 'Interpretación fisiopatológica de estudios funcionales y moleculares.',
  },
  MICROBIOLOGY: {
    A1: 'Razonamiento microbiológico para identificar agentes y resistencias.',
  },
  IMMUNOLOGY: {
    A4: 'Seguimiento de inmunodeficiencias y enfermedades autoinmunes.',
  },
  GENETICS: {
    A1: 'Razonamiento genético, interpretación de variantes y consejo.',
    A5: 'Relación clínica en consejo genético y enfermedades hereditarias.',
  },
  PREVENTIVE: {
    A1: 'Razonamiento poblacional y epidemiológico para diseñar intervenciones.',
  },
  OCCUPATIONAL: {
    A1: 'Valoración de riesgo laboral y relación entre salud y trabajo.',
  },
  PHARMACOLOGY: {
    A1: 'Razonamiento farmacológico y evaluación de evidencia terapéutica.',
  },
  SPORTS_MEDICINE: {
    A5: 'Relación clínica con deportistas y equipos multidisciplinares.',
    A8: 'Integra fisiología del ejercicio, biomecánica y evidencia de rehabilitación.',
  },
  RESEARCH: {
    A1: 'Diseño y análisis de estudios biomédicos como actividad central.',
  },
  TOXICOLOGY: {
    A1: 'Razonamiento toxicológico y diagnóstico de exposiciones.',
  },
  NEONATOLOGY: {
    A1: 'Razonamiento fisiopatológico en el recién nacido y la prematuridad.',
    A4: 'Seguimiento del neonato y su desarrollo durante la hospitalización.',
    A5: 'Relación intensa con el recién nacido y su familia.',
    A8: 'Requiere fisiología neonatal, farmacología y evidencia.',
  },
  CHILD_PSYCHIATRY: {
    A1: 'Formulación biopsicosocial y diagnóstico longitudinal en la infancia.',
    A5: 'Relación terapéutica intensa con el niño, la familia y el entorno.',
  },
};
