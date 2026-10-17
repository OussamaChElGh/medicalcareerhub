# Catálogo de especialidades v1

Documento generado automáticamente desde `src/data/specialties.ts`. No editar a mano.

## Resumen

- Total: 51 fichas.
- MIR: 45.
- ACE: 4.
- Áreas: 2.
- Perfiles preliminares: 51.

## Fichas

### Medicina Familiar y Comunitaria (`FAMILY_MEDICINE`)

- **Tipo:** MIR
- **Familia:** Transversal
- **Estado:** active
- **Descripción:** Atención continuada a personas y familias, con una visión integral y longitudinal del paciente.
- **Perfil:** A1:3, A2:1, A3:2, A4:4, A5:4, A8:2
- **Población:** Todas las edades, Adultos, Personas mayores, Niños y adolescentes
- **Resultados:** Curar o resolver un episodio, Controlar una enfermedad crónica, Prevenir enfermedades, Aliviar sufrimiento y acompañar el final
- **Entornos:** Consulta / ambulatorio, Planta de hospitalización, Domicilio
- **Sistemas:** Varios sistemas
- **Restricciones:** emotionalLoad:3, guards:2, predictability:3, flexibility:4, research:2
- **Alternativas:** Medicina Interna, Pediatría, Geriatría
- **Fuente:** Perfil heredado; validación clínica pendiente.

**Evidencia:**
- **A1:** Integra problemas poco diferenciados y decide qué estudiar y derivar.
- **A4:** La continuidad es el eje del modelo de atención primaria.
- **A5:** La relación clínica longitudinal es central en la consulta.

### Medicina Interna (`INTERNAL_MEDICINE`)

- **Tipo:** MIR
- **Familia:** Médica
- **Estado:** active
- **Descripción:** Diagnóstico y tratamiento del adulto con enfermedad compleja, pluripatología y problemas no resueltos.
- **Perfil:** A1:4, A2:2, A3:3, A4:3, A5:3, A8:3
- **Población:** Adultos, Personas mayores
- **Resultados:** Dar un diagnóstico preciso, Controlar una enfermedad crónica, Curar o resolver un episodio
- **Entornos:** Planta de hospitalización, Urgencias / UCI, Consulta / ambulatorio
- **Sistemas:** Varios sistemas
- **Restricciones:** emotionalLoad:3, guards:3, predictability:2, flexibility:3, research:3
- **Alternativas:** Medicina Intensiva, Infectología, Nefrología
- **Fuente:** Perfil heredado; validación clínica pendiente.

**Evidencia:**
- **A1:** El razonamiento diagnóstico diferencial es la competencia nuclear.
- **A8:** Requiere integrar fisiopatología de varios sistemas.
- **A4:** Combina episodios agudos con seguimiento de enfermedades crónicas.
- **A3:** Combina urgencias, planta y consulta con guardias; el ritmo es variable y exige priorizar.
- **A5:** La relación con el paciente y la familia es intensa en pluripatología y decisiones complejas.

### Medicina de Urgencias y Emergencias (`EMERGENCY`)

- **Tipo:** MIR
- **Familia:** Urgente
- **Estado:** active
- **Descripción:** Valoración, estabilización y resolución inicial de pacientes con problemas agudos e imprevisibles.
- **Perfil:** A1:2, A2:2, A3:4, A4:1, A5:2, A8:2
- **Población:** Adultos, Niños y adolescentes, Personas mayores
- **Resultados:** Estabilizar una situación crítica, Dar un diagnóstico preciso
- **Entornos:** Urgencias / UCI
- **Sistemas:** Varios sistemas
- **Restricciones:** emotionalLoad:4, guards:4, predictability:1, flexibility:3, research:2
- **Alternativas:** Medicina Intensiva, Anestesiología, Medicina Interna
- **Fuente:** Perfil heredado; validación clínica pendiente.

**Evidencia:**
- **A3:** La imprevisibilidad y la toma de decisiones rápida definen el servicio.
- **C1:** Alta exposición a situaciones críticas, incertidumbre y muerte.

### Medicina Intensiva (`INTENSIVE_CARE`)

- **Tipo:** MIR
- **Familia:** Urgente
- **Estado:** active
- **Descripción:** Soporte vital avanzado y manejo continuo del paciente crítico con disfunción multiorgánica.
- **Perfil:** A1:3, A2:3, A3:4, A4:2, A5:2, A8:3
- **Población:** Adultos, Todas las edades
- **Resultados:** Estabilizar una situación crítica, Curar o resolver un episodio, Dar un diagnóstico preciso
- **Entornos:** Urgencias / UCI, Planta de hospitalización
- **Sistemas:** Varios sistemas
- **Restricciones:** emotionalLoad:4, guards:4, predictability:1, flexibility:2, research:3
- **Alternativas:** Anestesiología, Medicina de Urgencias, Cardiología
- **Fuente:** Perfil heredado; validación clínica pendiente.

**Evidencia:**
- **A2:** Procedimientos invasivos y monitorización avanzada forman parte del trabajo diario.
- **A3:** La actividad es urgente y continua, con guardias frecuentes.
- **C1:** Alta carga emocional y decisiones con información incompleta.
- **A1:** El diagnóstico fisiopatológico y la integración de datos prevalecen en la toma de decisiones.
- **A8:** Requiere fisiología, monitorización y evidencia de soporte vital avanzado.

### Anestesiología y Reanimación (`ANESTHESIOLOGY`)

- **Tipo:** MIR
- **Familia:** Quirúrgica
- **Estado:** active
- **Descripción:** Control del soporte vital, la analgesia y la homeostasis durante cirugía y procedimientos.
- **Perfil:** A1:2, A2:4, A3:3, A4:1, A5:1, A8:2
- **Población:** Todas las edades, Adultos, Niños y adolescentes
- **Resultados:** Estabilizar una situación crítica, Restaurar función y calidad de vida
- **Entornos:** Quirófano / salas de procedimientos, Urgencias / UCI
- **Sistemas:** Varios sistemas
- **Restricciones:** emotionalLoad:3, guards:3, predictability:2, flexibility:3, research:2
- **Alternativas:** Medicina Intensiva, Cirugía General, Medicina de Urgencias
- **Fuente:** Perfil heredado; validación clínica pendiente.

**Evidencia:**
- **A2:** La técnica y el control fisiológico intraoperatorio son el núcleo de la especialidad.
- **A5:** El contacto es intenso durante el procedimiento, pero muy focalizado.
- **A3:** La actividad combina cirugía programada y urgencias, con guardias y presión temporal.

### Cirugía General y del Aparato Digestivo (`SURGERY`)

- **Tipo:** MIR
- **Familia:** Quirúrgica
- **Estado:** active
- **Descripción:** Tratamiento quirúrgico de patología abdominal, urgente y programada, con seguimiento perioperatorio.
- **Perfil:** A1:1, A2:4, A3:3, A4:2, A5:2, A8:0
- **Población:** Adultos
- **Resultados:** Curar o resolver un episodio, Restaurar función y calidad de vida
- **Entornos:** Quirófano / salas de procedimientos, Planta de hospitalización, Consulta / ambulatorio
- **Sistemas:** Digestivo
- **Restricciones:** emotionalLoad:3, guards:4, predictability:2, flexibility:2, research:2
- **Alternativas:** Traumatología, Urología, Cirugía Torácica
- **Fuente:** Perfil heredado; validación clínica pendiente.

**Evidencia:**
- **A1:** El razonamiento se orienta a la resolución anatómica y técnica.
- **A2:** El acto quirúrgico define la especialidad.
- **A8:** La anatomía quirúrgica es el contenido científico principal.
- **A3:** Alterna cirugía programada y urgente; las guardias y la disponibilidad condicionan el ritmo.

### Cirugía Ortopédica y Traumatología (`TRAUMATOLOGY`)

- **Tipo:** MIR
- **Familia:** Quirúrgica
- **Estado:** active
- **Descripción:** Tratamiento quirúrgico y funcional de lesiones y enfermedades del aparato locomotor.
- **Perfil:** A1:2, A2:4, A3:3, A4:2, A5:2, A8:2
- **Población:** Adultos, Personas mayores, Todas las edades
- **Resultados:** Restaurar función y calidad de vida, Curar o resolver un episodio
- **Entornos:** Quirófano / salas de procedimientos, Consulta / ambulatorio, Planta de hospitalización
- **Sistemas:** Musculoesquelético
- **Restricciones:** emotionalLoad:2, guards:3, predictability:3, flexibility:3, research:2
- **Alternativas:** Cirugía General, Rehabilitación, Medicina del Deporte
- **Fuente:** Perfil heredado; validación clínica pendiente.

**Evidencia:**
- **A2:** La cirugía y los procedimientos ortopédicos son centrales.
- **A7:** El objetivo principal es recuperar función y movilidad.
- **A8:** La biomecánica y la anatomía del aparato locomotor son el eje.
- **A3:** La urgencia traumatológica y las guardias son parte central del servicio.

### Radiodiagnóstico (`RADIOLOGY`)

- **Tipo:** MIR
- **Familia:** Diagnóstica
- **Estado:** active
- **Descripción:** Interpretación de imagen médica y realización de procedimientos diagnósticos y terapéuticos guiados.
- **Perfil:** A1:4, A2:2, A3:2, A4:1, A5:1, A8:3
- **Población:** Todas las edades
- **Resultados:** Dar un diagnóstico preciso
- **Entornos:** Imagen
- **Sistemas:** Varios sistemas
- **Restricciones:** emotionalLoad:1, guards:2, predictability:4, flexibility:3, research:3
- **Alternativas:** Anatomía Patológica, Medicina Nuclear, Medicina Interna
- **Fuente:** Perfil heredado; validación clínica pendiente.

**Evidencia:**
- **A1:** El diagnóstico por imagen exige integración visual y razonamiento espacial.
- **A5:** El contacto clínico directo es limitado; el trabajo se centra en la prueba.
- **C2:** Actividad mayoritariamente programada, con guardias más contenidas.
- **A8:** Integra anatomía, física de la imagen y tecnología para interpretar estudios.

### Anatomía Patológica (`PATHOLOGY`)

- **Tipo:** MIR
- **Familia:** Diagnóstica
- **Estado:** active
- **Descripción:** Diagnóstico definitivo mediante estudio microscópico y molecular de tejidos y muestras.
- **Perfil:** A1:4, A2:1, A3:1, A4:1, A5:0, A8:4
- **Población:** Todas las edades
- **Resultados:** Dar un diagnóstico preciso, Generar conocimiento
- **Entornos:** Laboratorio
- **Sistemas:** Varios sistemas
- **Restricciones:** emotionalLoad:1, guards:1, predictability:4, flexibility:4, research:4
- **Alternativas:** Radiodiagnóstico, Hematología, Genética Clínica
- **Fuente:** Perfil heredado; validación clínica pendiente.

**Evidencia:**
- **A1:** El razonamiento morfológico y molecular es el centro de la especialidad.
- **A5:** Trabajo de laboratorio con contacto clínico muy limitado.
- **A8:** Biología celular y molecular aplicadas al diagnóstico.

### Psiquiatría (`PSYCHIATRY`)

- **Tipo:** MIR
- **Familia:** Salud mental
- **Estado:** active
- **Descripción:** Evaluación y tratamiento de trastornos mentales, con relación terapéutica longitudinal.
- **Perfil:** A1:3, A2:0, A3:2, A4:4, A5:4, A8:2
- **Población:** Adultos, Niños y adolescentes, Personas mayores
- **Resultados:** Controlar una enfermedad crónica, Restaurar función y calidad de vida, Curar o resolver un episodio
- **Entornos:** Consulta / ambulatorio, Planta de hospitalización
- **Sistemas:** Salud mental
- **Restricciones:** emotionalLoad:4, guards:2, predictability:3, flexibility:4, research:3
- **Alternativas:** Neurología, Psicología Clínica, Medicina Familiar
- **Fuente:** Perfil heredado; validación clínica pendiente.

**Evidencia:**
- **A4:** La continuidad y la alianza terapéutica son centrales.
- **A5:** La entrevista y la relación clínica son la principal herramienta.
- **C1:** Alta exposición a sufrimiento psíquico y situaciones emocionalmente complejas.
- **A1:** El razonamiento clínico se centra en la formulación biopsicosocial y el diagnóstico longitudinal.

### Pediatría (`PEDIATRICS`)

- **Tipo:** MIR
- **Familia:** Pediátrica
- **Estado:** active
- **Descripción:** Atención integral de la salud infantil y adolescente, desde la prevención hasta la enfermedad aguda y crónica.
- **Perfil:** A1:3, A2:2, A3:3, A4:4, A5:4, A8:3
- **Población:** Niños y adolescentes, Recién nacidos
- **Resultados:** Curar o resolver un episodio, Prevenir enfermedades, Controlar una enfermedad crónica, Restaurar función y calidad de vida
- **Entornos:** Consulta / ambulatorio, Planta de hospitalización, Urgencias / UCI
- **Sistemas:** Varios sistemas
- **Restricciones:** emotionalLoad:3, guards:3, predictability:2, flexibility:3, research:3
- **Alternativas:** Neonatología, Medicina Familiar, Endocrinología Pediátrica
- **Fuente:** Perfil heredado; validación clínica pendiente.

**Evidencia:**
- **A4:** El seguimiento del desarrollo y la continuidad son propios de la especialidad.
- **A6:** La población pediátrica define el ámbito de trabajo.
- **A8:** Fisiología y desarrollo infantiles requieren un enfoque específico.
- **A1:** El diagnóstico pediátrico exige integrar desarrollo, contexto familiar y presentación atípica.
- **A3:** Combina consulta programada, urgencias pediátricas y guardias.
- **A5:** La relación con el niño y su familia es intensa y continua.

### Cuidados Paliativos (`PALLIATIVE`)

- **Tipo:** AREA
- **Familia:** Paliativa
- **Estado:** active
- **Descripción:** Control de síntomas y acompañamiento integral en enfermedades avanzadas y al final de la vida.
- **Perfil:** A1:3, A2:1, A3:1, A4:4, A5:4, A8:2
- **Población:** Adultos, Personas mayores, Todas las edades
- **Resultados:** Aliviar sufrimiento y acompañar el final, Controlar una enfermedad crónica, Restaurar función y calidad de vida
- **Entornos:** Planta de hospitalización, Consulta / ambulatorio, Domicilio
- **Sistemas:** Varios sistemas
- **Restricciones:** emotionalLoad:4, guards:2, predictability:3, flexibility:4, research:2
- **Alternativas:** Medicina Familiar, Geriatría, Oncología Médica
- **Fuente:** Perfil heredado; validación clínica pendiente.

**Evidencia:**
- **A4:** El acompañamiento longitudinal y la planificación anticipada son centrales.
- **A5:** La relación con el paciente y la familia es el eje del cuidado.
- **C1:** Alta exposición al sufrimiento y a conversaciones sobre el final de la vida.
- **A1:** El razonamiento se orienta a control de síntomas, pronóstico y decisiones compartidas.

### Cardiología (`CARDIOLOGY`)

- **Tipo:** MIR
- **Familia:** Médica
- **Estado:** active
- **Descripción:** Diagnóstico y tratamiento de las enfermedades del corazón y del sistema circulatorio, combinando manejo clínico, pruebas funcionales e intervencionismo.
- **Perfil:** A1:4, A2:3, A3:3, A4:3, A5:3, A8:3
- **Población:** Adultos, Personas mayores
- **Resultados:** Curar o resolver un episodio, Controlar una enfermedad crónica, Dar un diagnóstico preciso, Estabilizar una situación crítica, Prevenir enfermedades, Restaurar función y calidad de vida
- **Entornos:** Consulta / ambulatorio, Planta de hospitalización, Urgencias / UCI, Imagen
- **Sistemas:** Cardiovascular
- **Restricciones:** emotionalLoad:3, guards:3, predictability:2, flexibility:3, research:4
- **Alternativas:** Medicina Interna, Medicina Intensiva, Cirugía Cardiovascular
- **Fuente:** Perfil preliminar basado en práctica clínica general; validación clínica pendiente.

**Evidencia:**
- **A1:** El razonamiento hemodinámico y clínico es central.
- **A2:** Incluye procedimientos diagnósticos y terapéuticos.
- **A3:** Maneja síndromes agudos y crónicos.
- **A4:** Seguimiento longitudinal de insuficiencia cardiaca, arritmias y prevención secundaria.
- **A5:** Relación clínica intensa en consulta, planta y decisiones de revascularización.
- **A8:** Integra fisiología cardiovascular, imagen, hemodinámica y ensayos clínicos.

### Aparato Digestivo (`GASTROENTEROLOGY`)

- **Tipo:** MIR
- **Familia:** Médica
- **Estado:** active
- **Descripción:** Estudio y tratamiento de las enfermedades del tracto digestivo, hígado y vías biliares, con clínica y técnicas endoscópicas.
- **Perfil:** A1:3, A2:3, A3:2, A4:3, A5:3, A8:3
- **Población:** Adultos, Personas mayores
- **Resultados:** Dar un diagnóstico preciso, Curar o resolver un episodio, Controlar una enfermedad crónica
- **Entornos:** Consulta / ambulatorio, Planta de hospitalización
- **Sistemas:** Digestivo
- **Restricciones:** emotionalLoad:2, guards:3, predictability:3, flexibility:3, research:3
- **Alternativas:** Cirugía General, Medicina Interna, Oncología Médica
- **Fuente:** Perfil preliminar basado en práctica clínica general; validación clínica pendiente.

**Evidencia:**
- **A2:** La endoscopia y los procedimientos digestivos son parte importante.
- **A4:** Combina seguimiento de enfermedades crónicas con episodios agudos.
- **A1:** Diagnóstico diferencial amplio con endoscopia, imagen y datos analíticos.
- **A5:** Contacto directo en consulta, endoscopia y seguimiento de enfermedad digestiva.
- **A8:** Combina fisiología digestiva, hepatología, endoscopia y evidencia.

### Neumología (`PULMONOLOGY`)

- **Tipo:** MIR
- **Familia:** Médica
- **Estado:** active
- **Descripción:** Diagnóstico y tratamiento de las enfermedades respiratorias, desde la obstrucción crónica hasta la insuficiencia respiratoria aguda.
- **Perfil:** A1:3, A2:2, A3:3, A4:3, A5:3, A8:3
- **Población:** Adultos, Personas mayores
- **Resultados:** Dar un diagnóstico preciso, Controlar una enfermedad crónica, Curar o resolver un episodio, Estabilizar una situación crítica
- **Entornos:** Consulta / ambulatorio, Planta de hospitalización, Urgencias / UCI
- **Sistemas:** Respiratorio
- **Restricciones:** emotionalLoad:3, guards:3, predictability:2, flexibility:3, research:3
- **Alternativas:** Medicina Intensiva, Medicina Interna, Cirugía Torácica
- **Fuente:** Perfil preliminar basado en práctica clínica general; validación clínica pendiente.

**Evidencia:**
- **A3:** Atiende exacerbaciones y fallo respiratorio agudo.
- **A8:** La fisiología respiratoria es un contenido central.
- **A1:** Integra síntomas, función pulmonar, imagen y diagnóstico diferencial.
- **A4:** Seguimiento de asma, EPOC, fibrosis quística y enfermedad intersticial.
- **A5:** Relación clínica en consulta, hospitalización y técnicas broncoscópicas.

### Nefrología (`NEPHROLOGY`)

- **Tipo:** MIR
- **Familia:** Médica
- **Estado:** active
- **Descripción:** Manejo de la enfermedad renal, el equilibrio hidroelectrolítico y las terapias de sustitución renal.
- **Perfil:** A1:4, A2:3, A3:2, A4:4, A5:3, A8:3
- **Población:** Adultos, Personas mayores
- **Resultados:** Controlar una enfermedad crónica, Curar o resolver un episodio, Dar un diagnóstico preciso, Estabilizar una situación crítica
- **Entornos:** Consulta / ambulatorio, Planta de hospitalización, Laboratorio, Urgencias / UCI
- **Sistemas:** Renal / urinario
- **Restricciones:** emotionalLoad:3, guards:2, predictability:3, flexibility:3, research:4
- **Alternativas:** Medicina Interna, Urología, Medicina Intensiva
- **Fuente:** Perfil preliminar basado en práctica clínica general; validación clínica pendiente.

**Evidencia:**
- **A1:** El razonamiento fisiopatológico y el ajuste fino son centrales.
- **A4:** Seguimiento prolongado de enfermedad renal crónica.
- **A2:** Accesos vasculares, biopsia renal y técnicas de diálisis forman parte del trabajo.
- **A5:** Relación longitudinal intensa en enfermedad renal crónica y diálisis.
- **A8:** Requiere fisiología renal, inmunología, farmacología y manejo de líquidos.

### Endocrinología y Nutrición (`ENDOCRINOLOGY`)

- **Tipo:** MIR
- **Familia:** Médica
- **Estado:** active
- **Descripción:** Estudio del sistema hormonal, el metabolismo y la nutrición, con seguimiento longitudinal de enfermedades crónicas.
- **Perfil:** A1:3, A2:1, A3:1, A4:4, A5:3, A8:4
- **Población:** Adultos, Personas mayores
- **Resultados:** Controlar una enfermedad crónica, Curar o resolver un episodio, Prevenir enfermedades
- **Entornos:** Consulta / ambulatorio, Planta de hospitalización
- **Sistemas:** Endocrino / metabólico
- **Restricciones:** emotionalLoad:2, guards:1, predictability:4, flexibility:4, research:4
- **Alternativas:** Medicina Interna, Pediatría, Medicina Familiar
- **Fuente:** Perfil preliminar basado en práctica clínica general; validación clínica pendiente.

**Evidencia:**
- **A4:** El seguimiento longitudinal es habitual.
- **A8:** Fisiología hormonal y metabolismo molecular.
- **A1:** Razonamiento fisiopatológico y diagnóstico diferencial hormonal.
- **A5:** Consulta longitudinal y educación terapéutica en enfermedades crónicas.

### Neurología (`NEUROLOGY`)

- **Tipo:** MIR
- **Familia:** Médica
- **Estado:** active
- **Descripción:** Diagnóstico y tratamiento de las enfermedades del sistema nervioso central y periférico, con frecuente seguimiento longitudinal.
- **Perfil:** A1:4, A2:1, A3:2, A4:4, A5:3, A8:3
- **Población:** Adultos, Personas mayores
- **Resultados:** Dar un diagnóstico preciso, Controlar una enfermedad crónica, Curar o resolver un episodio, Estabilizar una situación crítica
- **Entornos:** Consulta / ambulatorio, Planta de hospitalización, Urgencias / UCI
- **Sistemas:** Nervioso
- **Restricciones:** emotionalLoad:3, guards:2, predictability:3, flexibility:3, research:4
- **Alternativas:** Neurocirugía, Psiquiatría, Neurofisiología Clínica
- **Fuente:** Perfil preliminar basado en práctica clínica general; validación clínica pendiente.

**Evidencia:**
- **A1:** El razonamiento diagnóstico es el núcleo de la especialidad.
- **A4:** Muchas enfermedades neurológicas requieren seguimiento prolongado.
- **A5:** La exploración y la relación clínica son centrales en enfermedades neurológicas crónicas.
- **A8:** Integra neuroanatomía, fisiología, imagen y neurofisiología.

### Hematología y Hemoterapia (`HEMATOLOGY`)

- **Tipo:** MIR
- **Familia:** Médica
- **Estado:** active
- **Descripción:** Diagnóstico y tratamiento de las enfermedades de la sangre, la médula ósea y el sistema hematopoyético.
- **Perfil:** A1:4, A2:3, A3:2, A4:4, A5:3, A8:4
- **Población:** Adultos, Personas mayores
- **Resultados:** Curar o resolver un episodio, Controlar una enfermedad crónica, Dar un diagnóstico preciso, Aliviar sufrimiento y acompañar el final
- **Entornos:** Consulta / ambulatorio, Planta de hospitalización, Laboratorio, Urgencias / UCI
- **Sistemas:** Hematológico, Inmunitario
- **Restricciones:** emotionalLoad:4, guards:2, predictability:3, flexibility:3, research:4
- **Alternativas:** Oncología Médica, Anatomía Patológica, Medicina Interna
- **Fuente:** Perfil preliminar basado en práctica clínica general; validación clínica pendiente.

**Evidencia:**
- **A8:** Biología celular y molecular aplicada al diagnóstico.
- **C1:** Alta exposición a enfermedad grave y pronóstico incierto.
- **A1:** Diagnóstico integrado de citopenias, neoplasias hematológicas y coagulopatías.
- **A2:** Médula ósea, biopsias, aféresis y procedimientos diagnósticos y terapéuticos.
- **A4:** Seguimiento prolongado de neoplasias, hemoglobinopatías y trasplante.
- **A5:** Relación intensa en enfermedad hematológica maligna y crónica.

### Oncología Médica (`ONCOLOGY`)

- **Tipo:** MIR
- **Familia:** Médica
- **Estado:** active
- **Descripción:** Tratamiento sistémico del cáncer, coordinando terapias complejas y el acompañamiento del paciente a lo largo de la enfermedad.
- **Perfil:** A1:3, A2:1, A3:2, A4:4, A5:4, A8:3
- **Población:** Adultos, Personas mayores
- **Resultados:** Curar o resolver un episodio, Controlar una enfermedad crónica, Aliviar sufrimiento y acompañar el final, Dar un diagnóstico preciso
- **Entornos:** Consulta / ambulatorio, Planta de hospitalización, Laboratorio, Urgencias / UCI
- **Sistemas:** Varios sistemas
- **Restricciones:** emotionalLoad:4, guards:2, predictability:3, flexibility:4, research:4
- **Alternativas:** Hematología, Cuidados Paliativos, Medicina Interna
- **Fuente:** Perfil preliminar basado en práctica clínica general; validación clínica pendiente.

**Evidencia:**
- **A4:** Seguimiento longitudinal durante tratamientos prolongados.
- **C1:** Alta carga emocional y conversaciones sobre pronóstico.
- **A1:** Razonamiento diagnóstico y toma de decisiones oncológicas complejas.
- **A5:** Relación longitudinal intensa con paciente y familia durante tratamiento y final de vida.
- **A8:** Integra biología tumoral, ensayos clínicos y evidencia terapéutica.

### Enfermedades Infecciosas (`INFECTOLOGY`)

- **Tipo:** MIR
- **Familia:** Médica
- **Estado:** active
- **Descripción:** Diagnóstico y tratamiento de infecciones complejas, con especial peso en el paciente hospitalizado y en la salud pública.
- **Perfil:** A1:4, A2:1, A3:3, A4:3, A5:3, A8:3
- **Población:** Adultos, Todas las edades
- **Resultados:** Curar o resolver un episodio, Dar un diagnóstico preciso, Prevenir enfermedades
- **Entornos:** Consulta / ambulatorio, Planta de hospitalización, Urgencias / UCI
- **Sistemas:** Varios sistemas
- **Restricciones:** emotionalLoad:3, guards:3, predictability:2, flexibility:3, research:4
- **Alternativas:** Microbiología Clínica, Medicina Interna, Medicina Preventiva
- **Fuente:** Perfil preliminar basado en práctica clínica general; validación clínica pendiente.

**Evidencia:**
- **A1:** Razonamiento etiológico y diagnóstico diferencial.
- **A3:** Consulta hospitalaria de infecciones agudas y graves.
- **A4:** Seguimiento de infecciones crónicas, VIH, tuberculosis y tratamientos prolongados.
- **A5:** Relación clínica longitudinal, adherencia y manejo de enfermedades transmisibles.
- **A8:** Requiere microbiología, inmunología, farmacología y epidemiología.

### Reumatología (`RHEUMATOLOGY`)

- **Tipo:** MIR
- **Familia:** Médica
- **Estado:** active
- **Descripción:** Diagnóstico y tratamiento de enfermedades autoinmunes y del aparato locomotor de carácter no quirúrgico.
- **Perfil:** A1:4, A2:1, A3:1, A4:4, A5:3, A8:3
- **Población:** Adultos, Personas mayores
- **Resultados:** Controlar una enfermedad crónica, Restaurar función y calidad de vida, Curar o resolver un episodio
- **Entornos:** Consulta / ambulatorio, Planta de hospitalización
- **Sistemas:** Musculoesquelético, Inmunitario
- **Restricciones:** emotionalLoad:2, guards:1, predictability:4, flexibility:4, research:3
- **Alternativas:** Rehabilitación, Medicina Interna, Inmunología
- **Fuente:** Perfil preliminar basado en práctica clínica general; validación clínica pendiente.

**Evidencia:**
- **A4:** Enfermedades crónicas con seguimiento prolongado.
- **A8:** Mecanismos inmunológicos e inflamatorios.
- **A1:** Diagnóstico diferencial de enfermedades autoinmunes y sistémicas.
- **A5:** Consulta longitudinal y relación intensa en enfermedades crónicas.

### Dermatología Médico-Quirúrgica (`DERMATOLOGY`)

- **Tipo:** MIR
- **Familia:** Médico-quirúrgica
- **Estado:** active
- **Descripción:** Diagnóstico y tratamiento de las enfermedades de la piel, con cirugía menor y procedimientos dermatológicos.
- **Perfil:** A1:3, A2:3, A3:1, A4:3, A5:3, A8:2
- **Población:** Adultos, Niños y adolescentes
- **Resultados:** Curar o resolver un episodio, Dar un diagnóstico preciso, Restaurar función y calidad de vida
- **Entornos:** Consulta / ambulatorio
- **Sistemas:** Piel
- **Restricciones:** emotionalLoad:1, guards:1, predictability:4, flexibility:4, research:2
- **Alternativas:** Cirugía Plástica, Anatomía Patológica, Alergología
- **Fuente:** Perfil preliminar basado en práctica clínica general; validación clínica pendiente.

**Evidencia:**
- **A2:** Incluye cirugía menor y procedimientos.
- **A5:** El contacto clínico directo es habitual.
- **A1:** Diagnóstico visual y correlación clinicopatológica.
- **A4:** Seguimiento de dermatosis crónicas, psoriasis y neoplasias cutáneas.

### Urología (`UROLOGY`)

- **Tipo:** MIR
- **Familia:** Quirúrgica
- **Estado:** active
- **Descripción:** Tratamiento médico y quirúrgico del aparato urinario y del aparato reproductor masculino.
- **Perfil:** A1:2, A2:4, A3:3, A4:3, A5:2, A8:1
- **Población:** Adultos, Personas mayores
- **Resultados:** Curar o resolver un episodio, Restaurar función y calidad de vida, Controlar una enfermedad crónica
- **Entornos:** Quirófano / salas de procedimientos, Consulta / ambulatorio, Planta de hospitalización
- **Sistemas:** Renal / urinario, Reproductivo
- **Restricciones:** emotionalLoad:2, guards:3, predictability:3, flexibility:3, research:2
- **Alternativas:** Nefrología, Cirugía General, Oncología Médica
- **Fuente:** Perfil preliminar basado en práctica clínica general; validación clínica pendiente.

**Evidencia:**
- **A2:** La cirugía y los procedimientos urológicos son centrales.
- **A3:** Combina cirugía programada y urgencias.
- **A4:** Seguimiento de patología prostática, urolitiasis y neoplasias urológicas.

### Oftalmología (`OPHTHALMOLOGY`)

- **Tipo:** MIR
- **Familia:** Quirúrgica
- **Estado:** active
- **Descripción:** Diagnóstico y tratamiento de las enfermedades oculares, con microcirugía de alta precisión y seguimiento de patología crónica.
- **Perfil:** A1:3, A2:4, A3:2, A4:3, A5:2, A8:1
- **Población:** Adultos, Personas mayores, Niños y adolescentes
- **Resultados:** Curar o resolver un episodio, Restaurar función y calidad de vida, Controlar una enfermedad crónica
- **Entornos:** Quirófano / salas de procedimientos, Consulta / ambulatorio
- **Sistemas:** Órganos de los sentidos
- **Restricciones:** emotionalLoad:1, guards:2, predictability:4, flexibility:4, research:2
- **Alternativas:** Neurología, Cirugía Plástica, Otorrinolaringología
- **Fuente:** Perfil preliminar basado en práctica clínica general; validación clínica pendiente.

**Evidencia:**
- **A2:** La microcirugía y los procedimientos son centrales.
- **A4:** Seguimiento de patología ocular crónica.
- **A1:** Diagnóstico visual, exploración oftalmológica e interpretación de imagen.

### Otorrinolaringología (`ENT`)

- **Tipo:** MIR
- **Familia:** Quirúrgica
- **Estado:** active
- **Descripción:** Tratamiento médico y quirúrgico de las enfermedades del oído, nariz, faringe y laringe.
- **Perfil:** A1:3, A2:3, A3:2, A4:3, A5:3, A8:1
- **Población:** Adultos, Niños y adolescentes
- **Resultados:** Curar o resolver un episodio, Restaurar función y calidad de vida, Dar un diagnóstico preciso
- **Entornos:** Quirófano / salas de procedimientos, Consulta / ambulatorio, Planta de hospitalización
- **Sistemas:** Órganos de los sentidos, Respiratorio
- **Restricciones:** emotionalLoad:2, guards:2, predictability:3, flexibility:3, research:2
- **Alternativas:** Pediatría, Cirugía Plástica, Neurocirugía
- **Fuente:** Perfil preliminar basado en práctica clínica general; validación clínica pendiente.

**Evidencia:**
- **A2:** Incluye cirugía ORL y procedimientos diagnósticos.
- **A5:** Contacto clínico directo con pacientes de todas las edades.
- **A1:** Diagnóstico otorrinolaringológico con exploración y pruebas funcionales.
- **A4:** Seguimiento de patología crónica auditiva, rinosinusal y oncológica.

### Obstetricia y Ginecología (`GYNAECOLOGY`)

- **Tipo:** MIR
- **Familia:** Quirúrgica
- **Estado:** active
- **Descripción:** Atención integral a la salud de la mujer, el embarazo, el parto y las enfermedades ginecológicas.
- **Perfil:** A1:3, A2:3, A3:3, A4:4, A5:4, A8:2
- **Población:** Embarazo y salud de la mujer, Adultos
- **Resultados:** Curar o resolver un episodio, Restaurar función y calidad de vida, Prevenir enfermedades, Controlar una enfermedad crónica
- **Entornos:** Consulta / ambulatorio, Quirófano / salas de procedimientos, Planta de hospitalización
- **Sistemas:** Reproductivo
- **Restricciones:** emotionalLoad:3, guards:3, predictability:2, flexibility:3, research:2
- **Alternativas:** Pediatría, Cirugía General, Urología
- **Fuente:** Perfil preliminar basado en práctica clínica general; validación clínica pendiente.

**Evidencia:**
- **A4:** Seguimiento del embarazo y de la salud de la mujer a lo largo del tiempo.
- **A5:** Relación clínica intensa y continuada.
- **A1:** Razonamiento obstétrico-ginecológico con ecografía, clínica y decisiones urgentes.
- **A2:** Cirugía ginecológica, obstétrica y procedimientos diagnósticos.
- **A3:** Combina guardias obstétricas, urgencias y cirugía programada.

### Alergología (`ALLERGOLOGY`)

- **Tipo:** MIR
- **Familia:** Médica
- **Estado:** active
- **Descripción:** Diagnóstico y tratamiento de las enfermedades alérgicas e inmunológicas, con pruebas funcionales y seguimiento longitudinal.
- **Perfil:** A1:3, A2:1, A3:1, A4:4, A5:4, A8:3
- **Población:** Todas las edades, Adultos, Niños y adolescentes
- **Resultados:** Dar un diagnóstico preciso, Controlar una enfermedad crónica, Curar o resolver un episodio, Prevenir enfermedades
- **Entornos:** Consulta / ambulatorio, Laboratorio
- **Sistemas:** Inmunitario, Respiratorio, Piel
- **Restricciones:** emotionalLoad:2, guards:1, predictability:4, flexibility:4, research:3
- **Alternativas:** Inmunología, Dermatología, Medicina Interna
- **Fuente:** Perfil preliminar basado en práctica clínica general; validación clínica pendiente.

**Evidencia:**
- **A4:** Seguimiento de enfermedades alérgicas crónicas.
- **A5:** Educación y relación clínica continuada.
- **A1:** Diagnóstico etiológico mediante historia, pruebas cutáneas y exposición.
- **A8:** Integra inmunología, alérgenos, mecanismos de hipersensibilidad y evidencia.

### Geriatría (`GERIATRICS`)

- **Tipo:** MIR
- **Familia:** Médica
- **Estado:** active
- **Descripción:** Atención integral de las personas mayores, con enfoque en funcionalidad, fragilidad y coordinación del cuidado.
- **Perfil:** A1:3, A2:1, A3:2, A4:4, A5:4, A8:2
- **Población:** Personas mayores
- **Resultados:** Controlar una enfermedad crónica, Restaurar función y calidad de vida, Aliviar sufrimiento y acompañar el final, Prevenir enfermedades
- **Entornos:** Consulta / ambulatorio, Planta de hospitalización, Domicilio
- **Sistemas:** Varios sistemas
- **Restricciones:** emotionalLoad:3, guards:2, predictability:3, flexibility:4, research:2
- **Alternativas:** Medicina Familiar, Medicina Interna, Cuidados Paliativos
- **Fuente:** Perfil preliminar basado en práctica clínica general; validación clínica pendiente.

**Evidencia:**
- **A4:** Seguimiento longitudinal y coordinación del cuidado.
- **A6:** La población mayor define el ámbito de la especialidad.
- **A1:** Valoración integral y razonamiento geriátrico con pluripatología y fragilidad.
- **A5:** Relación longitudinal intensa con paciente y cuidadores.

### Medicina Física y Rehabilitación (`REHAB`)

- **Tipo:** MIR
- **Familia:** Médica
- **Estado:** active
- **Descripción:** Diagnóstico y tratamiento de la discapacidad funcional, con programas de recuperación y adaptación.
- **Perfil:** A1:2, A2:1, A3:1, A4:4, A5:4, A8:2
- **Población:** Adultos, Personas mayores, Niños y adolescentes
- **Resultados:** Restaurar función y calidad de vida, Controlar una enfermedad crónica, Curar o resolver un episodio
- **Entornos:** Consulta / ambulatorio, Planta de hospitalización, Domicilio
- **Sistemas:** Musculoesquelético, Nervioso
- **Restricciones:** emotionalLoad:2, guards:1, predictability:4, flexibility:4, research:2
- **Alternativas:** Traumatología, Neurología, Geriatría
- **Fuente:** Perfil preliminar basado en práctica clínica general; validación clínica pendiente.

**Evidencia:**
- **A4:** Los programas de rehabilitación requieren seguimiento prolongado.
- **A7:** El objetivo principal es recuperar función.
- **A5:** Relación terapéutica prolongada y trabajo con equipo multidisciplinar.

### Angiología y Cirugía Vascular (`VASCULAR`)

- **Tipo:** MIR
- **Familia:** Quirúrgica
- **Estado:** active
- **Descripción:** Tratamiento médico, quirúrgico y endovascular de las enfermedades de las arterias y venas.
- **Perfil:** A1:2, A2:4, A3:3, A4:2, A5:2, A8:2
- **Población:** Adultos, Personas mayores
- **Resultados:** Curar o resolver un episodio, Restaurar función y calidad de vida, Estabilizar una situación crítica
- **Entornos:** Quirófano / salas de procedimientos, Consulta / ambulatorio, Imagen
- **Sistemas:** Cardiovascular
- **Restricciones:** emotionalLoad:2, guards:3, predictability:3, flexibility:3, research:2
- **Alternativas:** Cirugía Cardiovascular, Radiodiagnóstico, Cirugía General
- **Fuente:** Perfil preliminar basado en práctica clínica general; validación clínica pendiente.

**Evidencia:**
- **A2:** Combina cirugía abierta y procedimientos endovasculares.
- **A3:** Maneja patología aguda y crónica.

### Cirugía Torácica (`THORACIC_SURGERY`)

- **Tipo:** MIR
- **Familia:** Quirúrgica
- **Estado:** active
- **Descripción:** Intervenciones quirúrgicas sobre pulmón, pleura, mediastino y pared torácica.
- **Perfil:** A1:2, A2:4, A3:3, A4:2, A5:2, A8:1
- **Población:** Adultos
- **Resultados:** Curar o resolver un episodio, Restaurar función y calidad de vida, Estabilizar una situación crítica
- **Entornos:** Quirófano / salas de procedimientos, Planta de hospitalización
- **Sistemas:** Respiratorio
- **Restricciones:** emotionalLoad:3, guards:3, predictability:2, flexibility:2, research:2
- **Alternativas:** Neumología, Cirugía General, Medicina Intensiva
- **Fuente:** Perfil preliminar basado en práctica clínica general; validación clínica pendiente.

**Evidencia:**
- **A2:** El acto quirúrgico torácico es central.
- **A3:** Incluye cirugía urgente y programada.

### Cirugía Cardiovascular (`CARDIOVASCULAR_SURGERY`)

- **Tipo:** MIR
- **Familia:** Quirúrgica
- **Estado:** active
- **Descripción:** Cirugía del corazón y de los grandes vasos, con procedimientos de alta complejidad y soporte circulatorio.
- **Perfil:** A1:2, A2:4, A3:4, A4:2, A5:2, A8:2
- **Población:** Adultos, Personas mayores
- **Resultados:** Curar o resolver un episodio, Estabilizar una situación crítica, Restaurar función y calidad de vida
- **Entornos:** Quirófano / salas de procedimientos, Planta de hospitalización, Urgencias / UCI
- **Sistemas:** Cardiovascular
- **Restricciones:** emotionalLoad:3, guards:4, predictability:1, flexibility:2, research:3
- **Alternativas:** Cardiología, Cirugía Vascular, Medicina Intensiva
- **Fuente:** Perfil preliminar basado en práctica clínica general; validación clínica pendiente.

**Evidencia:**
- **A2:** Cirugía cardiaca y de grandes vasos.
- **A3:** Alta exposición a urgencias y cirugía crítica.

### Cirugía Plástica, Estética y Reparadora (`PLASTIC_SURGERY`)

- **Tipo:** MIR
- **Familia:** Quirúrgica
- **Estado:** active
- **Descripción:** Reconstrucción funcional y estética de tejidos, tras traumatismos, cirugía oncológica o malformaciones.
- **Perfil:** A1:2, A2:4, A3:2, A4:3, A5:3, A8:1
- **Población:** Adultos, Niños y adolescentes
- **Resultados:** Restaurar función y calidad de vida, Curar o resolver un episodio
- **Entornos:** Quirófano / salas de procedimientos, Consulta / ambulatorio
- **Sistemas:** Piel, Musculoesquelético
- **Restricciones:** emotionalLoad:2, guards:2, predictability:3, flexibility:4, research:2
- **Alternativas:** Dermatología, Cirugía Oral y Maxilofacial, Traumatología
- **Fuente:** Perfil preliminar basado en práctica clínica general; validación clínica pendiente.

**Evidencia:**
- **A2:** La técnica reconstructiva es central.
- **A7:** El objetivo es restaurar forma y función.
- **A4:** Seguimiento de reconstrucción, cicatrización y resultados funcionales y estéticos.
- **A5:** La relación clínica y las expectativas del paciente son centrales.

### Cirugía Oral y Maxilofacial (`MAXILLOFACIAL`)

- **Tipo:** MIR
- **Familia:** Quirúrgica
- **Estado:** active
- **Descripción:** Tratamiento quirúrgico de la patología de la cara, boca, mandíbula y cuello.
- **Perfil:** A1:2, A2:4, A3:2, A4:3, A5:3, A8:0
- **Población:** Adultos, Niños y adolescentes
- **Resultados:** Restaurar función y calidad de vida, Curar o resolver un episodio
- **Entornos:** Quirófano / salas de procedimientos, Consulta / ambulatorio, Planta de hospitalización
- **Sistemas:** Musculoesquelético, Órganos de los sentidos
- **Restricciones:** emotionalLoad:2, guards:2, predictability:3, flexibility:3, research:2
- **Alternativas:** Cirugía Plástica, Otorrinolaringología, Cirugía General
- **Fuente:** Perfil preliminar basado en práctica clínica general; validación clínica pendiente.

**Evidencia:**
- **A2:** La cirugía maxilofacial es el núcleo.
- **A8:** La anatomía craneofacial es el contenido principal.
- **A4:** Seguimiento de cirugía oral, traumatología facial y reconstrucción.
- **A5:** Contacto clínico y quirúrgico longitudinal con el paciente.

### Cirugía Pediátrica (`PAEDIATRIC_SURGERY`)

- **Tipo:** MIR
- **Familia:** Quirúrgica
- **Estado:** active
- **Descripción:** Cirugía de las malformaciones y enfermedades quirúrgicas desde el periodo neonatal hasta la adolescencia.
- **Perfil:** A1:2, A2:4, A3:3, A4:4, A5:4, A8:1
- **Población:** Niños y adolescentes, Recién nacidos
- **Resultados:** Curar o resolver un episodio, Restaurar función y calidad de vida, Prevenir enfermedades
- **Entornos:** Quirófano / salas de procedimientos, Planta de hospitalización, Urgencias / UCI
- **Sistemas:** Digestivo, Varios sistemas
- **Restricciones:** emotionalLoad:3, guards:3, predictability:2, flexibility:3, research:2
- **Alternativas:** Pediatría, Neonatología, Cirugía General
- **Fuente:** Perfil preliminar basado en práctica clínica general; validación clínica pendiente.

**Evidencia:**
- **A2:** La cirugía pediátrica es central.
- **A6:** La población infantil y neonatal define la especialidad.
- **A3:** Combina cirugía pediátrica programada, urgencias y guardias.
- **A4:** Seguimiento del paciente pediátrico y de malformaciones congénitas.
- **A5:** Relación con el niño y la familia en un contexto quirúrgico.

### Neurocirugía (`NEUROSURGERY`)

- **Tipo:** MIR
- **Familia:** Quirúrgica
- **Estado:** active
- **Descripción:** Cirugía del sistema nervioso central y periférico, incluyendo patología tumoral, vascular y traumática.
- **Perfil:** A1:3, A2:4, A3:4, A4:3, A5:2, A8:2
- **Población:** Adultos, Niños y adolescentes
- **Resultados:** Curar o resolver un episodio, Estabilizar una situación crítica, Restaurar función y calidad de vida
- **Entornos:** Quirófano / salas de procedimientos, Planta de hospitalización, Urgencias / UCI
- **Sistemas:** Nervioso
- **Restricciones:** emotionalLoad:3, guards:4, predictability:1, flexibility:2, research:3
- **Alternativas:** Neurología, Medicina Intensiva, Traumatología
- **Fuente:** Perfil preliminar basado en práctica clínica general; validación clínica pendiente.

**Evidencia:**
- **A2:** La cirugía del sistema nervioso es el núcleo.
- **A3:** Alta exposición a urgencias neuroquirúrgicas.
- **A1:** Razonamiento neuroanatómico y toma de decisiones quirúrgicas complejas.
- **A4:** Seguimiento de patología neuroquirúrgica y rehabilitación.

### Medicina Nuclear (`NUCLEAR_MEDICINE`)

- **Tipo:** MIR
- **Familia:** Diagnóstica
- **Estado:** active
- **Descripción:** Diagnóstico funcional y tratamiento con radiotrazadores, con una fuerte base tecnológica y molecular.
- **Perfil:** A1:4, A2:2, A3:1, A4:2, A5:1, A8:4
- **Población:** Adultos, Niños y adolescentes
- **Resultados:** Dar un diagnóstico preciso, Controlar una enfermedad crónica, Curar o resolver un episodio
- **Entornos:** Imagen, Laboratorio
- **Sistemas:** Varios sistemas
- **Restricciones:** emotionalLoad:1, guards:1, predictability:4, flexibility:3, research:4
- **Alternativas:** Radiodiagnóstico, Oncología Médica, Endocrinología
- **Fuente:** Perfil preliminar basado en práctica clínica general; validación clínica pendiente.

**Evidencia:**
- **A8:** Biología molecular y radiotrazadores.
- **A5:** El contacto clínico directo es limitado.
- **A1:** Interpretación fisiopatológica de estudios funcionales y moleculares.

### Microbiología Clínica (`MICROBIOLOGY`)

- **Tipo:** MIR
- **Familia:** Diagnóstica
- **Estado:** active
- **Descripción:** Identificación de agentes infecciosos, resistencias y diagnóstico microbiológico para guiar el tratamiento.
- **Perfil:** A1:4, A2:1, A3:2, A4:2, A5:0, A8:4
- **Población:** Todas las edades
- **Resultados:** Dar un diagnóstico preciso, Prevenir enfermedades
- **Entornos:** Laboratorio
- **Sistemas:** Inmunitario
- **Restricciones:** emotionalLoad:1, guards:1, predictability:4, flexibility:4, research:4
- **Alternativas:** Enfermedades Infecciosas, Inmunología, Anatomía Patológica
- **Fuente:** Perfil preliminar basado en práctica clínica general; validación clínica pendiente.

**Evidencia:**
- **A8:** Microbiología y biología molecular.
- **A5:** Trabajo de laboratorio con contacto clínico mínimo.
- **A1:** Razonamiento microbiológico para identificar agentes y resistencias.

### Inmunología (`IMMUNOLOGY`)

- **Tipo:** MIR
- **Familia:** Diagnóstica
- **Estado:** active
- **Descripción:** Estudio del sistema inmunitario, diagnóstico de inmunodeficiencias y apoyo a trasplantes y enfermedades autoinmunes.
- **Perfil:** A1:4, A2:1, A3:1, A4:3, A5:1, A8:4
- **Población:** Adultos, Niños y adolescentes
- **Resultados:** Dar un diagnóstico preciso, Controlar una enfermedad crónica, Curar o resolver un episodio
- **Entornos:** Laboratorio, Consulta / ambulatorio
- **Sistemas:** Inmunitario
- **Restricciones:** emotionalLoad:2, guards:1, predictability:4, flexibility:4, research:4
- **Alternativas:** Alergología, Reumatología, Anatomía Patológica
- **Fuente:** Perfil preliminar basado en práctica clínica general; validación clínica pendiente.

**Evidencia:**
- **A8:** Mecanismos inmunológicos y moleculares.
- **A1:** Razonamiento diagnóstico complejo.
- **A4:** Seguimiento de inmunodeficiencias y enfermedades autoinmunes.

### Genética Clínica (`GENETICS`)

- **Tipo:** ACE
- **Familia:** Diagnóstica
- **Estado:** active
- **Descripción:** Diagnóstico, asesoramiento y seguimiento de enfermedades hereditarias y anomalías genéticas.
- **Perfil:** A1:4, A2:0, A3:1, A4:3, A5:3, A8:4
- **Población:** Niños y adolescentes, Adultos, Embarazo y salud de la mujer
- **Resultados:** Dar un diagnóstico preciso, Prevenir enfermedades, Generar conocimiento
- **Entornos:** Consulta / ambulatorio, Laboratorio
- **Sistemas:** Varios sistemas
- **Restricciones:** emotionalLoad:3, guards:1, predictability:4, flexibility:4, research:4
- **Alternativas:** Pediatría, Oncología Médica, Anatomía Patológica
- **Fuente:** Perfil preliminar basado en práctica clínica general; validación clínica pendiente.

**Evidencia:**
- **A8:** Genética y biología molecular.
- **A4:** Seguimiento y asesoramiento longitudinal.
- **A1:** Razonamiento genético, interpretación de variantes y consejo.
- **A5:** Relación clínica en consejo genético y enfermedades hereditarias.

### Neurofisiología Clínica (`NEUROPHYSIOLOGY`)

- **Tipo:** MIR
- **Familia:** Diagnóstica
- **Estado:** active
- **Descripción:** Diagnóstico funcional del sistema nervioso mediante electroencefalografía, electromiografía y potenciales evocados.
- **Perfil:** A1:4, A2:1, A3:1, A4:1, A5:1, A8:3
- **Población:** Adultos, Niños y adolescentes
- **Resultados:** Dar un diagnóstico preciso
- **Entornos:** Laboratorio, Consulta / ambulatorio
- **Sistemas:** Nervioso
- **Restricciones:** emotionalLoad:1, guards:1, predictability:4, flexibility:4, research:3
- **Alternativas:** Neurología, Neurocirugía, Psiquiatría
- **Fuente:** Perfil preliminar basado en práctica clínica general; validación clínica pendiente.

**Evidencia:**
- **A8:** Registros electrofisiológicos y función neuronal.
- **A1:** Interpretación diagnóstica especializada.

### Medicina Preventiva y Salud Pública (`PREVENTIVE`)

- **Tipo:** MIR
- **Familia:** Transversal
- **Estado:** active
- **Descripción:** Promoción de la salud, prevención de enfermedades y planificación sanitaria a nivel poblacional.
- **Perfil:** A1:4, A2:1, A3:2, A4:1, A5:1, A8:4
- **Población:** Todas las edades
- **Resultados:** Prevenir enfermedades, Dar un diagnóstico preciso, Controlar una enfermedad crónica
- **Entornos:** Consulta / ambulatorio, Planta de hospitalización
- **Sistemas:** Varios sistemas
- **Restricciones:** emotionalLoad:2, guards:2, predictability:4, flexibility:4, research:4
- **Alternativas:** Medicina Familiar, Enfermedades Infecciosas, Medicina del Trabajo
- **Fuente:** Perfil preliminar basado en práctica clínica general; validación clínica pendiente.

**Evidencia:**
- **A7:** El resultado principal es prevención y salud poblacional.
- **A8:** Epidemiología y salud pública.
- **A1:** Razonamiento poblacional y epidemiológico para diseñar intervenciones.

### Medicina del Trabajo (`OCCUPATIONAL`)

- **Tipo:** MIR
- **Familia:** Transversal
- **Estado:** active
- **Descripción:** Valoración de la salud de los trabajadores, prevención de riesgos laborales y adaptación del puesto.
- **Perfil:** A1:3, A2:0, A3:1, A4:1, A5:2, A8:1
- **Población:** Adultos
- **Resultados:** Prevenir enfermedades, Controlar una enfermedad crónica, Restaurar función y calidad de vida
- **Entornos:** Consulta / ambulatorio, Domicilio
- **Sistemas:** Varios sistemas
- **Restricciones:** emotionalLoad:2, guards:2, predictability:4, flexibility:4, research:3
- **Alternativas:** Medicina Familiar, Rehabilitación, Medicina Preventiva
- **Fuente:** Perfil preliminar basado en práctica clínica general; validación clínica pendiente.

**Evidencia:**
- **A7:** Prevención y adaptación funcional.
- **A4:** Valoración periódica de la aptitud laboral.
- **A1:** Valoración de riesgo laboral y relación entre salud y trabajo.

### Medicina Legal y Forense (`LEGAL_MEDICINE`)

- **Tipo:** MIR
- **Familia:** Transversal
- **Estado:** active
- **Descripción:** Aplicación del conocimiento médico a la práctica judicial, la peritación y la investigación forense.
- **Perfil:** A1:4, A2:1, A3:1, A4:0, A5:0, A8:3
- **Población:** Todas las edades
- **Resultados:** Dar un diagnóstico preciso, Generar conocimiento
- **Entornos:** Laboratorio, Consulta / ambulatorio
- **Sistemas:** Varios sistemas
- **Restricciones:** emotionalLoad:3, guards:2, predictability:4, flexibility:3, research:4
- **Alternativas:** Anatomía Patológica, Toxicología Clínica, Medicina Preventiva
- **Fuente:** Perfil preliminar basado en práctica clínica general; validación clínica pendiente.

**Evidencia:**
- **A1:** Razonamiento médico aplicado a la peritación.
- **A8:** Toxicología y ciencias forenses.

### Farmacología Clínica (`PHARMACOLOGY`)

- **Tipo:** MIR
- **Familia:** Transversal
- **Estado:** active
- **Descripción:** Uso seguro y eficiente de los medicamentos, farmacovigilancia y evaluación de la terapéutica.
- **Perfil:** A1:3, A2:1, A3:1, A4:1, A5:1, A8:4
- **Población:** Adultos, Personas mayores
- **Resultados:** Generar conocimiento, Controlar una enfermedad crónica
- **Entornos:** Laboratorio, Consulta / ambulatorio
- **Sistemas:** Varios sistemas
- **Restricciones:** emotionalLoad:1, guards:1, predictability:4, flexibility:4, research:4
- **Alternativas:** Medicina Interna, Investigación Biomédica, Medicina Preventiva
- **Fuente:** Perfil preliminar basado en práctica clínica general; validación clínica pendiente.

**Evidencia:**
- **A8:** Farmacología y mecanismos moleculares.
- **A4:** Evaluación de la terapéutica y farmacovigilancia.
- **A1:** Razonamiento farmacológico y evaluación de evidencia terapéutica.

### Medicina de la Educación Física y del Deporte (`SPORTS_MEDICINE`)

- **Tipo:** MIR
- **Familia:** Transversal
- **Estado:** active
- **Descripción:** Atención al deportista, prevención de lesiones, recuperación funcional y valoración del rendimiento.
- **Perfil:** A1:2, A2:2, A3:2, A4:4, A5:4, A8:3
- **Población:** Adultos, Niños y adolescentes
- **Resultados:** Restaurar función y calidad de vida, Prevenir enfermedades, Curar o resolver un episodio
- **Entornos:** Consulta / ambulatorio, Domicilio
- **Sistemas:** Musculoesquelético
- **Restricciones:** emotionalLoad:2, guards:2, predictability:3, flexibility:4, research:3
- **Alternativas:** Traumatología, Rehabilitación, Endocrinología
- **Fuente:** Perfil preliminar basado en práctica clínica general; validación clínica pendiente.

**Evidencia:**
- **A7:** El objetivo es función, prevención y rendimiento.
- **A4:** Seguimiento longitudinal del deportista.
- **A5:** Relación clínica con deportistas y equipos multidisciplinares.
- **A8:** Integra fisiología del ejercicio, biomecánica y evidencia de rehabilitación.

### Investigación Biomédica (`RESEARCH`)

- **Tipo:** AREA
- **Familia:** Transversal
- **Estado:** active
- **Descripción:** Generación de conocimiento biomédico y traslación de hallazgos a la práctica clínica.
- **Perfil:** A1:4, A2:0, A3:1, A4:1, A5:0, A8:4
- **Población:** Todas las edades
- **Resultados:** Generar conocimiento, Dar un diagnóstico preciso
- **Entornos:** Laboratorio
- **Sistemas:** Varios sistemas
- **Restricciones:** emotionalLoad:1, guards:1, predictability:4, flexibility:4, research:4
- **Alternativas:** Farmacología Clínica, Anatomía Patológica, Genética Clínica
- **Fuente:** Perfil preliminar basado en práctica clínica general; validación clínica pendiente.

**Evidencia:**
- **A8:** Mecanismos biológicos y metodología científica.
- **A5:** Contacto clínico directo mínimo.
- **A1:** Diseño y análisis de estudios biomédicos como actividad central.

### Toxicología Clínica (`TOXICOLOGY`)

- **Tipo:** ACE
- **Familia:** Transversal
- **Estado:** active
- **Descripción:** Diagnóstico y tratamiento de intoxicaciones y efectos adversos de sustancias químicas.
- **Perfil:** A1:3, A2:1, A3:3, A4:1, A5:1, A8:3
- **Población:** Adultos, Personas mayores
- **Resultados:** Estabilizar una situación crítica, Curar o resolver un episodio, Dar un diagnóstico preciso
- **Entornos:** Urgencias / UCI, Laboratorio
- **Sistemas:** Varios sistemas
- **Restricciones:** emotionalLoad:3, guards:3, predictability:3, flexibility:3, research:3
- **Alternativas:** Medicina de Urgencias, Farmacología Clínica, Medicina Legal
- **Fuente:** Perfil preliminar basado en práctica clínica general; validación clínica pendiente.

**Evidencia:**
- **A3:** Atención a intoxicaciones agudas.
- **A8:** Farmacología y toxicología.
- **A1:** Razonamiento toxicológico y diagnóstico de exposiciones.

### Neonatología (`NEONATOLOGY`)

- **Tipo:** ACE
- **Familia:** Pediátrica
- **Estado:** active
- **Descripción:** Cuidado del recién nacido sano y del neonato prematuro o enfermo, incluyendo soporte vital y seguimiento del desarrollo.
- **Perfil:** A1:3, A2:2, A3:4, A4:3, A5:4, A8:3
- **Población:** Recién nacidos
- **Resultados:** Estabilizar una situación crítica, Curar o resolver un episodio, Restaurar función y calidad de vida, Prevenir enfermedades
- **Entornos:** Planta de hospitalización, Urgencias / UCI
- **Sistemas:** Varios sistemas
- **Restricciones:** emotionalLoad:4, guards:4, predictability:1, flexibility:2, research:3
- **Alternativas:** Pediatría, Cirugía Pediátrica, Medicina Intensiva
- **Fuente:** Perfil preliminar basado en práctica clínica general; validación clínica pendiente.

**Evidencia:**
- **A6:** La población neonatal define la especialidad.
- **A3:** Alta exposición a urgencias y soporte vital.
- **A1:** Razonamiento fisiopatológico en el recién nacido y la prematuridad.
- **A4:** Seguimiento del neonato y su desarrollo durante la hospitalización.
- **A5:** Relación intensa con el recién nacido y su familia.
- **A8:** Requiere fisiología neonatal, farmacología y evidencia.

### Psiquiatría Infantil y de la Adolescencia (`CHILD_PSYCHIATRY`)

- **Tipo:** ACE
- **Familia:** Salud mental
- **Estado:** active
- **Descripción:** Evaluación y tratamiento de los trastornos mentales en la infancia y la adolescencia, con trabajo con la familia y el entorno escolar.
- **Perfil:** A1:3, A2:0, A3:2, A4:4, A5:4, A8:2
- **Población:** Niños y adolescentes
- **Resultados:** Controlar una enfermedad crónica, Restaurar función y calidad de vida, Curar o resolver un episodio, Prevenir enfermedades
- **Entornos:** Consulta / ambulatorio, Planta de hospitalización
- **Sistemas:** Salud mental
- **Restricciones:** emotionalLoad:4, guards:2, predictability:3, flexibility:4, research:3
- **Alternativas:** Psiquiatría, Pediatría, Neurología
- **Fuente:** Perfil preliminar basado en práctica clínica general; validación clínica pendiente.

**Evidencia:**
- **A6:** La población infantojuvenil define la especialidad.
- **A4:** Seguimiento longitudinal del desarrollo.
- **A1:** Formulación biopsicosocial y diagnóstico longitudinal en la infancia.
- **A5:** Relación terapéutica intensa con el niño, la familia y el entorno.
