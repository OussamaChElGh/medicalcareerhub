import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, BookOpen, Download, Sparkles, Trash2 } from 'lucide-react';
import { AtmosphericFrame } from '../components/AtmosphericFrame';
import { SortingHat } from '../components/SortingHat';
import { QUICK_QUESTION_SET } from '../data/questions.quick';
import {
  buildScoringQuestionSet,
  getExtensiveDisplayQuestions,
  selectBranchQuestions,
} from '../lib/branching';
import { getFinalJudgment } from '../lib/gemini';
import {
  clearPilotSessions,
  createPilotSession,
  downloadPilotSessions,
  loadPilotSessions,
  savePilotSession,
} from '../lib/pilot';
import { scoreQuickQuiz } from '../lib/scoring';
import { AnswerRecord, QuestionSet, QuickQuestion, QuizResult } from '../types';
import { V2Catalog } from './V2Catalog';
import { V2Quiz } from './V2Quiz';
import { V2Result } from './V2Result';

type Stage = 'intro' | 'quiz' | 'result' | 'extensive' | 'catalog';
type ResultMode = 'free' | 'extensive';

interface ExtensiveConfig {
  displayQuestions: QuickQuestion[];
  scoringQuestionSet: QuestionSet;
  initialAnswers: AnswerRecord[];
  initialAnswerTexts: Record<string, string>;
  answeredOffset: number;
}

const SAMPLE_ANSWERS: AnswerRecord[] = [
  { questionId: 'q1_style', optionId: 'q1_b' },
  { questionId: 'q2_rhythm', optionId: 'q2_a' },
  { questionId: 'q3_procedures', optionId: 'q3_a' },
  { questionId: 'q4_activities', mostId: 'q4_b', leastId: 'q4_c' },
  { questionId: 'q5_continuity', optionId: 'q5_b' },
  { questionId: 'q6_contact', optionId: 'q6_c' },
  { questionId: 'q7_reasoning', optionId: 'q7_b' },
  { questionId: 'q8_environment', optionIds: ['q8_or', 'q8_ward'] },
  { questionId: 'q9_population', optionIds: ['q9_adult', 'q9_all'] },
  { questionId: 'q10_outcome', optionIds: ['q10_cure', 'q10_function'] },
  {
    questionId: 'q11_conditions',
    values: { guards: 5, predictability: 2, flexibility: 2, research: 1 },
  },
  {
    questionId: 'q12_emotional',
    values: { uncertainty: 4, suffering: 2, pressure: 5, death: 2 },
  },
  { questionId: 'q13_systems', optionIds: ['q13_musculoskeletal', 'q13_digestive'] },
  { questionId: 'q14_diagnostics', optionId: 'q14_d' },
];

export function V2App() {
  const params = new URLSearchParams(window.location.search);
  const isResultDemo = params.get('demo') === 'result';
  const isExtensiveDemo = params.get('demo') === 'extensive';
  const isDemo = isResultDemo || isExtensiveDemo;
  const stageParam = params.get('stage');
  const initialStage: Stage = isResultDemo
    ? 'result'
    : isExtensiveDemo
      ? 'extensive'
      : stageParam === 'quiz'
        ? 'quiz'
        : stageParam === 'catalog'
          ? 'catalog'
          : 'intro';
  const demoResult = isDemo ? scoreQuickQuiz(SAMPLE_ANSWERS) : null;
  const demoBranch = isExtensiveDemo && demoResult ? selectBranchQuestions(demoResult) : null;
  const demoExtensiveConfig: ExtensiveConfig | null = demoBranch
    ? {
        displayQuestions: getExtensiveDisplayQuestions(demoBranch),
        scoringQuestionSet: buildScoringQuestionSet(QUICK_QUESTION_SET, demoBranch),
        initialAnswers: SAMPLE_ANSWERS,
        initialAnswerTexts: {},
        answeredOffset: QUICK_QUESTION_SET.questions.length,
      }
    : null;

  const [stage, setStage] = useState<Stage>(initialStage);
  const [result, setResult] = useState<QuizResult | null>(demoResult);
  const [resultMode, setResultMode] = useState<ResultMode>('free');
  const [freeResult, setFreeResult] = useState<QuizResult | null>(demoResult);
  const [freeAnswers, setFreeAnswers] = useState<AnswerRecord[]>(isDemo ? SAMPLE_ANSWERS : []);
  const [freeAnswerTexts, setFreeAnswerTexts] = useState<Record<string, string>>({});
  const [extensiveConfig, setExtensiveConfig] =
    useState<ExtensiveConfig | null>(demoExtensiveConfig);
  const [quizStartedAt, setQuizStartedAt] = useState<number | null>(null);
  const [pilotCount, setPilotCount] = useState(() => loadPilotSessions().length);
  const [judgment, setJudgment] = useState(
    isDemo
      ? 'El bisturí te llama, pero tu perfil aún duda entre cortar y diagnosticar. Interesante... y preocupante a partes iguales.'
      : '',
  );

  const reset = () => {
    setResult(null);
    setResultMode('free');
    setFreeResult(null);
    setFreeAnswers([]);
    setFreeAnswerTexts({});
    setExtensiveConfig(null);
    setJudgment('');
  };

  const start = () => {
    reset();
    setQuizStartedAt(Date.now());
    setStage('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const home = () => {
    reset();
    setStage('intro');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const completeFree = (
    nextResult: QuizResult,
    answers: AnswerRecord[],
    answerTexts: Record<string, string>,
  ) => {
    const durationMs = quizStartedAt ? Date.now() - quizStartedAt : 0;
    savePilotSession(createPilotSession(nextResult, answers, 'free', durationMs));
    setPilotCount(loadPilotSessions().length);

    setFreeResult(nextResult);
    setFreeAnswers(answers);
    setFreeAnswerTexts(answerTexts);
    setResult(nextResult);
    setResultMode('free');
    setJudgment('');
    setStage('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const first = nextResult.top[0];
    if (first) {
      getFinalJudgment(
        first.specialty.name,
        first.specialty.description,
        Object.values(answerTexts),
      ).then(setJudgment);
    }
  };

  const startExtensive = () => {
    if (!freeResult) return;

    setQuizStartedAt(Date.now());
    const branchQuestions = selectBranchQuestions(freeResult);
    setExtensiveConfig({
      displayQuestions: getExtensiveDisplayQuestions(branchQuestions),
      scoringQuestionSet: buildScoringQuestionSet(QUICK_QUESTION_SET, branchQuestions),
      initialAnswers: freeAnswers,
      initialAnswerTexts: freeAnswerTexts,
      answeredOffset: QUICK_QUESTION_SET.questions.length,
    });
    setStage('extensive');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const completeExtensive = (
    nextResult: QuizResult,
    answers: AnswerRecord[],
    answerTexts: Record<string, string>,
  ) => {
    const durationMs = quizStartedAt ? Date.now() - quizStartedAt : 0;
    savePilotSession(createPilotSession(nextResult, answers, 'extensive', durationMs));
    setPilotCount(loadPilotSessions().length);

    setResult(nextResult);
    setResultMode('extensive');
    setJudgment('');
    setStage('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const first = nextResult.top[0];
    if (first) {
      getFinalJudgment(
        first.specialty.name,
        first.specialty.description,
        Object.values(answerTexts),
      ).then(setJudgment);
    }
  };

  const clearPilot = () => {
    clearPilotSessions();
    setPilotCount(0);
  };

  return (
    <AtmosphericFrame>
      <header className="w-full px-4 pt-6 sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Sparkles className="text-gold" size={18} />
            <span className="font-magic text-sm tracking-widest text-gold sm:text-base">
              Arcanum Medicum
            </span>
            <span className="rounded-full border border-medical-teal/30 bg-medical-teal/10 px-2 py-0.5 text-[8px] uppercase tracking-widest text-medical-teal">
              Motor v2 · beta
            </span>
            {isDemo && (
              <span className="rounded-full border border-gold/30 bg-gold/10 px-2 py-0.5 text-[8px] uppercase tracking-widest text-gold/80">
                Vista demo
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {(stage === 'intro' || stage === 'result') && (
              <button
                onClick={() => setStage('catalog')}
                className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-parchment/40 transition-colors hover:text-gold"
              >
                <BookOpen size={11} />
                <span className="hidden sm:inline">Catálogo</span>
              </button>
            )}
            <button
              onClick={() => downloadPilotSessions('json')}
              title="Exportar sesiones anónimas del piloto en JSON"
              className="inline-flex items-center gap-1.5 rounded-full border border-gold/20 px-2 py-1 text-[9px] uppercase tracking-widest text-parchment/40 transition-colors hover:border-gold/50 hover:text-gold"
            >
              <Download size={11} />
              <span className="hidden sm:inline">Piloto</span>
              <span>{pilotCount}</span>
            </button>
            {pilotCount > 0 && (
              <button
                onClick={clearPilot}
                title="Borrar las sesiones guardadas del piloto"
                className="text-parchment/25 transition-colors hover:text-rose-300"
              >
                <Trash2 size={12} />
              </button>
            )}
            <a
              href="/"
              className="text-[9px] uppercase tracking-widest text-parchment/40 transition-colors hover:text-gold"
            >
              Versión clásica
            </a>
          </div>
        </div>
      </header>

      {stage === 'intro' && (
        <main className="flex flex-1 flex-col items-center px-4 pb-10 pt-16 sm:pt-24">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-5xl text-center"
          >
            <p className="text-[10px] uppercase tracking-[0.4em] text-medical-teal sm:text-xs">
              Algoritmo de orientación vocacional médica
            </p>
            <h1 className="mt-2 text-3xl font-display font-bold uppercase tracking-widest text-gold magic-shadow sm:text-5xl">
              No eliges tu especialidad.
              <br />
              Tu especialidad te elige a ti.
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="mt-2 sm:mt-4"
          >
            <SortingHat />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-14 w-full max-w-xl space-y-6 text-center sm:mt-20"
          >
            <p className="font-classic text-xl italic leading-relaxed text-parchment/80 sm:text-2xl">
              Catorce preguntas. Un perfil vocacional. Las cinco especialidades que más encajan contigo.
              Sin registro y sin promesas de certeza.
            </p>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={start}
              className="group relative mx-auto block overflow-hidden px-10 py-5"
            >
              <div className="absolute inset-0 border border-gold/30 bg-gold/5 backdrop-blur-md transition-colors duration-500 group-hover:border-gold" />
              <div className="absolute inset-[3px] border border-gold/10" />
              <div className="absolute left-0 top-0 h-3 w-3 border-l-2 border-t-2 border-gold/50 transition-all duration-300 group-hover:h-5 group-hover:w-5" />
              <div className="absolute right-0 top-0 h-3 w-3 border-r-2 border-t-2 border-gold/50 transition-all duration-300 group-hover:h-5 group-hover:w-5" />
              <div className="absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2 border-gold/50 transition-all duration-300 group-hover:h-5 group-hover:w-5" />
              <div className="absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2 border-gold/50 transition-all duration-300 group-hover:h-5 group-hover:w-5" />
              <span className="relative z-10 flex items-center gap-4 text-sm font-bold uppercase tracking-[0.3em] text-gold sm:text-base">
                <Sparkles size={16} className="text-gold/60" />
                Someterme al Juicio
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </span>
            </motion.button>

            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[9px] uppercase tracking-widest text-parchment/35">
              <span>14 preguntas</span>
              <span className="text-gold/30">·</span>
              <span>Top 5 especialidades</span>
              <span className="text-gold/30">·</span>
              <span>Resultado orientativo</span>
            </div>
          </motion.div>

          <footer className="mt-auto flex w-full max-w-4xl items-center justify-between gap-6 px-4 pt-12">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-[0.2em] text-medical-teal sm:text-xs">
                Esperando Aspirante
              </span>
              <div className="h-[2px] w-32 bg-medical-teal/10 sm:w-48" />
            </div>
            <span className="font-mono text-[9px] uppercase tracking-widest text-medical-teal/40">
              Motor v2 · 51 especialidades activas
            </span>
          </footer>
        </main>
      )}

      {stage === 'quiz' && (
        <main className="flex flex-1 items-start justify-center">
          <V2Quiz onComplete={completeFree} onCancel={home} />
        </main>
      )}

      {stage === 'extensive' && extensiveConfig && (
        <main className="flex flex-1 items-start justify-center">
          <V2Quiz
            questions={extensiveConfig.displayQuestions}
            scoringQuestionSet={extensiveConfig.scoringQuestionSet}
            initialAnswers={extensiveConfig.initialAnswers}
            initialAnswerTexts={extensiveConfig.initialAnswerTexts}
            answeredOffset={extensiveConfig.answeredOffset}
            modeLabel={`Test extensivo beta · ${extensiveConfig.answeredOffset + extensiveConfig.displayQuestions.length} preguntas · el Sombrero sigue leyendo`}
            onComplete={completeExtensive}
            onCancel={() => setStage('result')}
          />
        </main>
      )}

      {stage === 'result' && result && (
        <main className="flex flex-1 items-start justify-center">
          <V2Result
            result={result}
            judgment={judgment}
            isExtensive={resultMode === 'extensive'}
            onStartExtensive={freeResult ? startExtensive : undefined}
            onRestart={start}
            onHome={home}
          />
        </main>
      )}

      {stage === 'catalog' && (
        <main className="flex flex-1 items-start justify-center">
          <V2Catalog onBack={home} />
        </main>
      )}
    </AtmosphericFrame>
  );
}
