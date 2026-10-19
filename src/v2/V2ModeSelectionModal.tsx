import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Sparkles,
  Zap,
  ShieldCheck,
  Compass,
  CheckCircle2,
  X,
  ArrowRight,
  Crown,
} from 'lucide-react';

interface V2ModeSelectionModalProps {
  open: boolean;
  priceLabel: string;
  paymentConfigured: boolean;
  onClose: () => void;
  onSelectFree: () => void;
  onSelectPremium: () => void;
}

export function V2ModeSelectionModal({
  open,
  priceLabel,
  paymentConfigured: _paymentConfigured,
  onClose,
  onSelectFree,
  onSelectPremium,
}: V2ModeSelectionModalProps) {
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[85] flex items-center justify-center bg-black/85 p-4 sm:p-6 backdrop-blur-md overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="mode-modal-title"
            className="glass-surface relative w-full max-w-4xl space-y-6 border border-gold/30 bg-gradient-to-b from-[#16130e] via-[#0d0c0a] to-[#070605] p-6 sm:p-8 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(197,160,89,0.12)] my-auto"
          >
            {/* Ornate corner accents */}
            <div className="pointer-events-none absolute left-0 top-0 h-4 w-4 border-l-2 border-t-2 border-gold/60 rounded-tl-lg" />
            <div className="pointer-events-none absolute right-0 top-0 h-4 w-4 border-r-2 border-t-2 border-gold/60 rounded-tr-lg" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-gold/60 rounded-bl-lg" />
            <div className="pointer-events-none absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-gold/60 rounded-br-lg" />

            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-gold/15 pb-5">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/25 bg-gold/10 text-gold text-[10px] uppercase font-mono tracking-[0.25em]">
                  <Compass size={12} className="animate-spin-slow" />
                  Bifurcación de Iniciación Arcanum
                </div>
                <h2
                  id="mode-modal-title"
                  className="mt-2.5 font-display text-2xl sm:text-3xl font-bold text-gold tracking-wide"
                >
                  Elige el Rigor de tu Juicio Vocacional
                </h2>
                <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-parchment/70 max-w-2xl font-classic italic">
                  Antes de que el Sombrero examine tus pulsiones y dicte tu destino médico, selecciona el nivel de profundidad analítica que deseas recibir.
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Cerrar modal"
                className="text-parchment/40 transition-colors hover:text-gold p-1.5 rounded-lg hover:bg-gold/10"
              >
                <X size={22} />
              </button>
            </div>

            {/* Comparison Cards: Free vs Premium */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 pt-1">
              
              {/* CARD 1: Test Gratuito */}
              <div className="relative flex flex-col justify-between rounded-xl border border-gold/20 bg-black/40 p-5 sm:p-6 transition-all duration-300 hover:border-gold/40 hover:bg-black/60 shadow-inner">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-medical-teal/30 bg-medical-teal/10 px-2.5 py-1 text-[9px] uppercase font-mono tracking-widest text-medical-teal">
                      <Zap size={11} />
                      Acceso Libre
                    </span>
                    <span className="font-mono text-xs uppercase tracking-widest text-parchment/50">
                      Gratuito
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display text-xl font-bold text-parchment">
                      Test Gratuito
                    </h3>
                    <p className="text-[10px] font-mono uppercase tracking-wider text-parchment/40 mt-0.5">
                      Oráculo Express · 14 preguntas
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-parchment/65">
                      Orientación clínica esencial en 3 minutos. Identifica tus grandes ejes y afinidad heráldica sin registro.
                    </p>
                  </div>

                  <div className="border-t border-gold/10 pt-3">
                    <p className="text-[9px] uppercase font-mono tracking-widest text-parchment/40 mb-2">
                      Incluye en el dictamen:
                    </p>
                    <ul className="space-y-2 text-xs text-parchment/75">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0 text-medical-teal" />
                        <span><strong>14 preguntas</strong> clave de perfil vocacional</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0 text-medical-teal" />
                        <span>Asignación a una de las <strong>4 Casas Arcanum</strong></span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0 text-medical-teal" />
                        <span>Ranking con tus <strong>Top 5 Especialidades</strong></span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0 text-medical-teal" />
                        <span>Radar interactivo 3D y matriz de aptitudes</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0 text-medical-teal" />
                        <span><strong>Artículo de Asignación</strong> (visión esencial)</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-gold/10">
                  <button
                    onClick={() => {
                      onClose();
                      onSelectFree();
                    }}
                    className="w-full flex items-center justify-center gap-2 border border-gold/30 bg-gold/10 px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] text-parchment hover:border-gold hover:bg-gold/20 hover:text-gold transition-all duration-300 rounded-lg group cursor-pointer"
                  >
                    <span>Comenzar Test Gratuito</span>
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </button>
                  <p className="text-center text-[9px] text-parchment/35 uppercase tracking-widest mt-2">
                    Sin tarjeta ni datos personales
                  </p>
                </div>
              </div>

              {/* CARD 2: Test Premium */}
              <div className="relative flex flex-col justify-between rounded-xl border-2 border-gold/50 bg-gradient-to-b from-gold/10 via-black/60 to-black/80 p-5 sm:p-6 transition-all duration-300 hover:border-gold hover:shadow-[0_0_30px_rgba(197,160,89,0.2)]">
                {/* Floating Recommended Tag */}
                <div className="absolute -top-3 right-5 inline-flex items-center gap-1.5 rounded-full border border-gold bg-gold px-3 py-0.5 text-[9px] font-bold uppercase tracking-widest text-black shadow-md">
                  <Sparkles size={11} className="text-black" />
                  Recomendado MIR
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-gold/40 bg-gold/15 px-2.5 py-1 text-[9px] uppercase font-mono tracking-widest text-gold font-bold">
                      <Crown size={12} className="text-gold" />
                      Informe Completo
                    </span>
                    <span className="font-display text-xl text-gold font-bold">
                      {priceLabel}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display text-xl font-bold text-gold">
                      Test Premium
                    </h3>
                    <p className="text-[10px] font-mono uppercase tracking-wider text-gold/70 mt-0.5">
                      Expediente Monográfico & Extensivo
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-parchment/80">
                      Análisis clínico exhaustivo con desglose artículo monográfico, las 51 especialidades completas y dossier oficial PDF.
                    </p>
                  </div>

                  <div className="border-t border-gold/20 pt-3">
                    <p className="text-[9px] uppercase font-mono tracking-widest text-gold/60 mb-2 font-semibold">
                      Todo lo del gratuito, más:
                    </p>
                    <ul className="space-y-2 text-xs text-parchment/85">
                      <li className="flex items-start gap-2">
                        <Sparkles size={14} className="mt-0.5 flex-shrink-0 text-gold" />
                        <span><strong>Artículo Monográfico Exhaustivo</strong>: por qué te ha salido esa especialidad y casa</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Sparkles size={14} className="mt-0.5 flex-shrink-0 text-gold" />
                        <span><strong>Ranking completo de las 51 Especialidades</strong> del Sistema Nacional de Salud</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Sparkles size={14} className="mt-0.5 flex-shrink-0 text-gold" />
                        <span><strong>Duelo analítico y fricciones</strong> eje por eje entre tus principales opciones</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Sparkles size={14} className="mt-0.5 flex-shrink-0 text-gold" />
                        <span><strong>Batería adaptativa de +24 preguntas</strong> clínicas de desempate por rama</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Sparkles size={14} className="mt-0.5 flex-shrink-0 text-gold" />
                        <span><strong>Dossier Oficial en PDF descargable</strong> para repasar guardias y rotaciones</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-gold/20">
                  <button
                    onClick={() => {
                      onClose();
                      onSelectPremium();
                    }}
                    className="w-full flex items-center justify-center gap-2 border border-gold bg-gradient-to-r from-gold/30 via-gold/40 to-gold/30 px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] text-gold hover:bg-gold hover:text-black transition-all duration-300 rounded-lg shadow-lg group cursor-pointer"
                  >
                    <Crown size={15} />
                    <span>Elegir Modo Premium</span>
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </button>
                  <p className="text-center text-[9px] text-parchment/40 uppercase tracking-widest mt-2 flex items-center justify-center gap-1">
                    <ShieldCheck size={11} className="text-medical-teal/70" />
                    Pago único seguro · Entrega inmediata
                  </p>
                </div>
              </div>

            </div>

            {/* Footer reassurance */}
            <div className="border-t border-gold/15 pt-4 text-center">
              <p className="text-[10px] text-parchment/45 leading-relaxed">
                Ambos modos aplican el algoritmo vocacional ponderado sobre las 51 fichas oficiales MIR del Sistema Nacional de Salud.
                Si eliges el modo gratuito, podrás actualizar al informe monográfico en cualquier momento con tus respuestas guardadas.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
