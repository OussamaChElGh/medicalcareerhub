import { motion } from 'motion/react';
import { AlertTriangle, ArrowRight, BookOpen, ScrollText, ShieldCheck } from 'lucide-react';

interface V2AboutProps {
  onOpenCatalog: () => void;
}

const DIMENSIONS = [
  ['A1', 'Estilo cognitivo', 'Integrar y diagnosticar frente a resolver técnicamente.'],
  ['A2', 'Procedimientos', 'Peso de las técnicas y la intervención.'],
  ['A3', 'Ritmo', 'Actividad programada frente a urgencia e imprevisibilidad.'],
  ['A4', 'Continuidad', 'Episodios concretos frente a seguimiento durante años.'],
  ['A5', 'Contacto clínico', 'Relación directa intensa frente a trabajo más técnico.'],
  ['A6', 'Población', 'Edad y contexto de los pacientes.'],
  ['A7', 'Resultado', 'Curar, controlar, restaurar, aliviar, prevenir o diagnosticar.'],
  ['A8', 'Contenido científico', 'Anatomía y estructura frente a mecanismos y biología molecular.'],
  ['A9', 'Entorno', 'Urgencias, quirófano, planta, consulta, laboratorio o imagen.'],
  ['A10', 'Sistemas', 'Sistema u órgano que más te interesa estudiar.'],
  ['C1', 'Tolerancia emocional', 'Incertidumbre, sufrimiento, presión y final de la vida.'],
  ['C2', 'Condiciones laborales', 'Guardias, previsibilidad, flexibilidad e investigación.'],
];

export function V2About({ onOpenCatalog }: V2AboutProps) {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-10"
      >
        <header className="space-y-4 border-b border-gold/15 pb-6">
          <div className="flex items-center gap-3 text-medical-teal">
            <ScrollText size={22} />
            <p className="text-[10px] uppercase tracking-[0.4em]">El método de Arcanum</p>
          </div>
          <h1 className="font-display text-3xl font-bold text-gold magic-shadow sm:text-5xl">
            Cómo se calcula tu perfil
          </h1>
          <p className="max-w-3xl font-classic text-lg italic leading-relaxed text-parchment/70 sm:text-xl">
            Arcanum Medicum no adivina tu especialidad. Compara tus preferencias con un catálogo de
            perfiles profesionales y te muestra dónde encajas mejor, con qué límites y qué deberías
            explorar antes de decidir.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="font-magic text-2xl text-gold">Qué mide</h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {DIMENSIONS.map(([code, label, description]) => (
              <div key={code} className="border border-gold/15 bg-black/20 p-4">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[10px] text-medical-teal/70">{code}</span>
                  <h3 className="font-sans text-sm font-semibold text-parchment">{label}</h3>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-parchment/50">{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-magic text-2xl text-gold">Cómo funciona</h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {[
              {
                title: '14 preguntas gratuitas',
                text: 'Construyen un perfil inicial y muestran un top 5 con bandas de afinidad y nivel de confianza.',
              },
              {
                title: '40–44 preguntas extensivas',
                text: 'La rama adaptativa añade 8–12 ítems de desempate según la incertidumbre de tu resultado.',
              },
              {
                title: 'Resultado explicable',
                text: 'Ves por qué encaja cada especialidad, qué puntos de fricción existen y qué conviene explorar.',
              },
            ].map((item) => (
              <div key={item.title} className="border border-gold/20 bg-gold/5 p-5">
                <h3 className="font-display text-base font-bold text-gold">{item.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-parchment/60">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4 border border-amber-400/20 bg-amber-400/5 p-5">
          <div className="flex items-center gap-3 text-amber-200/80">
            <AlertTriangle size={18} />
            <h2 className="font-magic text-xl">Qué no es</h2>
          </div>
          <ul className="space-y-2 text-sm leading-relaxed text-parchment/65">
            <li>No es un test psicométricamente validado: es un prototipo metodológicamente cuidado.</li>
            <li>No predice tu éxito profesional ni sustituye el consejo de tutores o residentes.</li>
            <li>
              Las fichas son <strong>perfiles preliminares</strong> de una beta y no han sido
              validadas clínicamente.
            </li>
            <li>Las condiciones laborales reales dependen del hospital, el país, el puesto y el momento.</li>
            <li>No sustituye la información oficial del MIR ni la normativa vigente.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3 text-gold">
            <ShieldCheck size={18} />
            <h2 className="font-magic text-2xl">Qué puedes hacer ahora</h2>
          </div>
          <p className="text-sm leading-relaxed text-parchment/60">
            Si quieres ver las fichas antes de hacer el test, abre el catálogo. Si prefieres empezar,
            el Sombrero está esperando.
          </p>
          <button
            onClick={onOpenCatalog}
            className="inline-flex items-center gap-2 border border-gold/50 bg-gold/10 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold/20"
          >
            <BookOpen size={14} />
            Explorar el catálogo
            <ArrowRight size={14} />
          </button>
        </section>
      </motion.div>
    </div>
  );
}
