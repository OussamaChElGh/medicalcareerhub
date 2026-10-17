# Protocolo de piloto v1

## Objetivo

Comprobar si el banco de preguntas discrimina perfiles, si el resultado es comprensible y si el test extensivo aporta valor frente al gratuito. No se busca demostrar validez psicométrica completa en esta fase.

## Participantes

- Mínimo: 10 estudiantes de Medicina o residentes.
- Recomendado: 30–50 para poder interpretar distribuciones e ítems.
- Perfiles: al menos 3 cursos distintos y 3 especialidades ya decididas.
- Excluir a quienes hayan participado en el diseño del test.

## Consentimiento y privacidad

- Participación voluntaria y anónima.
- No se recoge nombre, email ni IP.
- Se guarda un identificador aleatorio, la fecha, las respuestas, el perfil y el resultado.
- Los datos se usan solo para mejorar el test.
- El participante puede borrar sus datos locales antes de exportarlos.

## Procedimiento

1. Abrir `/?v2=1`.
2. Completar el test gratuito.
3. Revisar el resultado y valorar del 1 al 5:
   - claridad de las preguntas;
   - utilidad del resultado;
   - sensación de que el perfil le representa;
   - intención de hacer el test extensivo.
4. Hacer el test extensivo.
5. Valorar de nuevo:
   - si el desempate le ha ayudado;
   - si el resultado extensivo es más útil que el gratuito;
   - tiempo percibido.
6. Exportar las sesiones con el botón de piloto del encabezado.

## Métricas que se analizarán

- Tiempo por modo.
- Distribución de respuestas por opción.
- Opciones muertas o elegidas por más del 80 %.
- Tasa de “No lo sé”.
- Correlación ítem-perfil.
- Distribución del top 1 y del top 5.
- Confianza gratuita vs extensiva.
- Estabilidad del top 1 con una respuesta cambiada.
- Comentarios cualitativos.

## Análisis

```bash
npm run analyze:pilot -- data/pilot-sessions.json
```

El script genera un informe en `docs/pilot-report.md` si se añade `--write`.

## Criterios de éxito iniciales

- El 80 % de los participantes entiende las preguntas sin ayuda.
- El 70 % siente que el perfil le representa bastante o mucho.
- El test extensivo sube la confianza en al menos el 80 % de los casos.
- Ninguna opción queda muerta en ítems con 10 o más respuestas.
- Ningún ítem concentra más del 80 % de las respuestas en una sola opción.
- El top 1 se mantiene estable ante un cambio de respuesta en al menos el 85 % de los casos.
- Tiempo total inferior a 15 minutos.

## Limitaciones

- Muestra pequeña y de conveniencia.
- No permite afirmar validez psicométrica.
- Los perfiles de especialidades son una primera versión.
- Los resultados pueden variar por país, hospital y modelo de formación.
- No sustituye una revisión por un panel de especialistas.

## Siguiente paso tras el piloto

1. Revisar los ítems marcados como problemáticos.
2. Ajustar los perfiles de las especialidades con revisión experta.
3. Repetir el piloto con una muestra mayor.
4. Solo entonces plantear el test como herramienta validada.
