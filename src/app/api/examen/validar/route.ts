import { validarRespuestasPayload } from '@/web/libs/validar-examen'
import { validarSesionExamen } from '@/web/libs/validar-sesion-examen'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { dni, respuestas } = body

    if (!dni || typeof dni !== 'string') {
      return NextResponse.json({ error: 'DNI inválido' }, { status: 400 })
    }

    if (!respuestas || typeof respuestas !== 'object') {
      return NextResponse.json({ error: 'Respuestas inválidas' }, { status: 400 })
    }

    const sesion = await validarSesionExamen(dni)
    if (!sesion.valido) {
      return NextResponse.json({ error: sesion.mensaje }, { status: 403 })
    }

    const resultado = await validarRespuestasPayload(dni, respuestas)

    return NextResponse.json({
      success: true,
      resultado: {
        aprobado: resultado.aprobado,
        correctas: resultado.correctas,
        incorrectas: resultado.incorrectas,
        total: resultado.total,
        porcentaje: Math.round((resultado.correctas / resultado.total) * 100),
        eliminatoriasIncorrectas: resultado.eliminatoriasIncorrectas.length,
      },
    })
  } catch (error) {
    console.error('Error validando examen:', error)
    return NextResponse.json({ error: 'Error al validar el examen' }, { status: 500 })
  }
}
