import {
  CURSO_MSJ_DIA_INHABIL,
  CURSO_MSJ_FIN_DE_SEMANA,
  DIA_CURSO,
  DIAS_HABILES_PSICOFISICO,
  DURACION_TURNO_PSICOFISICO_MIN,
  HORARIOS_PSICOFISICO,
  MAX_TURNOS_CURSO_POR_DIA,
} from '@/constants/turnos'

interface TurnoExistente {
  fecha: string
  hora: string
}

interface HorarioPsicofisicoExcepcion {
  fecha: string
  inicio: string
  fin: string
  activo: boolean
}

function normalizeFecha(fecha: string): string {
  return fecha.split('T')[0]
}

/**
 * Genera los slots de 20 minutos para el examen psicofísico en una fecha dada.
 * Filtra los slots ya ocupados por turnos existentes.
 */
export function getSlotsPsicofisicoConConfiguracion(
  fecha: Date,
  turnosOcupados: TurnoExistente[],
  excepciones: HorarioPsicofisicoExcepcion[] = [],
): string[] {
  const fechaISO = formatFechaISO(fecha)
  const excepcion = excepciones.find((e) => normalizeFecha(e.fecha) === fechaISO)
  if (excepcion) {
    if (!excepcion.activo) return []
    return getSlotsFromHorario(fecha, turnosOcupados, excepcion.inicio, excepcion.fin)
  }

  const diaSemana = fecha.getDay()
  const horario = HORARIOS_PSICOFISICO[diaSemana]

  if (!horario) return []

  return getSlotsFromHorario(fecha, turnosOcupados, horario.inicio, horario.fin)
}

function getSlotsFromHorario(
  fecha: Date,
  turnosOcupados: TurnoExistente[],
  inicio: string,
  fin: string,
): string[] {
  const [inicioHora, inicioMin] = inicio.split(':').map(Number)
  const [finHora, finMin] = fin.split(':').map(Number)

  const inicioMinutos = inicioHora * 60 + inicioMin
  const finMinutos = finHora * 60 + finMin

  const fechaStr = formatFechaISO(fecha)
  const horasOcupadas = new Set(
    turnosOcupados
      .filter((t) => t.fecha === fechaStr)
      .map((t) => t.hora),
  )

  const slots: string[] = []

  for (let minutos = inicioMinutos; minutos + DURACION_TURNO_PSICOFISICO_MIN <= finMinutos; minutos += DURACION_TURNO_PSICOFISICO_MIN) {
    const hora = String(Math.floor(minutos / 60)).padStart(2, '0')
    const min = String(minutos % 60).padStart(2, '0')
    const slot = `${hora}:${min}`

    if (!horasOcupadas.has(slot)) {
      slots.push(slot)
    }
  }

  return slots
}

export function getSlotsPsicofisico(fecha: Date, turnosOcupados: TurnoExistente[]): string[] {
  return getSlotsPsicofisicoConConfiguracion(fecha, turnosOcupados)
}

/**
 * Cuenta cuántos turnos de curso existen para una fecha dada.
 */
export function contarTurnosCursoPorFecha(fecha: string, turnosExistentes: TurnoExistente[]): number {
  return turnosExistentes.filter((t) => t.fecha === fecha).length
}

/**
 * Verifica si un día tiene cupo disponible para el curso presencial.
 */
export function tieneCupoCurso(fecha: string, turnosExistentes: TurnoExistente[]): boolean {
  return contarTurnosCursoPorFecha(fecha, turnosExistentes) < MAX_TURNOS_CURSO_POR_DIA
}

/**
 * Indica si la fecha es el día habitual de curso (lunes). El turno puede agendarse
 * en otros días hábiles si el lunes es inhábil; en ese caso la UI pide confirmación.
 */
export function esDiaDeCurso(fecha: Date): boolean {
  return fecha.getDay() === DIA_CURSO
}

/**
 * Verifica si una fecha tiene atención para psicofísico.
 */
export function esDiaDePsicofisico(fecha: Date): boolean {
  return DIAS_HABILES_PSICOFISICO.includes(fecha.getDay() as (typeof DIAS_HABILES_PSICOFISICO)[number])
}

/**
 * Formatea una Date a string ISO (YYYY-MM-DD) en zona local.
 */
export function formatFechaISO(fecha: Date): string {
  const year = fecha.getFullYear()
  const month = String(fecha.getMonth() + 1).padStart(2, '0')
  const day = String(fecha.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function isDiaInhabil(fecha: Date, diasInhabiles: string[]): boolean {
  const fechaISO = formatFechaISO(fecha)
  return diasInhabiles.includes(fechaISO)
}

/**
 * Primeras fechas hábiles (lun–vie) sin inhábil a partir de `fechaDesde`.
 * Incluye días que no sean lunes para reflejar traslados cuando el lunes es inhábil.
 */
export function getFechasHabilitadasCurso(
  fechaDesde: Date,
  cantidad: number,
  diasInhabiles: string[],
): string[] {
  const fechas: string[] = []
  const cursor = new Date(fechaDesde)

  while (fechas.length < cantidad) {
    if (esDiaDePsicofisico(cursor) && !isDiaInhabil(cursor, diasInhabiles)) {
      fechas.push(formatFechaISO(cursor))
    }
    cursor.setDate(cursor.getDate() + 1)
  }

  return fechas
}

export function validarDisponibilidadCurso(
  fechaISO: string,
  turnosExistentes: TurnoExistente[],
  diasInhabiles: string[],
): { ok: boolean; motivo?: string } {
  const fecha = new Date(`${fechaISO}T12:00:00`)
  if (!esDiaDePsicofisico(fecha)) {
    return { ok: false, motivo: CURSO_MSJ_FIN_DE_SEMANA }
  }
  if (isDiaInhabil(fecha, diasInhabiles)) {
    return { ok: false, motivo: CURSO_MSJ_DIA_INHABIL }
  }
  if (!tieneCupoCurso(fechaISO, turnosExistentes)) {
    return { ok: false, motivo: 'No hay cupo disponible para esa fecha' }
  }

  return { ok: true }
}

export function validarDisponibilidadPsicofisico(
  fechaISO: string,
  hora: string,
  turnosExistentes: TurnoExistente[],
  diasInhabiles: string[],
  excepciones: HorarioPsicofisicoExcepcion[] = [],
): { ok: boolean; motivo?: string } {
  const fecha = new Date(`${fechaISO}T12:00:00`)
  if (!esDiaDePsicofisico(fecha)) {
    return { ok: false, motivo: 'El psicofísico solo se agenda de lunes a viernes' }
  }
  if (isDiaInhabil(fecha, diasInhabiles)) {
    return { ok: false, motivo: 'La fecha seleccionada está marcada como inhábil' }
  }

  const slots = getSlotsPsicofisicoConConfiguracion(fecha, turnosExistentes, excepciones)
  if (!slots.includes(hora)) {
    return { ok: false, motivo: 'El horario seleccionado no está disponible' }
  }

  return { ok: true }
}
