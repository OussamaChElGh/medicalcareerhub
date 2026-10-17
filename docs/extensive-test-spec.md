# Test extensivo v1 — especificación

## Objetivo

Resolver el desempate del resultado gratuito y aumentar la confianza del perfil sin repetir las 14 preguntas iniciales. El test extensivo no es un cuestionario distinto: es una continuación del gratuito.

## Estructura

| Bloque | Ítems nuevos | Función |
|---|---:|---|
| Central | 18 | Reforzar los 9 ejes con una segunda medición. |
| Desempate | 8–12 seleccionados de un banco de 36 (4 por eje, incluido A10) | Discriminar entre el top 1 y el top 2. |
| Total nuevo | 26–30 | Se suman a las 14 respuestas gratuitas. |
| Total respondido | 40–44 | Unos 10–15 minutos. |

Las respuestas gratuitas se reutilizan. El usuario no vuelve a contestar las 14 preguntas. La rama es adaptativa: 8 ítems si la confianza es alta y el duelo está claro; 10 si es media; 12 si es baja o el primer puesto está muy disputado.

## Reparto del bloque central

| Eje | Ítems nuevos |
|---|---:|
| A1 Estilo cognitivo | 1 |
| A2 Procedimientos | 2 |
| A3 Ritmo | 2 |
| A4 Continuidad | 2 |
| A5 Contacto | 2 |
| A8 Contenido científico | 3 |
| C1 Tolerancia emocional | 1 |
| C2 Condiciones laborales | 2 |
| A6 Población | 1 |
| A7 Resultado | 1 |
| A9 Entorno | 1 |
| A10 Sistemas | 0 en el central; 2 en el desempate |

El bloque central incluye además un ítem de rechazo (`maxdiff`) y tres ítems de refuerzo de población, resultado y entorno. A10 se refuerza con cuatro ítems en el banco de desempate: procedimiento, entorno, trayectoria y rechazo.

## Selección de los ítems de desempate

1. Se parte de `duel.decisiveAxes` del resultado gratuito.
2. Si hay menos de 4 ejes, se completan con los ejes donde más difieren los perfiles del top 1 y el top 2, incluido A10 cuando los sistemas difieren.
3. Si el duelo es un empate exacto, se usan los ejes con mayor diferencia entre las dos especialidades.
4. Para cada eje se seleccionan 2 ítems de una batería de 4. A10 dispone de 4 ítems propios.
5. Los candidatos se ordenan por cercanía al valor del usuario en ese eje y por rango de discriminación.
6. La selección es determinista: el mismo perfil produce el mismo test.
7. Los ítems de desempate pesan 2,0 en el cálculo; los centrales, 1,0.

No se repite ningún ítem del test gratuito.

## Scoring

- Cada ítem declara `weight` (1,0 central; 2,0 desempate).
- Las observaciones se agregan con media ponderada por dimensión.
- Pesos de afinidad: 65 % ejes numéricos, 8 % población, 9 % resultado, 8 % entorno, 10 % sistemas.
- `all` en población y `multisystem` en sistemas no son coincidencias perfectas: se tratan como cobertura parcial.
- Un sistema rechazado en el desempate resta hasta un 50 % al `systemFit`.
- `answeredCount` se guarda en el perfil para estimar la amplitud del test.
- La confianza combina:
  - cobertura de dimensiones numéricas,
  - cobertura de preguntas categóricas (población, resultado, entorno y sistemas),
  - amplitud (`answeredCount / 30`).
- La cobertura extensiva debe ser completa y la confianza no puede ser menor que la gratuita.
- Con 51 especialidades, el test gratuito es un cribado: es esperable que su confianza sea media o baja. El test extensivo añade cobertura y comparación, no una certeza absoluta.

## Reglas de aceptación

- Ningún ítem repetido entre gratuito y extensivo.
- Todos los ejes con al menos 2 ítems con discriminación ≥ 1 en el recorrido completo.
- Los ítems de desempate pertenecen a los ejes calculados.
- El desempate responde al perfil de cada una de las dos especialidades.
- El top 1 extensivo es estable ante un cambio de respuesta en al menos el 85 % de los casos.
- Alcanzabilidad coherente: 51/51 en top 5 y 51/51 en top 10.
- Todas las especialidades activas siguen siendo alcanzables.
- El resultado extensivo no introduce sesgo estructural.
- Tiempo estimado inferior a 15 minutos.
- `npm run audit:questions` sin incidencias críticas.
- `npm run verify:catalog` sin incidencias críticas con las 51 fichas.

## Archivos

```
src/data/questions.extensive.ts   # 18 ítems centrales + 36 de desempate
src/lib/branching.ts              # selección de ramas
src/lib/scoring.ts                # pesos, answeredCount y confianza
scripts/audit-questions.ts        # auditoría de cobertura y discriminación
scripts/verify-extensive.ts       # pruebas del flujo completo
docs/question-audit-v1.md         # hallazgos y cambios aplicados
```

## Fuera de alcance de esta fase

- Revisión experta de los 39 perfiles en `draft`.
- Pago y entitlement.
- Traducción al inglés.
- Generación de imágenes de las Casas.
