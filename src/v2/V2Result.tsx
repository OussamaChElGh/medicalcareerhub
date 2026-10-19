import React, { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import {
  ArrowLeftRight,
  Home,
  Lock,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  Award,
  Share2,
  Copy,
  Check,
  MessageSquare,
  Download,
  FileText,
} from 'lucide-react';
import {
  bandLabel,
  buildDuelLockedCopy,
  buildDuelTeaser,
  buildFreeHeadline,
  confidenceLabel,
  deriveHouse,
} from '../lib/narrative';
import { PremiumAccess } from '../lib/premium';
import { MatchBand, QuizResult } from '../types';
import { generateDossierPDF } from '../lib/dossierPdf';
import { sendTelemetryEvent } from '../lib/useTelemetry';
import { V2HatPanel } from './V2HatPanel';
import { V2PremiumReport } from './V2PremiumReport';
import { DimensionsRadarChart } from '../components/DimensionsRadarChart';
import { HouseHeroBanner } from '../components/HouseHeroBanner';
import { PremiumHookCard } from '../components/PremiumHookCard';
import { VocationalAssignmentArticle } from '../components/VocationalAssignmentArticle';

// Framer-motion orchestrated reveal variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.28,
      delayChildren: 0.08,
    },
  },
};

// Step 1: Specialty Banner reveal with initial atmospheric blur
const bannerRevealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 28,
    scale: 0.97,
    filter: 'blur(16px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.85,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// Premium Hook & subheader transition
const subheaderRevealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    filter: 'blur(10px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// Step 2 (Sequential): Radar chart & vocational matrix data reveal with deep blur transition
const radarRevealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 32,
    scale: 0.96,
    filter: 'blur(20px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.95,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// Right analytical column (Hat & Alternatives)
const deckRightRevealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
    filter: 'blur(12px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// Step 3 (Sequential): Detailed Vocational Assignment Article reveal
const articleRevealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 28,
    filter: 'blur(14px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.85,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

interface V2ResultProps {
  result: QuizResult;
  judgment?: string;
  isExtensive?: boolean;
  reportId: string;
  premiumAccess: PremiumAccess | null;
  premiumPriceLabel: string;
  paymentConfigured: boolean;
  onUnlockPremium: () => void;
  onDownloadPremium: () => void;
  premiumDownloading: boolean;
  premiumError?: string | null;
  onStartExtensive?: () => void;
  onRestart: () => void;
  onHome: () => void;
}

const BAND_STYLES: Record<MatchBand, string> = {
  Alta: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200',
  Media: 'border-medical-teal/40 bg-medical-teal/10 text-medical-teal',
  'A explorar': 'border-gold/25 bg-gold/5 text-parchment/60',
};

export function V2Result({
  result,
  judgment = '',
  isExtensive = false,
  reportId,
  premiumAccess,
  premiumPriceLabel,
  paymentConfigured,
  onUnlockPremium,
  onDownloadPremium,
  premiumDownloading,
  premiumError,
  onStartExtensive,
  onRestart,
  onHome,
}: V2ResultProps) {
  const first = result.top[0];
  const second = result.top[1];
  const runnersUp = isExtensive ? result.matches.slice(1, 8) : result.top.slice(1);
  const { house } = deriveHouse(result.profile);
  const hatText =
    judgment || 'El Sombrero aún está digiriendo tu perfil... dale un instante, mortal.';

  const [decreeCopied, setDecreeCopied] = useState(false);

  const handleShareWhatsApp = () => {
    if (!first) return;
    const shareText = `¡El Sombrero Clasificador me ha asignado ${first.specialty.name} en la ${house}! 🎓 Descubre tu vocación médica oficial en Arcanum Medicum: ${window.location.origin}`;
    sendTelemetryEvent({
      type: 'retention_action',
      actionDetail: 'share_whatsapp',
      specialtyName: first.specialty.name,
      house,
      mode: isExtensive ? 'extensive' : 'free',
    });
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleShareTwitter = () => {
    if (!first) return;
    const shareText = `He completado el Juicio del Sombrero MIR: mi especialidad predilecta es ${first.specialty.name} (${first.score.toFixed(1)}% de afinidad) en la ${house}. ¿Cuál es la tuya en Arcanum Medicum?`;
    sendTelemetryEvent({
      type: 'retention_action',
      actionDetail: 'share_twitter',
      specialtyName: first.specialty.name,
      house,
      mode: isExtensive ? 'extensive' : 'free',
    });
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(window.location.origin)}`,
      '_blank',
    );
  };

  const handleCopyDecree = async () => {
    if (!first) return;
    const text = `DECRETO OFICIAL ARCANUM MEDICUM\nEspecialidad Asignada: ${first.specialty.name} (${first.score.toFixed(1)}%)\nCasa Arquetípica: ${house}\nExpediente ID: ${reportId}\nConsultado en: ${window.location.origin}`;
    try {
      await navigator.clipboard.writeText(text);
      setDecreeCopied(true);
      setTimeout(() => setDecreeCopied(false), 3000);
      sendTelemetryEvent({
        type: 'retention_action',
        actionDetail: 'copy_decree',
        specialtyName: first.specialty.name,
        house,
        mode: isExtensive ? 'extensive' : 'free',
      });
    } catch {
      // ignore
    }
  };

  const handleDownloadDossier = () => {
    generateDossierPDF();
    sendTelemetryEvent({
      type: 'retention_action',
      actionDetail: 'dossier_download',
      specialtyName: first?.specialty.name,
      house,
      mode: isExtensive ? 'extensive' : 'free',
    });
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="mx-auto w-full max-w-6xl px-4 py-6 sm:py-10 space-y-8"
    >
      {/* 1. Grand House Heraldic Banner with Giant Specialty Title & Large Crest (Step 1 of Reveal) */}
      <motion.div variants={bannerRevealVariants}>
        <HouseHeroBanner
          house={house}
          specialtyName={first?.specialty?.name}
          specialtyFamily={first?.specialty?.family}
          specialtyType={first?.specialty?.type}
          specialtyScore={first?.score}
          specialtyBand={first ? bandLabel(first.band) : undefined}
          specialtyHeadline={first ? buildFreeHeadline(first) : undefined}
        />
      </motion.div>

      {/* 2. High-Converting Premium Hook & Calibrated Metadata */}
      <motion.div variants={subheaderRevealVariants} className="space-y-4">
        <PremiumHookCard
          onUnlockPremium={onUnlockPremium}
          onStartExtensive={onStartExtensive}
          priceLabel={premiumPriceLabel}
          paymentConfigured={paymentConfigured}
          topSpecialtyName={first?.specialty?.name}
          isExtensive={isExtensive}
        />

        {/* Subheader with Calibrated Confidence Metadata */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl border border-gold/15 bg-black/25 text-xs font-sans text-parchment/60">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-medical-teal font-mono font-semibold">
              {isExtensive ? 'Informe Extensivo (Calibrado 98%)' : 'Dictamen Preliminar'}
            </span>
            <span aria-hidden="true" className="text-gold/30">·</span>
            <span className="text-gold-dim">{confidenceLabel(result.confidence)}</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span>Cobertura: {result.confidence.coverage}%</span>
            <span aria-hidden="true" className="text-gold/30">·</span>
            <span className="text-parchment/80">{result.profile.answeredCount} preguntas respondidas</span>
          </div>
        </div>

        {result.warnings.length > 0 && (
          <div className="border border-amber-400/25 bg-amber-400/5 px-4 py-3 rounded-lg text-xs italic text-amber-200/90">
            {result.warnings.join(' ')}
          </div>
        )}
      </motion.div>

      {/* 3. Balanced 2-Column Analytical Deck (Step 2 of Reveal: Radar Chart Data on Left, Hat & Matches on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (Col-span 7): 3D Multidimensional Vocational Matrix & Radar Chart with Sequential Blur Reveal */}
        <motion.div variants={radarRevealVariants} className="lg:col-span-7 space-y-6">
          {/* Unified 3D Multidimensional Vocational Matrix (Three.js 3D Holocron, 2D Radar, 6 Calibrated Axes, Affinities) */}
          <DimensionsRadarChart v2Profile={result.profile} specialtyHouse={house} />
        </motion.div>

        {/* Right Column (Col-span 5): Hat Voice + Alternative Matches & Duel */}
        <motion.div variants={deckRightRevealVariants} className="lg:col-span-5 space-y-6">
          {/* Sombrero Diagnóstico Thought Panel */}
          <div className="w-full flex justify-center">
            <V2HatPanel thought={hatText} />
          </div>

          {/* Duelo de Desempate (si existe rivalidad cercana entre #1 y #2) */}
          {result.duel && first && second && (
            <section className="glass-surface space-y-3.5 p-5 rounded-2xl border border-gold/30 shadow-lg bg-gradient-to-b from-gold/[0.04] to-black/30">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gold font-bold">
                <ArrowLeftRight size={14} />
                <span>{result.duel.isClose ? 'Duelo por el Primer Puesto' : 'Lectura Comparativa'}</span>
              </div>
              <p className="text-xs leading-relaxed text-parchment/80 italic font-sans">
                {buildDuelTeaser(result.duel, first, second)}
              </p>

              {result.duel.isClose && (
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  {[first, second].map((match, index) => (
                    <div
                      key={match.specialty.id}
                      className={`border p-2.5 rounded-lg ${
                        index === 0 ? 'border-gold/50 bg-gold/10' : 'border-gold/20 bg-black/20'
                      }`}
                    >
                      <span className="text-[8px] uppercase tracking-widest text-parchment/40 block">
                        {index === 0 ? 'Opción 1' : 'Opción 2'}
                      </span>
                      <p className="font-display font-bold text-xs text-gold truncate">{match.specialty.name}</p>
                      <p className="font-mono text-[10px] text-parchment/60">
                        {match.score.toFixed(1)}% · {bandLabel(match.band)}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-start gap-1.5 border-t border-gold/10 pt-2.5 text-[10px] leading-relaxed text-parchment/50">
                <Lock size={12} className="mt-0.5 flex-shrink-0 text-amber-300" />
                <span>{buildDuelLockedCopy(result.duel)}</span>
              </div>
            </section>
          )}

          {/* Siguientes Especialidades Compatibles (Puestos #02 a #05) */}
          <section className="glass-surface space-y-3.5 p-5 rounded-2xl border border-gold/20 shadow-lg">
            <div className="flex items-center justify-between border-b border-gold/15 pb-2.5">
              <h3 className="font-display font-bold text-base text-gold tracking-wide">
                Otras Especialidades Compatibles
              </h3>
              <span className="text-[9px] uppercase tracking-widest text-parchment/40 font-mono">
                Puestos 02 a {runnersUp.length + 1}
              </span>
            </div>

            <div className="space-y-2.5">
              {runnersUp.map((match, idx) => {
                const rankNum = idx + 2;
                return (
                  <div
                    key={match.specialty.id}
                    className="border border-gold/15 bg-black/25 hover:border-gold/35 transition-colors p-3 rounded-xl flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-display text-lg font-bold text-gold/40 flex-shrink-0">
                        {String(rankNum).padStart(2, '0')}
                      </span>
                      <div className="min-w-0">
                        <h4 className="font-display font-bold text-sm text-parchment hover:text-gold truncate">
                          {match.specialty.name}
                        </h4>
                        <p className="text-[9px] uppercase tracking-wider text-parchment/40 truncate">
                          {match.specialty.type} · {match.specialty.family}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end flex-shrink-0 gap-1">
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[8px] uppercase font-mono tracking-widest ${BAND_STYLES[match.band]}`}
                      >
                        {bandLabel(match.band)}
                      </span>
                      <span className="font-mono text-[10px] text-parchment/50">
                        {match.score.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-gold/10 pt-3 text-center">
              <span className="text-[10px] font-mono text-parchment/45 flex items-center justify-center gap-1.5">
                <Lock size={12} className="text-amber-300" />
                46 Especialidades adicionales bloqueadas en informe básico
              </span>
            </div>
          </section>
        </motion.div>
      </div>

      {/* 4. Monografía de Asignación Vocacional: Por qué te ha salido esa especialidad y casa */}
      {first && (
        <motion.div variants={articleRevealVariants}>
          <VocationalAssignmentArticle
            match={first}
            house={house}
            profile={result.profile}
            isPremium={!!premiumAccess && premiumAccess.reportId === reportId}
            onUnlockPremium={onUnlockPremium}
            priceLabel={premiumPriceLabel}
          />
        </motion.div>
      )}

      {/* 5. Full Report Details if Unlocked / PDF Downloader */}
      <V2PremiumReport
        result={result}
        isExtensive={isExtensive}
        reportId={reportId}
        access={premiumAccess}
        priceLabel={premiumPriceLabel}
        paymentConfigured={paymentConfigured}
        onUnlock={onUnlockPremium}
        onDownload={onDownloadPremium}
        downloading={premiumDownloading}
        error={premiumError}
      />

      {/* 5. Paso 4: Acciones de Valor Real, Difusión & Retorno */}
      <section className="relative overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-b from-[#0e1726]/95 via-[#0a111c]/95 to-[#060a12]/95 p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gold/15 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase font-mono tracking-widest text-gold font-bold">
              <Sparkles size={14} className="text-gold" />
              <span>Preservar, Compartir & Retener Resolución</span>
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-parchment mt-1">
              ¿Tu dictamen vocacional tiene valor real?
            </h3>
            <p className="font-classic text-xs sm:text-sm text-[#ede1cc] max-w-2xl mt-1">
              Descarga tu expediente oficial, compártelo con compañeros de hospital o copia el decreto con tu identificador único <code className="font-mono text-gold px-1.5 py-0.5 bg-black/50 rounded border border-gold/20">{reportId ? reportId.slice(0, 10) : 'MIR-ARCANUM'}...</code>
            </p>
          </div>
          <span className="self-start sm:self-auto rounded-full border border-purple-500/40 bg-purple-950/40 px-3 py-1 text-[10px] font-mono uppercase font-bold text-purple-300">
            Fase 4 · Valor Real
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* WhatsApp share */}
          <button
            onClick={handleShareWhatsApp}
            className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-3.5 text-xs font-bold text-emerald-200 hover:bg-emerald-900/40 hover:border-emerald-400 transition-all cursor-pointer shadow-sm group"
          >
            <MessageSquare size={16} className="text-emerald-400 group-hover:scale-110 transition-transform" />
            <span>Compartir WhatsApp</span>
          </button>

          {/* Twitter / X share */}
          <button
            onClick={handleShareTwitter}
            className="flex items-center justify-center gap-2 rounded-xl border border-sky-500/40 bg-sky-950/30 p-3.5 text-xs font-bold text-sky-200 hover:bg-sky-900/40 hover:border-sky-400 transition-all cursor-pointer shadow-sm group"
          >
            <Share2 size={16} className="text-sky-400 group-hover:scale-110 transition-transform" />
            <span>Compartir en X</span>
          </button>

          {/* Copy Decree */}
          <button
            onClick={handleCopyDecree}
            className="flex items-center justify-center gap-2 rounded-xl border border-gold/40 bg-gold/10 p-3.5 text-xs font-bold text-gold hover:bg-gold/20 hover:border-gold transition-all cursor-pointer shadow-sm group"
          >
            {decreeCopied ? (
              <>
                <Check size={16} className="text-emerald-400" />
                <span className="text-emerald-300 font-bold">¡Decreto Copiado!</span>
              </>
            ) : (
              <>
                <Copy size={16} className="text-gold group-hover:scale-110 transition-transform" />
                <span>Copiar Decreto</span>
              </>
            )}
          </button>

          {/* Dossier PDF */}
          <button
            onClick={handleDownloadDossier}
            className="flex items-center justify-center gap-2 rounded-xl border border-amber-500/40 bg-amber-950/30 p-3.5 text-xs font-bold text-amber-200 hover:bg-amber-900/40 hover:border-amber-400 transition-all cursor-pointer shadow-sm group"
          >
            <Download size={16} className="text-amber-400 group-hover:scale-110 transition-transform" />
            <span>Dossier MIR (PDF)</span>
          </button>
        </div>
      </section>

      {/* 6. Navigation & Legal Footer */}
      <div className="flex flex-col items-center justify-center gap-3 pt-4 border-t border-gold/15 sm:flex-row">
        <button
          onClick={onRestart}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-parchment/60 transition-colors hover:text-gold cursor-pointer"
        >
          <RefreshCw size={13} />
          Repetir test
        </button>
        <span className="hidden text-parchment/20 sm:inline">·</span>
        <button
          onClick={onHome}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-parchment/60 transition-colors hover:text-gold cursor-pointer"
        >
          <Home size={13} />
          Volver al inicio
        </button>
      </div>

      <p className="text-center text-[9px] leading-relaxed tracking-wide text-parchment/30 pb-4">
        Este resultado es orientativo y no constituye una recomendación vinculante. Los perfiles de
        las especialidades están calibrados según el programa formativo oficial MIR. La Casa es un
        arquetipo narrativo de afinidad médica.
      </p>
    </motion.div>
  );
}
