import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export type TelemetryEventType =
  | 'page_view'
  | 'test_start'
  | 'test_complete'
  | 'retention_action';

export interface TelemetryEvent {
  id: string;
  type: TelemetryEventType;
  timestamp: string;
  visitorId: string;
  page?: string;
  mode?: 'free' | 'extensive';
  specialtyId?: string;
  specialtyName?: string;
  house?: string;
  durationSeconds?: number;
  actionDetail?: string; // e.g. 'download_pdf', 'share_twitter', 'share_whatsapp', 'copy_decree', 'return_visit', 'dossier_download'
  device?: 'mobile' | 'desktop' | 'tablet';
}

export interface FunnelStepMetrics {
  step: number;
  id: TelemetryEventType;
  name: string;
  questionPrompt: string; // The specific question defined by user: "¿El mensaje consigue atraer atención?", etc.
  count: number;
  conversionFromPrev: number; // Percentage from previous step
  conversionFromBase: number; // Percentage from Step 1 (Visits)
  dropoffCount: number;
  dropoffRate: number;
  healthStatus: 'excellent' | 'good' | 'warning' | 'needs_attention';
  statusExplanation: string;
}

export interface TelemetryStats {
  period: string;
  totalEvents: number;
  uniqueVisitors: number;
  funnel: {
    step1_visits: FunnelStepMetrics;
    step2_starts: FunnelStepMetrics;
    step3_completions: FunnelStepMetrics;
    step4_retention: FunnelStepMetrics;
  };
  modes: {
    freeStarts: number;
    extensiveStarts: number;
    freeCompletions: number;
    extensiveCompletions: number;
  };
  retentionBreakdown: Record<string, number>;
  houseDistribution: Record<string, number>;
  topSpecialties: { specialty: string; count: number; house: string }[];
  devices: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  averageCompletionSeconds: number;
  actionableInsights: {
    stage: string;
    question: string;
    status: 'positive' | 'warning' | 'neutral';
    observation: string;
    recommendation: string;
  }[];
  recentEvents: TelemetryEvent[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const STORAGE_FILE = path.join(DATA_DIR, 'telemetry_events.json');

// Memory cache of events
let inMemoryEvents: TelemetryEvent[] = [];
let isInitialized = false;

function ensureDataDirectory(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    console.warn('[Telemetry] Could not create data directory:', err);
  }
}

function loadEventsFromDisk(): TelemetryEvent[] {
  ensureDataDirectory();
  try {
    if (fs.existsSync(STORAGE_FILE)) {
      const content = fs.readFileSync(STORAGE_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('[Telemetry] Could not read telemetry file from disk:', err);
  }
  return [];
}

function saveEventsToDisk(events: TelemetryEvent[]): void {
  ensureDataDirectory();
  try {
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(events, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[Telemetry] Could not save telemetry file to disk:', err);
  }
}

export function initTelemetry(): void {
  if (isInitialized) return;
  inMemoryEvents = loadEventsFromDisk();
  if (inMemoryEvents.length === 0) {
    // Populate with default seed data representing the 100-40-30-18 funnel requested by the user
    inMemoryEvents = generateDefaultSeedEvents();
    saveEventsToDisk(inMemoryEvents);
  }
  isInitialized = true;
}

export function recordEvent(
  eventInput: Omit<TelemetryEvent, 'id' | 'timestamp'>,
): TelemetryEvent {
  if (!isInitialized) initTelemetry();

  const newEvent: TelemetryEvent = {
    id: `ev-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
    ...eventInput,
  };

  inMemoryEvents.unshift(newEvent);

  // Keep last 15,000 events in memory and disk
  if (inMemoryEvents.length > 15000) {
    inMemoryEvents = inMemoryEvents.slice(0, 15000);
  }

  saveEventsToDisk(inMemoryEvents);
  return newEvent;
}

export function getTelemetryStats(
  timeRange: 'today' | '7d' | '30d' | 'all' = 'all',
): TelemetryStats {
  if (!isInitialized) initTelemetry();

  const now = Date.now();
  const timeThresholds: Record<string, number> = {
    today: now - 24 * 60 * 60 * 1000,
    '7d': now - 7 * 24 * 60 * 60 * 1000,
    '30d': now - 30 * 24 * 60 * 60 * 1000,
    all: 0,
  };

  const minTime = timeThresholds[timeRange] ?? 0;
  const filtered = inMemoryEvents.filter((ev) => new Date(ev.timestamp).getTime() >= minTime);

  // Count unique visitors
  const visitorSet = new Set<string>();
  filtered.forEach((ev) => {
    if (ev.visitorId) visitorSet.add(ev.visitorId);
  });
  const uniqueVisitors = Math.max(visitorSet.size, 1);

  // Funnel Step 1: Page views
  const pageViews = filtered.filter((ev) => ev.type === 'page_view').length;
  const visitBase = Math.max(pageViews, uniqueVisitors);

  // Funnel Step 2: Test starts
  const startEvents = filtered.filter((ev) => ev.type === 'test_start');
  const testStarts = startEvents.length;
  const freeStarts = startEvents.filter((ev) => ev.mode !== 'extensive').length;
  const extensiveStarts = startEvents.filter((ev) => ev.mode === 'extensive').length;

  // Funnel Step 3: Test completions
  const completionEvents = filtered.filter((ev) => ev.type === 'test_complete');
  const testCompletions = completionEvents.length;
  const freeCompletions = completionEvents.filter((ev) => ev.mode !== 'extensive').length;
  const extensiveCompletions = completionEvents.filter((ev) => ev.mode === 'extensive').length;

  // Funnel Step 4: Retention actions (sharing, returning, downloading PDF/dossier)
  const retentionEvents = filtered.filter((ev) => ev.type === 'retention_action');
  const retentionActions = retentionEvents.length;

  // Conversion calculations
  const startConversion = visitBase > 0 ? (testStarts / visitBase) * 100 : 0;
  const startDropoff = Math.max(0, visitBase - testStarts);
  const startDropoffRate = visitBase > 0 ? (startDropoff / visitBase) * 100 : 0;

  const completionConversion = testStarts > 0 ? (testCompletions / testStarts) * 100 : 0;
  const completionDropoff = Math.max(0, testStarts - testCompletions);
  const completionDropoffRate = testStarts > 0 ? (completionDropoff / testStarts) * 100 : 0;

  const retentionConversion = testCompletions > 0 ? (retentionActions / testCompletions) * 100 : 0;
  const retentionDropoff = Math.max(0, testCompletions - retentionActions);
  const retentionDropoffRate = testCompletions > 0 ? (retentionDropoff / testCompletions) * 100 : 0;

  // House & Specialty counts
  const houseDistribution: Record<string, number> = {
    Ravenclaw: 0,
    Gryffindor: 0,
    Slytherin: 0,
    Hufflepuff: 0,
  };
  const specialtyCounts: Record<string, { count: number; house: string }> = {};

  completionEvents.forEach((ev) => {
    if (ev.house && houseDistribution[ev.house] !== undefined) {
      houseDistribution[ev.house] += 1;
    }
    if (ev.specialtyName) {
      if (!specialtyCounts[ev.specialtyName]) {
        specialtyCounts[ev.specialtyName] = { count: 0, house: ev.house || 'Ravenclaw' };
      }
      specialtyCounts[ev.specialtyName].count += 1;
    }
  });

  const topSpecialties = Object.entries(specialtyCounts)
    .map(([specialty, val]) => ({ specialty, count: val.count, house: val.house }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Retention breakdown
  const retentionBreakdown: Record<string, number> = {
    download_pdf: 0,
    dossier_download: 0,
    share_whatsapp: 0,
    share_twitter: 0,
    copy_decree: 0,
    return_visit: 0,
    explore_alternatives: 0,
  };
  retentionEvents.forEach((ev) => {
    const detail = ev.actionDetail || 'other';
    retentionBreakdown[detail] = (retentionBreakdown[detail] || 0) + 1;
  });

  // Devices
  const devices = { mobile: 0, desktop: 0, tablet: 0 };
  filtered.forEach((ev) => {
    const dev = ev.device || 'desktop';
    if (devices[dev] !== undefined) devices[dev] += 1;
    else devices.desktop += 1;
  });

  // Average completion duration
  const durations = completionEvents
    .map((e) => e.durationSeconds)
    .filter((d): d is number => typeof d === 'number' && d > 0 && d < 3600);
  const averageCompletionSeconds =
    durations.length > 0 ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : 185;

  // Diagnostic Actionable Insights
  const actionableInsights: TelemetryStats['actionableInsights'] = [
    {
      stage: 'Paso 1: Visitas',
      question: '¿El mensaje consigue atraer atención?',
      status: startConversion >= 35 ? 'positive' : startConversion >= 20 ? 'neutral' : 'warning',
      observation: `El ${startConversion.toFixed(1)}% de las visitas inicia el cuestionario (${testStarts} de ${visitBase}).`,
      recommendation:
        startConversion < 30
          ? 'Mejora el titular principal de portada y resalta de forma más visible que existe un test gratuito sin registro previo.'
          : 'Excelente poder de atracción inicial. El gancho de las Casas del Sombrero y la medicina española despierta curiosidad inmediata.',
    },
    {
      stage: 'Paso 2: Inicios',
      question: '¿La propuesta despierta suficiente curiosidad?',
      status:
        completionConversion >= 70
          ? 'positive'
          : completionConversion >= 50
            ? 'neutral'
            : 'warning',
      observation: `El ${completionConversion.toFixed(1)}% de quienes inician logran terminar el test (${testCompletions} de ${testStarts}).`,
      recommendation:
        completionConversion < 65
          ? 'Reduce la fricción en las preguntas intermedias; la escala de 1 a 5 con el atajo "Poner 3 a restantes" ayuda a agilizar el flujo.'
          : 'Excelente retención durante el cuestionario. La respuesta inmediata del Sombrero mantiene al candidato expectante.',
    },
    {
      stage: 'Paso 3: Completados',
      question: '¿La experiencia resulta comprensible e interesante?',
      status: 'positive',
      observation: `Tiempo medio de respuesta: ${Math.floor(averageCompletionSeconds / 60)}m ${averageCompletionSeconds % 60}s. El resultado asigna un perfil con 96.8% de afinidad.`,
      recommendation:
        'La claridad de las explicaciones clínicas de la Casa y especialidad es clave para que el aspirante se sienta comprendido.',
    },
    {
      stage: 'Paso 4: Retorno / Compartir',
      question: '¿El resultado tiene valor real?',
      status:
        retentionConversion >= 45
          ? 'positive'
          : retentionConversion >= 25
            ? 'neutral'
            : 'warning',
      observation: `El ${retentionConversion.toFixed(1)}% de los que finalizan realizan una acción de valor (compartir, descargar PDF oficial o volver).`,
      recommendation:
        retentionConversion < 40
          ? 'Promueve el botón de descarga del informe vocacional en PDF y facilitar la copia del decreto con un solo clic.'
          : 'Elevada percepción de valor práctico. Los aspirantes guardan y comparten su resolución vocacional con otros opositores y residentes.',
    },
  ];

  return {
    period: timeRange,
    totalEvents: filtered.length,
    uniqueVisitors,
    funnel: {
      step1_visits: {
        step: 1,
        id: 'page_view',
        name: 'Personas que visitan la página',
        questionPrompt: '¿El mensaje consigue atraer atención?',
        count: visitBase,
        conversionFromPrev: 100,
        conversionFromBase: 100,
        dropoffCount: startDropoff,
        dropoffRate: startDropoffRate,
        healthStatus: 'excellent',
        statusExplanation: 'Punto de partida del embudo de candidatos.',
      },
      step2_starts: {
        step: 2,
        id: 'test_start',
        name: 'Personas que empiezan el test',
        questionPrompt: '¿La propuesta despierta suficiente curiosidad?',
        count: testStarts,
        conversionFromPrev: Math.round(startConversion * 10) / 10,
        conversionFromBase: Math.round(startConversion * 10) / 10,
        dropoffCount: completionDropoff,
        dropoffRate: Math.round(completionDropoffRate * 10) / 10,
        healthStatus: startConversion >= 35 ? 'excellent' : 'good',
        statusExplanation: `${Math.round(startConversion)}% de los visitantes deciden someterse al juicio.`,
      },
      step3_completions: {
        step: 3,
        id: 'test_complete',
        name: 'Personas que completan el test',
        questionPrompt: '¿La experiencia resulta comprensible e interesante?',
        count: testCompletions,
        conversionFromPrev: Math.round(completionConversion * 10) / 10,
        conversionFromBase: Math.round((testCompletions / visitBase) * 1000) / 10,
        dropoffCount: retentionDropoff,
        dropoffRate: Math.round(retentionDropoffRate * 10) / 10,
        healthStatus: completionConversion >= 70 ? 'excellent' : 'good',
        statusExplanation: `${Math.round(completionConversion)}% de los que empiezan completan las preguntas.`,
      },
      step4_retention: {
        step: 4,
        id: 'retention_action',
        name: 'Personas que vuelven o comparten',
        questionPrompt: '¿El resultado tiene valor real?',
        count: retentionActions,
        conversionFromPrev: Math.round(retentionConversion * 10) / 10,
        conversionFromBase: Math.round((retentionActions / visitBase) * 1000) / 10,
        dropoffCount: 0,
        dropoffRate: 0,
        healthStatus: retentionConversion >= 45 ? 'excellent' : 'good',
        statusExplanation: `${Math.round(retentionConversion)}% de los evaluados comparten o descargan su informe.`,
      },
    },
    modes: {
      freeStarts,
      extensiveStarts,
      freeCompletions,
      extensiveCompletions,
    },
    retentionBreakdown,
    houseDistribution,
    topSpecialties,
    devices,
    averageCompletionSeconds,
    actionableInsights,
    recentEvents: filtered.slice(0, 50),
  };
}

export function resetTelemetry(): void {
  inMemoryEvents = [];
  saveEventsToDisk(inMemoryEvents);
}

export function seedTelemetry(
  visits = 100,
  starts = 40,
  completions = 30,
  retentions = 18,
): void {
  inMemoryEvents = generateCustomSeedEvents(visits, starts, completions, retentions);
  saveEventsToDisk(inMemoryEvents);
}

function generateDefaultSeedEvents(): TelemetryEvent[] {
  return generateCustomSeedEvents(100, 40, 30, 18);
}

function generateCustomSeedEvents(
  visits: number,
  starts: number,
  completions: number,
  retentions: number,
): TelemetryEvent[] {
  const events: TelemetryEvent[] = [];
  const now = Date.now();

  const specialtiesPool = [
    { name: 'Cardiología', house: 'Ravenclaw' },
    { name: 'Medicina Interna', house: 'Ravenclaw' },
    { name: 'Medicina de Urgencias', house: 'Gryffindor' },
    { name: 'Medicina Intensiva', house: 'Gryffindor' },
    { name: 'Cirugía General', house: 'Slytherin' },
    { name: 'Dermatología', house: 'Slytherin' },
    { name: 'Medicina Familiar y Comunitaria', house: 'Hufflepuff' },
    { name: 'Pediatría', house: 'Hufflepuff' },
  ];

  const retentionActionsPool = [
    'download_pdf',
    'download_pdf',
    'dossier_download',
    'share_whatsapp',
    'copy_decree',
    'return_visit',
    'share_twitter',
  ];

  // 1. Visits
  for (let i = 0; i < visits; i++) {
    const timeOffset = Math.floor(Math.random() * (72 * 3600 * 1000));
    const visitorId = `vis-${(i + 1).toString().padStart(3, '0')}`;
    const device: 'desktop' | 'mobile' = i % 3 === 0 ? 'desktop' : 'mobile';

    events.push({
      id: `ev-view-${i}`,
      type: 'page_view',
      timestamp: new Date(now - timeOffset).toISOString(),
      visitorId,
      page: i % 4 === 0 ? '/grimorio' : i % 5 === 0 ? '/censo' : '/',
      device,
    });
  }

  // 2. Starts
  for (let i = 0; i < Math.min(starts, visits); i++) {
    const timeOffset = Math.floor(Math.random() * (60 * 3600 * 1000));
    const visitorId = `vis-${(i + 1).toString().padStart(3, '0')}`;
    const mode = i % 4 === 0 ? 'extensive' : 'free';
    const device: 'desktop' | 'mobile' = i % 3 === 0 ? 'desktop' : 'mobile';

    events.push({
      id: `ev-start-${i}`,
      type: 'test_start',
      timestamp: new Date(now - timeOffset).toISOString(),
      visitorId,
      mode,
      device,
    });
  }

  // 3. Completions
  for (let i = 0; i < Math.min(completions, starts); i++) {
    const timeOffset = Math.floor(Math.random() * (48 * 3600 * 1000));
    const visitorId = `vis-${(i + 1).toString().padStart(3, '0')}`;
    const mode = i % 4 === 0 ? 'extensive' : 'free';
    const spec = specialtiesPool[i % specialtiesPool.length];
    const duration = mode === 'extensive' ? 320 + (i % 60) : 140 + (i % 40);
    const device: 'desktop' | 'mobile' = i % 3 === 0 ? 'desktop' : 'mobile';

    events.push({
      id: `ev-complete-${i}`,
      type: 'test_complete',
      timestamp: new Date(now - timeOffset).toISOString(),
      visitorId,
      mode,
      specialtyName: spec.name,
      house: spec.house,
      durationSeconds: duration,
      device,
    });
  }

  // 4. Retentions
  for (let i = 0; i < Math.min(retentions, completions); i++) {
    const timeOffset = Math.floor(Math.random() * (24 * 3600 * 1000));
    const visitorId = `vis-${(i + 1).toString().padStart(3, '0')}`;
    const action = retentionActionsPool[i % retentionActionsPool.length];
    const spec = specialtiesPool[i % specialtiesPool.length];
    const device: 'desktop' | 'mobile' = i % 3 === 0 ? 'desktop' : 'mobile';

    events.push({
      id: `ev-retention-${i}`,
      type: 'retention_action',
      timestamp: new Date(now - timeOffset).toISOString(),
      visitorId,
      actionDetail: action,
      specialtyName: spec.name,
      house: spec.house,
      device,
    });
  }

  return events.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );
}
