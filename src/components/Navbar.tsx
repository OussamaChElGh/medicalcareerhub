import React from 'react';
import { motion } from 'motion/react';
import { Book, Info, Home, ShieldCheck, Newspaper, ArrowRight, Sparkles } from 'lucide-react';

interface NavbarProps {
  onNavigate: (scene: 'HOME' | 'ABOUT' | 'SPECIALTIES' | 'QUIZ' | 'BLOG') => void;
  activeScene: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, activeScene }) => {
  const menuItems = [
    { id: 'HOME', label: 'Inicio', icon: Home },
    { id: 'SPECIALTIES', label: 'Grimorio', icon: Book },
    { id: 'BLOG', label: 'Crónicas', icon: Newspaper },
    { id: 'ABOUT', label: 'Origen', icon: Info },
  ];

  return (
    <div className="fixed top-6 left-0 w-full z-50 px-4 sm:px-6 flex justify-center pointer-events-none">
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8, ease: "circOut" }}
        className="pointer-events-auto flex items-center bg-bg-deep/70 backdrop-blur-2xl border border-gold/20 rounded-2xl px-2 py-2 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] hover:border-gold/40 transition-all duration-700 max-w-full overflow-x-auto sm:overflow-visible no-scrollbar"
      >
        {/* LOGO SECTION - Now integrated into the pill */}
        <div 
          className="flex items-center space-x-3 px-4 border-r border-gold/10 cursor-pointer group"
          onClick={() => onNavigate('HOME')}
        >
          <div className="relative flex-shrink-0">
            <ShieldCheck className="text-gold group-hover:text-medical-teal transition-colors duration-500" size={20} />
            <div className="absolute -inset-1.5 border border-gold/10 rounded-full animate-spin-slow" />
          </div>
          <div className="flex flex-col -space-y-1 pr-2">
            <span className="text-gold font-display font-medium text-lg tracking-[0.15em] uppercase">
              Arcanum
            </span>
            <span className="text-[7px] text-medical-teal uppercase tracking-[0.4em] font-magic opacity-60">
              Est. 1342
            </span>
          </div>
        </div>

        {/* NAVIGATION SECTION */}
        <div className="flex items-center px-2">
          {menuItems.map((item, idx) => (
            <div key={item.id} className="flex items-center">
              <button
                onClick={() => onNavigate(item.id as any)}
                className={`group relative px-6 py-2.5 text-[10px] uppercase tracking-[0.25em] font-magic font-medium transition-all duration-500 rounded-xl ${
                  activeScene === item.id ? 'text-gold' : 'text-gold-dim hover:text-gold'
                }`}
              >
                {activeScene === item.id && (
                  <motion.div 
                    layoutId="nav-pill-active"
                    className="absolute inset-0 bg-white/5 border border-white/5 rounded-xl"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
                  />
                )}
                <span className="relative flex items-center space-x-2">
                  <item.icon size={12} className={`transition-all duration-500 ${activeScene === item.id ? 'text-gold scale-110 drop-shadow-[0_0_8px_rgba(197,160,89,0.5)]' : 'opacity-40 group-hover:opacity-100'}`} />
                  <span className="hidden md:block">
                    {item.label}
                  </span>
                </span>
              </button>
              {idx < menuItems.length - 1 && (
                <div className="w-[1px] h-3 bg-gold/5 mx-1" />
              )}
            </div>
          ))}
        </div>

        {/* CTA SECTION - Simplified and elegant */}
        <div className="pl-4 pr-1 hidden sm:block">
          <button
            onClick={() => onNavigate('QUIZ')}
            className={`group relative flex items-center space-x-3 px-6 py-2.5 rounded-xl border transition-all duration-700 ${
              activeScene === 'QUIZ' 
              ? 'bg-medical-teal/20 border-medical-teal text-medical-teal' 
              : 'bg-gold/5 border-gold/20 text-gold hover:border-gold'
            }`}
          >
            <Sparkles size={12} className={activeScene === 'QUIZ' ? 'animate-pulse' : 'group-hover:rotate-12 transition-transform'} />
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold">
              Diagnóstico
            </span>
          </button>
        </div>
      </motion.nav>
    </div>
  );
};
