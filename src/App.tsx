import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AtmosphericFrame } from './components/AtmosphericFrame';
import { SortingHat } from './components/SortingHat';
import { TypewriterText } from './components/TypewriterText';
import { Navbar } from './components/Navbar';
import { PaymentInterface } from './components/PaymentInterface';
import { QUICK_QUESTIONS, EXTENSIVE_QUESTIONS, SPECIALTIES_MAP, BLOG_POSTS } from './constants';
import { Scene, Specialty, Option, QuizType, BlogPost } from './types';
import { getHatThought, getFinalJudgment } from './lib/gemini';
import { Stethoscope, ArrowRight, Sparkles, Wand2, FlaskConical, BookOpen, ScrollText, Shield, CheckCircle2, Circle, CreditCard, Zap, Crown, Newspaper, Calendar, User, ArrowLeft } from 'lucide-react';

export default function App() {
  const [scene, setScene] = useState<Scene | 'ABOUT' | 'SPECIALTIES' | 'BLOG'>('HOME');
  const [quizType, setQuizType] = useState<QuizType | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [hatThought, setHatThought] = useState<string>('"Veo un pulso firme... pero una mente que se deleita en el caos de lo inmediato..."');
  const [usedThoughts, setUsedThoughts] = useState<string[]>([]);
  const [showThought, setShowThought] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [result, setResult] = useState<Specialty | null>(null);
  const [personalizedJudgment, setPersonalizedJudgment] = useState<string>("");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const activeQuestions = useMemo(() => {
    return quizType === 'EXTENSIVE' ? EXTENSIVE_QUESTIONS : QUICK_QUESTIONS;
  }, [quizType]);

  const progress = Math.round(((currentQuestionIdx + 1) / activeQuestions.length) * 100);

  const currentQuestion = activeQuestions[currentQuestionIdx];

  const handleStart = () => {
    setScene('SELECTION');
  };

  const startQuiz = (type: QuizType) => {
    setQuizType(type);
    setCurrentQuestionIdx(0);
    setAnswers([]);
    setUsedThoughts([]);
    setResult(null);
    setScene('QUIZ');
    setShowThought(true);
  };

  const handleModeSelection = (type: QuizType) => {
    if (type === 'EXTENSIVE') {
      setScene('PAYMENT');
    } else {
      startQuiz('QUICK');
    }
  };

  const handlePaymentSuccess = () => {
    startQuiz('EXTENSIVE');
  };

  const handleNavigate = (newScene: Scene | 'ABOUT' | 'SPECIALTIES' | 'BLOG') => {
    setSelectedPost(null);
    if (newScene === 'QUIZ' && scene !== 'QUIZ') {
      handleStart();
    } else {
      setScene(newScene);
    }
  };

  const handleOptionSelect = async (option: Option) => {
    if (isThinking) return;

    const newAnswers = [...answers, option.alignment];
    setAnswers(newAnswers);

    const calculateResultInternal = (finalAnswers: string[]) => {
      const counts: Record<string, number> = {};
      finalAnswers.forEach(ans => {
        counts[ans] = (counts[ans] || 0) + 1;
      });

      let topSpecialty = "INTERNAL_MEDICINE";
      let max = 0;
      Object.entries(counts).forEach(([id, count]) => {
        if (count > max) {
          max = count;
          topSpecialty = id;
        }
      });

      return SPECIALTIES_MAP[topSpecialty] || SPECIALTIES_MAP["INTERNAL_MEDICINE"];
    };

    if (currentQuestionIdx < activeQuestions.length - 1) {
      setIsThinking(true);
      setShowThought(true);
      
      const quickMumbles = [
        "Mmm... previsible, como una gripe en invierno.", 
        "¿De verdad? Tu corteza cerebral parece estar de vacaciones.", 
        "Curiosa falta de criterio... huelo una negligencia intelectual inminente.", 
        "Vaya, otra mente que confunde la medicina con un pasatiempo.", 
        "Típico de tu clase... mucho ego y poca sustancia anatómica.",
        "Interesante (y no en el buen sentido)... esto acabará en autopsia.",
        "Hmm, qué poca imaginación... eres tan plano como un ECG de un muerto.",
        "Diagnóstico: Predecible. Prescribo dos dosis de humildad.",
        "Huelo... mediocridad. Y un poco de miedo ante el bisturí.",
        "¿Eso es todo? He visto amebas con planes más ambiciosos.",
        "Tiembla el bisturí... tus nervios están más tensos que una sutura mal hecha.",
        "Veo un patrón... preocupante. Parece una arritmia de decisiones.",
        "Inquietante elección. Como recetar morfina para un estornudo.",
        "¿Quién te dejó entrar? Tu expediente debe ser pura ficción.",
        "Mmm, arrogante. Tienes el complejo de Dios pero sin los milagros.",
        "Típico síntoma de aprendiz que se cree eminencia.",
        "Ni el éter te salvará de esa estupidez que acabas de elegir.",
        "Ya veo hacia dónde vas. Directo al fracaso clínico.",
        "¿Esa es tu respuesta final? Pobre alma, tu destino está en cuidados paliativos.",
        "Sigo buscando tu intelecto... debe estar escondido bajo esa capa."
      ];
      
      // Filter out used quick mumbles to ensure variety
      const availableMumbles = quickMumbles.filter(m => !usedThoughts.includes(m));
      const mumblePool = availableMumbles.length > 0 ? availableMumbles : quickMumbles;
      const selectedMumble = mumblePool[Math.floor(Math.random() * mumblePool.length)];
      
      setHatThought(selectedMumble);
      setUsedThoughts(prev => [...prev, selectedMumble]);
      
      // Snappy transition to next question
      setTimeout(() => {
        setCurrentQuestionIdx(prev => prev + 1);
        setIsThinking(false);
      }, 400);

      // Get AI reflection
      getHatThought([...answers], currentQuestion.text, option.text, usedThoughts).then(thought => {
        setHatThought(thought);
        setUsedThoughts(prev => [...prev, thought]);
      });
    } else {
      // End of quiz - Reaction to last answer first
      setShowThought(true);
      setHatThought("Ya veo... tu destino está sellado...");
      
      setIsThinking(true);
      setScene('THINK');
      const finalResult = calculateResultInternal(newAnswers);
      setResult(finalResult);

      getFinalJudgment(
        finalResult.name, 
        finalResult.description, 
        newAnswers
      ).then(judgment => {
        setPersonalizedJudgment(judgment);
      });
      
      setTimeout(() => {
        setIsThinking(false);
        setScene('RESULT');
      }, 2000);
    }
  };

  return (
    <AtmosphericFrame>
      <Navbar onNavigate={handleNavigate} activeScene={scene} />
      
      <div className={`relative w-full flex flex-col ${scene === 'BLOG' ? 'items-stretch' : 'items-center px-4 sm:px-6 md:px-12'} ${['QUIZ', 'THINK'].includes(scene) ? 'pt-16 pb-8 sm:pt-32 sm:pb-8' : 'pt-24 pb-10 sm:pt-40 sm:pb-20'} transition-all duration-500`}>
        
        {/* Header - More flexible positioning */}
        <AnimatePresence>
          {scene !== 'BLOG' && scene !== 'QUIZ' && scene !== 'THINK' && scene !== 'RESULT' && (
            <motion.header 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full text-center pb-6 md:pb-12 space-y-2 pointer-events-none overflow-hidden"
            >
              <motion.p 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 0.8, y: 0 }}
                className="text-gold uppercase tracking-[0.4em] text-[10px] sm:text-xs font-magic font-medium"
              >
                Algoritmo de Orientación Vocacional Médica
              </motion.p>
              <motion.h1 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-3xl sm:text-5xl font-display font-bold text-gold tracking-widest magic-shadow uppercase"
              >
                No eliges tu especialidad. Tu especialidad te elige a ti.
              </motion.h1>
            </motion.header>
          )}
        </AnimatePresence>

        {/* Main Stage */}
        <main className={`w-full ${scene === 'BLOG' ? 'max-w-none' : ['ABOUT', 'SPECIALTIES'].includes(scene) ? 'max-w-6xl mx-auto' : 'max-w-6xl mx-auto'} flex flex-col ${['QUIZ', 'RESULT', 'THINK'].includes(scene) ? 'lg:flex-row lg:items-start lg:gap-12' : 'items-center'} flex-grow space-y-4 md:space-y-6 transition-all duration-700`}>
          
          {/* Only show Hat in Home and Desktop Quiz/Result scenes */}
          {['HOME', 'RESULT', 'THINK', 'QUIZ'].includes(scene) && (
            <div className={`relative flex flex-col items-center flex-shrink-0 ${['QUIZ', 'RESULT', 'THINK'].includes(scene) ? 'hidden lg:flex lg:sticky lg:top-24 lg:w-[350px]' : 'w-full'}`}>
              <SortingHat thinking={isThinking} />
              
              {/* Thought Bubble - Redesigned: Spectral Glass Aesthetic */}
              <div className="w-full relative min-h-[160px] flex justify-center perspective-[1000px]">
                <AnimatePresence mode='wait'>
                  {showThought && (
                    <motion.div
                      key={hatThought}
                      initial={{ opacity: 0, scale: 0.9, rotateX: -10, y: 20 }}
                      animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ type: "spring", damping: 20, stiffness: 100 }}
                      className="mt-6 relative w-full p-8 bg-black/40 backdrop-blur-xl border border-gold/30 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_20px_rgba(197,160,89,0.1)] overflow-hidden"
                    >
                      {/* Decorative Corner Accents */}
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-gold/40 rounded-tl-lg" />
                      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-gold/40 rounded-tr-lg" />
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-gold/40 rounded-bl-lg" />
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-gold/40 rounded-br-lg" />
                      
                      {/* Pointing Tail Wrapper */}
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rotate-45 bg-black/40 border-t border-l border-gold/30 backdrop-blur-xl" />

                      <div className="relative z-10">
                        <TypewriterText 
                          text={hatThought} 
                          speed={25} 
                          className="text-gold/90 italic font-sans text-2xl leading-relaxed tracking-tight text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                        />
                      </div>

                      {/* Moving light sweep effect */}
                      <motion.div 
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/5 to-transparent skew-x-12"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Interactive Area */}
          <div className={`w-full ${['QUIZ', 'RESULT', 'THINK'].includes(scene) ? 'lg:flex-grow lg:max-w-none' : 'max-w-2xl'}`}>
            <AnimatePresence mode="wait">
              {scene === 'HOME' && (
                <motion.div 
                  key="home"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex flex-col items-center text-center space-y-8 py-12"
                >
                  <p className="text-xl sm:text-2xl text-parchment/80 max-w-lg font-classic italic leading-relaxed">
                    Aspirante, el sistema de orientación avanzada ha sido activado. 
                    Permita que el algoritmo analice su perfil profesional para revelar su especialidad idónea.
                  </p>
                  <button
                    onClick={handleStart}
                    className="group relative px-10 py-4 border border-gold hover:bg-gold/10 transition-all duration-500 overflow-hidden"
                  >
                    <span className="relative z-10 text-gold text-lg tracking-[0.2em] font-magic font-medium uppercase py-2">
                      Someterme al Juicio
                    </span>
                    <motion.div 
                      className="absolute inset-x-0 bottom-0 h-0.5 bg-gold"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                    />
                  </button>
                </motion.div>
              )}

              {scene === 'ABOUT' && (
                <motion.div 
                  key="about"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass-surface p-10 space-y-8 text-parchment font-sans leading-relaxed"
                >
                  <div className="flex items-center space-x-4 border-b border-gold/20 pb-4">
                    <ScrollText className="text-gold" size={32} />
                    <h2 className="text-3xl font-display font-bold italic tracking-wide magic-shadow">Sabiduría de la Academia</h2>
                  </div>
                  <div className="space-y-6 text-lg opacity-80 italic">
                    <p>
                      Nuestro sistema de orientación vocacional médica ha sido desarrollado para ayudar a los profesionales y estudiantes a identificar la especialidad que mejor se alinea con su perfil cognitivo, habilidades técnicas y preferencias asistenciales.
                    </p>
                    <p>
                      A través de una serie de dilemas clínicos y situaciones de práctica diaria, el algoritmo analiza cuatro dimensiones clave: Resolución Técnica, Gestión de Crisis, Razonamiento Diagnóstico y Atención Social.
                    </p>
                  </div>
                  <button 
                    onClick={() => handleNavigate('HOME')}
                    className="text-gold uppercase tracking-widest text-xs border-b border-gold/40 pb-1"
                  >
                    Regresar al Atrio
                  </button>
                </motion.div>
              )}

              {scene === 'SPECIALTIES' && (
                <motion.div 
                  key="specialties"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass-surface p-10 space-y-8 max-h-[600px] overflow-y-auto mask-fade custom-scrollbar"
                >
                  <div className="flex items-center space-x-4 border-b border-gold/20 pb-4 sticky top-0 bg-bg-deep/80 backdrop-blur z-10">
                    <BookOpen className="text-gold" size={32} />
                    <h2 className="text-3xl font-display font-bold italic tracking-wide magic-shadow text-parchment">Catálogo de Especialidades</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-8">
                    {Object.values(SPECIALTIES_MAP).map((spec) => (
                      <div key={spec.id} className="group border-l-2 border-gold/20 pl-6 space-y-2 hover:border-gold transition-colors">
                        <div className="flex items-center justify-between">
                          <h3 className="text-2xl font-magic text-gold italic">{spec.name}</h3>
                          {spec.hogwartsHouse && (
                            <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded border ${
                              spec.hogwartsHouse === 'Gryffindor' ? 'text-red-400 border-red-900/50 bg-red-900/10' :
                              spec.hogwartsHouse === 'Slytherin' ? 'text-emerald-400 border-emerald-900/50 bg-emerald-900/10' :
                              spec.hogwartsHouse === 'Ravenclaw' ? 'text-blue-400 border-blue-900/50 bg-blue-900/10' :
                              'text-yellow-400 border-yellow-900/50 bg-yellow-900/10'
                            }`}>
                              Casa {spec.hogwartsHouse}
                            </span>
                          )}
                        </div>
                        <p className="text-parchment/60 font-sans italic">{spec.description}</p>
                        <div className="flex flex-wrap gap-2 pt-2">
                          {spec.alternatives.map(alt => (
                            <span key={alt} className="text-[10px] uppercase tracking-tighter border border-gold-dim px-2 text-gold-dim">{alt}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {scene === 'SELECTION' && (
                <motion.div
                  key="selection"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="glass-surface p-8 sm:p-12 space-y-8 w-full shadow-2xl text-center max-w-2xl mx-auto"
                >
                  <div className="space-y-4">
                    <Crown className="text-gold mx-auto" size={48} />
                    <h2 className="text-3xl font-display font-bold text-parchment tracking-widest uppercase">Evaluación de Especialidad Médica</h2>
                    <p className="text-parchment/60 italic font-sans">Identifique su perfil profesional mediante nuestro algoritmo de orientación vocacional.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Quick Quiz */}
                    <button
                      onClick={() => handleModeSelection('QUICK')}
                      className="group p-6 border border-gold/20 hover:border-gold/50 bg-white/5 hover:bg-white/10 transition-all rounded-sm flex flex-col items-center space-y-4"
                    >
                      <Zap size={32} className="text-gold-dim group-hover:text-gold" />
                      <div>
                        <h3 className="text-xl text-parchment font-sans tracking-wide">Evaluación Básica</h3>
                        <p className="text-[10px] text-parchment/40 uppercase tracking-widest mt-1">Acceso Gratuito</p>
                      </div>
                      <p className="text-xs text-parchment/60 leading-relaxed italic">
                        12 preguntas esenciales para un perfilado rápido de su área de interés.
                      </p>
                    </button>

                    {/* Extensive Quiz */}
                    <button
                      onClick={() => handleModeSelection('EXTENSIVE')}
                      className="group p-6 border-2 border-gold/40 hover:border-gold bg-gold/5 hover:bg-gold/10 transition-all rounded-sm shadow-[0_0_20px_rgba(197,160,89,0.1)] flex flex-col items-center space-y-4"
                    >
                      <Sparkles size={32} className="text-gold" />
                      <div>
                        <h3 className="text-xl text-gold font-sans tracking-wide">Perfil Profesional Completo</h3>
                        <p className="text-[10px] text-gold/80 font-bold uppercase tracking-widest mt-1">Acceso Premium</p>
                      </div>
                      <p className="text-xs text-parchment/70 leading-relaxed italic">
                        60 ítems detallados. Obtenga un informe exhaustivo de compatibilidad con todas las especialidades.
                      </p>
                    </button>
                  </div>

                  <button
                    onClick={() => setScene('HOME')}
                    className="text-parchment/40 hover:text-parchment transition-colors text-xs uppercase tracking-widest pt-4"
                  >
                    Regresar al Umbral
                  </button>
                </motion.div>
              )}

              {scene === 'PAYMENT' && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="glass-surface p-8 sm:p-12 space-y-8 w-full shadow-2xl max-w-md mx-auto relative overflow-hidden"
                >
                  <div className="relative z-10 text-center space-y-6">
                    <div className="space-y-2">
                       <h2 className="text-2xl font-display font-bold text-parchment tracking-widest magic-shadow uppercase">Ofrenda a la Academia</h2>
                       <p className="text-parchment/60 text-sm italic">Desbloquea el Examen Arcano completo</p>
                    </div>

                    <div className="bg-white/5 p-6 rounded-sm border border-gold/10 space-y-4">
                      <div className="flex justify-between items-center text-parchment">
                        <span className="font-magic text-sm tracking-wide">Examen de 60 Dictámenes</span>
                        <span className="font-mono text-gold font-bold">4.99 EUR</span>
                      </div>
                    </div>

                    <PaymentInterface 
                      onSuccess={handlePaymentSuccess} 
                      onCancel={() => setScene('SELECTION')} 
                    />

                    <p className="text-[9px] text-parchment/30 uppercase tracking-tighter mt-4">
                      Pago seguro a través de Gringotts Express
                    </p>
                  </div>
                </motion.div>
              )}

              {scene === 'QUIZ' && currentQuestion && (
                <motion.div 
                  key={`question-${currentQuestion.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="glass-surface p-6 sm:p-12 space-y-6 sm:space-y-8 w-full shadow-2xl relative overflow-visible"
                >
                  <div className="sticky top-0 lg:static z-40 bg-academy-navy/95 backdrop-blur-md lg:bg-transparent lg:backdrop-blur-none -mx-6 -mt-6 rounded-t-sm border-b border-gold/10 lg:border-none lg:m-0 flex flex-col">
                    <div className="p-4 sm:p-6 flex items-start gap-4 pt-5">
                      {/* Mobile Hat Icon only */}
                      <div className="lg:hidden flex-shrink-0 bg-gold/5 border border-gold/20 p-1 rounded-full w-16 h-16 sm:w-24 sm:h-24 flex items-center justify-center shadow-[0_0_15px_rgba(197,160,89,0.2)]">
                        <div className="relative w-full h-full flex items-center justify-center">
                          <SortingHat compact thinking={isThinking} />
                        </div>
                      </div>
                      
                      <div className="space-y-1 flex-1 pt-1">
                        <div className="flex items-center justify-between">
                          <span className="text-gold-dim text-[8px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em] font-sans">
                            {currentQuestion.label}
                          </span>
                          {isThinking && (
                            <motion.span 
                              animate={{ opacity: [0.4, 1, 0.4] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                              className="text-medical-teal text-[8px] uppercase font-magic"
                            >
                              Pensando...
                            </motion.span>
                          )}
                        </div>
                        <h2 className="text-base sm:text-2xl text-parchment leading-tight font-sans font-semibold italic lg:line-clamp-none">
                          {currentQuestion.text}
                        </h2>
                      </div>
                    </div>

                    {/* Mobile Thought Bubble - Spectral Ribbon below the hat row */}
                    <AnimatePresence mode='wait'>
                      {showThought && (
                        <motion.div
                          key={hatThought}
                          initial={{ opacity: 0, height: 0, y: -10 }}
                          animate={{ opacity: 1, height: 'auto', y: 0 }}
                          exit={{ opacity: 0, height: 0 }}
                          className="lg:hidden px-6 pb-6 relative"
                        >
                          {/* Pointer to the hat */}
                          <div className="absolute top-[-4px] left-12 w-4 h-4 rotate-45 bg-academy-navy border-t border-l border-gold/20 z-10" />
                          
                          <div className="relative p-4 bg-black/30 backdrop-blur-lg border border-gold/20 rounded-xl shadow-2xl overflow-hidden group">
                            <div className="text-gold italic font-sans text-sm sm:text-base text-center leading-snug tracking-wide relative z-10">
                              "{hatThought}"
                            </div>
                            
                            {/* Animated mist background */}
                            <motion.div 
                              animate={{ 
                                opacity: [0.05, 0.1, 0.05],
                                scale: [1, 1.1, 1]
                              }}
                              transition={{ duration: 4, repeat: Infinity }}
                              className="absolute inset-0 bg-radial-gradient from-gold/10 to-transparent pointer-events-none" 
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4 pt-2">
                    {currentQuestion.options.map((option) => (
                      <button
                        key={option.id}
                        disabled={isThinking}
                        onClick={() => handleOptionSelect(option)}
                        className="group flex items-center justify-between p-3 sm:p-5 border border-gold/30 bg-gold/5 hover:bg-gold/20 hover:border-gold transition-all text-left disabled:opacity-50"
                      >
                        <span className="text-parchment group-hover:text-gold transition-colors font-magic text-sm sm:text-lg pr-2 sm:pr-4">
                          {option.text}
                        </span>
                        <span className="text-gold/50 group-hover:text-gold text-base sm:text-xl transition-all flex-shrink-0">
                          {option.sigil}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Decorative ink blot */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-3xl pointer-events-none" />
                </motion.div>
              )}

              {scene === 'THINK' && (
                <motion.div
                  key="thinking"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center space-y-12 py-20 text-center"
                >
                  <div className="relative">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      className="w-24 h-24 border-t-2 border-gold rounded-full"
                    />
                    <Sparkles className="absolute inset-0 m-auto text-gold animate-pulse" size={32} />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl text-gold font-magic font-medium italic tracking-wide">
                      Leyendo la esencia del alma...
                    </h3>
                    <p className="text-parchment/60 font-mono text-xs uppercase tracking-widest">
                      Los hilos del destino se entrelazan
                    </p>
                  </div>
                </motion.div>
              )}

              {scene === 'RESULT' && result && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-surface p-8 sm:p-12 space-y-10 w-full shadow-2xl text-center relative"
                >
                  <div className="space-y-4">
                    <AnimatePresence mode="wait">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ 
                          type: "spring",
                          stiffness: 260,
                          damping: 20,
                          delay: 0.2
                        }}
                        className="relative w-32 h-32 sm:w-48 sm:h-48 mx-auto mb-6 flex items-center justify-center bg-gold/10 rounded-full border border-gold/30 shadow-[0_0_30px_rgba(197,160,89,0.2)]"
                      >
                         <Stethoscope size={80} className="text-gold" />
                      </motion.div>
                    </AnimatePresence>

                    <span className="text-medical-teal uppercase tracking-[0.5em] text-[10px] font-sans font-medium">
                      Su perfil profesional ha sido identificado
                    </span>
                    <h2 className="text-4xl sm:text-6xl text-parchment font-display font-bold tracking-widest magic-shadow underline underline-offset-8 decoration-gold/30">
                      {result.name}
                    </h2>
                    {result.hogwartsHouse && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-center justify-center space-x-2 mt-4"
                      >
                        <Shield className={`w-5 h-5 ${
                          result.hogwartsHouse === 'Gryffindor' ? 'text-red-500' :
                          result.hogwartsHouse === 'Slytherin' ? 'text-emerald-500' :
                          result.hogwartsHouse === 'Ravenclaw' ? 'text-blue-500' :
                          'text-yellow-500'
                        }`} />
                        <span className={`text-sm uppercase tracking-[0.3em] font-bold ${
                          result.hogwartsHouse === 'Gryffindor' ? 'text-red-400' :
                          result.hogwartsHouse === 'Slytherin' ? 'text-emerald-400' :
                          result.hogwartsHouse === 'Ravenclaw' ? 'text-blue-400' :
                          'text-yellow-400'
                        }`}>
                          Legado de {result.hogwartsHouse}
                        </span>
                      </motion.div>
                    )}
                  </div>

                  <div className="space-y-4 text-parchment/90 font-sans text-xl sm:text-2xl leading-relaxed italic max-w-xl mx-auto py-6 border-y border-gold/20">
                    <TypewriterText text={personalizedJudgment} speed={25} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-left">
                    <div className="space-y-3">
                      <span className="text-gold-dim uppercase tracking-widest text-[10px]">Sendas Afines</span>
                      <ul className="space-y-2">
                        {result.alternatives.map(alt => (
                          <li key={alt} className="flex items-center space-x-2 text-parchment/70 font-sans italic">
                            <ArrowRight size={14} className="text-gold" />
                            <span>{alt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <span className="text-gold-dim uppercase tracking-widest text-[10px]">Interpretación del Perfil</span>
                      <p className="text-parchment/70 font-sans italic leading-snug">
                        {result.rationale}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleStart}
                    className="mt-8 text-gold-dim hover:text-gold uppercase tracking-widest text-xs transition-colors py-2"
                  >
                    Solicitar un Nuevo Juicio
                  </button>
                </motion.div>
              )}

              {scene === 'BLOG' && (
                <motion.div 
                  key="blog"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="glass-surface p-6 sm:p-20 space-y-16 w-screen min-h-screen custom-scrollbar scrollbar-thin overflow-y-auto border-none !rounded-none -mx-4 sm:-mx-6 md:-mx-12"
                >
                  <AnimatePresence mode="wait">
                    {!selectedPost ? (
                      <motion.div
                        key="list"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-10"
                      >
                        <div className="flex flex-col sm:flex-row items-center justify-between border-b border-gold/20 pb-6 gap-4">
                          <div className="flex items-center space-x-4">
                            <Newspaper className="text-gold" size={32} />
                            <h2 className="text-3xl font-display font-bold italic tracking-wide magic-shadow">Crónicas Arcanas</h2>
                          </div>
                          <p className="text-gold-dim font-magic text-sm italic">Relatos de la vanguardia médica mágica</p>
                        </div>

                          <div className="grid grid-cols-1 gap-12">
                            {BLOG_POSTS.map((post, i) => (
                              <article key={i} className="group grid grid-cols-1 md:grid-cols-3 gap-6 border-l-2 border-gold/10 pl-6 hover:border-gold transition-all">
                                <div 
                                  onClick={() => setSelectedPost(post)}
                                  className="relative h-48 md:h-full overflow-hidden rounded-lg cursor-pointer"
                                >
                                  <img 
                                    src={post.image} 
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-bg-deep/80 to-transparent" />
                                </div>
                                <div className="md:col-span-2 space-y-4">
                                  <div className="space-y-1">
                                    <div className="flex items-center space-x-3 text-medical-teal text-[10px] uppercase tracking-widest">
                                      <span>{post.category}</span>
                                      <span className="w-1 h-1 bg-medical-teal/30 rounded-full" />
                                      <div className="flex items-center space-x-1">
                                        <Calendar size={10} />
                                        <span>{post.date}</span>
                                      </div>
                                    </div>
                                    <h3 
                                      onClick={() => setSelectedPost(post)}
                                      className="text-2xl text-gold font-display font-bold group-hover:text-parchment transition-colors cursor-pointer"
                                    >
                                      {post.title}
                                    </h3>
                                  </div>
                                  <p className="text-parchment/60 font-sans italic leading-relaxed">
                                    {post.excerpt}
                                  </p>
                                  <div className="flex items-center justify-between pt-2">
                                    <div className="flex items-center space-x-2 text-gold/40 text-xs">
                                      <User size={12} />
                                      <span>{post.author}</span>
                                    </div>
                                    <button 
                                      onClick={() => setSelectedPost(post)}
                                      className="flex items-center space-x-2 text-gold text-xs uppercase tracking-widest hover:text-medical-teal transition-colors group-hover:translate-x-2 duration-300"
                                    >
                                      <span>Leer más</span>
                                      <ArrowRight size={14} />
                                    </button>
                                  </div>
                                </div>
                              </article>
                            ))}
                          </div>

                        <div className="pt-10 text-center">
                          <button 
                            onClick={() => handleNavigate('HOME')}
                            className="text-gold-dim hover:text-gold uppercase tracking-widest text-[10px] border border-gold/10 px-6 py-2 hover:bg-gold/5 transition-all"
                          >
                            Regresar al Atrio Principal
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="detail"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                      >
                        <button 
                          onClick={() => setSelectedPost(null)}
                          className="flex items-center space-x-2 text-gold-dim hover:text-gold text-[10px] uppercase tracking-widest transition-colors mb-6"
                        >
                          <ArrowLeft size={14} />
                          <span>Volver a las Crónicas</span>
                        </button>

                        <div className="space-y-6">
                          <div className="relative h-64 sm:h-96 w-full overflow-hidden rounded-xl border border-gold/20">
                            <img 
                              src={selectedPost.image} 
                              alt={selectedPost.title}
                              className="w-full h-full object-cover opacity-80"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-bg-deep via-transparent to-transparent" />
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-center space-x-3 text-medical-teal text-xs uppercase tracking-[0.3em]">
                              <span>{selectedPost.category}</span>
                              <span className="w-1 h-1 bg-medical-teal/30 rounded-full" />
                              <span>{selectedPost.date}</span>
                            </div>
                            <h2 className="text-4xl sm:text-5xl font-display font-bold text-gold magic-shadow leading-tight translate-z-0">
                              {selectedPost.title}
                            </h2>
                            <div className="flex items-center space-x-3 text-gold/40 text-sm italic font-sans border-b border-gold/10 pb-6">
                              <User size={16} />
                              <span>Por el {selectedPost.author}</span>
                            </div>
                          </div>
                        </div>

                        <div className="prose prose-invert prose-gold max-w-none">
                          <p className="text-xl text-parchment leading-relaxed font-sans italic whitespace-pre-line first-letter:text-5xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:text-gold">
                            {selectedPost.content}
                          </p>
                        </div>

                        <div className="pt-8 flex justify-center">
                           <div className="w-24 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>

        {/* Footer / Status Bar - Relative positioning for better flow on small screens */}
        <footer className="w-full max-w-4xl px-4 py-8 md:py-12 flex flex-col sm:flex-row items-center justify-between gap-6 mt-auto">
          <div className="flex flex-col space-y-1">
            <span className="text-medical-teal uppercase tracking-[0.2em] text-[10px] sm:text-xs">
              {scene === 'QUIZ' ? 'Diagnóstico en Progreso' : scene === 'RESULT' ? 'Destino Vital' : 'Esperando Aspirante'}
            </span>
            <div className="w-32 sm:w-48 h-[2px] bg-medical-teal/10 relative">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="absolute inset-y-0 bg-medical-teal shadow-[0_0_10px_#14b8a6]"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-6 text-medical-teal/40">
            <Stethoscope size={20} className="hover:text-medical-teal transition-colors cursor-help" />
            <FlaskConical size={20} className="hover:text-medical-teal transition-colors cursor-help" />
            <span className="font-mono text-[10px] hidden sm:inline text-medical-teal/50">{progress}% MONITORIZADO</span>
          </div>
        </footer>

        {/* Backdrop Ornaments */}
        <div className="fixed top-0 left-0 w-full h-screen pointer-events-none opacity-20">
          <div className="absolute top-1/4 left-10 w-px h-64 bg-gradient-to-b from-transparent via-gold to-transparent" />
          <div className="absolute top-1/2 right-10 w-px h-64 bg-gradient-to-b from-transparent via-gold to-transparent" />
        </div>
      </div>
    </AtmosphericFrame>
  );
}
