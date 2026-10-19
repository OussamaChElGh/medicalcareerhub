import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Sparkles, Flame, Eye, Compass, Heart, Award, ArrowUpRight } from 'lucide-react';

export type HouseType = 'Gryffindor' | 'Slytherin' | 'Ravenclaw' | 'Hufflepuff';

interface HouseConfig {
  name: string;
  latinMotto: string;
  clinicalTitle: string;
  ethos: string;
  description: string;
  traits: string[];
  crest: string;
  badgeBorder: string;
  badgeBg: string;
  badgeText: string;
  glowColor: string;
  primaryColor: string;
  gradientBg: string;
  icon: React.ElementType;
}

const HOUSES_CONFIG: Record<HouseType, HouseConfig> = {
  Gryffindor: {
    name: 'Casa Gryffindor',
    latinMotto: 'Fortis in Re, Celer in Tempore',
    clinicalTitle: 'Los Titanes del Triaje & Soporte Vital',
    ethos: 'Acción inmediata, temple ante el paro cardíaco y resistencia al estrés agudo.',
    description:
      'Posees un pulso inquebrantable en medio de la tormenta hemodinámica. Eres el médico que no titubea ante la alarma del monitor y cuya lucidez se multiplica bajo máxima presión.',
    traits: ['Decisión Rápida', 'Resistencia al Estrés', 'Soporte Vital', 'Liderazgo en Crisis'],
    crest: '/house-gryffindor.png',
    badgeBorder: 'border-rose-500/50',
    badgeBg: 'bg-rose-950/40',
    badgeText: 'text-rose-300',
    glowColor: 'rgba(239, 68, 68, 0.4)',
    primaryColor: '#ef4444',
    gradientBg: 'from-rose-950/60 via-black/50 to-black/70',
    icon: Flame,
  },
  Slytherin: {
    name: 'Casa Slytherin',
    latinMotto: 'Dextera Cauta, Mens Suprema',
    clinicalTitle: 'Los Artífices de la Precisión Quirúrgica',
    ethos: 'Destreza instrumental milimétrica, maestría anatómica y ambición técnica.',
    description:
      'Tu mente y tus manos operan en una sintonía matemática. Exiges la perfección donde un milímetro marca el límite entre la restauración funcional y el desastre.',
    traits: ['Precisión Milimétrica', 'Dominio Técnico', 'Resolución Estructural', 'Meticulosidad'],
    crest: '/house-slytherin.png',
    badgeBorder: 'border-emerald-500/50',
    badgeBg: 'bg-emerald-950/40',
    badgeText: 'text-emerald-300',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    primaryColor: '#10b981',
    gradientBg: 'from-emerald-950/60 via-black/50 to-black/70',
    icon: Shield,
  },
  Ravenclaw: {
    name: 'Casa Ravenclaw',
    latinMotto: 'Scientia Est Lux In Tenebris',
    clinicalTitle: 'Los Eruditos del Razonamiento Diagnóstico',
    ethos: 'Integración fisiopatológica, deducción molecular y pasión por el enigma.',
    description:
      'Ves lo que otros pasan por alto. Conectas analíticas dispares, hallazgos sutiles y literatura científica de vanguardia para dar nombre al cuadro más esquivo.',
    traits: ['Razonamiento Complejo', 'Diagnóstico Diferencial', 'Rigor Fisiopatológico', 'Investigación'],
    crest: '/house-ravenclaw.png',
    badgeBorder: 'border-sky-500/50',
    badgeBg: 'bg-sky-950/40',
    badgeText: 'text-sky-300',
    glowColor: 'rgba(56, 189, 248, 0.4)',
    primaryColor: '#38bdf8',
    gradientBg: 'from-sky-950/60 via-black/50 to-black/70',
    icon: Eye,
  },
  Hufflepuff: {
    name: 'Casa Hufflepuff',
    latinMotto: 'Concordia, Empatia et Cura Perpetua',
    clinicalTitle: 'Los Guardianes del Cuidado Humano & Longitudinal',
    ethos: 'Vínculo compasivo, visión biopsicosocial y fidelidad al paciente en todas sus etapas.',
    description:
      'Entiendes que sanar es mucho más que recetar. Tu vocación reside en el acompañamiento humano, la escucha sin prisas y la continuidad del cuidado a lo largo de los años.',
    traits: ['Empatía Terapéutica', 'Visión Biopsicosocial', 'Continuidad Asistencial', 'Cuidado Humano'],
    crest: '/house-hufflepuff.png',
    badgeBorder: 'border-amber-500/50',
    badgeBg: 'bg-amber-950/40',
    badgeText: 'text-amber-300',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    primaryColor: '#f59e0b',
    gradientBg: 'from-amber-950/60 via-black/50 to-black/70',
    icon: Heart,
  },
};

export interface HouseHeroBannerProps {
  house: HouseType;
  specialtyName?: string;
  specialtyFamily?: string;
  specialtyType?: string;
  specialtyScore?: number;
  specialtyBand?: string;
  specialtyHeadline?: string;
  compact?: boolean;
}

export const HouseHeroBanner: React.FC<HouseHeroBannerProps> = ({
  house,
  specialtyName,
  specialtyFamily,
  specialtyType,
  specialtyScore,
  specialtyBand,
  specialtyHeadline,
  compact = false,
}) => {
  const config = HOUSES_CONFIG[house] || HOUSES_CONFIG.Ravenclaw;
  const HouseIcon = config.icon;
  const [crestError, setCrestError] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative w-full rounded-3xl border-2 border-gold/40 bg-gradient-to-b ${config.gradientBg} p-5 sm:p-8 md:p-10 overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.85)]`}
    >
      {/* Heraldic Aura Glows */}
      <div
        className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[380px] h-[380px] rounded-full blur-[100px] pointer-events-none -z-0 opacity-55"
        style={{ backgroundColor: config.glowColor }}
      />
      <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-gold/10 blur-[90px] pointer-events-none -z-0" />

      {/* Decorative Heraldic Watermark Borders */}
      <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-mono text-gold/40 uppercase tracking-[0.3em] pb-4 border-b border-gold/15 mb-6">
        <span className="flex items-center gap-1.5">
          <Sparkles size={12} className="text-gold" />
          DICTAMEN DEL SOMBRERO CLÍNICO · PROTOCOLO DE ADSCRIPCIÓN
        </span>
        <span className="hidden sm:inline">ANNO MMXXVI · ARCANUM MIR</span>
      </div>

      {/* Responsive Split Layout: House Crest on Left, Giant Specialty Title on Right */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-center lg:text-left">
        {/* Left Column: House Crest, Heraldry & Motto (Col-span 4/5) */}
        <div className="lg:col-span-4 flex flex-col items-center lg:items-start space-y-3.5 border-b lg:border-b-0 lg:border-r border-gold/15 pb-6 lg:pb-0 lg:pr-8">
          <div className="relative flex items-center justify-center">
            {/* Subtle rotating glow ring */}
            <div className="absolute inset-0 -m-3 sm:-m-4 rounded-full border border-dashed border-gold/30 animate-[spin_30s_linear_infinite] pointer-events-none" />
            <div className="w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 flex items-center justify-center relative drop-shadow-[0_15px_30px_rgba(0,0,0,0.85)]">
              {!crestError ? (
                <img
                  src={config.crest}
                  alt={config.name}
                  onError={() => setCrestError(true)}
                  className="w-full h-full object-contain rounded-2xl filter drop-shadow-[0_0_24px_rgba(255,255,255,0.2)]"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div
                  className="w-full h-full rounded-2xl flex flex-col items-center justify-center border-2 border-gold/40 shadow-inner"
                  style={{ backgroundColor: `${config.primaryColor}20` }}
                >
                  <HouseIcon size={56} style={{ color: config.primaryColor }} />
                  <span className="text-[10px] font-mono uppercase text-gold tracking-widest mt-2">{config.name}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1 text-center lg:text-left w-full">
            <span
              className="text-[11px] font-magic tracking-[0.25em] uppercase italic block"
              style={{ color: config.primaryColor }}
            >
              "{config.latinMotto}"
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-black tracking-wider text-parchment uppercase magic-shadow">
              {config.name}
            </h2>
            <p className="text-xs sm:text-sm font-display text-gold tracking-wide">
              {config.clinicalTitle}
            </p>
          </div>

          {/* House Traits Tags */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5 pt-1">
            {config.traits.map((trait) => (
              <span
                key={trait}
                className={`rounded border px-2.5 py-0.5 text-[9px] uppercase font-mono tracking-wider ${config.badgeBorder} ${config.badgeBg} ${config.badgeText}`}
              >
                {trait}
              </span>
            ))}
          </div>
        </div>

        {/* Right Column: Giant Specialty Title, Score & Narrative (Col-span 8/7) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Eyebrow & Affinity Badges */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/50 bg-gold/15 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-gold shadow-[0_0_15px_rgba(197,160,89,0.25)]">
              <Award size={13} className="text-gold" />
              Especialidad N.º 01 Asignada
            </span>

            {specialtyScore !== undefined && (
              <span className="rounded-full border border-medical-teal/40 bg-medical-teal/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-medical-teal">
                Afinidad: {specialtyScore.toFixed(1)}% {specialtyBand ? `(${specialtyBand})` : ''}
              </span>
            )}

            {(specialtyType || specialtyFamily) && (
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-parchment/60">
                {specialtyType ? `${specialtyType} · ` : ''}{specialtyFamily}
              </span>
            )}
          </div>

          {/* GIANT SPECIALTY TITLE (User Request: "el titulo de especialidad debe verse mas grande") */}
          <div className="space-y-1">
            <h1 className="font-display text-3xl sm:text-5xl md:text-6xl xl:text-7xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-gold to-amber-300 drop-shadow-[0_4px_30px_rgba(197,160,89,0.55)] leading-[1.06] break-words hyphens-auto">
              {specialtyName || 'Especialidad Médica Principal'}
            </h1>
          </div>

          {/* Clinical Rationale & Ethos Headline */}
          <div className="space-y-2 border-t border-gold/15 pt-3">
            {specialtyHeadline ? (
              <p className="text-sm sm:text-base leading-relaxed text-parchment/90 font-sans italic max-w-2xl">
                "{specialtyHeadline}"
              </p>
            ) : (
              <p className="text-sm sm:text-base leading-relaxed text-parchment/85 font-sans italic max-w-2xl">
                {config.description}
              </p>
            )}

            <p className="text-xs text-parchment/60 font-sans">
              <span className="text-gold font-semibold">Perfil del Sombrero: </span>
              {config.ethos}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
