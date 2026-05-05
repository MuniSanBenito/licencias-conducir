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

// ─── Estado del Turno ───

export const ESTADO_TURNO = {
  PROGRAMADO: 'programado',
  CONFIRMADO: 'confirmado',
  AUSENTE: 'ausente',
  COMPLETADO: 'completado',
  CANCELADO: 'cancelado',
} as const

export type EstadoTurno = (typeof ESTADO_TURNO)[keyof typeof ESTADO_TURNO]

export const ESTADOS_TURNO: EstadoTurno[] = [
  ESTADO_TURNO.PROGRAMADO,
  ESTADO_TURNO.CONFIRMADO,
  ESTADO_TURNO.AUSENTE,
  ESTADO_TURNO.COMPLETADO,
  ESTADO_TURNO.CANCELADO,
]

export const ESTADO_TURNO_DEFAULT = ESTADO_TURNO.PROGRAMADO

export const ESTADO_TURNO_LABELS: Record<EstadoTurno, string> = {
  [ESTADO_TURNO.PROGRAMADO]: 'Programado',
  [ESTADO_TURNO.CONFIRMADO]: 'Confirmado',
  [ESTADO_TURNO.AUSENTE]: 'Ausente',
  [ESTADO_TURNO.COMPLETADO]: 'Completado',
  [ESTADO_TURNO.CANCELADO]: 'Cancelado',
}

// ─── Tipo de Turno ───

export const TIPO_TURNO = {
  CURSO: 'curso',
  PSICOFISICO: 'psicofisico',
} as const

export type TipoTurno = (typeof TIPO_TURNO)[keyof typeof TIPO_TURNO]

export const TIPO_TURNO_LABELS: Record<TipoTurno, string> = {
  [TIPO_TURNO.CURSO]: 'Curso Presencial',
  [TIPO_TURNO.PSICOFISICO]: 'Examen Psicofísico',
}

// ─── Configuración de Turneros ───

export const MAX_TURNOS_CURSO_POR_DIA = 20
export const DURACION_TURNO_PSICOFISICO_MIN = 20

export const HORARIO_CURSO = {
  INICIO: '08:30',
  FIN: '12:30',
} as const

/**
 * Horarios del examen psicofísico por día de semana (0=Domingo, 1=Lunes, ..., 6=Sábado).
 * null indica que no hay atención ese día.
 */
export const HORARIOS_PSICOFISICO: Record<number, { inicio: string; fin: string } | null> = {
  0: null, // Domingo
  1: { inicio: '08:00', fin: '11:00' }, // Lunes
  2: { inicio: '07:00', fin: '11:00' }, // Martes
  3: { inicio: '07:00', fin: '12:30' }, // Miércoles
  4: { inicio: '07:00', fin: '12:30' }, // Jueves
  5: { inicio: '07:00', fin: '11:00' }, // Viernes
  6: null, // Sábado
}

/** Día de semana habitual del curso presencial (1 = Lunes). Puede trasladarse a otro día hábil si el lunes es inhábil. */
export const DIA_CURSO = 1
export const DIAS_HABILES_PSICOFISICO = [1, 2, 3, 4, 5] as const

/** Validación de fecha: curso solo lun–vie (mismos días hábiles que el psicofísico). */
export const CURSO_MSJ_FIN_DE_SEMANA =
  'El curso no se agenda sábados ni domingos. Elegí un día de lunes a viernes; si el lunes habitual es inhábil o feriado, podés usar el siguiente día hábil y al guardar se pedirá confirmación.'

/** Fecha marcada como inhábil en el calendario */
export const CURSO_MSJ_DIA_INHABIL =
  'Esta fecha está marcada como inhábil y no admite turnos de curso.'

/**
 * Confirmación al guardar un turno de curso en un día que no es lunes (traslado por feriado u otra excepción).
 */
export const CURSO_MSJ_CONFIRMACION_FECHA_NO_LUNES =
  'El día elegido no es lunes. Habitualmente el curso es los lunes; si ese lunes es inhábil, suele trasladarse al siguiente día hábil. ¿Confirmás que esta fecha es la correcta para este caso?'

// ─── Select Options ───

export const OPCIONES_ESTADO_TURNO = buildSelectOptions(ESTADOS_TURNO, ESTADO_TURNO_LABELS)
