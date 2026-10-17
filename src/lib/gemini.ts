async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs = 6000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);
    return res;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

export async function getHatThought(
  answersSoFar: string[], 
  currentQuestion: string, 
  currentAnswer: string, 
  exclude: string[] = []
): Promise<string> {
  try {
    const response = await fetchWithTimeout('/api/gemini/hat-thought', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answersSoFar, currentQuestion, currentAnswer }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data?.thought && typeof data.thought === 'string') {
        return data.thought;
      }
    }
  } catch (error: any) {
    console.warn("Using local arcane thought fallback:", error?.message || error);
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

export async function getFinalJudgment(
  specialtyName: string, 
  description: string, 
  answers: string[]
): Promise<string> {
  try {
    const response = await fetchWithTimeout('/api/gemini/final-judgment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ specialtyName, description, answers }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data?.judgment && typeof data.judgment === 'string') {
        return data.judgment;
      }
    }
  } catch (error: any) {
    console.warn("Using local arcane judgment fallback:", error?.message || error);
  }

  return `Incluso un ciego vería que tu lugar es en ${specialtyName}. Tu esencia no deja lugar a dudas: ${description}`;
}
