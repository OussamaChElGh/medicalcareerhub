import { DIMENSION_LABELS } from '../data/dimensions';
import {
  ConfidenceResult,
  DuelResult,
  MatchBand,
  MatchReason,
  SpecialtyMatch,
  UserProfile,
} from '../types';

export type House = 'Gryffindor' | 'Slytherin' | 'Ravenclaw' | 'Hufflepuff';

/**
 * Arquetipo narrativo, no criterio de recomendación.
 * Se calcula a partir del perfil para conservar la identidad del Santuario.
 */
export function deriveHouse(profile: UserProfile): { house: House; scores: Record<House, number> } {
  const value = (dimension: keyof UserProfile['numeric']) => profile.numeric[dimension] ?? 2;

  const a1 = value('A1');
  const a2 = value('A2');
  const a3 = value('A3');
  const a4 = value('A4');
  const a5 = value('A5');
  const a8 = value('A8');

  const scores: Record<House, number> = {
    Gryffindor: a3 * 1.4 + a2 * 1.1,
    Slytherin: a2 * 1.2 + (4 - a4) * 0.6 + (4 - a5) * 0.6,
    Ravenclaw: a1 * 1.4 + a8 * 1.2,
    Hufflepuff: a4 * 1.4 + a5 * 1.2,
  };

  const house = (Object.entries(scores) as [House, number][]).sort(
    (first, second) => second[1] - first[1],
  )[0][0];

  return { house, scores };
}

const BAND_COPY: Record<MatchBand, string> = {
  Alta: 'Afinidad alta',
  Media: 'Afinidad media',
  'A explorar': 'A explorar',
};

export function bandLabel(band: MatchBand): string {
  return BAND_COPY[band];
}

export function confidenceLabel(confidence: ConfidenceResult): string {
  const labels: Record<ConfidenceResult['level'], string> = {
    alta: 'Confianza alta',
    media: 'Confianza media',
    baja: 'Resultado orientativo',
  };
  return labels[confidence.level];
}

export function reasonText(reason: MatchReason): string {
  return `${reason.label}: ${reason.userValue.toFixed(1)} en tu perfil, ${reason.specialtyValue.toFixed(1)} en la especialidad.`;
}

export function frictionText(reason: MatchReason): string {
  return `${reason.label}: hay una diferencia de ${reason.gap.toFixed(1)} puntos.`;
}

export function buildFreeHeadline(match: SpecialtyMatch): string {
  if (match.reasons.length === 0) {
    return `${match.specialty.name} aparece por tu combinación de intereses, aunque con matices.`;
  }

  const labels = match.reasons.slice(0, 2).map((reason) => reason.label.toLowerCase());
  const friction =
    match.constraintNotes.length > 0
      ? ` Ten en cuenta una posible fricción: ${match.constraintNotes[0].toLowerCase()}.`
      : '';

  return `Encaja contigo por ${labels.join(' y ')}.${friction}`;
}

export function buildPremiumHeadline(match: SpecialtyMatch): string {
  const strengths = match.reasons.map((reason) => reason.label).join(', ');
  const frictions = match.frictions.map((reason) => reason.label).join(', ');

  if (strengths && frictions) {
    return `Puntos fuertes: ${strengths}. A revisar: ${frictions}.`;
  }
  if (strengths) {
    return `Puntos fuertes: ${strengths}.`;
  }
  if (frictions) {
    return `A revisar: ${frictions}.`;
  }
  return 'Perfil compatible, pero con poca información diferencial.';
}

export function buildDuelTeaser(
  duel: DuelResult,
  first: SpecialtyMatch,
  second: SpecialtyMatch,
): string {
  if (!duel.isClose) {
    return `${first.specialty.name} lidera con claridad. Los puestos 2 a 5 compiten por el resto del perfil.`;
  }

  const shared = duel.sharedAxes.length;
  const gapText =
    duel.gap <= 0.05 ? 'técnicamente empatadas' : `a ${duel.gap.toFixed(1)} puntos`;

  if (duel.decisiveAxes.length === 0) {
    return `${first.specialty.name} y ${second.specialty.name} están ${gapText}. Comparten ${shared} ejes de tu perfil y el test extensivo necesita más información para desempatar.`;
  }

  const decisive = duel.decisiveAxes
    .slice(0, 2)
    .map((dimension) => DIMENSION_LABELS[dimension].toLowerCase())
    .join(' y ');

  return `${first.specialty.name} y ${second.specialty.name} están ${gapText}. Comparten ${shared} ejes de tu perfil; el desempate está en ${decisive}.`;
}

export function buildDuelLockedCopy(duel: DuelResult): string {
  if (!duel.isClose) {
    return 'El informe completo explica por qué el primer puesto se separa del resto y qué aspectos podrían cambiarlo.';
  }
  if (duel.decisiveAxes.length === 0) {
    return 'El informe completo añade los ítems necesarios para romper el empate y explica qué información falta.';
  }
  return 'El informe completo compara los dos perfiles eje por eje y muestra cuál encaja mejor en los puntos que deciden el desempate.';
}

export function buildConstraintSummary(match: SpecialtyMatch): string {
  if (match.constraintNotes.length === 0) {
    return 'Sin alertas relevantes de condiciones laborales.';
  }
  return match.constraintNotes.join(' · ');
}
