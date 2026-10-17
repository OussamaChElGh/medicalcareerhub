import {
  ArrowLeftRight,
  CheckCircle2,
  Download,
  FileText,
  Loader2,
  Lock,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { DIMENSIONS } from '../data/dimensions';
import { confidenceLabel, frictionText, reasonText } from '../lib/narrative';
import { PremiumAccess } from '../lib/premium';
import { QuizResult } from '../types';

interface V2PremiumReportProps {
  result: QuizResult;
  isExtensive: boolean;
  reportId: string;
  access: PremiumAccess | null;
  priceLabel: string;
  paymentConfigured: boolean;
  onUnlock: () => void;
  onDownload: () => void;
  downloading: boolean;
  error?: string | null;
}

const FEATURES = [
  'Ranking completo de las 51 especialidades',
  'Motivos y fricciones de tus 10 mejores opciones',
  'Comparación eje por eje del primer puesto',
  'Condiciones laborales y puntos de cautela',
  'Itinerario para seguir explorando',
  'Informe PDF descargable con tus respuestas',
];

export function V2PremiumReport({
  result,
  isExtensive,
  reportId,
  access,
  priceLabel,
  paymentConfigured,
  onUnlock,
  onDownload,
  downloading,
  error,
}: V2PremiumReportProps) {
  const unlocked = !!access && access.reportId === reportId;
  const detailed = result.matches.slice(0, 10);
  const comparison = result.duel?.comparison ?? [];

  return (
    <section className="space-y-5 border border-gold/30 bg-gradient-to-b from-gold/[0.08] to-transparent p-6 sm:p-8">
      <div className="flex flex-col gap-4 border-b border-gold/15 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-1 flex-shrink-0 text-gold" size={24} />
          <div>
            <h2 className="font-display text-xl font-bold tracking-wide text-gold">
              Informe premium
            </h2>
            <p className="mt-1 text-[10px] uppercase tracking-widest text-parchment/40">
              {unlocked
                ? `Acceso verificado · ${access.expiresAt.slice(0, 10)}`
                : 'Ranking completo · comparación · PDF'}
            </p>
          </div>
        </div>
        <span
          className={`w-fit rounded-full border px-3 py-1 text-[9px] uppercase tracking-widest ${
            unlocked
              ? 'border-medical-teal/40 bg-medical-teal/10 text-medical-teal'
              : 'border-gold/25 bg-black/20 text-parchment/40'
          }`}
        >
          {unlocked ? 'Desbloqueado' : 'Bloqueado'}
        </span>
      </div>

      {!unlocked ? (
        <div className="space-y-5">
          <p className="max-w-2xl text-sm leading-relaxed text-parchment/70">
            Tu resultado gratuito te da la dirección. El informe completo te explica el resto:
            qué especialidades quedan cerca, qué ejes te separan de ellas y qué deberías probar
            antes de decidir.
          </p>

          <ul className="grid grid-cols-1 gap-2 text-sm text-parchment/70 sm:grid-cols-2">
            {FEATURES.map((feature) => (
              <li key={feature} className="flex items-start gap-2">
                <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0 text-medical-teal/70" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-3 border-t border-gold/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-display text-2xl text-gold">{priceLabel}</p>
              <p className="text-[9px] uppercase tracking-widest text-parchment/35">
                Pago único para este informe · incluye PDF
              </p>
            </div>
            <button
              onClick={onUnlock}
              disabled={!paymentConfigured}
              className="inline-flex items-center justify-center gap-2 border border-gold/60 bg-gold/15 px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-gold transition-all hover:bg-gold/25 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Sparkles size={14} />
              {paymentConfigured ? 'Desbloquear informe' : 'Pago no configurado'}
            </button>
          </div>

          <p className="text-[9px] leading-relaxed tracking-wide text-parchment/30">
            El informe es orientativo y no sustituye al consejo de tutores o residentes. No es un
            diagnóstico ni una validación psicométrica. El acceso se guarda en este navegador.
          </p>

          {error && (
            <p className="border border-rose-400/20 bg-rose-400/5 px-3 py-2 text-xs text-rose-200/80">
              {error}
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-relaxed text-parchment/65">
              Informe generado con {result.profile.answeredCount} respuestas ·{' '}
              {confidenceLabel(result.confidence)}. Incluye el ranking completo y el detalle de tus
              diez mejores opciones.
            </p>
            <button
              onClick={onDownload}
              disabled={downloading}
              className="inline-flex items-center justify-center gap-2 border border-gold/50 bg-gold/10 px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.18em] text-gold transition-colors hover:bg-gold/20 disabled:opacity-50"
            >
              {downloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
              {downloading ? 'Generando PDF' : 'Descargar PDF'}
            </button>
          </div>

          {error && (
            <p className="border border-rose-400/20 bg-rose-400/5 px-3 py-2 text-xs text-rose-200/80">
              {error}
            </p>
          )}

          <div>
            <div className="mb-3 flex items-center gap-2">
              <FileText size={14} className="text-gold" />
              <h3 className="font-magic text-lg text-gold">Tus diez más compatibles</h3>
            </div>
            <div className="space-y-3">
              {detailed.map((match, index) => (
                <div
                  key={match.specialty.id}
                  className={`border p-4 ${
                    index === 0 ? 'border-gold/40 bg-gold/[0.06]' : 'border-gold/15 bg-black/10'
                  }`}
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono text-[10px] text-gold/40">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <p className="font-magic text-lg text-gold">{match.specialty.name}</p>
                        <p className="text-[9px] uppercase tracking-widest text-parchment/35">
                          {match.specialty.type} · {match.specialty.family}
                        </p>
                      </div>
                    </div>
                    <p className="font-mono text-xs text-parchment/45">
                      {match.score.toFixed(1)} · {match.band}
                    </p>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-parchment/65">
                    {match.specialty.description}
                  </p>

                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <div className="space-y-1">
                      <p className="text-[9px] uppercase tracking-widest text-medical-teal/60">
                        A favor
                      </p>
                      {match.reasons.length > 0 ? (
                        match.reasons.map((reason) => (
                          <p key={reason.dimension} className="text-xs leading-relaxed text-parchment/55">
                            {reasonText(reason)}
                          </p>
                        ))
                      ) : (
                        <p className="text-xs text-parchment/35">
                          Sin motivos diferenciales suficientes.
                        </p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] uppercase tracking-widest text-amber-200/60">
                        A revisar
                      </p>
                      {match.frictions.length > 0 ? (
                        match.frictions.map((friction) => (
                          <p key={friction.dimension} className="text-xs leading-relaxed text-parchment/55">
                            {frictionText(friction)}
                          </p>
                        ))
                      ) : (
                        <p className="text-xs text-parchment/35">Sin fricciones destacadas.</p>
                      )}
                      {match.constraintNotes.map((note) => (
                        <p key={note} className="text-xs leading-relaxed text-parchment/45">
                          {note}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {comparison.length > 0 && (
            <div>
              <div className="mb-3 flex items-center gap-2">
                <ArrowLeftRight size={14} className="text-gold" />
                <h3 className="font-magic text-lg text-gold">Comparación del primer puesto</h3>
              </div>
              <p className="mb-3 text-sm leading-relaxed text-parchment/60">
                {result.duel && result.duel.isClose
                  ? 'El primer puesto está disputado. Esta tabla muestra qué ejes favorecen a cada opción.'
                  : 'El primer puesto se separa con claridad. Esta tabla muestra en qué ejes se apoya.'}
              </p>
              <div className="overflow-x-auto border border-gold/15">
                <table className="w-full min-w-[520px] text-left">
                  <thead className="bg-white/5 text-[9px] uppercase tracking-widest text-parchment/40">
                    <tr>
                      <th className="px-3 py-2">Eje</th>
                      <th className="px-3 py-2">Tú</th>
                      <th className="px-3 py-2">Primera</th>
                      <th className="px-3 py-2">Segunda</th>
                      <th className="px-3 py-2">Ventaja</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparison.map((axis) => (
                      <tr key={axis.dimension} className="border-t border-gold/10 text-xs text-parchment/60">
                        <td className="px-3 py-2">{DIMENSIONS[axis.dimension].label}</td>
                        <td className="px-3 py-2 font-mono">{axis.userValue.toFixed(1)}</td>
                        <td className="px-3 py-2 font-mono">{axis.firstValue.toFixed(1)}</td>
                        <td className="px-3 py-2 font-mono">{axis.secondValue.toFixed(1)}</td>
                        <td className="px-3 py-2">
                          {axis.winner === 'tie'
                            ? 'Empate'
                            : axis.winner === 'first'
                              ? 'Primera'
                              : 'Segunda'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div>
            <div className="mb-3 flex items-center gap-2">
              <Lock size={14} className="text-gold" />
              <h3 className="font-magic text-lg text-gold">Ranking completo</h3>
            </div>
            <div className="grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2">
              {result.matches.map((match, index) => (
                <div
                  key={match.specialty.id}
                  className="flex items-baseline justify-between gap-3 border-b border-gold/10 py-1.5 text-xs"
                >
                  <span className="text-parchment/55">
                    <span className="mr-2 font-mono text-[10px] text-parchment/25">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {match.specialty.name}
                  </span>
                  <span className="whitespace-nowrap font-mono text-[10px] text-gold/60">
                    {match.score.toFixed(1)} · {match.band}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gold/10 pt-4">
            <p className="text-[9px] leading-relaxed tracking-wide text-parchment/30">
              Este informe es orientativo y no constituye un diagnóstico, una recomendación
              definitiva ni una validación psicométrica. Los perfiles son preliminares y están en
              beta. La Casa es un arquetipo narrativo y no participa en el cálculo del ranking. El
              acceso se guarda solo en este navegador.
            </p>
            <p className="mt-2 font-mono text-[9px] text-parchment/20">
              {reportId} · {isExtensive ? 'test extensivo' : 'test gratuito'} · v
              {result.versions.scoring}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
