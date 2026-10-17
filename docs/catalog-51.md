# Catálogo de especialidades v1

Documento generado automáticamente desde `src/data/specialties.ts`. No editar a mano.

## Resumen

- Total: 51 fichas.
- MIR: 45.
- ACE: 4.
- Áreas: 2.
- Fichas en estado draft: 39.

## Fichas

### Medicina Familiar y Comunitaria (`FAMILY_MEDICINE`)

- **Tipo:** MIR
- **Familia:** Transversal
- **Estado:** active
- **Revisión:** legacy
- **Descripción:** Atención continuada a personas y familias, con una visión integral y longitudinal del paciente.
- **Perfil:** A1:3, A2:1, A3:2, A4:4, A5:4, A8:2
- **Población:** Todas las edades, Adultos, Personas mayores, Niños y adolescentes
- **Resultados:** Curar o resolver un episodio, Controlar una enfermedad crónica, Prevenir enfermedades, Aliviar sufrimiento y acompañar el final
- **Entornos:** Consulta / ambulatorio, Planta de hospitalización, Domicilio
- **Sistemas:** Varios sistemas
- **Restricciones:** emotionalLoad:3, guards:2, predictability:3, flexibility:4, research:2
- **Alternativas:** Medicina Interna, Pediatría, Geriatría
- **Fuente:** No registrada

**Evidencia:**
- **A1:** Integra problemas poco diferenciados y decide qué estudiar y derivar.
- **A4:** La continuidad es el eje del modelo de atención primaria.
- **A5:** La relación clínica longitudinal es central en la consulta.

### Medicina Interna (`INTERNAL_MEDICINE`)

- **Tipo:** MIR
- **Familia:** Médica
- **Estado:** active
- **Revisión:** legacy
- **Descripción:** Diagnóstico y tratamiento del adulto con enfermedad compleja, pluripatología y problemas no resueltos.
- **Perfil:** A1:4, A2:2, A3:3, A4:3, A5:3, A8:3
- **Población:** Adultos, Personas mayores
- **Resultados:** Dar un diagnóstico preciso, Controlar una enfermedad crónica, Curar o resolver un episodio
- **Entornos:** Planta de hospitalización, Urgencias / UCI, Consulta / ambulatorio
- **Sistemas:** Varios sistemas
- **Restricciones:** emotionalLoad:3, guards:3, predictability:2, flexibility:3, research:3
- **Alternativas:** Medicina Intensiva, Infectología, Nefrología
- **Fuente:** No registrada

**Evidencia:**
- **A1:** El razonamiento diagnóstico diferencial es la competencia nuclear.
- **A8:** Requiere integrar fisiopatología de varios sistemas.
- **A4:** Combina episodios agudos con seguimiento de enfermedades crónicas.

### Medicina de Urgencias y Emergencias (`EMERGENCY`)

- **Tipo:** MIR
- **Familia:** Urgente
- **Estado:** active
- **Revisión:** legacy
- **Descripción:** Valoración, estabilización y resolución inicial de pacientes con problemas agudos e imprevisibles.
- **Perfil:** A1:2, A2:2, A3:4, A4:1, A5:2, A8:2
- **Población:** Adultos, Niños y adolescentes, Personas mayores
- **Resultados:** Estabilizar una situación crítica, Dar un diagnóstico preciso
- **Entornos:** Urgencias / UCI
- **Sistemas:** Varios sistemas
- **Restricciones:** emotionalLoad:4, guards:4, predictability:1, flexibility:3, research:2
- **Alternativas:** Medicina Intensiva, Anestesiología, Medicina Interna
- **Fuente:** No registrada

**Evidencia:**
- **A3:** La imprevisibilidad y la toma de decisiones rápida definen el servicio.
- **C1:** Alta exposición a situaciones críticas, incertidumbre y muerte.

### Medicina Intensiva (`INTENSIVE_CARE`)

- **Tipo:** MIR
- **Familia:** Urgente
- **Estado:** active
- **Revisión:** legacy
- **Descripción:** Soporte vital avanzado y manejo continuo del paciente crítico con disfunción multiorgánica.
- **Perfil:** A1:3, A2:3, A3:4, A4:2, A5:2, A8:3
- **Población:** Adultos, Todas las edades
- **Resultados:** Estabilizar una situación crítica, Curar o resolver un episodio, Dar un diagnóstico preciso
- **Entornos:** Urgencias / UCI, Planta de hospitalización
- **Sistemas:** Varios sistemas
- **Restricciones:** emotionalLoad:4, guards:4, predictability:1, flexibility:2, research:3
- **Alternativas:** Anestesiología, Medicina de Urgencias, Cardiología
- **Fuente:** No registrada

**Evidencia:**
- **A2:** Procedimientos invasivos y monitorización avanzada forman parte del trabajo diario.
- **A3:** La actividad es urgente y continua, con guardias frecuentes.
- **C1:** Alta carga emocional y decisiones con información incompleta.

### Anestesiología y Reanimación (`ANESTHESIOLOGY`)

- **Tipo:** MIR
- **Familia:** Quirúrgica
- **Estado:** active
- **Revisión:** legacy
- **Descripción:** Control del soporte vital, la analgesia y la homeostasis durante cirugía y procedimientos.
- **Perfil:** A1:2, A2:4, A3:3, A4:1, A5:1, A8:2
- **Población:** Todas las edades, Adultos, Niños y adolescentes
- **Resultados:** Estabilizar una situación crítica, Restaurar función y calidad de vida
- **Entornos:** Quirófano / salas de procedimientos, Urgencias / UCI
- **Sistemas:** Varios sistemas
- **Restricciones:** emotionalLoad:3, guards:3, predictability:2, flexibility:3, research:2
- **Alternativas:** Medicina Intensiva, Cirugía General, Medicina de Urgencias
- **Fuente:** No registrada

**Evidencia:**
- **A2:** La técnica y el control fisiológico intraoperatorio son el núcleo de la especialidad.
- **A5:** El contacto es intenso durante el procedimiento, pero muy focalizado.

### Cirugía General y del Aparato Digestivo (`SURGERY`)

- **Tipo:** MIR
- **Familia:** Quirúrgica
- **Estado:** active
- **Revisión:** legacy
- **Descripción:** Tratamiento quirúrgico de patología abdominal, urgente y programada, con seguimiento perioperatorio.
- **Perfil:** A1:1, A2:4, A3:3, A4:2, A5:2, A8:0
- **Población:** Adultos
- **Resultados:** Curar o resolver un episodio, Restaurar función y calidad de vida
- **Entornos:** Quirófano / salas de procedimientos, Planta de hospitalización, Consulta / ambulatorio
- **Sistemas:** Digestivo
- **Restricciones:** emotionalLoad:3, guards:4, predictability:2, flexibility:2, research:2
- **Alternativas:** Traumatología, Urología, Cirugía Torácica
- **Fuente:** No registrada

**Evidencia:**
- **A1:** El razonamiento se orienta a la resolución anatómica y técnica.
- **A2:** El acto quirúrgico define la especialidad.
- **A8:** La anatomía quirúrgica es el contenido científico principal.

### Cirugía Ortopédica y Traumatología (`TRAUMATOLOGY`)

- **Tipo:** MIR
- **Familia:** Quirúrgica
- **Estado:** active
- **Revisión:** legacy
- **Descripción:** Tratamiento quirúrgico y funcional de lesiones y enfermedades del aparato locomotor.
- **Perfil:** A1:2, A2:4, A3:3, A4:2, A5:2, A8:2
- **Población:** Adultos, Personas mayores, Todas las edades
- **Resultados:** Restaurar función y calidad de vida, Curar o resolver un episodio
- **Entornos:** Quirófano / salas de procedimientos, Consulta / ambulatorio, Planta de hospitalización
- **Sistemas:** Musculoesquelético
- **Restricciones:** emotionalLoad:2, guards:3, predictability:3, flexibility:3, research:2
- **Alternativas:** Cirugía General, Rehabilitación, Medicina del Deporte
- **Fuente:** No registrada

**Evidencia:**
- **A2:** La cirugía y los procedimientos ortopédicos son centrales.
- **A7:** El objetivo principal es recuperar función y movilidad.
- **A8:** La biomecánica y la anatomía del aparato locomotor son el eje.

### Radiodiagnóstico (`RADIOLOGY`)

- **Tipo:** MIR
- **Familia:** Diagnóstica
- **Estado:** active
- **Revisión:** legacy
- **Descripción:** Interpretación de imagen médica y realización de procedimientos diagnósticos y terapéuticos guiados.
- **Perfil:** A1:4, A2:2, A3:2, A4:1, A5:1, A8:3
- **Población:** Todas las edades
- **Resultados:** Dar un diagnóstico preciso
- **Entornos:** Imagen
- **Sistemas:** Varios sistemas
- **Restricciones:** emotionalLoad:1, guards:2, predictability:4, flexibility:3, research:3
- **Alternativas:** Anatomía Patológica, Medicina Nuclear, Medicina Interna
- **Fuente:** No registrada

**Evidencia:**
- **A1:** El diagnóstico por imagen exige integración visual y razonamiento espacial.
- **A5:** El contacto clínico directo es limitado; el trabajo se centra en la prueba.
- **C2:** Actividad mayoritariamente programada, con guardias más contenidas.

### Anatomía Patológica (`PATHOLOGY`)

- **Tipo:** MIR
- **Familia:** Diagnóstica
- **Estado:** active
- **Revisión:** legacy
- **Descripción:** Diagnóstico definitivo mediante estudio microscópico y molecular de tejidos y muestras.
- **Perfil:** A1:4, A2:1, A3:1, A4:1, A5:0, A8:4
- **Población:** Todas las edades
- **Resultados:** Dar un diagnóstico preciso, Generar conocimiento
- **Entornos:** Laboratorio
- **Sistemas:** Varios sistemas
- **Restricciones:** emotionalLoad:1, guards:1, predictability:4, flexibility:4, research:4
- **Alternativas:** Radiodiagnóstico, Hematología, Genética Clínica
- **Fuente:** No registrada

**Evidencia:**
- **A1:** El razonamiento morfológico y molecular es el centro de la especialidad.
- **A5:** Trabajo de laboratorio con contacto clínico muy limitado.
- **A8:** Biología celular y molecular aplicadas al diagnóstico.

### Psiquiatría (`PSYCHIATRY`)

- **Tipo:** MIR
- **Familia:** Salud mental
- **Estado:** active
- **Revisión:** legacy
- **Descripción:** Evaluación y tratamiento de trastornos mentales, con relación terapéutica longitudinal.
- **Perfil:** A1:3, A2:0, A3:2, A4:4, A5:4, A8:2
- **Población:** Adultos, Niños y adolescentes, Personas mayores
- **Resultados:** Controlar una enfermedad crónica, Restaurar función y calidad de vida, Curar o resolver un episodio
- **Entornos:** Consulta / ambulatorio, Planta de hospitalización
- **Sistemas:** Salud mental
- **Restricciones:** emotionalLoad:4, guards:2, predictability:3, flexibility:4, research:3
- **Alternativas:** Neurología, Psicología Clínica, Medicina Familiar
- **Fuente:** No registrada

**Evidencia:**
- **A4:** La continuidad y la alianza terapéutica son centrales.
- **A5:** La entrevista y la relación clínica son la principal herramienta.
- **C1:** Alta exposición a sufrimiento psíquico y situaciones emocionalmente complejas.

### Pediatría (`PEDIATRICS`)

- **Tipo:** MIR
- **Familia:** Pediátrica
- **Estado:** active
- **Revisión:** legacy
- **Descripción:** Atención integral de la salud infantil y adolescente, desde la prevención hasta la enfermedad aguda y crónica.
- **Perfil:** A1:3, A2:2, A3:3, A4:4, A5:4, A8:3
- **Población:** Niños y adolescentes, Recién nacidos
- **Resultados:** Curar o resolver un episodio, Prevenir enfermedades, Controlar una enfermedad crónica, Restaurar función y calidad de vida
- **Entornos:** Consulta / ambulatorio, Planta de hospitalización, Urgencias / UCI
- **Sistemas:** Varios sistemas
- **Restricciones:** emotionalLoad:3, guards:3, predictability:2, flexibility:3, research:3
- **Alternativas:** Neonatología, Medicina Familiar, Endocrinología Pediátrica
- **Fuente:** No registrada

**Evidencia:**
- **A4:** El seguimiento del desarrollo y la continuidad son propios de la especialidad.
- **A6:** La población pediátrica define el ámbito de trabajo.
- **A8:** Fisiología y desarrollo infantiles requieren un enfoque específico.

### Cuidados Paliativos (`PALLIATIVE`)

- **Tipo:** AREA
- **Familia:** Paliativa
- **Estado:** active
- **Revisión:** legacy
- **Descripción:** Control de síntomas y acompañamiento integral en enfermedades avanzadas y al final de la vida.
- **Perfil:** A1:3, A2:1, A3:1, A4:4, A5:4, A8:2
- **Población:** Adultos, Personas mayores, Todas las edades
- **Resultados:** Aliviar sufrimiento y acompañar el final, Controlar una enfermedad crónica, Restaurar función y calidad de vida
- **Entornos:** Planta de hospitalización, Consulta / ambulatorio, Domicilio
- **Sistemas:** Varios sistemas
- **Restricciones:** emotionalLoad:4, guards:2, predictability:3, flexibility:4, research:2
- **Alternativas:** Medicina Familiar, Geriatría, Oncología Médica
- **Fuente:** No registrada

**Evidencia:**
- **A4:** El acompañamiento longitudinal y la planificación anticipada son centrales.
- **A5:** La relación con el paciente y la familia es el eje del cuidado.
- **C1:** Alta exposición al sufrimiento y a conversaciones sobre el final de la vida.

### Cardiología (`CARDIOLOGY`)

- **Tipo:** MIR
- **Familia:** Médica
- **Estado:** active
- **Revisión:** draft
- **Descripción:** Diagnóstico y tratamiento de las enfermedades del corazón y del sistema circulatorio, combinando manejo clínico, pruebas funcionales e intervencionismo.
- **Perfil:** A1:4, A2:3, A3:3, A4:3, A5:3, A8:3
- **Población:** Adultos, Personas mayores
- **Resultados:** Curar o resolver un episodio, Controlar una enfermedad crónica, Dar un diagnóstico preciso, Estabilizar una situación crítica, Prevenir enfermedades, Restaurar función y calidad de vida
- **Entornos:** Consulta / ambulatorio, Planta de hospitalización, Urgencias / UCI, Imagen
- **Sistemas:** Cardiovascular
- **Restricciones:** emotionalLoad:3, guards:3, predictability:2, flexibility:3, research:4
- **Alternativas:** Medicina Interna, Medicina Intensiva, Cirugía Cardiovascular
- **Fuente:** Perfil preliminar basado en práctica clínica general; revisión experta pendiente.

**Evidencia:**
- **A1:** El razonamiento hemodinámico y clínico es central.
- **A2:** Incluye procedimientos diagnósticos y terapéuticos.
- **A3:** Maneja síndromes agudos y crónicos.

### Aparato Digestivo (`GASTROENTEROLOGY`)

- **Tipo:** MIR
- **Familia:** Médica
- **Estado:** active
- **Revisión:** draft
- **Descripción:** Estudio y tratamiento de las enfermedades del tracto digestivo, hígado y vías biliares, con clínica y técnicas endoscópicas.
- **Perfil:** A1:3, A2:3, A3:2, A4:3, A5:3, A8:3
- **Población:** Adultos, Personas mayores
- **Resultados:** Dar un diagnóstico preciso, Curar o resolver un episodio, Controlar una enfermedad crónica
- **Entornos:** Consulta / ambulatorio, Planta de hospitalización
- **Sistemas:** Digestivo
- **Restricciones:** emotionalLoad:2, guards:3, predictability:3, flexibility:3, research:3
- **Alternativas:** Cirugía General, Medicina Interna, Oncología Médica
- **Fuente:** Perfil preliminar basado en práctica clínica general; revisión experta pendiente.

**Evidencia:**
- **A2:** La endoscopia y los procedimientos digestivos son parte importante.
- **A4:** Combina seguimiento de enfermedades crónicas con episodios agudos.

### Neumología (`PULMONOLOGY`)

- **Tipo:** MIR
- **Familia:** Médica
- **Estado:** active
- **Revisión:** draft
- **Descripción:** Diagnóstico y tratamiento de las enfermedades respiratorias, desde la obstrucción crónica hasta la insuficiencia respiratoria aguda.
- **Perfil:** A1:3, A2:2, A3:3, A4:3, A5:3, A8:3
- **Población:** Adultos, Personas mayores
- **Resultados:** Dar un diagnóstico preciso, Controlar una enfermedad crónica, Curar o resolver un episodio, Estabilizar una situación crítica
- **Entornos:** Consulta / ambulatorio, Planta de hospitalización, Urgencias / UCI
- **Sistemas:** Respiratorio
- **Restricciones:** emotionalLoad:3, guards:3, predictability:2, flexibility:3, research:3
- **Alternativas:** Medicina Intensiva, Medicina Interna, Cirugía Torácica
- **Fuente:** Perfil preliminar basado en práctica clínica general; revisión experta pendiente.

**Evidencia:**
- **A3:** Atiende exacerbaciones y fallo respiratorio agudo.
- **A8:** La fisiología respiratoria es un contenido central.

### Nefrología (`NEPHROLOGY`)

- **Tipo:** MIR
- **Familia:** Médica
- **Estado:** active
- **Revisión:** draft
- **Descripción:** Manejo de la enfermedad renal, el equilibrio hidroelectrolítico y las terapias de sustitución renal.
- **Perfil:** A1:4, A2:3, A3:2, A4:4, A5:3, A8:3
- **Población:** Adultos, Personas mayores
- **Resultados:** Controlar una enfermedad crónica, Curar o resolver un episodio, Dar un diagnóstico preciso, Estabilizar una situación crítica
- **Entornos:** Consulta / ambulatorio, Planta de hospitalización, Laboratorio, Urgencias / UCI
- **Sistemas:** Renal / urinario
- **Restricciones:** emotionalLoad:3, guards:2, predictability:3, flexibility:3, research:4
- **Alternativas:** Medicina Interna, Urología, Medicina Intensiva
- **Fuente:** Perfil preliminar basado en práctica clínica general; revisión experta pendiente.

**Evidencia:**
- **A1:** El razonamiento fisiopatológico y el ajuste fino son centrales.
- **A4:** Seguimiento prolongado de enfermedad renal crónica.

### Endocrinología y Nutrición (`ENDOCRINOLOGY`)

- **Tipo:** MIR
- **Familia:** Médica
- **Estado:** active
- **Revisión:** draft
- **Descripción:** Estudio del sistema hormonal, el metabolismo y la nutrición, con seguimiento longitudinal de enfermedades crónicas.
- **Perfil:** A1:3, A2:1, A3:1, A4:4, A5:3, A8:4
- **Población:** Adultos, Personas mayores
- **Resultados:** Controlar una enfermedad crónica, Curar o resolver un episodio, Prevenir enfermedades
- **Entornos:** Consulta / ambulatorio, Planta de hospitalización
- **Sistemas:** Endocrino / metabólico
- **Restricciones:** emotionalLoad:2, guards:1, predictability:4, flexibility:4, research:4
- **Alternativas:** Medicina Interna, Pediatría, Medicina Familiar
- **Fuente:** Perfil preliminar basado en práctica clínica general; revisión experta pendiente.

**Evidencia:**
- **A4:** El seguimiento longitudinal es habitual.
- **A8:** Fisiología hormonal y metabolismo molecular.

### Neurología (`NEUROLOGY`)

- **Tipo:** MIR
- **Familia:** Médica
- **Estado:** active
- **Revisión:** draft
- **Descripción:** Diagnóstico y tratamiento de las enfermedades del sistema nervioso central y periférico, con frecuente seguimiento longitudinal.
- **Perfil:** A1:4, A2:1, A3:2, A4:4, A5:3, A8:3
- **Población:** Adultos, Personas mayores
- **Resultados:** Dar un diagnóstico preciso, Controlar una enfermedad crónica, Curar o resolver un episodio, Estabilizar una situación crítica
- **Entornos:** Consulta / ambulatorio, Planta de hospitalización, Urgencias / UCI
- **Sistemas:** Nervioso
- **Restricciones:** emotionalLoad:3, guards:2, predictability:3, flexibility:3, research:4
- **Alternativas:** Neurocirugía, Psiquiatría, Neurofisiología Clínica
- **Fuente:** Perfil preliminar basado en práctica clínica general; revisión experta pendiente.

**Evidencia:**
- **A1:** El razonamiento diagnóstico es el núcleo de la especialidad.
- **A4:** Muchas enfermedades neurológicas requieren seguimiento prolongado.

### Hematología y Hemoterapia (`HEMATOLOGY`)

- **Tipo:** MIR
- **Familia:** Médica
- **Estado:** active
- **Revisión:** draft
- **Descripción:** Diagnóstico y tratamiento de las enfermedades de la sangre, la médula ósea y el sistema hematopoyético.
- **Perfil:** A1:4, A2:3, A3:2, A4:4, A5:3, A8:4
- **Población:** Adultos, Personas mayores
- **Resultados:** Curar o resolver un episodio, Controlar una enfermedad crónica, Dar un diagnóstico preciso, Aliviar sufrimiento y acompañar el final
- **Entornos:** Consulta / ambulatorio, Planta de hospitalización, Laboratorio, Urgencias / UCI
- **Sistemas:** Hematológico, Inmunitario
- **Restricciones:** emotionalLoad:4, guards:2, predictability:3, flexibility:3, research:4
- **Alternativas:** Oncología Médica, Anatomía Patológica, Medicina Interna
- **Fuente:** Perfil preliminar basado en práctica clínica general; revisión experta pendiente.

**Evidencia:**
- **A8:** Biología celular y molecular aplicada al diagnóstico.
- **C1:** Alta exposición a enfermedad grave y pronóstico incierto.

### Oncología Médica (`ONCOLOGY`)

- **Tipo:** MIR
- **Familia:** Médica
- **Estado:** active
- **Revisión:** draft
- **Descripción:** Tratamiento sistémico del cáncer, coordinando terapias complejas y el acompañamiento del paciente a lo largo de la enfermedad.
- **Perfil:** A1:3, A2:1, A3:2, A4:4, A5:4, A8:3
- **Población:** Adultos, Personas mayores
- **Resultados:** Curar o resolver un episodio, Controlar una enfermedad crónica, Aliviar sufrimiento y acompañar el final, Dar un diagnóstico preciso
- **Entornos:** Consulta / ambulatorio, Planta de hospitalización, Laboratorio, Urgencias / UCI
- **Sistemas:** Varios sistemas
- **Restricciones:** emotionalLoad:4, guards:2, predictability:3, flexibility:4, research:4
- **Alternativas:** Hematología, Cuidados Paliativos, Medicina Interna
- **Fuente:** Perfil preliminar basado en práctica clínica general; revisión experta pendiente.

**Evidencia:**
- **A4:** Seguimiento longitudinal durante tratamientos prolongados.
- **C1:** Alta carga emocional y conversaciones sobre pronóstico.

### Enfermedades Infecciosas (`INFECTOLOGY`)

- **Tipo:** MIR
- **Familia:** Médica
- **Estado:** active
- **Revisión:** draft
- **Descripción:** Diagnóstico y tratamiento de infecciones complejas, con especial peso en el paciente hospitalizado y en la salud pública.
- **Perfil:** A1:4, A2:1, A3:3, A4:3, A5:3, A8:3
- **Población:** Adultos, Todas las edades
- **Resultados:** Curar o resolver un episodio, Dar un diagnóstico preciso, Prevenir enfermedades
- **Entornos:** Consulta / ambulatorio, Planta de hospitalización, Urgencias / UCI
- **Sistemas:** Varios sistemas
- **Restricciones:** emotionalLoad:3, guards:3, predictability:2, flexibility:3, research:4
- **Alternativas:** Microbiología Clínica, Medicina Interna, Medicina Preventiva
- **Fuente:** Perfil preliminar basado en práctica clínica general; revisión experta pendiente.

**Evidencia:**
- **A1:** Razonamiento etiológico y diagnóstico diferencial.
- **A3:** Consulta hospitalaria de infecciones agudas y graves.

### Reumatología (`RHEUMATOLOGY`)

- **Tipo:** MIR
- **Familia:** Médica
- **Estado:** active
- **Revisión:** draft
- **Descripción:** Diagnóstico y tratamiento de enfermedades autoinmunes y del aparato locomotor de carácter no quirúrgico.
- **Perfil:** A1:4, A2:1, A3:1, A4:4, A5:3, A8:3
- **Población:** Adultos, Personas mayores
- **Resultados:** Controlar una enfermedad crónica, Restaurar función y calidad de vida, Curar o resolver un episodio
- **Entornos:** Consulta / ambulatorio, Planta de hospitalización
- **Sistemas:** Musculoesquelético, Inmunitario
- **Restricciones:** emotionalLoad:2, guards:1, predictability:4, flexibility:4, research:3
- **Alternativas:** Rehabilitación, Medicina Interna, Inmunología
- **Fuente:** Perfil preliminar basado en práctica clínica general; revisión experta pendiente.

**Evidencia:**
- **A4:** Enfermedades crónicas con seguimiento prolongado.
- **A8:** Mecanismos inmunológicos e inflamatorios.

### Dermatología Médico-Quirúrgica (`DERMATOLOGY`)

- **Tipo:** MIR
- **Familia:** Médico-quirúrgica
- **Estado:** active
- **Revisión:** draft
- **Descripción:** Diagnóstico y tratamiento de las enfermedades de la piel, con cirugía menor y procedimientos dermatológicos.
- **Perfil:** A1:3, A2:3, A3:1, A4:3, A5:3, A8:2
- **Población:** Adultos, Niños y adolescentes
- **Resultados:** Curar o resolver un episodio, Dar un diagnóstico preciso, Restaurar función y calidad de vida
- **Entornos:** Consulta / ambulatorio
- **Sistemas:** Piel
- **Restricciones:** emotionalLoad:1, guards:1, predictability:4, flexibility:4, research:2
- **Alternativas:** Cirugía Plástica, Anatomía Patológica, Alergología
- **Fuente:** Perfil preliminar basado en práctica clínica general; revisión experta pendiente.

**Evidencia:**
- **A2:** Incluye cirugía menor y procedimientos.
- **A5:** El contacto clínico directo es habitual.

### Urología (`UROLOGY`)

- **Tipo:** MIR
- **Familia:** Quirúrgica
- **Estado:** active
- **Revisión:** draft
- **Descripción:** Tratamiento médico y quirúrgico del aparato urinario y del aparato reproductor masculino.
- **Perfil:** A1:2, A2:4, A3:3, A4:3, A5:2, A8:1
- **Población:** Adultos, Personas mayores
- **Resultados:** Curar o resolver un episodio, Restaurar función y calidad de vida, Controlar una enfermedad crónica
- **Entornos:** Quirófano / salas de procedimientos, Consulta / ambulatorio, Planta de hospitalización
- **Sistemas:** Renal / urinario, Reproductivo
- **Restricciones:** emotionalLoad:2, guards:3, predictability:3, flexibility:3, research:2
- **Alternativas:** Nefrología, Cirugía General, Oncología Médica
- **Fuente:** Perfil preliminar basado en práctica clínica general; revisión experta pendiente.

**Evidencia:**
- **A2:** La cirugía y los procedimientos urológicos son centrales.
- **A3:** Combina cirugía programada y urgencias.

### Oftalmología (`OPHTHALMOLOGY`)

- **Tipo:** MIR
- **Familia:** Quirúrgica
- **Estado:** active
- **Revisión:** draft
- **Descripción:** Diagnóstico y tratamiento de las enfermedades oculares, con microcirugía de alta precisión y seguimiento de patología crónica.
- **Perfil:** A1:3, A2:4, A3:2, A4:3, A5:2, A8:1
- **Población:** Adultos, Personas mayores, Niños y adolescentes
- **Resultados:** Curar o resolver un episodio, Restaurar función y calidad de vida, Controlar una enfermedad crónica
- **Entornos:** Quirófano / salas de procedimientos, Consulta / ambulatorio
- **Sistemas:** Órganos de los sentidos
- **Restricciones:** emotionalLoad:1, guards:2, predictability:4, flexibility:4, research:2
- **Alternativas:** Neurología, Cirugía Plástica, Otorrinolaringología
- **Fuente:** Perfil preliminar basado en práctica clínica general; revisión experta pendiente.

**Evidencia:**
- **A2:** La microcirugía y los procedimientos son centrales.
- **A4:** Seguimiento de patología ocular crónica.

### Otorrinolaringología (`ENT`)

- **Tipo:** MIR
- **Familia:** Quirúrgica
- **Estado:** active
- **Revisión:** draft
- **Descripción:** Tratamiento médico y quirúrgico de las enfermedades del oído, nariz, faringe y laringe.
- **Perfil:** A1:3, A2:3, A3:2, A4:3, A5:3, A8:1
- **Población:** Adultos, Niños y adolescentes
- **Resultados:** Curar o resolver un episodio, Restaurar función y calidad de vida, Dar un diagnóstico preciso
- **Entornos:** Quirófano / salas de procedimientos, Consulta / ambulatorio, Planta de hospitalización
- **Sistemas:** Órganos de los sentidos, Respiratorio
- **Restricciones:** emotionalLoad:2, guards:2, predictability:3, flexibility:3, research:2
- **Alternativas:** Pediatría, Cirugía Plástica, Neurocirugía
- **Fuente:** Perfil preliminar basado en práctica clínica general; revisión experta pendiente.

**Evidencia:**
- **A2:** Incluye cirugía ORL y procedimientos diagnósticos.
- **A5:** Contacto clínico directo con pacientes de todas las edades.

### Obstetricia y Ginecología (`GYNAECOLOGY`)

- **Tipo:** MIR
- **Familia:** Quirúrgica
- **Estado:** active
- **Revisión:** draft
- **Descripción:** Atención integral a la salud de la mujer, el embarazo, el parto y las enfermedades ginecológicas.
- **Perfil:** A1:3, A2:3, A3:3, A4:4, A5:4, A8:2
- **Población:** Embarazo y salud de la mujer, Adultos
- **Resultados:** Curar o resolver un episodio, Restaurar función y calidad de vida, Prevenir enfermedades, Controlar una enfermedad crónica
- **Entornos:** Consulta / ambulatorio, Quirófano / salas de procedimientos, Planta de hospitalización
- **Sistemas:** Reproductivo
- **Restricciones:** emotionalLoad:3, guards:3, predictability:2, flexibility:3, research:2
- **Alternativas:** Pediatría, Cirugía General, Urología
- **Fuente:** Perfil preliminar basado en práctica clínica general; revisión experta pendiente.

**Evidencia:**
- **A4:** Seguimiento del embarazo y de la salud de la mujer a lo largo del tiempo.
- **A5:** Relación clínica intensa y continuada.

### Alergología (`ALLERGOLOGY`)

- **Tipo:** MIR
- **Familia:** Médica
- **Estado:** active
- **Revisión:** draft
- **Descripción:** Diagnóstico y tratamiento de las enfermedades alérgicas e inmunológicas, con pruebas funcionales y seguimiento longitudinal.
- **Perfil:** A1:3, A2:1, A3:1, A4:4, A5:4, A8:3
- **Población:** Todas las edades, Adultos, Niños y adolescentes
- **Resultados:** Dar un diagnóstico preciso, Controlar una enfermedad crónica, Curar o resolver un episodio, Prevenir enfermedades
- **Entornos:** Consulta / ambulatorio, Laboratorio
- **Sistemas:** Inmunitario, Respiratorio, Piel
- **Restricciones:** emotionalLoad:2, guards:1, predictability:4, flexibility:4, research:3
- **Alternativas:** Inmunología, Dermatología, Medicina Interna
- **Fuente:** Perfil preliminar basado en práctica clínica general; revisión experta pendiente.

**Evidencia:**
- **A4:** Seguimiento de enfermedades alérgicas crónicas.
- **A5:** Educación y relación clínica continuada.

### Geriatría (`GERIATRICS`)

- **Tipo:** MIR
- **Familia:** Médica
- **Estado:** active
- **Revisión:** draft
- **Descripción:** Atención integral de las personas mayores, con enfoque en funcionalidad, fragilidad y coordinación del cuidado.
- **Perfil:** A1:3, A2:1, A3:2, A4:4, A5:4, A8:2
- **Población:** Personas mayores
- **Resultados:** Controlar una enfermedad crónica, Restaurar función y calidad de vida, Aliviar sufrimiento y acompañar el final, Prevenir enfermedades
- **Entornos:** Consulta / ambulatorio, Planta de hospitalización, Domicilio
- **Sistemas:** Varios sistemas
- **Restricciones:** emotionalLoad:3, guards:2, predictability:3, flexibility:4, research:2
- **Alternativas:** Medicina Familiar, Medicina Interna, Cuidados Paliativos
- **Fuente:** Perfil preliminar basado en práctica clínica general; revisión experta pendiente.

**Evidencia:**
- **A4:** Seguimiento longitudinal y coordinación del cuidado.
- **A6:** La población mayor define el ámbito de la especialidad.

### Medicina Física y Rehabilitación (`REHAB`)

- **Tipo:** MIR
- **Familia:** Médica
- **Estado:** active
- **Revisión:** draft
- **Descripción:** Diagnóstico y tratamiento de la discapacidad funcional, con programas de recuperación y adaptación.
- **Perfil:** A1:2, A2:1, A3:1, A4:4, A5:4, A8:2
- **Población:** Adultos, Personas mayores, Niños y adolescentes
- **Resultados:** Restaurar función y calidad de vida, Controlar una enfermedad crónica, Curar o resolver un episodio
- **Entornos:** Consulta / ambulatorio, Planta de hospitalización, Domicilio
- **Sistemas:** Musculoesquelético, Nervioso
- **Restricciones:** emotionalLoad:2, guards:1, predictability:4, flexibility:4, research:2
- **Alternativas:** Traumatología, Neurología, Geriatría
- **Fuente:** Perfil preliminar basado en práctica clínica general; revisión experta pendiente.

**Evidencia:**
- **A4:** Los programas de rehabilitación requieren seguimiento prolongado.
- **A7:** El objetivo principal es recuperar función.

### Angiología y Cirugía Vascular (`VASCULAR`)

- **Tipo:** MIR
- **Familia:** Quirúrgica
- **Estado:** active
- **Revisión:** draft
- **Descripción:** Tratamiento médico, quirúrgico y endovascular de las enfermedades de las arterias y venas.
- **Perfil:** A1:2, A2:4, A3:3, A4:2, A5:2, A8:2
- **Población:** Adultos, Personas mayores
- **Resultados:** Curar o resolver un episodio, Restaurar función y calidad de vida, Estabilizar una situación crítica
- **Entornos:** Quirófano / salas de procedimientos, Consulta / ambulatorio, Imagen
- **Sistemas:** Cardiovascular
- **Restricciones:** emotionalLoad:2, guards:3, predictability:3, flexibility:3, research:2
- **Alternativas:** Cirugía Cardiovascular, Radiodiagnóstico, Cirugía General
- **Fuente:** Perfil preliminar basado en práctica clínica general; revisión experta pendiente.

**Evidencia:**
- **A2:** Combina cirugía abierta y procedimientos endovasculares.
- **A3:** Maneja patología aguda y crónica.

### Cirugía Torácica (`THORACIC_SURGERY`)

- **Tipo:** MIR
- **Familia:** Quirúrgica
- **Estado:** active
- **Revisión:** draft
- **Descripción:** Intervenciones quirúrgicas sobre pulmón, pleura, mediastino y pared torácica.
- **Perfil:** A1:2, A2:4, A3:3, A4:2, A5:2, A8:1
- **Población:** Adultos
- **Resultados:** Curar o resolver un episodio, Restaurar función y calidad de vida, Estabilizar una situación crítica
- **Entornos:** Quirófano / salas de procedimientos, Planta de hospitalización
- **Sistemas:** Respiratorio
- **Restricciones:** emotionalLoad:3, guards:3, predictability:2, flexibility:2, research:2
- **Alternativas:** Neumología, Cirugía General, Medicina Intensiva
- **Fuente:** Perfil preliminar basado en práctica clínica general; revisión experta pendiente.

**Evidencia:**
- **A2:** El acto quirúrgico torácico es central.
- **A3:** Incluye cirugía urgente y programada.

### Cirugía Cardiovascular (`CARDIOVASCULAR_SURGERY`)

- **Tipo:** MIR
- **Familia:** Quirúrgica
- **Estado:** active
- **Revisión:** draft
- **Descripción:** Cirugía del corazón y de los grandes vasos, con procedimientos de alta complejidad y soporte circulatorio.
- **Perfil:** A1:2, A2:4, A3:4, A4:2, A5:2, A8:2
- **Población:** Adultos, Personas mayores
- **Resultados:** Curar o resolver un episodio, Estabilizar una situación crítica, Restaurar función y calidad de vida
- **Entornos:** Quirófano / salas de procedimientos, Planta de hospitalización, Urgencias / UCI
- **Sistemas:** Cardiovascular
- **Restricciones:** emotionalLoad:3, guards:4, predictability:1, flexibility:2, research:3
- **Alternativas:** Cardiología, Cirugía Vascular, Medicina Intensiva
- **Fuente:** Perfil preliminar basado en práctica clínica general; revisión experta pendiente.

**Evidencia:**
- **A2:** Cirugía cardiaca y de grandes vasos.
- **A3:** Alta exposición a urgencias y cirugía crítica.

### Cirugía Plástica, Estética y Reparadora (`PLASTIC_SURGERY`)

- **Tipo:** MIR
- **Familia:** Quirúrgica
- **Estado:** active
- **Revisión:** draft
- **Descripción:** Reconstrucción funcional y estética de tejidos, tras traumatismos, cirugía oncológica o malformaciones.
- **Perfil:** A1:2, A2:4, A3:2, A4:3, A5:3, A8:1
- **Población:** Adultos, Niños y adolescentes
- **Resultados:** Restaurar función y calidad de vida, Curar o resolver un episodio
- **Entornos:** Quirófano / salas de procedimientos, Consulta / ambulatorio
- **Sistemas:** Piel, Musculoesquelético
- **Restricciones:** emotionalLoad:2, guards:2, predictability:3, flexibility:4, research:2
- **Alternativas:** Dermatología, Cirugía Oral y Maxilofacial, Traumatología
- **Fuente:** Perfil preliminar basado en práctica clínica general; revisión experta pendiente.

**Evidencia:**
- **A2:** La técnica reconstructiva es central.
- **A7:** El objetivo es restaurar forma y función.

### Cirugía Oral y Maxilofacial (`MAXILLOFACIAL`)

- **Tipo:** MIR
- **Familia:** Quirúrgica
- **Estado:** active
- **Revisión:** draft
- **Descripción:** Tratamiento quirúrgico de la patología de la cara, boca, mandíbula y cuello.
- **Perfil:** A1:2, A2:4, A3:2, A4:3, A5:3, A8:0
- **Población:** Adultos, Niños y adolescentes
- **Resultados:** Restaurar función y calidad de vida, Curar o resolver un episodio
- **Entornos:** Quirófano / salas de procedimientos, Consulta / ambulatorio, Planta de hospitalización
- **Sistemas:** Musculoesquelético, Órganos de los sentidos
- **Restricciones:** emotionalLoad:2, guards:2, predictability:3, flexibility:3, research:2
- **Alternativas:** Cirugía Plástica, Otorrinolaringología, Cirugía General
- **Fuente:** Perfil preliminar basado en práctica clínica general; revisión experta pendiente.

**Evidencia:**
- **A2:** La cirugía maxilofacial es el núcleo.
- **A8:** La anatomía craneofacial es el contenido principal.

### Cirugía Pediátrica (`PAEDIATRIC_SURGERY`)

- **Tipo:** MIR
- **Familia:** Quirúrgica
- **Estado:** active
- **Revisión:** draft
- **Descripción:** Cirugía de las malformaciones y enfermedades quirúrgicas desde el periodo neonatal hasta la adolescencia.
- **Perfil:** A1:2, A2:4, A3:3, A4:4, A5:4, A8:1
- **Población:** Niños y adolescentes, Recién nacidos
- **Resultados:** Curar o resolver un episodio, Restaurar función y calidad de vida, Prevenir enfermedades
- **Entornos:** Quirófano / salas de procedimientos, Planta de hospitalización, Urgencias / UCI
- **Sistemas:** Digestivo, Varios sistemas
- **Restricciones:** emotionalLoad:3, guards:3, predictability:2, flexibility:3, research:2
- **Alternativas:** Pediatría, Neonatología, Cirugía General
- **Fuente:** Perfil preliminar basado en práctica clínica general; revisión experta pendiente.

**Evidencia:**
- **A2:** La cirugía pediátrica es central.
- **A6:** La población infantil y neonatal define la especialidad.

### Neurocirugía (`NEUROSURGERY`)

- **Tipo:** MIR
- **Familia:** Quirúrgica
- **Estado:** active
- **Revisión:** draft
- **Descripción:** Cirugía del sistema nervioso central y periférico, incluyendo patología tumoral, vascular y traumática.
- **Perfil:** A1:3, A2:4, A3:4, A4:3, A5:2, A8:2
- **Población:** Adultos, Niños y adolescentes
- **Resultados:** Curar o resolver un episodio, Estabilizar una situación crítica, Restaurar función y calidad de vida
- **Entornos:** Quirófano / salas de procedimientos, Planta de hospitalización, Urgencias / UCI
- **Sistemas:** Nervioso
- **Restricciones:** emotionalLoad:3, guards:4, predictability:1, flexibility:2, research:3
- **Alternativas:** Neurología, Medicina Intensiva, Traumatología
- **Fuente:** Perfil preliminar basado en práctica clínica general; revisión experta pendiente.

**Evidencia:**
- **A2:** La cirugía del sistema nervioso es el núcleo.
- **A3:** Alta exposición a urgencias neuroquirúrgicas.

### Medicina Nuclear (`NUCLEAR_MEDICINE`)

- **Tipo:** MIR
- **Familia:** Diagnóstica
- **Estado:** active
- **Revisión:** draft
- **Descripción:** Diagnóstico funcional y tratamiento con radiotrazadores, con una fuerte base tecnológica y molecular.
- **Perfil:** A1:4, A2:2, A3:1, A4:2, A5:1, A8:4
- **Población:** Adultos, Niños y adolescentes
- **Resultados:** Dar un diagnóstico preciso, Controlar una enfermedad crónica, Curar o resolver un episodio
- **Entornos:** Imagen, Laboratorio
- **Sistemas:** Varios sistemas
- **Restricciones:** emotionalLoad:1, guards:1, predictability:4, flexibility:3, research:4
- **Alternativas:** Radiodiagnóstico, Oncología Médica, Endocrinología
- **Fuente:** Perfil preliminar basado en práctica clínica general; revisión experta pendiente.

**Evidencia:**
- **A8:** Biología molecular y radiotrazadores.
- **A5:** El contacto clínico directo es limitado.

### Microbiología Clínica (`MICROBIOLOGY`)

- **Tipo:** MIR
- **Familia:** Diagnóstica
- **Estado:** active
- **Revisión:** draft
- **Descripción:** Identificación de agentes infecciosos, resistencias y diagnóstico microbiológico para guiar el tratamiento.
- **Perfil:** A1:4, A2:1, A3:2, A4:2, A5:0, A8:4
- **Población:** Todas las edades
- **Resultados:** Dar un diagnóstico preciso, Prevenir enfermedades
- **Entornos:** Laboratorio
- **Sistemas:** Inmunitario
- **Restricciones:** emotionalLoad:1, guards:1, predictability:4, flexibility:4, research:4
- **Alternativas:** Enfermedades Infecciosas, Inmunología, Anatomía Patológica
- **Fuente:** Perfil preliminar basado en práctica clínica general; revisión experta pendiente.

**Evidencia:**
- **A8:** Microbiología y biología molecular.
- **A5:** Trabajo de laboratorio con contacto clínico mínimo.

### Inmunología (`IMMUNOLOGY`)

- **Tipo:** MIR
- **Familia:** Diagnóstica
- **Estado:** active
- **Revisión:** draft
- **Descripción:** Estudio del sistema inmunitario, diagnóstico de inmunodeficiencias y apoyo a trasplantes y enfermedades autoinmunes.
- **Perfil:** A1:4, A2:1, A3:1, A4:3, A5:1, A8:4
- **Población:** Adultos, Niños y adolescentes
- **Resultados:** Dar un diagnóstico preciso, Controlar una enfermedad crónica, Curar o resolver un episodio
- **Entornos:** Laboratorio, Consulta / ambulatorio
- **Sistemas:** Inmunitario
- **Restricciones:** emotionalLoad:2, guards:1, predictability:4, flexibility:4, research:4
- **Alternativas:** Alergología, Reumatología, Anatomía Patológica
- **Fuente:** Perfil preliminar basado en práctica clínica general; revisión experta pendiente.

**Evidencia:**
- **A8:** Mecanismos inmunológicos y moleculares.
- **A1:** Razonamiento diagnóstico complejo.

### Genética Clínica (`GENETICS`)

- **Tipo:** ACE
- **Familia:** Diagnóstica
- **Estado:** active
- **Revisión:** draft
- **Descripción:** Diagnóstico, asesoramiento y seguimiento de enfermedades hereditarias y anomalías genéticas.
- **Perfil:** A1:4, A2:0, A3:1, A4:3, A5:3, A8:4
- **Población:** Niños y adolescentes, Adultos, Embarazo y salud de la mujer
- **Resultados:** Dar un diagnóstico preciso, Prevenir enfermedades, Generar conocimiento
- **Entornos:** Consulta / ambulatorio, Laboratorio
- **Sistemas:** Varios sistemas
- **Restricciones:** emotionalLoad:3, guards:1, predictability:4, flexibility:4, research:4
- **Alternativas:** Pediatría, Oncología Médica, Anatomía Patológica
- **Fuente:** Perfil preliminar basado en práctica clínica general; revisión experta pendiente.

**Evidencia:**
- **A8:** Genética y biología molecular.
- **A4:** Seguimiento y asesoramiento longitudinal.

### Neurofisiología Clínica (`NEUROPHYSIOLOGY`)

- **Tipo:** MIR
- **Familia:** Diagnóstica
- **Estado:** active
- **Revisión:** draft
- **Descripción:** Diagnóstico funcional del sistema nervioso mediante electroencefalografía, electromiografía y potenciales evocados.
- **Perfil:** A1:4, A2:1, A3:1, A4:1, A5:1, A8:3
- **Población:** Adultos, Niños y adolescentes
- **Resultados:** Dar un diagnóstico preciso
- **Entornos:** Laboratorio, Consulta / ambulatorio
- **Sistemas:** Nervioso
- **Restricciones:** emotionalLoad:1, guards:1, predictability:4, flexibility:4, research:3
- **Alternativas:** Neurología, Neurocirugía, Psiquiatría
- **Fuente:** Perfil preliminar basado en práctica clínica general; revisión experta pendiente.

**Evidencia:**
- **A8:** Registros electrofisiológicos y función neuronal.
- **A1:** Interpretación diagnóstica especializada.

### Medicina Preventiva y Salud Pública (`PREVENTIVE`)

- **Tipo:** MIR
- **Familia:** Transversal
- **Estado:** active
- **Revisión:** draft
- **Descripción:** Promoción de la salud, prevención de enfermedades y planificación sanitaria a nivel poblacional.
- **Perfil:** A1:4, A2:1, A3:2, A4:1, A5:1, A8:4
- **Población:** Todas las edades
- **Resultados:** Prevenir enfermedades, Dar un diagnóstico preciso, Controlar una enfermedad crónica
- **Entornos:** Consulta / ambulatorio, Planta de hospitalización
- **Sistemas:** Varios sistemas
- **Restricciones:** emotionalLoad:2, guards:2, predictability:4, flexibility:4, research:4
- **Alternativas:** Medicina Familiar, Enfermedades Infecciosas, Medicina del Trabajo
- **Fuente:** Perfil preliminar basado en práctica clínica general; revisión experta pendiente.

**Evidencia:**
- **A7:** El resultado principal es prevención y salud poblacional.
- **A8:** Epidemiología y salud pública.

### Medicina del Trabajo (`OCCUPATIONAL`)

- **Tipo:** MIR
- **Familia:** Transversal
- **Estado:** active
- **Revisión:** draft
- **Descripción:** Valoración de la salud de los trabajadores, prevención de riesgos laborales y adaptación del puesto.
- **Perfil:** A1:3, A2:0, A3:1, A4:1, A5:2, A8:1
- **Población:** Adultos
- **Resultados:** Prevenir enfermedades, Controlar una enfermedad crónica, Restaurar función y calidad de vida
- **Entornos:** Consulta / ambulatorio, Domicilio
- **Sistemas:** Varios sistemas
- **Restricciones:** emotionalLoad:2, guards:2, predictability:4, flexibility:4, research:3
- **Alternativas:** Medicina Familiar, Rehabilitación, Medicina Preventiva
- **Fuente:** Perfil preliminar basado en práctica clínica general; revisión experta pendiente.

**Evidencia:**
- **A7:** Prevención y adaptación funcional.
- **A4:** Valoración periódica de la aptitud laboral.

### Medicina Legal y Forense (`LEGAL_MEDICINE`)

- **Tipo:** MIR
- **Familia:** Transversal
- **Estado:** active
- **Revisión:** draft
- **Descripción:** Aplicación del conocimiento médico a la práctica judicial, la peritación y la investigación forense.
- **Perfil:** A1:4, A2:1, A3:1, A4:0, A5:0, A8:3
- **Población:** Todas las edades
- **Resultados:** Dar un diagnóstico preciso, Generar conocimiento
- **Entornos:** Laboratorio, Consulta / ambulatorio
- **Sistemas:** Varios sistemas
- **Restricciones:** emotionalLoad:3, guards:2, predictability:4, flexibility:3, research:4
- **Alternativas:** Anatomía Patológica, Toxicología Clínica, Medicina Preventiva
- **Fuente:** Perfil preliminar basado en práctica clínica general; revisión experta pendiente.

**Evidencia:**
- **A1:** Razonamiento médico aplicado a la peritación.
- **A8:** Toxicología y ciencias forenses.

### Farmacología Clínica (`PHARMACOLOGY`)

- **Tipo:** MIR
- **Familia:** Transversal
- **Estado:** active
- **Revisión:** draft
- **Descripción:** Uso seguro y eficiente de los medicamentos, farmacovigilancia y evaluación de la terapéutica.
- **Perfil:** A1:3, A2:1, A3:1, A4:1, A5:1, A8:4
- **Población:** Adultos, Personas mayores
- **Resultados:** Generar conocimiento, Controlar una enfermedad crónica
- **Entornos:** Laboratorio, Consulta / ambulatorio
- **Sistemas:** Varios sistemas
- **Restricciones:** emotionalLoad:1, guards:1, predictability:4, flexibility:4, research:4
- **Alternativas:** Medicina Interna, Investigación Biomédica, Medicina Preventiva
- **Fuente:** Perfil preliminar basado en práctica clínica general; revisión experta pendiente.

**Evidencia:**
- **A8:** Farmacología y mecanismos moleculares.
- **A4:** Evaluación de la terapéutica y farmacovigilancia.

### Medicina de la Educación Física y del Deporte (`SPORTS_MEDICINE`)

- **Tipo:** MIR
- **Familia:** Transversal
- **Estado:** active
- **Revisión:** draft
- **Descripción:** Atención al deportista, prevención de lesiones, recuperación funcional y valoración del rendimiento.
- **Perfil:** A1:2, A2:2, A3:2, A4:4, A5:4, A8:3
- **Población:** Adultos, Niños y adolescentes
- **Resultados:** Restaurar función y calidad de vida, Prevenir enfermedades, Curar o resolver un episodio
- **Entornos:** Consulta / ambulatorio, Domicilio
- **Sistemas:** Musculoesquelético
- **Restricciones:** emotionalLoad:2, guards:2, predictability:3, flexibility:4, research:3
- **Alternativas:** Traumatología, Rehabilitación, Endocrinología
- **Fuente:** Perfil preliminar basado en práctica clínica general; revisión experta pendiente.

**Evidencia:**
- **A7:** El objetivo es función, prevención y rendimiento.
- **A4:** Seguimiento longitudinal del deportista.

### Investigación Biomédica (`RESEARCH`)

- **Tipo:** AREA
- **Familia:** Transversal
- **Estado:** active
- **Revisión:** draft
- **Descripción:** Generación de conocimiento biomédico y traslación de hallazgos a la práctica clínica.
- **Perfil:** A1:4, A2:0, A3:1, A4:1, A5:0, A8:4
- **Población:** Todas las edades
- **Resultados:** Generar conocimiento, Dar un diagnóstico preciso
- **Entornos:** Laboratorio
- **Sistemas:** Varios sistemas
- **Restricciones:** emotionalLoad:1, guards:1, predictability:4, flexibility:4, research:4
- **Alternativas:** Farmacología Clínica, Anatomía Patológica, Genética Clínica
- **Fuente:** Perfil preliminar basado en práctica clínica general; revisión experta pendiente.

**Evidencia:**
- **A8:** Mecanismos biológicos y metodología científica.
- **A5:** Contacto clínico directo mínimo.

### Toxicología Clínica (`TOXICOLOGY`)

- **Tipo:** ACE
- **Familia:** Transversal
- **Estado:** active
- **Revisión:** draft
- **Descripción:** Diagnóstico y tratamiento de intoxicaciones y efectos adversos de sustancias químicas.
- **Perfil:** A1:3, A2:1, A3:3, A4:1, A5:1, A8:3
- **Población:** Adultos, Personas mayores
- **Resultados:** Estabilizar una situación crítica, Curar o resolver un episodio, Dar un diagnóstico preciso
- **Entornos:** Urgencias / UCI, Laboratorio
- **Sistemas:** Varios sistemas
- **Restricciones:** emotionalLoad:3, guards:3, predictability:3, flexibility:3, research:3
- **Alternativas:** Medicina de Urgencias, Farmacología Clínica, Medicina Legal
- **Fuente:** Perfil preliminar basado en práctica clínica general; revisión experta pendiente.

**Evidencia:**
- **A3:** Atención a intoxicaciones agudas.
- **A8:** Farmacología y toxicología.

### Neonatología (`NEONATOLOGY`)

- **Tipo:** ACE
- **Familia:** Pediátrica
- **Estado:** active
- **Revisión:** draft
- **Descripción:** Cuidado del recién nacido sano y del neonato prematuro o enfermo, incluyendo soporte vital y seguimiento del desarrollo.
- **Perfil:** A1:3, A2:2, A3:4, A4:3, A5:4, A8:3
- **Población:** Recién nacidos
- **Resultados:** Estabilizar una situación crítica, Curar o resolver un episodio, Restaurar función y calidad de vida, Prevenir enfermedades
- **Entornos:** Planta de hospitalización, Urgencias / UCI
- **Sistemas:** Varios sistemas
- **Restricciones:** emotionalLoad:4, guards:4, predictability:1, flexibility:2, research:3
- **Alternativas:** Pediatría, Cirugía Pediátrica, Medicina Intensiva
- **Fuente:** Perfil preliminar basado en práctica clínica general; revisión experta pendiente.

**Evidencia:**
- **A6:** La población neonatal define la especialidad.
- **A3:** Alta exposición a urgencias y soporte vital.

### Psiquiatría Infantil y de la Adolescencia (`CHILD_PSYCHIATRY`)

- **Tipo:** ACE
- **Familia:** Salud mental
- **Estado:** active
- **Revisión:** draft
- **Descripción:** Evaluación y tratamiento de los trastornos mentales en la infancia y la adolescencia, con trabajo con la familia y el entorno escolar.
- **Perfil:** A1:3, A2:0, A3:2, A4:4, A5:4, A8:2
- **Población:** Niños y adolescentes
- **Resultados:** Controlar una enfermedad crónica, Restaurar función y calidad de vida, Curar o resolver un episodio, Prevenir enfermedades
- **Entornos:** Consulta / ambulatorio, Planta de hospitalización
- **Sistemas:** Salud mental
- **Restricciones:** emotionalLoad:4, guards:2, predictability:3, flexibility:4, research:3
- **Alternativas:** Psiquiatría, Pediatría, Neurología
- **Fuente:** Perfil preliminar basado en práctica clínica general; revisión experta pendiente.

**Evidencia:**
- **A6:** La población infantojuvenil define la especialidad.
- **A4:** Seguimiento longitudinal del desarrollo.
