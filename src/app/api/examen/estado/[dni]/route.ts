import { basePayload } from '@/web/libs/payload'
import { NextResponse } from 'next/server'

export async function GET(request: Request, { params }: { params: Promise<{ dni: string }> }) {
  try {
    const { dni } = await params

    if (!dni) {
      return NextResponse.json({ error: 'DNI no proporcionado' }, { status: 400 })
    }

    // Buscar ciudadano por DNI
    const ciudadanos = await basePayload.find({
      collection: 'ciudadanos',
      where: { dni: { equals: dni } },
      limit: 1,
    })

    if (ciudadanos.docs.length === 0) {
      return NextResponse.json({ existe: false, finalizado: false }, { status: 200 })
    }

    const ciudadano = ciudadanos.docs[0]

    // Buscar FUT del ciudadano
    const futs = await basePayload.find({
      collection: 'futs',
      where: { ciudadano: { equals: ciudadano.id } },
      limit: 1,
    })

    if (futs.docs.length === 0) {
      return NextResponse.json({ existe: false, finalizado: false }, { status: 200 })
    }

    const fut = futs.docs[0]

    // Buscar examen del FUT
    const examenes = await basePayload.find({
      collection: 'examenes',
      where: { fut: { equals: fut.id } },
      limit: 1,
    })

    if (examenes.docs.length === 0) {
      return NextResponse.json({ existe: false, finalizado: false }, { status: 200 })
    }

    const examen = examenes.docs[0]

    return NextResponse.json({
      existe: true,
      finalizado: examen.finalizado || false,
      examenId: examen.id,
      aprobado: examen.aprobado,
      porcentaje: examen.porcentaje,
      correctas: examen.correctas,
      incorrectas: examen.incorrectas,
      horarioInicio: examen.horarioInicio,
      horarioFin: examen.horarioFin,
    })
  } catch (error) {
    console.error('Error verificando estado del examen:', error)
    return NextResponse.json({ error: 'Error al verificar el estado' }, { status: 500 })
  }
}
