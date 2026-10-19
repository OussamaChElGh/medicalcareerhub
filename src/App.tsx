import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AtmosphericFrame } from './components/AtmosphericFrame';
import { SortingHat } from './components/SortingHat';
import { TypewriterText } from './components/TypewriterText';
import { Navbar } from './components/Navbar';
import { StatsView } from './components/StatsView';
import { OracleView } from './components/OracleView';
import { QUICK_QUESTIONS, EXTENSIVE_QUESTIONS, SPECIALTIES_MAP, BLOG_POSTS } from './constants';
import { Scene, Specialty, Option, QuizType, BlogPost } from './types';
import { getHatThought, getFinalJudgment } from './lib/gemini';
import { generateDossierPDF } from './lib/dossierPdf';
import { DimensionsRadarChart } from './components/DimensionsRadarChart';
import { HouseHeroBanner } from './components/HouseHeroBanner';
import { PremiumHookCard } from './components/PremiumHookCard';
import { Stethoscope, ArrowRight, Sparkles, Wand2, FlaskConical, BookOpen, ScrollText, CheckCircle2, Circle, Zap, Crown, Newspaper, Calendar, User, ArrowLeft, FileDown, Check } from 'lucide-react';

export default function App() {
  const [scene, setScene] = useState<Scene>('HOME');
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
  const [optionRatings, setOptionRatings] = useState<Record<string, number>>({});
  const [alignmentWeights, setAlignmentWeights] = useState<Record<string, number>>({});

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
    setOptionRatings({});
    setAlignmentWeights({});
    setUsedThoughts([]);
    setResult(null);
    setScene('QUIZ');
    setShowThought(true);
  };

  const handleModeSelection = (type: QuizType) => {
    if (type === 'EXTENSIVE') {
      window.location.assign('/');
    } else {
      startQuiz('QUICK');
    }
  };

  const handleDownloadDossier = () => {
    try {
      generateDossierPDF();
    } catch (error) {
      console.error("Error generating dossier PDF:", error);
    }
  };

  const handleNavigate = (newScene: Scene) => {
    setSelectedPost(null);
    if (newScene === 'QUIZ' && scene !== 'QUIZ') {
      handleStart();
    } else {
      setScene(newScene);
    }
  };

  const handleClassicOptionRate = (optionId: string, rating: number) => {
    setOptionRatings(prev => ({
      ...prev,
      [optionId]: rating,
    }));
  };

  const handleClassicConfirm = async () => {
    if (isThinking || !currentQuestion) return;

    // Weight alignments according to 1-5 ratings for all options
    const nextWeights = { ...alignmentWeights };
    currentQuestion.options.forEach((opt) => {
      const rating = optionRatings[opt.id] ?? 3;
      nextWeights[opt.alignment] = (nextWeights[opt.alignment] || 0) + rating;
    });
    setAlignmentWeights(nextWeights);

    const topOption = [...currentQuestion.options].sort(
      (a, b) => (optionRatings[b.id] ?? 3) - (optionRatings[a.id] ?? 3)
    )[0];
    const newAnswers = [...answers, topOption.alignment];
    setAnswers(newAnswers);

    const calculateResultInternal = (weights: Record<string, number>) => {
      let topSpecialty = "INTERNAL_MEDICINE";
      let max = 0;
      Object.entries(weights).forEach(([id, score]) => {
        if (score > max) {
          max = score;
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
      ];
      
      const availableMumbles = quickMumbles.filter(m => !usedThoughts.includes(m));
      const mumblePool = availableMumbles.length > 0 ? availableMumbles : quickMumbles;
      const selectedMumble = mumblePool[Math.floor(Math.random() * mumblePool.length)];
      
      setHatThought(selectedMumble);
      setUsedThoughts(prev => [...prev, selectedMumble]);
      
      setTimeout(() => {
        setCurrentQuestionIdx(prev => prev + 1);
        setIsThinking(false);
        setOptionRatings({});
      }, 350);

      getHatThought([...answers], currentQuestion.text, topOption.text, usedThoughts)
        .then(thought => {
          if (thought && thought !== selectedMumble) {
            setHatThought(thought);
            setUsedThoughts(prev => [...prev, thought]);
          }
        })
        .catch(() => {});
    } else {
      setShowThought(true);
      setHatThought("Ya veo... tu destino está sellado...");
      
      setIsThinking(true);
      setScene('THINK');
      const finalResult = calculateResultInternal(nextWeights);
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

  const handleOptionSelect = async (option: Option) => {
    handleClassicOptionRate(option.id, 5);
  };

  return (
    <AtmosphericFrame>
      <Navbar onNavigate={handleNavigate} activeScene={scene} />
      
      <div className={`relative w-full flex flex-col items-center px-4 sm:px-6 md:px-12 ${['QUIZ', 'THINK'].includes(scene) ? 'pt-16 pb-8 sm:pt-32 sm:pb-8' : 'pt-24 pb-10 sm:pt-40 sm:pb-20'} transition-all duration-500`}>
        
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
        <main className={`w-full ${['ABOUT', 'SPECIALTIES', 'BLOG', 'STATS', 'ORACLE'].includes(scene) ? 'max-w-none' : 'max-w-6xl mx-auto'} flex flex-col ${['QUIZ', 'RESULT', 'THINK'].includes(scene) ? 'lg:flex-row lg:items-start lg:gap-12' : 'items-center'} flex-grow space-y-2 md:space-y-4 transition-all duration-700`}>
          
          {/* Only show Hat in Home and Desktop Quiz/Result scenes */}
          {['HOME', 'RESULT', 'THINK', 'QUIZ', 'ORACLE'].includes(scene) && (
            <div className={`relative flex flex-col items-center flex-shrink-0 ${['QUIZ', 'RESULT', 'THINK'].includes(scene) ? 'hidden lg:flex lg:sticky lg:top-24 lg:w-[350px]' : 'w-full'}`}>
              <SortingHat thinking={isThinking} />
              
              {/* Thought Bubble - Redesigned: Spectral Glass Aesthetic */}
              <div className={`w-full relative ${showThought ? 'min-h-[140px] mt-6' : 'min-h-0 mt-0'} flex justify-center perspective-[1000px] transition-all duration-500`}>
                <AnimatePresence mode='wait'>
                  {showThought && (
                    <motion.div
                      key={hatThought}
                      initial={{ opacity: 0, scale: 0.9, rotateX: -10, y: 20 }}
                      animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ type: "spring", damping: 20, stiffness: 100 }}
                      className="relative w-full p-8 bg-black/40 backdrop-blur-xl border border-gold/30 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_20px_rgba(197,160,89,0.1)] overflow-hidden"
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
          <div className={`w-full flex justify-center ${['QUIZ', 'RESULT', 'THINK', 'BLOG', 'ABOUT', 'SPECIALTIES', 'STATS', 'ORACLE'].includes(scene) ? 'lg:flex-grow lg:max-w-none' : 'max-w-2xl'}`}>
            <AnimatePresence mode="wait">
              {scene === 'STATS' && (
                <motion.div
                  key="stats"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full"
                >
                  <StatsView />
                </motion.div>
              )}

              {scene === 'ORACLE' && (
                <motion.div
                  key="oracle"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full"
                >
                  <OracleView />
                </motion.div>
              )}

              {scene === 'STATS' && (
                <motion.div
                  key="stats"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full"
                >
                  <StatsView />
                </motion.div>
              )}

              {scene === 'ORACLE' && (
                <motion.div
                  key="oracle"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full"
                >
                  <OracleView />
                </motion.div>
              )}

              {scene === 'HOME' && (
                <motion.div 
                  key="home"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex flex-col items-center text-center space-y-6 py-4"
                >
                  <p className="text-xl sm:text-2xl text-parchment/80 max-w-lg font-classic italic leading-relaxed">
                    Aspirante, el sistema de orientación avanzada ha sido activado. 
                    Permita que el algoritmo analice su perfil profesional para revelar su especialidad idónea.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleStart}
                    className="group relative px-12 py-5 overflow-hidden"
                  >
                    {/* Background & Borders */}
                    <div className="absolute inset-0 bg-gold/5 backdrop-blur-md border border-gold/30 group-hover:border-gold transition-colors duration-500" />
                    <div className="absolute inset-[3px] border border-gold/10" />
                    
                    {/* Pulsing Outer Glow */}
                    <motion.div 
                      animate={{ 
                        boxShadow: ["0 0 20px rgba(197,160,89,0.1)", "0 0 40px rgba(197,160,89,0.3)", "0 0 20px rgba(197,160,89,0.1)"] 
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute inset-0"
                    />

                    {/* Corner Ornaments */}
                    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-gold/50 group-hover:w-5 group-hover:h-5 transition-all duration-300" />
                    <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-gold/50 group-hover:w-5 group-hover:h-5 transition-all duration-300" />
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-gold/50 group-hover:w-5 group-hover:h-5 transition-all duration-300" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-gold/50 group-hover:w-5 group-hover:h-5 transition-all duration-300" />

                    {/* Text and Icons */}
                    <div className="relative z-10 flex items-center space-x-4">
                      <Sparkles className="text-gold/40 group-hover:text-gold transition-colors group-hover:scale-125 duration-300" size={18} />
                      <span className="text-gold text-lg sm:text-xl tracking-[0.3em] font-magic font-bold uppercase drop-shadow-[0_0_8px_rgba(197,160,89,0.5)]">
                        Someterme al Juicio
                      </span>
                      <Sparkles className="text-gold/40 group-hover:text-gold transition-colors group-hover:scale-125 duration-300" size={18} />
                    </div>

                    {/* Magic Sweep Effect */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/20 to-transparent -skew-x-12 translate-x-[-150%]"
                      whileHover={{ x: '150%' }}
                      transition={{ duration: 0.7, ease: "easeInOut" }}
                    />
                  </motion.button>
                </motion.div>
              )}

              {scene === 'ABOUT' && (
                <motion.div 
                  key="about"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="glass-surface p-6 sm:p-10 space-y-8 text-parchment font-sans leading-relaxed rounded-2xl border border-gold/30 shadow-2xl"
                >
                  <div className="flex items-center space-x-4 border-b border-gold/25 pb-4">
                    <ScrollText className="text-gold" size={32} />
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-display font-bold text-gold magic-shadow">Sabiduría de la Academia</h2>
                      <p className="text-xs uppercase tracking-widest text-parchment/80">El Manifiesto de Arcanum Medicum</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 text-base sm:text-lg leading-relaxed text-[#f1e5d1]">
                    <p>
                      Nuestro sistema de orientación vocacional médica ha sido desarrollado para ayudar a médicos y opositores MIR a identificar la especialidad que mejor se alinea con su perfil cognitivo, habilidades técnicas y estilo de vida real.
                    </p>
                    <p>
                      A través de dilemas clínicos y situaciones de práctica hospitalaria diaria, el algoritmo analiza cuatro dimensiones clave: 
                      <strong className="text-amber-200"> Resolución Técnica</strong>, 
                      <strong className="text-cyan-200"> Gestión de Crisis</strong>, 
                      <strong className="text-emerald-200"> Razonamiento Diagnóstico</strong> y 
                      <strong className="text-rose-200"> Continuidad Humana</strong>.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-black/40 border border-gold/20 space-y-1">
                      <h4 className="font-semibold text-gold text-sm">51 Especialidades Oficiales</h4>
                      <p className="text-xs text-parchment/85 leading-relaxed">Mapeadas cuantitativamente según guardias, quirófano, contacto con pacientes y régimen laboral.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-black/40 border border-gold/20 space-y-1">
                      <h4 className="font-semibold text-gold text-sm">Distancia Vectorial Euclídea</h4>
                      <p className="text-xs text-parchment/85 leading-relaxed">Cálculo algorítmico objetivo que detecta compatibilidad nuclear y penaliza fricciones insalvables.</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gold/15">
                    <button 
                      onClick={() => handleNavigate('HOME')}
                      className="text-gold hover:text-amber-200 uppercase tracking-widest text-xs border-b border-gold/40 hover:border-gold pb-1 cursor-pointer transition-colors"
                    >
                      Regresar al Atrio
                    </button>
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => handleNavigate('SPECIALTIES')}
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-gold/10 hover:bg-gold/20 text-gold border border-gold/30 hover:border-gold rounded-xl text-xs font-bold tracking-wider uppercase transition-all shadow-sm cursor-pointer"
                      >
                        <BookOpen size={16} />
                        <span>Ver Especialidades</span>
                      </button>
                      <button
                        onClick={handleDownloadDossier}
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-gold/20 hover:bg-gold/30 text-gold border border-gold/50 hover:border-gold rounded-xl text-xs font-bold tracking-wider uppercase transition-all shadow-sm cursor-pointer"
                      >
                        <FileDown size={16} />
                        <span>Descargar Dossier (PDF)</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {scene === 'SPECIALTIES' && (
                <motion.div 
                  key="specialties"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass-surface p-6 sm:p-10 space-y-8 max-h-[650px] overflow-y-auto mask-fade custom-scrollbar"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gold/20 pb-4 sticky top-0 bg-academy-navy/95 backdrop-blur-md z-10 gap-4">
                    <div className="flex items-center space-x-4">
                      <BookOpen className="text-gold" size={32} />
                      <div>
                        <h2 className="text-2xl sm:text-3xl font-display font-bold italic tracking-wide magic-shadow text-parchment">Catálogo de Especialidades</h2>
                        <p className="text-xs text-gold-dim">{Object.keys(SPECIALTIES_MAP).length} Especialidades Médicas • 60 Preguntas Extensivas • 12 Preguntas Rápidas</p>
                      </div>
                    </div>
                    <button
                      onClick={handleDownloadDossier}
                      className="inline-flex items-center space-x-2 px-4 py-2.5 bg-gold/15 hover:bg-gold/25 text-gold border border-gold/40 hover:border-gold rounded-xl text-xs font-bold tracking-wider uppercase transition-all shadow-sm cursor-pointer"
                      title="Descargar Dossier Completo con metodología y banco de preguntas"
                    >
                      <FileDown size={16} />
                      <span>Descargar Dossier (PDF)</span>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.values(SPECIALTIES_MAP).map((spec) => (
                      <div 
                        key={spec.id} 
                        className="group rounded-xl border border-gold/25 bg-[#09111c]/95 p-5 space-y-3 hover:border-gold/60 transition-all shadow-md"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-xl font-magic font-bold text-parchment group-hover:text-gold transition-colors">{spec.name}</h3>
                            {spec.hogwartsHouse && (
                              <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider text-gold-light border border-gold/30 rounded-full px-2.5 py-0.5 bg-gold/10">
                                Casa {spec.hogwartsHouse}
                              </span>
                            )}
                          </div>
                          {spec.hogwartsHouse && (
                            <img 
                              src={`/house-${spec.hogwartsHouse.toLowerCase()}.png`} 
                              alt={spec.hogwartsHouse}
                              className="w-10 h-10 object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] shrink-0"
                              title={`Afinidad: Casa ${spec.hogwartsHouse}`}
                              referrerPolicy="no-referrer"
                            />
                          )}
                        </div>
                        <p className="text-[#ded4be] font-sans text-xs leading-relaxed">{spec.description}</p>
                        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gold/10">
                          <span className="text-[9px] uppercase tracking-wider text-parchment/50">Alternativas:</span>
                          {spec.alternatives.map(alt => (
                            <span key={alt} className="text-[10px] uppercase tracking-wider border border-gold/25 bg-black/40 px-2 py-0.5 rounded text-gold-dim">{alt}</span>
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
                        <p className="text-[10px] text-gold/80 font-bold uppercase tracking-widest mt-1">Disponible en la V2</p>
                      </div>
                      <p className="text-xs text-parchment/70 leading-relaxed italic">
                        El test adaptativo y el informe premium se han trasladado a la versión actual.
                      </p>
                    </button>
                  </div>

                  <a
                    href="/"
                    className="inline-flex items-center justify-center gap-2 border border-medical-teal/30 bg-medical-teal/10 px-5 py-2.5 text-[10px] uppercase tracking-widest text-medical-teal transition-colors hover:bg-medical-teal/20"
                  >
                    Volver a la versión actual
                  </a>

                  <button
                    onClick={() => setScene('HOME')}
                    className="text-parchment/40 hover:text-parchment transition-colors text-xs uppercase tracking-widest pt-4"
                  >
                    Regresar al Umbral
                  </button>
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

                  {/* Instructions and progress */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gold/15 pb-2 text-xs">
                    <span className="font-mono text-xs uppercase tracking-wider text-parchment font-semibold">
                      Puntúa cada una de las 4 opciones de 1 a 5 según tu afinidad:
                    </span>
                    <span className="font-mono text-[11px] text-gold">
                      {currentQuestion.options.filter(opt => typeof optionRatings[opt.id] === 'number').length}/4 valoradas
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 pt-2">
                    {currentQuestion.options.map((option, idx) => {
                      const currentVal = optionRatings[option.id];
                      const isRated = typeof currentVal === 'number';

                      return (
                        <div
                          key={option.id}
                          className={`rounded-xl border p-4 sm:p-5 space-y-3 transition-all ${
                            isRated
                              ? 'border-gold/50 bg-[#0c1524]/90 shadow-md ring-1 ring-gold/20'
                              : 'border-gold/25 bg-gold/5'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-2.5">
                              <span className="font-mono text-xs font-bold text-gold/70 bg-gold/10 border border-gold/30 rounded h-5 w-5 flex items-center justify-center shrink-0 mt-0.5">
                                {String.fromCharCode(65 + idx)}
                              </span>
                              <span className="text-parchment font-magic text-sm sm:text-base leading-snug">
                                {option.text}
                              </span>
                            </div>
                            <span className="text-gold font-magic text-base shrink-0">
                              {option.sigil}
                            </span>
                          </div>

                          <div className="flex items-center justify-between border-t border-gold/10 pt-2 text-xs">
                            <span className="font-mono text-[10px] uppercase text-parchment/60">
                              Afinidad (1-5):
                            </span>
                            <div className="flex items-center gap-1.5">
                              {[1, 2, 3, 4, 5].map((val) => (
                                <button
                                  key={val}
                                  type="button"
                                  onClick={() => handleClassicOptionRate(option.id, val)}
                                  className={`h-8 w-8 sm:h-9 sm:w-9 rounded-lg border font-mono text-xs font-bold transition-all cursor-pointer ${
                                    currentVal === val
                                      ? 'border-gold bg-gradient-to-b from-gold to-amber-600 text-bg-deep shadow-[0_0_12px_rgba(217,119,6,0.6)] scale-105'
                                      : 'border-gold/20 bg-black/40 text-parchment/70 hover:border-gold/50 hover:bg-gold/10 hover:text-gold'
                                  }`}
                                >
                                  {val}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-end pt-3 border-t border-gold/10">
                    <button
                      type="button"
                      disabled={isThinking}
                      onClick={handleClassicConfirm}
                      className="inline-flex items-center gap-2 rounded-xl border border-gold/60 bg-gradient-to-r from-gold/30 via-gold/40 to-gold/30 px-6 py-3 text-xs font-bold uppercase tracking-widest text-parchment shadow-[0_0_20px_rgba(217,119,6,0.3)] transition-all hover:bg-gold/40 hover:text-white cursor-pointer disabled:opacity-50"
                    >
                      <span>Confirmar Juicio y Continuar</span>
                      <ArrowRight size={14} />
                    </button>
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
                  {/* Grand House Heraldic Banner with Giant Specialty Title */}
                  <HouseHeroBanner
                    house={(result.hogwartsHouse as any) || 'Ravenclaw'}
                    specialtyName={result.name}
                    specialtyHeadline={result.rationale}
                  />

                  {/* High-Converting Premium Hook (Elevated to Upper Fold) */}
                  <PremiumHookCard
                    onUnlockPremium={() => window.location.assign('/?unlock=1')}
                    onStartExtensive={() => startQuiz('EXTENSIVE')}
                    topSpecialtyName={result.name}
                    isExtensive={quizType === 'EXTENSIVE'}
                  />

                  <div className="space-y-4 text-parchment/90 font-sans text-xl sm:text-2xl leading-relaxed italic max-w-xl mx-auto py-5 border-y border-gold/20">
                    <TypewriterText text={personalizedJudgment} speed={25} />
                  </div>

                  {/* Multidimensional Competency Spider Web / Radar Chart */}
                  <DimensionsRadarChart answers={answers} specialty={result} />

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
                    className="mt-6 text-gold-dim hover:text-gold uppercase tracking-widest text-xs transition-colors py-2 cursor-pointer"
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
                  className="glass-surface p-6 sm:p-12 md:p-20 space-y-16 w-full max-w-6xl min-h-[70vh] mx-auto custom-scrollbar scrollbar-thin overflow-y-auto border border-gold/10 rounded-2xl md:rounded-3xl shadow-[0_30px_100px_rgba(0,0,0,0.8)]"
                >
                  <AnimatePresence mode="wait">
                    {!selectedPost ? (
                      <motion.div
                        key="list"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-10 max-w-5xl mx-auto"
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
                        className="space-y-8 max-w-4xl mx-auto"
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
