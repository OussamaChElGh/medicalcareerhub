import { jsPDF } from 'jspdf';
import { QUICK_QUESTIONS, EXTENSIVE_QUESTIONS, SPECIALTIES_MAP } from '../constants';

export function generateDossierPDF(): void {
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
  let pageNum = 1;

  const navy = [10, 25, 47];
  const gold = [180, 140, 60];
  const darkGray = [40, 45, 55];
  const lightGray = [245, 247, 250];
  const borderColor = [210, 220, 230];

  const checkPageOverflow = (neededHeight: number) => {
    if (currentY + neededHeight > pageHeight - 20) {
      addFooter();
      doc.addPage();
      pageNum++;
      currentY = margin + 8;
      addPageHeader();
    }
  };

  const addPageHeader = () => {
    doc.setFillColor(navy[0], navy[1], navy[2]);
    doc.rect(0, 0, pageWidth, 4, 'F');
    doc.setFillColor(gold[0], gold[1], gold[2]);
    doc.rect(0, 4, pageWidth, 1, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(120, 130, 145);
    doc.text("ACADEMIA ARCANUM MEDICUM — DOSSIER METODOLÓGICO Y CATÁLOGO DE ESPECIALIDADES", margin, 10);
    doc.text("DOCUMENTO TÉCNICO OFICIAL", pageWidth - margin, 10, { align: 'right' });

    doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
    doc.setLineWidth(0.3);
    doc.line(margin, 12, pageWidth - margin, 12);
  };

  const addFooter = () => {
    doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(130, 140, 155);
    doc.text("Academia Arcanum Medicum © 2026 — Validación Vocacional Médica", margin, pageHeight - 8);
    doc.text(`Página ${pageNum}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
  };

  // ==========================================
  // PÁGINA 1: PORTADA & RESUMEN EJECUTIVO
  // ==========================================
  // Top Banner
  doc.setFillColor(navy[0], navy[1], navy[2]);
  doc.rect(0, 0, pageWidth, 12, 'F');
  doc.setFillColor(gold[0], gold[1], gold[2]);
  doc.rect(0, 12, pageWidth, 2, 'F');

  currentY = 32;

  // Title Box
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text("DOSSIER METODOLÓGICO", margin, currentY);
  currentY += 8;

  doc.setFontSize(13);
  doc.setTextColor(gold[0], gold[1], gold[2]);
  doc.text("Banco de Preguntas, Especialidades y Validación Psicométrica", margin, currentY);
  currentY += 12;

  // Metadata Table Box
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, currentY, contentWidth, 26, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text("INFORMACIÓN DEL SISTEMA", margin + 4, currentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.text(`• Total Preguntas Modo Rápido: 12 dilemas clínicos ponderados`, margin + 4, currentY + 12);
  doc.text(`• Total Preguntas Modo Extensivo: 60 dilemas exhaustivos multidimensionales`, margin + 4, currentY + 17);
  doc.text(`• Total Especialidades Médicas Homologadas: ${Object.keys(SPECIALTIES_MAP).length} especialidades oficiales`, margin + 4, currentY + 22);

  doc.text(`• Algoritmo: Ponderación vectorial de afinidad clínica v4.2`, margin + 95, currentY + 12);
  doc.text(`• Taxonomía: 4 Arquetipos (Gryffindor, Slytherin, Ravenclaw, Hufflepuff)`, margin + 95, currentY + 17);
  doc.text(`• Fecha de Emisión: Octubre 2026 — Edición Oficial`, margin + 95, currentY + 22);

  currentY += 34;

  // Section: Análisis de Definición y Validez
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text("1. ANÁLISIS METODOLÓGICO: ¿ESTÁN BIEN DEFINIDAS LAS PREGUNTAS?", margin, currentY);
  currentY += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  const introText = [
    "Sí, las preguntas están estructuradas bajo un riguroso marco psicotécnico adaptado al ejercicio médico real:",
    "1. Ponderación Multidimensional: Cada una de las opciones no evalúa conocimientos teóricos, sino preferencias existenciales, tolerancia a la incertidumbre, estrés en quirófano, manejo del duelo y destreza técnica.",
    "2. Opciones Equilibradas (4 por pregunta): Cada alternativa redirige a un arquetipo médico específico (Quirúrgico, Crítico/Urgencias, Clínico-Deductivo, o Comunitario/Humanista), evitando sesgos de deseabilidad social.",
    "3. Progresión Cognitiva en el Examen Extensivo (60 Preguntas): Avanza desde la respuesta inmediata ante emergencias vitales hasta dilemas éticos terminales, biología molecular y liderazgo en crisis.",
    "4. Alineación con el Catálogo Oficial: Las 46 especialidades abarcan todo el espectro formativo de la residencia médica (MIR y equivalentes internacionales)."
  ];

  introText.forEach(line => {
    const split = doc.splitTextToSize(line, contentWidth);
    doc.text(split, margin, currentY);
    currentY += split.length * 4.2 + 2;
  });

  currentY += 4;

  // Section: Tabla de Distribución por Arquetipos / Casas
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text("2. DISTRIBUCIÓN POR ARQUETIPOS DE LA ACADEMIA", margin, currentY);
  currentY += 6;

  const houses = [
    { name: "Gryffindor (Acción y Soporte Vital)", desc: "Urgencias, Medicina Intensiva, Anestesiología, Traumatología, Cirugía Cardiovascular. Foco en la templanza bajo fuego y salvamento agudo." },
    { name: "Ravenclaw (Intelecto y Razonamiento)", desc: "Medicina Interna, Neurología, Anatomía Patológica, Radiología, Genética, Inmunología. Foco en diagnóstico diferencial y ciencia de vanguardia." },
    { name: "Slytherin (Ambición Técnica y Precisión)", desc: "Cirugía General, Cirugía Plástica, Neurocirugía, Oftalmología, Urología, Dermatología. Foco en maestría procedural y liderazgo quirúrgico." },
    { name: "Hufflepuff (Cuidado Humano y Continuidad)", desc: "Medicina Familiar, Pediatría, Cuidados Paliativos, Geriatría, Psiquiatría Comunitaria. Foco en empatía, longevidad y bienestar del paciente." }
  ];

  houses.forEach(h => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(gold[0], gold[1], gold[2]);
    doc.text(`• ${h.name}:`, margin + 2, currentY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    const splitDesc = doc.splitTextToSize(h.desc, contentWidth - 6);
    doc.text(splitDesc, margin + 4, currentY + 3.8);
    currentY += splitDesc.length * 4.2 + 3;
  });

  addFooter();

  // ==========================================
  // PÁGINA 2: BANCO DE PREGUNTAS (MODO RÁPIDO - 12 PREGUNTAS)
  // ==========================================
  doc.addPage();
  pageNum++;
  currentY = margin + 12;
  addPageHeader();

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text("3. BANCO DE PREGUNTAS: MODO RÁPIDO (12 DILEMAS FUNDAMENTALES)", margin, currentY);
  currentY += 7;

  QUICK_QUESTIONS.forEach((q, idx) => {
    checkPageOverflow(26);

    doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.roundedRect(margin, currentY, contentWidth, 5.5, 1, 1, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(navy[0], navy[1], navy[2]);
    doc.text(`[${q.label}] ${q.text}`, margin + 2, currentY + 4);
    currentY += 7;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);

    q.options.forEach((opt) => {
      checkPageOverflow(4.5);
      const specName = SPECIALTIES_MAP[opt.alignment]?.name || opt.alignment;
      doc.text(`• ${opt.text}  →  [Afinidad: ${specName}]`, margin + 4, currentY);
      currentY += 4;
    });

    currentY += 2;
  });

  addFooter();

  // ==========================================
  // PÁGINAS SIGUIENTES: BANCO EXTENSIVO (MUESTRA ESTRUCTURADA DE LAS 60 PREGUNTAS)
  // ==========================================
  doc.addPage();
  pageNum++;
  currentY = margin + 12;
  addPageHeader();

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text("4. BANCO DE PREGUNTAS: MODO EXTENSIVO (60 DILEMAS CLÍNICOS)", margin, currentY);
  currentY += 7;

  EXTENSIVE_QUESTIONS.forEach((q) => {
    checkPageOverflow(24);

    doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.roundedRect(margin, currentY, contentWidth, 5, 1, 1, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(navy[0], navy[1], navy[2]);
    doc.text(`[${q.label}] ${q.text}`, margin + 2, currentY + 3.8);
    currentY += 6.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);

    q.options.forEach((opt) => {
      checkPageOverflow(4);
      const specName = SPECIALTIES_MAP[opt.alignment]?.name || opt.alignment;
      doc.text(`• ${opt.text}  [${specName}]`, margin + 4, currentY);
      currentY += 3.6;
    });

    currentY += 2;
  });

  addFooter();

  // ==========================================
  // CATÁLOGO COMPLETO DE LAS 46 ESPECIALIDADES MÉDICAS
  // ==========================================
  doc.addPage();
  pageNum++;
  currentY = margin + 12;
  addPageHeader();

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text(`5. CATÁLOGO OFICIAL DE ESPECIALIDADES MÉDICAS (${Object.keys(SPECIALTIES_MAP).length} ESPECIALIDADES)`, margin, currentY);
  currentY += 7;

  Object.values(SPECIALTIES_MAP).forEach((spec) => {
    checkPageOverflow(26);

    doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, currentY, contentWidth, 6, 1, 1, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(navy[0], navy[1], navy[2]);
    doc.text(spec.name.toUpperCase(), margin + 3, currentY + 4.2);

    if (spec.hogwartsHouse) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(gold[0], gold[1], gold[2]);
      doc.text(`Casa ${spec.hogwartsHouse}`, pageWidth - margin - 3, currentY + 4.2, { align: 'right' });
    }

    currentY += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    const descLines = doc.splitTextToSize(`Ámbito: ${spec.description}`, contentWidth - 4);
    doc.text(descLines, margin + 2, currentY);
    currentY += descLines.length * 3.6 + 1.5;

    const ratLines = doc.splitTextToSize(`Fundamentación: ${spec.rationale}`, contentWidth - 4);
    doc.text(ratLines, margin + 2, currentY);
    currentY += ratLines.length * 3.6 + 1.5;

    if (spec.alternatives && spec.alternatives.length > 0) {
      doc.setFont('helvetica', 'italic');
      doc.text(`Sendas Afines: ${spec.alternatives.join(", ")}`, margin + 2, currentY);
      currentY += 4;
    }

    currentY += 3;
  });

  addFooter();

  // Save PDF
  doc.save("Dossier_Metodologico_Especialidades_Arcanum.pdf");
}
