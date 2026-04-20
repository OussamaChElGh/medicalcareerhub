import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function withRetry<T>(fn: () => Promise<T>, maxRetries = 2, delay = 1000): Promise<T> {
  let lastError: any;
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      const isRateLimit = error?.status === "RESOURCE_EXHAUSTED" || 
                         error?.message?.includes("429") || 
                         error?.stack?.includes("429");
      
      if (isRateLimit && i < maxRetries) {
        console.warn(`Gemini Rate Limit hit. Retrying in ${delay}ms... (Attempt ${i + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

export async function getHatThought(answersSoFar: string[], currentQuestion: string, currentAnswer: string): Promise<string> {
  const prompt = `Eres un "Sombrero Seleccionador" consciente en una academia de medicina arcana. 
      Tu estilo es místico, serio, inteligente y autoritario, como una entidad antigua. 
      El usuario está respondiendo un cuestionario para determinar su especialidad médica.
      
      Respuestas previas del usuario (conceptos): [${answersSoFar.join(", ")}]
      Pregunta actual: "${currentQuestion}"
      Respuesta elegida: "${currentAnswer}"
      
      Genera un pensamiento breve (máximo 15 palabras) que el sombrero diría en voz baja o proyectaría en la pantalla mientras "lee" la mente del usuario basándose en esta respuesta.
      Ejemplos de tono: "Hmm... una mente que no busca calma, sino propósito...", "Esto no es común en aprendices...", "Veo un pulso firme, pero un alma inquieteta...".
      Sé creativo y mantén la estética de fantasía oscura médica. Solo devuelve la frase entre comillas.`;

  try {
    return await withRetry(async () => {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      return response.text || '"Interesante... muy interesante..."';
    });
  } catch (error) {
    console.error("Gemini Error Final Fallback:", error);
    const fallbacks = [
      '"Tu esencia es difícil de leer... pero el destino se aclara..."',
      '"Veo hilos invisibles entrelazándose en tu mente..."',
      '"La sangre no miente, aunque la voz vacile..."',
      '"Interesante elección... hay sombras que te observan..."',
      '"Buscas orden en el caos de la carne..."'
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
}

export async function getFinalJudgment(specialtyName: string, description: string, answers: string[]): Promise<string> {
  const prompt = `Eres el "Sombrero Seleccionador" de la Academia Arcanum Medicum.
      Has evaluado a un aprendiz y has determinado que su destino es: ${specialtyName}.
      Contexto de la especialidad: ${description}
      Respuestas del aprendiz: [${answers.join(", ")}]
      
      Escribe un dictamen final (máximo 60 palabras) con tono autoritario, místico y serio. 
      Explica por qué has elegido este destino basándote en su "esencia" revelada.
      Empieza con algo como "He observado tu esencia..." o "El velo se retira...".
      No uses lenguaje moderno clínico, usa metáforas de academia mágica (vínculo con la carne, hilos del alma, el acero, el caos).`;

  try {
    return await withRetry(async () => {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      return response.text || description;
    });
  } catch (error) {
    console.error("Gemini Error Final Judgment Fallback:", error);
    return `El Sombrero ha dictado tu destino: ${specialtyName}. ${description}`;
  }
}
