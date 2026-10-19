import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, TrendingUp } from 'lucide-react';
import { AtmosphericFrame } from '../components/AtmosphericFrame';
import { OracleView } from '../components/OracleView';
import { SortingHat } from '../components/SortingHat';
import { StatsView } from '../components/StatsView';
import { QUICK_QUESTION_SET } from '../data/questions.quick';
import {
  buildScoringQuestionSet,
  getExtensiveDisplayQuestions,
  selectBranchQuestions,
} from '../lib/branching';
import { getFinalJudgment } from '../lib/gemini';
import { deriveHouse } from '../lib/narrative';
import {
  downloadBlob,
  downloadPremiumPdf,
  loadPremiumAccess,
  PremiumAccess,
  PremiumMode,
  savePremiumAccess,
  startPremiumCheckout,
  verifyPremiumSession,
  devUnlockPremium,
} from '../lib/premium';
import {
  clearPilotSessions,
  createPilotSession,
  downloadPilotSessions,
  loadPilotSessions,
  savePilotSession,
} from '../lib/pilot';
import { scoreQuickQuiz } from '../lib/scoring';
import {
  clearV2Session,
  createEmptySession,
  loadV2Session,
  saveV2Session,
  V2PersistedSession,
} from '../lib/v2Session';
import { AnswerRecord, QuestionSet, QuickQuestion, QuizResult } from '../types';
import { V2About } from './V2About';
import { V2Backoffice } from './V2Backoffice';
import { V2Blog } from './V2Blog';
import { V2Catalog } from './V2Catalog';
import { V2ModeSelectionModal } from './V2ModeSelectionModal';
import { V2Navbar, V2NavScene } from './V2Navbar';
import { V2PremiumModal } from './V2PremiumModal';
import { V2Quiz } from './V2Quiz';
import { V2Result } from './V2Result';
import { sendTelemetryEvent } from '../lib/useTelemetry';

type Stage =
  | 'intro'
  | 'quiz'
  | 'result'
  | 'extensive'
  | 'catalog'
  | 'blog'
  | 'about'
  | 'stats'
  | 'oracle'
  | 'backoffice';

type ResultMode = 'free' | 'extensive';

interface ExtensiveConfig {
  displayQuestions: QuickQuestion[];
  scoringQuestionSet: QuestionSet;
  initialAnswers: AnswerRecord[];
  initialAnswerTexts: Record<string, string>;
  initialIndex: number;
  answeredOffset: number;
}

interface FreeInitial {
  answers: AnswerRecord[];
  texts: Record<string, string>;
  index: number;
}

interface PremiumConfig {
  configured: boolean;
  priceCents: number;
  currency: string;
  productName: string;
  devUnlock: boolean;
}

function createReportId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `report-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

const DEFAULT_PREMIUM_CONFIG: PremiumConfig = {
  configured: false,
  priceCents: 499,
  currency: 'eur',
  productName: 'Informe vocacional Arcanum Medicum',
  devUnlock: false,
};

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

const STAGE_PARAMS: Record<string, Stage> = {
  quiz: 'quiz',
  catalog: 'catalog',
  blog: 'blog',
  about: 'about',
  stats: 'stats',
  oracle: 'oracle',
  backoffice: 'backoffice',
};

function isV2NavScene(stage: Stage): stage is V2NavScene {
  return [
    'intro',
    'catalog',
    'blog',
    'stats',
    'oracle',
    'about',
    'backoffice',
    'result',
  ].includes(stage);
}

export function V2App() {
  const params = new URLSearchParams(window.location.search);
  const path = typeof window !== 'undefined' ? window.location.pathname.replace(/\/+$/, '') : '';
  const isBackofficeRoute = path === '/backoffice' || params.get('tab') === 'backoffice';
  const isResultDemo = params.get('demo') === 'result';
  const isExtensiveDemo = params.get('demo') === 'extensive';
  const isDemo = isResultDemo || isExtensiveDemo;
  const stageParam = params.get('stage') ?? '';
  const demoResult = isDemo ? scoreQuickQuiz(SAMPLE_ANSWERS) : null;

  const [savedSession] = useState<V2PersistedSession | null>(() =>
    isDemo || stageParam ? null : loadV2Session(),
  );

  const initialStage: Stage = isBackofficeRoute
    ? 'backoffice'
    : isResultDemo
      ? 'result'
      : isExtensiveDemo
        ? 'extensive'
        : STAGE_PARAMS[stageParam] ??
          (savedSession?.stage === 'result' && savedSession.result ? 'result' : 'intro');

  const demoBranch = isExtensiveDemo && demoResult ? selectBranchQuestions(demoResult) : null;
  const demoExtensiveConfig: ExtensiveConfig | null = demoBranch
    ? {
        displayQuestions: getExtensiveDisplayQuestions(demoBranch),
        scoringQuestionSet: buildScoringQuestionSet(QUICK_QUESTION_SET, demoBranch),
        initialAnswers: SAMPLE_ANSWERS,
        initialAnswerTexts: {},
        initialIndex: 0,
        answeredOffset: QUICK_QUESTION_SET.questions.length,
      }
    : null;

  const [stage, setStage] = useState<Stage>(initialStage);
  const [result, setResult] = useState<QuizResult | null>(
    isResultDemo || (savedSession?.stage === 'result' && savedSession.result)
      ? demoResult ?? savedSession?.result ?? null
      : null,
  );
  const [resultMode, setResultMode] = useState<ResultMode>(
    savedSession?.stage === 'result' ? savedSession.resultMode : 'free',
  );
  const [freeResult, setFreeResult] = useState<QuizResult | null>(
    demoResult ?? savedSession?.freeResult ?? null,
  );
  const [freeAnswers, setFreeAnswers] = useState<AnswerRecord[]>(
    isDemo ? SAMPLE_ANSWERS : savedSession?.freeAnswers ?? [],
  );
  const [freeAnswerTexts, setFreeAnswerTexts] = useState<Record<string, string>>(
    savedSession?.freeAnswerTexts ?? {},
  );
  const [freeInitial, setFreeInitial] = useState<FreeInitial | null>(
    savedSession?.stage === 'quiz'
      ? {
          answers: savedSession.freeAnswers,
          texts: savedSession.freeAnswerTexts,
          index: savedSession.freeIndex,
        }
      : null,
  );
  const [extensiveConfig, setExtensiveConfig] =
    useState<ExtensiveConfig | null>(demoExtensiveConfig);
  const [quizStartedAt, setQuizStartedAt] = useState<number | null>(null);
  const [pilotCount, setPilotCount] = useState(() => loadPilotSessions().length);
  const [judgment, setJudgment] = useState(
    isDemo
      ? 'El bisturí te llama, pero tu perfil aún duda entre cortar y diagnosticar. Interesante... y preocupante a partes iguales.'
      : savedSession?.judgment ?? '',
  );
  const [showResume, setShowResume] = useState(
    !!savedSession && (savedSession.stage === 'quiz' || savedSession.stage === 'extensive'),
  );
  const [reportId, setReportId] = useState(() =>
    savedSession?.reportId ??
    (savedSession?.stage === 'result' || isResultDemo ? createReportId() : ''),
  );
  const [completedAnswers, setCompletedAnswers] = useState<AnswerRecord[]>(() => {
    if (!savedSession || savedSession.stage !== 'result') {
      return isResultDemo ? SAMPLE_ANSWERS : [];
    }
    return savedSession.resultMode === 'extensive'
      ? savedSession.extensiveAnswers
      : savedSession.freeAnswers;
  });
  const [premiumAccess, setPremiumAccess] = useState<PremiumAccess | null>(() =>
    loadPremiumAccess(),
  );
  const [premiumConfig, setPremiumConfig] = useState<PremiumConfig>(DEFAULT_PREMIUM_CONFIG);
  const [premiumModalOpen, setPremiumModalOpen] = useState(false);
  const [modeModalOpen, setModeModalOpen] = useState(false);
  const [premiumLoading, setPremiumLoading] = useState(false);
  const [premiumDownloading, setPremiumDownloading] = useState(false);
  const [premiumError, setPremiumError] = useState<string | null>(null);
  const sessionEpoch = useRef(0);

  const persist = (overrides: Partial<V2PersistedSession>) => {
    const current = loadV2Session() ?? createEmptySession();
    saveV2Session({
      ...current,
      ...overrides,
      reportId: overrides.reportId ?? reportId,
      version: 1,
    });
  };

  const reset = () => {
    setResult(null);
    setResultMode('free');
    setFreeResult(null);
    setFreeAnswers([]);
    setFreeAnswerTexts({});
    setFreeInitial(null);
    setExtensiveConfig(null);
    setCompletedAnswers([]);
    setJudgment('');
    setReportId('');
    setPremiumModalOpen(false);
    setModeModalOpen(false);
    setPremiumError(null);
  };

  const start = () => {
    sessionEpoch.current += 1;
    clearV2Session();
    setShowResume(false);
    reset();
    setReportId(createReportId());
    setQuizStartedAt(Date.now());
    sendTelemetryEvent({ type: 'test_start', mode: 'free' });
    setStage('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPremiumFromStart = async () => {
    sessionEpoch.current += 1;
    clearV2Session();
    setShowResume(false);
    reset();
    const newReportId = createReportId();
    setReportId(newReportId);
    setQuizStartedAt(Date.now());
    sendTelemetryEvent({ type: 'test_start', mode: 'free' });

    if (premiumConfig.devUnlock) {
      try {
        const access = await devUnlockPremium(newReportId, 'free');
        setPremiumAccess(access);
      } catch {
        // proceed
      }
      setStage('quiz');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (premiumConfig.configured) {
      setStage('quiz');
      setPremiumModalOpen(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      try {
        const access = await devUnlockPremium(newReportId, 'free');
        setPremiumAccess(access);
      } catch {
        // proceed
      }
      setStage('quiz');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Track page views when user changes stage
  useEffect(() => {
    sendTelemetryEvent({ type: 'page_view', page: stage });
  }, [stage]);

  const home = () => {
    sessionEpoch.current += 1;
    clearV2Session();
    setShowResume(false);
    reset();
    setStage('intro');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigate = (scene: V2NavScene) => {
    setStage(scene);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    let cancelled = false;
    fetch('/api/premium/config')
      .then((response) => (response.ok ? response.json() : DEFAULT_PREMIUM_CONFIG))
      .then((config: PremiumConfig) => {
        if (!cancelled) setPremiumConfig({ ...DEFAULT_PREMIUM_CONFIG, ...config });
      })
      .catch(() => {
        if (!cancelled) setPremiumConfig(DEFAULT_PREMIUM_CONFIG);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    const premium = url.searchParams.get('premium');
    if (!premium) return;

    const sessionId = url.searchParams.get('session_id');
    const queryReportId = url.searchParams.get('report_id');

    if (premium === 'success' && sessionId && queryReportId) {
      verifyPremiumSession(sessionId, queryReportId)
        .then((access) => {
          setPremiumAccess(access);
          setReportId((current) => current || access.reportId);
          savePremiumAccess(access);
        })
        .catch((error: Error) => {
          setPremiumError(error.message || 'No se pudo verificar el pago.');
        });
    } else if (premium === 'cancel') {
      setPremiumError('Pago cancelado. No se ha realizado ningún cargo.');
    }

    url.searchParams.delete('premium');
    url.searchParams.delete('session_id');
    url.searchParams.delete('report_id');
    window.history.replaceState(
      {},
      '',
      `${url.pathname}${url.search ? `?${url.searchParams.toString()}` : ''}`,
    );
  }, []);

  useEffect(() => {
    if (isDemo || !result || !reportId) return;
    persist({ reportId });
  }, [isDemo, reportId, result]);

  const completeFree = (
    nextResult: QuizResult,
    answers: AnswerRecord[],
    answerTexts: Record<string, string>,
  ) => {
    const durationMs = quizStartedAt ? Date.now() - quizStartedAt : 0;
    const durationSeconds = Math.max(10, Math.round(durationMs / 1000)) || 180;
    savePilotSession(createPilotSession(nextResult, answers, 'free', durationMs));
    setPilotCount(loadPilotSessions().length);

    const nextReportId = reportId || createReportId();
    if (!reportId) setReportId(nextReportId);

    setFreeResult(nextResult);
    setFreeAnswers(answers);
    setFreeAnswerTexts(answerTexts);
    setCompletedAnswers(answers);
    setResult(nextResult);
    setResultMode('free');
    setJudgment('');
    setStage('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Step 3 Telemetry Event: Test Completed
    const first = nextResult.top[0];
    const { house } = deriveHouse(nextResult.profile);
    sendTelemetryEvent({
      type: 'test_complete',
      mode: 'free',
      specialtyId: first?.specialty.id,
      specialtyName: first?.specialty.name,
      house,
      durationSeconds,
    });

    const epoch = sessionEpoch.current;

    persist({
      stage: 'result',
      reportId: nextReportId,
      freeAnswers: answers,
      freeAnswerTexts: answerTexts,
      freeIndex: QUICK_QUESTION_SET.questions.length,
      freeResult: nextResult,
      extensiveAnswers: [],
      extensiveAnswerTexts: {},
      extensiveIndex: 0,
      result: nextResult,
      resultMode: 'free',
      judgment: '',
    });

    if (first) {
      getFinalJudgment(
        first.specialty.name,
        first.specialty.description,
        Object.values(answerTexts),
      ).then((text) => {
        if (sessionEpoch.current !== epoch) return;
        setJudgment(text);
        persist({ judgment: text });
      });
    }
  };

  const startExtensive = () => {
    if (!freeResult) return;

    sessionEpoch.current += 1;
    setQuizStartedAt(Date.now());
    sendTelemetryEvent({ type: 'test_start', mode: 'extensive' });
    const branchQuestions = selectBranchQuestions(freeResult);
    setExtensiveConfig({
      displayQuestions: getExtensiveDisplayQuestions(branchQuestions),
      scoringQuestionSet: buildScoringQuestionSet(QUICK_QUESTION_SET, branchQuestions),
      initialAnswers: freeAnswers,
      initialAnswerTexts: freeAnswerTexts,
      initialIndex: 0,
      answeredOffset: QUICK_QUESTION_SET.questions.length,
    });
    setCompletedAnswers(freeAnswers);
    persist({
      stage: 'extensive',
      reportId,
      freeAnswers,
      freeAnswerTexts,
      freeIndex: QUICK_QUESTION_SET.questions.length,
      freeResult,
      extensiveAnswers: freeAnswers,
      extensiveAnswerTexts: freeAnswerTexts,
      extensiveIndex: 0,
      result: null,
      resultMode: 'free',
      judgment: '',
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
    const durationSeconds = Math.max(10, Math.round(durationMs / 1000)) || 240;
    savePilotSession(createPilotSession(nextResult, answers, 'extensive', durationMs));
    setPilotCount(loadPilotSessions().length);

    const nextReportId = reportId || createReportId();
    if (!reportId) setReportId(nextReportId);

    setCompletedAnswers(answers);
    setResult(nextResult);
    setResultMode('extensive');
    setJudgment('');
    setStage('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Step 3 Telemetry Event: Test Extensive Completed
    const first = nextResult.top[0];
    const { house } = deriveHouse(nextResult.profile);
    sendTelemetryEvent({
      type: 'test_complete',
      mode: 'extensive',
      specialtyId: first?.specialty.id,
      specialtyName: first?.specialty.name,
      house,
      durationSeconds,
    });

    const epoch = sessionEpoch.current;

    persist({
      stage: 'result',
      reportId: nextReportId,
      extensiveAnswers: answers,
      extensiveAnswerTexts: answerTexts,
      extensiveIndex: extensiveConfig?.displayQuestions.length ?? 0,
      result: nextResult,
      resultMode: 'extensive',
      judgment: '',
    });

    if (first) {
      getFinalJudgment(
        first.specialty.name,
        first.specialty.description,
        Object.values(answerTexts),
      ).then((text) => {
        if (sessionEpoch.current !== epoch) return;
        setJudgment(text);
        persist({ judgment: text });
      });
    }
  };

  const resumeSession = () => {
    if (!savedSession) return;
    setShowResume(false);

    const resumeReportId = savedSession.reportId || createReportId();
    setReportId(resumeReportId);

    if (savedSession.stage === 'quiz') {
      setFreeInitial({
        answers: savedSession.freeAnswers,
        texts: savedSession.freeAnswerTexts,
        index: savedSession.freeIndex,
      });
      setFreeAnswers(savedSession.freeAnswers);
      setFreeAnswerTexts(savedSession.freeAnswerTexts);
      setStage('quiz');
      return;
    }

    if (savedSession.stage === 'extensive' && savedSession.freeResult) {
      const branchQuestions = selectBranchQuestions(savedSession.freeResult);
      setFreeResult(savedSession.freeResult);
      setFreeAnswers(savedSession.freeAnswers);
      setFreeAnswerTexts(savedSession.freeAnswerTexts);
      setCompletedAnswers(savedSession.freeAnswers);
      setExtensiveConfig({
        displayQuestions: getExtensiveDisplayQuestions(branchQuestions),
        scoringQuestionSet: buildScoringQuestionSet(QUICK_QUESTION_SET, branchQuestions),
        initialAnswers: savedSession.extensiveAnswers,
        initialAnswerTexts: savedSession.extensiveAnswerTexts,
        initialIndex: savedSession.extensiveIndex,
        answeredOffset: QUICK_QUESTION_SET.questions.length,
      });
      setStage('extensive');
    }
  };

  const discardResume = () => {
    clearV2Session();
    setShowResume(false);
    setFreeInitial(null);
    setCompletedAnswers([]);
    setReportId('');
    setStage('intro');
  };

  const clearPilot = () => {
    clearPilotSessions();
    setPilotCount(0);
  };

  const premiumUnlocked = !!premiumAccess && premiumAccess.reportId === reportId;
  const premiumPaymentConfigured = premiumConfig.configured || premiumConfig.devUnlock;
  const premiumPriceLabel = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: premiumConfig.currency.toUpperCase(),
  }).format(premiumConfig.priceCents / 100);

  const handlePremiumUnlock = () => {
    setPremiumError(null);
    setPremiumModalOpen(true);
  };

  const handlePremiumCheckout = async () => {
    if (!reportId) {
      setPremiumError('No encontramos el identificador de este informe.');
      return;
    }

    setPremiumLoading(true);
    setPremiumError(null);
    try {
      const checkout = await startPremiumCheckout(reportId, resultMode as PremiumMode);
      if (checkout.access) {
        setPremiumAccess(checkout.access);
        setPremiumModalOpen(false);
      } else if (checkout.url) {
        window.location.assign(checkout.url);
      } else {
        throw new Error('El servidor no devolvió una sesión de pago.');
      }
    } catch (error: any) {
      setPremiumError(error?.message || 'No se pudo iniciar el pago.');
    } finally {
      setPremiumLoading(false);
    }
  };

  const handlePremiumDownload = async () => {
    if (!premiumAccess || !premiumUnlocked) {
      setPremiumError('Este informe todavía no está desbloqueado.');
      return;
    }
    if (completedAnswers.length === 0) {
      setPremiumError('No encontramos las respuestas de este informe. Vuelve a realizar el test.');
      return;
    }

    setPremiumDownloading(true);
    setPremiumError(null);
    try {
      const blob = await downloadPremiumPdf(
        premiumAccess,
        completedAnswers,
        resultMode as PremiumMode,
      );
      downloadBlob(blob, `Arcanum_Informe_${reportId.slice(0, 8)}.pdf`);
      sendTelemetryEvent({
        type: 'retention_action',
        actionDetail: 'download_pdf',
        specialtyName: result?.ranking[0]?.specialty.name,
        house: result ? deriveHouse(result.profile).house : undefined,
        mode: resultMode,
      });
    } catch (error: any) {
      setPremiumError(error?.message || 'No se pudo generar el PDF.');
    } finally {
      setPremiumDownloading(false);
    }
  };

  return (
    <AtmosphericFrame>
      {stage !== 'quiz' && stage !== 'extensive' && isV2NavScene(stage) && (
        <V2Navbar
          activeScene={stage}
          onNavigate={navigate}
          onStart={start}
          pilotCount={pilotCount}
          onExportPilot={() => downloadPilotSessions('json')}
          onClearPilot={clearPilot}
          isDemo={isDemo}
        />
      )}

      {showResume && savedSession && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="glass-surface w-full max-w-md space-y-5 p-8 text-center">
            <h2 className="font-display text-2xl font-bold text-gold">
              Tienes un test sin terminar
            </h2>
            <p className="text-sm leading-relaxed text-parchment/65">
              Puedes continuar donde lo dejaste o empezar de nuevo. Tu progreso se guarda solo en
              este navegador.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={resumeSession}
                className="flex-1 border border-gold/60 bg-gold/15 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold/25"
              >
                Continuar test
              </button>
              <button
                onClick={discardResume}
                className="flex-1 border border-gold/20 px-5 py-3 text-[10px] uppercase tracking-[0.2em] text-parchment/50 transition-colors hover:text-gold"
              >
                Empezar de nuevo
              </button>
            </div>
          </div>
        </div>
      )}

      <V2ModeSelectionModal
        open={modeModalOpen}
        priceLabel={premiumPriceLabel}
        paymentConfigured={premiumPaymentConfigured}
        onClose={() => setModeModalOpen(false)}
        onSelectFree={start}
        onSelectPremium={handleSelectPremiumFromStart}
      />

      <V2PremiumModal
        open={premiumModalOpen}
        priceLabel={premiumPriceLabel}
        isExtensive={resultMode === 'extensive'}
        loading={premiumLoading}
        error={premiumError}
        onClose={() => setPremiumModalOpen(false)}
        onCheckout={handlePremiumCheckout}
      />

      <div
        className={`flex flex-1 flex-col ${
          stage === 'quiz' || stage === 'extensive' ? '' : 'pt-20 sm:pt-24'
        }`}
      >
        {stage === 'intro' && (
          <main className="flex flex-1 flex-col items-center px-4 pb-10">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-5xl text-center"
            >
              <p className="text-[10px] uppercase tracking-[0.4em] text-medical-teal sm:text-xs">
                Algoritmo de orientación vocacional médica
              </p>
              <h1 className="mt-2 font-display text-3xl font-bold uppercase tracking-widest text-gold magic-shadow sm:text-5xl">
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
                Catorce preguntas. Un perfil vocacional. Las cinco especialidades que más encajan
                contigo. Sin registro y sin promesas de certeza.
              </p>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setModeModalOpen(true)}
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

            <footer className="mt-auto flex w-full max-w-4xl flex-wrap items-center justify-between gap-6 px-4 pt-12">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-[0.2em] text-medical-teal sm:text-xs">
                  Esperando Aspirante
                </span>
                <div className="h-[2px] w-32 bg-medical-teal/10 sm:w-48" />
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate('backoffice')}
                  className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-gold/70 hover:text-gold transition-colors cursor-pointer"
                >
                  <TrendingUp size={12} className="text-gold" />
                  <span>Backoffice de Telemetría</span>
                </button>
                <span className="font-mono text-[9px] uppercase tracking-widest text-medical-teal/40">
                  V2 · 51 especialidades activas
                </span>
              </div>
            </footer>
          </main>
        )}

        {stage === 'quiz' && (
          <main className="flex flex-1 items-start justify-center">
            <V2Quiz
              initialAnswers={freeInitial?.answers ?? []}
              initialAnswerTexts={freeInitial?.texts ?? {}}
              initialIndex={freeInitial?.index ?? 0}
              onComplete={completeFree}
              onProgress={(index, answers, answerTexts) =>
                persist({
                  stage: 'quiz',
                  freeAnswers: answers,
                  freeAnswerTexts: answerTexts,
                  freeIndex: index,
                  freeResult: null,
                  extensiveAnswers: [],
                  extensiveAnswerTexts: {},
                  extensiveIndex: 0,
                  result: null,
                  resultMode: 'free',
                  judgment: '',
                })
              }
              onCancel={home}
            />
          </main>
        )}

        {stage === 'extensive' && extensiveConfig && (
          <main className="flex flex-1 items-start justify-center">
            <V2Quiz
              questions={extensiveConfig.displayQuestions}
              scoringQuestionSet={extensiveConfig.scoringQuestionSet}
              initialAnswers={extensiveConfig.initialAnswers}
              initialAnswerTexts={extensiveConfig.initialAnswerTexts}
              initialIndex={extensiveConfig.initialIndex}
              answeredOffset={extensiveConfig.answeredOffset}
              modeLabel={`Test extensivo beta · ${extensiveConfig.answeredOffset + extensiveConfig.displayQuestions.length} preguntas · el Sombrero sigue leyendo`}
              onComplete={completeExtensive}
              onProgress={(index, answers, answerTexts) =>
                persist({
                  stage: 'extensive',
                  extensiveAnswers: answers,
                  extensiveAnswerTexts: answerTexts,
                  extensiveIndex: index,
                })
              }
              onCancel={() => {
                if (freeResult) {
                  setResult(freeResult);
                  setResultMode('free');
                  setStage('result');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                  navigate('intro');
                }
              }}
            />
          </main>
        )}

        {stage === 'result' && result && (
          <main className="flex flex-1 items-start justify-center">
            <V2Result
              result={result}
              judgment={judgment}
              isExtensive={resultMode === 'extensive'}
              reportId={reportId}
              premiumAccess={premiumAccess}
              premiumPriceLabel={premiumPriceLabel}
              paymentConfigured={premiumPaymentConfigured}
              onUnlockPremium={handlePremiumUnlock}
              onDownloadPremium={handlePremiumDownload}
              premiumDownloading={premiumDownloading}
              premiumError={premiumError}
              onStartExtensive={freeResult ? startExtensive : undefined}
              onRestart={start}
              onHome={home}
            />
          </main>
        )}

        {stage === 'catalog' && (
          <main className="flex flex-1 items-start justify-center">
            <V2Catalog
              onBack={() => navigate('intro')}
              onStartTest={() => setModeModalOpen(true)}
            />
          </main>
        )}

        {stage === 'blog' && <V2Blog />}
        {stage === 'about' && (
          <V2About
            onOpenCatalog={() => navigate('catalog')}
            onStartTest={() => setModeModalOpen(true)}
          />
        )}
        {stage === 'stats' && (
          <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-12">
            <StatsView />
          </main>
        )}
        {stage === 'oracle' && (
          <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-12">
            <OracleView />
          </main>
        )}
        {stage === 'backoffice' && (
          <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-12">
            <V2Backoffice onBack={() => navigate('intro')} />
          </main>
        )}
      </div>
    </AtmosphericFrame>
  );
}
