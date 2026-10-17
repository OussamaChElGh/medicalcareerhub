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

// Initialize Gemini client helper
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

  // --- API Routes ---

  // Gemini: Hat Thought Generation
  app.post("/api/gemini/hat-thought", async (req, res) => {
    try {
      const { answersSoFar = [], currentQuestion = "", currentAnswer = "" } = req.body;
      const ai = getGeminiClient();
      if (!ai) {
        return res.status(503).json({ error: "Gemini API key is not configured on the server." });
      }

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

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
      });

      const thought = response.text?.trim() || '"Tu mente es un laberinto... uno bastante aburrido."';
      res.json({ thought });
    } catch (error: any) {
      console.warn("Gemini server error (hat-thought):", error?.message || error);
      res.status(error?.status || 500).json({ error: error?.message || "Gemini service temporarily unavailable" });
    }
  });

  // Gemini: Final Judgment Generation
  app.post("/api/gemini/final-judgment", async (req, res) => {
    try {
      const { specialtyName = "", description = "", answers = [] } = req.body;
      const ai = getGeminiClient();
      if (!ai) {
        return res.status(503).json({ error: "Gemini API key is not configured on the server." });
      }

      const prompt = `Eres el "Sombrero Seleccionador" de la Academia Arcanum Medicum.
Has evaluado a un aprendiz y has determinado que su destino es: ${specialtyName}.
Contexto de la especialidad: ${description}
Respuestas del aprendiz: [${answers.join(", ")}]

Escribe un dictamen final (máximo 60 palabras) con tono autoritario, místico y desafiante. 
No seas amable de forma gratuita. Juzga su esencia revelada con sabiduría pero con ese toque de cinismo que te caracteriza. 
Explica por qué has elegido este destino (¿por su frialdad? ¿por su pulsión de gloria? ¿por su obsesión con el detalle?).
No uses lenguaje clínico moderno. Usa metáforas de academia arcana (la forja de la carne, el baile con la muerte, el susurro de los nervios).
No menciones "Harry Potter".`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
      });

      const judgment = response.text?.trim() || description;
      res.json({ judgment });
    } catch (error: any) {
      console.warn("Gemini server error (final-judgment):", error?.message || error);
      res.status(error?.status || 500).json({ error: error?.message || "Gemini service temporarily unavailable" });
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

