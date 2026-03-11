import { PASOS_CON_TURNO, type PasoId } from '@/constants/tramites'

export function pasoRequiereTurno(pasoId: PasoId): boolean {
  return PASOS_CON_TURNO.has(pasoId)
}
