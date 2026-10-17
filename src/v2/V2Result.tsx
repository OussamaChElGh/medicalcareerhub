import { motion } from 'motion/react';
import {
  ArrowLeftRight,
  Home,
  Lock,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import {
  DIMENSIONS,
  ENVIRONMENT_LABELS,
  NUMERIC_DIMENSIONS,
  OUTCOME_LABELS,
  POPULATION_LABELS,
  SYSTEM_LABELS,
} from '../data/dimensions';
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
import { V2HatPanel } from './V2HatPanel';
import { V2PremiumReport } from './V2PremiumReport';

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
  const displayedMatches = isExtensive ? result.matches.slice(0, 10) : result.top;
  const { house } = deriveHouse(result.profile);
  const hatText =
    judgment || 'El Sombrero aún está digiriendo tu perfil... dale un instante, mortal.';

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-12">
      <div className="flex flex-col lg:flex-row lg:items-start lg:gap-12">
        <aside className="hidden lg:sticky lg:top-24 lg:flex lg:w-[320px] lg:flex-shrink-0 lg:flex-col lg:items-center">
          <V2HatPanel thought={hatText} />

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 flex items-center gap-3 border border-gold/20 bg-black/25 px-4 py-3"
          >
            <img
              src={`/house-${house.toLowerCase()}.png`}
              alt={`Casa ${house}`}
              className="h-14 w-14 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.12)]"
              referrerPolicy="no-referrer"
            />
            <div>
              <p className="font-magic text-sm tracking-wide text-gold">Casa {house}</p>
              <p className="text-[8px] uppercase tracking-widest text-parchment/35">
                Arquetipo narrativo
              </p>
            </div>
          </motion.div>
        </aside>

        <div className="w-full space-y-6 lg:flex-1">
          <div className="lg:hidden">
            <V2HatPanel thought={hatText} compact />
          </div>

          <motion.header
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3 text-center"
          >
            <span className="text-[10px] uppercase tracking-[0.4em] text-medical-teal">
              {isExtensive ? 'Informe vocacional · test extensivo' : 'Resultado del test gratuito'}
            </span>
            <h1 className="font-display text-3xl font-bold tracking-wider text-gold magic-shadow sm:text-5xl">
              {isExtensive ? 'Tu mapa vocacional' : 'Tu top 5 vocacional'}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] uppercase tracking-widest">
              <span className="rounded-full border border-gold/25 bg-gold/5 px-3 py-1 text-gold-dim">
                {confidenceLabel(result.confidence)}
              </span>
              <span className="rounded-full border border-gold/15 px-3 py-1 text-parchment/40">
                Cobertura {result.confidence.coverage}%
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-gold/15 px-3 py-1 text-parchment/40">
                <img
                  src={`/house-${house.toLowerCase()}.png`}
                  alt=""
                  className="h-4 w-4 object-contain"
                  referrerPolicy="no-referrer"
                />
                Casa {house}
              </span>
            </div>
          </motion.header>

          {result.warnings.length > 0 && (
            <div className="border border-amber-400/20 bg-amber-400/5 px-4 py-3 text-xs italic text-amber-200/80">
              {result.warnings.join(' ')}
            </div>
          )}

          <section className="glass-surface space-y-4 p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-gold/15 pb-3">
              <h2 className="font-magic text-xl text-gold">
                {isExtensive ? 'Tus 10 más compatibles' : 'Las 5 más compatibles'}
              </h2>
              <span className="text-[9px] uppercase tracking-widest text-parchment/35">
                {isExtensive
                  ? `Test extensivo · ${result.profile.answeredCount} preguntas`
                  : `Orientativo · ${result.profile.answeredCount} preguntas`}
              </span>
            </div>

            <div className="space-y-3">
              {displayedMatches.map((match, index) => (
                <div
                  key={match.specialty.id}
                  className={`border p-4 sm:p-5 ${
                    index === 0 ? 'border-gold/50 bg-gold/[0.07]' : 'border-gold/15 bg-black/10'
                  }`}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-display text-2xl text-gold/35">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <h3
                          className={`font-magic ${
                            index === 0 ? 'text-xl text-gold' : 'text-lg text-parchment'
                          }`}
                        >
                          {match.specialty.name}
                        </h3>
                        <p className="text-[9px] uppercase tracking-widest text-parchment/35">
                          {match.specialty.type} · {match.specialty.family}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                      <span
                        className={`rounded-full border px-3 py-1 text-[9px] uppercase tracking-widest ${BAND_STYLES[match.band]}`}
                      >
                        {bandLabel(match.band)}
                      </span>
                      <span className="font-mono text-xs text-parchment/40">
                        {match.score.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  {index === 0 || (isExtensive && index < 3) ? (
                    <div className="mt-4 space-y-3">
                      <p className="text-sm leading-relaxed text-parchment/75">
                        {buildFreeHeadline(match)}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {match.reasons.map((reason) => (
                          <span
                            key={reason.dimension}
                            className="rounded-full border border-medical-teal/25 bg-medical-teal/5 px-3 py-1 text-[9px] uppercase tracking-widest text-medical-teal/80"
                          >
                            {reason.label}
                          </span>
                        ))}
                      </div>
                      {index === 0 && match.frictions.length > 0 && (
                        <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-amber-200/60">
                          <Lock size={12} />
                          1 punto de fricción bloqueado
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="mt-3 flex items-center gap-2 text-[9px] uppercase tracking-widest text-parchment/30">
                      <Lock size={12} />
                      Motivo y fricciones en el informe completo
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {result.duel && first && second && (
            <section className="glass-surface space-y-4 p-6 sm:p-8">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gold">
                <ArrowLeftRight size={14} />
                {result.duel.isClose ? 'Duelo por el primer puesto' : 'Lectura del primer puesto'}
              </div>
              <p className="text-sm leading-relaxed text-parchment/80">
                {buildDuelTeaser(result.duel, first, second)}
              </p>

              {result.duel.isClose && (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {[first, second].map((match, index) => (
                    <div
                      key={match.specialty.id}
                      className={`border p-4 ${
                        index === 0 ? 'border-gold/40 bg-gold/5' : 'border-gold/15 bg-black/10'
                      }`}
                    >
                      <p className="text-[9px] uppercase tracking-widest text-parchment/35">
                        {index === 0 ? 'Primera opción' : 'Segunda opción'}
                      </p>
                      <p className="mt-1 font-magic text-lg text-gold">{match.specialty.name}</p>
                      <p className="mt-2 font-mono text-sm text-parchment/50">
                        {match.score.toFixed(1)} · {bandLabel(match.band)}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-start gap-2 border-t border-gold/10 pt-4 text-[10px] leading-relaxed tracking-wide text-parchment/45">
                <Lock size={13} className="mt-0.5 flex-shrink-0" />
                <span>{buildDuelLockedCopy(result.duel)}</span>
              </div>

              {!isExtensive && onStartExtensive && (
                <button
                  onClick={onStartExtensive}
                  className="inline-flex w-full items-center justify-center gap-2 border border-gold/60 bg-gold/15 px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-gold transition-all hover:bg-gold/25 sm:w-auto"
                >
                  <Sparkles size={14} />
                  Resolver el desempate (beta)
                </button>
              )}
            </section>
          )}

          <section className="glass-surface space-y-5 p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-gold/15 pb-3">
              <h2 className="font-magic text-xl text-gold">Tu perfil</h2>
              <span className="text-[9px] uppercase tracking-widest text-parchment/35">
                6 ejes
              </span>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {NUMERIC_DIMENSIONS.map((dimension) => {
                const definition = DIMENSIONS[dimension];
                const value = result.profile.numeric[dimension];
                const width = value === null ? 0 : (value / 4) * 100;

                return (
                  <div key={dimension} className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-widest">
                      <span className="text-parchment/60">{definition.label}</span>
                      <span className="font-mono text-parchment/35">
                        {value === null ? 'Sin datos' : `${value.toFixed(1)}/4`}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-gold/10">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${width}%` }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="h-full bg-gradient-to-r from-medical-teal/60 to-gold"
                      />
                    </div>
                    <div className="flex justify-between text-[8px] uppercase tracking-wider text-parchment/25">
                      <span>{definition.lowLabel}</span>
                      <span>{definition.highLabel}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-2 border-t border-gold/10 pt-4">
              {result.profile.populations.map((key) => (
                <span
                  key={key}
                  className="rounded-full border border-gold/20 px-3 py-1 text-[9px] uppercase tracking-widest text-parchment/50"
                >
                  {POPULATION_LABELS[key]}
                </span>
              ))}
              {result.profile.outcomes.map((key) => (
                <span
                  key={key}
                  className="rounded-full border border-gold/20 px-3 py-1 text-[9px] uppercase tracking-widest text-parchment/50"
                >
                  {OUTCOME_LABELS[key]}
                </span>
              ))}
              {result.profile.environments.map((key) => (
                <span
                  key={key}
                  className="rounded-full border border-gold/20 px-3 py-1 text-[9px] uppercase tracking-widest text-parchment/50"
                >
                  {ENVIRONMENT_LABELS[key]}
                </span>
              ))}
              {result.profile.systems.map((key) => (
                <span
                  key={key}
                  className="rounded-full border border-medical-teal/25 bg-medical-teal/5 px-3 py-1 text-[9px] uppercase tracking-widest text-medical-teal/70"
                >
                  {SYSTEM_LABELS[key]}
                </span>
              ))}
            </div>
          </section>

          {!isExtensive && onStartExtensive && !result.duel && (
            <div className="border border-gold/20 bg-gold/5 p-4">
              <button
                onClick={onStartExtensive}
                className="inline-flex w-full items-center justify-center gap-2 border border-gold/60 bg-gold/15 px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-gold transition-all hover:bg-gold/25 sm:w-auto"
              >
                <Sparkles size={14} />
                Hacer el test extensivo (beta)
              </button>
            </div>
          )}

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

          <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
            <button
              onClick={onRestart}
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-parchment/50 transition-colors hover:text-gold"
            >
              <RefreshCw size={13} />
              Repetir test
            </button>
            <span className="hidden text-parchment/20 sm:inline">·</span>
            <button
              onClick={onHome}
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-parchment/50 transition-colors hover:text-gold"
            >
              <Home size={13} />
              Volver al inicio
            </button>
          </div>

          <p className="text-center text-[9px] leading-relaxed tracking-wide text-parchment/25">
            Este resultado es orientativo y no constituye una recomendación definitiva. Los perfiles de
            las especialidades son preliminares y están en beta. La Casa es un arquetipo narrativo,
            no un criterio de recomendación.
          </p>
        </div>
      </div>
    </div>
  );
}
