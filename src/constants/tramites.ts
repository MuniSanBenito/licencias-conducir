export type TipoTramite = 'nueva' | 'renovacion' | 'ampliacion'

export type EstadoPaso = 'pendiente' | 'en_curso' | 'completado'

export type EstadoTramite = 'en_curso' | 'completado' | 'cancelado'

export type EstadoTurno = 'programado' | 'confirmado' | 'ausente' | 'completado' | 'cancelado'

// ─── Pasos del trámite ───

export const PASO_ID = {
  MESA_ENTRADAS: 'mesa_entradas',
  AREA_LICENCIAS: 'area_licencias',
  PAGO: 'pago',
  REVISION_LICENCIAS: 'revision_licencias',
  TURNO_CURSO: 'turno_curso',
  EXAMEN_TEORICO: 'examen_teorico',
  EXAMEN_PRACTICO: 'examen_practico',
  EXAMEN_PSICOFISICO: 'examen_psicofisico',
  EMISION: 'emision',
} as const

export type PasoId = (typeof PASO_ID)[keyof typeof PASO_ID]

export const PASO_LABELS: Record<PasoId, string> = {
  mesa_entradas: 'Mesa de Entradas',
  area_licencias: 'Área de Licencias',
  pago: 'Pago',
  revision_licencias: 'Revisión Licencias',
  turno_curso: 'Turno Curso',
  examen_teorico: 'Examen Teórico',
  examen_practico: 'Examen Práctico',
  examen_psicofisico: 'Examen Psicofísico',
  emision: 'Emisión de Licencia',
}

/**
 * Matriz de pasos requeridos por tipo de trámite.
 * true = el paso es requerido para ese tipo.
 */
export const PASOS_POR_TIPO: Record<TipoTramite, Record<PasoId, boolean>> = {
  nueva: {
    mesa_entradas: true,
    area_licencias: true,
    pago: true,
    revision_licencias: true,
    turno_curso: true,
    examen_teorico: true,
    examen_practico: true,
    examen_psicofisico: true,
    emision: true,
  },
  renovacion: {
    mesa_entradas: true,
    area_licencias: true,
    pago: true,
    revision_licencias: true,
    turno_curso: false,
    examen_teorico: false,
    examen_practico: false,
    examen_psicofisico: true,
    emision: true,
  },
  ampliacion: {
    mesa_entradas: true,
    area_licencias: true,
    pago: true,
    revision_licencias: true,
    turno_curso: true,
    examen_teorico: true,
    examen_practico: true,
    examen_psicofisico: true,
    emision: true,
  },
}

/** Orden canónico de los pasos */
export const ORDEN_PASOS: PasoId[] = [
  'mesa_entradas',
  'area_licencias',
  'pago',
  'revision_licencias',
  'turno_curso',
  'examen_teorico',
  'examen_practico',
  'examen_psicofisico',
  'emision',
]

/**
 * Pasos que requieren asignación de turno.
 * Extensible: si mañana mesa_entradas o pago necesitan turno,
 * solo se agrega acá.
 */
export const PASOS_CON_TURNO: Set<PasoId> = new Set([
  'turno_curso',
  'examen_teorico',
  'examen_practico',
  'examen_psicofisico',
])

export const TIPO_TRAMITE_LABELS: Record<TipoTramite, string> = {
  nueva: 'Nueva',
  renovacion: 'Renovación',
  ampliacion: 'Ampliación',
}
