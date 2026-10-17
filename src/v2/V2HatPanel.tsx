import { motion } from 'motion/react';
import { SortingHat } from '../components/SortingHat';
import { TypewriterText } from '../components/TypewriterText';

interface V2HatPanelProps {
  thought: string;
  thinking?: boolean;
  compact?: boolean;
}

export function V2HatPanel({ thought, thinking, compact }: V2HatPanelProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full border border-gold/20 bg-gold/5 p-1">
          <div className="scale-75">
            <SortingHat thinking={thinking} compact />
          </div>
        </div>
        <div className="min-w-0 flex-1 rounded-xl border border-gold/20 bg-black/30 px-3 py-2 text-center">
          <p className="text-[11px] italic leading-snug text-gold/85">"{thought}"</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center">
      <SortingHat thinking={thinking} />

      <motion.div
        key={thought}
        initial={{ opacity: 0, y: 14, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35 }}
        className="relative mt-6 w-full min-h-[132px]"
      >
        <div className="relative overflow-hidden rounded-2xl border border-gold/30 bg-black/40 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_20px_rgba(197,160,89,0.1)] backdrop-blur-xl">
          <div className="absolute left-0 top-0 h-4 w-4 rounded-tl-lg border-l-2 border-t-2 border-gold/40" />
          <div className="absolute right-0 top-0 h-4 w-4 rounded-tr-lg border-r-2 border-t-2 border-gold/40" />
          <div className="absolute bottom-0 left-0 h-4 w-4 rounded-bl-lg border-b-2 border-l-2 border-gold/40" />
          <div className="absolute bottom-0 right-0 h-4 w-4 rounded-br-lg border-b-2 border-r-2 border-gold/40" />

          <div className="absolute -top-3 left-1/2 h-6 w-6 -translate-x-1/2 rotate-45 border-l border-t border-gold/30 bg-black/40 backdrop-blur-xl" />

          <TypewriterText
            text={thought}
            speed={22}
            className="relative z-10 text-center font-sans text-lg italic leading-relaxed tracking-tight text-gold/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
          />

          <motion.div
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 skew-x-12 bg-gradient-to-r from-transparent via-gold/5 to-transparent"
          />
        </div>
      </motion.div>
    </div>
  );
}
