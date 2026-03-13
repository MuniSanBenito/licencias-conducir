type SelectOption<T extends string> = {
  label: string
  value: T
}

function buildSelectOptions<T extends string>(
  values: readonly T[],
  labels: Record<T, string>,
): SelectOption<T>[] {
  const options: SelectOption<T>[] = []

  for (const value of values) {
    options.push({
      label: labels[value],
      value,
    })
  }

  return options
}

export const TIPO_TRAMITE = {
  NUEVA: 'nueva',
  RENOVACION: 'renovacion',
  AMPLIACION: 'ampliacion',
} as const

export type TipoTramite = (typeof TIPO_TRAMITE)[keyof typeof TIPO_TRAMITE]

export const ESTADO_PASO = {
  PENDIENTE: 'pendiente',
  EN_CURSO: 'en_curso',
  COMPLETADO: 'completado',
} as const

export type EstadoPaso = (typeof ESTADO_PASO)[keyof typeof ESTADO_PASO]

export const ESTADO_TRAMITE = {
  EN_CURSO: 'en_curso',
  COMPLETADO: 'completado',
  CANCELADO: 'cancelado',
} as const

export type EstadoTramite = (typeof ESTADO_TRAMITE)[keyof typeof ESTADO_TRAMITE]

export const ESTADO_TURNO = {
  PROGRAMADO: 'programado',
  CONFIRMADO: 'confirmado',
  AUSENTE: 'ausente',
  COMPLETADO: 'completado',
  CANCELADO: 'cancelado',
} as const

export type EstadoTurno = (typeof ESTADO_TURNO)[keyof typeof ESTADO_TURNO]

export const TIPOS_TRAMITE: TipoTramite[] = [
  TIPO_TRAMITE.NUEVA,
  TIPO_TRAMITE.RENOVACION,
  TIPO_TRAMITE.AMPLIACION,
]

export const ESTADOS_PASO: EstadoPaso[] = [
  ESTADO_PASO.PENDIENTE,
  ESTADO_PASO.EN_CURSO,
  ESTADO_PASO.COMPLETADO,
]

export const ESTADOS_TRAMITE: EstadoTramite[] = [
  ESTADO_TRAMITE.EN_CURSO,
  ESTADO_TRAMITE.COMPLETADO,
  ESTADO_TRAMITE.CANCELADO,
]

export const ESTADOS_TURNO: EstadoTurno[] = [
  ESTADO_TURNO.PROGRAMADO,
  ESTADO_TURNO.CONFIRMADO,
  ESTADO_TURNO.AUSENTE,
  ESTADO_TURNO.COMPLETADO,
  ESTADO_TURNO.CANCELADO,
]

export const ESTADO_TRAMITE_DEFAULT = ESTADO_TRAMITE.EN_CURSO
export const ESTADO_PASO_DEFAULT = ESTADO_PASO.PENDIENTE
export const ESTADO_TURNO_DEFAULT = ESTADO_TURNO.PROGRAMADO

export const ESTADOS_TRAMITE_CON_FECHA_FIN: EstadoTramite[] = [
  ESTADO_TRAMITE.COMPLETADO,
  ESTADO_TRAMITE.CANCELADO,
]

export const TIPO_TRAMITE_LABELS: Record<TipoTramite, string> = {
  [TIPO_TRAMITE.NUEVA]: 'Nueva',
  [TIPO_TRAMITE.RENOVACION]: 'Renovación',
  [TIPO_TRAMITE.AMPLIACION]: 'Ampliación',
}

export const ESTADO_TRAMITE_LABELS: Record<EstadoTramite, string> = {
  [ESTADO_TRAMITE.EN_CURSO]: 'En Curso',
  [ESTADO_TRAMITE.COMPLETADO]: 'Completado',
  [ESTADO_TRAMITE.CANCELADO]: 'Cancelado',
}

export const ESTADO_PASO_LABELS: Record<EstadoPaso, string> = {
  [ESTADO_PASO.PENDIENTE]: 'Pendiente',
  [ESTADO_PASO.EN_CURSO]: 'En Curso',
  [ESTADO_PASO.COMPLETADO]: 'Completado',
}

export const ESTADO_TURNO_LABELS: Record<EstadoTurno, string> = {
  [ESTADO_TURNO.PROGRAMADO]: 'Programado',
  [ESTADO_TURNO.CONFIRMADO]: 'Confirmado',
  [ESTADO_TURNO.AUSENTE]: 'Ausente',
  [ESTADO_TURNO.COMPLETADO]: 'Completado',
  [ESTADO_TURNO.CANCELADO]: 'Cancelado',
}

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
  [PASO_ID.MESA_ENTRADAS]: 'Mesa de Entradas',
  [PASO_ID.AREA_LICENCIAS]: 'Área de Licencias',
  [PASO_ID.PAGO]: 'Pago',
  [PASO_ID.REVISION_LICENCIAS]: 'Revisión Licencias',
  [PASO_ID.TURNO_CURSO]: 'Turno Curso',
  [PASO_ID.EXAMEN_TEORICO]: 'Examen Teórico',
  [PASO_ID.EXAMEN_PRACTICO]: 'Examen Práctico',
  [PASO_ID.EXAMEN_PSICOFISICO]: 'Examen Psicofísico',
  [PASO_ID.EMISION]: 'Emisión de Licencia',
}

/**
 * Matriz de pasos requeridos por tipo de trámite.
 * true = el paso es requerido para ese tipo.
 */
export const PASOS_POR_TIPO: Record<TipoTramite, Record<PasoId, boolean>> = {
  [TIPO_TRAMITE.NUEVA]: {
    [PASO_ID.MESA_ENTRADAS]: true,
    [PASO_ID.AREA_LICENCIAS]: true,
    [PASO_ID.PAGO]: true,
    [PASO_ID.REVISION_LICENCIAS]: true,
    [PASO_ID.TURNO_CURSO]: true,
    [PASO_ID.EXAMEN_TEORICO]: true,
    [PASO_ID.EXAMEN_PRACTICO]: true,
    [PASO_ID.EXAMEN_PSICOFISICO]: true,
    [PASO_ID.EMISION]: true,
  },
  [TIPO_TRAMITE.RENOVACION]: {
    [PASO_ID.MESA_ENTRADAS]: true,
    [PASO_ID.AREA_LICENCIAS]: true,
    [PASO_ID.PAGO]: true,
    [PASO_ID.REVISION_LICENCIAS]: true,
    [PASO_ID.TURNO_CURSO]: false,
    [PASO_ID.EXAMEN_TEORICO]: false,
    [PASO_ID.EXAMEN_PRACTICO]: false,
    [PASO_ID.EXAMEN_PSICOFISICO]: true,
    [PASO_ID.EMISION]: true,
  },
  [TIPO_TRAMITE.AMPLIACION]: {
    [PASO_ID.MESA_ENTRADAS]: true,
    [PASO_ID.AREA_LICENCIAS]: true,
    [PASO_ID.PAGO]: true,
    [PASO_ID.REVISION_LICENCIAS]: true,
    [PASO_ID.TURNO_CURSO]: true,
    [PASO_ID.EXAMEN_TEORICO]: true,
    [PASO_ID.EXAMEN_PRACTICO]: true,
    [PASO_ID.EXAMEN_PSICOFISICO]: true,
    [PASO_ID.EMISION]: true,
  },
}

/** Orden canónico de los pasos */
export const ORDEN_PASOS: PasoId[] = [
  PASO_ID.MESA_ENTRADAS,
  PASO_ID.AREA_LICENCIAS,
  PASO_ID.PAGO,
  PASO_ID.REVISION_LICENCIAS,
  PASO_ID.TURNO_CURSO,
  PASO_ID.EXAMEN_TEORICO,
  PASO_ID.EXAMEN_PRACTICO,
  PASO_ID.EXAMEN_PSICOFISICO,
  PASO_ID.EMISION,
]

/**
 * Pasos que requieren asignación de turno.
 * Extensible: si mañana mesa_entradas o pago necesitan turno,
 * solo se agrega acá.
 */
export const PASOS_CON_TURNO: Set<PasoId> = new Set([
  PASO_ID.TURNO_CURSO,
  PASO_ID.EXAMEN_TEORICO,
  PASO_ID.EXAMEN_PRACTICO,
  PASO_ID.EXAMEN_PSICOFISICO,
])

export const OPCIONES_TIPO_TRAMITE = buildSelectOptions(TIPOS_TRAMITE, TIPO_TRAMITE_LABELS)
export const OPCIONES_ESTADO_TRAMITE = buildSelectOptions(ESTADOS_TRAMITE, ESTADO_TRAMITE_LABELS)
export const OPCIONES_ESTADO_PASO = buildSelectOptions(ESTADOS_PASO, ESTADO_PASO_LABELS)
export const OPCIONES_ESTADO_TURNO = buildSelectOptions(ESTADOS_TURNO, ESTADO_TURNO_LABELS)
export const OPCIONES_PASO_ID = buildSelectOptions(ORDEN_PASOS, PASO_LABELS)
