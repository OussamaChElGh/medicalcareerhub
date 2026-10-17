import crypto from 'node:crypto';

export interface PremiumTokenPayload {
  kind: 'premium';
  reportId: string;
  sessionId?: string;
  mode: 'free' | 'extensive';
  exp: number;
}

export interface PremiumSignedAccess {
  token: string;
  reportId: string;
  sessionId?: string;
  mode: 'free' | 'extensive';
  expiresAt: string;
}

const DEFAULT_TTL_MS = 90 * 24 * 60 * 60 * 1000;

function getSecret(): string {
  const secret = process.env.PREMIUM_TOKEN_SECRET;
  if (secret && secret.length >= 24) return secret;
  if (process.env.NODE_ENV !== 'production') {
    return 'arcanum-development-premium-secret-change-me';
  }
  throw new Error('PREMIUM_TOKEN_SECRET no está configurado.');
}

function sign(value: string): string {
  return crypto.createHmac('sha256', getSecret()).update(value).digest('base64url');
}

export function signPremiumAccess(
  payload: Omit<PremiumTokenPayload, 'kind' | 'exp'>,
  ttlMs = DEFAULT_TTL_MS,
): PremiumSignedAccess {
  const exp = Date.now() + ttlMs;
  const body = Buffer.from(
    JSON.stringify({ ...payload, kind: 'premium', exp } satisfies PremiumTokenPayload),
  ).toString('base64url');
  const token = `${body}.${sign(body)}`;

  return {
    token,
    reportId: payload.reportId,
    sessionId: payload.sessionId,
    mode: payload.mode,
    expiresAt: new Date(exp).toISOString(),
  };
}

export function verifyPremiumAccessToken(token: string): {
  valid: boolean;
  payload?: PremiumTokenPayload;
  error?: string;
} {
  if (typeof token !== 'string' || !token.includes('.')) {
    return { valid: false, error: 'Token incompleto.' };
  }

  const [body, signature] = token.split('.');
  if (!body || !signature) return { valid: false, error: 'Token incompleto.' };

  try {
    const expected = sign(body);
    const expectedBuffer = Buffer.from(expected);
    const receivedBuffer = Buffer.from(signature);

    if (
      expectedBuffer.length !== receivedBuffer.length ||
      !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
    ) {
      return { valid: false, error: 'Firma inválida.' };
    }

    const payload = JSON.parse(
      Buffer.from(body, 'base64url').toString('utf8'),
    ) as PremiumTokenPayload;

    if (payload.kind !== 'premium' || !payload.reportId) {
      return { valid: false, error: 'Token no reconocido.' };
    }
    if (!Number.isFinite(payload.exp) || payload.exp <= Date.now()) {
      return { valid: false, error: 'El acceso ha caducado.' };
    }
    if (payload.mode !== 'free' && payload.mode !== 'extensive') {
      return { valid: false, error: 'Modalidad no válida.' };
    }

    return { valid: true, payload };
  } catch {
    return { valid: false, error: 'Token inválido.' };
  }
}
