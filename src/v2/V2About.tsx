import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ScrollText,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Brain,
  Activity,
  Heart,
  Clock,
  Sparkles,
  Target,
  Compass,
  Flame,
  Shield,
  Eye,
  CheckCircle2,
  Stethoscope,
  Layers,
  HelpCircle,
  FileText,
} from 'lucide-react';

interface V2AboutProps {
  onOpenCatalog: () => void;
  onStartTest?: () => void;
}

type TabKey = 'manifiesto' | 'casas' | 'dimensiones' | 'metodologia' | 'etica';

interface DimensionItem {
  code: string;
  label: string;
  question: string;
  description: string;
  example: string;
}

interface DimensionPillar {
  title: string;
  icon: typeof Brain;
  color: string;
  borderColor: string;
  bgColor: string;
  badgeColor: string;
  summary: string;
  items: DimensionItem[];
}

const DIMENSION_PILLARS: DimensionPillar[] = [
  {
    title: 'Pilar I: Razonamiento & Destreza Técnica',
    icon: Brain,
    color: 'text-amber-300',
    borderColor: 'border-amber-400/30',
    bgColor: 'bg-amber-950/20',
    badgeColor: 'bg-amber-500/20 text-amber-200 border-amber-400/30',
    summary: 'Cómo procesa tu mente la información y el papel que desempeñan tus manos en el acto médico.',
    items: [
      {
        code: 'A1',
        label: 'Estilo Cognitivo',
        question: '¿Integrar y diagnosticar o resolver técnicamente?',
        description:
          'Distingue a los especialistas volcados en la deducción clínica compleja, la fisiopatología y la semiología frente a quienes disfrutan de la resolución física, inmediata y táctil.',
        example: 'Ejemplo: Medicina Interna (razonamiento deductivo) vs Traumatología (resolución estructural).',
      },
      {
        code: 'A2',
        label: 'Procedimientos e Intervención',
        question: '¿Qué peso deben tener las técnicas invasivas en tu día a día?',
        description:
          'Mide la necesidad de manipular instrumental, realizar endoscopias, punciones, ecografías guiadas o cirugía abierta frente a una práctica primordialmente intelectual y farmacológica.',
        example: 'Ejemplo: Cardiología Intervencionista o Digestivo vs Psiquiatría o Endocrinología.',
      },
      {
        code: 'A8',
        label: 'Sustrato Científico Dominante',
        question: '¿Anatomía y biomecánica o mecanismos celulares y moleculares?',
        description:
          'Evalúa si tu fascinación nace del mapa anatómico macroscópico y la física de tejidos o de las cascadas inmunológicas, la farmacocinética y la genética.',
        example: 'Ejemplo: Cirugía Plástica y Neurocirugía vs Inmunología, Hematología y Oncología Médica.',
      },
    ],
  },
  {
    title: 'Pilar II: Dinámica Asistencial & Relación Humana',
    icon: Heart,
    color: 'text-rose-300',
    borderColor: 'border-rose-400/30',
    bgColor: 'bg-rose-950/20',
    badgeColor: 'bg-rose-500/20 text-rose-200 border-rose-400/30',
    summary: 'El ritmo cardíaco de tu jornada y la intensidad del vínculo terapéutico que mantienes con las personas.',
    items: [
      {
        code: 'A3',
        label: 'Ritmo Asistencial y Adrenalina',
        question: '¿Agenda programada y predecible o urgencia continua e imprevisibilidad?',
        description:
          'Contrapone la actividad serena de consultas programadas de 8:00 a 15:00 frente a la constante cascada de alarmas, boxes de paradas y descompensaciones agudas impredecibles.',
        example: 'Ejemplo: Dermatología o Reumatología vs Medicina Intensiva (UCI) o Urgencias Hospitalarias.',
      },
      {
        code: 'A4',
        label: 'Continuidad Longitudinal',
        question: '¿Episodios agudos y resolutivos o seguimiento durante décadas?',
        description:
          'Mide si prefieres resolver un problema concreto en horas o días y no volver a ver al paciente, o acompañar a personas y familias enteras a lo largo de las etapas de su vida.',
        example: 'Ejemplo: Anestesiología o Urgencias (episódico) vs Medicina Familiar o Pediatría (longitudinal).',
      },
      {
        code: 'A5',
        label: 'Contacto Clínico Directo',
        question: '¿Vínculo cara a cara continuo o trabajo técnico y de laboratorio?',
        description:
          'Determina el balance óptimo entre explorar y hablar con pacientes en consulta o trabajar en laboratorios, salas de imagen diagnóstica o microscopios sin trato directo.',
        example: 'Ejemplo: Oncología, Geriatría o Psiquiatría vs Radiodiagnóstico, Anatomía Patológica o Bioquímica.',
      },
    ],
  },
  {
    title: 'Pilar III: El Paciente & el Entorno Físico',
    icon: Stethoscope,
    color: 'text-emerald-300',
    borderColor: 'border-emerald-400/30',
    bgColor: 'bg-emerald-950/20',
    badgeColor: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30',
    summary: 'A quién atiendes, en qué espacio pasas tu jornada y con qué amplitud de enfoque anatómico.',
    items: [
      {
        code: 'A6',
        label: 'Población y Rango de Edad',
        question: '¿Infancia, senescencia, adultos o pacientes en fases críticas?',
        description:
          'Identifica tu afinidad por etapas vitales específicas con sus particularidades emocionales y de comunicación (neonatos, niños, ancianos polimedicados, adultos jóvenes).',
        example: 'Ejemplo: Pediatría y sus subespecialidades vs Geriatría o Medicina del Trabajo.',
      },
      {
        code: 'A7',
        label: 'Objetivo Terapéutico Principal',
        question: '¿Curar, paliar, controlar, restaurar o diagnosticar con exactitud?',
        description:
          'Refleja la gratificación vocacional que buscas: la curación anatómica radical, el control de la cronicidad compleja, el alivio del dolor y la dignidad terminal, o el hallazgo de la verdad diagnóstica.',
        example: 'Ejemplo: Cirugía Pediátrica (curación) vs Cuidados Paliativos (alivio) vs Radiología (diagnóstico).',
      },
      {
        code: 'A9',
        label: 'Entorno Físico de Trabajo',
        question: '¿Quirófano, UCI, consulta monográfica, centro de salud o laboratorio?',
        description:
          'El espacio donde pasas 40 horas semanales condiciona el ruido, la luz natural, la ergonomía física, el calzado y el nivel de estimulación sensorial.',
        example: 'Ejemplo: Quirófano esterilizado vs Centro de Salud comunitario vs Cabina de informes de TAC.',
      },
      {
        code: 'A10',
        label: 'Enfoque Sistémico vs Focal',
        question: '¿La totalidad del organismo o la máxima profundidad en un solo órgano?',
        description:
          'Mide la preferencia por comprender la interacción entre todos los órganos del cuerpo humano frente al dominio absoluto y microscópico de una estructura concreta.',
        example: 'Ejemplo: Medicina Interna y Familia (holístico) vs Oftalmología o Nefrología (focalizado).',
      },
    ],
  },
  {
    title: 'Pilar IV: Sostenibilidad Vital & Psicología Médica',
    icon: ShieldCheck,
    color: 'text-sky-300',
    borderColor: 'border-sky-400/30',
    bgColor: 'bg-sky-950/20',
    badgeColor: 'bg-sky-500/20 text-sky-200 border-sky-400/30',
    summary: 'La resistencia al desgaste psíquico, el régimen de guardias y la conciliación con tu vida.',
    items: [
      {
        code: 'C1',
        label: 'Tolerancia Emocional & Incertidumbre',
        question: '¿Cómo convives con la muerte, el sufrimiento extremo y las zonas grises?',
        description:
          'Analiza tu capacidad para procesar pronósticos fatales, errores inevitables, tomas de decisiones con información incompleta y la presión de familias angustiadas.',
        example: 'Ejemplo: Oncología, Medicina Paliativa y UCI exigen una sólida resiliencia psíquica.',
      },
      {
        code: 'C2',
        label: 'Condiciones Laborales & Guardias de 24h',
        question: '¿Qué peaje en horas nocturnas y fines de semana estás dispuesto a asumir?',
        description:
          'Pondera la carga real de guardias presenciales de 24h, la alteración del ritmo circadiano, la disponibilidad fuera de jornada y la facilidad para investigar o compatibilizar con familia.',
        example: 'Ejemplo: Neurocirugía (alta demanda de guardias) vs Medicina Preventiva o Dermatología (sin guardias).',
      },
    ],
  },
];

const HOUSES_DETAILED = [
  {
    id: 'HIPOCRATES',
    name: 'Casa de Hipócrates',
    title: 'Los Guardianes de la Clínica Sistémica',
    motto: 'Primum non nocere, semper curare',
    color: 'text-emerald-300',
    border: 'border-emerald-500/40',
    bg: 'bg-emerald-950/25',
    tagBg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    description:
      'Herederos de la medicina hipocrática tradicional. Su fuerza reside en la visión integral del ser humano: no ven órganos aislados, sino biografías enteras. Dominan la semiología clásica, la escucha atenta y el acompañamiento durante años.',
    values: ['Visión Biopsicosocial', 'Continuidad Asistencial', 'Empatía Terapéutica', 'Compromiso Comunitario'],
    specialties: ['Medicina de Familia', 'Medicina Interna', 'Pediatría', 'Geriatría', 'Psiquiatría'],
  },
  {
    id: 'QUIRON',
    name: 'Casa de Quirón',
    title: 'Los Artífices de la Precisión Quirúrgica',
    motto: 'Mens agilis, manus certa',
    color: 'text-rose-300',
    border: 'border-rose-500/40',
    bg: 'bg-rose-950/25',
    tagBg: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    description:
      'Inspirados en Quirón, el centauro sabio maestro de la cirugía y la anatomía. Son los médicos del quirófano y la intervención: donde la mente concibe la estrategia y las manos ejecutan con precisión milimétrica sobre el tejido vivo.',
    values: ['Destreza Instrumental', 'Resolución Mecánica', 'Sangre Fría en Quirófano', 'Perfeccionismo Técnico'],
    specialties: ['Cirugía General', 'Traumatología', 'Neurocirugía', 'Urología', 'Oftalmología', 'Cirugía Cardiovascular'],
  },
  {
    id: 'MINERVA',
    name: 'Casa de Minerva',
    title: 'Los Eruditos del Razonamiento Diagnóstico',
    motto: 'Scientia est lux in tenebris',
    color: 'text-amber-300',
    border: 'border-amber-500/40',
    bg: 'bg-amber-950/25',
    tagBg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    description:
      'Bajo la égida de Minerva, diosa de la sabiduría y el intelecto. Su hábitat es la frontera del conocimiento: descifrar enigmas diagnósticos, interrogar imágenes axiales complejas, patrones histológicos y biomarcadores moleculares.',
    values: ['Rigor Analítico', 'Deducción Diferencial', 'Ciencia Molecular', 'Escrutinio Metodológico'],
    specialties: ['Radiodiagnóstico', 'Anatomía Patológica', 'Hematología', 'Inmunología', 'Farmacología Clínica'],
  },
  {
    id: 'ASCLEPIO',
    name: 'Casa de Asclepio',
    title: 'Los Titanes del Soporte Vital & la Emergencia',
    motto: 'In extremis virtus resplendet',
    color: 'text-cyan-300',
    border: 'border-cyan-500/40',
    bg: 'bg-cyan-950/25',
    tagBg: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    description:
      'Hijos de la acción inmediata y la hemodinámica crítica. Cuando las constantes vitales colapsan y el tiempo se mide en segundos, estos especialistas no titubean: canalizan la adrenalina en decisiones lúcidas que devuelven la vida del abismo.',
    values: ['Acción Inmediata', 'Manejo del Caos', 'Soporte Hemodinámico', 'Liderazgo en Crisis'],
    specialties: ['Medicina Intensiva (UCI)', 'Anestesiología & Reanimación', 'Urgencias y Emergencias', 'Cardiología Aguda'],
  },
];

export function V2About({ onOpenCatalog, onStartTest }: V2AboutProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('manifiesto');

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-14">
      {/* Container with high-contrast, comfortable background */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-10"
      >
        {/* Header Hero */}
        <header className="relative overflow-hidden rounded-2xl border border-gold/30 bg-[#09111b]/95 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-medical-teal/10 blur-3xl" />

          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold">
              <ScrollText size={15} />
              <span>El Manifiesto de Arcanum Medicum</span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-gold magic-shadow leading-tight">
              El Origen del Juicio Vocacional
            </h1>

            <p className="max-w-3xl text-base sm:text-xl font-normal leading-relaxed text-[#f1e5d1]">
              Arcanum Medicum nació de una certeza clínica compartida: la elección de especialidad
              médica es una de las decisiones más trascendentales y desprotegidas en la vida de un profesional de la salud.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs sm:text-sm text-parchment/80">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-black/40 px-3 py-1 border border-gold/20">
                <Target size={14} className="text-gold" /> 51 Especialidades Oficiales
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-black/40 px-3 py-1 border border-gold/20">
                <Layers size={14} className="text-medical-teal" /> 12 Dimensiones Calibradas
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-black/40 px-3 py-1 border border-gold/20">
                <Compass size={14} className="text-sky-300" /> 4 Casas Tradicionales
              </span>
            </div>
          </div>
        </header>

        {/* Tab Navigation Pill Bar for comfortable reading */}
        <nav
          aria-label="Secciones del Origen"
          className="sticky top-20 z-20 flex flex-wrap gap-2 rounded-xl border border-gold/25 bg-[#070e17]/95 p-1.5 shadow-xl backdrop-blur-md"
        >
          {[
            { id: 'manifiesto', label: '1. El Dilema del Médico', icon: FileText },
            { id: 'casas', label: '2. Las 4 Casas Médicas', icon: Compass },
            { id: 'dimensiones', label: '3. Las 12 Dimensiones', icon: Layers },
            { id: 'metodologia', label: '4. Cómo se Calcula', icon: Brain },
            { id: 'etica', label: '5. Garantías y Ética', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabKey)}
                className={`inline-flex flex-1 sm:flex-initial items-center justify-center gap-2 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm font-semibold transition-all ${
                  active
                    ? 'border border-gold/60 bg-gold/20 text-gold shadow-md'
                    : 'text-parchment/70 hover:bg-white/5 hover:text-parchment'
                }`}
              >
                <Icon size={16} className={active ? 'text-gold' : 'text-parchment/60'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Dynamic Tab Contents */}
        <AnimatePresence mode="wait">
          {/* TAB 1: MANIFIESTO */}
          {activeTab === 'manifiesto' && (
            <motion.section
              key="manifiesto"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="rounded-2xl border border-gold/25 bg-[#0b131e]/90 p-6 sm:p-9 shadow-xl space-y-6">
                <div className="flex items-center gap-3 border-b border-gold/15 pb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/15 text-gold border border-gold/30">
                    <HelpCircle size={22} />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-bold text-gold">La Paradoja de la Elección Hospitalaria</h2>
                    <p className="text-xs uppercase tracking-widest text-parchment/70">La realidad que nadie cuenta en la facultad</p>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none space-y-4 text-base sm:text-lg leading-relaxed text-[#ede1cd]">
                  <p>
                    Durante los seis años del grado de Medicina, el estudiante asimila miles de páginas de fisiopatología, farmacología y guías clínicas. Sin embargo, apenas tiene tiempo para reflexionar sobre lo más importante:{' '}
                    <strong className="text-gold font-semibold">¿cómo quiere vivir sus próximos cuarenta años de ejercicio médico?</strong>
                  </p>

                  <div className="my-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-gold/20 bg-black/40 p-4">
                      <span className="font-display text-2xl font-bold text-amber-300">51</span>
                      <h3 className="mt-1 font-semibold text-sm text-parchment">Especialidades Oficiales</h3>
                      <p className="mt-1 text-xs text-parchment/80">
                        Cada una con un ecosistema, cultura de servicio, carga de guardias y ritmo vital radicalmente distinto.
                      </p>
                    </div>
                    <div className="rounded-xl border border-rose-400/25 bg-black/40 p-4">
                      <span className="font-display text-2xl font-bold text-rose-300">&lt; 20%</span>
                      <h3 className="mt-1 font-semibold text-sm text-parchment">Rotaciones Reales</h3>
                      <p className="mt-1 text-xs text-parchment/80">
                        La mayoría de graduados solo conoce de primera mano una mínima fracción del catálogo médico antes de elegir plaza.
                      </p>
                    </div>
                    <div className="rounded-xl border border-medical-teal/25 bg-black/40 p-4">
                      <span className="font-display text-2xl font-bold text-medical-teal">40 años</span>
                      <h3 className="mt-1 font-semibold text-sm text-parchment">Impacto Profesional</h3>
                      <p className="mt-1 text-xs text-parchment/80">
                        El número de orden en el examen MIR define la plaza, pero la compatibilidad psicológica y operativa define la felicidad profesional.
                      </p>
                    </div>
                  </div>

                  <p>
                    El sesgo del tutor puntual, una guardia afortunada o una mala experiencia en una rotación de dos semanas acaban determinando la elección de toda una vida. El resultado es el elevado índice de{' '}
                    <strong className="text-parchment font-semibold">renuncias en el primer año de residencia</strong> y el desgaste profesional acumulado por incompatibilidad de estilo de vida.
                  </p>

                  <div className="rounded-xl border border-medical-teal/30 bg-medical-teal/10 p-5 text-sm sm:text-base leading-relaxed text-parchment">
                    <p className="font-semibold text-medical-teal mb-1">Nuestra Propuesta Vocacional:</p>
                    Despojar la elección de especialidad del azar y la angustia. Crear un espejo analítico donde el médico o estudiante examine sus preferencias reales —quirófano vs consulta, incertidumbre vs protocolo, guardias de 24h vs conciliación— y reciba una brújula transparente y fundamentada.
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {/* TAB 2: LAS 4 CASAS */}
          {activeTab === 'casas' && (
            <motion.section
              key="casas"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="rounded-2xl border border-gold/25 bg-[#0b131e]/90 p-6 sm:p-8 shadow-xl">
                <div className="space-y-2 border-b border-gold/15 pb-4">
                  <h2 className="font-display text-2xl font-bold text-gold">Los Cuatro Arquetipos de la Práctica Médica</h2>
                  <p className="text-sm text-parchment/80 leading-relaxed">
                    Toda especialidad responde a una filosofía de trabajo. Siguiendo la tradición de las academias clásicas, Arcanum organiza el universo médico en cuatro Casas arquetípicas según el temperamento clínico dominante.
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                  {HOUSES_DETAILED.map((house) => {
                    const HouseIcon = house.id === 'HIPOCRATES' ? Heart : house.id === 'QUIRON' ? Shield : house.id === 'MINERVA' ? Eye : Flame;
                    return (
                      <div
                        key={house.id}
                        className={`rounded-xl border ${house.border} ${house.bg} p-6 shadow-lg backdrop-blur-sm space-y-4 flex flex-col justify-between`}
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-xs font-bold tracking-wider uppercase ${house.tagBg}`}>
                              <HouseIcon size={14} />
                              {house.name}
                            </span>
                            <span className="font-serif italic text-xs text-parchment/60">"{house.motto}"</span>
                          </div>

                          <h3 className={`font-display text-lg font-bold ${house.color}`}>{house.title}</h3>
                          <p className="text-sm leading-relaxed text-[#ede1cd]">{house.description}</p>
                        </div>

                        <div className="space-y-3 pt-3 border-t border-white/10">
                          <div>
                            <p className="text-[11px] font-bold uppercase tracking-wider text-parchment/60 mb-1.5">Rasgos Nucleares</p>
                            <div className="flex flex-wrap gap-1.5">
                              {house.values.map((v) => (
                                <span key={v} className="rounded bg-black/40 px-2 py-0.5 text-xs text-parchment border border-white/10">
                                  {v}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-[11px] font-bold uppercase tracking-wider text-parchment/60 mb-1">Especialidades Frecuentes</p>
                            <p className="text-xs font-medium text-parchment/90">{house.specialties.join(', ')}...</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.section>
          )}

          {/* TAB 3: LAS 12 DIMENSIONES */}
          {activeTab === 'dimensiones' && (
            <motion.section
              key="dimensiones"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="rounded-2xl border border-gold/25 bg-[#0b131e]/90 p-6 sm:p-8 shadow-xl">
                <div className="space-y-2 border-b border-gold/15 pb-4">
                  <h2 className="font-display text-2xl font-bold text-gold">La Matriz de las 12 Dimensiones Vocacionales</h2>
                  <p className="text-sm sm:text-base text-parchment/90 leading-relaxed">
                    En lugar de preguntas superficiales de afinidad, nuestro modelo evalúa 12 vectores independientes organizados en cuatro pilares de la práctica médica. Cada vector tiene un peso calibrado en las 51 fichas profesionales oficiales.
                  </p>
                </div>

                <div className="mt-8 space-y-8">
                  {DIMENSION_PILLARS.map((pillar) => {
                    const PillarIcon = pillar.icon;
                    return (
                      <div
                        key={pillar.title}
                        className={`rounded-xl border ${pillar.borderColor} ${pillar.bgColor} p-6 shadow-md space-y-5`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                          <div className="flex items-center gap-3">
                            <PillarIcon size={22} className={pillar.color} />
                            <h3 className={`font-display text-lg font-bold ${pillar.color}`}>{pillar.title}</h3>
                          </div>
                          <span className={`inline-block self-start sm:self-auto rounded-full border px-3 py-0.5 text-xs font-semibold ${pillar.badgeColor}`}>
                            {pillar.items.length} Vectores
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm text-parchment/80 italic">{pillar.summary}</p>

                        <div className="grid grid-cols-1 gap-4">
                          {pillar.items.map((item) => (
                            <div
                              key={item.code}
                              className="rounded-lg border border-white/10 bg-black/40 p-4 transition-all hover:border-gold/30 hover:bg-black/60"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                                <div className="flex items-center gap-2.5">
                                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-gold/15 text-gold border border-gold/30">
                                    {item.code}
                                  </span>
                                  <h4 className="font-sans text-base font-semibold text-parchment">{item.label}</h4>
                                </div>
                                <span className="text-xs font-medium text-parchment/70 italic">{item.question}</span>
                              </div>

                              <p className="mt-2 text-sm leading-relaxed text-[#ede1cd]">{item.description}</p>

                              <div className="mt-2.5 rounded bg-black/50 px-3 py-1.5 border-l-2 border-gold/40 text-xs text-parchment/80">
                                <span className="font-semibold text-gold">Contraste Clínico:</span> {item.example}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.section>
          )}

          {/* TAB 4: METODOLOGÍA */}
          {activeTab === 'metodologia' && (
            <motion.section
              key="metodologia"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="rounded-2xl border border-gold/25 bg-[#0b131e]/90 p-6 sm:p-8 shadow-xl space-y-6">
                <div className="space-y-2 border-b border-gold/15 pb-4">
                  <h2 className="font-display text-2xl font-bold text-gold">Cómo Calcula el Sombrero tu Afinidad</h2>
                  <p className="text-sm sm:text-base text-parchment/90 leading-relaxed">
                    Arcanum no recurre a respuestas prefabricadas ni a horóscopos vocacionales. Detrás del sombrero de latón y pergamino opera un motor algebraico de distancia vectorial euclídea calibrado con las características reales del sistema sanitario.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                  <div className="rounded-xl border border-gold/30 bg-black/40 p-5 space-y-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/15 text-gold border border-gold/30">
                      <Target size={20} />
                    </div>
                    <h3 className="font-display text-base font-bold text-gold">1. Vectorización de Respuestas</h3>
                    <p className="text-sm leading-relaxed text-[#ede1cd]">
                      Cada dilema clínico asigna pesos cuantitativos a las 12 dimensiones. Tus elecciones configuran un vector individualizado en un espacio de 12 dimensiones normalizado.
                    </p>
                  </div>

                  <div className="rounded-xl border border-medical-teal/30 bg-black/40 p-5 space-y-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-medical-teal/15 text-medical-teal border border-medical-teal/30">
                      <Compass size={20} />
                    </div>
                    <h3 className="font-display text-base font-bold text-medical-teal">2. Mapeo contra 51 Especialidades</h3>
                    <p className="text-sm leading-relaxed text-[#ede1cd]">
                      El algoritmo calcula la similitud con las 51 fichas profesionales oficiales, aplicando penalizaciones por fricción crítica (ej. aversión insalvable a guardias o falta de interés manual).
                    </p>
                  </div>

                  <div className="rounded-xl border border-sky-400/30 bg-black/40 p-5 space-y-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/15 text-sky-300 border border-sky-400/30">
                      <Sparkles size={20} />
                    </div>
                    <h3 className="font-display text-base font-bold text-sky-300">3. Rama Adaptativa de Desempate</h3>
                    <p className="text-sm leading-relaxed text-[#ede1cd]">
                      Si dos especialidades rivales quedan muy próximas en puntuación, el sistema formula preguntas clínicas específicas de bifurcación para dirimir la incertidumbre con máxima nitidez.
                    </p>
                  </div>
                </div>

                {/* Free vs Premium comparison card */}
                <div className="rounded-xl border border-gold/30 bg-gold/5 p-6 space-y-4">
                  <h3 className="font-display text-lg font-bold text-gold">Dos Modos de Exploración Transparentes</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border border-gold/20 bg-black/40 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm text-parchment">Oráculo Express (Gratuito)</span>
                        <span className="text-xs bg-medical-teal/20 text-medical-teal border border-medical-teal/30 px-2 py-0.5 rounded font-mono">14 Preguntas</span>
                      </div>
                      <p className="text-xs sm:text-sm text-parchment/80 leading-relaxed">
                        Evaluación rápida de 5 minutos que revela tu Casa Médica dominante, tu Top 3 de especialidades recomendadas, el gráfico de radar dimensional y el artículo diagnóstico de asignación.
                      </p>
                    </div>

                    <div className="rounded-lg border border-gold/40 bg-black/40 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm text-gold">Dossier Monográfico (Premium)</span>
                        <span className="text-xs bg-gold/25 text-gold border border-gold/50 px-2 py-0.5 rounded font-mono">40-44 Preguntas</span>
                      </div>
                      <p className="text-xs sm:text-sm text-parchment/80 leading-relaxed">
                        Batería exhaustiva con duelos adaptativos de desempate, ranking completo de las 51 especialidades, análisis de fricción hospitalaria, régimen de guardias y exportación de informe clínico en PDF.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {/* TAB 5: ETICA & RIGOR */}
          {activeTab === 'etica' && (
            <motion.section
              key="etica"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="rounded-2xl border border-amber-400/30 bg-[#0d151c]/95 p-6 sm:p-8 shadow-xl space-y-6">
                <div className="flex items-center gap-3 border-b border-amber-400/20 pb-4 text-amber-300">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-400/15 border border-amber-400/30">
                    <ShieldCheck size={22} />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-bold text-amber-200">Garantías, Límites & Rigor Ético</h2>
                    <p className="text-xs uppercase tracking-widest text-parchment/70">Transparencia absoluta con el opositor y el facultativo</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-5 space-y-3">
                    <div className="flex items-center gap-2 text-emerald-300 font-bold text-base">
                      <CheckCircle2 size={18} />
                      <h3>Qué SÍ es Arcanum Medicum</h3>
                    </div>
                    <ul className="space-y-2 text-sm leading-relaxed text-[#ede1cd]">
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>Un instrumento de <strong>introspección estructurada</strong> basado en dilemas de la práctica real.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>Una guía para <strong>descubrir especialidades invisibilizadas</strong> en el grado (ej. Alergología, Inmunología, Preventiva).</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>Un mapa objetivo de tus <strong>límites de tolerancia</strong> (ritmo, guardias, incertidumbre, muerte).</span>
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-5 space-y-3">
                    <div className="flex items-center gap-2 text-rose-300 font-bold text-base">
                      <AlertTriangle size={18} />
                      <h3>Qué NO es Arcanum Medicum</h3>
                    </div>
                    <ul className="space-y-2 text-sm leading-relaxed text-[#ede1cd]">
                      <li className="flex items-start gap-2">
                        <span className="text-rose-400 font-bold">•</span>
                        <span><strong>No predice el éxito</strong> ni el talento clínico: evalúa exclusivamente la afinidad de estilo de trabajo.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-rose-400 font-bold">•</span>
                        <span><strong>No sustituye las visitas a los hospitales</strong> ni las conversaciones cara a cara con residentes en activo.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-rose-400 font-bold">•</span>
                        <span><strong>No tiene valor vinculante</strong> oficial ante el Ministerio de Sanidad ni las convocatorias MIR.</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/40 p-4 text-xs sm:text-sm text-parchment/80 leading-relaxed">
                  <p>
                    <strong className="text-gold">Recomendación ética:</strong> Utiliza el resultado como punto de partida para tu investigación personal. Antes de tomar tu decisión definitiva, acude al hospital que te interese, pasa un día entero en la sala de firmas y habla con los R1 y R4 de la especialidad.
                  </p>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Footer Actions: Clear CTAs to Explore or Start */}
        <section className="rounded-2xl border border-gold/40 bg-gradient-to-r from-[#0d1624] via-[#09111b] to-[#0d1624] p-6 sm:p-10 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center sm:text-left">
            <h3 className="font-display text-xl sm:text-2xl font-bold text-gold">¿Preparado para someterte al juicio?</h3>
            <p className="text-sm text-[#f1e5d1] max-w-xl">
              El Sombrero Seleccionador Médico aguarda en el atrio. Descubre qué Casa y qué especialidad resuenan con tu vocación clínica.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 w-full sm:w-auto">
            <button
              onClick={onOpenCatalog}
              className="inline-flex items-center gap-2 rounded-xl border border-gold/40 bg-gold/10 hover:bg-gold/20 px-5 py-3 text-xs sm:text-sm font-bold tracking-wider uppercase text-gold transition-all shadow-md cursor-pointer"
            >
              <BookOpen size={16} />
              Ver las 51 Especialidades
            </button>

            {onStartTest && (
              <button
                onClick={onStartTest}
                className="inline-flex items-center gap-2 rounded-xl border border-gold bg-gradient-to-r from-gold/30 to-gold/20 hover:from-gold/40 hover:to-gold/30 px-6 py-3 text-xs sm:text-sm font-bold tracking-wider uppercase text-parchment hover:text-white transition-all shadow-lg hover:shadow-gold/20 cursor-pointer"
              >
                <Sparkles size={16} className="text-gold" />
                Someterme al Juicio
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        </section>
      </motion.div>
    </div>
  );
}
