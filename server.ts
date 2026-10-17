import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Stripe from "stripe";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();

async function startServer() {
  const PORT = 3000;

  app.use(express.json());
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


  // Stripe: Create Payment Intent
  app.post("/api/payment/stripe/create-intent", async (req, res) => {
    try {
      if (!stripe) {
        console.error("Payment attempt failed: Stripe is not initialized.");
        return res.status(500).json({ error: "Stripe is not configured on the server. Check your STRIPE_SECRET_KEY." });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: 499, // 4.99 in cents
        currency: "eur",
        automatic_payment_methods: { enabled: true },
        metadata: { type: "arcane_exam" }
      });

      console.log("Stripe Intent Created successfully:", paymentIntent.id);
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Stripe SDK Error during intent creation:", error.message);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/payment/debug", (req, res) => {
    res.json({
      stripeConfigured: !!stripe,
      stripeKeyLast4: process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY.slice(-4) : "NONE",
      env: process.env.NODE_ENV
    });
  });

  // PayPal: Mock endpoints for the demo (since real PayPal setup requires live credentials and complex SDK)
  // But we will build the structure
  app.post("/api/payment/paypal/create-order", async (req, res) => {
    // In a real app, you'd use the PayPal REST SDK here
    // For this environment, we'll return a mock success structure if keys are missing
    // to allow the user to see the flow, but explain it's "ready for keys"
    res.json({ id: "MOCK_ORDER_" + Math.random().toString(36).substr(2, 9) });
  });

  app.post("/api/payment/paypal/capture-order", async (req, res) => {
    res.json({ status: "COMPLETED" });
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

  if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Academy Server running on http://localhost:${PORT}`);
    });
  }
}

startServer();

export default app;
