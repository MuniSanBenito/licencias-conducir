import {
  DIA_CURSO,
  DURACION_TURNO_PSICOFISICO_MIN,
  HORARIOS_PSICOFISICO,
  MAX_TURNOS_CURSO_POR_DIA,
  type TipoTramite,
  tipoRequiereCurso,
} from '@/constants/tramites'

interface TurnoExistente {
  fecha: string
  hora: string
}

/**
 * Genera los slots de 20 minutos para el examen psicofísico en una fecha dada.
 * Filtra los slots ya ocupados por turnos existentes.
 */
export function getSlotsPsicofisico(fecha: Date, turnosOcupados: TurnoExistente[]): string[] {
  const diaSemana = fecha.getDay()
  const horario = HORARIOS_PSICOFISICO[diaSemana]

  if (!horario) return []

  const [inicioHora, inicioMin] = horario.inicio.split(':').map(Number)
  const [finHora, finMin] = horario.fin.split(':').map(Number)

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
 * Verifica si una fecha corresponde a un día de curso (lunes por defecto).
 */
export function esDiaDeCurso(fecha: Date): boolean {
  return fecha.getDay() === DIA_CURSO
}

/**
 * Verifica si una fecha tiene atención para psicofísico.
 */
export function esDiaDePsicofisico(fecha: Date): boolean {
  return HORARIOS_PSICOFISICO[fecha.getDay()] !== null
}

/**
 * Determina qué turnos necesita un trámite según su tipo.
 */
export function getTurnosRequeridos(tipo: TipoTramite): { curso: boolean; psicofisico: boolean } {
  return {
    curso: tipoRequiereCurso(tipo),
    psicofisico: true,
  }
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
