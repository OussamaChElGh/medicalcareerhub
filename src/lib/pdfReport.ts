import { jsPDF } from 'jspdf';
import { Specialty, QuizType } from '../types';

interface ReportOptions {
  result: Specialty;
  judgment: string;
  quizType: QuizType | null;
  candidateName?: string;
}

export function generateMedicalReportPDF({
  result,
  judgment,
  quizType,
  candidateName = "Aspirante MIR / Facultativo",
}: ReportOptions): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let currentY = margin;

  // Colors
  const navy = [10, 25, 47]; // Deep clinical navy #0a192f
  const gold = [180, 140, 60]; // Gold #b48c3c
  const teal = [20, 140, 130]; // Medical teal #148c82
  const darkGray = [40, 45, 55];
  const lightGray = [242, 245, 248];
  const borderColor = [205, 215, 225];

  // ==========================================
  // 1. TOP HEADER ACCENT BAND & CLINICAL BANNER
  // ==========================================
  doc.setFillColor(navy[0], navy[1], navy[2]);
  doc.rect(0, 0, pageWidth, 6, 'F');

  doc.setFillColor(gold[0], gold[1], gold[2]);
  doc.rect(0, 6, pageWidth, 1.5, 'F');

  currentY = 16;

  // Institutional Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text("ACADEMIA ARCANUM MEDICUM", margin, currentY);

  // Sub-institution
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 110, 125);
  doc.text("INSTITUTO DE ORIENTACIÓN VOCACIONAL & EVALUACIÓN CLÍNICA AVANZADA", margin, currentY + 4.5);
  doc.text("COMISIÓN PERMANENTE DE ESPECIALIDADES MÉDICAS Y QUIRÚRGICAS", margin, currentY + 8.5);

  // Clinical Code & Confidentiality Pill (Right-aligned)
  const reportId = `REF: MED-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(teal[0], teal[1], teal[2]);
  doc.text(reportId, pageWidth - margin, currentY, { align: 'right' });

  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
  doc.setLineWidth(0.3);
  doc.roundedRect(pageWidth - margin - 48, currentY + 3, 48, 6, 1, 1, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text("DICTAMEN CONFIDENCIAL", pageWidth - margin - 24, currentY + 7.2, { align: 'center' });

  currentY += 14;

  // Divider Line
  doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
  doc.setLineWidth(0.4);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 5;

  // ==========================================
  // 2. METADATA & CANDIDATE REGISTRATION BOX
  // ==========================================
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, currentY, contentWidth, 20, 1.5, 1.5, 'FD');

  const now = new Date();
  const dateStr = now.toLocaleDateString('es-ES', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric' 
  });
  const timeStr = now.toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const modalityStr = quizType === 'EXTENSIVE' 
    ? 'Examen Extensivo de 21 Dimensiones (Certificado Premium)'
    : 'Evaluación Rápida de Orientación Clínico-Espectral';

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(110, 120, 135);
  doc.text("EXPEDIENTE:", margin + 4, currentY + 5);
  doc.text("FECHA DE EMISIÓN:", margin + 4, currentY + 10);
  doc.text("MODALIDAD:", margin + 4, currentY + 15);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.text(candidateName, margin + 28, currentY + 5);
  doc.text(`${dateStr} — ${timeStr} GMT`, margin + 35, currentY + 10);
  doc.text(modalityStr, margin + 26, currentY + 15);

  // Status Badge on right of box
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(110, 120, 135);
  doc.text("ESTADO DEL DICTAMEN:", pageWidth - margin - 55, currentY + 5);
  doc.setTextColor(20, 130, 80);
  doc.text("VALIDADO & HOMOLOGADO", pageWidth - margin - 55, currentY + 10);

  currentY += 26;

  // ==========================================
  // 3. PRIMARY DIAGNOSIS / DESIGNATED SPECIALTY
  // ==========================================
  doc.setFillColor(navy[0], navy[1], navy[2]);
  doc.roundedRect(margin, currentY, contentWidth, 24, 2, 2, 'F');

  // Decorative inner gold line
  doc.setDrawColor(gold[0], gold[1], gold[2]);
  doc.setLineWidth(0.6);
  doc.rect(margin + 2, currentY + 2, contentWidth - 4, 20, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(gold[0], gold[1], gold[2]);
  doc.text("ESPECIALIDAD MÉDICA PRINCIPAL ASIGNADA", margin + contentWidth / 2, currentY + 7, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text(result.name.toUpperCase(), margin + contentWidth / 2, currentY + 15, { align: 'center' });

  if (result.hogwartsHouse) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(200, 215, 230);
    doc.text(`Afinidad Arquetípica: Casa ${result.hogwartsHouse} | Código de Residencia: ARCANUM-${result.id.toUpperCase()}`, margin + contentWidth / 2, currentY + 20, { align: 'center' });
  }

  currentY += 30;

  // ==========================================
  // 4. SOMBRERO / OFFICIAL VERDICT (QUOTE BLOCK)
  // ==========================================
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text("I. DICTAMEN OFICIAL DEL SOMBRERO SELECCIONADOR", margin, currentY);
  currentY += 4;

  const judgmentLines = doc.splitTextToSize(`"${judgment}"`, contentWidth - 12);
  const judgmentBoxHeight = Math.max(16, judgmentLines.length * 4.6 + 8);

  doc.setFillColor(252, 249, 240); // Soft warm parchment background
  doc.setDrawColor(gold[0], gold[1], gold[2]);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, currentY, contentWidth, judgmentBoxHeight, 1, 1, 'FD');

  // Left solid accent bar
  doc.setFillColor(gold[0], gold[1], gold[2]);
  doc.rect(margin, currentY, 2.5, judgmentBoxHeight, 'F');

  doc.setFont('times', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(60, 45, 20);
  doc.text(judgmentLines, margin + 7, currentY + 6);

  currentY += judgmentBoxHeight + 7;

  // ==========================================
  // 5. CLINICAL DESCRIPTION & SCOPE
  // ==========================================
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text("II. DESCRIPCIÓN DEL DOMINIO CLÍNICO Y ÁMBITO ASISTENCIAL", margin, currentY);
  currentY += 4.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  const descLines = doc.splitTextToSize(result.description, contentWidth);
  doc.text(descLines, margin, currentY);
  currentY += descLines.length * 4.2 + 6;

  // ==========================================
  // 6. PSYCHOMETRIC & VOCATIONAL RATIONALE
  // ==========================================
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text("III. FUNDAMENTACIÓN VOCACIONAL Y ANÁLISIS DE APTITUD", margin, currentY);
  currentY += 4.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  const rationaleLines = doc.splitTextToSize(result.rationale, contentWidth);
  doc.text(rationaleLines, margin, currentY);
  currentY += rationaleLines.length * 4.2 + 6;

  // ==========================================
  // 7. COMPLEMENTARY / ALTERNATIVE SPECIALTIES
  // ==========================================
  if (result.alternatives && result.alternatives.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(navy[0], navy[1], navy[2]);
    doc.text("IV. SENDAS AFINES & ESPECIALIDADES DE SEGUNDA ELECCIÓN", margin, currentY);
    currentY += 5;

    // Draw pill badges for alternatives
    let badgeX = margin;
    const badgeHeight = 6;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);

    result.alternatives.forEach((alt) => {
      const textWidth = doc.getTextWidth(alt);
      const badgeWidth = textWidth + 8;

      if (badgeX + badgeWidth > pageWidth - margin) {
        badgeX = margin;
        currentY += badgeHeight + 2;
      }

      doc.setFillColor(235, 243, 245);
      doc.setDrawColor(teal[0], teal[1], teal[2]);
      doc.setLineWidth(0.25);
      doc.roundedRect(badgeX, currentY, badgeWidth, badgeHeight, 1, 1, 'FD');

      doc.setTextColor(teal[0], teal[1], teal[2]);
      doc.text(alt, badgeX + 4, currentY + 4.2);

      badgeX += badgeWidth + 4;
    });

    currentY += badgeHeight + 10;
  }

  // ==========================================
  // 8. CERTIFICATION, DIGITAL SIGNATURE & FOOTER
  // ==========================================
  const footerY = pageHeight - 34;

  // Divider above signatures
  doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
  doc.setLineWidth(0.3);
  doc.line(margin, footerY - 4, pageWidth - margin, footerY - 4);

  // Digital Signature Block Left
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text("CONSEJO DE ORIENTACIÓN MÉDICA", margin, footerY);
  doc.setFont('times', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(80, 90, 105);
  doc.text("Dr. A. P. Sombrero, Decano de Admisiones Arcanas", margin, footerY + 4.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(130, 140, 155);
  doc.text("Firma Digital Certificada mediante protocolo PKI-MED-2026", margin, footerY + 8);

  // Official Seal / Hash Block Right
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text("SELLO CRIPTOGRÁFICO DE AUTENTICIDAD", pageWidth - margin, footerY, { align: 'right' });
  doc.setFont('courier', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(110, 120, 135);
  const hash = `SHA256: ${Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
  doc.text(hash, pageWidth - margin, footerY + 4.5, { align: 'right' });
  doc.text("VERIFICACIÓN EN LÍNEA: arcanum-medicum.academy/verify", pageWidth - margin, footerY + 8, { align: 'right' });

  // Bottom Notice
  doc.setFillColor(navy[0], navy[1], navy[2]);
  doc.rect(0, pageHeight - 6, pageWidth, 6, 'F');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(220, 230, 240);
  doc.text("Academia Arcanum Medicum © 2026 — Documento Oficial de Evaluación Vocacional — Página 1 de 1", pageWidth / 2, pageHeight - 2, { align: 'center' });

  // Generate safe filename
  const cleanName = result.name.replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`Expediente_Clinico_Arcanum_${cleanName}.pdf`);
}
