import React from 'react';
import { motion } from 'motion/react';

interface SortingHatProps {
  thinking?: boolean;
}

export const SortingHat: React.FC<SortingHatProps> = ({ thinking }) => {
  const [imgError, setImgError] = React.useState(false);

  // Path to the image in the public folder
  const sortingHatSrc = "/sorting-hat.png";

  return (
    <div className="relative w-56 h-56 sm:w-72 sm:h-72 md:w-96 md:h-96 flex items-center justify-center">
      {/* Background Glow - Medical Magic */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute w-2/3 h-2/3 bg-medical-teal rounded-full blur-[80px]"
      />

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
            className="w-full h-full object-contain filter drop-shadow-[0_20px_50px_rgba(0,0,0,1)]"
          />
        ) : (
          /* FALLBACK SVG - If the local image is not uploaded yet */
          <svg viewBox="0 0 400 400" className="w-full h-full opacity-60 filter grayscale">
             <path d="M200 40L300 300H100L200 40Z" fill="#3e2723" />
             <path d="M50 300C50 300 50 340 200 340C350 340 350 300 350 300Z" fill="#2b1d14" />
             <text x="50%" y="65%" textAnchor="middle" fill="#888" fontSize="12" className="italic font-sans">Sube tu imagen a /public/sorting-hat.png</text>
          </svg>
        )}
        
        {/* Magic Intelligence Glow - Bio-Teal */}
        <motion.div
          animate={{
            opacity: thinking ? [0.6, 1, 0.6] : [0.2, 0.4, 0.2],
            scale: thinking ? [1, 1.2, 1] : [1, 1, 1],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute top-[48%] w-full h-6 flex justify-center space-x-16 pointer-events-none"
        >
          <div className="w-2.5 h-2.5 bg-medical-teal rounded-full blur-[4px] shadow-[0_0_15px_#14b8a6]" />
          <div className="w-2.5 h-2.5 bg-medical-teal rounded-full blur-[4px] shadow-[0_0_15px_#14b8a6]" />
        </motion.div>
      </motion.div>

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
