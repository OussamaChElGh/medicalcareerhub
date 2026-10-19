import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BarChart3,
  Book,
  Download,
  Home,
  Info,
  Menu,
  MessageCircle,
  Newspaper,
  ShieldCheck,
  Sparkles,
  Trash2,
  TrendingUp,
  X,
} from 'lucide-react';

export type V2NavScene =
  | 'intro'
  | 'catalog'
  | 'blog'
  | 'stats'
  | 'oracle'
  | 'about'
  | 'backoffice'
  | 'result';

interface V2NavbarProps {
  activeScene: V2NavScene;
  onNavigate: (scene: V2NavScene) => void;
  onStart: () => void;
  pilotCount: number;
  onExportPilot: () => void;
  onClearPilot: () => void;
  isDemo?: boolean;
}

const MENU_ITEMS: { id: V2NavScene; label: string; icon: React.ElementType }[] = [
  { id: 'intro', label: 'Inicio', icon: Home },
  { id: 'catalog', label: 'Grimorio', icon: Book },
  { id: 'blog', label: 'Crónicas', icon: Newspaper },
  { id: 'stats', label: 'Censo', icon: BarChart3 },
  { id: 'backoffice', label: 'Backoffice', icon: TrendingUp },
  { id: 'oracle', label: 'Oráculo', icon: MessageCircle },
  { id: 'about', label: 'Origen', icon: Info },
];

export const V2Navbar: React.FC<V2NavbarProps> = ({
  activeScene,
  onNavigate,
  onStart,
  pilotCount,
  onExportPilot,
  onClearPilot,
  isDemo,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileNavigate = (scene: V2NavScene) => {
    onNavigate(scene);
    setIsMobileMenuOpen(false);
  };

  const exportPilot = () => {
    onExportPilot();
    setIsMobileMenuOpen(false);
  };

  const clearPilot = () => {
    onClearPilot();
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="absolute left-0 top-0 z-50 flex w-full justify-center pointer-events-none lg:fixed">
      <motion.nav
        initial={false}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'circOut' }}
        className="pointer-events-auto flex w-full items-center justify-between border-b border-gold/20 bg-academy-navy/95 px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-3xl transition-all duration-700 sm:px-6"
      >
        <div className="flex items-center">
          <div
            className="group flex cursor-pointer items-center space-x-3 border-gold/10 px-2 sm:border-r sm:px-4"
            onClick={() => onNavigate('intro')}
          >
            <div className="relative flex-shrink-0">
              <ShieldCheck
                className="text-gold transition-colors duration-500 group-hover:text-medical-teal"
                size={18}
              />
              <div className="absolute -inset-1 animate-spin-slow rounded-full border border-gold/10" />
            </div>
            <div className="flex flex-col -space-y-1 pr-1 sm:pr-2">
              <span className="font-display text-base font-medium uppercase tracking-[0.1em] text-gold sm:text-lg sm:tracking-[0.15em]">
                Arcanum
              </span>
              <div className="flex items-center gap-2">
                <span className="font-magic text-[6px] uppercase tracking-[0.3em] text-medical-teal opacity-60 sm:text-[7px] sm:tracking-[0.4em]">
                  Est. 1342
                </span>
                <span className="rounded-full border border-medical-teal/30 bg-medical-teal/10 px-1.5 py-0.5 text-[6px] uppercase tracking-widest text-medical-teal/80">
                  beta
                </span>
                {isDemo && (
                  <span className="rounded-full border border-gold/30 bg-gold/10 px-1.5 py-0.5 text-[6px] uppercase tracking-widest text-gold/80">
                    demo
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="hidden items-center px-2 lg:flex">
            {MENU_ITEMS.map((item, index) => (
              <div key={item.id} className="flex items-center">
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`group relative rounded-xl px-6 py-2.5 font-magic text-[10px] font-medium uppercase tracking-[0.25em] transition-all duration-500 ${
                    activeScene === item.id ? 'text-gold' : 'text-gold-dim hover:text-gold'
                  }`}
                >
                  {activeScene === item.id && (
                    <motion.div
                      layoutId="v2-nav-pill-active"
                      className="absolute inset-0 rounded-xl border border-white/5 bg-white/5"
                      transition={{ type: 'spring', bounce: 0.15, duration: 0.6 }}
                    />
                  )}
                  <span className="relative flex items-center space-x-2">
                    <item.icon
                      size={12}
                      className={`transition-all duration-500 ${
                        activeScene === item.id
                          ? 'scale-110 text-gold drop-shadow-[0_0_8px_rgba(197,160,89,0.5)]'
                          : 'opacity-40 group-hover:opacity-100'
                      }`}
                    />
                    <span className="hidden xl:block">{item.label}</span>
                  </span>
                </button>
                {index < MENU_ITEMS.length - 1 && <div className="mx-1 h-3 w-[1px] bg-gold/5" />}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onNavigate('backoffice')}
            title="Abrir Backoffice y Telemetría del Embudo"
            className={`hidden sm:inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] uppercase tracking-widest transition-all ${
              activeScene === 'backoffice'
                ? 'border-gold bg-gold/20 text-gold shadow-[0_0_10px_rgba(197,160,89,0.3)]'
                : 'border-gold/30 bg-gold/5 text-parchment/80 hover:border-gold hover:text-gold'
            }`}
          >
            <TrendingUp size={11} className="text-gold" />
            <span>Backoffice</span>
          </button>
          <button
            onClick={exportPilot}
            title="Exportar sesiones anónimas del piloto en JSON"
            className="hidden items-center gap-1.5 rounded-full border border-gold/20 px-2 py-1 text-[9px] uppercase tracking-widest text-parchment/40 transition-colors hover:border-gold/50 hover:text-gold sm:inline-flex"
          >
            <Download size={11} />
            <span>Piloto</span>
            <span>{pilotCount}</span>
          </button>
          {pilotCount > 0 && (
            <button
              onClick={clearPilot}
              title="Borrar las sesiones guardadas del piloto"
              className="hidden text-parchment/25 transition-colors hover:text-rose-300 sm:block"
            >
              <Trash2 size={12} />
            </button>
          )}
          <a
            href="/classic"
            className="hidden text-[9px] uppercase tracking-widest text-parchment/40 transition-colors hover:text-gold lg:inline"
          >
            Legado
          </a>

          <div className="hidden sm:block">
            <button
              onClick={onStart}
              className="group relative flex items-center space-x-3 rounded-xl border border-gold/20 bg-gold/5 px-4 py-2 text-gold transition-all duration-700 hover:border-gold sm:px-6 sm:py-2.5"
            >
              <Sparkles
                size={12}
                className="transition-transform group-hover:rotate-12"
              />
              <span className="text-[9px] font-bold uppercase tracking-[0.25em] sm:text-[10px] sm:tracking-[0.3em]">
                Diagnóstico
              </span>
            </button>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gold transition-colors hover:text-medical-teal lg:hidden"
            aria-label="Abrir menú"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="pointer-events-auto absolute left-0 top-full w-full overflow-hidden border-b border-gold/20 bg-academy-navy/98 backdrop-blur-2xl lg:hidden"
          >
            <div className="flex flex-col space-y-2 p-4">
              {MENU_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleMobileNavigate(item.id)}
                  className={`flex items-center space-x-4 rounded-xl border p-4 transition-all ${
                    activeScene === item.id
                      ? 'border-gold/40 bg-gold/10 text-gold'
                      : 'border-transparent bg-white/5 text-gold-dim'
                  }`}
                >
                  <item.icon size={18} />
                  <span className="font-magic text-xs uppercase tracking-[0.3em]">{item.label}</span>
                </button>
              ))}

              <button
                onClick={() => {
                  onStart();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center space-x-4 rounded-xl border border-gold/10 bg-white/5 p-4 text-gold"
              >
                <Sparkles size={18} />
                <span className="text-xs font-bold uppercase tracking-[0.3em]">Diagnóstico</span>
              </button>

              <div className="flex items-center justify-between gap-2 border-t border-gold/10 pt-2">
                <button
                  onClick={exportPilot}
                  className="inline-flex items-center gap-2 rounded-lg border border-gold/20 px-3 py-2 text-[9px] uppercase tracking-widest text-parchment/50"
                >
                  <Download size={12} />
                  Piloto {pilotCount}
                </button>
                {pilotCount > 0 && (
                  <button
                    onClick={clearPilot}
                    className="inline-flex items-center gap-2 rounded-lg border border-rose-400/20 px-3 py-2 text-[9px] uppercase tracking-widest text-rose-300/60"
                  >
                    <Trash2 size={12} />
                    Borrar
                  </button>
                )}
                <a
                  href="/classic"
                  className="text-[9px] uppercase tracking-widest text-parchment/40"
                >
                  Legado
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
