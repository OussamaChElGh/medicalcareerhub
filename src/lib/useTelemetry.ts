import { useCallback, useEffect } from 'react';
import { TelemetryEventType } from './telemetryStorage';

const VISITOR_ID_KEY = 'arcanum_telemetry_visitor_id';

export function getOrCreateVisitorId(): string {
  if (typeof window === 'undefined') return 'server';
  try {
    let vid = localStorage.getItem(VISITOR_ID_KEY);
    if (!vid) {
      vid = `v-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
      localStorage.setItem(VISITOR_ID_KEY, vid);
    }
    return vid;
  } catch {
    return `v-${Date.now().toString(36)}`;
  }
}

export function detectDevice(): 'mobile' | 'desktop' | 'tablet' {
  if (typeof window === 'undefined') return 'desktop';
  const ua = navigator.userAgent.toLowerCase();
  if (/ipad|tablet|(android(?!.*mobile))/.test(ua)) return 'tablet';
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/.test(ua)) return 'mobile';
  return 'desktop';
}

export function sendTelemetryEvent(payload: {
  type: TelemetryEventType;
  page?: string;
  mode?: 'free' | 'extensive';
  specialtyId?: string;
  specialtyName?: string;
  house?: string;
  durationSeconds?: number;
  actionDetail?: string;
}): void {
  if (typeof window === 'undefined') return;

  const visitorId = getOrCreateVisitorId();
  const device = detectDevice();

  const body = {
    ...payload,
    visitorId,
    device,
  };

  try {
    fetch('/api/telemetry/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      keepalive: true,
    }).catch(() => {
      // Quiet fail if offline
    });
  } catch {
    // Ignore network errors
  }
}

export function useTelemetry() {
  const trackPageView = useCallback((page: string) => {
    sendTelemetryEvent({ type: 'page_view', page });
  }, []);

  const trackTestStart = useCallback((mode: 'free' | 'extensive' = 'free') => {
    sendTelemetryEvent({ type: 'test_start', mode });
  }, []);

  const trackTestComplete = useCallback(
    (params: {
      mode?: 'free' | 'extensive';
      specialtyId?: string;
      specialtyName?: string;
      house?: string;
      durationSeconds?: number;
    }) => {
      sendTelemetryEvent({
        type: 'test_complete',
        ...params,
      });
    },
    [],
  );

  const trackRetentionAction = useCallback(
    (
      actionDetail: string,
      params?: { specialtyName?: string; house?: string; mode?: 'free' | 'extensive' },
    ) => {
      sendTelemetryEvent({
        type: 'retention_action',
        actionDetail,
        ...params,
      });
    },
    [],
  );

  return {
    trackPageView,
    trackTestStart,
    trackTestComplete,
    trackRetentionAction,
  };
}
