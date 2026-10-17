import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, Sparkles, Wand2, RefreshCw } from 'lucide-react';
import { ORACLE_QUOTES } from '../constants';

export const OracleView: React.FC = () => {
  const [quote, setQuote] = useState<string | null>(null);
  const [isConsulting, setIsConsulting] = useState(false);

  const getOracleAdvice = () => {
    setIsConsulting(true);
    setQuote(null);
    
    // Artificial delay for "mystical" effect
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * ORACLE_QUOTES.length);
      setQuote(ORACLE_QUOTES[randomIndex]);
      setIsConsulting(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-12 pb-20">
      <div className="text-center space-y-4 max-w-xl">
        <h2 className="text-3xl sm:text-5xl font-display font-bold text-gold tracking-tighter">
          El Consultorio del Sombrero
        </h2>
        <p className="text-gold-dim/70 text-sm sm:text-base italic">
          "Dudas existenciales, crisis de guardia o simplemente curiosidad. El sombrero siempre tiene un veredicto (y quizá un poco de sarcasmo)."
        </p>
      </div>

      <div className="relative w-full max-w-2xl">
        <motion.div 
          layout
          className="glass-surface p-10 sm:p-16 rounded-[2rem] border border-gold/20 flex flex-col items-center space-y-8 min-h-[300px] justify-center text-center shadow-[0_40px_100px_rgba(0,0,0,0.6)] overflow-hidden"
        >
          {/* Animated Background Ornaments */}
          <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none overflow-hidden">
            <div className="absolute -top-20 -left-20 w-64 h-64 border border-gold rounded-full animate-spin-slow" />
            <div className="absolute -bottom-20 -right-20 w-80 h-80 border border-medical-teal rounded-full animate-reverse-spin" />
          </div>

          <AnimatePresence mode="wait">
            {!quote && !isConsulting ? (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6 flex flex-col items-center"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gold/20 blur-3xl rounded-full animate-pulse" />
                  <MessageCircle className="text-gold relative z-10" size={64} />
                </div>
                <p className="text-gold-dim uppercase tracking-[.3em] text-xs font-bold">Listo para juzgar tu día</p>
              </motion.div>
            ) : isConsulting ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="flex flex-col items-center space-y-6"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshCw className="text-medical-teal opacity-50" size={48} />
                </motion.div>
                <p className="text-medical-teal font-magic animate-pulse tracking-widest text-sm italic">Consultando los archivos de la providencia...</p>
              </motion.div>
            ) : (
              <motion.div
                key="quote"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8 relative z-10"
              >
                <div className="flex justify-center text-gold/30">
                  <Sparkles size={24} />
                </div>
                <blockquote className="text-xl sm:text-2xl font-serif text-white italic leading-relaxed">
                  "{quote}"
                </blockquote>
                <div className="h-[1px] w-12 bg-gold/30 mx-auto" />
                <p className="text-[10px] uppercase tracking-[.4em] text-gold-dim">El Sombrero ha hablado</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Action Button */}
        <div className="mt-12 flex justify-center">
          <button
            onClick={getOracleAdvice}
            disabled={isConsulting}
            className="group relative px-8 py-4 bg-gold text-academy-navy font-bold rounded-2xl overflow-hidden shadow-[0_15px_35px_rgba(197,160,89,0.3)] hover:shadow-[0_20px_50px_rgba(197,160,89,0.5)] transition-all hover:-translate-y-1 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none"
          >
            <div className="relative z-10 flex items-center space-x-3">
              <Wand2 size={18} className="group-hover:rotate-12 transition-transform" />
              <span className="uppercase tracking-widest text-xs">Consultar al Sombrero</span>
            </div>
            
            {/* Hover effect */}
            <div className="absolute inset-x-0 bottom-0 h-0 bg-white/20 group-hover:h-full transition-all duration-300 pointer-events-none" />
          </button>
        </div>
      </div>

      {/* Decorative text */}
      <div className="flex items-center space-x-4 opacity-30 select-none">
        <div className="h-[1px] w-12 bg-gold" />
        <span className="text-[8px] uppercase tracking-[.8em] text-gold">NON PLVS ULTRA</span>
        <div className="h-[1px] w-12 bg-gold" />
      </div>
    </div>
  );
};
