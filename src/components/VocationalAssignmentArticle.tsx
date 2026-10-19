import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Sparkles,
  Shield,
  Flame,
  Eye,
  Heart,
  Compass,
  Clock,
  Award,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Stethoscope,
  Activity,
  Layers,
  Lock,
  CheckCircle2,
  Share2,
  Printer,
  Crown,
} from 'lucide-react';
import { HouseType } from './HouseHeroBanner';
import { SpecialtyMatch, UserProfile } from '../types';
import { DIMENSION_LABELS } from '../data/dimensions';

interface VocationalAssignmentArticleProps {
  match: SpecialtyMatch;
  house: HouseType;
  profile: UserProfile;
  isPremium?: boolean;
  onUnlockPremium?: () => void;
  priceLabel?: string;
}

const HOUSE_THEMES: Record<
  HouseType,
  {
    name: string;
    clinicalRole: string;
    latinMotto: string;
    icon: React.ElementType;
    accentColor: string;
    borderColor: string;
    bgBadge: string;
    houseEthos: string;
    practiceStyle: string;
  }
> = {
  Gryffindor: {
    name: 'Casa Gryffindor',
    clinicalRole: 'Los Titanes del Triaje & Soporte Vital',
    latinMotto: 'Fortis in Re, Celer in Tempore',
    icon: Flame,
    accentColor: 'text-rose-400',
    borderColor: 'border-rose-500/40',
    bgBadge: 'bg-rose-950/40 text-rose-300 border-rose-500/40',
    houseEthos:
      'Tu mente no se bloquea ante el colapso hemodinámico. Mientras otros dudan ante la alarma estridente del monitor, tus reflejos se afilan para actuar en la ventana crítica donde se decide la vida.',
    practiceStyle:
      'Como especialista de la Casa Gryffindor, tu práctica médica se caracterizará por una toma de decisiones valiente y ágil, asumiendo el liderazgo en situaciones límite y protegiendo al paciente con determinación inquebrantable.',
  },
  Slytherin: {
    name: 'Casa Slytherin',
    clinicalRole: 'Los Artífices de la Precisión Quirúrgica',
    latinMotto: 'Dextera Cauta, Mens Suprema',
    icon: Shield,
    accentColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/40',
    bgBadge: 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40',
    houseEthos:
      'Exiges maestría técnica absoluta. Comprendes que un milímetro de disección o una décima de miligramo en farmacología separa el éxito rotundo del fracaso quirúrgico irreversible.',
    practiceStyle:
      'Como especialista de la Casa Slytherin, destacarás por tu virtuosismo técnico, una disciplina metódica que no tolera la improvisación chapucera y una ambición sana por dominar las técnicas diagnósticas y quirúrgicas más punteras.',
  },
  Ravenclaw: {
    name: 'Casa Ravenclaw',
    clinicalRole: 'Los Eruditos del Razonamiento Diagnóstico',
    latinMotto: 'Scientia Est Lux In Tenebris',
    icon: Eye,
    accentColor: 'text-sky-400',
    borderColor: 'border-sky-500/40',
    bgBadge: 'bg-sky-950/40 text-sky-300 border-sky-500/40',
    houseEthos:
      'Tu mayor pulsión es el enigma clínico. Desentrañas analíticas dispares, síntomas atípicos y literatura biomédica de vanguardia para dar respuesta a lo que comités enteros han dejado sin diagnóstico.',
    practiceStyle:
      'Como especialista de la Casa Ravenclaw, tu abordaje del paciente se basará en el rigor fisiopatológico exhaustivo, el pensamiento crítico sin sesgos de confirmación y una curiosidad científica que te mantendrá en la frontera del conocimiento.',
  },
  Hufflepuff: {
    name: 'Casa Hufflepuff',
    clinicalRole: 'Los Guardianes del Cuidado Humano & Longitudinal',
    latinMotto: 'Concordia, Empatia et Cura Perpetua',
    icon: Heart,
    accentColor: 'text-amber-400',
    borderColor: 'border-amber-500/40',
    bgBadge: 'bg-amber-950/40 text-amber-300 border-amber-500/40',
    houseEthos:
      'Comprendes que la medicina no es solo alterar constantes biológicas, sino acompañar a un ser humano vulnerable. Tu don es la empatía clínica, la escucha activa y la constancia a través de los años.',
    practiceStyle:
      'Como especialista de la Casa Hufflepuff, serás el médico en quien el paciente deposita su confianza más profunda, equilibrando la ciencia médica con una calidez humana que humaniza la frialdad de las plantas de hospitalización.',
  },
};

export function VocationalAssignmentArticle({
  match,
  house,
  profile,
  isPremium = false,
  onUnlockPremium,
  priceLabel = '4,99 €',
}: VocationalAssignmentArticleProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const houseConfig = HOUSE_THEMES[house] || HOUSE_THEMES.Ravenclaw;
  const HouseIcon = houseConfig.icon;

  const specialty = match.specialty;
  const matchPercentage = match.score.toFixed(1);

  // Generate customized cognitive synthesis based on specialty family and match reasons
  const getCognitiveSynthesis = () => {
    const reasons = match.reasons.map((r) => r.label.toLowerCase()).join(', ');
    const family = specialty.family;

    if (family === 'Quirúrgica') {
      return `Tus respuestas han evidenciado un perfil con altísima inclinación hacia la destreza procedimental y la resolución mecánica directa. No te conformas con la observación pasiva de la enfermedad: buscas intervenir físicamente en la anatomía para reparar la patología con resultados tangibles e inmediatos. La afinidad del ${matchPercentage}% con ${specialty.name} se cimenta en tu sintonía con ${reasons || 'el ritmo quirúrgico y el rigor del quirófano'}.`;
    } else if (family === 'Médica') {
      return `Tu razonamiento es inductivo, analítico y paciente. Disfrutas integrando síntomas dispersos, pruebas complementarias y respuestas a tratamientos en un cuadro fisiopatológico coherente. ${specialty.name} te ha elegido porque tu perfil muestra una necesidad intrínseca de comprender el 'por qué' celular e inmunológico de cada manifestación clínica, con especial solidez en ${reasons || 'la correlación clínica y el diagnóstico diferencial'}.`;
    } else if (family === 'Transversal' || family === 'Psiquiatría') {
      return `Destacas por una visión holística que trasciende el órgano aislado. Entiendes que el paciente vive inmerso en un contexto biopsicosocial complejo, y tus respuestas ponderan de manera sobresaliente el vínculo de comunicación y la continuidad asistencial. El algoritmo te ha asignado ${specialty.name} por tu afinidad con ${reasons || 'el enfoque integral y la empatía terapéutica sostenida'}.`;
    } else if (family === 'Servicios Centrales') {
      return `Posees una agudeza visual y deductiva excepcional que opera con máxima objetividad diagnóstica. Encuentras fascinación en los patrones histológicos, imagenológicos o moleculares donde se revela la verdadera identidad del mal sin las interferencias del ruido clínico superficial. Tu destino en ${specialty.name} surge de tu sobresaliente concordancia en ${reasons || 'la precisión analítica y el rigor tecnológico'}.`;
    } else {
      return `Tu balance vocacional responde a un equilibrio singular entre destreza diagnóstica, tolerancia al estrés agudo y toma de decisiones resolutivas. El algoritmo ha identificado en ti la combinación precisa de temperamento clínico para sobresalir en ${specialty.name}, sustentado en tu afinidad por ${reasons || 'las demandas centrales de esta disciplina'}.`;
    }
  };

  const getHouseSynergyAnalysis = () => {
    switch (house) {
      case 'Gryffindor':
        return `En ${specialty.name}, un médico de Gryffindor es el bastión que mantiene la compostura cuando las cosas se complican en la guardia o en el pase de visita. No te paraliza la responsabilidad de una decisión que cambie el pronóstico en cuestión de minutos; al contrario, es en ese terreno donde tu lucidez alcanza su cénit.`;
      case 'Slytherin':
        return `En ${specialty.name}, un facultativo de Slytherin no tolera la mediocridad. Perfeccionas tus protocolos, dominas la literatura más exigente y buscas convertirte en la referencia técnica de tu servicio. Tus colegas acudirán a ti cuando se requiera una ejecución impecable o el manejo de los casos más complejos de la unidad.`;
      case 'Ravenclaw':
        return `En ${specialty.name}, la mirada de Ravenclaw es la que descubre la etiología rara oculta tras un cuadro común. Eres el colega que consulta las guías internacionales más recientes, que no se conforma con el tratamiento sintomático rutinario y que eleva el nivel académico y científico de todo el departamento.`;
      case 'Hufflepuff':
        return `En ${specialty.name}, el corazón de Hufflepuff previene que la medicina se deshumanice en medio de la vorágine asistencial. Sabes comunicar noticias difíciles con delicadeza sin perder el rigor técnico, escuchas las preocupaciones veladas del paciente y te aseguras de que nadie se sienta un mero número de cama o historia clínica.`;
    }
  };

  return (
    <article className="glass-surface relative w-full overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-b from-[#16130d] via-[#0d0c0a] to-[#070605] p-6 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.7)] text-parchment">
      {/* Decorative Ornate Corners */}
      <div className="pointer-events-none absolute left-0 top-0 h-5 w-5 border-l-2 border-t-2 border-gold/60 rounded-tl-lg" />
      <div className="pointer-events-none absolute right-0 top-0 h-5 w-5 border-r-2 border-t-2 border-gold/60 rounded-tr-lg" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-5 w-5 border-b-2 border-l-2 border-gold/60 rounded-bl-lg" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-5 w-5 border-b-2 border-r-2 border-gold/60 rounded-br-lg" />

      {/* Editorial Header */}
      <header className="border-b border-gold/20 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/30 bg-gold/10 text-gold text-[10px] uppercase font-mono tracking-[0.25em]">
            <BookOpen size={13} className="text-gold" />
            Monografía de Asignación Vocacional
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-parchment/50">
            <span className="flex items-center gap-1.5">
              <Clock size={12} className="text-medical-teal" />
              Lectura clínica · 4 min
            </span>
            <span aria-hidden="true" className="text-gold/30">·</span>
            <span className="text-gold-dim">Afinidad: {matchPercentage}%</span>
          </div>
        </div>

        <h2 className="mt-4 font-display text-2xl sm:text-4xl font-bold text-gold tracking-wide leading-tight">
          Por qué el Sombrero te ha destinado a {specialty.name} y al arquetipo de la {houseConfig.name}
        </h2>

        <p className="mt-3 font-classic text-base sm:text-lg italic leading-relaxed text-parchment/80">
          «El destino médico no es un capricho de la fortuna, sino la convergencia matemática entre tus pulsiones cognitivas y las demandas ontológicas de la especialidad.»
        </p>

        {/* Editorial Bylines */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-gold/10 text-[11px] font-mono text-parchment/40">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
            <span>Emitido por: Colegio de Sabios del Santuario & Algoritmo Oficial MIR</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`rounded px-2 py-0.5 text-[9px] uppercase font-mono tracking-widest ${
                isPremium
                  ? 'border border-gold/50 bg-gold/20 text-gold font-bold'
                  : 'border border-medical-teal/40 bg-medical-teal/10 text-medical-teal'
              }`}
            >
              {isPremium ? 'Expediente Monográfico Completo' : 'Extracto Esencial de Asignación'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Editorial Content */}
      <div className="mt-8 space-y-8 text-sm sm:text-base leading-relaxed text-parchment/85 font-sans">
        
        {/* CHAPTER 1 */}
        <section className="space-y-3.5">
          <div className="flex items-center gap-2 text-gold">
            <span className="font-display font-bold text-lg text-gold/50">I.</span>
            <h3 className="font-display font-bold text-lg sm:text-xl text-gold tracking-wide uppercase">
              La Psicología Clínica de tu Elección
            </h3>
          </div>
          <p className="text-justify leading-relaxed">
            {getCognitiveSynthesis()}
          </p>
          <div className="rounded-xl border border-gold/15 bg-black/30 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs uppercase font-mono tracking-widest text-gold/80">
              <Stethoscope size={14} className="text-medical-teal" />
              <span>Declaración Oficial de Competencia ({specialty.name})</span>
            </div>
            <p className="text-xs sm:text-sm italic text-parchment/70 leading-relaxed font-classic">
              «{specialty.description}»
            </p>
          </div>
        </section>

        {/* CHAPTER 2 */}
        <section className="space-y-3.5 border-t border-gold/15 pt-6">
          <div className="flex items-center gap-2 text-gold">
            <span className="font-display font-bold text-lg text-gold/50">II.</span>
            <h3 className="font-display font-bold text-lg sm:text-xl text-gold tracking-wide uppercase flex items-center gap-2.5">
              <span>La Sinergia con la {houseConfig.name}</span>
              <HouseIcon size={18} className={houseConfig.accentColor} />
            </h3>
          </div>

          <div className={`p-4 rounded-xl border ${houseConfig.borderColor} bg-black/40 space-y-2.5`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className={`text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${houseConfig.bgBadge}`}>
                {houseConfig.clinicalRole}
              </span>
              <span className="font-serif italic text-xs text-gold/80">
                «{houseConfig.latinMotto}»
              </span>
            </div>
            <p className="text-xs sm:text-sm text-parchment/80 leading-relaxed">
              {houseConfig.houseEthos}
            </p>
          </div>

          <p className="text-justify leading-relaxed">
            {getHouseSynergyAnalysis()}
          </p>
        </section>

        {/* CHAPTER 3 */}
        <section className="space-y-4 border-t border-gold/15 pt-6">
          <div className="flex items-center gap-2 text-gold">
            <span className="font-display font-bold text-lg text-gold/50">III.</span>
            <h3 className="font-display font-bold text-lg sm:text-xl text-gold tracking-wide uppercase">
              Los Vectores Decisivos de tu Algoritmo
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-parchment/70">
            A diferencia de los tests genéricos de internet, Arcanum Medicum cuantifica tu perfil sobre 6 dimensiones psicométricas validadas con el programa oficial MIR. Los tres motivos con mayor peso decisivo para asignarte {specialty.name} fueron:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            {match.reasons.slice(0, 3).map((reason, idx) => (
              <div
                key={reason.label}
                className="rounded-xl border border-gold/20 bg-black/35 p-3.5 space-y-1.5"
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-parchment/40">
                  <span>VECTOR 0{idx + 1}</span>
                  <CheckCircle2 size={12} className="text-emerald-400" />
                </div>
                <h4 className="font-display font-bold text-xs sm:text-sm text-gold truncate">
                  {reason.label}
                </h4>
                <div className="text-[11px] font-mono text-parchment/60 flex justify-between border-t border-gold/10 pt-1">
                  <span>Tu puntuación:</span>
                  <span className="text-gold font-bold">{reason.userValue.toFixed(1)}/4.0</span>
                </div>
                <div className="text-[11px] font-mono text-parchment/60 flex justify-between">
                  <span>Exigencia MIR:</span>
                  <span className="text-medical-teal font-bold">{reason.specialtyValue.toFixed(1)}/4.0</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CHAPTER 4: Realidad Hospitalaria y Guardias (The Strategic Gate) */}
        <section className="space-y-4 border-t border-gold/15 pt-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-gold">
              <span className="font-display font-bold text-lg text-gold/50">IV.</span>
              <h3 className="font-display font-bold text-lg sm:text-xl text-gold tracking-wide uppercase flex items-center gap-2">
                <AlertTriangle size={17} className="text-amber-400" />
                <span>Realidad Hospitalaria, Guardias y Curva de Desgaste</span>
              </h3>
            </div>
            {isPremium && (
              <span className="inline-flex items-center gap-1 rounded-full border border-gold/40 bg-gold/15 px-2.5 py-0.5 text-[9px] uppercase font-mono tracking-widest text-gold font-bold">
                <Crown size={11} />
                Desbloqueado
              </span>
            )}
          </div>

          <p className="text-justify leading-relaxed">
            Ninguna especialidad médica está exenta de sombras. El éxito de tu residencia y de tu trayectoria como adjunto no dependerá únicamente de lo que te apasiona, sino de tu capacidad para tolerar el tipo exacto de fatiga y burocracia que caracteriza a {specialty.name}.
          </p>

          {/* Conditional rendering depending on whether user is in Free or Premium mode */}
          {isPremium ? (
            <div className="space-y-4 rounded-xl border border-gold/30 bg-gradient-to-b from-gold/[0.07] to-black/40 p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 border-b md:border-b-0 md:border-r border-gold/15 pb-4 md:pb-0 md:pr-4">
                  <h4 className="text-xs uppercase font-mono tracking-widest text-gold font-bold flex items-center gap-2">
                    <Activity size={14} className="text-rose-400" />
                    Patrón de Guardias & Carga Asistencial
                  </h4>
                  <p className="text-xs text-parchment/75 leading-relaxed">
                    {specialty.constraints.guards >= 4
                      ? `Alta exigencia de guardias presenciales de 24h. En ${specialty.name}, las guardias implican escaso descanso nocturno continuo y una alta demanda de respuesta inmediata ante emergencias de planta o urgencias.`
                      : specialty.constraints.guards >= 2
                      ? `Régimen de guardias moderado. Combina turnos presenciales con periodos de localización según el tamaño del hospital, permitiendo una conciliación de vida personal más predecible.`
                      : `Guardias reducidas o sin turnos nocturnos regulares. El trabajo se concentra en horario de consulta, gabinete o pases programados, con una curva de fatiga física muy controlada.`}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs uppercase font-mono tracking-widest text-gold font-bold flex items-center gap-2">
                    <AlertTriangle size={14} className="text-amber-400" />
                    Punto de Fricción Psicológica para tu Perfil
                  </h4>
                  <p className="text-xs text-parchment/75 leading-relaxed">
                    {match.constraintNotes.length > 0
                      ? match.constraintNotes.join(' · ')
                      : `Tu perfil tolera bien las exigencias estructurales de ${specialty.name}, pero deberás cuidar la desconexión emocional al terminar el turno para evitar el agotamiento por empatía.`}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-gold/15">
                <h4 className="text-xs uppercase font-mono tracking-widest text-medical-teal font-bold mb-1.5">
                  Consejo Estratégico de Elección de Hospital
                </h4>
                <p className="text-xs text-parchment/80 leading-relaxed">
                  Para un médico de la {houseConfig.name} que se forma en {specialty.name}, se recomienda priorizar hospitales con un volumen quirúrgico/clínico suficiente para alcanzar autonomía técnica temprana, pero con un ambiente docente donde la supervisión del adjunto fomente el debate fisiopatológico y el respeto por el descanso post-guardia.
                </p>
              </div>
            </div>
          ) : (
            /* Free Mode: Teaser with high perceived value and graceful CTA */
            <div className="relative rounded-xl border border-gold/30 bg-gradient-to-b from-black/50 via-black/80 to-black p-6 space-y-4 overflow-hidden">
              <div className="space-y-2">
                <p className="text-xs text-parchment/70 leading-relaxed">
                  <strong>Resumen de condiciones para {specialty.name}:</strong> Carga emocional nivel {specialty.constraints.emotionalLoad}/5, intensidad de guardias {specialty.constraints.guards}/5 y predictibilidad {specialty.constraints.predictability}/5.
                  {match.constraintNotes.length > 0 && ` Fricción advertida: ${match.constraintNotes[0]}.`}
                </p>
              </div>

              {/* Blur teaser overlay for deep hospital analysis */}
              <div className="relative rounded-lg border border-gold/20 bg-black/60 p-5 backdrop-blur-sm space-y-3">
                <div className="flex items-center gap-2 text-xs uppercase font-mono tracking-widest text-gold font-bold">
                  <Lock size={14} className="text-amber-400" />
                  <span>Sección Reservada para el Modo Premium</span>
                </div>
                <p className="text-xs text-parchment/60 leading-relaxed">
                  El <strong>Expediente Monográfico Completo</strong> profundiza en la curva de desgaste real (burnout), la cultura de servicio según el hospital (terciario vs comarcal), el desglose eje por eje frente a tu segunda especialidad rival y el informe descargable en PDF.
                </p>

                {onUnlockPremium && (
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <span className="font-display text-lg text-gold font-bold">
                      {priceLabel} <span className="text-[10px] font-sans font-normal text-parchment/40">pago único</span>
                    </span>
                    <button
                      onClick={onUnlockPremium}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-gold/60 bg-gold/15 px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-gold hover:bg-gold hover:text-black transition-all duration-300 rounded-lg cursor-pointer"
                    >
                      <Sparkles size={13} />
                      <span>Desbloquear Monografía & PDF</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

      </div>

      {/* Editorial Footer */}
      <footer className="mt-8 border-t border-gold/20 pt-4 flex flex-wrap items-center justify-between gap-3 text-[10px] font-mono text-parchment/40">
        <span>Arcanum Medicum · Archivo Histórico de Vocaciones Hipocráticas</span>
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.print()}
            className="hover:text-gold transition-colors inline-flex items-center gap-1 cursor-pointer"
          >
            <Printer size={12} />
            <span>Imprimir artículo</span>
          </button>
        </div>
      </footer>
    </article>
  );
}
