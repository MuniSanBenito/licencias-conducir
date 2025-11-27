'use client'
import type { Consigna, Examen } from '@/payload-types'
import { useState } from 'react'

interface ExamenPageClientProps {
  examen: Examen
}

export function ExamenPageClient({ examen }: ExamenPageClientProps) {
  const [respuestas, setRespuestas] = useState<Record<string, number>>({})

  const handleRespuestaChange = (consignaId: string, opcionIndex: number) => {
    setRespuestas((prev) => ({
      ...prev,
      [consignaId]: opcionIndex,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implementar lógica de envío
    console.log('Respuestas:', respuestas)
  }

  const totalConsignas = examen.consignas?.length || 0
  const respondidas = Object.keys(respuestas).length
  const progreso = totalConsignas > 0 ? (respondidas / totalConsignas) * 100 : 0

  return (
    <div className="mx-auto min-h-dvh max-w-4xl p-6">
      {/* Header con stats */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{examen.titulo}</h1>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div className="badge badge-primary badge-lg">
            Categorías: {examen.categorias.join(', ')}
          </div>
          <div className="badge badge-neutral badge-lg">
            {respondidas} de {totalConsignas} respondidas
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <progress className="progress progress-primary w-full" value={progreso} max="100" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {examen.consignas?.map((item, index) => {
          const consigna = item.consigna as Consigna
          const consignaId = typeof item.consigna === 'string' ? item.consigna : consigna.id
          const isAnswered = consignaId in respuestas

          return (
            <div key={item.id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="card-title flex-1">
                    <span className="badge badge-neutral">{index + 1}</span>
                    {consigna.pregunta}
                  </h2>
                  {consigna.eliminatoria && (
                    <div className="badge badge-error gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="inline-block h-4 w-4 stroke-current"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      Eliminatoria
                    </div>
                  )}
                </div>

                <div className="mt-4 space-y-2">
                  {consigna.opciones?.map((opcion, opcionIndex) => {
                    const isSelected = respuestas[consignaId] === opcionIndex

                    return (
                      <div
                        key={opcionIndex}
                        className={`form-control ${isSelected ? 'bg-primary/10' : ''} rounded-lg border-2 p-4 transition-all ${
                          isSelected ? 'border-primary' : 'border-base-300'
                        }`}
                      >
                        <label className="label cursor-pointer justify-start gap-4">
                          <input
                            type="radio"
                            name={`consigna-${consignaId}`}
                            className="radio radio-primary"
                            value={opcionIndex}
                            checked={isSelected}
                            onChange={() => handleRespuestaChange(consignaId, opcionIndex)}
                          />
                          <span className="label-text flex-1 text-base">
                            {opcion.opcion?.map((bloque, bloqueIndex) => {
                              if (bloque.blockType === 'texto') {
                                return <span key={bloqueIndex}>{bloque.texto}</span>
                              }
                              if (bloque.blockType === 'imagen') {
                                const imagen =
                                  typeof bloque.imagen === 'string'
                                    ? bloque.imagen
                                    : bloque.imagen?.url
                                return (
                                  <div key={bloqueIndex} className="mt-3">
                                    <img
                                      src={imagen || ''}
                                      alt="Opción"
                                      className="max-h-48 rounded-lg"
                                    />
                                  </div>
                                )
                              }
                              return null
                            })}
                          </span>
                        </label>
                      </div>
                    )
                  })}
                </div>

                {isAnswered && (
                  <div className="mt-2">
                    <div className="badge badge-success gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="inline-block h-4 w-4 stroke-current"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Respondida
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {/* Botones sticky */}
        <div className="bg-base-100 sticky bottom-0 z-10 flex justify-end gap-3 border-t p-6 shadow-lg">
          <button type="button" className="btn btn-outline btn-neutral">
            Guardar borrador
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={respondidas !== totalConsignas}
          >
            {respondidas === totalConsignas ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block h-5 w-5 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Finalizar examen
              </>
            ) : (
              `Responde todas (${totalConsignas - respondidas} restantes)`
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
