import assert from 'node:assert/strict';
import { generatePremiumPdf } from '../src/lib/premiumPdf';
import { signPremiumAccess, verifyPremiumAccessToken } from '../src/lib/premiumToken';
import { scoreQuickQuiz } from '../src/lib/scoring';
import { AnswerRecord } from '../src/types';

process.env.PREMIUM_TOKEN_SECRET =
  process.env.PREMIUM_TOKEN_SECRET || 'arcanum-test-secret-with-enough-length';

const ANSWERS: AnswerRecord[] = [
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

function main(): void {
  console.log('=== Verificación del premium ===');

  const signed = signPremiumAccess({
    reportId: 'report-test-1234',
    mode: 'free',
  });
  const verified = verifyPremiumAccessToken(signed.token);
  assert.equal(verified.valid, true, 'El token firmado debe ser válido.');
  assert.equal(verified.payload?.reportId, 'report-test-1234');
  assert.equal(verified.payload?.mode, 'free');

  const tampered = signed.token.replace(/.$/, (char) => (char === 'a' ? 'b' : 'a'));
  assert.equal(
    verifyPremiumAccessToken(tampered).valid,
    false,
    'Un token manipulado no debe validar.',
  );

  const expired = signPremiumAccess(
    { reportId: 'report-test-1234', mode: 'free' },
    -1000,
  );
  assert.equal(
    verifyPremiumAccessToken(expired.token).valid,
    false,
    'Un token caducado no debe validar.',
  );

  const result = scoreQuickQuiz(ANSWERS);
  assert.ok(result.top.length === 5, 'El perfil de prueba debe generar un top 5.');

  for (const mode of ['free', 'extensive'] as const) {
    const pdf = generatePremiumPdf({
      result,
      reportId: 'report-test-1234',
      mode,
    });
    assert.ok(pdf.length > 20_000, `El PDF ${mode} parece demasiado pequeño.`);
    assert.equal(
      Buffer.from(pdf.subarray(0, 5)).toString(),
      '%PDF-',
      `El PDF ${mode} no tiene cabecera PDF.`,
    );
    console.log(`PDF ${mode}: ${pdf.length} bytes`);
  }

  console.log('OK: token, caducidad, manipulación y PDF validados.');
}

main();
