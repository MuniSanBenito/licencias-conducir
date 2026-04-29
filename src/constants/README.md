# Constantes del dominio

Este directorio centraliza la fuente de verdad para valores estaticos de negocio y configuraciones compartidas.

## Reglas

1. Todo enum de dominio debe vivir en `src/constants`.
2. Definir siempre el objeto canonico en SNAKE_CASE y derivar el tipo desde ese objeto.
3. Los labels deben salir de `Record<Tipo, string>` en este directorio.
4. Si una coleccion de Payload necesita `options`, deben generarse desde las constantes de este directorio.
5. Evitar strings magicos en UI, seeds y filtros. Consumir siempre constantes.
6. Para `className` dinamicos, consumir mapeos de constantes y componer con `twJoin` o `twMerge`.

## Estructura recomendada

- `clases.ts`: clases de licencia y defaults de clase.
- `turnos.ts`: tipos, estados, labels, opciones y mapeos visuales de turnos.
- `fechas.ts`: formatos de fecha compartidos.

## Checklist rapido para nuevos catálogos

1. Crear objeto canonico (`ESTADO_X`, `TIPO_X`, etc.).
2. Exportar tipo derivado (`type EstadoX = ...`).
3. Exportar labels (`ESTADO_X_LABELS`).
4. Exportar lista ordenada (`ESTADOS_X`).
5. Exportar opciones (`OPCIONES_ESTADO_X`) si Payload/UI lo necesita.
6. Reemplazar literales en UI, payload, seeds y queries.
