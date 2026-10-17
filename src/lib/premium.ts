import { AnswerRecord } from '../types';

export type PremiumMode = 'free' | 'extensive';
export type PremiumSource = 'stripe' | 'dev';

export interface PremiumAccess {
  token: string;
  reportId: string;
  sessionId?: string;
  mode: PremiumMode;
  expiresAt: string;
  source?: PremiumSource;
}

const STORAGE_KEY = 'arcanum_premium_v1';

function hasStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function loadPremiumAccess(): PremiumAccess | null {
  if (!hasStorage()) return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PremiumAccess;
    if (!parsed.token || !parsed.reportId || !parsed.expiresAt) return null;
    if (new Date(parsed.expiresAt).getTime() <= Date.now()) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function savePremiumAccess(access: PremiumAccess): void {
  if (!hasStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(access));
}

export function clearPremiumAccess(): void {
  if (!hasStorage()) return;
  window.localStorage.removeItem(STORAGE_KEY);
}

async function readJson<T>(response: Response): Promise<T> {
  const payload = (await response.json().catch(() => ({}))) as T & { error?: string };
  if (!response.ok) {
    throw new Error(payload.error || 'No se pudo completar la operación de pago.');
  }
  return payload;
}

export async function startPremiumCheckout(
  reportId: string,
  mode: PremiumMode,
): Promise<{ url?: string; access?: PremiumAccess }> {
  const response = await fetch('/api/premium/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reportId, mode }),
  });
  const payload = await readJson<{ url?: string; access?: PremiumAccess }>(response);
  if (payload.access) savePremiumAccess(payload.access);
  return payload;
}

export async function devUnlockPremium(
  reportId: string,
  mode: PremiumMode,
): Promise<PremiumAccess> {
  const response = await fetch('/api/premium/dev-unlock', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reportId, mode }),
  });
  const payload = await readJson<{ access: PremiumAccess }>(response);
  savePremiumAccess(payload.access);
  return payload.access;
}

export async function verifyPremiumSession(
  sessionId: string,
  reportId: string,
): Promise<PremiumAccess> {
  const params = new URLSearchParams({ session_id: sessionId, report_id: reportId });
  const response = await fetch(`/api/premium/verify?${params.toString()}`);
  const payload = await readJson<{ access: PremiumAccess }>(response);
  savePremiumAccess(payload.access);
  return payload.access;
}

export async function validatePremiumAccess(access: PremiumAccess): Promise<boolean> {
  const response = await fetch('/api/premium/validate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: access.token, reportId: access.reportId }),
  });
  if (!response.ok) return false;
  const payload = (await response.json().catch(() => ({}))) as { valid?: boolean };
  return payload.valid === true;
}

export async function downloadPremiumPdf(
  access: PremiumAccess,
  answers: AnswerRecord[],
  mode: PremiumMode,
): Promise<Blob> {
  const response = await fetch('/api/premium/pdf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      token: access.token,
      reportId: access.reportId,
      answers,
      mode,
    }),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(payload.error || 'No se pudo generar el informe PDF.');
  }

  return response.blob();
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
