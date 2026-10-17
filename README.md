# Arcanum Medicum

Orientación vocacional médica con identidad arcana. La experiencia principal es la V2:

- 14 preguntas gratuitas.
- Top 5 con bandas de afinidad, confianza y duelo por el primer puesto.
- Test extensivo adaptativo de 40–44 preguntas.
- Catálogo de 51 especialidades.
- Informe premium con ranking completo, comparación de ejes y PDF.
- Blog, About, Stats y Oracle portados a la V2.

La versión clásica queda como legado en `/classic` (o `?classic=1`). El pago legacy está desactivado y remite a la V2.

## Desarrollo

```bash
npm install
npm run dev
```

`npm run dev` arranca el servidor en una consola oculta separada y vuelve cuando está listo, también en la terminal integrada de Antigravity. Para un servidor en primer plano usa `npm run dev:fg` solo en una terminal que quieras dejar abierta.

```bash
npm run dev          # segundo plano, no bloquea
npm run dev:fg       # primer plano, para terminal normal
npm run dev:status
npm run dev:stop
npm run dev:restart
```

`dev` lanza `scripts/dev-run.cmd` con `Start-Process` en una consola separada, escribe el PID en `.dev-server.pid` y los logs en `.dev-server.out.log` / `.dev-server.err.log`. `dev:stop` mata el árbol y, si el PID guardado está obsoleto, localiza el proceso que escucha en el puerto. `dev:restart` reinicia el servidor para aplicar cambios en `server.ts`. Si una pestaña antigua sigue bloqueada, ciérrala: `npm run dev` no reutiliza esa terminal.

Copia `.env.example` a `.env`. Para las frases del Sombrero basta `GEMINI_API_KEY`. Para el premium:

```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
PREMIUM_TOKEN_SECRET=una-cadena-larga-y-aleatoria
APP_URL=http://localhost:3000
PREMIUM_PRICE_CENTS=499
PREMIUM_CURRENCY=eur
```

En desarrollo puedes usar `PREMIUM_DEV_UNLOCK=true` para desbloquear el informe sin Stripe. No lo actives en producción.

Rutas:

- `/` → V2.
- `/?v2=1` → V2 (alias).
- `/?stage=quiz` → test directo para desarrollo.
- `/?demo=result` → resultado demo.
- `/?demo=extensive` → test extensivo demo.
- `/classic` → versión clásica.

## Premium

Flujo implementado:

1. El resultado tiene un `reportId` persistido.
2. El botón de desbloqueo crea una sesión de Stripe Checkout en el servidor.
3. La vuelta a `?premium=success` verifica el pago contra Stripe y emite un token firmado.
4. El PDF se genera en el servidor después de validar el token.

El MVP usa un token firmado como entitlement; no hay base de datos. Si se pierde el navegador, se conserva el PDF descargado. Para recuperación automática por email o acceso multidispositivo hace falta añadir persistencia (Postgres/Upstash) y un flujo de recuperación.

El servidor está preparado para desplegarse como Node/Express. Incluye `Dockerfile` y `render.yaml`; el healthcheck es `/api/health`. `vercel.json` queda como legado: el premium, el webhook de Stripe y el PDF requieren un host Node.

## Verificación

```bash
npm run verify:all
```

O por separado:

```bash
npm run lint
npm run verify:scoring
npm run verify:extensive
npm run verify:catalog
npm run verify:premium
npm run verify:stability
npm run verify:stability:strict
npm run audit:questions
npm run build
```

## Despliegue Node

```bash
npm ci --include=dev
npm run build
NODE_ENV=production npm start
```

En PowerShell:

```powershell
$env:NODE_ENV='production'
npm start
```

Con Docker:

```bash
docker build -t arcanum-medicum .
docker run --rm -p 3000:3000 --env-file .env arcanum-medicum
```

`render.yaml` define el servicio, el healthcheck `/api/health` y las variables de Stripe/Gemini. `PREMIUM_DEV_UNLOCK` debe quedar en `false` en producción.

## Datos y documentos

- `src/data/questions.quick.ts` — 14 preguntas gratuitas.
- `src/data/questions.extensive.ts` — 18 centrales + 36 de desempate.
- `src/data/specialties.ts` — 51 fichas.
- `src/data/specialtyEvidence.ts` — justificación interna de los valores ≥3.
- `src/data/dimensions.ts` — ejes A1–A10 y restricciones C1–C2.
- `docs/question-bank-v1.md` — banco completo de preguntas.
- `docs/catalog-51.md` — catálogo completo.
- `docs/question-audit-v1.md` — hallazgos y calibración.
- `docs/extensive-test-spec.md` — especificación del extensivo.
- `docs/pilot-protocol.md` — protocolo de piloto.

## Utilidades

```bash
npm run export:questions
npm run export:catalog
npm run analyze:pilot -- data/pilot-sessions.json
```

## Estado

- V2 en beta.
- Premium conectado a Stripe Checkout y PDF servidor; pendiente de claves reales y base de datos para recuperación.
- 51 fichas con perfiles preliminares; sin validación clínica formal. La app se presenta como beta y orientativa.
- Arnés de estabilidad con 10 personas: top 1 80,7 %, top 3 86,0 %, top 5 87,6 % con cambio cercano.
