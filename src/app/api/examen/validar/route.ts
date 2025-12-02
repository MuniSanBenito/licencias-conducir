import { validarRespuestas } from '@/mocks/examenes'
import { NextResponse } from 'next/server'

/**
 * POST /api/examen/validar
 * Valida respuestas del examen
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { dni, respuestas } = body

    // Validaciones básicas
    if (!dni || typeof dni !== 'string') {
      return NextResponse.json({ error: 'DNI inválido' }, { status: 400 })
    }

    if (!respuestas || typeof respuestas !== 'object') {
      return NextResponse.json({ error: 'Respuestas inválidas' }, { status: 400 })
    }

    const resultado = validarRespuestas(dni, respuestas)

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
