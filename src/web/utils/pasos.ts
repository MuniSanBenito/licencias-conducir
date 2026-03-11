import {
  ORDEN_PASOS,
  PASO_LABELS,
  PASOS_POR_TIPO,
  type EstadoPaso,
  type PasoId,
} from '@/constants/tramites'
import type { ItemLicencia, PasoTramite } from '@/types'
import { pasoRequiereTurno } from './turnos'

/**
 * Calcula los pasos necesarios para un trámite
 * en base a la unión de los pasos requeridos por cada ítem.
 * Si al menos un ítem requiere un paso, se incluye.
 */
export function getPasosParaTramite(items: ItemLicencia[]): PasoTramite[] {
  const pasosRequeridos = new Set<PasoId>()

  for (const item of items) {
    const requeridos = PASOS_POR_TIPO[item.tipo]
    for (const paso of ORDEN_PASOS) {
      if (requeridos[paso]) {
        pasosRequeridos.add(paso)
      }
    }
  }

  return ORDEN_PASOS.filter((paso) => pasosRequeridos.has(paso)).map((paso) => ({
    id: paso,
    label: PASO_LABELS[paso],
    estado: 'pendiente' as EstadoPaso,
    requiereTurno: pasoRequiereTurno(paso),
  }))
}
