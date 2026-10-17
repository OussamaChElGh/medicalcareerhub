import { motion } from 'motion/react';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { ACTIVE_SPECIALTIES } from '../data/specialties';
import { SpecialtyProfile } from '../types';

interface V2CatalogProps {
  onBack: () => void;
}

const GROUPS: { type: SpecialtyProfile['type']; label: string; description: string }[] = [
  {
    type: 'MIR',
    label: 'Especialidades MIR',
    description: 'Acceso por residencia en el sistema español.',
  },
  {
    type: 'ACE',
    label: 'Áreas de capacitación específica',
    description: 'Formación especializada posterior a una especialidad base.',
  },
  {
    type: 'AREA',
    label: 'Áreas de práctica',
    description: 'Ámbitos profesionales que no se cursan como especialidad MIR independiente.',
  },
];

export function V2Catalog({ onBack }: V2CatalogProps) {
  const draftCount = ACTIVE_SPECIALTIES.filter(
    (specialty) => specialty.reviewStatus === 'draft',
  ).length;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:py-12">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-parchment/50 transition-colors hover:text-gold"
      >
        <ArrowLeft size={14} />
        Volver
      </button>

      <header className="space-y-3 border-b border-gold/15 pb-6">
        <div className="flex items-center gap-3">
          <BookOpen className="text-gold" size={24} />
          <p className="text-[10px] uppercase tracking-[0.4em] text-medical-teal">
            Catálogo Arcanum
          </p>
        </div>
        <h1 className="font-display text-3xl font-bold text-gold magic-shadow sm:text-5xl">
          51 especialidades y áreas
        </h1>
        <p className="max-w-2xl font-classic text-lg italic leading-relaxed text-parchment/65">
          Fichas descriptivas del catálogo v2. Las 39 fichas nuevas están marcadas como “en
          revisión”: son una primera versión basada en práctica clínica general, pendiente de
          revisión experta.
        </p>
        <div className="flex flex-wrap gap-2 text-[9px] uppercase tracking-widest">
          <span className="rounded-full border border-gold/20 px-3 py-1 text-gold-dim">
            {ACTIVE_SPECIALTIES.length} fichas
          </span>
          <span className="rounded-full border border-amber-400/25 bg-amber-400/5 px-3 py-1 text-amber-200/70">
            {draftCount} en revisión
          </span>
        </div>
      </header>

      {GROUPS.map((group, groupIndex) => {
        const specialties = ACTIVE_SPECIALTIES.filter(
          (specialty) => specialty.type === group.type,
        );
        if (specialties.length === 0) return null;

        return (
          <motion.section
            key={group.type}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: groupIndex * 0.08 }}
            className="space-y-4"
          >
            <div className="flex flex-col gap-1 border-b border-gold/10 pb-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-magic text-xl text-gold">
                  {group.label}{' '}
                  <span className="font-mono text-xs text-parchment/35">({specialties.length})</span>
                </h2>
                <p className="text-[10px] uppercase tracking-widest text-parchment/35">
                  {group.description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {specialties.map((specialty) => (
                <article
                  key={specialty.id}
                  className="flex h-full flex-col justify-between border border-gold/15 bg-black/20 p-4 transition-colors hover:border-gold/40"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-magic text-base leading-snug text-parchment">
                          {specialty.name}
                        </h3>
                        <p className="text-[8px] uppercase tracking-widest text-parchment/35">
                          {specialty.family}
                        </p>
                      </div>
                      {specialty.reviewStatus === 'draft' && (
                        <span className="flex-shrink-0 rounded-full border border-amber-400/25 bg-amber-400/5 px-2 py-0.5 text-[7px] uppercase tracking-widest text-amber-200/70">
                          En revisión
                        </span>
                      )}
                    </div>
                    <p className="text-xs leading-relaxed text-parchment/55">
                      {specialty.description}
                    </p>
                  </div>

                  <div className="mt-4 space-y-2 border-t border-gold/10 pt-3">
                    <p className="text-[8px] uppercase tracking-widest text-parchment/30">
                      Alternativas
                    </p>
                    <p className="text-[10px] leading-relaxed text-parchment/50">
                      {specialty.alternatives.join(' · ')}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </motion.section>
        );
      })}

      <p className="text-center text-[9px] leading-relaxed tracking-wide text-parchment/25">
        La clasificación MIR / ACE / área debe verificarse contra la lista oficial vigente. Las
        descripciones y perfiles son una primera versión y no constituyen asesoramiento
        vocacional definitivo.
      </p>
    </div>
  );
}
