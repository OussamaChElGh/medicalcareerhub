import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Book, Info, Home, ShieldCheck, Newspaper, Sparkles, Menu, X } from 'lucide-react';

interface NavbarProps {
  onNavigate: (scene: 'HOME' | 'ABOUT' | 'SPECIALTIES' | 'QUIZ' | 'BLOG') => void;
  activeScene: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, activeScene }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'HOME', label: 'Inicio', icon: Home },
    { id: 'SPECIALTIES', label: 'Grimorio', icon: Book },
    { id: 'BLOG', label: 'Crónicas', icon: Newspaper },
    { id: 'ABOUT', label: 'Origen', icon: Info },
  ];

  const handleMobileNavigate = (scene: any) => {
    onNavigate(scene);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="absolute lg:fixed top-0 left-0 w-full z-50 flex justify-center pointer-events-none">
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "circOut" }}
        className="pointer-events-auto flex items-center justify-between bg-academy-navy/95 backdrop-blur-3xl border-b border-gold/20 w-full px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-700 sm:px-6"
      >
        <div className="flex items-center">
          {/* LOGO SECTION */}
          <div 
            className="flex items-center space-x-3 px-2 sm:px-4 sm:border-r border-gold/10 cursor-pointer group"
            onClick={() => onNavigate('HOME')}
          >
            <div className="relative flex-shrink-0">
              <ShieldCheck className="text-gold group-hover:text-medical-teal transition-colors duration-500" size={18} />
              <div className="absolute -inset-1 border border-gold/10 rounded-full animate-spin-slow" />
            </div>
            <div className="flex flex-col -space-y-1 pr-1 sm:pr-2">
              <span className="text-gold font-display font-medium text-base sm:text-lg tracking-[0.1em] sm:tracking-[0.15em] uppercase">
                Arcanum
              </span>
              <span className="text-[6px] sm:text-[7px] text-medical-teal uppercase tracking-[0.3em] sm:tracking-[0.4em] font-magic opacity-60">
                Est. 1342
              </span>
            </div>
          </div>

          {/* DESKTOP NAVIGATION SECTION */}
          <div className="hidden lg:flex items-center px-2">
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
                    <span className="hidden xl:block">
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
        </div>

        {/* RIGHT SECTION: CTA (Desktop) / Hamburger (Mobile) */}
        <div className="flex items-center space-x-2">
          {/* Desktop CTA */}
          <div className="hidden sm:block">
            <button
              onClick={() => onNavigate('QUIZ')}
              className={`group relative flex items-center space-x-3 px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl border transition-all duration-700 ${
                activeScene === 'QUIZ' 
                ? 'bg-medical-teal/20 border-medical-teal text-medical-teal' 
                : 'bg-gold/5 border-gold/20 text-gold hover:border-gold'
              }`}
            >
              <Sparkles size={12} className={activeScene === 'QUIZ' ? 'animate-pulse' : 'group-hover:rotate-12 transition-transform'} />
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] sm:tracking-[0.3em] font-bold">
                Diagnóstico
              </span>
            </button>
          </div>

          {/* Mobile Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gold hover:text-medical-teal transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* MOBILE DROPDOWN MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 w-full bg-academy-navy/98 backdrop-blur-2xl border-b border-gold/20 pointer-events-auto overflow-hidden lg:hidden"
          >
            <div className="flex flex-col p-4 space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleMobileNavigate(item.id as any)}
                  className={`flex items-center space-x-4 p-4 rounded-xl border transition-all ${
                    activeScene === item.id 
                    ? 'bg-gold/10 border-gold/40 text-gold' 
                    : 'bg-white/5 border-transparent text-gold-dim'
                  }`}
                >
                  <item.icon size={18} />
                  <span className="text-xs uppercase tracking-[0.3em] font-magic">{item.label}</span>
                </button>
              ))}
              <button
                onClick={() => handleMobileNavigate('QUIZ')}
                className={`flex items-center space-x-4 p-4 rounded-xl border transition-all ${
                  activeScene === 'QUIZ' 
                  ? 'bg-medical-teal/20 border-medical-teal text-medical-teal' 
                  : 'bg-white/5 border-gold/10 text-gold'
                }`}
              >
                <Sparkles size={18} />
                <span className="text-xs uppercase tracking-[0.3em] font-bold">Diagnóstico</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
