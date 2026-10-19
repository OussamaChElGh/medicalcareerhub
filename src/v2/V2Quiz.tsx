import { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Check, Sparkles, X } from 'lucide-react';
import { QUICK_QUESTION_SET } from '../data/questions.quick';
import { ACTIVE_SPECIALTIES } from '../data/specialties';
import { AnswerRecord, QuestionSet, QuickOption, QuickQuestion, QuizResult } from '../types';
import { getHatThought, getLocalHatThought } from '../lib/gemini';
import { scoreQuiz } from '../lib/scoring';
import { V2HatPanel } from './V2HatPanel';

interface V2QuizProps {
  questions?: QuickQuestion[];
  scoringQuestionSet?: QuestionSet;
  initialAnswers?: AnswerRecord[];
  initialAnswerTexts?: Record<string, string>;
  initialIndex?: number;
  answeredOffset?: number;
  modeLabel?: string;
  onComplete: (result: QuizResult, answers: AnswerRecord[], answerTexts: Record<string, string>) => void;
  onProgress?: (index: number, answers: AnswerRecord[], answerTexts: Record<string, string>) => void;
  onCancel: () => void;
}

export function V2Quiz({
  questions,
  scoringQuestionSet,
  initialAnswers = [],
  initialAnswerTexts = {},
  initialIndex = 0,
  answeredOffset = 0,
  modeLabel = 'Test gratuito · 14 preguntas · el Sombrero no adivina, calcula',
  onComplete,
  onProgress,
  onCancel,
}: V2QuizProps) {
  const activeQuestions = questions ?? QUICK_QUESTION_SET.questions;
  const activeScoringSet = scoringQuestionSet ?? QUICK_QUESTION_SET;
  const [index, setIndex] = useState(Math.min(Math.max(0, initialIndex), activeQuestions.length - 1));
  const [answers, setAnswers] = useState<AnswerRecord[]>(initialAnswers);
  const [answerTexts, setAnswerTexts] = useState<Record<string, string>>(initialAnswerTexts);
  const [optionId, setOptionId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [mostId, setMostId] = useState<string | null>(null);
  const [leastId, setLeastId] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, number | null | undefined>>({});
  const [error, setError] = useState<string | null>(null);
  const [hatThought, setHatThought] = useState(() => getLocalHatThought());
  const [hatThinking, setHatThinking] = useState(false);
  const [usedThoughts, setUsedThoughts] = useState<string[]>([]);
  const committing = useRef(false);

  const question = activeQuestions[index];
  const total = activeQuestions.length;
  const progress = useMemo(
    () => Math.round(((answeredOffset + index) / (answeredOffset + total)) * 100),
    [answeredOffset, index, total],
  );

  const resetDraft = () => {
    setOptionId(null);
    setSelectedIds([]);
    setMostId(null);
    setLeastId(null);
    setValues({});
    setError(null);
  };

  const reactWithHat = (summary: string) => {
    const previous = Object.values(answerTexts) as string[];
    const instant = getLocalHatThought(usedThoughts);
    setHatThought(instant);
    setUsedThoughts((current) => [...current, instant]);

    setHatThinking(true);
    getHatThought(previous, question.prompt, summary, usedThoughts)
      .then((thought) => {
        if (thought && thought !== instant) {
          setHatThought(thought);
          setUsedThoughts((current) => [...current, thought]);
        }
      })
      .finally(() => setHatThinking(false));
  };

  const commit = (answer: AnswerRecord, summary: string) => {
    if (committing.current) return;
    committing.current = true;

    const nextAnswers = [...answers.filter((item) => item.questionId !== question.id), answer];
    const nextTexts = { ...answerTexts, [question.id]: summary };

    setAnswerTexts(nextTexts);
    reactWithHat(summary);

    if (index === total - 1) {
      onComplete(
        scoreQuiz(nextAnswers, {
          questionSet: activeScoringSet,
          specialties: ACTIVE_SPECIALTIES,
        }),
        nextAnswers,
        nextTexts,
      );
      return;
    }

    const nextIndex = index + 1;
    setAnswers(nextAnswers);
    setIndex(nextIndex);
    resetDraft();
    onProgress?.(nextIndex, nextAnswers, nextTexts);
    window.setTimeout(() => {
      committing.current = false;
    }, 250);
  };

  const goBack = () => {
    if (index === 0) {
      onCancel();
      return;
    }
    const nextIndex = index - 1;
    setIndex(nextIndex);
    resetDraft();
    onProgress?.(nextIndex, answers, answerTexts);
  };

  const handleForced = (option: QuickOption) => {
    setOptionId(option.id);
    commit({ questionId: question.id, optionId: option.id }, option.text);
  };

  const handleRateOption = (optionId: string, rating: number) => {
    setError(null);
    setValues((prev) => ({
      ...prev,
      [optionId]: rating,
    }));
  };

  const fillRemainingWithNeutral = () => {
    const next = { ...values };
    (question.options ?? []).forEach((opt) => {
      if (typeof next[opt.id] !== 'number') {
        next[opt.id] = 3;
      }
    });
    setValues(next);
  };

  const submitRatedForced = () => {
    const options = question.options ?? [];
    const missing = options.filter((opt) => typeof values[opt.id] !== 'number');
    if (missing.length > 0) {
      setError(`Valora las ${missing.length} opciones restantes de 1 a 5 (o pulsa "Poner 3 a restantes").`);
      return;
    }

    const ratedValues: Record<string, number> = {};
    options.forEach((opt) => {
      ratedValues[opt.id] = (values[opt.id] as number) ?? 3;
    });

    const topRated = [...options].sort(
      (a, b) => (ratedValues[b.id] ?? 0) - (ratedValues[a.id] ?? 0),
    )[0];

    const summary = topRated
      ? `Mayor afinidad: ${topRated.text} (${ratedValues[topRated.id]}/5)`
      : 'Opciones evaluadas de 1 a 5';

    commit(
      {
        questionId: question.id,
        values: ratedValues,
      },
      summary,
    );
  };

  const handleMulti = (option: QuickOption) => {
    const max = question.maxSelections ?? 99;
    setError(null);
    setSelectedIds((current) => {
      if (current.includes(option.id)) {
        return current.filter((id) => id !== option.id);
      }
      if (current.length >= max) {
        setError(`Puedes elegir como máximo ${max}.`);
        return current;
      }
      return [...current, option.id];
    });
  };

  const handleMost = (option: QuickOption) => {
    setError(null);
    setMostId(option.id);
    if (leastId === option.id) setLeastId(null);
  };

  const handleLeast = (option: QuickOption) => {
    setError(null);
    setLeastId(option.id);
    if (mostId === option.id) setMostId(null);
  };

  const submitMulti = () => {
    if (selectedIds.length === 0) {
      setError('Elige al menos una opción.');
      return;
    }
    const labels = (question.options ?? [])
      .filter((option) => selectedIds.includes(option.id))
      .map((option) => option.text)
      .join('; ');
    commit({ questionId: question.id, optionIds: selectedIds }, labels);
  };

  const submitMaxdiff = () => {
    if (!mostId || !leastId) {
      setError('Marca una opción como “más” y otra como “menos”.');
      return;
    }
    if (mostId === leastId) {
      setError('La opción “más” y la “menos” deben ser distintas.');
      return;
    }
    const most = question.options?.find((option) => option.id === mostId);
    const least = question.options?.find((option) => option.id === leastId);
    commit(
      { questionId: question.id, mostId, leastId },
      `Más: ${most?.text ?? ''}; Menos: ${least?.text ?? ''}`,
    );
  };

  const submitRatings = () => {
    const statements = question.statements ?? [];
    const missing = statements.some((statement) => values[statement.id] === undefined);
    if (missing) {
      setError('Responde a todas las afirmaciones.');
      return;
    }
    const summary = statements
      .map((statement) => {
        const value = values[statement.id];
        return `${statement.text} (${value === null ? 'No lo sé' : value}/5)`;
      })
      .join('; ');
    commit({ questionId: question.id, values: values as Record<string, number | null> }, summary);
  };

  const renderForced = () => {
    const options = question.options ?? [];
    const ratedCount = options.filter((opt) => typeof values[opt.id] === 'number').length;

    return (
      <div className="space-y-4">
        {/* Rating Instructions & Progress Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gold/15 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold/20 text-gold text-[10px] font-bold">
              ★
            </span>
            <span className="font-mono text-xs uppercase tracking-wider text-parchment font-semibold">
              Puntúa cada opción de 1 a 5 según tu afinidad
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="font-mono text-[11px] text-parchment/70">
              Progreso: <strong className="text-gold">{ratedCount}</strong>/{options.length} valoradas
            </span>
            {ratedCount < options.length && (
              <button
                type="button"
                onClick={fillRemainingWithNeutral}
                className="text-[10px] text-medical-teal hover:underline font-semibold"
              >
                Poner 3 a restantes
              </button>
            )}
          </div>
        </div>

        {/* List of Options with 1-5 Ratings */}
        <div className="space-y-3">
          {options.map((option, idx) => {
            const currentRating = values[option.id];
            const isRated = typeof currentRating === 'number';

            return (
              <div
                key={option.id}
                className={`group rounded-xl border p-4 sm:p-5 transition-all duration-200 ${
                  isRated
                    ? 'border-gold/50 bg-[#0c1524]/90 shadow-md ring-1 ring-gold/20'
                    : 'border-gold/20 bg-[#080f19]/80 hover:border-gold/40'
                }`}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="font-mono text-xs font-bold text-gold/70 bg-gold/10 border border-gold/30 rounded-md h-6 w-6 flex items-center justify-center shrink-0 mt-0.5">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <p className="font-magic text-sm sm:text-base leading-snug text-[#f7eedc] group-hover:text-gold transition-colors">
                      {option.text}
                    </p>
                  </div>

                  {/* 1-5 Rating Scale */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gold/10 w-full sm:w-auto justify-between sm:justify-end">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-parchment/60 sm:hidden">
                      Afinidad:
                    </span>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((val) => {
                        const isValSelected = currentRating === val;
                        const ratingLabels = ['1: Nada', '2: Poco', '3: Neutro', '4: Bastante', '5: Total'];
                        return (
                          <button
                            key={val}
                            type="button"
                            onClick={() => handleRateOption(option.id, val)}
                            title={ratingLabels[val - 1]}
                            className={`h-9 w-9 sm:h-10 sm:w-10 rounded-lg border font-mono text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                              isValSelected
                                ? 'border-gold bg-gradient-to-b from-gold to-amber-600 text-bg-deep shadow-[0_0_15px_rgba(217,119,6,0.6)] scale-105'
                                : 'border-gold/20 bg-black/40 text-parchment/70 hover:border-gold/50 hover:bg-gold/10 hover:text-gold'
                            }`}
                          >
                            {val}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {isRated && (
                  <div className="mt-2 text-right text-[10px] font-mono font-medium text-gold-light/90">
                    {currentRating === 1 && '1/5 — Mínima afinidad / No me identifico'}
                    {currentRating === 2 && '2/5 — Baja afinidad / Raramente'}
                    {currentRating === 3 && '3/5 — Afinidad moderada / Neutral'}
                    {currentRating === 4 && '4/5 — Alta afinidad / Me atrae'}
                    {currentRating === 5 && '5/5 — Máxima afinidad / Me define completamente'}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Scale Legend */}
        <div className="flex flex-wrap items-center justify-between text-[10px] font-mono text-parchment/50 px-1 pt-1">
          <span>1 = Mínima afinidad</span>
          <span>3 = Interés moderado</span>
          <span>5 = Máxima prioridad</span>
        </div>
      </div>
    );
  };

  const renderMaxdiff = () => (
    <div className="space-y-3">
      <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest text-parchment/50">
        <span className="inline-flex items-center gap-1 text-emerald-400">
          <Check size={12} /> Más
        </span>
        <span className="inline-flex items-center gap-1 text-rose-300">
          <X size={12} /> Menos
        </span>
      </div>
      {(question.options ?? []).map((option) => (
        <div
          key={option.id}
          className={`flex flex-col gap-3 border p-4 transition-colors sm:flex-row sm:items-center sm:justify-between ${
            mostId === option.id
              ? 'border-emerald-400/60 bg-emerald-400/10'
              : leastId === option.id
                ? 'border-rose-400/60 bg-rose-400/10'
                : 'border-gold/25 bg-gold/5'
          }`}
        >
          <span className="font-magic text-sm leading-snug text-parchment sm:text-base">{option.text}</span>
          <div className="flex flex-shrink-0 gap-2">
            <button
              onClick={() => handleMost(option)}
              className={`rounded-sm border px-3 py-1 text-[10px] uppercase tracking-widest transition-colors ${
                mostId === option.id
                  ? 'border-emerald-400 bg-emerald-400/20 text-emerald-200'
                  : 'border-emerald-400/30 text-emerald-300/70 hover:border-emerald-400'
              }`}
            >
              Más
            </button>
            <button
              onClick={() => handleLeast(option)}
              className={`rounded-sm border px-3 py-1 text-[10px] uppercase tracking-widest transition-colors ${
                leastId === option.id
                  ? 'border-rose-400 bg-rose-400/20 text-rose-200'
                  : 'border-rose-400/30 text-rose-300/70 hover:border-rose-400'
              }`}
            >
              Menos
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderMulti = () => (
    <div className="space-y-3">
      <p className="text-[10px] uppercase tracking-widest text-parchment/40">
        Máximo {question.maxSelections ?? 2} · seleccionadas {selectedIds.length}
      </p>
      <div className="flex flex-wrap gap-2">
        {(question.options ?? []).map((option) => {
          const selected = selectedIds.includes(option.id);
          return (
            <button
              key={option.id}
              onClick={() => handleMulti(option)}
              className={`rounded-sm border px-4 py-2.5 text-sm transition-all ${
                selected
                  ? 'border-gold bg-gold/20 text-gold'
                  : 'border-gold/25 bg-gold/5 text-parchment hover:border-gold/70'
              }`}
            >
              {option.text}
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderRatings = () => (
    <div className="space-y-4">
      {(question.statements ?? []).map((statement) => (
        <div key={statement.id} className="space-y-3 border-b border-gold/10 pb-4 last:border-none last:pb-0">
          <p className="font-sans text-sm text-parchment/90 sm:text-base">{statement.text}</p>
          <div className="flex flex-wrap items-center gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                onClick={() => {
                  setError(null);
                  setValues((current) => ({ ...current, [statement.id]: value }));
                }}
                className={`h-10 w-10 rounded-sm border text-sm transition-all ${
                  values[statement.id] === value
                    ? 'border-gold bg-gold/25 text-gold'
                    : 'border-gold/25 bg-gold/5 text-parchment/70 hover:border-gold/70'
                }`}
              >
                {value}
              </button>
            ))}
            {question.allowUnknown && (
              <button
                onClick={() => {
                  setError(null);
                  setValues((current) => ({ ...current, [statement.id]: null }));
                }}
                className={`rounded-sm border px-3 py-2 text-[10px] uppercase tracking-widest transition-all ${
                  values[statement.id] === null
                    ? 'border-medical-teal bg-medical-teal/20 text-medical-teal'
                    : 'border-gold/20 text-parchment/50 hover:border-medical-teal/60'
                }`}
              >
                No lo sé
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-12">
      <div className="flex flex-col lg:flex-row lg:items-start lg:gap-12">
        <aside className="hidden lg:sticky lg:top-24 lg:flex lg:w-[320px] lg:flex-shrink-0 lg:flex-col lg:items-center">
          <V2HatPanel thought={hatThought} thinking={hatThinking} />
        </aside>

        <div className="w-full lg:flex-1">
          <div className="mb-4 lg:hidden">
            <V2HatPanel thought={hatThought} thinking={hatThinking} compact />
          </div>

          <div className="mb-6 flex items-center justify-between gap-4">
            <button
              onClick={goBack}
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-parchment/50 transition-colors hover:text-gold"
            >
              <ArrowLeft size={14} />
              {index === 0 ? 'Salir' : 'Atrás'}
            </button>
            <div className="flex items-center gap-3">
              {hatThinking && (
                <span className="animate-pulse text-[8px] uppercase tracking-widest text-medical-teal">
                  El Sombrero está leyendo...
                </span>
              )}
              <span className="text-[10px] uppercase tracking-widest text-gold-dim">
                Pregunta {answeredOffset + index + 1} de {answeredOffset + total}
              </span>
            </div>
          </div>

          <div className="mb-8 h-[2px] w-full bg-gold/10">
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.35 }}
              className="h-full bg-gold shadow-[0_0_10px_rgba(197,160,89,0.5)]"
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
              className="glass-surface space-y-6 p-6 sm:p-10"
            >
              <div className="absolute left-0 top-0 h-4 w-4 border-l-2 border-t-2 border-gold/40" />
              <div className="absolute right-0 top-0 h-4 w-4 border-r-2 border-t-2 border-gold/40" />
              <div className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-gold/40" />
              <div className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-gold/40" />

              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-3 py-1 text-[9px] uppercase tracking-[0.25em] text-gold">
                  <Sparkles size={11} />
                  {question.kind === 'forced'
                    ? 'Valoración de Opciones (1 a 5)'
                    : question.kind === 'maxdiff'
                      ? 'Contraste'
                      : question.kind === 'multi'
                        ? 'Selección múltiple'
                        : 'Escala'}
                </div>
                <h2 className="font-sans text-xl font-semibold italic leading-snug text-parchment sm:text-2xl">
                  {question.prompt}
                </h2>
                {question.help && (
                  <p className="text-xs italic text-parchment/50 sm:text-sm">{question.help}</p>
                )}
              </div>

              {question.kind === 'forced' && renderForced()}
              {question.kind === 'maxdiff' && renderMaxdiff()}
              {question.kind === 'multi' && renderMulti()}
              {question.kind === 'ratingGroup' && renderRatings()}

              {error && <p className="text-xs italic text-rose-300">{error}</p>}

              <div className="flex justify-end border-t border-gold/10 pt-4">
                <button
                  onClick={
                    question.kind === 'forced'
                      ? submitRatedForced
                      : question.kind === 'maxdiff'
                        ? submitMaxdiff
                        : question.kind === 'multi'
                          ? submitMulti
                          : submitRatings
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-gold/60 bg-gradient-to-r from-gold/30 via-gold/40 to-gold/30 px-6 py-3 text-xs font-bold uppercase tracking-widest text-parchment shadow-[0_0_20px_rgba(217,119,6,0.3)] transition-all hover:bg-gold/40 hover:text-white cursor-pointer"
                >
                  Continuar Juicio
                  <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>

          <p className="mt-6 text-center text-[10px] uppercase tracking-widest text-parchment/30">
            {modeLabel}
          </p>
        </div>
      </div>
    </div>
  );
}
