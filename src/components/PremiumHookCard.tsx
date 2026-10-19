import React from 'react';
import { motion } from 'motion/react';
import {
  Lock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Award,
} from 'lucide-react';

interface PremiumHookCardProps {
  onUnlockPremium: () => void;
  onStartExtensive?: () => void;
  priceLabel?: string;
  paymentConfigured?: boolean;
  topSpecialtyName?: string;
  isExtensive?: boolean;
}

export const PremiumHookCard: React.FC<PremiumHookCardProps> = ({
  onUnlockPremium,
  onStartExtensive,
  priceLabel = '4,99 €',
  paymentConfigured = true,
  topSpecialtyName = 'tu especialidad afín',
  isExtensive = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="relative overflow-hidden rounded-2xl border-2 border-gold/45 bg-gradient-to-r from-[#1c1810]/95 via-[#131722]/95 to-[#0b0e15]/95 p-5 sm:p-7 shadow-[0_15px_50px_rgba(197,160,89,0.18)]"
    >
      {/* Decorative ambient aura */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-gold/15 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-medical-teal/15 rounded-full blur-[90px] pointer-events-none" />

      {/* Header bar: Alert pill, Hook headline and Price tag */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/20 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-amber-400/40 bg-amber-400/10 text-amber-300 font-mono text-[9px] sm:text-[10px] uppercase tracking-widest">
            <AlertTriangle size={11} />
            <span>Dictamen Preliminar · Solo 12 Variables Analizadas</span>
          </div>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-parchment tracking-wide">
            ¿Seguro que <span className="text-gold underline underline-offset-4 decoration-gold/40">{topSpecialtyName}</span> es tu única opción vocacional?
          </h3>
          <p className="text-xs sm:text-sm text-parchment/70 font-sans italic max-w-2xl">
            Has descubierto tu afinidad #1, pero el algoritmo oficial de la Academia Arcanum analiza 51 especialidades MIR y detecta fricciones críticas de guardias y riesgo de burnout.
          </p>
        </div>

        <div className="flex-shrink-0 text-left sm:text-right bg-gold/5 border border-gold/20 px-4 py-2 rounded-xl">
          <span className="text-[9px] uppercase tracking-widest text-parchment/50 block">Acceso Completo</span>
          <span className="text-2xl sm:text-3xl font-display font-black text-gold">{priceLabel}</span>
          <span className="text-[8px] uppercase tracking-wider text-parchment/40 block">Pago único · Informe PDF oficial</span>
        </div>
      </div>

      {/* Compact 2-Column Deck: Locked Preview on Left + Key Benefits on Right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 py-4 items-center">
        {/* Left: Teaser with locked ranking (Col-span 5) */}
        <div className="md:col-span-5 relative rounded-xl border border-gold/20 bg-black/40 p-3.5 overflow-hidden">
          <div className="flex items-center justify-between text-[10px] font-mono text-parchment/60 pb-2">
            <span className="uppercase text-gold-dim font-bold">Ranking 04 a 51 Oculto</span>
            <span className="flex items-center gap-1 text-amber-300/80 font-bold">
              <Lock size={11} /> 46 Plazas Bloqueadas
            </span>
          </div>

          <div className="relative space-y-1.5 select-none opacity-80">
            {/* Overlay Lock Banner */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-[4px] rounded-lg z-10 flex flex-col items-center justify-center p-2 text-center border border-gold/30">
              <div className="p-2 rounded-full bg-gold/15 border border-gold/40 text-gold mb-1 shadow-[0_0_15px_rgba(197,160,89,0.3)]">
                <Lock size={16} />
              </div>
              <p className="font-display font-bold text-xs sm:text-sm text-parchment">
                46 Especialidades & Matriz de Incompatibilidad
              </p>
              <p className="text-[10px] text-parchment/65 italic">
                Descubre qué plazas tienen más del 90% de afinidad y cuáles conllevan alto riesgo de deserción.
              </p>
            </div>

            {/* Blurred Rows */}
            <div className="p-2 rounded bg-white/[0.03] border border-white/5 flex items-center justify-between text-[11px] font-mono">
              <span className="text-gold/50 font-bold">04 · Especialidad Alternativa</span>
              <span className="text-medical-teal font-bold">92.4% AFINIDAD</span>
            </div>
            <div className="p-2 rounded bg-white/[0.03] border border-white/5 flex items-center justify-between text-[11px] font-mono">
              <span className="text-gold/50 font-bold">05 · Especialidad Médica</span>
              <span className="text-medical-teal font-bold">89.8% AFINIDAD</span>
            </div>
          </div>
        </div>

        {/* Right: Premium Unlocked Benefits (Col-span 7) */}
        <div className="md:col-span-7 bg-black/30 border border-gold/20 rounded-xl p-3.5 space-y-2 text-xs">
          <span className="font-mono text-[10px] uppercase text-gold font-bold flex items-center gap-1.5 pb-1 border-b border-gold/15">
            <Award size={13} className="text-gold" />
            <span>Al desbloquear el Informe Maestro Oficial obtendrás:</span>
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-parchment/85 font-sans">
            <div className="flex items-start gap-1.5">
              <CheckCircle2 size={13} className="text-gold mt-0.5 flex-shrink-0" />
              <span>Ranking del 1 al 51 de especialidades MIR</span>
            </div>
            <div className="flex items-start gap-1.5">
              <CheckCircle2 size={13} className="text-gold mt-0.5 flex-shrink-0" />
              <span>Análisis de puntos de fricción y burnout</span>
            </div>
            <div className="flex items-start gap-1.5">
              <CheckCircle2 size={13} className="text-gold mt-0.5 flex-shrink-0" />
              <span>Resolución de duelos y empates técnicos</span>
            </div>
            <div className="flex items-start gap-1.5">
              <CheckCircle2 size={13} className="text-gold mt-0.5 flex-shrink-0" />
              <span>Informe PDF oficial clínico de 12 págs para imprimir</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dual High-Conversion CTA Buttons */}
      <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
        {/* Main Gold CTA: Unlock Premium Report */}
        <button
          onClick={onUnlockPremium}
          disabled={!paymentConfigured}
          className="flex-1 inline-flex items-center justify-center gap-2.5 border-2 border-gold bg-gradient-to-r from-gold/30 via-gold/45 to-gold/30 px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-[0.18em] text-parchment hover:text-white transition-all transform hover:scale-[1.01] shadow-[0_0_25px_rgba(197,160,89,0.35)] disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
        >
          <Sparkles size={16} className="text-gold group-hover:rotate-12 transition-transform" />
          <span>Desbloquear Informe Maestro ({priceLabel})</span>
          <ArrowRight size={15} className="text-gold group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Secondary Teal CTA: Start 60-Question Extensive Test */}
        {onStartExtensive && !isExtensive && (
          <button
            onClick={onStartExtensive}
            className="flex-1 inline-flex items-center justify-center gap-2 border border-medical-teal/60 bg-medical-teal/15 px-5 py-3.5 rounded-xl text-xs font-bold uppercase tracking-[0.16em] text-medical-teal hover:bg-medical-teal/25 transition-all transform hover:scale-[1.01] cursor-pointer"
          >
            <FileText size={15} />
            <span>Hacer Test Extensivo (60 Casos · Beta)</span>
          </button>
        )}
      </div>
    </motion.div>
  );
};
