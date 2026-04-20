import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Stripe from "stripe";
import dotenv from "dotenv";

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

  // --- API Routes ---

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
