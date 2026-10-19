import React, { useState, useMemo, useRef } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wrench,
  Zap,
  Brain,
  HeartHandshake,
  Sparkles,
  Activity,
  Layers,
  Box,
  Compass,
  Sliders,
  Dna,
  ChevronRight,
  Eye,
  Check,
  RotateCw,
} from 'lucide-react';
import { Specialty, UserProfile } from '../types';
import {
  DIMENSIONS,
  NUMERIC_DIMENSIONS,
  POPULATION_LABELS,
  ENVIRONMENT_LABELS,
  SYSTEM_LABELS,
} from '../data/dimensions';
import { VocationalHolocron3D } from './VocationalHolocron3D';

export interface DimensionMetric {
  key: string;
  dimension: string;
  dimensionEs: string;
  score: number; // 0 - 100
  benchmark: number; // baseline (50)
  description: string;
  clinicalFocus: string;
  level: string;
  icon: React.ElementType;
  color: string;
}

interface DimensionsRadarChartProps {
  answers?: string[];
  specialty?: Specialty | null;
  v2Profile?: UserProfile | null;
  specialtyHouse?: string;
}

// Specialty to House mapping fallback for Classic scoring
const HOUSE_DIMENSION_BIAS: Record<string, { tech: number; crisis: number; diag: number; social: number }> = {
  Slytherin: { tech: 35, crisis: 15, diag: 25, social: 10 },
  Gryffindor: { tech: 20, crisis: 40, diag: 15, social: 10 },
  Ravenclaw: { tech: 10, crisis: 10, diag: 45, social: 15 },
  Hufflepuff: { tech: 10, crisis: 10, diag: 15, social: 45 },
};

// 3D Perspective Tilt Card Wrapper
const TiltCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  isSelected?: boolean;
}> = ({ children, className = '', onClick, isSelected }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotateX((-y / (rect.height / 2)) * 7);
    setRotateY((x / (rect.width / 2)) * 7);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) ${
          isHovered || isSelected ? 'scale3d(1.02, 1.02, 1.02)' : 'scale3d(1, 1, 1)'
        }`,
        transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.4s ease-out',
        transformStyle: 'preserve-3d',
      }}
      className={`relative cursor-pointer transition-shadow ${className}`}
    >
      {children}
    </div>
  );
};

export const DimensionsRadarChart: React.FC<DimensionsRadarChartProps> = ({
  answers = [],
  specialty,
  v2Profile,
  specialtyHouse = 'Ravenclaw',
}) => {
  // Mode selection: 3D Holocron vs 2D Radar vs 6 Ejes vs Afinidades
  const [activeTab, setActiveTab] = useState<'3D' | '2D' | 'AXES' | 'AFFINITIES'>('3D');
  const [selectedDimensionKey, setSelectedDimensionKey] = useState<string | null>(null);

  const metrics: DimensionMetric[] = useMemo(() => {
    let techScore = 50;
    let crisisScore = 50;
    let diagScore = 50;
    let socialScore = 50;

    // 1. If v2Profile is provided, derive from calibrated v2 numeric dimensions
    if (v2Profile && v2Profile.numeric) {
      const a1 = v2Profile.numeric.A1 ?? 2; // 0 = Technical resolution, 4 = Diagnostic integration
      const a2 = v2Profile.numeric.A2 ?? 2; // 0 = No procedures, 4 = Core procedures
      const a3 = v2Profile.numeric.A3 ?? 2; // 0 = Scheduled, 4 = Urgent/Crisis
      const a4 = v2Profile.numeric.A4 ?? 2; // 0 = Episodic, 4 = Long-term continuity
      const a5 = v2Profile.numeric.A5 ?? 2; // 0 = Indirect, 4 = Direct high-intensity
      const a8 = v2Profile.numeric.A8 ?? 2; // 0 = Anatomy/Structure, 4 = Molecular/mechanisms

      // Technical Resolution: (low A1 + high A2 + low A8)
      const rawTech = ((4 - a1) * 0.4 + a2 * 0.45 + (4 - a8) * 0.15) / 4;
      // Crisis Management: (high A3 + low A4)
      const rawCrisis = (a3 * 0.75 + (4 - a4) * 0.25) / 4;
      // Diagnostic Reasoning: (high A1 + high A8 + low A2)
      const rawDiag = (a1 * 0.5 + a8 * 0.35 + (4 - a2) * 0.15) / 4;
      // Social Care: (high A4 + high A5)
      const rawSocial = (a4 * 0.45 + a5 * 0.55) / 4;

      techScore = Math.min(98, Math.max(30, Math.round(rawTech * 100)));
      crisisScore = Math.min(98, Math.max(30, Math.round(rawCrisis * 100)));
      diagScore = Math.min(98, Math.max(30, Math.round(rawDiag * 100)));
      socialScore = Math.min(98, Math.max(30, Math.round(rawSocial * 100)));
    } else {
      // 2. Derive from Classic quiz answers
      let techTally = 0;
      let crisisTally = 0;
      let diagTally = 0;
      let socialTally = 0;
      let total = answers.length;

      answers.forEach((ans) => {
        const id = ans.toUpperCase();
        if (
          id.includes('SURGERY') ||
          id.includes('TRAUMATOLOGY') ||
          id.includes('OPHTHALMOLOGY') ||
          id.includes('PLASTIC') ||
          id.includes('MAXILLOFACIAL')
        ) {
          techTally += 1.0;
          crisisTally += 0.3;
          diagTally += 0.3;
          socialTally += 0.1;
        } else if (
          id.includes('EMERGENCY') ||
          id.includes('INTENSIVE') ||
          id.includes('CARDIOLOGY') ||
          id.includes('NEONATOLOGY')
        ) {
          crisisTally += 1.0;
          techTally += 0.4;
          diagTally += 0.4;
          socialTally += 0.2;
        } else if (
          id.includes('INTERNAL') ||
          id.includes('NEUROLOGY') ||
          id.includes('PATHOLOGY') ||
          id.includes('RADIOLOGY') ||
          id.includes('GENETICS') ||
          id.includes('RESEARCH') ||
          id.includes('IMMUNOLOGY') ||
          id.includes('MICROBIOLOGY') ||
          id.includes('TOXICOLOGY')
        ) {
          diagTally += 1.0;
          socialTally += 0.3;
          techTally += 0.3;
          crisisTally += 0.2;
        } else if (
          id.includes('FAMILY') ||
          id.includes('PSYCHIATRY') ||
          id.includes('PEDIATRICS') ||
          id.includes('PALLIATIVE') ||
          id.includes('GERIATRICS') ||
          id.includes('REHAB') ||
          id.includes('PREVENTIVE')
        ) {
          socialTally += 1.0;
          diagTally += 0.4;
          crisisTally += 0.2;
          techTally += 0.1;
        } else {
          diagTally += 0.5;
          techTally += 0.5;
        }
      });

      const house = specialtyHouse || specialty?.hogwartsHouse;
      const bias = (house && HOUSE_DIMENSION_BIAS[house]) || { tech: 20, crisis: 20, diag: 25, social: 20 };

      const divisor = total > 0 ? total : 8;
      techScore = Math.min(98, Math.max(32, Math.round((techTally / divisor) * 60 + bias.tech + 10)));
      crisisScore = Math.min(98, Math.max(30, Math.round((crisisTally / divisor) * 60 + bias.crisis + 8)));
      diagScore = Math.min(98, Math.max(35, Math.round((diagTally / divisor) * 60 + bias.diag + 12)));
      socialScore = Math.min(98, Math.max(30, Math.round((socialTally / divisor) * 60 + bias.social + 10)));
    }

    const getLevel = (score: number) => {
      if (score >= 85) return 'Sobresaliente / Dominante';
      if (score >= 70) return 'Alta Aptitud';
      if (score >= 55) return 'Competencia Sólida';
      return 'Nivel Moderado';
    };

    return [
      {
        key: 'tech',
        dimension: 'Technical Resolution',
        dimensionEs: 'Resolución Técnica',
        score: techScore,
        benchmark: 50,
        description: 'Destreza instrumental, precisión técnica y ejecución de procedimientos invasivos.',
        clinicalFocus: 'Quirófano, intervencionismo y destreza biomecánica',
        level: getLevel(techScore),
        icon: Wrench,
        color: '#38bdf8', // Sky/Cyan
      },
      {
        key: 'crisis',
        dimension: 'Crisis Management',
        dimensionEs: 'Gestión de Crisis',
        score: crisisScore,
        benchmark: 50,
        description: 'Toma de decisiones bajo presión extrema, estabilización vital y triaje agudo.',
        clinicalFocus: 'Urgencias, UCI, shock y soporte vital inmediato',
        level: getLevel(crisisScore),
        icon: Zap,
        color: '#f59e0b', // Amber/Gold
      },
      {
        key: 'diag',
        dimension: 'Diagnostic Reasoning',
        dimensionEs: 'Razonamiento Diagnóstico',
        score: diagScore,
        benchmark: 50,
        description: 'Deducción fisiopatológica, integración de datos complejos e investigación clínica.',
        clinicalFocus: 'Diagnóstico diferencial, bioanálisis y sistemática médica',
        level: getLevel(diagScore),
        icon: Brain,
        color: '#a855f7', // Purple/Violet
      },
      {
        key: 'social',
        dimension: 'Social Care',
        dimensionEs: 'Cuidado Social',
        score: socialScore,
        benchmark: 50,
        description: 'Vínculo empático longitudinal, soporte psicosocial y relación médico-paciente.',
        clinicalFocus: 'Atención primaria, salud mental y bienestar humano',
        level: getLevel(socialScore),
        icon: HeartHandshake,
        color: '#14b8a6', // Medical Teal
      },
    ];
  }, [answers, specialty, v2Profile, specialtyHouse]);

  // Formatted data for Recharts Radar
  const radarData = useMemo(() => {
    return metrics.map((m) => ({
      dimension: m.dimension,
      dimensionEs: m.dimensionEs,
      score: m.score,
      benchmark: m.benchmark,
      fullMark: 100,
    }));
  }, [metrics]);

  const selectedMetric = metrics.find((m) => m.key === selectedDimensionKey);

  return (
    <div className="w-full space-y-4 text-left">
      {/* Grand 3D Multidimensional Vocational Matrix Container */}
      <div className="border border-gold/30 bg-gradient-to-b from-black/60 via-black/45 to-black/70 p-4 sm:p-6 rounded-3xl shadow-[0_12px_50px_rgba(0,0,0,0.7)] backdrop-blur-xl relative overflow-hidden">
        {/* Ambient atmospheric glows */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-medical-teal/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-gold/15 rounded-full blur-3xl pointer-events-none" />

        {/* Matrix Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gold/20 pb-4">
          <div className="space-y-1 min-w-0">
            <div className="inline-flex items-center space-x-2 text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-medical-teal font-mono font-bold">
              <Sparkles size={12} className="flex-shrink-0 animate-pulse text-gold" />
              <span className="truncate">Evaluación Multidimensional Calibrada</span>
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-display font-extrabold text-parchment tracking-wide flex items-center gap-2">
              <span>Matriz Vocacional 3D</span>
              <span className="text-xs font-mono font-normal uppercase px-2 py-0.5 rounded-full border border-gold/40 bg-gold/10 text-gold-dim">
                Espacial
              </span>
            </h3>
            <p className="text-xs text-parchment/70 font-sans italic">
              Proyección tridimensional interactiva de tus competencias, ejes clínicos y afinidades médicas
            </p>
          </div>

          {/* 3D Interactive Tab Selector */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/60 border border-gold/25 backdrop-blur-md self-start md:self-auto overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveTab('3D')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === '3D'
                  ? 'bg-gradient-to-r from-medical-teal/40 to-gold/30 text-gold border border-gold/50 shadow-[0_0_15px_rgba(197,160,89,0.3)]'
                  : 'text-parchment/60 hover:text-parchment hover:bg-white/5 border border-transparent'
              }`}
            >
              <Box size={13} className={activeTab === '3D' ? 'text-gold' : 'text-parchment/60'} />
              <span>Holocrón 3D</span>
            </button>

            <button
              onClick={() => setActiveTab('2D')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === '2D'
                  ? 'bg-gradient-to-r from-medical-teal/40 to-gold/30 text-gold border border-gold/50 shadow-[0_0_15px_rgba(197,160,89,0.3)]'
                  : 'text-parchment/60 hover:text-parchment hover:bg-white/5 border border-transparent'
              }`}
            >
              <Compass size={13} className={activeTab === '2D' ? 'text-gold' : 'text-parchment/60'} />
              <span>Radar 2D</span>
            </button>

            {v2Profile && (
              <>
                <button
                  onClick={() => setActiveTab('AXES')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    activeTab === 'AXES'
                      ? 'bg-gradient-to-r from-medical-teal/40 to-gold/30 text-gold border border-gold/50 shadow-[0_0_15px_rgba(197,160,89,0.3)]'
                      : 'text-parchment/60 hover:text-parchment hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Sliders size={13} className={activeTab === 'AXES' ? 'text-gold' : 'text-parchment/60'} />
                  <span>6 Ejes Clínicos</span>
                </button>

                <button
                  onClick={() => setActiveTab('AFFINITIES')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    activeTab === 'AFFINITIES'
                      ? 'bg-gradient-to-r from-medical-teal/40 to-gold/30 text-gold border border-gold/50 shadow-[0_0_15px_rgba(197,160,89,0.3)]'
                      : 'text-parchment/60 hover:text-parchment hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Dna size={13} className={activeTab === 'AFFINITIES' ? 'text-gold' : 'text-parchment/60'} />
                  <span>Afinidades</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* View Content based on Active Tab */}
        <div className="py-2">
          {/* TAB 1: 3D HOLOCRON (Three.js WebGL Interactive Canvas) */}
          {activeTab === '3D' && (
            <motion.div
              key="holocron-view"
              initial={{ opacity: 0, scale: 0.96, filter: 'blur(14px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4"
            >
              {/* The Three.js 3D WebGL Canvas */}
              <VocationalHolocron3D
                cardinalMetrics={metrics}
                v2Profile={v2Profile}
                specialtyHouse={specialtyHouse}
                selectedDimensionKey={selectedDimensionKey}
                onSelectDimension={(key) => setSelectedDimensionKey(key === selectedDimensionKey ? null : key)}
              />

              {/* Quick dimension pills beneath 3D viewer for direct tactile tapping */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {metrics.map((m) => {
                  const isSelected = selectedDimensionKey === m.key;
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.key}
                      onClick={() => setSelectedDimensionKey(isSelected ? null : m.key)}
                      className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        isSelected
                          ? 'border-gold bg-gold/15 shadow-[0_0_15px_rgba(197,160,89,0.35)]'
                          : 'border-white/10 bg-black/30 hover:border-gold/40 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: m.color }}
                        />
                        <span className="text-[11px] font-sans font-medium text-parchment truncate">
                          {m.dimensionEs}
                        </span>
                      </div>
                      <span className="font-mono text-xs font-bold text-gold flex-shrink-0">
                        {m.score}%
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* TAB 2: 2D RADAR (Recharts Spider Web Chart) */}
          {activeTab === '2D' && (
            <motion.div
              key="radar-view"
              initial={{ opacity: 0, scale: 0.96, filter: 'blur(14px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="w-full flex flex-col items-center justify-center py-4 relative"
            >
              {/* Legend row */}
              <div className="flex items-center gap-4 text-xs font-mono mb-2">
                <div className="flex items-center space-x-1.5 text-parchment/80">
                  <span className="w-2.5 h-2.5 rounded-full bg-medical-teal inline-block shadow-[0_0_8px_#14b8a6]" />
                  <span>Tu Perfil</span>
                </div>
                <div className="flex items-center space-x-1.5 text-parchment/45">
                  <span className="w-2.5 h-0.5 border-t border-dashed border-gold/80 inline-block" />
                  <span>Media Basal (50%)</span>
                </div>
              </div>

              <div className="w-full max-w-md h-[300px] sm:h-[340px] relative">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <RadarChart
                    cx="50%"
                    cy="50%"
                    outerRadius="55%"
                    data={radarData}
                    margin={{ top: 28, right: 65, bottom: 28, left: 65 }}
                  >
                    <PolarGrid stroke="#c5a059" strokeOpacity={0.25} strokeDasharray="3 3" />
                    <PolarAngleAxis
                      dataKey="dimensionEs"
                      tick={({ x, y, payload, textAnchor, cx, cy }) => {
                        const item = metrics.find(
                          (m) => m.dimensionEs === payload.value || m.dimension === payload.value
                        );
                        const isTop = y < cy - 20;
                        const isBottom = y > cy + 20;
                        const isLeft = x < cx - 20;

                        let anchor = textAnchor;
                        let textY = y;
                        let scoreY = y + 13;

                        if (isTop) {
                          anchor = 'middle';
                          textY = y - 10;
                          scoreY = y + 4;
                        } else if (isBottom) {
                          anchor = 'middle';
                          textY = y + 6;
                          scoreY = y + 20;
                        } else if (isLeft) {
                          anchor = 'end';
                          textY = y - 3;
                          scoreY = y + 11;
                        } else {
                          anchor = 'start';
                          textY = y - 3;
                          scoreY = y + 11;
                        }

                        return (
                          <g>
                            <text
                              x={x}
                              y={textY}
                              textAnchor={anchor}
                              fill="#f3eee3"
                              fontSize={10}
                              fontWeight={600}
                              fontFamily="Cinzel, serif"
                              className="select-none"
                            >
                              {payload.value}
                            </text>
                            {item && (
                              <text
                                x={x}
                                y={scoreY}
                                textAnchor={anchor}
                                fill="#14b8a6"
                                fontSize={10}
                                fontWeight={700}
                                fontFamily="monospace"
                                className="select-none"
                              >
                                {item.score}%
                              </text>
                            )}
                          </g>
                        );
                      }}
                    />
                    <PolarRadiusAxis
                      angle={45}
                      domain={[0, 100]}
                      stroke="#c5a059"
                      strokeOpacity={0.25}
                      tick={{ fill: '#c5a059', fontSize: 8, opacity: 0.6 }}
                      tickCount={4}
                    />
                    <Radar
                      name="Media de Referencia"
                      dataKey="benchmark"
                      stroke="#c5a059"
                      fill="#c5a059"
                      fillOpacity={0.08}
                      strokeDasharray="4 4"
                      strokeWidth={1.5}
                    />
                    <Radar
                      name="Tu Nivel"
                      dataKey="score"
                      stroke="#14b8a6"
                      fill="#14b8a6"
                      fillOpacity={0.35}
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: '#14b8a6', stroke: '#fff', strokeWidth: 1.5 }}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          const metric = metrics.find((m) => m.dimensionEs === data.dimensionEs);
                          return (
                            <div className="bg-black/90 border border-gold/40 p-2.5 rounded-lg shadow-xl text-left max-w-[200px] backdrop-blur-md">
                              <p className="font-display font-bold text-gold text-xs">{data.dimensionEs}</p>
                              <p className="text-xs text-parchment/90 font-mono mt-0.5">
                                Nivel: <span className="text-medical-teal font-bold">{data.score}%</span>
                              </p>
                              {metric && (
                                <p className="text-[10px] text-parchment/60 mt-1 italic leading-tight">
                                  {metric.description}
                                </p>
                              )}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {/* TAB 3: 6 CALIBRATED CLINICAL AXES (Deep Continuous Dimensional Profile) */}
          {activeTab === 'AXES' && v2Profile && (
            <motion.div
              key="axes-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 pt-2"
            >
              <div className="flex items-center justify-between border-b border-gold/15 pb-2">
                <span className="text-xs text-parchment/80 italic font-sans">
                  Distribución exacta de tus tendencias clínicas en los 6 ejes psicométricos continuos
                </span>
                <span className="text-[10px] uppercase tracking-widest text-medical-teal font-mono font-bold">
                  Escala Calibrada [0.0 - 4.0]
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {NUMERIC_DIMENSIONS.map((dimension) => {
                  const definition = DIMENSIONS[dimension];
                  const value = v2Profile.numeric[dimension];
                  const percentage = value === null ? 0 : (value / 4) * 100;

                  return (
                    <TiltCard
                      key={dimension}
                      className="p-3.5 rounded-xl bg-black/40 border border-gold/20 hover:border-gold/50 shadow-md transition-colors"
                    >
                      <div className="space-y-2">
                        {/* Title and value */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-parchment uppercase tracking-wider truncate">
                            {definition.label}
                          </span>
                          <span className="font-mono text-xs font-bold text-gold px-2 py-0.5 rounded bg-gold/10 border border-gold/20 flex-shrink-0">
                            {value === null ? '—' : `${value.toFixed(1)} / 4.0`}
                          </span>
                        </div>

                        {/* 3D Cylindrical Progress Track */}
                        <div className="relative h-2.5 w-full bg-black/60 rounded-full border border-gold/20 p-0.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.7, ease: 'easeOut' }}
                            className="h-full rounded-full bg-gradient-to-r from-medical-teal via-emerald-400 to-gold shadow-[0_0_10px_rgba(20,184,166,0.6)]"
                          />
                        </div>

                        {/* Pole labels */}
                        <div className="flex justify-between text-[9px] uppercase tracking-wider text-parchment/50 font-mono gap-2">
                          <span className="truncate">{definition.lowLabel}</span>
                          <span className="truncate text-right">{definition.highLabel}</span>
                        </div>

                        {/* Description hint */}
                        <p className="text-[10px] text-parchment/65 italic font-sans leading-tight border-t border-white/5 pt-1.5">
                          {definition.description}
                        </p>
                      </div>
                    </TiltCard>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* TAB 4: AFFINITIES (Populations, Environments, Bodily Systems) */}
          {activeTab === 'AFFINITIES' && v2Profile && (
            <motion.div
              key="affinities-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 pt-2"
            >
              {/* Populations */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-widest text-gold font-mono font-bold block">
                  Poblaciones Diana Predilectas
                </span>
                <div className="flex flex-wrap gap-2">
                  {v2Profile.populations.length > 0 ? (
                    v2Profile.populations.map((key) => (
                      <span
                        key={key}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-gold/30 bg-gold/10 text-xs text-parchment font-medium shadow-sm hover:border-gold transition-colors"
                      >
                        <Check size={12} className="text-gold" />
                        <span>{POPULATION_LABELS[key] || key}</span>
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-parchment/40 italic">Amplitud sin exclusiones etarias</span>
                  )}
                </div>
              </div>

              {/* Environments */}
              <div className="space-y-2 border-t border-gold/15 pt-3">
                <span className="text-[10px] uppercase tracking-widest text-medical-teal font-mono font-bold block">
                  Entornos Asistenciales Idóneos
                </span>
                <div className="flex flex-wrap gap-2">
                  {v2Profile.environments.length > 0 ? (
                    v2Profile.environments.map((key) => (
                      <span
                        key={key}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-medical-teal/40 bg-medical-teal/10 text-xs text-medical-teal font-medium shadow-sm hover:border-medical-teal transition-colors"
                      >
                        <Check size={12} className="text-medical-teal" />
                        <span>{ENVIRONMENT_LABELS[key] || key}</span>
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-parchment/40 italic">Polivalente en múltiples ámbitos asistenciales</span>
                  )}
                </div>
              </div>

              {/* Systems */}
              <div className="space-y-2 border-t border-gold/15 pt-3">
                <span className="text-[10px] uppercase tracking-widest text-purple-300 font-mono font-bold block">
                  Sistemas Orgánicos y Áreas Biológicas
                </span>
                <div className="flex flex-wrap gap-2">
                  {v2Profile.systems.length > 0 ? (
                    v2Profile.systems.map((key) => (
                      <span
                        key={key}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-purple-400/40 bg-purple-400/10 text-xs text-purple-200 font-medium shadow-sm hover:border-purple-300 transition-colors"
                      >
                        <Check size={12} className="text-purple-300" />
                        <span>{SYSTEM_LABELS[key] || key}</span>
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-parchment/40 italic">Afinidad médica transversal multisistémica</span>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* 2. Interactive 3D Perspective Dimension Cards (The 4 Cardinal Pillars) */}
        <div className="border-t border-gold/20 pt-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs uppercase tracking-widest text-parchment/70 font-mono font-bold flex items-center gap-2">
              <Layers size={13} className="text-gold" />
              <span>Los 4 Pilares Cardinales de tu Medicina</span>
            </h4>
            <span className="text-[10px] text-parchment/40 font-mono hidden sm:inline">
              Pasa el cursor para perspectiva 3D
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {metrics.map((metric) => {
              const Icon = metric.icon;
              const isSelected = selectedDimensionKey === metric.key;

              return (
                <TiltCard
                  key={metric.key}
                  onClick={() => setSelectedDimensionKey(isSelected ? null : metric.key)}
                  isSelected={isSelected}
                  className={`p-4 rounded-2xl border transition-all ${
                    isSelected
                      ? 'border-gold bg-gradient-to-br from-gold/20 via-black/60 to-black/80 shadow-[0_8px_30px_rgba(197,160,89,0.35)]'
                      : 'border-white/10 bg-gradient-to-br from-black/40 via-black/30 to-black/55 hover:border-gold/40 shadow-md'
                  }`}
                >
                  <div className="space-y-2.5">
                    {/* Header Row: Icon, Titles & Score Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center space-x-3 min-w-0">
                        <div
                          className="p-2.5 rounded-xl border border-white/10 shadow-inner flex-shrink-0"
                          style={{
                            backgroundColor: `${metric.color}15`,
                            color: metric.color,
                          }}
                        >
                          <Icon size={18} />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-display font-bold text-sm text-parchment tracking-wide truncate">
                            {metric.dimensionEs}
                          </h4>
                          <span
                            className="text-[10px] font-mono uppercase tracking-wider block font-medium truncate"
                            style={{ color: metric.color }}
                          >
                            {metric.level}
                          </span>
                        </div>
                      </div>

                      {/* Score Badge */}
                      <div className="flex flex-col items-end flex-shrink-0">
                        <span
                          className="font-mono text-base font-extrabold tracking-tight"
                          style={{ color: metric.color }}
                        >
                          {metric.score}%
                        </span>
                        <span className="text-[8px] uppercase tracking-widest text-parchment/40 font-mono">
                          Aptitud
                        </span>
                      </div>
                    </div>

                    {/* Dynamic 3D Progress Bar */}
                    <div className="relative h-2 w-full bg-black/60 rounded-full border border-white/10 p-0.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${metric.score}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="h-full rounded-full shadow-[0_0_8px_currentColor]"
                        style={{
                          backgroundColor: metric.color,
                          color: metric.color,
                        }}
                      />
                    </div>

                    {/* Description Paragraph */}
                    <p className="text-xs text-parchment/75 italic font-sans leading-relaxed break-words">
                      {metric.description}
                    </p>

                    {/* Clinical Focus Tag */}
                    <div className="text-[10px] text-parchment/50 border-t border-white/5 pt-2 flex items-center justify-between font-mono">
                      <span className="truncate pr-2">{metric.clinicalFocus}</span>
                      <ChevronRight size={12} className="text-gold/40 flex-shrink-0" />
                    </div>
                  </div>
                </TiltCard>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
