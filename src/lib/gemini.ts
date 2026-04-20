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
      
      // If we are here, it's either not a rate limit or we've exhausted retries
      if (isRateLimit) {
        const rateLimitError = new Error("Gemini API quota exceeded (429). Falling back to local wisdom.");
        (rateLimitError as any).status = 429;
        throw rateLimitError;
      }
      
      throw error;
    }
  }
  throw lastError;
}

export async function getHatThought(answersSoFar: string[], currentQuestion: string, currentAnswer: string, exclude: string[] = []): Promise<string> {
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

  try {
    return await withRetry(async () => {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      return response.text || '"Tu mente es un laberinto... uno bastante aburrido."';
    });
  } catch (error: any) {
    if (error?.status === 429) {
      console.warn("Gemini Quota Exceeded. Using local fallback thoughts.");
    } else {
      console.error("Gemini Error Final Fallback:", error?.message || error);
    }
    
    const fallbacks = [
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
      '"Interesante... si por interesante entiendes "catástrofe médica inminente"." ',
      '"Tu alma tiene el color de un pulmón de minero de carbón arcano. Oscura y pesada."',
      '"¿Dolor? El dolor es solo información. Veo que tú prefieres ignorar los datos."',
      '"Ese juicio está más nublado que una catarata post-mortem."',
      '"Manejas los conceptos médicos como un orco maneja un violín: con violencia y sin talento."',
      '"Bravo. Has logrado decepcionarme en menos de diez segundos. Un récord."',
      '"Tu destino es tan incierto como un diagnóstico hecho por un estudiante de primer año."',
      '"Siento un vacío en tu intelecto que ni el éter más puro podría llenar."',
      '"Vaya, una respuesta que destila un aroma a "no tengo ni idea". Sincero, al menos."',
      '"¿Sangre? La sangre es solo el lubricante del destino. Tú pareces preferir el óxido."'
    ];
    
    const available = fallbacks.filter(f => !exclude.includes(f));
    const pool = available.length > 0 ? available : fallbacks;
    return pool[Math.floor(Math.random() * pool.length)];
  }
}

export async function getFinalJudgment(specialtyName: string, description: string, answers: string[]): Promise<string> {
  const prompt = `Eres el "Sombrero Seleccionador" de la Academia Arcanum Medicum.
      Has evaluado a un aprendiz y has determinado que su destino es: ${specialtyName}.
      Contexto de la especialidad: ${description}
      Respuestas del aprendiz: [${answers.join(", ")}]
      
      Escribe un dictamen final (máximo 60 palabras) con tono autoritario, místico y desafiante. 
      No seas amable de forma gratuita. Juzga su esencia revelada con sabiduría pero con ese toque de cinismo que te caracteriza. 
      Explica por qué has elegido este destino (¿por su frialdad? ¿por su pulsión de gloria? ¿por su obsesión con el detalle?).
      No uses lenguaje clínico moderno. Usa metáforas de academia arcana (la forja de la carne, el baile con la muerte, el susurro de los nervios).
      No menciones "Harry Potter".`;

  try {
    return await withRetry(async () => {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      return response.text || description;
    });
  } catch (error: any) {
    if (error?.status === 429) {
      console.warn("Gemini Quota Exceeded. Using local fallback judgment.");
    } else {
      console.error("Gemini Error Final Judgment Fallback:", error?.message || error);
    }
    return `Incluso un ciego vería que tu lugar es en ${specialtyName}. Tu esencia no deja lugar a dudas: ${description}`;
  }
}
