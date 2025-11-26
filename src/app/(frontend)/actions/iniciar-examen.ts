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

  const { docs: futs } = await basePayload.find({
    collection: 'futs',
    where: {
      'ciudadano.dni': {
        equals: dni,
      },
    },
  })
  if (!futs || futs.length === 0) {
    return { ok: false, message: 'FUT no encontrado para el ciudadano', examenId: null }
  }
  const [fut] = futs

  const { docs: examenes } = await basePayload.find({
    collection: 'examenes',
    where: {
      fut: {
        equals: fut.id,
      },
    },
    limit: 1,
    sort: '-createdAt',
  })
  if (!examenes || examenes.length === 0) {
    return { ok: false, message: 'No hay examenes asignados para este FUT', examenId: null }
  }

  const [examen] = examenes

  return { ok: true, message: 'Examen iniciado', examenId: '12345' }
}
