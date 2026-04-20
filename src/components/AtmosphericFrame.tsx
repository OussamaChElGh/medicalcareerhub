import React, { useMemo } from 'react';
import { GreatHallCandles } from './FloatingCandle';
import { mediaAssets } from '../mediaAssets';

export const AtmosphericFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const particles = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      left: `${Math.random() * 100}%`,
      bottom: `-${Math.random() * 20}%`,
      delay: `${Math.random() * 10}s`,
      duration: `${15 + Math.random() * 15}s`,
      size: `${1 + Math.random() * 2}px`,
    }));
  }, []);

  return (
    <div className="relative min-h-screen w-full">
      {/* Dynamic Background Image */}
      {mediaAssets.medical_background_jpg && (
        <div 
          className="fixed inset-0 z-[-1] pointer-events-none bg-cover bg-center bg-no-repeat w-full h-full"
          style={{ 
            backgroundImage: `linear-gradient(to bottom, rgba(8, 10, 15, 0.4) 0%, rgba(8, 10, 15, 0.6) 100%), url(${mediaAssets.medical_background_jpg})`,
            backgroundAttachment: 'fixed',
          }}
        />
      )}

      {/* Fixed Atmospheric Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <GreatHallCandles />
        
        {/* Medical Luminescence (Vitality Pulse) */}
        <div className="absolute top-0 left-0 w-full h-full bg-radial-gradient from-medical-teal/5 to-transparent vitality-pulse" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-radial-gradient from-vitality/5 to-transparent blur-[120px] pointer-events-none" />
        
        {/* Dust Particles */}
        {particles.map((p, i) => (
          <div 
            key={i}
            className="particle"
            style={{
              left: p.left,
              bottom: p.bottom,
              animationDelay: p.delay,
              animationDuration: p.duration,
              width: p.size,
              height: p.size,
              opacity: 0.05,
            }}
          />
        ))}

        <div className="absolute inset-4 border-2 border-gold-dim border-opacity-20 pointer-events-none rounded-sm">
          {/* Corners - Gothic style */}
          <div className="absolute top-[-10px] left-[-10px] w-12 h-12 border-t-4 border-l-4 border-gold z-20 shadow-[0_0_10px_rgba(197,160,89,0.5)]" />
          <div className="absolute top-[-10px] right-[-10px] w-12 h-12 border-t-4 border-r-4 border-gold z-20 shadow-[0_0_10px_rgba(197,160,89,0.5)]" />
          <div className="absolute bottom-[-10px] left-[-10px] w-12 h-12 border-b-4 border-l-4 border-gold z-20 shadow-[0_0_10px_rgba(197,160,89,0.5)]" />
          <div className="absolute bottom-[-10px] right-[-10px] w-12 h-12 border-b-4 border-r-4 border-gold z-20 shadow-[0_0_10px_rgba(197,160,89,0.5)]" />
        </div>
      </div>
      
      {/* Content Layer */}
      <div className="relative z-20 w-full min-h-screen flex flex-col">
        {children}
      </div>
    </div>
  );
};
