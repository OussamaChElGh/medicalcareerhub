import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Users,
  Play,
  CheckCircle,
  Share2,
  RefreshCw,
  Download,
  Trash2,
  Sparkles,
  AlertTriangle,
  HelpCircle,
  FileText,
  Smartphone,
  Laptop,
  Clock,
  Award,
  Shield,
  Layers,
  Settings,
  Flame,
  Check,
  ChevronRight,
  Calculator,
  Target,
  Search,
  Filter,
} from 'lucide-react';
import { TelemetryStats, FunnelStepMetrics } from '../lib/telemetryStorage';

interface V2BackofficeProps {
  onBack: () => void;
}

export function V2Backoffice({ onBack }: V2BackofficeProps) {
  const [stats, setStats] = useState<TelemetryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'all' | 'today' | '7d' | '30d'>('all');
  const [showSeedModal, setShowSeedModal] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Projection calculator state
  const [projectionVisits, setProjectionVisits] = useState(500);

  // Event table filters
  const [eventFilter, setEventFilter] = useState<'all' | 'page_view' | 'test_start' | 'test_complete' | 'retention_action'>('all');
  const [eventSearch, setEventSearch] = useState('');

  // Seed form values
  const [seedVisits, setSeedVisits] = useState(100);
  const [seedStarts, setSeedStarts] = useState(40);
  const [seedCompletions, setSeedCompletions] = useState(30);
  const [seedRetentions, setSeedRetentions] = useState(18);

  const fetchStats = async (selectedPeriod = period) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/telemetry/stats?period=${selectedPeriod}`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats(period);
  }, [period]);

  const handleApplySeed = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/telemetry/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visits: seedVisits,
          starts: seedStarts,
          completions: seedCompletions,
          retentions: seedRetentions,
        }),
      });
      if (res.ok) {
        setShowSeedModal(false);
        await fetchStats(period);
      }
    } catch (err) {
      console.error('Failed to apply seed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/telemetry/reset', { method: 'POST' });
      if (res.ok) {
        setShowResetConfirm(false);
        await fetchStats(period);
      }
    } catch (err) {
      console.error('Failed to reset:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = (format: 'csv' | 'json') => {
    window.location.assign(`/api/telemetry/export?format=${format}`);
  };

  // Projection calculations based on current funnel conversion rates
  const projection = useMemo(() => {
    if (!stats) return { starts: 0, completions: 0, retentions: 0, estRevenue: 0 };
    const step1 = stats.funnel.step1_visits.count || 1;
    const startRate = stats.funnel.step2_starts.count / step1;
    const completionRate =
      stats.funnel.step2_starts.count > 0
        ? stats.funnel.step3_completions.count / stats.funnel.step2_starts.count
        : 0;
    const retentionRate =
      stats.funnel.step3_completions.count > 0
        ? stats.funnel.step4_retention.count / stats.funnel.step3_completions.count
        : 0;

    const projectedStarts = Math.round(projectionVisits * startRate);
    const projectedCompletions = Math.round(projectedStarts * completionRate);
    const projectedRetentions = Math.round(projectedCompletions * retentionRate);
    const estRevenue = Math.round(projectedCompletions * 0.15 * 4.99); // 15% conversion to premium

    return {
      starts: projectedStarts,
      completions: projectedCompletions,
      retentions: projectedRetentions,
      estRevenue,
    };
  }, [stats, projectionVisits]);

  // Filtered recent events
  const filteredEvents = useMemo(() => {
    if (!stats?.recentEvents) return [];
    return stats.recentEvents.filter((ev) => {
      if (eventFilter !== 'all' && ev.type !== eventFilter) return false;
      if (eventSearch.trim()) {
        const query = eventSearch.toLowerCase();
        const matchVisitor = ev.visitorId.toLowerCase().includes(query);
        const matchSpec = ev.specialtyName?.toLowerCase().includes(query);
        const matchHouse = ev.house?.toLowerCase().includes(query);
        const matchAction = ev.actionDetail?.toLowerCase().includes(query);
        const matchPage = ev.page?.toLowerCase().includes(query);
        if (!matchVisitor && !matchSpec && !matchHouse && !matchAction && !matchPage) {
          return false;
        }
      }
      return true;
    });
  }, [stats?.recentEvents, eventFilter, eventSearch]);

  const getStepIcon = (step: number) => {
    switch (step) {
      case 1:
        return Users;
      case 2:
        return Play;
      case 3:
        return CheckCircle;
      case 4:
        return Share2;
      default:
        return Sparkles;
    }
  };

  const getStepBadgeColor = (step: number) => {
    switch (step) {
      case 1:
        return 'border-sky-500/40 bg-sky-950/40 text-sky-300';
      case 2:
        return 'border-amber-500/40 bg-amber-950/40 text-amber-300';
      case 3:
        return 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300';
      case 4:
        return 'border-purple-500/40 bg-purple-950/40 text-purple-300';
      default:
        return 'border-gold/40 bg-gold/10 text-gold';
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-10 px-4 py-8 sm:py-12 text-[#f4ead5]">
      {/* Top Bar Navigation */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-parchment/70 transition-colors hover:text-gold"
        >
          <ArrowLeft size={16} />
          Volver a la Academia
        </button>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Period selector */}
          <div className="flex rounded-xl border border-gold/25 bg-[#09111c] p-1 text-xs">
            {[
              { id: 'all', label: 'Todo' },
              { id: '30d', label: '30 días' },
              { id: '7d', label: '7 días' },
              { id: 'today', label: 'Hoy' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id as any)}
                className={`rounded-lg px-2.5 py-1 font-semibold transition-all ${
                  period === p.id
                    ? 'bg-gold text-bg-deep shadow-sm'
                    : 'text-parchment/70 hover:text-parchment'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => fetchStats(period)}
            disabled={loading}
            className="rounded-xl border border-gold/30 bg-gold/10 p-2 text-gold transition-all hover:bg-gold/20"
            title="Recargar datos"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>

          <button
            onClick={() => setShowSeedModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gold/40 bg-gold/15 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-gold hover:bg-gold/25"
            title="Simular escenario (ej: 100 visitas, 40 inicios, 30 completados)"
          >
            <Settings size={14} />
            <span>Simular Embudo</span>
          </button>

          <button
            onClick={() => handleExport('csv')}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-parchment/80 hover:border-gold hover:text-gold"
            title="Descargar eventos en CSV"
          >
            <Download size={14} />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* Header Banner */}
      <header className="relative overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-b from-[#0e1726]/95 via-[#09111c]/95 to-[#050a12]/95 p-6 sm:p-10 shadow-2xl backdrop-blur-md">
        <div className="pointer-events-none absolute -right-10 -top-10 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-emerald-300 font-bold">
                Motor de Telemetría y Analítica Activo
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-gold magic-shadow">
              Backoffice del Embudo Vocacional
            </h1>
            <p className="max-w-3xl font-classic text-base leading-relaxed text-[#ede1cc]">
              Panel de control del propietario para medir y auditar las 4 preguntas esenciales del viaje del usuario:
              atracción del mensaje, curiosidad inicial, comprensión de la experiencia y valor real obtenido.
            </p>
          </div>

          <div className="flex flex-col gap-2 rounded-xl border border-gold/20 bg-black/40 p-4 text-xs font-mono">
            <div className="flex justify-between gap-4">
              <span className="text-parchment/60">Visitantes únicos:</span>
              <strong className="text-gold">{stats?.uniqueVisitors ?? 0}</strong>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-parchment/60">Eventos registrados:</span>
              <strong className="text-parchment">{stats?.totalEvents ?? 0}</strong>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-parchment/60">Conversión Global:</span>
              <strong className="text-emerald-400">
                {stats?.funnel.step3_completions.conversionFromBase ?? 0}%
              </strong>
            </div>
          </div>
        </div>
      </header>

      {/* THE 4 FUNNEL MILESTONES (EXACT USER QUESTIONS) */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-parchment/70">
          <Layers size={15} className="text-gold" />
          <span className="font-bold">Embudo de Conversión de 4 Fases</span>
        </div>

        {stats && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              stats.funnel.step1_visits,
              stats.funnel.step2_starts,
              stats.funnel.step3_completions,
              stats.funnel.step4_retention,
            ].map((stepMetric, idx) => {
              const Icon = getStepIcon(stepMetric.step);
              const badgeStyle = getStepBadgeColor(stepMetric.step);

              return (
                <div
                  key={stepMetric.step}
                  className="relative flex flex-col justify-between rounded-2xl border border-gold/25 bg-gradient-to-b from-[#0a121e]/95 via-[#080e18]/95 to-[#050910]/95 p-5 shadow-xl space-y-4"
                >
                  <div className="space-y-3">
                    {/* Header with step number & icon */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${badgeStyle}`}
                      >
                        Paso {stepMetric.step}
                      </span>
                      <Icon size={18} className="text-gold/80" />
                    </div>

                    {/* Step Title & User Question */}
                    <div>
                      <h3 className="font-magic text-base font-bold text-parchment">
                        {stepMetric.name}
                      </h3>
                      <p className="font-classic italic text-xs text-gold-light mt-1">
                        "{stepMetric.questionPrompt}"
                      </p>
                    </div>

                    {/* Big Metric Number */}
                    <div className="border-t border-gold/10 pt-3 flex items-baseline justify-between">
                      <span className="font-display text-3xl font-bold text-gold">
                        {stepMetric.count.toLocaleString('es-ES')}
                      </span>
                      <span className="font-mono text-xs text-parchment/70">
                        {stepMetric.step === 1
                          ? '100% base'
                          : `${stepMetric.conversionFromPrev}% del paso anterior`}
                      </span>
                    </div>

                    {/* Progress Bar from base */}
                    <div className="space-y-1">
                      <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-gold/60 to-gold transition-all duration-700"
                          style={{ width: `${Math.min(100, stepMetric.conversionFromBase)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] font-mono text-parchment/60">
                        <span>Del total visitas:</span>
                        <strong className="text-gold">{stepMetric.conversionFromBase}%</strong>
                      </div>
                    </div>

                    {/* Drop-off / Fricción */}
                    {stepMetric.step > 1 && (
                      <div className="rounded-lg border border-red-500/20 bg-red-950/20 p-2 text-[11px] flex items-center justify-between">
                        <span className="text-red-300">Abandono en este paso:</span>
                        <strong className="font-mono text-red-200">
                          {stepMetric.dropoffCount} ({stepMetric.dropoffRate}%)
                        </strong>
                      </div>
                    )}
                  </div>

                  {/* Status explanation */}
                  <div className="border-t border-gold/10 pt-2 text-[11px] font-mono text-parchment/60">
                    {stepMetric.statusExplanation}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* DIAGNOSTIC ACTIONABLE INSIGHTS ENGINE */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-parchment/70">
          <Sparkles size={15} className="text-gold" />
          <span className="font-bold">Diagnóstico Automático de la Experiencia</span>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {stats?.actionableInsights.map((insight, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-gold/20 bg-[#09111c]/95 p-5 space-y-3 shadow-lg"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-gold-light">
                    {insight.stage}
                  </span>
                  <h4 className="font-magic text-base text-parchment font-bold">
                    {insight.question}
                  </h4>
                </div>
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase ${
                    insight.status === 'positive'
                      ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300'
                      : insight.status === 'warning'
                        ? 'border-red-500/40 bg-red-950/40 text-red-300'
                        : 'border-amber-500/40 bg-amber-950/40 text-amber-300'
                  }`}
                >
                  {insight.status === 'positive'
                    ? 'Óptimo'
                    : insight.status === 'warning'
                      ? 'Revisar'
                      : 'Estable'}
                </span>
              </div>

              <p className="text-xs text-[#ded4be] leading-relaxed">
                {insight.observation}
              </p>

              <div className="border-t border-gold/10 pt-2.5 space-y-1">
                <span className="text-[10px] uppercase font-mono font-bold text-gold flex items-center gap-1">
                  <TrendingUp size={12} />
                  Recomendación Accionable:
                </span>
                <p className="text-xs text-parchment/80 italic">
                  "{insight.recommendation}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CALCULADORA Y PROYECTOR DE ESCALAMIENTO */}
      <section className="rounded-2xl border border-gold/30 bg-gradient-to-b from-[#0e1726]/95 via-[#09111c]/95 to-[#050a12]/95 p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gold/15 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-gold font-bold">
              <Calculator size={15} className="text-gold" />
              <span>Simulador Proyectivo de Crecimiento</span>
            </div>
            <h3 className="font-magic text-xl text-parchment font-bold">
              Proyector de Escalamiento del Embudo
            </h3>
            <p className="font-classic text-xs text-[#ded4be]">
              Calcula el impacto en inicios, resoluciones vocacionales y viralidad según el volumen de visitas que atraigas.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-black/40 border border-gold/20 rounded-xl px-4 py-2">
            <label className="text-xs font-mono uppercase text-parchment/70">Visitas Objetivo:</label>
            <input
              type="number"
              min={10}
              max={100000}
              step={50}
              value={projectionVisits}
              onChange={(e) => setProjectionVisits(Math.max(1, Number(e.target.value)))}
              className="w-24 bg-transparent border-b border-gold text-right font-display text-lg font-bold text-gold focus:outline-none"
            />
          </div>
        </div>

        {/* Sliders and presets */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] uppercase text-parchment/60">Ajuste rápido:</span>
            {[100, 250, 500, 1000, 2500, 5000].map((val) => (
              <button
                key={val}
                onClick={() => setProjectionVisits(val)}
                className={`rounded-lg border px-2.5 py-1 font-mono transition-all cursor-pointer ${
                  projectionVisits === val
                    ? 'border-gold bg-gold text-bg-deep font-bold'
                    : 'border-white/10 bg-white/5 text-parchment/70 hover:border-gold/50 hover:text-gold'
                }`}
              >
                {val.toLocaleString('es-ES')}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] text-parchment/60">
            <span>Conversión global actual:</span>
            <strong className="text-emerald-400">
              {stats?.funnel.step3_completions.conversionFromBase ?? 0}%
            </strong>
          </div>
        </div>

        {/* 4 Projected Step Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-sky-500/30 bg-sky-950/20 p-4 space-y-2">
            <span className="text-[10px] font-mono uppercase text-sky-300 font-bold">1. Tráfico Atraído</span>
            <div className="font-display text-2xl font-bold text-sky-200">
              {projectionVisits.toLocaleString('es-ES')}
            </div>
            <p className="text-[11px] text-parchment/60">Aspirantes que llegan a la portada de la Academia.</p>
          </div>

          <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-2">
            <span className="text-[10px] font-mono uppercase text-amber-300 font-bold">2. Inicios Estimados</span>
            <div className="font-display text-2xl font-bold text-amber-200">
              {projection.starts.toLocaleString('es-ES')}
            </div>
            <p className="text-[11px] text-parchment/60">
              Tasa de curiosidad: {stats?.funnel.step2_starts.conversionFromPrev ?? 0}%
            </p>
          </div>

          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-2">
            <span className="text-[10px] font-mono uppercase text-emerald-300 font-bold">3. Tests Completados</span>
            <div className="font-display text-2xl font-bold text-emerald-200">
              {projection.completions.toLocaleString('es-ES')}
            </div>
            <p className="text-[11px] text-parchment/60">
              Retención en preguntas: {stats?.funnel.step3_completions.conversionFromPrev ?? 0}%
            </p>
          </div>

          <div className="rounded-xl border border-purple-500/30 bg-purple-950/20 p-4 space-y-2">
            <span className="text-[10px] font-mono uppercase text-purple-300 font-bold">4. Embajadores / Retorno</span>
            <div className="font-display text-2xl font-bold text-purple-200">
              {projection.retentions.toLocaleString('es-ES')}
            </div>
            <p className="text-[11px] text-parchment/60">
              Descargas de PDF, compartidos WhatsApp y decretos copiados.
            </p>
          </div>
        </div>
      </section>

      {/* METRIC DETAILS: RETENTION ACTIONS & MODES */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Retention / Value Action Breakdown */}
        <div className="rounded-2xl border border-gold/25 bg-[#09111c]/95 p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2.5 border-b border-gold/15 pb-3">
            <Award size={18} className="text-gold" />
            <h3 className="font-magic text-base font-bold text-parchment">
              Paso 4: Acciones de Valor Real
            </h3>
          </div>

          <div className="space-y-2.5 text-xs">
            {[
              {
                id: 'download_pdf',
                label: 'Descarga Informe Oficial PDF',
                count: stats?.retentionBreakdown.download_pdf ?? 0,
              },
              {
                id: 'dossier_download',
                label: 'Descarga Dossier Metodológico',
                count: stats?.retentionBreakdown.dossier_download ?? 0,
              },
              {
                id: 'share_whatsapp',
                label: 'Compartido por WhatsApp',
                count: stats?.retentionBreakdown.share_whatsapp ?? 0,
              },
              {
                id: 'copy_decree',
                label: 'Copia del Decreto Vocacional',
                count: stats?.retentionBreakdown.copy_decree ?? 0,
              },
              {
                id: 'return_visit',
                label: 'Visitas Recurrentes / Retornos',
                count: stats?.retentionBreakdown.return_visit ?? 0,
              },
              {
                id: 'share_twitter',
                label: 'Compartido en Redes Sociales',
                count: stats?.retentionBreakdown.share_twitter ?? 0,
              },
            ].map((action) => (
              <div
                key={action.id}
                className="flex items-center justify-between border-b border-white/5 pb-2 last:border-none"
              >
                <span className="text-parchment/80">{action.label}</span>
                <strong className="font-mono text-gold">{action.count}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Test Modes Comparison */}
        <div className="rounded-2xl border border-gold/25 bg-[#09111c]/95 p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2.5 border-b border-gold/15 pb-3">
            <Play size={18} className="text-medical-teal" />
            <h3 className="font-magic text-base font-bold text-parchment">
              Modalidades: Gratuito vs Premium
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            <div className="rounded-xl border border-gold/15 bg-black/30 p-3 space-y-2">
              <div className="flex justify-between">
                <span className="font-bold text-parchment">Test Gratuito Express:</span>
                <span className="font-mono text-gold">
                  {stats?.modes.freeCompletions} / {stats?.modes.freeStarts}
                </span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-medical-teal rounded-full"
                  style={{
                    width: `${
                      (stats?.modes.freeStarts ?? 0) > 0
                        ? ((stats?.modes.freeCompletions ?? 0) / (stats?.modes.freeStarts ?? 1)) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
              <p className="text-[10px] text-parchment/60">
                14 preguntas rápidas para el veredicto del Sombrero
              </p>
            </div>

            <div className="rounded-xl border border-gold/15 bg-black/30 p-3 space-y-2">
              <div className="flex justify-between">
                <span className="font-bold text-parchment">Dossier Monográfico Premium:</span>
                <span className="font-mono text-gold">
                  {stats?.modes.extensiveCompletions} / {stats?.modes.extensiveStarts}
                </span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold rounded-full"
                  style={{
                    width: `${
                      (stats?.modes.extensiveStarts ?? 0) > 0
                        ? ((stats?.modes.extensiveCompletions ?? 0) /
                            (stats?.modes.extensiveStarts ?? 1)) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>
              <p className="text-[10px] text-parchment/60">
                40-44 preguntas con informe pericial descargable
              </p>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-parchment/60 pt-1">
              <span>Duración media de test:</span>
              <strong className="text-parchment">
                {Math.floor((stats?.averageCompletionSeconds ?? 150) / 60)}m{' '}
                {(stats?.averageCompletionSeconds ?? 150) % 60}s
              </strong>
            </div>
          </div>
        </div>

        {/* Devices & House distribution */}
        <div className="rounded-2xl border border-gold/25 bg-[#09111c]/95 p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2.5 border-b border-gold/15 pb-3">
            <Smartphone size={18} className="text-sky-400" />
            <h3 className="font-magic text-base font-bold text-parchment">
              Dispositivos y Arquetipos
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-parchment/80">
              <span className="flex items-center gap-1.5">
                <Smartphone size={14} /> Móvil:
              </span>
              <strong className="font-mono text-gold">{stats?.devices.mobile ?? 0} eventos</strong>
            </div>
            <div className="flex justify-between text-parchment/80">
              <span className="flex items-center gap-1.5">
                <Laptop size={14} /> Escritorio:
              </span>
              <strong className="font-mono text-gold">{stats?.devices.desktop ?? 0} eventos</strong>
            </div>

            <div className="border-t border-gold/10 pt-3 space-y-2">
              <span className="text-[10px] uppercase font-mono font-bold text-parchment/60 block">
                Distribución de Casas en Test Reales:
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="rounded border border-sky-500/20 bg-sky-950/20 p-1.5">
                  <span className="text-sky-300 block">Ravenclaw</span>
                  <strong className="font-mono">{stats?.houseDistribution.Ravenclaw ?? 0}</strong>
                </div>
                <div className="rounded border border-rose-500/20 bg-rose-950/20 p-1.5">
                  <span className="text-rose-300 block">Gryffindor</span>
                  <strong className="font-mono">{stats?.houseDistribution.Gryffindor ?? 0}</strong>
                </div>
                <div className="rounded border border-emerald-500/20 bg-emerald-950/20 p-1.5">
                  <span className="text-emerald-300 block">Slytherin</span>
                  <strong className="font-mono">{stats?.houseDistribution.Slytherin ?? 0}</strong>
                </div>
                <div className="rounded border border-amber-500/20 bg-amber-950/20 p-1.5">
                  <span className="text-amber-300 block">Hufflepuff</span>
                  <strong className="font-mono">{stats?.houseDistribution.Hufflepuff ?? 0}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE EVENT LOG (FEED EN TIEMPO REAL) */}
      <section className="rounded-2xl border border-gold/25 bg-[#09111c]/95 p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gold/15 pb-4">
          <div className="flex items-center gap-2.5">
            <Clock size={18} className="text-gold" />
            <div>
              <h3 className="font-magic text-lg font-bold text-parchment">
                Registro de Eventos en Tiempo Real
              </h3>
              <p className="font-mono text-xs text-parchment/60">
                Últimos eventos registrados en el servidor
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowResetConfirm(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-950/30 px-3 py-1 text-xs text-red-300 hover:bg-red-900/40 cursor-pointer"
            >
              <Trash2 size={13} />
              <span>Limpiar Historial</span>
            </button>
          </div>
        </div>

        {/* Table Filter Pills & Search Input */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'page_view', label: '1. Visitas' },
              { id: 'test_start', label: '2. Inicios' },
              { id: 'test_complete', label: '3. Completados' },
              { id: 'retention_action', label: '4. Valor Real' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setEventFilter(f.id as any)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-mono transition-all cursor-pointer ${
                  eventFilter === f.id
                    ? 'bg-gold text-bg-deep font-bold shadow-sm'
                    : 'bg-white/5 text-parchment/70 hover:text-parchment hover:bg-white/10'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="relative min-w-[220px]">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-parchment/40" />
            <input
              type="text"
              placeholder="Buscar visitante, especialidad..."
              value={eventSearch}
              onChange={(e) => setEventSearch(e.target.value)}
              className="w-full rounded-lg border border-gold/20 bg-black/40 pl-8 pr-3 py-1.5 text-xs text-parchment placeholder-parchment/40 focus:border-gold focus:outline-none font-mono"
            />
          </div>
        </div>

        <div className="overflow-x-auto max-h-[380px] custom-scrollbar">
          <table className="w-full text-left text-xs text-parchment">
            <thead className="border-b border-gold/10 font-mono text-[10px] uppercase text-parchment/60 sticky top-0 bg-[#09111c]">
              <tr>
                <th className="pb-2.5">Hora</th>
                <th className="pb-2.5">Fase del Embudo</th>
                <th className="pb-2.5">Visitante</th>
                <th className="pb-2.5">Detalles / Especialidad</th>
                <th className="pb-2.5 text-right">Dispositivo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/5 font-mono">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-parchment/40 font-mono italic">
                    No se encontraron eventos con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((ev) => {
                let badge = 'text-parchment border-white/20 bg-white/5';
                let label = ev.type;

                if (ev.type === 'page_view') {
                  badge = 'text-sky-300 border-sky-500/30 bg-sky-950/30';
                  label = '1. Visita Página';
                } else if (ev.type === 'test_start') {
                  badge = 'text-amber-300 border-amber-500/30 bg-amber-950/30';
                  label = '2. Inicio Test';
                } else if (ev.type === 'test_complete') {
                  badge = 'text-emerald-300 border-emerald-500/30 bg-emerald-950/30';
                  label = '3. Test Completado';
                } else if (ev.type === 'retention_action') {
                  badge = 'text-purple-300 border-purple-500/30 bg-purple-950/30';
                  label = '4. Valor Real / Retorno';
                }

                return (
                  <tr key={ev.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-2.5 text-parchment/60">
                      {new Date(ev.timestamp).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>
                    <td className="py-2.5">
                      <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold ${badge}`}>
                        {label}
                      </span>
                    </td>
                    <td className="py-2.5 text-parchment/70">{ev.visitorId}</td>
                    <td className="py-2.5">
                      {ev.specialtyName ? (
                        <span className="text-gold font-bold">{ev.specialtyName} ({ev.house})</span>
                      ) : ev.actionDetail ? (
                        <span className="text-purple-200">{ev.actionDetail}</span>
                      ) : ev.page ? (
                        <span className="text-parchment/70">{ev.page}</span>
                      ) : ev.mode ? (
                        <span className="text-parchment/70">Modo: {ev.mode}</span>
                      ) : (
                        <span className="text-parchment/40">—</span>
                      )}
                    </td>
                    <td className="py-2.5 text-right text-parchment/60">{ev.device || 'desktop'}</td>
                  </tr>
                );
              }))}
            </tbody>
          </table>
        </div>
      </section>

      {/* SEED MODAL */}
      <AnimatePresence>
        {showSeedModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg rounded-2xl border border-gold/40 bg-gradient-to-b from-[#0c1524] to-[#070c14] p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-gold/20 pb-3">
                <div className="flex items-center gap-2">
                  <Settings size={20} className="text-gold" />
                  <h3 className="font-magic text-xl text-gold">Simulador de Embudo</h3>
                </div>
                <button
                  onClick={() => setShowSeedModal(false)}
                  className="text-parchment/50 hover:text-parchment"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-parchment/80 leading-relaxed">
                Introduce los valores que deseas probar en el embudo (por ejemplo, el escenario solicitado:
                100 visitas, 40 inicios, 30 completados y 18 retornos/acciones de valor):
              </p>

              {/* Presets rápidos */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-parchment/60">
                  Escenarios predefinidos de simulación:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <button
                    type="button"
                    onClick={() => {
                      setSeedVisits(100);
                      setSeedStarts(40);
                      setSeedCompletions(30);
                      setSeedRetentions(18);
                    }}
                    className="flex flex-col items-start rounded-lg border border-gold/40 bg-gold/10 p-2.5 text-left hover:bg-gold/20 transition-all text-gold cursor-pointer"
                  >
                    <span className="font-bold">🎯 Escenario Base Solicitado (100)</span>
                    <span className="text-[10px] text-parchment/70">100 visitas · 40 inicios · 30 completados · 18 retornos</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSeedVisits(500);
                      setSeedStarts(220);
                      setSeedCompletions(165);
                      setSeedRetentions(95);
                    }}
                    className="flex flex-col items-start rounded-lg border border-sky-500/40 bg-sky-950/30 p-2.5 text-left hover:bg-sky-900/40 transition-all text-sky-200 cursor-pointer"
                  >
                    <span className="font-bold">🚀 Campaña MIR (500)</span>
                    <span className="text-[10px] text-parchment/70">500 visitas · 220 inicios · 165 completados · 95 retornos</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSeedVisits(1000);
                      setSeedStarts(480);
                      setSeedCompletions(390);
                      setSeedRetentions(240);
                    }}
                    className="flex flex-col items-start rounded-lg border border-emerald-500/40 bg-emerald-950/30 p-2.5 text-left hover:bg-emerald-900/40 transition-all text-emerald-200 cursor-pointer"
                  >
                    <span className="font-bold">⚡ Viral Universitario (1.000)</span>
                    <span className="text-[10px] text-parchment/70">1.000 visitas · 480 inicios · 390 completados · 240 retornos</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSeedVisits(250);
                      setSeedStarts(65);
                      setSeedCompletions(42);
                      setSeedRetentions(15);
                    }}
                    className="flex flex-col items-start rounded-lg border border-amber-500/40 bg-amber-950/30 p-2.5 text-left hover:bg-amber-900/40 transition-all text-amber-200 cursor-pointer"
                  >
                    <span className="font-bold">🔍 Tráfico Inicial Orgánico (250)</span>
                    <span className="text-[10px] text-parchment/70">250 visitas · 65 inicios · 42 completados · 15 retornos</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-parchment/70">
                    Paso 1: Visitas (Atracción)
                  </label>
                  <input
                    type="number"
                    value={seedVisits}
                    onChange={(e) => setSeedVisits(Number(e.target.value))}
                    className="w-full rounded-lg border border-gold/30 bg-[#04080e] p-2.5 text-parchment font-mono focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-parchment/70">
                    Paso 2: Inicios (Curiosidad)
                  </label>
                  <input
                    type="number"
                    value={seedStarts}
                    onChange={(e) => setSeedStarts(Number(e.target.value))}
                    className="w-full rounded-lg border border-gold/30 bg-[#04080e] p-2.5 text-parchment font-mono focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-parchment/70">
                    Paso 3: Completados (Comprensión)
                  </label>
                  <input
                    type="number"
                    value={seedCompletions}
                    onChange={(e) => setSeedCompletions(Number(e.target.value))}
                    className="w-full rounded-lg border border-gold/30 bg-[#04080e] p-2.5 text-parchment font-mono focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-parchment/70">
                    Paso 4: Retorno / Compartir (Valor)
                  </label>
                  <input
                    type="number"
                    value={seedRetentions}
                    onChange={(e) => setSeedRetentions(Number(e.target.value))}
                    className="w-full rounded-lg border border-gold/30 bg-[#04080e] p-2.5 text-parchment font-mono focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-gold/20 pt-4">
                <button
                  type="button"
                  onClick={() => setShowSeedModal(false)}
                  className="rounded-xl border border-white/10 px-4 py-2 text-xs text-parchment/70 hover:text-parchment"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleApplySeed}
                  className="rounded-xl border border-gold bg-gold px-5 py-2 text-xs font-bold uppercase text-bg-deep hover:bg-gold-light"
                >
                  Aplicar Simulación
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* RESET CONFIRM MODAL */}
      <AnimatePresence>
        {showResetConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm rounded-2xl border border-red-500/40 bg-[#0c1524] p-6 shadow-2xl space-y-4 text-center"
            >
              <AlertTriangle className="mx-auto text-red-400" size={32} />
              <h3 className="font-magic text-lg text-parchment font-bold">
                ¿Limpiar todo el historial?
              </h3>
              <p className="text-xs text-parchment/70">
                Se eliminarán todos los eventos registrados hasta el momento. Podrás volver a sembrar datos de simulación en cualquier momento.
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="rounded-xl border border-white/10 px-4 py-2 text-xs text-parchment/70 hover:text-parchment"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleReset}
                  className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold uppercase text-white hover:bg-red-500"
                >
                  Sí, eliminar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
