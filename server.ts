import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Stripe from "stripe";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { signPremiumAccess, verifyPremiumAccessToken } from "./src/lib/premiumToken";
import { generatePremiumPdf } from "./src/lib/premiumPdf";
import { scoreQuickQuiz, scoreQuiz } from "./src/lib/scoring";
import { QUICK_QUESTION_SET } from "./src/data/questions.quick";
import { ACTIVE_SPECIALTIES } from "./src/data/specialties";
import { buildScoringQuestionSet, selectBranchQuestions } from "./src/lib/branching";
import type { AnswerRecord, QuizResult } from "./src/types";
import {
  initTelemetry,
  recordEvent,
  getTelemetryStats,
  resetTelemetry,
  seedTelemetry,
} from "./src/lib/telemetryStorage";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();

const APP_URL = (process.env.APP_URL || "http://localhost:3000").replace(/\/+$/, "");
const PREMIUM_PRICE_CENTS = Number(process.env.PREMIUM_PRICE_CENTS || 499);
const PREMIUM_CURRENCY = (process.env.PREMIUM_CURRENCY || "eur").toLowerCase();
const PREMIUM_PRODUCT_NAME =
  process.env.PREMIUM_PRODUCT_NAME || "Informe vocacional Arcanum Medicum";
const PREMIUM_DEV_UNLOCK = process.env.PREMIUM_DEV_UNLOCK === "true";

function isPremiumMode(value: unknown): value is "free" | "extensive" {
  return value === "free" || value === "extensive";
}

function isReportId(value: unknown): value is string {
  return typeof value === "string" && /^[a-zA-Z0-9_-]{8,80}$/.test(value);
}

function issuePremiumAccess(
  reportId: string,
  mode: "free" | "extensive",
  sessionId: string | undefined,
  source: "stripe" | "dev",
) {
  const signed = signPremiumAccess({ reportId, mode, sessionId });
  return { ...signed, source };
}

async function startServer() {
  const PORT = Number(process.env.PORT || 3000);

  app.use(express.static(path.join(__dirname, "public")));

  // Payment Setup
  console.log("Initializing Payment Services...");
  let stripe: Stripe | null = null;
  if (process.env.STRIPE_SECRET_KEY) {
    console.log("Stripe Secret Key detected (ends in ... " + process.env.STRIPE_SECRET_KEY.slice(-4) + ")");
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  } else {
    console.warn("CRITICAL: STRIPE_SECRET_KEY is missing in environment variables!");
  }

  // Stripe needs the raw body to verify the webhook signature. Register this
  // route before the JSON parser.
  app.post("/api/premium/webhook", express.raw({ type: "application/json" }), (req, res) => {
    if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
      return res.status(503).json({ error: "Stripe webhook no configurado." });
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        req.headers["stripe-signature"] as string,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (error: any) {
      console.warn("Stripe webhook signature error:", error?.message || error);
      return res.status(400).json({ error: "Firma de webhook inválida." });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("Premium checkout completed:", {
        sessionId: session.id,
        reportId: session.metadata?.reportId,
        mode: session.metadata?.mode,
        paymentStatus: session.payment_status,
      });
    }

    res.json({ received: true });
  });

  app.use(express.json());

// Gemini client helper & quota protection
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
};

let geminiCooldownUntil = 0;
let lastGeminiCallTime = 0;
const MIN_GEMINI_CALL_INTERVAL_MS = 12000; // 12 seconds between calls to respect 5 RPM free tier

const ARCANE_THOUGHT_ARCHIVE = [
  '"Ese pulso tiembla más que un cirujano con Parkinson arcano... Patético."',
  '"¿Anatomía? Veo que prefieres lo que yo llamo carnicería creativa."',
  '"Huelo una sepsis moral en esa elección. Fascinante y asqueroso a la vez."',
  '"Tus hilos vitales están más enredados que un historial de urgencias en plenilunio."',
  '"Esa ética es tan frágil como un fémur con osteoporosis mágica. Se romperá pronto."',
  '"Crees que el bisturí te dará poder... qué tierno delirio de grandeza quirúrgico."',
  '"Tú no buscas curar, buscas aplausos. La medicina no es un teatro de variedades."',
  '"He visto cadáveres con más voluntad de diagnóstico que tú."',
  '"Esa respuesta indica una preocupante hipoxia intelectual... Necesitas aire, o cerebro."',
  '"¿Compasión? Huelo que te has equivocado de academia. Aquí forjamos acero, no consuelos."',
  '"Ese ego tiene el tamaño de una cardiomegalia terminal. No cabrás en el quirófano."',
  '"Mmm, un complejo de Dios sin el poder de un Dios. Diagnóstico: Iluso."',
  '"Tus neuronas están haciendo huelga o simplemente nunca fueron contratadas."',
  '"Esa lógica tiene más agujeros que un colador en un campo de tiro arcano."',
  '"Vaya, un experto en nada que opina sobre todo. Serás un administrativo excelente."',
  '"Tu concepto de la vida es tan estrecho que cabe en un portaobjetos sucio."',
  '"Huelo ambición... y un poco de sudor frío de incompetencia."',
  '"¿Ética? En esta academia, la ética es solo la piel que cubre el músculo del progreso."',
  '"Veo que prefieres los síntomas a las causas. Qué superficial... y qué humano."',
  '"Esa mente es un desierto quirúrgico. No hay nada que salvar ahí."',
  '"Interesante... si por interesante entiendes catástrofe médica inminente."',
  '"Tu alma tiene el color de un pulmón de minero de carbón arcano. Oscura y pesada."',
  '"¿Dolor? El dolor es solo información. Veo que tú prefieres ignorar los datos."',
  '"Ese juicio está más nublado que una catarata post-mortem."',
  '"Manejas los conceptos médicos como un orco maneja un violín: con violencia y sin talento."',
  '"Bravo. Has logrado decepcionarme en menos de diez segundos. Un récord."',
  '"Tu destino es tan incierto como un diagnóstico hecho por un estudiante de primer año."',
  '"Siento un vacío en tu intelecto que ni el éter más puro podría llenar."',
  '"Vaya, una respuesta que destila un aroma a no tengo ni idea. Sincero, al menos."',
  '"¿Sangre? La sangre es solo el lubricante del destino. Tú pareces preferir el óxido."',
  '"Doce preguntas y todavía crees que elegir especialidad es como elegir varita... Qué adorable."',
  '"Tu perfil dice más de ti que tu expediente académico. Y eso ya es decir."',
  '"Veo un patrón... y no precisamente uno de excelencia."',
  '"Sigue respondiendo. Estoy empezando a divertirme con tu incertidumbre."',
  '"Esa mezcla de intereses es tan coherente como un diagnóstico firmado por un becario."',
  '"La vocación no se elige con un test. Pero tú sigue intentándolo, mortal."'
];

function getRandomArcaneThought(): string {
  return ARCANE_THOUGHT_ARCHIVE[Math.floor(Math.random() * ARCANE_THOUGHT_ARCHIVE.length)];
}

function getProceduralJudgment(specialtyName: string, description: string): string {
  const templates = [
    `El veredicto de las costuras es inexorable: tu mente busca la forja de ${specialtyName}. No hay consuelo ni gloria fácil en este camino, solo la verdad implacable del oficio. ${description}`,
    `He contemplado tus pulsiones y tus vacilaciones. Tu destino queda grabado en ${specialtyName}. Otros habrían temblado ante la incertidumbre; tus decisiones revelan el temple exacto que este sacerdocio exige.`,
    `Ni el éter ni la casualidad te han traído aquí: perteneces a ${specialtyName}. Tu instinto no tolera la mediocridad clínica; prepárate para ser puesto a prueba hasta la última costura.`,
    `Las cartas arcanas coinciden con tus reflejos: tu sitio indiscutible está en ${specialtyName}. Tienes la osadía necesaria para abrazar su rigor sin perder el juicio en el intento.`
  ];
  return templates[Math.floor(Math.random() * templates.length)];
}

  // --- API Routes ---

  // Gemini: Hat Thought Generation with smart quota throttling & instant fallback
  app.post("/api/gemini/hat-thought", async (req, res) => {
    const { answersSoFar = [], currentQuestion = "", currentAnswer = "" } = req.body;
    const now = Date.now();

    // Check if in cooldown or throttling interval
    if (now < geminiCooldownUntil || (now - lastGeminiCallTime < MIN_GEMINI_CALL_INTERVAL_MS)) {
      return res.json({ thought: getRandomArcaneThought(), fallback: true });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({ thought: getRandomArcaneThought(), fallback: true });
    }

    try {
      const prompt = `Eres un "Sombrero Seleccionador" consciente en una academia de medicina arcana. 
Tu estilo es místico, sabio y profundamente MORDAZ. Tienes un humor ácido y no temes juzgar la fragilidad, la arrogancia o la ignorancia humana. 
Eres como un viejo erudito que ha visto milenios de aprendices mediocres y buscas la chispa de la verdadera esencia.
El usuario está respondiendo un cuestionario para determinar su especialidad médica.

Respuestas previas del usuario (conceptos): [${answersSoFar.join(", ")}]
Pregunta actual: "${currentQuestion}"
Respuesta elegida: "${currentAnswer}"

Genera un pensamiento que el sombrero diría en voz baja o proyectaría en la pantalla mientras "lee" la mente del usuario.
Busca una extensión media (entre 15 y 25 palabras) para que dé tiempo a desarrollar una metáfora médica o una crítica mordaz con sustancia.
Sé original, cínico, clínico y místico. Evita los clichés.
Ejemplos de tono: "Esa obsesión con el detalle sugiere una mente quirúrgica, o quizás simplemente un desorden obsesivo que me obligará a limpiarme las costuras...", "Vaya, un héroe en potencia. Huelo el aroma a martirio y a horas extras sin pagar en un hospital de campaña... qué aburrido.".
No menciones "Harry Potter". Solo devuelve la frase entre comillas.`;

      lastGeminiCallTime = now;
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
      });

      const thought = response.text?.trim() || getRandomArcaneThought();
      res.json({ thought });
    } catch (error: any) {
      const errMsg = String(error?.message || error || "");
      if (errMsg.includes("429") || errMsg.includes("RESOURCE_EXHAUSTED") || errMsg.includes("quota")) {
        geminiCooldownUntil = Date.now() + 60000;
        console.log("[Arcane Engine] Free tier rate limit reached. Activating arcane archive fallback for 60s.");
      } else {
        console.log("[Arcane Engine] Gemini response fallback activated.");
      }
      res.json({ thought: getRandomArcaneThought(), fallback: true });
    }
  });

  // Gemini: Final Judgment Generation with graceful quota resilience
  app.post("/api/gemini/final-judgment", async (req, res) => {
    const { specialtyName = "", description = "", answers = [] } = req.body;
    const now = Date.now();

    if (now < geminiCooldownUntil) {
      return res.json({ judgment: getProceduralJudgment(specialtyName, description), fallback: true });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({ judgment: getProceduralJudgment(specialtyName, description), fallback: true });
    }

    try {
      const prompt = `Eres el "Sombrero Seleccionador" de la Academia Arcanum Medicum.
Has evaluado a un aprendiz y has determinado que su destino es: ${specialtyName}.
Contexto de la especialidad: ${description}
Respuestas del aprendiz: [${answers.join(", ")}]

Escribe un dictamen final (máximo 60 palabras) con tono autoritario, místico y desafiante. 
No seas amable de forma gratuita. Juzga su esencia revelada con sabiduría pero con ese toque de cinismo que te caracteriza. 
Explica por qué has elegido este destino (¿por su frialdad? ¿por su pulsión de gloria? ¿por su obsesión con el detalle?).
No uses lenguaje clínico moderno. Usa metáforas de academia arcana (la forja de la carne, el baile con la muerte, el susurro de los nervios).
No menciones "Harry Potter".`;

      lastGeminiCallTime = now;
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
      });

      const judgment = response.text?.trim() || getProceduralJudgment(specialtyName, description);
      res.json({ judgment });
    } catch (error: any) {
      const errMsg = String(error?.message || error || "");
      if (errMsg.includes("429") || errMsg.includes("RESOURCE_EXHAUSTED") || errMsg.includes("quota")) {
        geminiCooldownUntil = Date.now() + 60000;
        console.log("[Arcane Engine] Rate limit on judgment. Delivered procedural arcane decree.");
      } else {
        console.log("[Arcane Engine] Serving high-lore decree fallback.");
      }
      res.json({ judgment: getProceduralJudgment(specialtyName, description), fallback: true });
    }
  });


  initTelemetry();

  // --- Telemetry & Backoffice Funnel API ---
  app.post("/api/telemetry/event", (req, res) => {
    try {
      const {
        type,
        visitorId,
        page,
        mode,
        specialtyId,
        specialtyName,
        house,
        durationSeconds,
        actionDetail,
        device,
      } = req.body || {};

      if (!type || !visitorId) {
        return res.status(400).json({ error: "Faltan campos requeridos (type, visitorId)." });
      }

      const event = recordEvent({
        type,
        visitorId,
        page,
        mode,
        specialtyId,
        specialtyName,
        house,
        durationSeconds,
        actionDetail,
        device,
      });

      res.json({ ok: true, eventId: event.id });
    } catch (err: any) {
      console.error("[Telemetry] Error recording event:", err);
      res.status(500).json({ error: "Error al registrar evento." });
    }
  });

  app.get("/api/telemetry/stats", (req, res) => {
    try {
      const period = req.query.period as any;
      const stats = getTelemetryStats(period || "all");
      res.json(stats);
    } catch (err: any) {
      console.error("[Telemetry] Error getting stats:", err);
      res.status(500).json({ error: "Error al consultar estadísticas." });
    }
  });

  app.post("/api/telemetry/reset", (_req, res) => {
    try {
      resetTelemetry();
      res.json({ ok: true, message: "Datos de telemetría reiniciados con éxito." });
    } catch (err: any) {
      console.error("[Telemetry] Error resetting stats:", err);
      res.status(500).json({ error: "Error al reiniciar estadísticas." });
    }
  });

  app.post("/api/telemetry/seed", (req, res) => {
    try {
      const { visits, starts, completions, retentions } = req.body || {};
      seedTelemetry(
        Number(visits) || 100,
        Number(starts) || 40,
        Number(completions) || 30,
        Number(retentions) || 18,
      );
      res.json({ ok: true, message: "Datos de ejemplo sembrados con éxito." });
    } catch (err: any) {
      console.error("[Telemetry] Error seeding stats:", err);
      res.status(500).json({ error: "Error al sembrar datos." });
    }
  });

  app.get("/api/telemetry/export", (req, res) => {
    try {
      const stats = getTelemetryStats("all");
      const format = req.query.format === "csv" ? "csv" : "json";
      if (format === "json") {
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Content-Disposition", 'attachment; filename="censo_telemetria_backoffice.json"');
        return res.json(stats);
      } else {
        const headers = ["ID", "Tipo", "Fecha/Hora", "Visitante", "Página/Modalidad", "Especialidad", "Casa", "Duración (seg)", "Acción Detalle", "Dispositivo"];
        const rows = stats.recentEvents.map(e => [
          e.id,
          e.type,
          e.timestamp,
          e.visitorId,
          e.mode || e.page || '',
          e.specialtyName || '',
          e.house || '',
          e.durationSeconds ?? '',
          e.actionDetail || '',
          e.device || 'desktop'
        ]);
        const csvContent = [headers.join(','), ...rows.map(r => r.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))].join('\n');
        res.setHeader("Content-Type", "text/csv; charset=utf-8");
        res.setHeader("Content-Disposition", 'attachment; filename="censo_telemetria_eventos.csv"');
        return res.send(csvContent);
      }
    } catch (err: any) {
      console.error("[Telemetry] Error exporting stats:", err);
      res.status(500).json({ error: "Error al exportar datos." });
    }
  });

  app.get("/api/health", (_req, res) => {
    res.json({
      ok: true,
      uptime: process.uptime(),
      premiumConfigured: !!stripe,
    });
  });

  // --- Premium report ---
  app.get("/api/premium/config", (_req, res) => {
    res.json({
      configured: !!stripe,
      priceCents: PREMIUM_PRICE_CENTS,
      currency: PREMIUM_CURRENCY,
      productName: PREMIUM_PRODUCT_NAME,
      devUnlock: PREMIUM_DEV_UNLOCK && process.env.NODE_ENV !== "production",
    });
  });

  app.post("/api/premium/checkout", async (req, res) => {
    try {
      const reportId = req.body?.reportId;
      const mode = req.body?.mode;
      if (!isReportId(reportId) || !isPremiumMode(mode)) {
        return res.status(400).json({ error: "Informe o modalidad no válidos." });
      }

      if (!stripe) {
        if (PREMIUM_DEV_UNLOCK && process.env.NODE_ENV !== "production") {
          return res.json({
            access: issuePremiumAccess(reportId, mode, undefined, "dev"),
            dev: true,
          });
        }
        return res.status(503).json({
          error: "El pago no está configurado. Añade STRIPE_SECRET_KEY o activa PREMIUM_DEV_UNLOCK en desarrollo.",
        });
      }

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: PREMIUM_CURRENCY,
              unit_amount: PREMIUM_PRICE_CENTS,
              product_data: { name: PREMIUM_PRODUCT_NAME },
            },
          },
        ],
        success_url: `${APP_URL}/?premium=success&session_id={CHECKOUT_SESSION_ID}&report_id=${encodeURIComponent(reportId)}`,
        cancel_url: `${APP_URL}/?premium=cancel&report_id=${encodeURIComponent(reportId)}`,
        client_reference_id: reportId,
        metadata: { reportId, mode },
        locale: "es",
      });

      res.json({ url: session.url });
    } catch (error: any) {
      console.error("Premium checkout error:", error?.message || error);
      res.status(500).json({ error: "No se pudo iniciar el pago." });
    }
  });

  app.get("/api/premium/verify", async (req, res) => {
    try {
      const sessionId = typeof req.query.session_id === "string" ? req.query.session_id : "";
      const reportId = typeof req.query.report_id === "string" ? req.query.report_id : "";

      if (!sessionId || !isReportId(reportId)) {
        return res.status(400).json({ error: "Sesión o informe no válidos." });
      }
      if (!stripe) {
        return res.status(503).json({ error: "El pago no está configurado." });
      }

      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status !== "paid" && session.payment_status !== "no_payment_required") {
        return res.status(402).json({ error: "El pago todavía no está confirmado." });
      }

      const sessionReportId = session.metadata?.reportId || session.client_reference_id;
      if (sessionReportId !== reportId) {
        return res.status(403).json({ error: "El pago no corresponde a este informe." });
      }

      const mode = isPremiumMode(session.metadata?.mode) ? session.metadata.mode : "free";
      res.json({ access: issuePremiumAccess(reportId, mode, session.id, "stripe") });
    } catch (error: any) {
      console.error("Premium verify error:", error?.message || error);
      res.status(500).json({ error: "No se pudo verificar el pago." });
    }
  });

  app.post("/api/premium/dev-unlock", (req, res) => {
    if (process.env.NODE_ENV === "production" || !PREMIUM_DEV_UNLOCK) {
      return res.status(404).json({ error: "No disponible." });
    }

    const reportId = req.body?.reportId;
    const mode = req.body?.mode;
    if (!isReportId(reportId) || !isPremiumMode(mode)) {
      return res.status(400).json({ error: "Informe o modalidad no válidos." });
    }

    res.json({ access: issuePremiumAccess(reportId, mode, undefined, "dev") });
  });

  app.post("/api/premium/validate", (req, res) => {
    const token = req.body?.token;
    const reportId = req.body?.reportId;
    const verification = verifyPremiumAccessToken(token);

    if (!verification.valid || !verification.payload) {
      return res.status(401).json({ valid: false, error: verification.error });
    }
    if (verification.payload.reportId !== reportId) {
      return res.status(403).json({ valid: false, error: "El acceso no corresponde a este informe." });
    }

    res.json({
      valid: true,
      reportId: verification.payload.reportId,
      expiresAt: new Date(verification.payload.exp).toISOString(),
    });
  });

  app.post("/api/premium/pdf", async (req, res) => {
    try {
      const token = req.body?.token;
      const reportId = req.body?.reportId;
      const answers = Array.isArray(req.body?.answers)
        ? (req.body.answers as AnswerRecord[])
        : [];

      const verification = verifyPremiumAccessToken(token);
      if (!verification.valid || !verification.payload) {
        return res.status(401).json({ error: verification.error || "Acceso no válido." });
      }
      if (verification.payload.reportId !== reportId) {
        return res.status(403).json({ error: "El acceso no corresponde a este informe." });
      }
      if (answers.length < QUICK_QUESTION_SET.questions.length) {
        return res.status(400).json({ error: "Faltan respuestas para generar el informe." });
      }

      const freeQuestionIds = new Set(QUICK_QUESTION_SET.questions.map((question) => question.id));
      let result: QuizResult;

      if (verification.payload.mode === "extensive") {
        const freeAnswers = answers.filter((answer) => freeQuestionIds.has(answer.questionId));
        const freeResult = scoreQuickQuiz(freeAnswers);
        const branch = selectBranchQuestions(freeResult);
        result = scoreQuiz(answers, {
          questionSet: buildScoringQuestionSet(QUICK_QUESTION_SET, branch),
          specialties: ACTIVE_SPECIALTIES,
        });
      } else {
        result = scoreQuickQuiz(answers);
      }

      if (result.matches.length === 0) {
        return res.status(400).json({ error: "No hay suficientes datos para construir el informe." });
      }

      const pdf = generatePremiumPdf({
        result,
        reportId: verification.payload.reportId,
        mode: verification.payload.mode,
      });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="Arcanum_Informe_${reportId.slice(0, 8)}.pdf"`,
      );
      res.send(Buffer.from(pdf));
    } catch (error: any) {
      console.error("Premium PDF error:", error?.message || error);
      res.status(500).json({ error: "No se pudo generar el PDF." });
    }
  });


  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  if (process.env.VERCEL !== "1") {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Academy Server running on http://localhost:${PORT}`);
    });
  }
}

startServer();

export default app;

