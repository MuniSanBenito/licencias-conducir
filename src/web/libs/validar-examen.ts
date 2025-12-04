import type { Consigna } from '@/payload-types'
import { basePayload } from '@/web/libs/payload'

interface ResultadoValidacion {
  aprobado: boolean
  correctas: number
  incorrectas: number
  total: number
  eliminatoriasIncorrectas: string[]
  detalles: Array<{
    consignaId: string
    correcta: boolean
    respuestaCorrecta: number[]
    respuestaUsuario: number[]
  }>
}

function extraerRespuestasCorrectas(consigna: Consigna): number[] {
  const correctas: number[] = []

  if (consigna.opciones) {
    consigna.opciones.forEach((opcionGroup, index) => {
      if (opcionGroup.correcta) {
        correctas.push(index)
      }
    })
  }

  return correctas
}

/**
 * Valida las respuestas del usuario contra el examen en Payload
 */
export async function validarRespuestasPayload(
  dni: string,
  respuestas: Record<string, number[]>,
): Promise<ResultadoValidacion> {
  const ciudadanos = await basePayload.find({
    collection: 'ciudadanos',
    where: { dni: { equals: dni } },
    limit: 1,
  })

  if (ciudadanos.docs.length === 0) {
    throw new Error(`No se encontró ciudadano con DNI ${dni}`)
  }

  const ciudadano = ciudadanos.docs[0]

  const futs = await basePayload.find({
    collection: 'futs',
    where: { ciudadano: { equals: ciudadano.id } },
    limit: 1,
  })

  if (futs.docs.length === 0) {
    throw new Error(`No se encontró FUT para el ciudadano con DNI ${dni}`)
  }

  const fut = futs.docs[0]

  const examenes = await basePayload.find({
    collection: 'examenes',
    where: { fut: { equals: fut.id } },
    depth: 3,
    limit: 1,
  })

  if (examenes.docs.length === 0) {
    throw new Error(`No se encontró examen para el FUT ${fut.futId}`)
  }

  const examen = examenes.docs[0]

  if (!examen.consignas) {
    throw new Error('El examen no tiene consignas asignadas')
  }
  let correctas = 0
  let incorrectas = 0
  const eliminatoriasIncorrectas: string[] = []
  const detalles: Array<{
    consignaId: string
    correcta: boolean
    respuestaCorrecta: number[]
    respuestaUsuario: number[]
  }> = []

  for (const consignaRef of examen.consignas) {
    // Debe ser objeto completo por depth: 3
    if (typeof consignaRef === 'string') {
      throw new Error('Las consignas no se cargaron correctamente')
    }

    const consigna = consignaRef as Consigna
    const respuestaUsuario = respuestas[consigna.id] || []
    const respuestasCorrectas = extraerRespuestasCorrectas(consigna)

    // Comparar arrays (mismos elementos, sin importar orden)
    const respuestaUsuarioSorted = [...respuestaUsuario].sort((a, b) => a - b)
    const respuestasCorrectasSorted = [...respuestasCorrectas].sort((a, b) => a - b)

    const esCorrecta =
      respuestaUsuarioSorted.length === respuestasCorrectasSorted.length &&
      respuestaUsuarioSorted.every((val, idx) => val === respuestasCorrectasSorted[idx])

    if (esCorrecta) {
      correctas++
    } else {
      incorrectas++
      if (consigna.eliminatoria) {
        eliminatoriasIncorrectas.push(consigna.id)
      }
    }

    detalles.push({
      consignaId: consigna.id,
      correcta: esCorrecta,
      respuestaCorrecta: respuestasCorrectas,
      respuestaUsuario: respuestaUsuario,
    })
  }

  const total = examen.consignas.length
  // Aprobar si: 90% correcto Y sin fallar eliminatorias
  const porcentaje = (correctas / total) * 100
  const aprobado = porcentaje >= 90 && eliminatoriasIncorrectas.length === 0

  // Guardar respuestas y resultados en el examen
  await basePayload.update({
    collection: 'examenes',
    id: examen.id,
    data: {
      respuestas: detalles.map((detalle) => ({
        consigna: detalle.consignaId,
        respuestas: detalle.respuestaUsuario.map((respuesta) => ({ respuesta })),
      })),
      finalizado: true,
      horarioFin: new Date().toISOString(),
      aprobado,
      correctas,
      incorrectas,
      porcentaje: Math.round(porcentaje),
    },
  })

  return {
    aprobado,
    correctas,
    incorrectas,
    total,
    eliminatoriasIncorrectas,
    detalles,
  }
}
