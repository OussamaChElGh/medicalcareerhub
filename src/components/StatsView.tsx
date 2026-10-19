import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Users,
  Shield,
  Sparkles,
  FileDown,
  Flame,
  Eye,
  Heart,
  Scale,
  Award,
  Stethoscope,
  Activity,
  CheckCircle2,
  Clock,
  Compass,
} from 'lucide-react';
import { CensusSanctum3D, HouseCensusData } from './CensusSanctum3D';
import { HouseType } from './HouseHeroBanner';
import { generateDossierPDF } from '../lib/dossierPdf';

const HOUSE_STATS: HouseCensusData[] = [
  {
    house: 'Ravenclaw',
    name: 'Casa Ravenclaw',
    count: 1526,
    percentage: 31,
    color: '#38bdf8',
    hexColor: 0x38bdf8,
    label: 'Diagnóstico & Medicina Interna',
    motto: 'Scientia Est Lux In Tenebris',
    topSpecialties: ['Medicina Interna', 'Neurología', 'Oncología Médica', 'Infectología'],
  },
  {
    house: 'Gryffindor',
    name: 'Casa Gryffindor',
    count: 1223,
    percentage: 25,
    color: '#ef4444',
    hexColor: 0xef4444,
    label: 'Urgencias, UCI & Soporte Vital',
    motto: 'Fortis in Re, Celer in Tempore',
    topSpecialties: ['Medicina de Urgencias', 'Medicina Intensiva', 'Anestesiología', 'Traumatología'],
  },
  {
    house: 'Hufflepuff',
    name: 'Casa Hufflepuff',
    count: 1076,
    percentage: 22,
    color: '#f59e0b',
    hexColor: 0xf59e0b,
    label: 'Atención Primaria, Pediatría & Vínculo',
    motto: 'Concordia, Empatia et Cura Perpetua',
    topSpecialties: ['Medicina Familiar', 'Pediatría', 'Geriatría', 'Cuidados Paliativos'],
  },
  {
    house: 'Slytherin',
    name: 'Casa Slytherin',
    count: 1067,
    percentage: 22,
    color: '#10b981',
    hexColor: 0x10b981,
    label: 'Quirófano, Intervención & Precisión',
    motto: 'Dextera Cauta, Mens Suprema',
    topSpecialties: ['Cirugía General', 'Dermatología', 'Oftalmología', 'Urología'],
  },
];

const CENSUS_TRENDS = [
  { month: 'Nov', Gryffindor: 135, Slytherin: 110, Ravenclaw: 165, Hufflepuff: 115 },
  { month: 'Dic', Gryffindor: 150, Slytherin: 125, Ravenclaw: 185, Hufflepuff: 130 },
  { month: 'Ene', Gryffindor: 175, Slytherin: 145, Ravenclaw: 210, Hufflepuff: 150 },
  { month: 'Feb', Gryffindor: 205, Slytherin: 170, Ravenclaw: 245, Hufflepuff: 175 },
  { month: 'Mar', Gryffindor: 240, Slytherin: 215, Ravenclaw: 290, Hufflepuff: 210 },
  { month: 'Abr', Gryffindor: 318, Slytherin: 292, Ravenclaw: 431, Hufflepuff: 296 },
];

const FAMILY_BREAKDOWN = [
  { family: 'Médica Troncal', count: 1918, pct: 39.2, color: '#38bdf8' },
  { family: 'Quirúrgica Pura', count: 1247, pct: 25.5, color: '#10b981' },
  { family: 'Urgencias & Críticos', count: 768, pct: 15.7, color: '#ef4444' },
  { family: 'Servicios Centrales', count: 577, pct: 11.8, color: '#c5a059' },
  { family: 'Salud Mental & Psique', count: 382, pct: 7.8, color: '#a855f7' },
];

const TOP_SPECIALTIES_CENSUS = [
  { name: 'Cardiología', house: 'Ravenclaw', count: 342, affinityRate: 98.4, type: 'MIR' },
  { name: 'Dermatología', house: 'Slytherin', count: 319, affinityRate: 99.1, type: 'MIR' },
  { name: 'Medicina Interna', house: 'Ravenclaw', count: 308, affinityRate: 95.8, type: 'MIR' },
  { name: 'Medicina Intensiva', house: 'Gryffindor', count: 284, affinityRate: 96.5, type: 'MIR' },
  { name: 'Pediatría y Áreas', house: 'Hufflepuff', count: 271, affinityRate: 94.2, type: 'MIR' },
];

export const StatsView: React.FC = () => {
  const [selectedHouse, setSelectedHouse] = useState<HouseType | null>(null);
  const [trendView, setTrendView] = useState<'all' | HouseType>('all');

  const totalCandidates = useMemo(() => {
    return HOUSE_STATS.reduce((acc, curr) => acc + curr.count, 0);
  }, []);

  const handleDownloadReport = () => {
    generateDossierPDF();
  };

  return (
    <div className="space-y-12 pb-20 text-[#f5ebd7]">
      {/* Header section with High Contrast */}
      <div className="relative overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-b from-[#0e1726]/95 via-[#09111c]/95 to-[#050a12]/95 p-6 sm:p-10 shadow-2xl backdrop-blur-md">
        <div className="pointer-events-none absolute -right-10 -top-10 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-gold/40 bg-gold/15 text-gold shadow-sm">
                <BarChart3 size={20} />
              </span>
              <p className="font-mono text-xs uppercase tracking-[0.35em] text-medical-teal font-semibold">
                Observatorio Demográfico & Vocacional
              </p>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-gold magic-shadow">
              Censo Vivo de la Academia
            </h1>
            <p className="max-w-3xl font-classic text-base sm:text-lg leading-relaxed text-[#ede1cc]">
              Registro empírico de las <strong className="text-gold font-bold">4.892 resoluciones vocacionales</strong> expedidas
              por el Sombrero Seleccionador y el Oráculo Clínico. Los datos ilustran la distribución de postulantes MIR entre las 4 Casas y las 51 especialidades oficiales.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleDownloadReport}
              className="inline-flex items-center gap-2 rounded-xl border border-gold/50 bg-gold/15 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-gold shadow-md hover:bg-gold/25 hover:border-gold transition-all"
              title="Descargar informe censal en PDF"
            >
              <FileDown size={16} />
              Descargar Informe (PDF)
            </button>
          </div>
        </div>
      </div>

      {/* KPI Telemetry Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: Users,
            label: 'Postulantes Censados',
            val: totalCandidates.toLocaleString('es-ES'),
            detail: '+18.4% este semestre',
            color: 'text-gold',
            border: 'border-gold/30',
          },
          {
            icon: CheckCircle2,
            label: 'Afinidad Vocacional',
            val: '96.8%',
            detail: 'Concordancia con el residente',
            color: 'text-emerald-400',
            border: 'border-emerald-500/30',
          },
          {
            icon: Award,
            label: 'Casa Predominante',
            val: 'Ravenclaw',
            detail: '31% del censo total',
            color: 'text-sky-400',
            border: 'border-sky-500/30',
          },
          {
            icon: Stethoscope,
            label: 'Disciplinas Activas',
            val: '51 Fichas',
            detail: 'Homologadas en España',
            color: 'text-amber-400',
            border: 'border-amber-500/30',
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
            className={`rounded-2xl border ${item.border} bg-[#09111c]/95 p-5 shadow-lg flex flex-col justify-between space-y-2`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-parchment/70">
                {item.label}
              </span>
              <item.icon className={item.color} size={18} />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-display font-bold text-parchment">
                {item.val}
              </div>
              <p className="text-[11px] text-parchment/60 font-mono mt-0.5">{item.detail}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 3D Census Sanctum Component */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-parchment/80">
            <Sparkles size={14} className="text-gold" />
            <span className="font-bold">Sanctum 3D y Planetario de Distribución de Casas</span>
          </div>
          {selectedHouse && (
            <button
              onClick={() => setSelectedHouse(null)}
              className="text-xs font-semibold text-gold hover:underline"
            >
              Restablecer selección
            </button>
          )}
        </div>

        <CensusSanctum3D
          data={HOUSE_STATS}
          selectedHouse={selectedHouse}
          onSelectHouse={setSelectedHouse}
        />
      </section>

      {/* Synchronized 4 House Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {HOUSE_STATS.map((houseData) => {
          const isSelected = selectedHouse === houseData.house;
          const crestMap: Record<HouseType, string> = {
            Gryffindor: '/house-gryffindor.png',
            Slytherin: '/house-slytherin.png',
            Ravenclaw: '/house-ravenclaw.png',
            Hufflepuff: '/house-hufflepuff.png',
          };

          return (
            <button
              key={houseData.house}
              onClick={() => setSelectedHouse(isSelected ? null : houseData.house)}
              className={`rounded-2xl border p-5 text-left transition-all duration-300 flex flex-col justify-between gap-4 cursor-pointer ${
                isSelected
                  ? 'bg-[#0f1d2e] ring-2 ring-gold'
                  : 'bg-[#09111c]/95 hover:bg-[#0c1626]'
              }`}
              style={{
                borderColor: isSelected ? houseData.color : `${houseData.color}44`,
                boxShadow: isSelected ? `0 0 25px ${houseData.color}40` : undefined,
              }}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={crestMap[houseData.house]}
                      alt={houseData.name}
                      className="h-10 w-10 object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <div>
                      <h3 className="font-magic text-base font-bold text-parchment">
                        {houseData.name}
                      </h3>
                      <p className="font-mono text-[10px] uppercase tracking-wider text-parchment/60">
                        {houseData.percentage}% del censo
                      </p>
                    </div>
                  </div>
                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold"
                    style={{
                      borderColor: houseData.color,
                      color: houseData.color,
                      backgroundColor: `${houseData.color}15`,
                    }}
                  >
                    {houseData.percentage}%
                  </span>
                </div>

                <p className="text-xs font-semibold text-gold-light">
                  {houseData.label}
                </p>

                {/* Progress bar */}
                <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${houseData.percentage}%`,
                      backgroundColor: houseData.color,
                    }}
                  />
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-parchment/70 text-[11px]">
                    <span>Médicos censados:</span>
                    <strong className="text-parchment font-mono">{houseData.count.toLocaleString('es-ES')}</strong>
                  </div>
                  <div className="border-t border-white/5 pt-2 text-[10px] text-parchment/60">
                    <span className="font-semibold text-gold block mb-0.5">Especialidades clave:</span>
                    <span className="line-clamp-1">{houseData.topSpecialties.join(' · ')}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gold/10 pt-2 flex items-center justify-between text-[10px] uppercase font-mono font-bold">
                <span style={{ color: houseData.color }}>
                  {isSelected ? '✓ Seleccionada en 3D' : 'Clic para inspeccionar en 3D'}
                </span>
              </div>
            </button>
          );
        })}
      </section>

      {/* Trends Over Time & Clinical Family Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Trends Recharts */}
        <div className="rounded-2xl border border-gold/25 bg-[#09111c]/95 p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gold/15 pb-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="text-medical-teal" size={22} />
              <div>
                <h3 className="font-display text-xl font-bold text-parchment">
                  Evolución Mensual de Asignaciones
                </h3>
                <p className="font-mono text-xs text-parchment/60">
                  Volumen de exámenes procesados por semestre
                </p>
              </div>
            </div>

            <select
              value={trendView}
              onChange={(e) => setTrendView(e.target.value as any)}
              className="rounded-lg border border-gold/25 bg-[#04080e] px-2.5 py-1.5 text-xs text-parchment focus:border-gold focus:outline-none"
            >
              <option value="all">Todas las Casas</option>
              <option value="Ravenclaw">Solo Ravenclaw</option>
              <option value="Gryffindor">Solo Gryffindor</option>
              <option value="Hufflepuff">Solo Hufflepuff</option>
              <option value="Slytherin">Solo Slytherin</option>
            </select>
          </div>

          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={CENSUS_TRENDS}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" />
                <XAxis
                  dataKey="month"
                  stroke="#c5a059"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(197, 160, 89, 0.3)' }}
                />
                <YAxis
                  stroke="#c5a059"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(197, 160, 89, 0.3)' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(9, 17, 28, 0.95)',
                    border: '1px solid rgba(197, 160, 89, 0.4)',
                    borderRadius: '12px',
                    color: '#f5ebd7',
                    fontSize: '12px',
                  }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend iconType="circle" />
                {(trendView === 'all' || trendView === 'Ravenclaw') && (
                  <Line
                    type="monotone"
                    dataKey="Ravenclaw"
                    stroke="#38bdf8"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#38bdf8' }}
                    activeDot={{ r: 6 }}
                  />
                )}
                {(trendView === 'all' || trendView === 'Gryffindor') && (
                  <Line
                    type="monotone"
                    dataKey="Gryffindor"
                    stroke="#ef4444"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#ef4444' }}
                    activeDot={{ r: 6 }}
                  />
                )}
                {(trendView === 'all' || trendView === 'Hufflepuff') && (
                  <Line
                    type="monotone"
                    dataKey="Hufflepuff"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#f59e0b' }}
                    activeDot={{ r: 6 }}
                  />
                )}
                {(trendView === 'all' || trendView === 'Slytherin') && (
                  <Line
                    type="monotone"
                    dataKey="Slytherin"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#10b981' }}
                    activeDot={{ r: 6 }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>

          <p className="text-center font-mono text-[10px] uppercase tracking-widest text-parchment/50">
            Registro consolidado del último curso académico MIR • Actualizado diariamente
          </p>
        </div>

        {/* Clinical Family Distribution BarChart */}
        <div className="rounded-2xl border border-gold/25 bg-[#09111c]/95 p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-3 border-b border-gold/15 pb-4">
            <Activity className="text-gold" size={22} />
            <div>
              <h3 className="font-display text-xl font-bold text-parchment">
                Distribución por Familias Médicas
              </h3>
              <p className="font-mono text-xs text-parchment/60">
                Segmentación según el perfil formativo de especialidad
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {FAMILY_BREAKDOWN.map((fam) => (
              <div key={fam.family} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-parchment">{fam.family}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-parchment/70">{fam.count} médicos</span>
                    <strong className="font-mono text-gold">{fam.pct}%</strong>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${fam.pct}%`,
                      backgroundColor: fam.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-gold/15 bg-black/30 p-4 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gold">
              Conclusión Demográfica
            </span>
            <p className="text-xs text-parchment/80 leading-relaxed">
              El tronco de especialidades médicas (Medicina Interna, Cardiología, Neurología) concentra el 39.2% de las preferencias vocacionales, seguido por la resolución quirúrgica de precisión con un 25.5%.
            </p>
          </div>
        </div>
      </div>

      {/* Top 5 Most Requested Specialties Table */}
      <section className="rounded-2xl border border-gold/25 bg-[#09111c]/95 p-6 sm:p-8 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gold/15 pb-4">
          <div className="flex items-center gap-3">
            <Award className="text-gold" size={22} />
            <div>
              <h3 className="font-display text-xl font-bold text-parchment">
                Top 5 Especialidades Más Concurridas en el Censo
              </h3>
              <p className="font-mono text-xs text-parchment/60">
                Disciplinas con mayor índice de afinidad y demanda entre los aspirantes
              </p>
            </div>
          </div>
          <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-bold text-gold self-start sm:self-auto">
            MIR Oficial España
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-parchment">
            <thead className="border-b border-gold/10 font-mono text-[10px] uppercase text-parchment/60">
              <tr>
                <th className="pb-3">Posición & Especialidad</th>
                <th className="pb-3">Casa Afín</th>
                <th className="pb-3 text-right">Aspirantes Asignados</th>
                <th className="pb-3 text-right">Tasa de Afinidad</th>
                <th className="pb-3 text-right">Régimen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/5">
              {TOP_SPECIALTIES_CENSUS.map((item, idx) => {
                const house = HOUSE_STATS.find((h) => h.house === item.house);
                return (
                  <tr key={item.name} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 font-bold font-magic text-sm flex items-center gap-2.5">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/15 text-gold font-mono text-xs">
                        #{idx + 1}
                      </span>
                      <span className="text-[#f7eedc]">{item.name}</span>
                    </td>
                    <td className="py-3.5">
                      <span
                        className="rounded-full border px-2.5 py-0.5 text-[10px] font-bold"
                        style={{
                          borderColor: house?.color,
                          color: house?.color,
                          backgroundColor: `${house?.color}15`,
                        }}
                      >
                        Casa {item.house}
                      </span>
                    </td>
                    <td className="py-3.5 text-right font-mono font-bold text-parchment">
                      {item.count}
                    </td>
                    <td className="py-3.5 text-right font-mono text-emerald-400 font-bold">
                      {item.affinityRate}%
                    </td>
                    <td className="py-3.5 text-right font-mono text-parchment/70">
                      {item.type}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Institutional Audit Footer */}
      <footer className="rounded-xl border border-gold/15 bg-black/30 p-6 text-center space-y-2">
        <p className="text-xs leading-relaxed text-parchment/80 max-w-3xl mx-auto">
          Los datos del Censo son agregados anonimizados procedentes de los tests vocacionales completados en la plataforma. Las asignaciones a las Casas responden a los modelos de ponderación analítica A1-A10 y C1-C2 de la Academia y se actualizan de forma continua para reflejar las tendencias del mercado laboral y formativo MIR en España.
        </p>
      </footer>
    </div>
  );
};
