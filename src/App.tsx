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
import { MapPin, ArrowRight, Sparkles, Wand2, FlaskConical, Stethoscope, BookOpen, ScrollText, Shield, ShieldAlert, ShieldCheck, CheckCircle2, Circle, CreditCard, Zap, Crown, Newspaper, Calendar, User, ArrowLeft } from 'lucide-react';

const HouseCrestDisplay = ({ house }: { house: string }) => {
  const [error, setError] = useState(false);

  // User-provided local filenames
  const localPath = `/${house.toLowerCase()}.png.png`;

  if (error) {
    // Elegant SVG Fallback if image fails
    const colors: Record<string, string> = {
      Gryffindor: "#991b1b",
      Slytherin: "#166534",
      Ravenclaw: "#1e40af",
      Hufflepuff: "#854d0e"
    };

    return (
      <div className="flex flex-col items-center space-y-2">
        <div className="relative">
          <Shield size={120} color={colors[house]} className="drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
          <div className="absolute inset-0 flex items-center justify-center">
             <span className="text-4xl font-bold text-white drop-shadow-md">{house[0]}</span>
          </div>
        </div>
        <span className="text-[10px] uppercase tracking-widest text-parchment/40">Sello de {house}</span>
      </div>
    );
  }

  return (
    <img 
      src={localPath}
      alt={`${house} Crest`}
      onError={() => setError(true)}
      className="w-full h-full object-contain filter drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]"
      referrerPolicy="no-referrer"
    />
  );
};

export default function App() {
  const [scene, setScene] = useState<Scene | 'ABOUT' | 'SPECIALTIES' | 'BLOG'>('HOME');
  const [quizType, setQuizType] = useState<QuizType | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [hatThought, setHatThought] = useState<string>('"Veo un pulso firme... pero una mente que se deleita en el caos de lo inmediato..."');
  const [showThought, setShowThought] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [result, setResult] = useState<Specialty | null>(null);
  const [personalizedJudgment, setPersonalizedJudgment] = useState<string>("");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const activeQuestions = useMemo(() => {
    return quizType === 'EXTENSIVE' ? EXTENSIVE_QUESTIONS : QUICK_QUESTIONS;
  }, [quizType]);

  const progress = Math.round(((currentQuestionIdx) / activeQuestions.length) * 100);

  const currentQuestion = activeQuestions[currentQuestionIdx];

  const handleStart = () => {
    setScene('SELECTION');
  };

  const startQuiz = (type: QuizType) => {
    setQuizType(type);
    setCurrentQuestionIdx(0);
    setAnswers([]);
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

  const calculateResult = (finalAnswers: string[]) => {
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

  const handleOptionSelect = async (option: Option) => {
    if (isThinking) return;

    const newAnswers = [...answers, option.alignment];
    setAnswers(newAnswers);

    if (currentQuestionIdx < activeQuestions.length - 1) {
      setIsThinking(true);
      setShowThought(false);
      
      // Snappy transition to next question
      setTimeout(() => {
        setCurrentQuestionIdx(prev => prev + 1);
        setIsThinking(false);
      }, 400);

      // Get AI reflection in the background to not block the UI
      getHatThought(
        [...answers], 
        currentQuestion.text, 
        option.text
      ).then(thought => {
        setHatThought(thought);
        setShowThought(true);
      });
    } else {
      // End of quiz - Still needs some ceremony but faster
      setIsThinking(true);
      setScene('THINK');
      const finalResult = calculateResult(newAnswers);
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
      
      <div className={`relative w-full flex flex-col ${scene === 'BLOG' ? 'items-stretch' : 'items-center px-4 sm:px-6 md:px-12'} py-10 sm:py-20 transition-all duration-500`}>
        
        {/* Header - More flexible positioning */}
        <AnimatePresence>
          {scene !== 'BLOG' && (
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
                Academia de Sabiduría Médica Arcana
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
        <main className={`w-full ${scene === 'BLOG' ? 'max-w-none' : ['ABOUT', 'SPECIALTIES'].includes(scene) ? 'max-w-6xl mx-auto' : 'max-w-4xl mx-auto'} flex flex-col ${scene === 'BLOG' ? 'items-stretch' : 'items-center'} flex-grow space-y-4 md:space-y-6 transition-all duration-500`}>
          
          {/* Only show Hat in Home and Quiz/Result scenes */}
          {['HOME', 'QUIZ', 'RESULT', 'THINK'].includes(scene) && (
            <div className="relative flex flex-col items-center">
              <SortingHat thinking={isThinking} />
              
              {/* Thought Bubble */}
              <AnimatePresence mode='wait'>
                {showThought && (
                  <motion.div
                    key={hatThought}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 0.8, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="sm:absolute top-10 sm:-right-80 w-full sm:w-72 p-6 border-l border-gold-dim bg-gold-dim/5 text-gold italic font-sans text-lg sm:text-xl text-center sm:text-left backdrop-blur-sm"
                  >
                    <TypewriterText text={hatThought} speed={25} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Interactive Area */}
          <div className="w-full max-w-2xl">
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
                    Aspirante, el antiguo Sombrero de la Esencia ha despertado. 
                    Busca leer entre los pliegues de tu alma para revelar tu destino en las artes curativas.
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
                      La Academia Arcanum Medicum fue fundada en el cruce de la ciencia tangible y el conocimiento etéreo. 
                      Nuestra misión es asegurar que cada sanador encuentre la senda que no solo ejerza con sus manos, sino que resuene con su esencia.
                    </p>
                    <p>
                      El Sombrero de la Esencia utiliza una evaluación psicológica-arcana para medir cuatro pilares fundamentales: 
                      Dinamismo, Análisis, Estructura y Empatía. Al final de tu viaje consciente, tu destino quedará sellado bajo la égida de una de nuestras seis Grandes Sendas.
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
                    <h2 className="text-3xl font-display font-bold italic tracking-wide magic-shadow text-parchment">Grimorio de las Sendas</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-8">
                    {Object.values(SPECIALTIES_MAP).map((spec) => (
                      <div key={spec.id} className="group border-l-2 border-gold/20 pl-6 space-y-2 hover:border-gold transition-colors">
                        <div className="flex items-center justify-between">
                          <h3 className="text-2xl font-magic text-gold italic">{spec.name}</h3>
                          <div className="flex items-center space-x-2">
                            <img 
                              src={`/${spec.hogwartsHouse.toLowerCase()}.png.png`} 
                              className="w-6 h-6 object-contain grayscale group-hover:grayscale-0 transition-all opacity-40 group-hover:opacity-100" 
                              alt=""
                            />
                            <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-tighter rounded-sm border ${
                              spec.hogwartsHouse === 'Gryffindor' ? 'text-red-500 border-red-500/30' :
                              spec.hogwartsHouse === 'Slytherin' ? 'text-green-500 border-green-500/30' :
                              spec.hogwartsHouse === 'Ravenclaw' ? 'text-blue-400 border-blue-400/30' :
                              'text-yellow-500 border-yellow-500/30'
                            }`}>
                              {spec.hogwartsHouse}
                            </span>
                          </div>
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
                    <h2 className="text-3xl font-display font-bold text-parchment tracking-widest magic-shadow uppercase">Elige tu Senda de Juicio</h2>
                    <p className="text-parchment/60 italic font-magic">¿Qué profundidad de introspección buscas hoy?</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Quick Quiz */}
                    <button
                      onClick={() => handleModeSelection('QUICK')}
                      className="group p-6 border border-gold/20 hover:border-gold/50 bg-white/5 hover:bg-white/10 transition-all rounded-sm flex flex-col items-center space-y-4"
                    >
                      <Zap size={32} className="text-gold-dim group-hover:text-gold" />
                      <div>
                        <h3 className="text-xl text-parchment font-sans tracking-wide">Juicio Fugaz</h3>
                        <p className="text-[10px] text-parchment/40 uppercase tracking-widest mt-1">Gratis</p>
                      </div>
                      <p className="text-xs text-parchment/60 leading-relaxed italic">
                        7 dictámenes esenciales para vislumbrar tu senda médica de forma rápida.
                      </p>
                    </button>

                    {/* Extensive Quiz */}
                    <button
                      onClick={() => handleModeSelection('EXTENSIVE')}
                      className="group p-6 border-2 border-gold/40 hover:border-gold bg-gold/5 hover:bg-gold/10 transition-all rounded-sm shadow-[0_0_20px_rgba(197,160,89,0.1)] flex flex-col items-center space-y-4"
                    >
                      <Sparkles size={32} className="text-gold" />
                      <div>
                        <h3 className="text-xl text-gold font-sans tracking-wide">Examen Arcano</h3>
                        <p className="text-[10px] text-gold/80 font-bold uppercase tracking-widest mt-1">Acceso Premium</p>
                      </div>
                      <p className="text-xs text-parchment/70 leading-relaxed italic">
                        21 dictámenes profundos. Revela tu especialidad con máxima precisión y detalle.
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
                        <span className="font-magic text-sm tracking-wide">Examen de 21 Dictámenes</span>
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
                  className="glass-surface p-8 sm:p-12 space-y-8 w-full shadow-2xl relative overflow-hidden"
                >
                  <div className="space-y-4">
                    <span className="text-gold-dim text-[10px] uppercase tracking-[0.3em] font-sans">
                      {currentQuestion.label}
                    </span>
                    <h2 className="text-2xl sm:text-3xl text-parchment leading-tight font-sans font-semibold italic">
                      {currentQuestion.text}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 pt-2">
                    {currentQuestion.options.map((option) => (
                      <button
                        key={option.id}
                        disabled={isThinking}
                        onClick={() => handleOptionSelect(option)}
                        className="group flex items-center justify-between p-4 sm:p-5 border border-gold/30 bg-gold/5 hover:bg-gold/20 hover:border-gold transition-all text-left disabled:opacity-50"
                      >
                        <span className="text-parchment group-hover:text-gold transition-colors font-magic text-base sm:text-lg pr-4">
                          {option.text}
                        </span>
                        <span className="text-gold/50 group-hover:text-gold text-lg sm:text-xl transition-all flex-shrink-0">
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
                        key={result.hogwartsHouse}
                        initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ 
                          type: "spring",
                          stiffness: 260,
                          damping: 20,
                          delay: 0.2
                        }}
                        className="relative w-32 h-32 sm:w-48 sm:h-48 mx-auto mb-6 flex items-center justify-center"
                      >
                        {/* High Fidelity House Crests with Fallback */}
                        <HouseCrestDisplay house={result.hogwartsHouse} />
                        
                        {/* House specific aura */}
                        <div className={`absolute inset-0 blur-[40px] opacity-20 -z-10 rounded-full ${
                          result.hogwartsHouse === 'Gryffindor' ? 'bg-red-600' :
                          result.hogwartsHouse === 'Slytherin' ? 'bg-green-600' :
                          result.hogwartsHouse === 'Ravenclaw' ? 'bg-blue-600' :
                          'bg-yellow-600'
                        }`} />
                      </motion.div>
                    </AnimatePresence>

                    <span className="text-medical-teal uppercase tracking-[0.5em] text-[10px] font-sans font-medium">
                      Tu Casa de Sabiduría ha sido Revelada
                    </span>
                    <h2 className="text-4xl sm:text-6xl text-parchment font-display font-bold tracking-widest magic-shadow underline underline-offset-8 decoration-gold/30">
                      {result.name}
                    </h2>
                    <div className="flex items-center justify-center space-x-2 pt-2">
                       <span className="text-gold-dim text-[10px] uppercase tracking-widest">Esencia de Hogwarts:</span>
                       <span className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full border ${
                         result.hogwartsHouse === 'Gryffindor' ? 'text-red-500 border-red-500/30 bg-red-500/5' :
                         result.hogwartsHouse === 'Slytherin' ? 'text-green-500 border-green-500/30 bg-green-500/5' :
                         result.hogwartsHouse === 'Ravenclaw' ? 'text-blue-400 border-blue-400/30 bg-blue-400/5' :
                         'text-yellow-500 border-yellow-500/30 bg-yellow-500/5'
                       }`}>
                         {result.hogwartsHouse}
                       </span>
                    </div>
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
