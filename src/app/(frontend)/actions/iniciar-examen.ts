'use server'
import type { ResNOK, ResOK } from '@/types'
import { basePayload } from '@/web/payload'

interface Args {
  dni: string
}
export async function iniciarExamen({
  dni,
}: Args): Promise<(ResOK & { examenId: string }) | (ResNOK & { examenId: null })> {
  if (!dni) {
    return { ok: false, message: 'DNI es requerido', examenId: null }
  }

  const { docs: ciudadanos } = await basePayload.find({
    collection: 'ciudadanos',
    where: {
      dni: {
        equals: dni,
      },
    },
  })
  if (!ciudadanos || ciudadanos.length === 0) {
    return { ok: false, message: 'Ciudadano no encontrado', examenId: null }
  }
  const [ciudadano] = ciudadanos

  const { docs: futs } = await basePayload.find({
    collection: 'futs',
    where: {
      ciudadano: {
        equals: ciudadano.id,
      },
    },
  })
  if (!futs || futs.length === 0) {
    return { ok: false, message: 'FUT no encontrado para el ciudadano', examenId: null }
  }
  const [fut] = futs

  return { ok: true, message: 'Examen iniciado', examenId: '12345' }
}
