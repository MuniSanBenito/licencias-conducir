import { basePayload } from '@/web/libs/payload'

interface ResultadoValidacion {
  valido: boolean
  examenId?: string
  mensaje?: string
}

export async function validarSesionExamen(dni: string): Promise<ResultadoValidacion> {
  const ciudadanos = await basePayload.find({
    collection: 'ciudadanos',
    where: { dni: { equals: dni } },
    limit: 1,
  })

  if (ciudadanos.docs.length === 0) {
    return { valido: false, mensaje: 'Ciudadano no encontrado' }
  }

  const futs = await basePayload.find({
    collection: 'futs',
    where: { ciudadano: { equals: ciudadanos.docs[0].id } },
    limit: 1,
  })

  if (futs.docs.length === 0) {
    return { valido: false, mensaje: 'FUT no encontrado' }
  }

  const examenes = await basePayload.find({
    collection: 'examenes',
    where: { fut: { equals: futs.docs[0].id } },
    limit: 1,
  })

  if (examenes.docs.length === 0) {
    return { valido: false, mensaje: 'Examen no encontrado' }
  }

  const examen = examenes.docs[0]

  if (examen.finalizado) {
    return { valido: false, mensaje: 'El examen ya fue finalizado' }
  }

  if (!examen.horarioCierre) {
    return { valido: false, mensaje: 'Examen sin horario de cierre' }
  }

  const ahora = new Date()
  const cierre = new Date(examen.horarioCierre)

  if (ahora > cierre) {
    return { valido: false, mensaje: 'El tiempo del examen ha expirado' }
  }

  return { valido: true, examenId: examen.id }
}
