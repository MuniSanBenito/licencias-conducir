import type { ClaseLicencia } from '@/constants/clases'
import {
  ESTADO_PASO,
  ORDEN_PASOS,
  PASO_LABELS,
  PASOS_POR_TIPO,
  type EstadoPaso,
  type PasoId,
  type TipoTramite,
} from '@/constants/tramites'
import { pasoRequiereTurno } from './turnos'

export interface ItemLicencia {
  clase: ClaseLicencia
  tipo: TipoTramite
}

export interface PasoTramitePreview {
  id: PasoId
  label: string
  estado: EstadoPaso
  requiereTurno: boolean
}

/**
 * Calcula los pasos necesarios para un trámite
 * en base a la unión de los pasos requeridos por cada ítem.
 * Si al menos un ítem requiere un paso, se incluye.
 */
export function getPasosParaTramite(items: ItemLicencia[]): PasoTramitePreview[] {
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
    estado: ESTADO_PASO.PENDIENTE,
    requiereTurno: pasoRequiereTurno(paso),
  }))
}
