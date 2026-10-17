import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CreditCard, Loader2, Lock, ShieldCheck, X } from 'lucide-react';

interface V2PremiumModalProps {
  open: boolean;
  priceLabel: string;
  isExtensive: boolean;
  loading: boolean;
  error?: string | null;
  onClose: () => void;
  onCheckout: () => void;
}

export function V2PremiumModal({
  open,
  priceLabel,
  isExtensive,
  loading,
  error,
  onClose,
  onCheckout,
}: V2PremiumModalProps) {
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !loading) onClose();
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [loading, onClose, open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          onClick={() => {
            if (!loading) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="premium-modal-title"
            className="glass-surface w-full max-w-lg space-y-6 border-gold/30 p-6 sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-medical-teal">
                  Informe premium
                </p>
                <h2
                  id="premium-modal-title"
                  className="mt-2 font-display text-2xl font-bold text-gold"
                >
                  Desbloquear el informe completo
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-parchment/60">
                  {isExtensive
                    ? 'Incluye el ranking de 51 especialidades, el detalle de tus 10 mejores opciones y el PDF del test extensivo.'
                    : 'Incluye el ranking de 51 especialidades, el detalle de tus 10 mejores opciones y el PDF del test gratuito.'}
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Cerrar"
                autoFocus
                className="text-parchment/30 transition-colors hover:text-gold"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex items-center justify-between border-y border-gold/15 py-4">
              <div>
                <p className="text-[9px] uppercase tracking-widest text-parchment/35">
                  Pago único
                </p>
                <p className="font-display text-3xl text-gold">{priceLabel}</p>
              </div>
              <div className="text-right text-[9px] uppercase tracking-widest text-parchment/35">
                <p>Acceso al informe</p>
                <p>y PDF descargable</p>
              </div>
            </div>

            <div className="space-y-2 text-xs leading-relaxed text-parchment/50">
              <p className="flex items-start gap-2">
                <ShieldCheck size={14} className="mt-0.5 flex-shrink-0 text-medical-teal/70" />
                El pago se verifica en el servidor antes de desbloquear el informe.
              </p>
              <p className="flex items-start gap-2">
                <Lock size={14} className="mt-0.5 flex-shrink-0 text-medical-teal/70" />
                No se guardan datos de tarjeta en Arcanum. Stripe gestiona el cobro.
              </p>
              <p className="flex items-start gap-2">
                <CreditCard size={14} className="mt-0.5 flex-shrink-0 text-medical-teal/70" />
                Pago con tarjeta mediante Stripe Checkout.
              </p>
            </div>

            {error && (
              <p
                role="alert"
                aria-live="assertive"
                className="border border-rose-400/20 bg-rose-400/5 px-3 py-2 text-xs text-rose-200/80"
              >
                {error}
              </p>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={onCheckout}
                disabled={loading}
                className="inline-flex flex-1 items-center justify-center gap-2 border border-gold/60 bg-gold/15 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold/25 disabled:opacity-50"
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : <CreditCard size={14} />}
                {loading ? 'Abriendo pago' : 'Continuar con el pago'}
              </button>
              <button
                onClick={onClose}
                className="border border-gold/15 px-5 py-3 text-[10px] uppercase tracking-[0.2em] text-parchment/45 transition-colors hover:text-gold"
              >
                Ahora no
              </button>
            </div>

            <p className="text-[9px] leading-relaxed tracking-wide text-parchment/25">
              Producto digital de orientación vocacional. No es un diagnóstico médico ni una
              validación psicométrica. Al continuar aceptas la entrega inmediata del informe digital.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
