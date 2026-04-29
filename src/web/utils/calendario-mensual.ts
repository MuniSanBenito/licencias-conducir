/** Utilidades compartidas para grillas de calendario mensual (lunes como primer columna). */

export const DAY_LABELS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'] as const

export const MONTH_LABELS = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
] as const

export function formatDateISO(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function mondayFirstDay(day: number): number {
  return day === 0 ? 6 : day - 1
}

/** Comparación lexicográfica de `YYYY-MM-DD` es equivalente a orden cronológico. */
export function esFechaAnteriorAHoy(dateISO: string, todayISO: string): boolean {
  return dateISO < todayISO
}

/** Domingo = 0, sábado = 6 (`Date#getDay`). */
export function esFinDeSemana(date: Date): boolean {
  const day = date.getDay()
  return day === 0 || day === 6
}

export function esFinDeSemanaDesdeISO(dateISO: string): boolean {
  return esFinDeSemana(new Date(`${dateISO}T12:00:00`))
}

/** Si cae en sábado o domingo, devuelve el lunes siguiente; si no, la misma fecha. */
export function saltarFinDeSemanaSiCorresponde(dateISO: string): string {
  const date = new Date(`${dateISO}T12:00:00`)
  if (!esFinDeSemana(date)) return dateISO
  const day = date.getDay()
  const delta = day === 6 ? 2 : 1
  const next = new Date(date)
  next.setDate(next.getDate() + delta)
  return formatDateISO(next)
}

/**
 * Alinea la fecha a la primera opción válida para gestión: no anterior a hoy y no fin de semana.
 */
export function asegurarFechaGestionable(selectedISO: string, todayISO: string): string {
  let d = esFechaAnteriorAHoy(selectedISO, todayISO) ? todayISO : selectedISO
  d = saltarFinDeSemanaSiCorresponde(d)
  if (esFechaAnteriorAHoy(d, todayISO)) {
    d = saltarFinDeSemanaSiCorresponde(todayISO)
  }
  return d
}

export function getMonthGridDays(calendarMonth: Date): Date[] {
  const firstDay = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1)
  const offset = mondayFirstDay(firstDay.getDay())
  const start = new Date(firstDay)
  start.setDate(firstDay.getDate() - offset)

  const days: Date[] = []
  for (let i = 0; i < 42; i++) {
    const date = new Date(start)
    date.setDate(start.getDate() + i)
    days.push(date)
  }
  return days
}
