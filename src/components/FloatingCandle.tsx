import React, { useMemo } from 'react';
import { motion } from 'motion/react';

export const FloatingCandle: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  return (
    <div 
      className="absolute flex flex-col items-center pointer-events-none float-animation"
      style={style}
    >
      {/* Flame */}
      <div className="relative">
        <div className="w-2 h-4 bg-orange-400 rounded-full blur-[2px] flicker-flame" />
        <div className="absolute top-0 w-4 h-6 bg-orange-500/20 rounded-full blur-md -left-1 flicker-flame" />
      </div>
      {/* Candle Body */}
      <div className="w-2 h-16 bg-[#e2d1b3] rounded-sm shadow-inner overflow-hidden relative">
        <div className="absolute top-0 w-full h-1 bg-black/10" />
        {/* Wax drips */}
        <div className="absolute top-0 left-0 w-0.5 h-4 bg-[#d4c4a8] rounded-full ml-0.5" />
      </div>
    </div>
  );
};

export const GreatHallCandles: React.FC = () => {
  const candles = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
      left: `${(i % 4) * 25 + Math.random() * 10}%`,
      top: `${Math.floor(i / 4) * 20 + Math.random() * 15}%`,
      delay: `${Math.random() * 5}s`,
      scale: 0.5 + Math.random() * 0.5,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {candles.map((c, i) => (
        <FloatingCandle 
          key={i} 
          style={{ 
            left: c.left, 
            top: c.top, 
            animationDelay: c.delay,
            transform: `scale(${c.scale})`,
            opacity: 0.6
          }} 
        />
      ))}
    </div>
  );
};
