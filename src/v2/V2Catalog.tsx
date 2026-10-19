import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  BookOpen,
  Search,
  Sparkles,
  FileDown,
  X,
  ChevronRight,
  Flame,
  Shield,
  Eye,
  Heart,
  Activity,
  Brain,
  Clock,
  AlertTriangle,
  Scale,
  Stethoscope,
  Filter,
  Check,
  Compass,
  Layers,
  ArrowUpDown,
  Building2,
  Users,
  Award
} from 'lucide-react';
import { ACTIVE_SPECIALTIES } from '../data/specialties';
import { SPECIALTIES_MAP } from '../constants';
import { REVIEW_EVIDENCE } from '../data/specialtyEvidence';
import { DIMENSIONS } from '../data/dimensions';
import { generateDossierPDF } from '../lib/dossierPdf';
import { SpecialtyProfile, NumericDimensionId } from '../types';

interface V2CatalogProps {
  onBack: () => void;
  onStartTest?: () => void;
}

export type HouseType = 'Gryffindor' | 'Slytherin' | 'Ravenclaw' | 'Hufflepuff';

interface HouseDetail {
  id: HouseType;
  name: string;
  motto: string;
  title: string;
  ethos: string;
  crest: string;
  color: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
  glowColor: string;
  icon: React.ElementType;
}

const HOUSES_META: Record<HouseType, HouseDetail> = {
  Gryffindor: {
    id: 'Gryffindor',
    name: 'Casa Gryffindor',
    motto: 'Fortis in Re, Celer in Tempore',
    title: 'Titanes del Triaje & Soporte Vital',
    ethos: 'Acción inmediata, temple ante la parada cardiorrespiratoria y serenidad bajo máxima presión.',
    crest: '/house-gryffindor.png',
    color: '#ef4444',
    borderColor: 'border-rose-500/50',
    badgeBg: 'bg-rose-950/60',
    badgeText: 'text-rose-300',
    glowColor: 'rgba(239, 68, 68, 0.3)',
    icon: Flame,
  },
  Slytherin: {
    id: 'Slytherin',
    name: 'Casa Slytherin',
    motto: 'Dextera Cauta, Mens Suprema',
    title: 'Artífices de la Precisión Quirúrgica',
    ethos: 'Destreza instrumental milimétrica, resolución anatómica pura y ambición de excelencia técnica.',
    crest: '/house-slytherin.png',
    color: '#10b981',
    borderColor: 'border-emerald-500/50',
    badgeBg: 'bg-emerald-950/60',
    badgeText: 'text-emerald-300',
    glowColor: 'rgba(16, 185, 129, 0.3)',
    icon: Shield,
  },
  Ravenclaw: {
    id: 'Ravenclaw',
    name: 'Casa Ravenclaw',
    motto: 'Scientia Est Lux In Tenebris',
    title: 'Eruditos del Razonamiento Diagnóstico',
    ethos: 'Integración fisiopatológica, deducción molecular compleja y pasión por desentrañar enigmas.',
    crest: '/house-ravenclaw.png',
    color: '#38bdf8',
    borderColor: 'border-sky-500/50',
    badgeBg: 'bg-sky-950/60',
    badgeText: 'text-sky-300',
    glowColor: 'rgba(56, 189, 248, 0.3)',
    icon: Eye,
  },
  Hufflepuff: {
    id: 'Hufflepuff',
    name: 'Casa Hufflepuff',
    motto: 'Concordia, Empatia et Cura Perpetua',
    title: 'Guardianes del Cuidado Humano & Longitudinal',
    ethos: 'Vínculo compasivo, visión biopsicosocial y fidelidad incondicional al paciente a lo largo de los años.',
    crest: '/house-hufflepuff.png',
    color: '#f59e0b',
    borderColor: 'border-amber-500/50',
    badgeBg: 'bg-amber-950/60',
    badgeText: 'text-amber-300',
    glowColor: 'rgba(245, 158, 11, 0.3)',
    icon: Heart,
  },
};

const POPULATION_LABELS: Record<string, string> = {
  neonatal: 'Neonatal',
  pediatric: 'Pediatría',
  adult: 'Adultos',
  elderly: 'Geriátrico',
  pregnancy: 'Embarazo',
  all: 'Todas las edades',
};

const OUTCOME_LABELS: Record<string, string> = {
  cure: 'Curar / Resolución aguda',
  chronic: 'Manejo crónico',
  function: 'Restauración funcional',
  palliative: 'Cuidados paliativos',
  prevention: 'Medicina preventiva',
  diagnosis: 'Deducción diagnóstica',
  knowledge: 'Investigación / Ciencia',
  stabilize: 'Soporte vital / Estabilización',
};

const ENVIRONMENT_LABELS: Record<string, string> = {
  emergency: 'Urgencias / UCI',
  or: 'Quirófano / Técnicas',
  ward: 'Hospitalización / Planta',
  consultation: 'Consulta ambulatoria',
  lab: 'Laboratorio de análisis',
  imaging: 'Salas de imagen médica',
  home: 'Atención domiciliaria',
};

const SYSTEM_LABELS: Record<string, string> = {
  cardiovascular: 'Cardiovascular',
  respiratory: 'Respiratorio',
  digestive: 'Digestivo',
  renal: 'Renal / Vías urinarias',
  hematologic: 'Hematológico',
  immune: 'Inmunológico',
  nervous: 'Sistema Nervioso',
  musculoskeletal: 'Musculoesquelético',
  endocrine: 'Endocrino / Metabólico',
  skin: 'Piel y Tegumentos',
  sensory: 'Órganos de los Sentidos',
  reproductive: 'Salud Reproductiva',
  mental: 'Salud Mental y Psique',
  multisystem: 'Multisistémico / Transversal',
};

export function V2Catalog({ onBack, onStartTest }: V2CatalogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHouse, setSelectedHouse] = useState<HouseType | 'ALL'>('ALL');
  const [selectedType, setSelectedType] = useState<'ALL' | 'MIR' | 'ACE' | 'AREA'>('ALL');
  const [selectedFamily, setSelectedFamily] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'name' | 'house' | 'procedures' | 'urgency' | 'diagnostic' | 'longitudinal'>('name');

  // Selected specialty for modal deep dive
  const [activeSpecialty, setActiveSpecialty] = useState<SpecialtyProfile | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'overview' | 'dimensions' | 'lifestyle'>('overview');

  // Comparison list (max 3)
  const [compareList, setCompareList] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Helper to get house
  const getHouseForSpecialty = (specialty: SpecialtyProfile): HouseType => {
    const classic = SPECIALTIES_MAP[specialty.id];
    if (classic?.hogwartsHouse) return classic.hogwartsHouse as HouseType;

    const a1 = specialty.numeric.A1 ?? 2;
    const a2 = specialty.numeric.A2 ?? 2;
    const a3 = specialty.numeric.A3 ?? 2;
    const a4 = specialty.numeric.A4 ?? 2;
    const a5 = specialty.numeric.A5 ?? 2;
    const a8 = specialty.numeric.A8 ?? 2;

    const scores: Record<HouseType, number> = {
      Gryffindor: a3 * 1.4 + a2 * 1.1,
      Slytherin: a2 * 1.3 + (4 - a4) * 0.7 + (4 - a5) * 0.6,
      Ravenclaw: a1 * 1.4 + a8 * 1.2,
      Hufflepuff: a4 * 1.4 + a5 * 1.2,
    };

    return (Object.entries(scores) as [HouseType, number][]).sort(
      (a, b) => b[1] - a[1]
    )[0][0];
  };

  // Distinct families
  const allFamilies = useMemo(() => {
    const set = new Set<string>();
    ACTIVE_SPECIALTIES.forEach((s) => set.add(s.family));
    return Array.from(set).sort();
  }, []);

  // House counts
  const houseCounts = useMemo(() => {
    const counts: Record<HouseType, number> = {
      Gryffindor: 0,
      Slytherin: 0,
      Ravenclaw: 0,
      Hufflepuff: 0,
    };
    ACTIVE_SPECIALTIES.forEach((spec) => {
      const h = getHouseForSpecialty(spec);
      counts[h] = (counts[h] || 0) + 1;
    });
    return counts;
  }, []);

  // Filtered and sorted specialties
  const filteredSpecialties = useMemo(() => {
    return ACTIVE_SPECIALTIES.filter((spec) => {
      const house = getHouseForSpecialty(spec);

      if (selectedHouse !== 'ALL' && house !== selectedHouse) {
        return false;
      }

      if (selectedType !== 'ALL' && spec.type !== selectedType) {
        return false;
      }

      if (selectedFamily !== 'ALL' && spec.family !== selectedFamily) {
        return false;
      }

      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const inName = spec.name.toLowerCase().includes(query);
        const inDesc = spec.description.toLowerCase().includes(query);
        const inFamily = spec.family.toLowerCase().includes(query);
        const inAlts = spec.alternatives.some((alt) => alt.toLowerCase().includes(query));
        const inSystems = spec.systems.some((s) => (SYSTEM_LABELS[s] || s).toLowerCase().includes(query));
        if (!inName && !inDesc && !inFamily && !inAlts && !inSystems) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name, 'es');
      if (sortBy === 'house') {
        const ha = getHouseForSpecialty(a);
        const hb = getHouseForSpecialty(b);
        return ha.localeCompare(hb);
      }
      if (sortBy === 'procedures') return (b.numeric.A2 ?? 0) - (a.numeric.A2 ?? 0);
      if (sortBy === 'urgency') return (b.numeric.A3 ?? 0) - (a.numeric.A3 ?? 0);
      if (sortBy === 'diagnostic') return (b.numeric.A1 ?? 0) - (a.numeric.A1 ?? 0);
      if (sortBy === 'longitudinal') return (b.numeric.A5 ?? 0) - (a.numeric.A5 ?? 0);
      return 0;
    });
  }, [selectedHouse, selectedType, selectedFamily, searchTerm, sortBy]);

  const toggleCompare = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (compareList.includes(id)) {
      setCompareList((prev) => prev.filter((item) => item !== id));
    } else {
      if (compareList.length >= 3) {
        alert('Puedes comparar un máximo de 3 especialidades a la vez.');
        return;
      }
      setCompareList((prev) => [...prev, id]);
    }
  };

  const handleDownloadDossier = () => {
    generateDossierPDF();
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedHouse('ALL');
    setSelectedType('ALL');
    setSelectedFamily('ALL');
    setSortBy('name');
  };

  const isFiltered =
    searchTerm !== '' ||
    selectedHouse !== 'ALL' ||
    selectedType !== 'ALL' ||
    selectedFamily !== 'ALL' ||
    sortBy !== 'name';

  return (
    <div className="relative mx-auto w-full max-w-6xl space-y-10 px-4 py-8 sm:py-12">
      {/* Back and Top CTA Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-parchment/70 transition-colors hover:text-gold"
        >
          <ArrowLeft size={16} />
          Volver al Inicio
        </button>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleDownloadDossier}
            className="inline-flex items-center gap-2 rounded-xl border border-gold/40 bg-gold/10 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-gold transition-all hover:border-gold hover:bg-gold/20"
            title="Descargar Dossier Completo en PDF con análisis metodológico"
          >
            <FileDown size={15} />
            Descargar Dossier (PDF)
          </button>

          {onStartTest && (
            <button
              onClick={onStartTest}
              className="inline-flex items-center gap-2 rounded-xl border border-gold/70 bg-gradient-to-r from-gold/30 via-gold/40 to-gold/30 px-4 py-2 text-xs font-bold uppercase tracking-wider text-parchment shadow-[0_0_20px_rgba(217,119,6,0.3)] transition-all hover:scale-[1.02] hover:border-gold hover:text-white"
            >
              <Sparkles size={15} className="text-gold-light" />
              Someterme al Juicio
            </button>
          )}
        </div>
      </div>

      {/* Hero Banner Header */}
      <header className="relative space-y-4 overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-b from-[#0e1726]/95 via-[#09111d]/95 to-[#060b13]/95 p-6 shadow-2xl backdrop-blur-md sm:p-10">
        <div className="pointer-events-none absolute -right-10 -top-10 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-gold/40 bg-gold/15 text-gold shadow-sm">
                <BookOpen size={20} />
              </span>
              <p className="font-mono text-xs uppercase tracking-[0.35em] text-medical-teal font-semibold">
                Gran Grimorio del Santuario
              </p>
            </div>
            <h1 className="font-display text-3xl font-bold tracking-wide text-gold magic-shadow sm:text-5xl">
              51 Especialidades y Áreas Médicas
            </h1>
            <p className="max-w-3xl font-classic text-base leading-relaxed text-[#f1e5d1] sm:text-lg">
              El compendio exhaustivo de todas las disciplinas clínicas del sistema sanitario español.
              Explora cómo convergen la destreza procedimental, el razonamiento deductivo, la urgencia y el
              vínculo humano bajo la tutela de las <strong className="text-gold font-bold">4 Casas del Sombrero</strong> y
              los <strong className="text-gold font-bold">6 Ejes Dimensionales</strong> del Santuario.
            </p>

            <div className="flex flex-wrap gap-2.5 pt-2 text-[10px] font-bold uppercase tracking-wider">
              <span className="rounded-full border border-gold/40 bg-gold/10 px-3.5 py-1 text-gold-light">
                {ACTIVE_SPECIALTIES.length} Fichas Clínicas Homologadas
              </span>
              <span className="rounded-full border border-rose-500/30 bg-rose-950/40 px-3 py-1 text-rose-300">
                Gryffindor ({houseCounts.Gryffindor})
              </span>
              <span className="rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3 py-1 text-emerald-300">
                Slytherin ({houseCounts.Slytherin})
              </span>
              <span className="rounded-full border border-sky-500/30 bg-sky-950/40 px-3 py-1 text-sky-300">
                Ravenclaw ({houseCounts.Ravenclaw})
              </span>
              <span className="rounded-full border border-amber-500/30 bg-amber-950/40 px-3 py-1 text-amber-300">
                Hufflepuff ({houseCounts.Hufflepuff})
              </span>
            </div>
          </div>

          {/* Quick Floating Action or Compare Button */}
          {compareList.length > 0 && (
            <div className="relative z-10 flex flex-col items-center gap-2 rounded-xl border border-gold/50 bg-[#121c2c] p-4 text-center shadow-lg">
              <p className="text-xs font-semibold text-gold">Comparador Activado</p>
              <p className="text-[11px] text-parchment/80">
                {compareList.length} de 3 especialidades seleccionadas
              </p>
              <button
                onClick={() => setShowCompareModal(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-gold px-4 py-1.5 text-xs font-bold uppercase text-bg-deep transition-all hover:bg-gold-light"
              >
                <Scale size={14} />
                Ver Comparativa
              </button>
            </div>
          )}
        </div>
      </header>

      {/* The 4 Houses Explorer Cards */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-parchment/80">
            <Sparkles size={14} className="text-gold" />
            <span>Filtrar por Arquetipo de Casa</span>
          </div>
          {selectedHouse !== 'ALL' && (
            <button
              onClick={() => setSelectedHouse('ALL')}
              className="text-xs font-semibold text-gold hover:underline"
            >
              Mostrar todas las Casas
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {(Object.keys(HOUSES_META) as HouseType[]).map((houseKey) => {
            const house = HOUSES_META[houseKey];
            const isSelected = selectedHouse === houseKey;
            const Icon = house.icon;

            return (
              <button
                key={houseKey}
                onClick={() => setSelectedHouse(isSelected ? 'ALL' : houseKey)}
                style={{
                  boxShadow: isSelected ? `0 0 24px ${house.glowColor}` : undefined,
                }}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-xl border p-4 text-left transition-all duration-300 ${
                  isSelected
                    ? `${house.borderColor} bg-[#0e1929] ring-2 ring-gold/50`
                    : 'border-gold/20 bg-[#09111c]/90 hover:border-gold/50 hover:bg-[#0c1624]'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={house.crest}
                        alt={house.name}
                        className="h-10 w-10 object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <div>
                        <h3 className="font-magic text-base font-bold text-parchment group-hover:text-gold">
                          {house.name}
                        </h3>
                        <p className="font-mono text-[9px] uppercase tracking-wider text-parchment/60 italic">
                          {house.motto}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold ${
                        isSelected
                          ? 'border-gold bg-gold text-bg-deep'
                          : 'border-gold/30 bg-gold/10 text-gold'
                      }`}
                    >
                      {houseCounts[houseKey]}
                    </span>
                  </div>

                  <p className="font-sans text-xs font-semibold text-gold-light">
                    {house.title}
                  </p>
                  <p className="text-[11px] leading-relaxed text-[#ded4bf]">
                    {house.ethos}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-gold/10 pt-2 text-[10px] uppercase tracking-wider">
                  <span className={`font-semibold ${isSelected ? 'text-gold' : 'text-parchment/60'}`}>
                    {isSelected ? '✓ Filtro activo' : 'Clic para filtrar'}
                  </span>
                  <Icon size={14} className={house.badgeText} />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Search and Filters Toolbar */}
      <section className="space-y-4 rounded-xl border border-gold/25 bg-[#09111c]/95 p-4 shadow-xl backdrop-blur-md sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold/70" size={17} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por especialidad, órgano, patología o palabras clave..."
              className="w-full rounded-xl border border-gold/25 bg-[#04080e] py-2.5 pl-10 pr-10 font-sans text-sm text-[#f6eedf] placeholder-parchment/40 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-parchment/50 hover:text-gold"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <ArrowUpDown size={15} className="text-gold/70 shrink-0" />
            <span className="text-xs uppercase tracking-wider text-parchment/70 shrink-0">Ordenar:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="rounded-lg border border-gold/25 bg-[#04080e] px-3 py-2 text-xs font-semibold text-parchment focus:border-gold focus:outline-none"
            >
              <option value="name">Alfabético (A-Z)</option>
              <option value="house">Por Casa del Sombrero</option>
              <option value="procedures">Mayor carga intervencionista (A2)</option>
              <option value="urgency">Mayor ritmo / urgencias (A3)</option>
              <option value="diagnostic">Mayor complejidad diagnóstica (A1)</option>
              <option value="longitudinal">Mayor relación longitudinal (A5)</option>
            </select>
          </div>
        </div>

        {/* Filters Row: Type & Family */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gold/10 pt-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-parchment/60">Tipo:</span>
            {[
              { id: 'ALL', label: `Todos (${ACTIVE_SPECIALTIES.length})` },
              { id: 'MIR', label: 'MIR Oficial (47)' },
              { id: 'ACE', label: 'ACE (3)' },
              { id: 'AREA', label: 'Áreas (1)' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedType(t.id as any)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                  selectedType === t.id
                    ? 'border border-gold bg-gold/20 text-gold shadow-sm'
                    : 'border border-gold/15 bg-black/30 text-parchment/70 hover:border-gold/40 hover:text-parchment'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-parchment/60">Familia:</span>
            <select
              value={selectedFamily}
              onChange={(e) => setSelectedFamily(e.target.value)}
              className="rounded-lg border border-gold/25 bg-[#04080e] px-3 py-1.5 text-xs font-semibold text-parchment focus:border-gold focus:outline-none"
            >
              <option value="ALL">Todas las familias ({allFamilies.length})</option>
              {allFamilies.map((fam) => (
                <option key={fam} value={fam}>
                  {fam}
                </option>
              ))}
            </select>

            {isFiltered && (
              <button
                onClick={clearAllFilters}
                className="inline-flex items-center gap-1 rounded-lg border border-red-500/30 bg-red-950/30 px-2.5 py-1 text-xs text-red-300 hover:bg-red-900/40"
              >
                <X size={12} />
                Limpiar filtros
              </button>
            )}
          </div>
        </div>

        {/* Results Counter and Active Indicators */}
        <div className="flex flex-wrap items-center justify-between text-xs text-parchment/70">
          <p>
            Mostrando <strong className="text-gold">{filteredSpecialties.length}</strong> de {ACTIVE_SPECIALTIES.length} especialidades
            {selectedHouse !== 'ALL' && (
              <span> en <strong className="text-parchment">{HOUSES_META[selectedHouse].name}</strong></span>
            )}
            {selectedType !== 'ALL' && (
              <span> ({selectedType})</span>
            )}
          </p>

          {compareList.length > 0 && (
            <p className="text-xs text-gold">
              {compareList.length} seleccionadas para comparar{' '}
              <button
                onClick={() => setShowCompareModal(true)}
                className="underline hover:text-gold-light ml-1 font-bold"
              >
                (Abrir Duelo)
              </button>
            </p>
          )}
        </div>
      </section>

      {/* Grid of Specialty Cards */}
      {filteredSpecialties.length === 0 ? (
        <div className="rounded-2xl border border-gold/20 bg-[#09111c]/90 p-12 text-center space-y-4">
          <AlertTriangle className="mx-auto text-amber-400" size={36} />
          <h3 className="font-magic text-xl text-gold">No se hallaron especialidades</h3>
          <p className="text-sm text-parchment/80 max-w-md mx-auto">
            Ninguna especialidad coincide con los filtros aplicados. Prueba a buscar por otro término o restablece los filtros.
          </p>
          <button
            onClick={clearAllFilters}
            className="rounded-xl border border-gold/50 bg-gold/15 px-4 py-2 text-xs font-bold uppercase text-gold hover:bg-gold/25"
          >
            Restablecer todos los filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredSpecialties.map((specialty, idx) => {
            const houseKey = getHouseForSpecialty(specialty);
            const house = HOUSES_META[houseKey];
            const isComparing = compareList.includes(specialty.id);

            return (
              <motion.article
                key={specialty.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(idx * 0.03, 0.3) }}
                onClick={() => {
                  setActiveSpecialty(specialty);
                  setActiveModalTab('overview');
                }}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-gradient-to-b from-[#0a1320]/95 via-[#080e18]/95 to-[#050910]/95 p-5 shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] ${
                  isComparing
                    ? 'border-gold ring-2 ring-gold/40'
                    : 'border-gold/20 hover:border-gold/60'
                }`}
              >
                {/* House Top Bar Banner Indicator */}
                <div
                  className="absolute left-0 top-0 h-1.5 w-full"
                  style={{ backgroundColor: house.color }}
                />

                <div className="space-y-3.5">
                  {/* House badge & Access badge */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <div className="flex items-center gap-2">
                      <img
                        src={house.crest}
                        alt={house.name}
                        className="h-6 w-6 object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${house.borderColor} ${house.badgeBg} ${house.badgeText}`}
                      >
                        {house.name.replace('Casa ', '')}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="rounded border border-gold/30 bg-gold/10 px-2 py-0.5 text-[9px] font-bold uppercase text-gold-light">
                        {specialty.type}
                      </span>
                      <button
                        onClick={(e) => toggleCompare(specialty.id, e)}
                        className={`rounded border p-1 text-[9px] transition-colors ${
                          isComparing
                            ? 'border-gold bg-gold text-bg-deep font-bold'
                            : 'border-gold/20 text-parchment/50 hover:border-gold hover:text-gold'
                        }`}
                        title="Añadir a la comparativa"
                      >
                        <Scale size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Title and Family */}
                  <div>
                    <h3 className="font-magic text-xl font-bold leading-snug text-[#f7eedc] group-hover:text-gold transition-colors">
                      {specialty.name}
                    </h3>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-parchment/65">
                      Familia: <span className="text-gold-dim">{specialty.family}</span>
                    </p>
                  </div>

                  {/* Clinical Description */}
                  <p className="line-clamp-3 text-xs leading-relaxed text-[#ded4be]">
                    {specialty.description}
                  </p>

                  {/* Dimensional Gauges (0 to 4 dots) */}
                  <div className="space-y-1.5 rounded-xl border border-gold/10 bg-[#04080e]/60 p-3">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-gold-light">
                      Equilibrio Clínico
                    </p>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[10px]">
                      {/* A1 Cognition */}
                      <div className="flex items-center justify-between">
                        <span className="text-parchment/75">Diagnóstico</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4].map((step) => (
                            <span
                              key={step}
                              className={`h-1.5 w-2.5 rounded-sm ${
                                step <= (specialty.numeric.A1 ?? 0)
                                  ? 'bg-sky-400'
                                  : 'bg-white/10'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* A2 Procedures */}
                      <div className="flex items-center justify-between">
                        <span className="text-parchment/75">Técnica / Quiróf.</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4].map((step) => (
                            <span
                              key={step}
                              className={`h-1.5 w-2.5 rounded-sm ${
                                step <= (specialty.numeric.A2 ?? 0)
                                  ? 'bg-emerald-400'
                                  : 'bg-white/10'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* A3 Urgency / Acute */}
                      <div className="flex items-center justify-between">
                        <span className="text-parchment/75">Ritmo / Urgencias</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4].map((step) => (
                            <span
                              key={step}
                              className={`h-1.5 w-2.5 rounded-sm ${
                                step <= (specialty.numeric.A3 ?? 0)
                                  ? 'bg-rose-400'
                                  : 'bg-white/10'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* A5 Longitudinal contact */}
                      <div className="flex items-center justify-between">
                        <span className="text-parchment/75">Vínculo Paciente</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4].map((step) => (
                            <span
                              key={step}
                              className={`h-1.5 w-2.5 rounded-sm ${
                                step <= (specialty.numeric.A5 ?? 0)
                                  ? 'bg-amber-400'
                                  : 'bg-white/10'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Day-to-day tags */}
                  <div className="flex flex-wrap gap-1.5 text-[9px] font-medium text-parchment/70">
                    <span className="rounded bg-white/5 px-2 py-0.5 border border-white/10">
                      Guardias: {specialty.constraints.guards >= 3 ? 'Intensivas 24h' : specialty.constraints.guards === 2 ? 'Moderadas' : 'Bajas / Opcionales'}
                    </span>
                    <span className="rounded bg-white/5 px-2 py-0.5 border border-white/10">
                      Carga Emocional: {specialty.constraints.emotionalLoad >= 3 ? 'Alta' : 'Moderada'}
                    </span>
                  </div>
                </div>

                {/* Footer and Alternatives */}
                <div className="mt-4 space-y-3 border-t border-gold/15 pt-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[9px] uppercase tracking-wider text-parchment/50">
                      Afines:
                    </span>
                    {specialty.alternatives.slice(0, 3).map((alt) => (
                      <span
                        key={alt}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSearchTerm(alt);
                        }}
                        className="rounded border border-gold/15 bg-black/40 px-1.5 py-0.5 text-[9px] text-parchment/80 transition-colors hover:border-gold hover:text-gold cursor-pointer"
                      >
                        {alt}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold text-gold group-hover:text-gold-light">
                    <span>Abrir Ficha Arcana</span>
                    <ChevronRight size={15} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      )}

      {/* Deep-Dive Modal ("El Manuscrito Arcano") */}
      <AnimatePresence>
        {activeSpecialty && (() => {
          const house = HOUSES_META[getHouseForSpecialty(activeSpecialty)];
          const evidenceObj = {
            ...REVIEW_EVIDENCE[activeSpecialty.id],
            ...activeSpecialty.evidence,
          };

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative my-auto w-full max-w-4xl overflow-hidden rounded-2xl border border-gold/40 bg-gradient-to-b from-[#0c1524] via-[#09111c] to-[#050a12] shadow-[0_0_50px_rgba(0,0,0,0.8)]"
              >
                {/* Modal Header with House Theme */}
                <div
                  className="relative p-6 sm:p-8 border-b border-gold/20"
                  style={{
                    background: `linear-gradient(135deg, ${house.glowColor} 0%, rgba(9,17,28,0.95) 100%)`,
                  }}
                >
                  <button
                    onClick={() => setActiveSpecialty(null)}
                    className="absolute right-4 top-4 rounded-full border border-gold/30 bg-black/50 p-2 text-parchment/70 transition-colors hover:border-gold hover:text-gold"
                  >
                    <X size={18} />
                  </button>

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <img
                      src={house.crest}
                      alt={house.name}
                      className="h-16 w-16 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.25)]"
                    />
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${house.borderColor} ${house.badgeBg} ${house.badgeText}`}
                        >
                          {house.name} • {house.title}
                        </span>
                        <span className="rounded border border-gold/30 bg-gold/15 px-2 py-0.5 text-[10px] font-bold text-gold">
                          {activeSpecialty.type}
                        </span>
                        <span className="rounded border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-parchment/80">
                          {activeSpecialty.family}
                        </span>
                      </div>

                      <h2 className="font-display text-2xl sm:text-4xl font-bold text-gold magic-shadow">
                        {activeSpecialty.name}
                      </h2>
                      <p className="font-mono text-xs italic text-parchment/70">
                        "{house.motto}" — {house.ethos}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Modal Tabs Navigation */}
                <div className="flex border-b border-gold/15 bg-black/40 px-6 text-xs font-semibold uppercase tracking-wider">
                  <button
                    onClick={() => setActiveModalTab('overview')}
                    className={`py-3 px-4 border-b-2 transition-all ${
                      activeModalTab === 'overview'
                        ? 'border-gold text-gold bg-gold/5'
                        : 'border-transparent text-parchment/60 hover:text-parchment'
                    }`}
                  >
                    1. Perfil Clínico & Casa
                  </button>
                  <button
                    onClick={() => setActiveModalTab('dimensions')}
                    className={`py-3 px-4 border-b-2 transition-all ${
                      activeModalTab === 'dimensions'
                        ? 'border-gold text-gold bg-gold/5'
                        : 'border-transparent text-parchment/60 hover:text-parchment'
                    }`}
                  >
                    2. Ejes Dimensionales & Evidencia
                  </button>
                  <button
                    onClick={() => setActiveModalTab('lifestyle')}
                    className={`py-3 px-4 border-b-2 transition-all ${
                      activeModalTab === 'lifestyle'
                        ? 'border-gold text-gold bg-gold/5'
                        : 'border-transparent text-parchment/60 hover:text-parchment'
                    }`}
                  >
                    3. Guardias, Entornos y Afines
                  </button>
                </div>

                {/* Modal Body */}
                <div className="max-h-[60vh] overflow-y-auto p-6 sm:p-8 space-y-6 custom-scrollbar text-[#f2e7d3]">
                  {activeModalTab === 'overview' && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h4 className="font-magic text-lg text-gold">Definición Asistencial</h4>
                        <p className="text-sm leading-relaxed text-[#ede3cd]">
                          {activeSpecialty.description}
                        </p>
                      </div>

                      {/* Why House */}
                      <div className="rounded-xl border border-gold/25 bg-[#0a121e] p-5 space-y-3">
                        <div className="flex items-center gap-2">
                          <house.icon size={18} className={house.badgeText} />
                          <h4 className="font-magic text-base text-gold">
                            Por qué pertenece a la {house.name}
                          </h4>
                        </div>
                        <p className="text-xs leading-relaxed text-[#ded4bf]">
                          El Sombrero Seleccionador sitúa a <strong className="text-gold">{activeSpecialty.name}</strong> bajo la tutela de {house.name} debido a su correspondencia directa con {house.ethos.toLowerCase()} En el día a día hospitalario, los profesionales de esta disciplina deben personificar este espíritu para superar las complejidades asistenciales con maestría.
                        </p>
                      </div>

                      {/* Target Populations & Outcomes */}
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="rounded-xl border border-gold/15 bg-black/30 p-4 space-y-2">
                          <h5 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-medical-teal">
                            <Users size={14} />
                            Población Diana Principal
                          </h5>
                          <div className="flex flex-wrap gap-1.5">
                            {activeSpecialty.populations.map((pop) => (
                              <span
                                key={pop}
                                className="rounded-lg border border-gold/20 bg-gold/10 px-2.5 py-1 text-xs text-parchment"
                              >
                                {POPULATION_LABELS[pop] || pop}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="rounded-xl border border-gold/15 bg-black/30 p-4 space-y-2">
                          <h5 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300">
                            <Award size={14} />
                            Resultados Buscados
                          </h5>
                          <div className="flex flex-wrap gap-1.5">
                            {activeSpecialty.outcomes.map((out) => (
                              <span
                                key={out}
                                className="rounded-lg border border-amber-500/20 bg-amber-950/30 px-2.5 py-1 text-xs text-amber-200/90"
                              >
                                {OUTCOME_LABELS[out] || out}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Systems and Organs */}
                      <div className="space-y-2">
                        <h5 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gold-light">
                          <Brain size={14} />
                          Sistemas Orgánicos y Áreas Anatómicas
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {activeSpecialty.systems.map((sys) => (
                            <span
                              key={sys}
                              className="rounded-full border border-teal-500/30 bg-teal-950/30 px-3 py-1 text-xs text-teal-200"
                            >
                              {SYSTEM_LABELS[sys] || sys}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeModalTab === 'dimensions' && (
                    <div className="space-y-6">
                      <p className="text-xs text-parchment/80 leading-relaxed">
                        Los 6 ejes numéricos miden de 0 a 4 la intensidad de cada componente en la práctica habitual de la especialidad. Las notas de evidencia reflejan los fundamentos técnicos documentados en el Santuario.
                      </p>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {(['A1', 'A2', 'A3', 'A4', 'A5', 'A8'] as NumericDimensionId[]).map((dimId) => {
                          const dimDef = DIMENSIONS[dimId];
                          const score = activeSpecialty.numeric[dimId] ?? 0;
                          const note = evidenceObj[dimId];

                          return (
                            <div
                              key={dimId}
                              className="rounded-xl border border-gold/15 bg-[#0a121e] p-4 space-y-3"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="font-mono text-[10px] text-gold font-bold">{dimId}</span>
                                  <h5 className="font-magic text-sm text-parchment font-bold">
                                    {dimDef?.label || dimId}
                                  </h5>
                                </div>
                                <div className="flex items-center gap-1.5 rounded-lg border border-gold/30 bg-gold/10 px-2 py-0.5">
                                  <span className="font-mono text-xs font-bold text-gold">{score} / 4</span>
                                </div>
                              </div>

                              {/* Progress bar */}
                              <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                                <div
                                  className="h-full bg-gradient-to-r from-gold/50 to-gold rounded-full transition-all duration-500"
                                  style={{ width: `${(score / 4) * 100}%` }}
                                />
                              </div>

                              <div className="flex justify-between text-[10px] text-parchment/60">
                                <span>{dimDef?.lowLabel}</span>
                                <span>{dimDef?.highLabel}</span>
                              </div>

                              {note && (
                                <p className="border-t border-gold/10 pt-2 text-[11px] leading-relaxed text-gold-light/90 italic">
                                  " {note} "
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {activeModalTab === 'lifestyle' && (
                    <div className="space-y-6">
                      <div className="rounded-xl border border-gold/20 bg-[#0a121e] p-5 space-y-4">
                        <h4 className="font-magic text-base text-gold flex items-center gap-2">
                          <Clock size={16} />
                          Condiciones Laborales, Guardias y Carga Vital
                        </h4>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div className="rounded-lg border border-white/10 bg-black/30 p-3 space-y-1">
                            <span className="text-[10px] uppercase tracking-wider text-parchment/60">
                              Exposición a Guardias 24h
                            </span>
                            <p className="text-sm font-bold text-parchment">
                              {activeSpecialty.constraints.guards >= 4
                                ? 'Crítica (Guardias muy frecuentes y de alta intensidad)'
                                : activeSpecialty.constraints.guards === 3
                                ? 'Regular (Guardias habituales de presencia física)'
                                : activeSpecialty.constraints.guards === 2
                                ? 'Moderada / Localizada según hospital'
                                : 'Baja / Inexistente (horario programado)'}
                            </p>
                          </div>

                          <div className="rounded-lg border border-white/10 bg-black/30 p-3 space-y-1">
                            <span className="text-[10px] uppercase tracking-wider text-parchment/60">
                              Carga Emocional y Sufrimiento
                            </span>
                            <p className="text-sm font-bold text-parchment">
                              {activeSpecialty.constraints.emotionalLoad >= 4
                                ? 'Extrema (Exposición constante a muerte y dolor agudo)'
                                : activeSpecialty.constraints.emotionalLoad === 3
                                ? 'Alta (Manejo de patología grave o crónica avanzada)'
                                : 'Moderada / Aséptica'}
                            </p>
                          </div>

                          <div className="rounded-lg border border-white/10 bg-black/30 p-3 space-y-1">
                            <span className="text-[10px] uppercase tracking-wider text-parchment/60">
                              Predictibilidad Horaria
                            </span>
                            <p className="text-sm font-bold text-parchment">
                              {activeSpecialty.constraints.predictability >= 3
                                ? 'Alta (Jornadas estables y programadas)'
                                : 'Imprevisible (Frecuentes imprevistos o intervenciones largas)'}
                            </p>
                          </div>

                          <div className="rounded-lg border border-white/10 bg-black/30 p-3 space-y-1">
                            <span className="text-[10px] uppercase tracking-wider text-parchment/60">
                              Proyección en Investigación
                            </span>
                            <p className="text-sm font-bold text-parchment">
                              {activeSpecialty.constraints.research >= 3
                                ? 'Muy Alta (Gran producción de ensayos clínicos y publicaciones)'
                                : 'Práctica asistencial predominante'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Environments */}
                      <div className="space-y-2">
                        <h5 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-300">
                          <Building2 size={14} />
                          Entornos Asistenciales Habituales
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {activeSpecialty.environments.map((env) => (
                            <span
                              key={env}
                              className="rounded-lg border border-teal-500/30 bg-teal-950/40 px-3 py-1 text-xs text-teal-200"
                            >
                              {ENVIRONMENT_LABELS[env] || env}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Alternatives */}
                      <div className="space-y-2">
                        <h5 className="text-xs font-bold uppercase tracking-wider text-gold">
                          Especialidades Afines y Rutas Alternativas
                        </h5>
                        <p className="text-xs text-parchment/70">
                          Si estás dudando con {activeSpecialty.name}, estas son las especialidades que comparten mayor solapamiento dimensional:
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {activeSpecialty.alternatives.map((alt) => (
                            <button
                              key={alt}
                              onClick={() => {
                                const found = ACTIVE_SPECIALTIES.find(
                                  (s) => s.name.toLowerCase() === alt.toLowerCase()
                                );
                                if (found) {
                                  setActiveSpecialty(found);
                                  setActiveModalTab('overview');
                                } else {
                                  setSearchTerm(alt);
                                  setActiveSpecialty(null);
                                }
                              }}
                              className="rounded-xl border border-gold/30 bg-gold/10 px-3 py-1.5 text-xs text-gold hover:border-gold hover:bg-gold/25 transition-all"
                            >
                              {alt} →
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal Footer Actions */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-gold/20 bg-[#060b13] p-5 sm:p-6">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleCompare(activeSpecialty.id)}
                      className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold uppercase ${
                        compareList.includes(activeSpecialty.id)
                          ? 'border-gold bg-gold text-bg-deep'
                          : 'border-gold/30 text-parchment hover:border-gold hover:text-gold'
                      }`}
                    >
                      <Scale size={14} />
                      {compareList.includes(activeSpecialty.id)
                        ? 'En comparativa'
                        : 'Añadir a Comparar'}
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setActiveSpecialty(null)}
                      className="rounded-xl border border-white/10 px-4 py-2 text-xs text-parchment/70 hover:text-parchment"
                    >
                      Cerrar
                    </button>

                    {onStartTest && (
                      <button
                        onClick={() => {
                          setActiveSpecialty(null);
                          onStartTest();
                        }}
                        className="inline-flex items-center gap-2 rounded-xl border border-gold bg-gradient-to-r from-gold/30 via-gold to-gold/30 px-5 py-2 text-xs font-bold uppercase text-bg-deep shadow-[0_0_20px_rgba(217,119,6,0.4)] hover:brightness-110"
                      >
                        <Sparkles size={14} />
                        Descubrir si es mi vocación
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* Comparison Modal ("Duelo Arcano de Especialidades") */}
      <AnimatePresence>
        {showCompareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative my-auto w-full max-w-5xl overflow-hidden rounded-2xl border border-gold/40 bg-gradient-to-b from-[#0e1726] to-[#070c14] p-6 shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between border-b border-gold/20 pb-4">
                <div className="flex items-center gap-3">
                  <Scale size={24} className="text-gold" />
                  <div>
                    <h3 className="font-magic text-2xl text-gold">Duelo Arcano de Especialidades</h3>
                    <p className="text-xs text-parchment/70">
                      Comparativa directa de dimensiones clínicas y condiciones de ejercicio
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCompareModal(false)}
                  className="rounded-full border border-gold/30 p-2 text-parchment hover:text-gold"
                >
                  <X size={18} />
                </button>
              </div>

              {compareList.length === 0 ? (
                <div className="py-12 text-center text-parchment/60 space-y-2">
                  <p>No has seleccionado especialidades para comparar.</p>
                  <p className="text-xs">Usa el botón de balanza en las fichas del Grimorio.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <div className="grid grid-cols-3 gap-4 min-w-[650px]">
                    {compareList.map((id) => {
                      const spec = ACTIVE_SPECIALTIES.find((s) => s.id === id);
                      if (!spec) return null;
                      const house = HOUSES_META[getHouseForSpecialty(spec)];

                      return (
                        <div
                          key={spec.id}
                          className="rounded-xl border border-gold/25 bg-[#09111c] p-4 space-y-4"
                        >
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <span
                                className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase ${house.borderColor} ${house.badgeBg} ${house.badgeText}`}
                              >
                                {house.name}
                              </span>
                              <h4 className="font-magic text-lg text-gold font-bold">{spec.name}</h4>
                              <p className="text-[10px] text-parchment/60">{spec.family} • {spec.type}</p>
                            </div>
                            <button
                              onClick={() => toggleCompare(spec.id)}
                              className="text-red-400 hover:text-red-300"
                              title="Quitar"
                            >
                              <X size={16} />
                            </button>
                          </div>

                          <div className="space-y-2 border-t border-gold/10 pt-3 text-xs">
                            <div className="flex justify-between">
                              <span className="text-parchment/60">Diagnóstico (A1):</span>
                              <span className="font-bold text-sky-300">{spec.numeric.A1} / 4</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-parchment/60">Procedimientos (A2):</span>
                              <span className="font-bold text-emerald-300">{spec.numeric.A2} / 4</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-parchment/60">Ritmo / Urgencias (A3):</span>
                              <span className="font-bold text-rose-300">{spec.numeric.A3} / 4</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-parchment/60">Vínculo Paciente (A5):</span>
                              <span className="font-bold text-amber-300">{spec.numeric.A5} / 4</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-parchment/60">Guardias 24h:</span>
                              <span className="font-bold text-parchment">{spec.constraints.guards} / 4</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-parchment/60">Carga Emocional:</span>
                              <span className="font-bold text-parchment">{spec.constraints.emotionalLoad} / 4</span>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              setShowCompareModal(false);
                              setActiveSpecialty(spec);
                            }}
                            className="w-full rounded-lg border border-gold/30 bg-gold/10 py-1.5 text-xs text-gold font-bold hover:bg-gold/20"
                          >
                            Ver Ficha Detallada
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center border-t border-gold/20 pt-4">
                <button
                  onClick={() => setCompareList([])}
                  className="text-xs text-red-400 hover:underline"
                >
                  Limpiar lista de comparativa
                </button>
                <button
                  onClick={() => setShowCompareModal(false)}
                  className="rounded-xl border border-gold/40 bg-gold/10 px-4 py-2 text-xs font-bold uppercase text-gold hover:bg-gold/20"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Methodology and Regulatory Note */}
      <footer className="rounded-xl border border-gold/15 bg-black/30 p-6 text-center space-y-2">
        <p className="text-xs leading-relaxed text-parchment/80 max-w-3xl mx-auto">
          La clasificación MIR, ACE y Áreas responde a la ordenación del sistema sanitario español. Las dimensiones de cada ficha han sido elaboradas para orientar la toma de decisiones vocacionales y no reemplazan las recomendaciones oficiales del Ministerio de Sanidad ni la consulta directa con residentes y tutores de cada especialidad.
        </p>
      </footer>
    </div>
  );
}
