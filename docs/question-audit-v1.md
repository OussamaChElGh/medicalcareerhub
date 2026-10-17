# Auditoría del banco de preguntas v1

## Estado auditado

- Test gratuito: 14 ítems.
- Bloque central: 18 ítems.
- Banco de desempate: 36 ítems (4 por eje, incluido A10).
- Recorrido completo: 40–44 ítems, reutilizando las 14 respuestas gratuitas y 8–12 de desempate adaptativo.
- Herramienta: `npm run audit:questions`.

Cobertura de ejes con discriminación ≥ 1 punto:

| Bloque | A1 | A2 | A3 | A4 | A5 | A8 |
|---|---:|---:|---:|---:|---:|---:|
| Gratuito | 6 | 5 | 5 | 5 | 5 | 6 |
| Central | 8 | 5 | 5 | 5 | 9 | 5 |
| Desempate | 22 | 12 | 7 | 13 | 16 | 11 |

A10 Sistemas se mide con Q13/Q14 en el gratuito y con 4 ítems en el banco de desempate (procedimiento, entorno, trayectoria y rechazo).

## Hallazgos críticos y resolución

### 1. Los componentes de match pesaban demasiado

**Problema:** población, resultado y entorno sumaban el 40 % de la afinidad con una sola pregunta cada uno. Además, `all` concedía coincidencia perfecta en población.

**Resolución aplicada:**
- Peso numérico: 70 %.
- Población: 10 %.
- Resultado: 10 %.
- Entorno: 10 %.
- `all` pasa a ser coincidencia parcial: 0,6 si ambos son universales, 0,75 si la especialidad cubre todas las edades y 0,45 si el usuario elige “todas”.
- Se añadieron tres ítems de match al bloque central:
  - `e14_population`.
  - `e17_outcome`.
  - `e18_environment`.

### 2. El banco de desempate era demasiado pequeño

**Problema:** dos ítems por eje, siempre seleccionados los dos, sin variedad. `ba8_reading` no discriminaba A8.

**Resolución aplicada:**
- `ba8_reading` ahora puntúa A8 en las cuatro opciones (rango 1–4).
- `ba4_satisfaction` ahora puntúa A4 en las cuatro opciones.
- Se añadieron 16 ítems nuevos y el banco quedó completo con 32 ítems: 4 por eje (A1–A5, A8, C1 y C2).
- El selector elige 2 ítems por eje y ordena los candidatos según su cercanía al perfil del usuario y su rango de discriminación.
- Se diferenció Traumatología (A1 2, A8 2) de Cirugía (A1 1, A8 0) para que el desempate no sea una copia exacta.

### 3. Q4 estaba desequilibrada

**Problema:** los totales de las opciones eran 13/9/15/11; “acompañar al paciente” concentraba la deseabilidad social.

**Resolución aplicada:** se reequilibraron las puntuaciones a 12/10/12/11 y se redujo el sesgo hacia la opción de continuidad.

### 4. Faltaba medir rechazo

**Problema:** solo Q4 tenía una elección “menos”.

**Resolución aplicada:** `e10_rejection_activities` sustituye a `e10_exhaustion` y añade un maxdiff de rechazo sobre actividades.

### 5. Solapamientos en el bloque central

**Problema:** `e14`, `e17` y `e18` repetían información de Q1, Q3 y Q5.

**Resolución aplicada:** se sustituyeron por los tres ítems de match, manteniendo 18 ítems centrales y 40–44 en el recorrido completo.

## Modelo A10 y precisión

Se añadió la dimensión **A10 Sistemas** para diferenciar especialidades que comparten estilo de trabajo pero no contenido médico:

- 14 preguntas gratuitas: Q13 (sistemas, multiselección) y Q14 (modalidad diagnóstica).
- 4 ítems A10 en el banco de desempate: procedimiento, entorno, trayectoria y rechazo.
- El test extensivo pasa a 40–44 ítems: 14 gratuitos + 18 centrales + 8–12 de desempate adaptativo.
- Pesos de afinidad: 65 % numérico, 8 % población, 9 % resultado, 8 % entorno, 10 % sistemas.
- Un sistema rechazado resta hasta un 50 % al `systemFit`.

Resultado: las 51 especialidades entran en el top 5 con perfiles coherentes. La prueba de alcanzabilidad usa selección por distancia al perfil, no producto de puntos; eso corrige el falso negativo de Intensiva.

## Verificación

- `npm run audit:questions`: OK.
- `npm run verify:scoring`: OK.
- `npm run verify:extensive`: OK.
- `npm run verify:catalog`: OK.
- Confianza del recorrido: 89,3 % → 100 %.
- El desempate quirúrgico se mantiene entre Cirugía y Traumatología.
- El test dirigido hacia cada especialidad mueve la ventaja en la dirección esperada.
- La estabilidad del primer puesto en el test extensivo es del 97 % en la última simulación.
- La estabilidad del test gratuito se mide ahora con el arnés determinista de 10 personas; ver el estado actualizado al final.

## Catálogo 51

El catálogo se amplió a 51 fichas: 45 MIR, 4 ACE y 2 áreas. Las 39 fichas nuevas están marcadas como `draft` hasta revisión experta. El detalle está en `docs/catalog-51.md` y se comprueba con `npm run verify:catalog`.

## Calibración del catálogo

Se ajustaron los perfiles que concentraban el ranking y los que quedaban tapados:

- **Farmacología:** se retiró `all` de población y se redujeron los resultados a `knowledge` y `chronic`.
- **Toxicología:** se retiró `all` de población.
- **Urgencias:** poblaciones explícitas y sin `cure`; se redujo su dominancia.
- **Hematología:** A2 3; se añadieron `palliative` y `emergency`.
- **Nefrología:** A2 3; se añadieron `stabilize`, `lab` y `emergency`.
- **Oncología:** se añadieron `diagnosis`, `lab` y `emergency`.
- **Cardiología:** se añadieron `prevention`, `function` e `imaging`.

Resultados:

- El máximo de primeras posiciones en perfiles aleatorios es **11,2 %** (Medicina Familiar).
- Farmacología: 7,5 %; Toxicología: 8,2 %; Urgencias: 9,2 %.
- Con perfiles coherentes: **51/51 en top 5** y **51/51 en top 10**.
- Hematología, Cardiología, Nefrología e Intensiva están en el top 5.
- La mejora de Intensiva no vino de cambiar su perfil, sino de corregir el generador de perfiles de prueba.

Conclusión: con perfiles coherentes, las 51 son alcanzables. En perfiles ambiguos o aleatorios, el test gratuito sigue siendo un cribado.

## Pendiente para la siguiente iteración

1. Validación clínica formal de las 51 fichas, si se decide hacerla; la beta no la exige.
2. Mantener y documentar la estabilidad del test gratuito con el arnés determinista; sigue siendo un cribado, no un ranking definitivo.
3. Ajustar pesos con datos, no con intuición.
4. Revisar si alguna pareja de especialidades sigue siendo indistinguible y necesita perfiles más diferenciados.
5. Validar con estudiantes o residentes cuando sea posible.

## Criterios de aceptación

- Ningún ítem con el eje objetivo sin discriminación.
- Cada eje numérico con al menos 3 ítems útiles en el recorrido completo.
- Cada dimensión de match con al menos 2 ítems.
- Top 1 del test extensivo estable ante un cambio de respuesta en ≥ 85 % de los casos.
- El test gratuito se considera cribado: con 51 especialidades su estabilidad puede ser menor.
- Alcanzabilidad coherente: 51/51 en top 5 y 51/51 en top 10.
- Sin especialidad con ventaja estructural superior al 35 % en perfiles aleatorios.
- Tiempo de realización inferior a 15 minutos.

## Estado tras la revisión documental y el arnés de estabilidad

- Evidencia numérica: 0 valores ≥3 sin justificación (82 huecos cerrados).
- Estado del catálogo: 51 fichas en `draft`; sin validación clínica formal.
- Arnés determinista: 10 personas, 14 preguntas, escenarios de cambio cercano y aleatorio.
- Cambio cercano: top 1 80,7 %, top 3 86,0 %, top 5 87,6 %.
- Cambio aleatorio: top 1 80,7 %, top 3 82,4 %, top 5 86,9 %.
- Criterio de aceptación del gratuito: top 1 ≥80 %, top 3 ≥85 %, top 5 ≥85 % con cambio cercano; el escenario aleatorio se informa como prueba de estrés.
- La persona ambigua sigue siendo inestable por diseño; el producto debe comunicar duelo/confianza baja, no una certeza que no existe.
- Pendiente: firma de revisor clínico, evidencia específica de las restricciones laborales y validación con estudiantes/residentes.
