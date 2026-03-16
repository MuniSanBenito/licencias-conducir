import { basePayload } from '@/web/libs/payload/server'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const dni = searchParams.get('dni')

  if (!dni) {
    return NextResponse.json({ error: 'DNI no proporcionado' }, { status: 400 })
  }

  try {
    const ciudadanos = await basePayload.find({
      collection: 'ciudadano',
      where: {
        dni: {
          equals: dni,
        },
      },
      limit: 1,
    })

    if (ciudadanos.totalDocs === 0) {
      return NextResponse.json({ error: 'No se encontraron turnos asignados para el DNI indicado' }, { status: 404 })
    }

    const ciudadano = ciudadanos.docs[0]

    // Buscamos un exámen abierto o reciente de ese ciudadano
    const examenes = await basePayload.find({
      collection: 'examen',
      where: {
        ciudadano: {
          equals: ciudadano.id,
        },
      },
      sort: '-fechaInicio',
      limit: 1,
    })

    if (examenes.totalDocs === 0) {
      return NextResponse.json({ estado: 'ninguno' })
    }

    const examenActual = examenes.docs[0]

    return NextResponse.json({
      estado: examenActual.estado,
      examenId: examenActual.id,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error interno del servidor. Por favor comuníquese con el área de licencias.' }, { status: 500 })
  }
}
