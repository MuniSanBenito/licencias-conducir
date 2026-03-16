import { basePayload } from '@/web/libs/payload/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  try {
    const body = await req.json()
    const { respuestas } = body as { respuestas: Record<string, string[]> }

    if (!respuestas) {
      return NextResponse.json({ error: 'Debes enviar las respuestas' }, { status: 400 })
    }

    const examen = await basePayload.findByID({
      collection: 'examen',
      id,
    })

    if (!examen || examen.estado === 'cerrado') {
      return NextResponse.json({ error: 'Examen no encontrado o ya fue cerrado' }, { status: 404 })
    }

    // Calcular resultado
    let puntajeObtenido = 0
    let puntajeTotal = 0

    // Mapear respuestas a la estructura de Payload:
    const respuestasCiudadano = Object.entries(respuestas).map(([preguntaRef, opcionesSeleccionadas]) => ({
      preguntaRef,
      opcionesSeleccionadas, // JSON field stores exactly what we pass
    }))

    for (const preg of examen.preguntasGeneradas) {
      const pId = preg.preguntaOriginal as string
      
      const resSeleccionadas = respuestas[pId] || []
      
      const opcionesCorrectas = preg.opciones.filter(o => o.esCorrecta).map(o => o.idOp)
      
      puntajeTotal += opcionesCorrectas.length

      // Calcula puntaje: Por cada opcion correcta seleccionada suma 1.
      // Por cada opcion incorrecta seleccionada, resta 1 (o simplemente no suma o penaliza).
      // En multiple choice complejo suele requerirse acierto exacto. Simplificaremos a suma exacta:
      const aciertos = opcionesCorrectas.filter(op => resSeleccionadas.includes(op)).length
      const errores = resSeleccionadas.filter(op => !opcionesCorrectas.includes(op)).length

      // Obtenemos un puntaje por pregunta (minimo 0)
      const puntajePregunta = Math.max(0, aciertos - errores)
      puntajeObtenido += puntajePregunta
    }

    // Porcentaje mínimo para aprobar: por ej. 70% o 80%. Para este caso, 70%.
    const minimoAprobacion = puntajeTotal * 0.7
    const aprobado = puntajeObtenido >= minimoAprobacion

    await basePayload.update({
      collection: 'examen',
      id,
      data: {
        estado: 'cerrado',
        respuestasCiudadano,
        resultado: {
          aprobado,
          puntajeTotal,
          puntajeObtenido,
        },
      },
    })

    return NextResponse.json({ success: true, aprobado, puntajeObtenido, puntajeTotal })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error del servidor al finalizar el examen' }, { status: 500 })
  }
}
