import { Question, Specialty, BlogPost } from './types';

export const BLOG_POSTS: BlogPost[] = [
  {
    title: "El Juramento de Sangre y Acero",
    date: "14 de Bruma, 1502",
    author: "Maestre Alaric",
    category: "Ética Médica",
    image: "https://picsum.photos/seed/alchemy-medicine/800/450",
    excerpt: "Exploramos los límites éticos de la cauterización de almas en pacientes con necrosis espiritual severa...",
    content: "En la medicina arcana, el equilibrio entre la intervención física y el respeto por el flujo espiritual es una danza delicada. El 'Juramento de Sangre y Acero' dicta que un cirujano no solo debe ser diestro con el bisturí de plata, sino también sabio en la lectura de las auras. \n\nRecientemente, se ha debatido si es lícito utilizar técnicas de cauterización espectral para detener hemorragias de esencia en pacientes que han sufrido ataques de entidades del vacío. Algunos argumentan que estas técnicas dañan permanentemente la estructura del alma, mientras que otros sostienen que es la única forma de salvar la vida física.\n\nNuestra conclusión preliminar es que la intervención debe estar siempre guiada por el 'Pálpito Vital' del paciente. Si la esencia todavía lucha, el acero debe ser servil a la voluntad de vivir."
  },
  {
    title: "Análisis de la Peste Etérea en los Reinos del Sur",
    date: "02 de Luna Calma, 1502",
    author: "Sanadora Elara",
    category: "Epidemiología Arcana",
    image: "https://picsum.photos/seed/spectral-virus/800/450",
    excerpt: "Las nuevas cepas de virus espectrales están desafiando nuestros escudos de plata tradicionales. Se recomienda el uso de...",
    content: "La Peste Etérea ha mutado. Lo que antes era una simple dolencia que afectaba el sueño, ahora se manifiesta como una cristalización de los canales de maná en el cuerpo humano. Los pacientes presentan fatiga extrema, marcas iridiscentes en la piel y una desconexión progresiva con el plano físico.\n\nHemos descubierto que los escudos de plata encantados, aunque todavía útiles, no son suficientes para filtrar las partículas más finas del virus. Recomendamos encarecidamente a todos los sanadores de campo que utilicen filtros de piedra lunar triturada y que realicen rituales de purificación salina al menos tres veces al día.\n\nLa investigación continúa en el laboratorio central para desarrollar una vacuna basada en la esencia de fénix sintetizada."
  },
  {
    title: "Técnicas de Sutura Temporal",
    date: "28 de Sol Invicto, 1501",
    author: "Cirujano Kaelen",
    category: "Cirugía Avanzada",
    image: "https://picsum.photos/seed/time-surgery/800/450",
    excerpt: "Cómo mantener un corazón latiendo fuera de su flujo temporal original durante una cirugía de reemplazo valvular místico...",
    content: "La sutura temporal es, quizás, la técnica más compleja que un cirujano arcano puede intentar. Consiste en congelar una pequeña porción del tejido en un bucle temporal de microsegundos mientras se realizan las incisiones necesarias. Esto evita que el paciente pierda sangre rítmicamente, permitiendo una visión clara del campo operatorio.\n\nSin embargo, el riesgo de 'desfase crónico' es alto. Un error de milímetros en el anclaje de la sutura puede provocar que el órgano operado envejezca o rejuvenezca décadas en cuestión de minutos tras cerrar la herida.\n\nEn este artículo, detallamos el uso de la espátula de cronos y el hilo de seda de araña del destino para asegurar que la reubicación temporal sea perfecta."
  }
];

export const QUICK_QUESTIONS: Question[] = [
  {
    id: 1,
    label: "Dictamen I de VII",
    text: "Ante un colapso inminente en la antecámara del templo, ¿qué dicta tu esencia: la precisión del bisturí o la velocidad del instinto?",
    options: [
      { id: '1a', text: "El análisis meticuloso del síntoma", sigil: "☤", alignment: "INTERNAL_MEDICINE" },
      { id: '1b', text: "La intervención súbita y vital", sigil: "✦", alignment: "EMERGENCY" },
      { id: '1c', text: "La precisión mecánica del corte", sigil: "⚔", alignment: "SURGERY" },
      { id: '1d', text: "La búsqueda del equilibrio orgánico", sigil: "❃", alignment: "PEDIATRICS" },
    ]
  },
  {
    id: 2,
    label: "Dictamen II de VII",
    text: "¿Dónde reside para ti el origen de la aflicción: en la carne tangible o en los susurros del alma?",
    options: [
      { id: '2a', text: "En los engranajes biológicos", sigil: "⚙", alignment: "SURGERY" },
      { id: '2b', text: "En el laberinto de la mente", sigil: "⚛", alignment: "PSYCHIATRY" },
      { id: '2c', text: "En la herencia de la sangre", sigil: "🧬", alignment: "GENETICS" },
      { id: '2d', text: "En el entorno que nos rodea", sigil: "🌿", alignment: "FAMILY_MEDICINE" },
    ]
  },
  {
    id: 3,
    label: "Dictamen III de VII",
    text: "Se te confía un grimorio con síntomas contradictorios. ¿Cuál es tu primer impulso?",
    options: [
      { id: '3a', text: "Clasificar y buscar patrones ocultos", sigil: "📜", alignment: "INTERNAL_MEDICINE" },
      { id: '3b', text: "Actuar sobre el síntoma más ruidoso", sigil: "🔥", alignment: "EMERGENCY" },
      { id: '3c', text: "Observar la evolución del silencio", sigil: "🌑", alignment: "PSYCHIATRY" },
      { id: '3d', text: "Consultar a los ancianos del gremio", sigil: "🕯", alignment: "FAMILY_MEDICINE" },
    ]
  },
  {
    id: 4,
    label: "Dictamen IV de VII",
    text: "En la calma de la noche, ¿qué tipo de victoria buscas?",
    options: [
      { id: '4a', text: "Una vida arrebatada a la muerte en un suspiro", sigil: "⚡", alignment: "EMERGENCY" },
      { id: '4b', text: "Un misterio resuelto tras días de estudio", sigil: "🔍", alignment: "INTERNAL_MEDICINE" },
      { id: '4c', text: "Una reconstrucción perfecta de la forma", sigil: "💎", alignment: "SURGERY" },
      { id: '4d', text: "El alivio del dolor crónico y persistente", sigil: "🌊", alignment: "PALLIATIVE" },
    ]
  },
  {
    id: 5,
    label: "Dictamen V de VII",
    text: "Si pudieras ver a través del velo, ¿qué observarías con más ahínco?",
    options: [
      { id: '5a', text: "El flujo incesante de la energía vital", sigil: "🌀", alignment: "CARDIOLOGY" },
      { id: '5b', text: "La arquitectura oculta de los huesos", sigil: "🦴", alignment: "TRAUMATOLOGY" },
      { id: '5c', text: "La micro-danza de las células", sigil: "🔬", alignment: "PATHOLOGY" },
      { id: '5d', text: "Las sombras que nublan la percepción", sigil: "🌫", alignment: "PSYCHIATRY" },
    ]
  },
  {
    id: 6,
    label: "Dictamen VI de VII",
    text: "¿Cuál es tu herramienta predilecta en la gran biblioteca médica?",
    options: [
      { id: '6a', text: "El acero templado y frío", sigil: "🗡", alignment: "SURGERY" },
      { id: '6b', text: "La dialéctica y la palabra", sigil: "🗣", alignment: "PSYCHIATRY" },
      { id: '6c', text: "El espejo que revela lo interno", sigil: "🪞", alignment: "RADIOLOGY" },
      { id: '6d', text: "La poción que restaura el orden", sigil: "🧪", alignment: "INTERNAL_MEDICINE" },
    ]
  },
  {
    id: 7,
    label: "Dictamen VII de VII",
    text: "Tu esencia se siente más viva cuando...",
    options: [
      { id: '7a', text: "El caos exige orden inmediato", sigil: "🆘", alignment: "EMERGENCY" },
      { id: '7b', text: "La curiosidad no encuentra límites", sigil: "♾", alignment: "RESEARCH" },
      { id: '7c', text: "La empatía se vuelve un bálsamo", sigil: "💖", alignment: "PEDIATRICS" },
      { id: '7d', text: "La técnica roza la perfección absoluta", sigil: "✨", alignment: "SURGERY" },
    ]
  }
];

export const EXTENSIVE_QUESTIONS: Question[] = [
  ...QUICK_QUESTIONS,
  {
    id: 8,
    label: "Dictamen VIII de XXI",
    text: "Un paciente rechaza un tratamiento vital por una creencia ancestral. ¿Cuál es tu postura ante el Gran Código?",
    options: [
      { id: '8a', text: "Respetar la autonomía absoluta del alma", sigil: "🤝", alignment: "FAMILY_MEDICINE" },
      { id: '8b', text: "Persuadir mediante la lógica científica pura", sigil: "🧠", alignment: "INTERNAL_MEDICINE" },
      { id: '8c', text: "Intervenir en la sombra para salvar la carne", sigil: "🌑", alignment: "SURGERY" },
      { id: '8d', text: "Trasladar la carga al comité de sabios", sigil: "🏛", alignment: "PSYCHIATRY" },
    ]
  },
  {
    id: 9,
    label: "Dictamen IX de XXI",
    text: "Si pudieras dominar un elemento de la naturaleza para sanar, ¿cuál elegirías?",
    options: [
      { id: '9a', text: "El Fuego: que cauteriza y destruye el mal", sigil: "🔥", alignment: "EMERGENCY" },
      { id: '9b', text: "El Agua: que fluye y limpia la impureza", sigil: "💧", alignment: "PEDIATRICS" },
      { id: '9c', text: "El Aire: que lleva el aliento de vida", sigil: "🌬", alignment: "CARDIOLOGY" },
      { id: '9d', text: "La Tierra: que sostiene y regenera", sigil: "🌱", alignment: "TRAUMATOLOGY" },
    ]
  },
  {
    id: 10,
    label: "Dictamen X de XXI",
    text: "¿Qué te produce más pavor: un error irreparable de tu mano o un diagnóstico que nadie puede ver?",
    options: [
      { id: '10a', text: "La herida causada por mi acero", sigil: "🩸", alignment: "SURGERY" },
      { id: '10b', text: "La verdad que permanece en la oscuridad", sigil: "🕯", alignment: "INTERNAL_MEDICINE" },
      { id: '10c', text: "El grito que no pude acallar a tiempo", sigil: "⌛", alignment: "EMERGENCY" },
      { id: '10d', text: "La mirada de un niño que no comprendo", sigil: "👁", alignment: "PEDIATRICS" },
    ]
  },
  {
    id: 11,
    label: "Dictamen XI de XXI",
    text: "En el gran teatro de la vida, te ves a ti mismo como...",
    options: [
      { id: '11a', text: "El director que orquestra el rescate", sigil: "🎭", alignment: "EMERGENCY" },
      { id: '11b', text: "El artesano que repara la estructura", sigil: "⚒", alignment: "TRAUMATOLOGY" },
      { id: '11c', text: "El detective que busca al culpable", sigil: "🕵", alignment: "INTERNAL_MEDICINE" },
      { id: '11d', text: "El guía que acompaña en el viaje final", sigil: "👣", alignment: "PALLIATIVE" },
    ]
  },
  {
    id: 12,
    label: "Dictamen XII de XXI",
    text: "Se te ofrece un artefacto que prolonga la vida a costa del equilibrio natural. ¿Qué haces?",
    options: [
      { id: '12a', text: "Lo uso sin dudar ante una muerte inminente", sigil: "⚡", alignment: "EMERGENCY" },
      { id: '12b', text: "Lo estudio para entender sus leyes primero", sigil: "📖", alignment: "RESEARCH" },
      { id: '12c', text: "Lo destruyo; la muerte es parte del ciclo", sigil: "🍂", alignment: "FAMILY_MEDICINE" },
      { id: '12d', text: "Lo reservo solo para casos de extrema rareza", sigil: "📦", alignment: "GENETICS" },
    ]
  },
  {
    id: 13,
    label: "Dictamen XIII de XXI",
    text: "¿Cuál es el sonido que más resuena en tu memoria?",
    options: [
      { id: '13a', text: "El latido constante de un corazón", sigil: "💓", alignment: "CARDIOLOGY" },
      { id: '13b', text: "El silencio absoluto de un quirófano", sigil: "🔇", alignment: "SURGERY" },
      { id: '13c', text: "La risa que interrumpe el dolor", sigil: "😄", alignment: "PEDIATRICS" },
      { id: '13d', text: "El suspiro de alivio tras la noticia", sigil: "😌", alignment: "FAMILY_MEDICINE" },
    ]
  },
  {
    id: 14,
    label: "Dictamen XIV de XXI",
    text: "Si tuvieras que pasar el resto de tu vida en una sola sala de la Academia...",
    options: [
      { id: '14a', text: "El laboratorio alquímico de fluidos", sigil: "🧪", alignment: "PATHOLOGY" },
      { id: '14b', text: "El observatorio de luces y sombras", sigil: "🔭", alignment: "RADIOLOGY" },
      { id: '14c', text: "La sala de urgencia permanente", sigil: "🚨", alignment: "EMERGENCY" },
      { id: '14d', text: "El jardín de consultas tranquilas", sigil: "⛲", alignment: "FAMILY_MEDICINE" },
    ]
  },
  {
    id: 15,
    label: "Dictamen XV de XXI",
    text: "Un colega comete un desliz menor pero peligroso. El honor te dicta...",
    options: [
      { id: '15a', text: "Corregirlo en silencio y proteger al hermano", sigil: "🤫", alignment: "SURGERY" },
      { id: '15b', text: "Informar a los superiores por el bien común", sigil: "📜", alignment: "INTERNAL_MEDICINE" },
      { id: '15c', text: "Enfrentarlo cara a cara y exigir rectitud", sigil: "⚔", alignment: "EMERGENCY" },
      { id: '15d', text: "Mediar para hallar una solución pedagógica", sigil: "🎓", alignment: "RESEARCH" },
    ]
  },
  {
    id: 16,
    label: "Dictamen XVI de XXI",
    text: "¿Qué parte de la anatomía oculta los secretos más profundos?",
    options: [
      { id: '16a', text: "El cerebro: el trono de la conciencia", sigil: "🧠", alignment: "PSYCHIATRY" },
      { id: '16b', text: "El corazón: el motor del alma", sigil: "❤️", alignment: "CARDIOLOGY" },
      { id: '16c', text: "El abdomen: el caldero de las emociones", sigil: "🥣", alignment: "SURGERY" },
      { id: '16d', text: "La piel: el mapa de nuestra historia", sigil: "📜", alignment: "PATHOLOGY" },
    ]
  },
  {
    id: 17,
    label: "Dictamen XVII de XXI",
    text: "La tecnología médica es para ti...",
    options: [
      { id: '17a', text: "Una extensión necesaria de mis sentidos", sigil: "👓", alignment: "RADIOLOGY" },
      { id: '17b', text: "Un frío sustituto del contacto humano", sigil: "🤝", alignment: "FAMILY_MEDICINE" },
      { id: '17c', text: "La clave para la inmortalidad futura", sigil: "🧬", alignment: "RESEARCH" },
      { id: '17d', text: "Solo una herramienta, el azar manda", sigil: "🎲", alignment: "EMERGENCY" },
    ]
  },
  {
    id: 18,
    label: "Dictamen XVIII de XXI",
    text: "En un mundo sin enfermedades, ¿qué serías?",
    options: [
      { id: '18a', text: "Un filósofo de la mente", sigil: "🏛", alignment: "PSYCHIATRY" },
      { id: '18b', text: "Un artista de la forma física", sigil: "🎨", alignment: "SURGERY" },
      { id: '18c', text: "Un explorador de nuevos mundos", sigil: "⛵", alignment: "RESEARCH" },
      { id: '18d', text: "Un maestro para los jóvenes", sigil: "🍎", alignment: "PEDIATRICS" },
    ]
  },
  {
    id: 19,
    label: "Dictamen XIX de XXI",
    text: "¿Cuál es tu relación con el fracaso?",
    options: [
      { id: '19a', text: "Un fuego que me obliga a mejorar", sigil: "🔥", alignment: "SURGERY" },
      { id: '19b', text: "Una cicatriz que guardo con humildad", sigil: "🩹", alignment: "INTERNAL_MEDICINE" },
      { id: '19c', text: "Un riesgo aceptado por salvar a alguien", sigil: "🎲", alignment: "EMERGENCY" },
      { id: '19d', text: "Una lección que comparto con todos", sigil: "📢", alignment: "FAMILY_MEDICINE" },
    ]
  },
  {
    id: 20,
    label: "Dictamen XX de XXI",
    text: "Se dice que el médico es un semidiós. ¿Qué opinas?",
    options: [
      { id: '20a', text: "Solo cuando el acero toca la carne", sigil: "👑", alignment: "SURGERY" },
      { id: '20b', text: "Somos meros traductores de la naturaleza", sigil: "📜", alignment: "INTERNAL_MEDICINE" },
      { id: '20c', text: "Somos esclavos de la necesidad ajena", sigil: "⛓", alignment: "EMERGENCY" },
      { id: '20d', text: "Somos jardineros en un mundo ajeno", sigil: "🌻", alignment: "PEDIATRICS" },
    ]
  },
  {
    id: 21,
    label: "Dictamen XXI de XXI",
    text: "Tu última palabra antes del gran velo sería...",
    options: [
      { id: '21a', text: "¡Sámenlo!", sigil: "🙌", alignment: "EMERGENCY" },
      { id: '21b', text: "¡Comprendo!", sigil: "💡", alignment: "INTERNAL_MEDICINE" },
      { id: '21c', text: "¡Gracias!", sigil: "🙏", alignment: "FAMILY_MEDICINE" },
      { id: '21d', text: "¡Espera!", sigil: "✋", alignment: "RESEARCH" },
    ]
  }
];

export const SPECIALTIES_MAP: Record<string, Specialty> = {
  "SURGERY": {
    id: "SURGERY",
    name: "Casa del Acero Preciso (Cirugía)",
    description: "Para aquellos de voluntad inquebrantable y pulso de diamante. En esta casa, el cuerpo es un templo que debe ser restaurado con la perfección de un orfebre y el coraje de un caballero.",
    alternatives: ["Traumatología", "Urología"],
    rationale: "Tu determinación y precisión te marcan como un heredero natural de las artes quirúrgicas.",
    hogwartsHouse: "Slytherin"
  },
  "EMERGENCY": {
    id: "EMERGENCY",
    name: "Casa de la Sanación Súbita (Urgencias)",
    description: "Donde el tiempo se detiene y solo importa el instinto. Los miembros de esta casa son los primeros en el campo de batalla contra la Parca, especialistas en arrebatar almas del abismo.",
    alternatives: ["Intensivos", "Anestesiología"],
    rationale: "Prosperas en el caos; tu mente se aclara cuando el mundo se desmorona.",
    hogwartsHouse: "Gryffindor"
  },
  "INTERNAL_MEDICINE": {
    id: "INTERNAL_MEDICINE",
    name: "Casa del Enigma Interno (Medicina Interna)",
    description: "Dedicada a los buscadores de la verdad oculta. Aquí, la medicina es un misterio arcano que se resuelve mediante la paciencia, el estudio de los signos y la sabiduría de los siglos.",
    alternatives: ["Oncología", "Infectología"],
    rationale: "Tu sed de conocimiento y paciencia infinita te guían hacia el corazón de los misterios médicos.",
    hogwartsHouse: "Ravenclaw"
  },
  "PSYCHIATRY": {
    id: "PSYCHIATRY",
    name: "Casa del Laberinto Mental (Psiquiatría)",
    description: "Exploradores de lo invisible. En esta casa se estudian los susurros de la psique y se tejen puentes entre las sombras del alma y la luz de la razón.",
    alternatives: ["Neurología", "Psicología Clínica"],
    rationale: "Posees la rara cualidad de escuchar lo que no se dice y ver lo que otros ignoran.",
    hogwartsHouse: "Ravenclaw"
  },
  "PEDIATRICS": {
    id: "PEDIATRICS",
    name: "Casa del Semillero Eterno (Pediatría)",
    description: "Protectores de los brotes más frágiles del reino. Un camino de empatía pura y cuidado devoto, donde sanar a un niño es asegurar el brillo de las estrellas futuras.",
    alternatives: ["Neonatología", "Medicina Familiar"],
    rationale: "Tu pureza de intención y calidez humana te vinculan irrevocablemente con el cuidado de los más jóvenes.",
    hogwartsHouse: "Hufflepuff"
  },
  "FAMILY_MEDICINE": {
    id: "FAMILY_MEDICINE",
    name: "Casa de la Sabiduría Comunitaria (Medicina Familiar)",
    description: "Guardianes de la historia y el equilibrio. Miembros de esta casa conocen no solo la herida, sino el hogar que la alberga, cuidando el tejido social que nos une a todos.",
    alternatives: ["Geriatría", "Medicina Comunitaria"],
    rationale: "Valorás la conexión humana por encima de la técnica aislada; eres el nexo del bienestar.",
    hogwartsHouse: "Hufflepuff"
  }
};
