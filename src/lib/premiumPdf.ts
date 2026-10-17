import { jsPDF } from 'jspdf';
import {
  DIMENSIONS,
  ENVIRONMENT_LABELS,
  NUMERIC_DIMENSIONS,
  OUTCOME_LABELS,
  POPULATION_LABELS,
  SYSTEM_LABELS,
} from '../data/dimensions';
import { confidenceLabel, frictionText, reasonText } from './narrative';
import { QuizResult } from '../types';

interface PremiumPdfOptions {
  result: QuizResult;
  reportId: string;
  mode: 'free' | 'extensive';
  generatedAt?: Date;
}

const NAVY = [10, 25, 47] as const;
const GOLD = [180, 140, 60] as const;
const TEAL = [20, 128, 120] as const;
const INK = [38, 43, 52] as const;
const MUTED = [105, 115, 128] as const;
const PAPER = [249, 247, 241] as const;

export function generatePremiumPdf({
  result,
  reportId,
  mode,
  generatedAt = new Date(),
}: PremiumPdfOptions): Uint8Array {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let currentY = margin;

  const addPage = () => {
    doc.addPage();
    currentY = 20;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
    doc.text('ARCANUM MEDICUM · INFORME VOCACIONAL', margin, 12);
    doc.setDrawColor(220, 210, 188);
    doc.setLineWidth(0.25);
    doc.line(margin, 15, pageWidth - margin, 15);
  };

  const ensureSpace = (height: number) => {
    if (currentY + height > pageHeight - 22) addPage();
  };

  const sectionTitle = (title: string) => {
    ensureSpace(14);
    currentY += 3;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
    doc.text(title.toUpperCase(), margin, currentY);
    doc.setDrawColor(GOLD[0], GOLD[1], GOLD[2]);
    doc.setLineWidth(0.5);
    doc.line(margin, currentY + 2, margin + 34, currentY + 2);
    currentY += 7;
  };

  const paragraph = (
    text: string,
    size = 8.5,
    color: readonly [number, number, number] = INK,
  ) => {
    const lines = doc.splitTextToSize(text, contentWidth);
    ensureSpace(lines.length * 4.2 + 3);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(size);
    doc.setTextColor(color[0], color[1], color[2]);
    doc.text(lines, margin, currentY);
    currentY += lines.length * 4.2 + 3;
  };

  const bullet = (text: string) => {
    const lines = doc.splitTextToSize(text, contentWidth - 5);
    ensureSpace(lines.length * 4 + 2);
    doc.setFillColor(GOLD[0], GOLD[1], GOLD[2]);
    doc.circle(margin + 1.4, currentY - 1.2, 0.7, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.3);
    doc.setTextColor(INK[0], INK[1], INK[2]);
    doc.text(lines, margin + 4, currentY);
    currentY += lines.length * 4 + 2;
  };

  const labeledLine = (label: string, value: string) => {
    ensureSpace(5);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
    doc.text(label.toUpperCase(), margin, currentY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.3);
    doc.setTextColor(INK[0], INK[1], INK[2]);
    const lines = doc.splitTextToSize(value, contentWidth - 38);
    doc.text(lines, margin + 38, currentY);
    currentY += Math.max(4.5, lines.length * 4) + 1;
  };

  const top = result.matches[0];
  const modeLabel = mode === 'extensive' ? 'Test extensivo' : 'Test gratuito';
  const dateLabel = generatedAt.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  // Portada / cabecera
  doc.setFillColor(NAVY[0], NAVY[1], NAVY[2]);
  doc.rect(0, 0, pageWidth, 10, 'F');
  doc.setFillColor(GOLD[0], GOLD[1], GOLD[2]);
  doc.rect(0, 10, pageWidth, 1.8, 'F');

  currentY = 23;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
  doc.text('INFORME VOCACIONAL', margin, currentY);
  currentY += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
  doc.text('Arcanum Medicum', margin, currentY);
  currentY += 6;
  doc.setFontSize(8);
  doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
  doc.text(
    'Orientación vocacional médica · Documento orientativo, no diagnóstico ni validación psicométrica',
    margin,
    currentY,
  );

  currentY += 8;
  doc.setFillColor(PAPER[0], PAPER[1], PAPER[2]);
  doc.setDrawColor(220, 210, 188);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, currentY, contentWidth, 22, 1.5, 1.5, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
  doc.text('INFORME', margin + 4, currentY + 6);
  doc.text('FECHA', margin + 4, currentY + 11);
  doc.text('MODALIDAD', margin + 4, currentY + 16);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(INK[0], INK[1], INK[2]);
  doc.setFontSize(8.5);
  doc.text(reportId, margin + 30, currentY + 6);
  doc.text(dateLabel, margin + 30, currentY + 11);
  doc.text(`${modeLabel} · ${result.profile.answeredCount} respuestas`, margin + 30, currentY + 16);

  currentY += 30;

  doc.setFillColor(NAVY[0], NAVY[1], NAVY[2]);
  doc.roundedRect(margin, currentY, contentWidth, 30, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
  doc.text('PRIMERA OPCIÓN DEL PERFIL', pageWidth / 2, currentY + 7, { align: 'center' });
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text(top?.specialty.name?.toUpperCase() ?? 'SIN RESULTADO', pageWidth / 2, currentY + 16, {
    align: 'center',
  });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(205, 216, 228);
  doc.text(
    top
      ? `Puntuación ${top.score.toFixed(1)} · ${top.band} · ${confidenceLabel(result.confidence)}`
      : 'No hay datos suficientes',
    pageWidth / 2,
    currentY + 23,
    { align: 'center' },
  );

  currentY += 38;

  sectionTitle('Resumen del perfil');
  for (const dimension of NUMERIC_DIMENSIONS) {
    const value = result.profile.numeric[dimension];
    const definition = DIMENSIONS[dimension];
    labeledLine(
      definition.label,
      value === null
        ? 'Sin datos'
        : `${value.toFixed(1)} / 4 · ${definition.lowLabel} ↔ ${definition.highLabel}`,
    );
  }
  if (result.profile.populations.length > 0) {
    labeledLine(
      'Población',
      result.profile.populations.map((key) => POPULATION_LABELS[key]).join(' · '),
    );
  }
  if (result.profile.outcomes.length > 0) {
    labeledLine(
      'Resultado buscado',
      result.profile.outcomes.map((key) => OUTCOME_LABELS[key]).join(' · '),
    );
  }
  if (result.profile.environments.length > 0) {
    labeledLine(
      'Entornos',
      result.profile.environments.map((key) => ENVIRONMENT_LABELS[key]).join(' · '),
    );
  }
  if (result.profile.systems.length > 0) {
    labeledLine(
      'Sistemas',
      result.profile.systems.map((key) => SYSTEM_LABELS[key]).join(' · '),
    );
  }

  sectionTitle('Tus 10 especialidades más compatibles');
  const detailed = result.matches.slice(0, 10);
  for (const [index, match] of detailed.entries()) {
    const reasons = match.reasons.slice(0, 3);
    const frictions = match.frictions.slice(0, 2);
    const notes = match.constraintNotes.slice(0, 2);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    const descriptionLines = doc.splitTextToSize(match.specialty.description, contentWidth);
    const reasonLines = reasons.flatMap((reason) =>
      doc.splitTextToSize(`A favor · ${reasonText(reason)}`, contentWidth - 4),
    );
    const frictionLines = frictions.flatMap((friction) =>
      doc.splitTextToSize(`A revisar · ${frictionText(friction)}`, contentWidth - 4),
    );
    const noteLines = notes.flatMap((note) =>
      doc.splitTextToSize(`Condiciones · ${note}`, contentWidth - 4),
    );
    const estimatedHeight =
      10 +
      descriptionLines.length * 3.8 +
      (reasonLines.length || 1) * 3.8 +
      frictionLines.length * 3.8 +
      noteLines.length * 3.8 +
      3;
    ensureSpace(estimatedHeight);

    doc.setDrawColor(index === 0 ? GOLD[0] : 224, index === 0 ? GOLD[1] : 220, index === 0 ? GOLD[2] : 208);
    doc.setLineWidth(index === 0 ? 0.6 : 0.25);
    doc.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 5;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
    doc.text(`${String(index + 1).padStart(2, '0')} · ${match.specialty.name}`, margin, currentY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
    doc.text(
      `${match.specialty.type} · ${match.specialty.family} · ${match.score.toFixed(1)} · ${match.band}`,
      pageWidth - margin,
      currentY,
      { align: 'right' },
    );
    currentY += 4.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(INK[0], INK[1], INK[2]);
    doc.text(descriptionLines, margin, currentY);
    currentY += descriptionLines.length * 3.8 + 2;

    if (reasonLines.length > 0) {
      doc.setTextColor(TEAL[0], TEAL[1], TEAL[2]);
      doc.text(reasonLines, margin + 4, currentY);
      currentY += reasonLines.length * 3.8;
    } else {
      doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
      doc.text('Sin motivos diferenciales suficientes con la información actual.', margin + 4, currentY);
      currentY += 4;
    }

    if (frictionLines.length > 0) {
      doc.setTextColor(148, 105, 30);
      doc.text(frictionLines, margin + 4, currentY);
      currentY += frictionLines.length * 3.8;
    }

    if (noteLines.length > 0) {
      doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
      doc.text(noteLines, margin + 4, currentY);
      currentY += noteLines.length * 3.8;
    }

    currentY += 3;
  }

  if (result.duel && result.duel.comparison.length > 0) {
    sectionTitle('Comparación del primer puesto');
    paragraph(
      `Diferencia con la segunda opción: ${result.duel.gap.toFixed(1)} puntos. ${
        result.duel.isClose
          ? 'El primer puesto está disputado; conviene leer esta comparación con cautela.'
          : 'El primer puesto se separa con claridad en la simulación actual.'
      }`,
    );
    const headers = ['Eje', 'Tú', 'Primera', 'Segunda', 'Ventaja'];
    const columnX = [margin, margin + 74, margin + 92, margin + 116, margin + 145];
    ensureSpace(8);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
    headers.forEach((header, index) => doc.text(header, columnX[index], currentY));
    currentY += 4;

    for (const axis of result.duel.comparison) {
      ensureSpace(4.5);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(INK[0], INK[1], INK[2]);
      doc.text(DIMENSIONS[axis.dimension].label.slice(0, 32), columnX[0], currentY);
      doc.text(axis.userValue.toFixed(1), columnX[1], currentY);
      doc.text(axis.firstValue.toFixed(1), columnX[2], currentY);
      doc.text(axis.secondValue.toFixed(1), columnX[3], currentY);
      doc.text(
        axis.winner === 'tie' ? 'Empate' : axis.winner === 'first' ? 'Primera' : 'Segunda',
        columnX[4],
        currentY,
      );
      currentY += 4;
    }
    currentY += 3;
  }

  sectionTitle('Ranking completo de 51 especialidades');
  const ranking = result.matches;
  const rowsPerColumn = Math.ceil(ranking.length / 2);
  ensureSpace(rowsPerColumn * 5 + 6);
  const columnWidth = contentWidth / 2;
  for (const [index, match] of ranking.entries()) {
    const column = Math.floor(index / rowsPerColumn);
    const row = index % rowsPerColumn;
    const x = margin + column * columnWidth;
    const y = currentY + row * 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.2);
    doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
    doc.text(String(index + 1).padStart(2, '0'), x, y);
    doc.setTextColor(INK[0], INK[1], INK[2]);
    const name = match.specialty.name.length > 39
      ? `${match.specialty.name.slice(0, 37)}...`
      : match.specialty.name;
    doc.text(name, x + 7, y);
    doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
    doc.text(match.score.toFixed(1), x + columnWidth - 12, y, { align: 'right' });
  }
  currentY += rowsPerColumn * 5 + 5;

  sectionTitle('Cómo leer este informe');
  bullet('La puntuación compara tu perfil con los perfiles del catálogo; no es una probabilidad de éxito.');
  bullet('La banda Alta/Media/A explorar expresa cercanía al perfil, no una recomendación definitiva.');
  bullet('Los perfiles y sus valores son preliminares y están en beta; las condiciones laborales varían por hospital, país y momento.');
  bullet('Este informe no sustituye al consejo de tutores, residentes o profesionales de orientación.');
  bullet('La Casa es un arquetipo narrativo y no participa en el cálculo del ranking.');

  const versions = result.versions;
  paragraph(
    `Versiones · esquema ${versions.schema} · preguntas ${versions.questionSet} · catálogo ${versions.catalog} · scoring ${versions.scoring}`,
    7,
    MUTED,
  );

  const pages = doc.getNumberOfPages();
  for (let page = 1; page <= pages; page += 1) {
    doc.setPage(page);
    doc.setFillColor(NAVY[0], NAVY[1], NAVY[2]);
    doc.rect(0, pageHeight - 8, pageWidth, 8, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(220, 230, 240);
    doc.text(
      `Arcanum Medicum · ${reportId} · Página ${page} de ${pages}`,
      pageWidth / 2,
      pageHeight - 2.7,
      { align: 'center' },
    );
  }

  return new Uint8Array(doc.output('arraybuffer'));
}
