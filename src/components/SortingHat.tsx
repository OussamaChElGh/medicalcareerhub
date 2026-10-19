import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SortingHatProps {
  thinking?: boolean;
  compact?: boolean;
}

export const SortingHat: React.FC<SortingHatProps> = ({ thinking, compact }) => {
  const [imgError, setImgError] = React.useState(false);

  // Path to the image in the public folder
  const sortingHatSrc = "/magic-sorting-hat.png";

  // Technological data fragments for the telemetry data stream
  const leftTelemetry = useMemo(() => [
    'BIO_SIG: ACTIVE',
    'EEG_α: 11.4 Hz',
    'NEURO_MAP: 98.4%',
    'SYNAPSE_FLUX: 420',
    'VOC_INDEX: 0.962',
    'AXON_TRACE: OK',
  ], []);

  const rightTelemetry = useMemo(() => [
    'SCAN_RATE: 120 FPS',
    '0x4F8A // MATCH',
    'CORTEX_RESONANCE',
    'REF: BIO-CLINIC',
    'Δ_PRESSURE: 120/80',
    'ALGO_VERDICT: CALC',
  ], []);

  return (
    <div className={`relative ${compact ? 'w-24 h-24 xs:w-32 xs:h-32 sm:w-36 sm:h-36' : 'w-56 h-56 sm:w-72 sm:h-72'} md:w-96 md:h-96 flex items-center justify-center transition-all duration-700 select-none`}>
      {/* Background Glow - Medical Magic */}
      <motion.div
        animate={{
          scale: thinking ? [1.1, 1.35, 1.1] : [1, 1.2, 1],
          opacity: thinking ? [0.25, 0.45, 0.25] : [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: thinking ? 2 : 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className={`absolute w-2/3 h-2/3 ${thinking ? 'bg-medical-teal' : 'bg-medical-teal'} rounded-full blur-[80px] pointer-events-none`}
      />

      {/* Secondary Tech Pulse during Thinking */}
      <AnimatePresence>
        {thinking && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: [0.1, 0.3, 0.1],
              scale: [0.9, 1.4, 0.9],
              rotate: [0, 180, 360]
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute w-3/4 h-3/4 rounded-full border border-medical-teal/20 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Main Hat Body Container */}
      <motion.div
        animate={thinking ? {
          rotate: [-1.5, 1.5, -1.5],
          scale: [1, 1.05, 1],
          y: [0, -10, 0],
        } : {
          y: [-5, 5, -5],
          rotate: [-0.5, 0.5, -0.5]
        }}
        transition={{
          duration: thinking ? 0.35 : 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative z-10 w-full h-full flex items-center justify-center"
      >
        {!imgError ? (
          <img
            src={sortingHatSrc}
            alt="Sombrero Seleccionador de la Esencia"
            onError={() => setImgError(true)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain filter drop-shadow-[0_20px_50px_rgba(0,0,0,1)]"
          />
        ) : (
          /* FALLBACK SVG - Elegant gothic arcane hat silhouette */
          <svg viewBox="0 0 400 400" className="w-full h-full filter drop-shadow-[0_15px_35px_rgba(0,0,0,0.9)]">
             <defs>
               <radialGradient id="hatGlow" cx="50%" cy="50%" r="50%">
                 <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.3"/>
                 <stop offset="100%" stopColor="#14b8a6" stopOpacity="0"/>
               </radialGradient>
               <linearGradient id="hatGrad" x1="0" y1="0" x2="0" y2="1">
                 <stop offset="0%" stopColor="#3d2817"/>
                 <stop offset="50%" stopColor="#24150c"/>
                 <stop offset="100%" stopColor="#150c07"/>
               </linearGradient>
             </defs>
             <circle cx="200" cy="200" r="160" fill="url(#hatGlow)" />
             {/* Brim */}
             <path d="M40 310 C80 280, 160 300, 200 300 C240 300, 320 280, 360 310 C340 345, 260 355, 200 355 C140 355, 60 345, 40 310 Z" fill="#1f120a" stroke="#c5a059" strokeWidth="2" strokeOpacity="0.4" />
             {/* Cone */}
             <path d="M120 295 C130 220, 150 160, 175 110 C185 85, 210 50, 240 35 C230 75, 245 95, 235 130 C225 170, 255 230, 280 295 C230 305, 170 305, 120 295 Z" fill="url(#hatGrad)" stroke="#c5a059" strokeWidth="2" strokeOpacity="0.4" />
             {/* Folds & Grimace */}
             <path d="M155 190 Q200 210 245 190" stroke="#0e0704" strokeWidth="6" strokeLinecap="round" fill="none" />
             <path d="M165 240 Q200 270 235 240" stroke="#0e0704" strokeWidth="7" strokeLinecap="round" fill="none" />
             {/* Arcane Rune Glyphs */}
             <path d="M185 140 L200 125 L215 140 M200 125 L200 155" stroke="#14b8a6" strokeWidth="2" strokeOpacity="0.7" fill="none" />
          </svg>
        )}
        
        {/* Magic Intelligence Glow - Bio-Teal Eyes */}
        <motion.div
          animate={{
            opacity: thinking ? [0.6, 1, 0.6] : [0.2, 0.4, 0.2],
            scale: thinking ? [1, 1.25, 1] : [1, 1, 1],
          }}
          transition={{ duration: thinking ? 0.8 : 2, repeat: Infinity }}
          className="absolute top-[48%] w-full h-6 flex justify-center space-x-16 pointer-events-none"
        >
          <div className="w-2.5 h-2.5 bg-medical-teal rounded-full blur-[4px] shadow-[0_0_15px_#14b8a6]" />
          <div className="w-2.5 h-2.5 bg-medical-teal rounded-full blur-[4px] shadow-[0_0_15px_#14b8a6]" />
        </motion.div>

        {/* ======================================================== */}
        {/* TECHNOLOGICAL SCANNING OVERLAYS (Active in thinking state) */}
        {/* ======================================================== */}
        <AnimatePresence>
          {thinking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl"
            >
              {/* Subtle Horizontal Scanlines Grid */}
              <div 
                className="absolute inset-0 opacity-[0.12] mix-blend-screen"
                style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(20, 184, 166, 0.35) 3px, rgba(20, 184, 166, 0.35) 4px)'
                }}
              />

              {/* Holographic Laser Scanner Beam (Sweeping vertically up and down) */}
              <motion.div
                animate={{
                  y: ['-10%', '110%', '-10%']
                }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-x-0 h-16 pointer-events-none z-30"
              >
                {/* Laser beam trailing gradient */}
                <div className="w-full h-full bg-gradient-to-b from-transparent via-medical-teal/15 to-transparent" />
                {/* Laser bright core line */}
                <div className="w-full h-[1.5px] bg-gradient-to-r from-transparent via-medical-teal to-transparent shadow-[0_0_10px_#14b8a6,0_0_20px_#14b8a6]" />
                
                {/* Micro tracker nodes on scanner line */}
                <div className="absolute top-0 left-1/4 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-medical-teal shadow-[0_0_6px_#14b8a6]" />
                <div className="absolute top-0 right-1/4 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_6px_#c5a059]" />
              </motion.div>

              {/* Secondary Fast Inverse Beam for depth */}
              <motion.div
                animate={{
                  y: ['110%', '-10%', '110%']
                }}
                transition={{
                  duration: 4.2,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute inset-x-0 h-6 pointer-events-none opacity-40 z-20"
              >
                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent shadow-[0_0_8px_#c5a059]" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ======================================================== */}
      {/* HUD RETICLE & DATA STREAM LAYERS (Thinking State)         */}
      {/* ======================================================== */}
      <AnimatePresence>
        {thinking && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center overflow-visible"
          >
            {/* HUD Corner Brackets Framing the Hat */}
            <div className="absolute -inset-2 sm:-inset-4">
              {/* Top-Left Bracket */}
              <div className="absolute top-0 left-0 w-4 h-4 sm:w-6 sm:h-6 border-t-2 border-l-2 border-medical-teal/70 rounded-tl-sm shadow-[0_0_8px_rgba(20,184,166,0.5)]" />
              {/* Top-Right Bracket */}
              <div className="absolute top-0 right-0 w-4 h-4 sm:w-6 sm:h-6 border-t-2 border-r-2 border-medical-teal/70 rounded-tr-sm shadow-[0_0_8px_rgba(20,184,166,0.5)]" />
              {/* Bottom-Left Bracket */}
              <div className="absolute bottom-0 left-0 w-4 h-4 sm:w-6 sm:h-6 border-b-2 border-l-2 border-medical-teal/70 rounded-bl-sm shadow-[0_0_8px_rgba(20,184,166,0.5)]" />
              {/* Bottom-Right Bracket */}
              <div className="absolute bottom-0 right-0 w-4 h-4 sm:w-6 sm:h-6 border-b-2 border-r-2 border-medical-teal/70 rounded-br-sm shadow-[0_0_8px_rgba(20,184,166,0.5)]" />
            </div>

            {/* Concentric Rotating Tech Rings */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute w-[104%] h-[104%] rounded-full border border-dashed border-medical-teal/20"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              className="absolute w-[86%] h-[86%] rounded-full border border-dotted border-gold/25"
            />

            {/* Left Data Stream (Telemetry readouts) */}
            {!compact && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="hidden sm:flex absolute -left-16 md:-left-20 flex-col space-y-1.5 font-mono text-[9px] md:text-[10px] tracking-wider text-medical-teal/75 select-none"
              >
                {leftTelemetry.map((item, idx) => (
                  <motion.div
                    key={idx}
                    animate={{
                      opacity: [0.35, 0.9, 0.35],
                      x: [0, (idx % 2 === 0 ? 2 : -1), 0]
                    }}
                    transition={{
                      duration: 2 + (idx * 0.4),
                      repeat: Infinity,
                      delay: idx * 0.18
                    }}
                    className="flex items-center space-x-1.5 backdrop-blur-[2px] bg-black/20 px-1 py-0.5 rounded border-l border-medical-teal/30"
                  >
                    <span className="w-1 h-1 bg-medical-teal rounded-full animate-ping" />
                    <span>{item}</span>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Right Data Stream (Algorithmic / Diagnostics) */}
            {!compact && (
              <motion.div 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="hidden sm:flex absolute -right-16 md:-right-20 flex-col items-end space-y-1.5 font-mono text-[9px] md:text-[10px] tracking-wider text-gold/80 select-none"
              >
                {rightTelemetry.map((item, idx) => (
                  <motion.div
                    key={idx}
                    animate={{
                      opacity: [0.4, 0.95, 0.4],
                      x: [0, (idx % 2 === 0 ? -2 : 1), 0]
                    }}
                    transition={{
                      duration: 2.2 + (idx * 0.35),
                      repeat: Infinity,
                      delay: idx * 0.22
                    }}
                    className="flex items-center space-x-1.5 backdrop-blur-[2px] bg-black/20 px-1 py-0.5 rounded border-r border-gold/30"
                  >
                    <span>{item}</span>
                    <span className="w-1 h-1 bg-gold rounded-full" />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* ECG Pulse Waveform Trace at the Bottom of Hat */}
            <div className="absolute -bottom-3 sm:-bottom-5 w-44 sm:w-60 h-6 flex items-center justify-center overflow-hidden">
              <svg viewBox="0 0 200 30" fill="none" className="w-full h-full opacity-60">
                <motion.path
                  d="M0 15 H60 L70 5 L80 25 L90 8 L100 20 L105 15 H200"
                  stroke="#14b8a6"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ 
                    pathLength: [0, 1, 1],
                    pathOffset: [0, 0, 1],
                    opacity: [0.3, 1, 0.3]
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  style={{ filter: 'drop-shadow(0 0 4px #14b8a6)' }}
                />
              </svg>
            </div>

            {/* Technological Status Badge */}
            <motion.div
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 5, opacity: 0 }}
              className="absolute -top-6 sm:-top-8 flex items-center space-x-2 px-3 py-0.5 rounded-full bg-black/60 border border-medical-teal/40 backdrop-blur-md shadow-[0_0_12px_rgba(20,184,166,0.3)]"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-medical-teal opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-medical-teal" />
              </span>
              <span className="font-mono text-[9px] sm:text-[10px] text-medical-teal font-semibold tracking-widest uppercase">
                BIO-NEURAL SCANNING
              </span>
              <span className="text-[9px] text-gold/60 font-mono">v4.2</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cinematic Stethoscope Surround - Precise SVG Implementation */}
      <motion.div
        animate={{
          rotate: [0, 360],
          y: [0, -15, 0],
        }}
        transition={{
          rotate: { duration: 30, repeat: Infinity, ease: "linear" },
          y: { duration: 8, repeat: Infinity, ease: "easeInOut" }
        }}
        className="absolute z-20 w-[110%] h-[110%] pointer-events-none flex items-center justify-center"
      >
        <motion.div 
          animate={{
            rotate: [360, 0] // Counter-rotate to keep steth stable
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="relative w-32 h-32 -translate-y-[150px]"
        >
          {/* Detailed Recognition Stethoscope SVG */}
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full filter drop-shadow-[0_0_15px_#14b8a6]">
            {/* Earpieces */}
            <path d="M7 3C7 3 7 5 12 5C17 5 17 3 17 3" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M7 3V5C7 8 9 10 12 10C15 10 17 8 17 5V3" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round"/>
            {/* Tubing */}
            <path d="M12 10V14" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M12 14C12 17.3137 14.6863 20 18 20C21.3137 20 23.5 17.5 23.5 15" stroke="#9ca3af" strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
            <path d="M12 14C12 16 10 18 7 18C4 18 2 16 2 13C2 10 4 8 7 8" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round"/>
            {/* Chest Piece (Bell) */}
            <circle cx="7" cy="8" r="3" fill="#374151" stroke="#14b8a6" strokeWidth="1"/>
            <circle cx="7" cy="8" r="1" fill="#14b8a6"/>
            {/* Detail elements */}
            <rect x="6" y="2" width="2" height="1" rx="0.5" fill="#4b5563"/>
            <rect x="16" y="2" width="2" height="1" rx="0.5" fill="#4b5563"/>
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
};

