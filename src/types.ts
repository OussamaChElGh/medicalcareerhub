export interface Option {
  id: string;
  text: string;
  sigil: string;
  alignment: string; // The medical archetype this supports
}

export interface Question {
  id: number;
  label: string;
  text: string;
  options: Option[];
}

export interface Specialty {
  id: string;
  name: string;
  description: string;
  alternatives: string[];
  rationale: string;
  hogwartsHouse?: 'Gryffindor' | 'Slytherin' | 'Ravenclaw' | 'Hufflepuff';
}

export interface BlogPost {
  title: string;
  date: string;
  author: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
}

export type QuizType = 'QUICK' | 'EXTENSIVE';

export type Scene = 'HOME' | 'SELECTION' | 'PAYMENT' | 'QUIZ' | 'REVEAL' | 'THINK' | 'RESULT' | 'BLOG' | 'STATS' | 'ORACLE' | 'ABOUT' | 'SPECIALTIES';

// ---------------------------------------------------------------------------
// Modelo de scoring v2
// ---------------------------------------------------------------------------

export type NumericDimensionId = 'A1' | 'A2' | 'A3' | 'A4' | 'A5' | 'A8';
export type MatchDimensionId = 'A6' | 'A7' | 'A9' | 'A10';
export type ConstraintDimensionId = 'C1' | 'C2';
export type DimensionId = NumericDimensionId | MatchDimensionId | ConstraintDimensionId;

export type PopulationKey = 'neonatal' | 'pediatric' | 'adult' | 'elderly' | 'pregnancy' | 'all';
export type OutcomeKey =
  | 'cure'
  | 'chronic'
  | 'function'
  | 'palliative'
  | 'prevention'
  | 'diagnosis'
  | 'knowledge'
  | 'stabilize';
export type EnvironmentKey = 'emergency' | 'or' | 'ward' | 'consultation' | 'lab' | 'imaging' | 'home';
export type SystemKey =
  | 'cardiovascular'
  | 'respiratory'
  | 'digestive'
  | 'renal'
  | 'hematologic'
  | 'immune'
  | 'nervous'
  | 'musculoskeletal'
  | 'endocrine'
  | 'skin'
  | 'sensory'
  | 'reproductive'
  | 'mental'
  | 'multisystem';
export type ConstraintKey =
  | 'uncertainty'
  | 'suffering'
  | 'pressure'
  | 'death'
  | 'guards'
  | 'predictability'
  | 'flexibility'
  | 'research';

export interface DimensionDefinition {
  id: DimensionId;
  label: string;
  shortLabel: string;
  kind: 'numeric' | 'match' | 'constraint';
  description: string;
  lowLabel?: string;
  highLabel?: string;
}

export type QuestionKind = 'forced' | 'maxdiff' | 'rating' | 'ratingGroup' | 'multi';

export type QuestionBlock = 'core' | 'branch';

export interface QuickOption {
  id: string;
  text: string;
  scores?: Partial<Record<NumericDimensionId, number>>;
  constraintScores?: Partial<Record<ConstraintKey, number>>;
  matchValue?: PopulationKey | OutcomeKey | EnvironmentKey | SystemKey;
}

export interface QuickStatement {
  id: ConstraintKey;
  text: string;
  dimension: ConstraintDimensionId;
  /** Si la escala mide dificultad en lugar de tolerancia, se invierte al puntuar. */
  reverse?: boolean;
}

export interface QuickQuestion {
  id: string;
  order: number;
  kind: QuestionKind;
  prompt: string;
  help?: string;
  options?: QuickOption[];
  dimension?: NumericDimensionId;
  statements?: QuickStatement[];
  matchDimension?: MatchDimensionId;
  matchMode?: 'select' | 'reject';
  maxSelections?: number;
  allowUnknown?: boolean;
  block?: QuestionBlock;
  targetDimension?: NumericDimensionId | ConstraintDimensionId;
  branchAxis?: NumericDimensionId | ConstraintDimensionId | 'A10';
  weight?: number;
}

export interface QuestionSet {
  id: string;
  version: string;
  questions: QuickQuestion[];
}

export interface AnswerRecord {
  questionId: string;
  optionId?: string;
  optionIds?: string[];
  mostId?: string;
  leastId?: string;
  value?: number | null;
  values?: Record<string, number | null>;
  skipped?: boolean;
}

export interface SpecialtyConstraintProfile {
  emotionalLoad: number;
  guards: number;
  predictability: number;
  flexibility: number;
  research: number;
}

export type SpecialtyReviewStatus = 'draft' | 'reviewed';

export interface SpecialtyProfile {
  id: string;
  name: string;
  type: 'MIR' | 'ACE' | 'AREA';
  system: 'ES';
  family: string;
  status: 'active' | 'draft';
  description: string;
  numeric: Record<NumericDimensionId, number>;
  populations: PopulationKey[];
  outcomes: OutcomeKey[];
  environments: EnvironmentKey[];
  systems: SystemKey[];
  constraints: SpecialtyConstraintProfile;
  alternatives: string[];
  evidence?: Partial<Record<DimensionId, string>>;
  reviewStatus?: SpecialtyReviewStatus;
  source?: string;
}

export interface UserProfile {
  numeric: Record<NumericDimensionId, number | null>;
  constraints: Record<ConstraintKey, number | null>;
  populations: PopulationKey[];
  outcomes: OutcomeKey[];
  environments: EnvironmentKey[];
  systems: SystemKey[];
  rejectedSystems: SystemKey[];
  answeredCount: number;
}

export type MatchBand = 'Alta' | 'Media' | 'A explorar';

export interface MatchReason {
  dimension: DimensionId;
  label: string;
  userValue: number;
  specialtyValue: number;
  gap: number;
}

export interface SpecialtyMatch {
  specialty: SpecialtyProfile;
  score: number;
  band: MatchBand;
  reasons: MatchReason[];
  frictions: MatchReason[];
  constraintNotes: string[];
  breakdown: {
    numericFit: number;
    populationFit: number;
    outcomeFit: number;
    environmentFit: number;
    systemFit: number;
  };
}

export interface ConfidenceResult {
  level: 'alta' | 'media' | 'baja';
  coverage: number;
  separation: number;
  differentiation: number;
}

export interface AxisComparison {
  dimension: NumericDimensionId;
  label: string;
  userValue: number;
  firstValue: number;
  secondValue: number;
  firstGap: number;
  secondGap: number;
  winner: 'first' | 'second' | 'tie';
}

export interface DuelResult {
  isClose: boolean;
  gap: number;
  sharedAxes: NumericDimensionId[];
  decisiveAxes: NumericDimensionId[];
  comparison: AxisComparison[];
}

export interface QuizResult {
  profile: UserProfile;
  matches: SpecialtyMatch[];
  top: SpecialtyMatch[];
  confidence: ConfidenceResult;
  duel: DuelResult | null;
  warnings: string[];
  versions: {
    schema: string;
    questionSet: string;
    catalog: string;
    scoring: string;
  };
}
