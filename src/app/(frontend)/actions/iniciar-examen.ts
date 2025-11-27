'use server'
import type { Examen } from '@/payload-types'
import type { ResNOK, ResOK } from '@/types'
import { basePayload } from '@/web/payload'

interface Args {
  dni: string
}
export async function iniciarExamen({
  dni,
}: Args): Promise<(ResOK & { examen: Examen }) | (ResNOK & { examen: null })> {
  if (!dni) {
    return { ok: false, message: 'DNI es requerido', examen: null }
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
    return { ok: false, message: 'FUT no encontrado para el ciudadano', examen: null }
  }
  const [fut] = futs

  const { docs: examenes } = await basePayload.find({
    collection: 'examenes',
    where: {
      and: [
        {
          'fut.id': {
            equals: fut.id,
          },
        },
        {
          finalizado: {
            equals: false,
          },
        },
      ],
    },
    limit: 1,
    sort: '-createdAt',
  })
  if (!examenes || examenes.length === 0) {
    return { ok: false, message: 'No hay examenes asignados para este FUT', examen: null }
  }

  const [examen] = examenes

  return { ok: true, message: 'Examen iniciado', examen }
}
