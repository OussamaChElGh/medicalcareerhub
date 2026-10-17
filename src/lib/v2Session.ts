import { AnswerRecord, QuizResult } from '../types';

export interface V2PersistedSession {
  version: 1;
  updatedAt: string;
  stage: 'quiz' | 'extensive' | 'result';
  reportId?: string;
  freeAnswers: AnswerRecord[];
  freeAnswerTexts: Record<string, string>;
  freeIndex: number;
  freeResult: QuizResult | null;
  extensiveAnswers: AnswerRecord[];
  extensiveAnswerTexts: Record<string, string>;
  extensiveIndex: number;
  result: QuizResult | null;
  resultMode: 'free' | 'extensive';
  judgment: string;
}

const STORAGE_KEY = 'arcanum_v2_session_v1';
const SESSION_TTL_MS = 90 * 24 * 60 * 60 * 1000;

function hasStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function createEmptySession(): V2PersistedSession {
  return {
    version: 1,
    updatedAt: new Date().toISOString(),
    stage: 'quiz',
    reportId: '',
    freeAnswers: [],
    freeAnswerTexts: {},
    freeIndex: 0,
    freeResult: null,
    extensiveAnswers: [],
    extensiveAnswerTexts: {},
    extensiveIndex: 0,
    result: null,
    resultMode: 'free',
    judgment: '',
  };
}

export function loadV2Session(): V2PersistedSession | null {
  if (!hasStorage()) return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as V2PersistedSession;
    if (parsed.version !== 1 || !parsed.stage || !parsed.updatedAt) return null;

    const updatedAt = new Date(parsed.updatedAt).getTime();
    if (!Number.isFinite(updatedAt) || Date.now() - updatedAt > SESSION_TTL_MS) {
      clearV2Session();
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function saveV2Session(session: V2PersistedSession): void {
  if (!hasStorage()) return;

  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...session,
        version: 1,
        updatedAt: new Date().toISOString(),
      }),
    );
  } catch (error) {
    console.warn('No se pudo guardar la sesión V2:', error);
  }
}

export function clearV2Session(): void {
  if (!hasStorage()) return;
  window.localStorage.removeItem(STORAGE_KEY);
}
