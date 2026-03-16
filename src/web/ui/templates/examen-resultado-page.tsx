'use client'

import type { Examan as Examen } from '@/payload-types'
import { IconCheck, IconX } from '@tabler/icons-react'
import Link from 'next/link'

interface Props {
  examen: Examen
}

export function ExamenResultadoPage({ examen }: Props) {
  const rs = examen.resultado
  
  const isAprobado = rs?.aprobado
  const percentage = rs && typeof rs.puntajeTotal === 'number' && rs.puntajeTotal > 0 && typeof rs.puntajeObtenido === 'number'
    ? Math.round((rs.puntajeObtenido / rs.puntajeTotal) * 100) 
    : 0

  return (
    <main className="flex min-h-screen items-center justify-center bg-base-200 px-4 py-12">
      <article className="card w-full max-w-md bg-base-100 shadow-xl text-center">
        <section className="card-body items-center">
          
          {isAprobado ? (
            <div className="rounded-full bg-success/20 p-4 mb-2">
              <IconCheck size={64} className="text-success" />
            </div>
          ) : (
            <div className="rounded-full bg-error/20 p-4 mb-2">
              <IconX size={64} className="text-error" />
            </div>
          )}

          <h1 className="text-3xl font-bold mt-2">
             {isAprobado ? '¡Felicitaciones!' : 'Examen Desaprobado'}
          </h1>
          
          <p className="opacity-80 mt-2 mb-6">
            {isAprobado 
              ? 'Has aprobado el examen teórico con éxito. Continúa con el siguiente paso de tu trámite.'
              : 'No has alcanzado el puntaje mínimo requerido. Por favor, comunícate con el área de licencias para coordinar una nueva fecha.'}
          </p>

          <div className="stats shadow w-full border border-base-200">
            <div className="stat">
              <div className="stat-title border-b border-base-200 pb-1 mb-2">Resultado Final</div>
              <div className={`stat-value ${isAprobado ? 'text-success' : 'text-error'}`}>
                {percentage}%
              </div>
              <div className="stat-desc mt-1 font-medium">
                {rs?.puntajeObtenido} de {rs?.puntajeTotal} puntos
              </div>
            </div>
          </div>

          <div className="w-full mt-8">
            <Link href="/examenes" className="btn btn-outline w-full">
              Volver al inicio
            </Link>
          </div>

        </section>
      </article>
    </main>
  )
}
