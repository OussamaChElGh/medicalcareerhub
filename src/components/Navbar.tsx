import React from 'react';
import { motion } from 'motion/react';
import { Book, Info, Home, ShieldCheck, Newspaper, ArrowRight } from 'lucide-react';

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
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 w-full z-50 flex flex-col items-center pointer-events-none"
    >
      {/* Top Border Line */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      
      <div className="w-full max-w-7xl px-6 md:px-12 py-4 flex justify-between items-center pointer-events-auto">
        {/* Elegant Logo */}
        <div 
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={() => onNavigate('HOME')}
        >
          <div className="relative">
            <ShieldCheck className="text-gold group-hover:scale-110 transition-all duration-500" size={24} />
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-2 border border-gold/5 border-dashed rounded-full"
            />
          </div>
          <div className="flex flex-col -space-y-1">
            <span className="text-gold font-display font-light text-2xl tracking-[0.3em] uppercase first-letter:text-3xl">
              Arcanum
            </span>
            <span className="text-medical-teal text-[8px] uppercase tracking-[0.5em] font-magic self-end opacity-70">
              Medicum Curatio
            </span>
          </div>
        </div>

        {/* Centered Navigation Pill */}
        <div className="hidden lg:flex items-center bg-bg-deep/40 backdrop-blur-xl border border-gold/10 rounded-full px-2 py-1.5 shadow-2xl">
          {menuItems.map((item, idx) => (
            <React.Fragment key={item.id}>
              <button
                onClick={() => onNavigate(item.id as any)}
                className={`group relative px-6 py-2 text-[10px] uppercase tracking-[0.3em] font-magic font-medium transition-all duration-500 rounded-full ${
                  activeScene === item.id ? 'text-gold' : 'text-gold-dim hover:text-gold'
                }`}
              >
                {activeScene === item.id && (
                  <motion.div 
                    layoutId="nav-bg"
                    className="absolute inset-0 bg-gold/5 rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative flex items-center space-x-2">
                  <item.icon size={12} className={`transition-all duration-500 ${activeScene === item.id ? 'text-gold scale-110' : 'opacity-40 group-hover:opacity-100 group-hover:scale-110'}`} />
                  <span>
                    {item.id === 'SPECIALTIES' ? 'Grimorio' : item.id === 'ABOUT' ? 'Origen' : item.id === 'BLOG' ? 'Crónicas' : item.label}
                  </span>
                </span>
                
                {/* Active Indicator Dot */}
                {activeScene === item.id && (
                  <motion.div 
                    layoutId="active-dot"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-medical-teal rounded-full shadow-[0_0_8px_theme(colors.medical-teal)]"
                  />
                )}
              </button>
              {idx < menuItems.length - 1 && (
                <div className="w-px h-4 bg-gold/10" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={() => onNavigate('QUIZ')}
          className="group relative flex items-center space-x-3 bg-medical-teal/5 border border-medical-teal/20 px-8 py-3 overflow-hidden rounded-sm transition-all duration-700 hover:border-medical-teal/80"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-medical-teal/0 via-medical-teal/10 to-medical-teal/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <span className="text-[10px] uppercase tracking-[0.4em] text-medical-teal font-magic font-bold transition-all duration-500 group-hover:tracking-[0.6em]">
            Diagnosis Arcanum
          </span>
          <ArrowRight size={14} className="text-medical-teal transform group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Mobile Menu Trigger (Optional/Basic for now) */}
      <div className="lg:hidden w-full px-6 flex justify-center pb-4">
        <div className="flex items-center space-x-6 bg-bg-deep/60 backdrop-blur-lg border border-white/5 rounded-full px-6 py-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as any)}
              className={`transition-colors ${activeScene === item.id ? 'text-gold' : 'text-gold-dim'}`}
            >
              <item.icon size={18} />
            </button>
          ))}
        </div>
      </div>
    </motion.nav>
  );
};
