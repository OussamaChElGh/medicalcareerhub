import { AnswerRecord, QuizResult } from '../types';

export interface PilotSession {
  id: string;
  createdAt: string;
  mode: 'free' | 'extensive';
  durationMs: number;
  answers: AnswerRecord[];
  profile: QuizResult['profile'];
  matches: {
    id: string;
    name: string;
    score: number;
    band: string;
  }[];
  confidence: QuizResult['confidence'];
  versions: QuizResult['versions'];
}

const STORAGE_KEY = 'arcanum_pilot_sessions_v1';
const MAX_SESSIONS = 500;

function hasStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function createId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `session-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function loadPilotSessions(): PilotSession[] {
  if (!hasStorage()) return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as PilotSession[]) : [];
  } catch {
    return [];
  }
}

export function savePilotSession(session: PilotSession): void {
  if (!hasStorage()) return;

  try {
    const sessions = loadPilotSessions();
    sessions.push(session);

    if (sessions.length > MAX_SESSIONS) {
      sessions.splice(0, sessions.length - MAX_SESSIONS);
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.warn('No se pudo guardar la sesión del piloto:', error);
  }
}

export function clearPilotSessions(): void {
  if (!hasStorage()) return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function createPilotSession(
  result: QuizResult,
  answers: AnswerRecord[],
  mode: PilotSession['mode'],
  durationMs: number,
): PilotSession {
  return {
    id: createId(),
    createdAt: new Date().toISOString(),
    mode,
    durationMs: Math.max(0, Math.round(durationMs)),
    answers,
    profile: result.profile,
    matches: result.matches.map((match) => ({
      id: match.specialty.id,
      name: match.specialty.name,
      score: match.score,
      band: match.band,
    })),
    confidence: result.confidence,
    versions: result.versions,
  };
}

export function pilotSessionsToJson(): string {
  return JSON.stringify(loadPilotSessions(), null, 2);
}

function escapeCsv(value: unknown): string {
  const text = typeof value === 'string' ? value : JSON.stringify(value);
  return `"${text.replace(/"/g, '""')}"`;
}

export function pilotSessionsToCsv(): string {
  const sessions = loadPilotSessions();
  const header = [
    'id',
    'createdAt',
    'mode',
    'durationMs',
    'confidence',
    'coverage',
    'separation',
    'differentiation',
    'top1',
    'top1Score',
    'top2',
    'top2Score',
    'top3',
    'top3Score',
    'answers',
  ];

  const rows = sessions.map((session) => {
    const top = session.matches.slice(0, 3);
    return [
      session.id,
      session.createdAt,
      session.mode,
      session.durationMs,
      session.confidence.level,
      session.confidence.coverage,
      session.confidence.separation,
      session.confidence.differentiation,
      top[0]?.name ?? '',
      top[0]?.score ?? '',
      top[1]?.name ?? '',
      top[1]?.score ?? '',
      top[2]?.name ?? '',
      top[2]?.score ?? '',
      JSON.stringify(session.answers),
    ]
      .map(escapeCsv)
      .join(',');
  });

  return [header.join(','), ...rows].join('\n');
}

export function downloadPilotSessions(format: 'json' | 'csv'): void {
  if (typeof document === 'undefined') return;

  const content = format === 'json' ? pilotSessionsToJson() : pilotSessionsToCsv();
  const blob = new Blob([content], {
    type: format === 'json' ? 'application/json;charset=utf-8' : 'text/csv;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `arcanum-pilot-${new Date().toISOString().slice(0, 10)}.${format}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
