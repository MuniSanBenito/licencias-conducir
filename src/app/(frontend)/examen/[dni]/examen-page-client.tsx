'use client'
import type { Consigna, Examen } from '@/payload-types'
import { Logo } from '@/payload/brand/logo'
import { IconCheck, IconX } from '@tabler/icons-react'
import Image from 'next/image'
import { useCallback, useMemo, useState, type FormEvent } from 'react'

interface ExamenPageClientProps {
  examen: Examen
}

export function ExamenPageClient({ examen }: ExamenPageClientProps) {
  const [respuestas, setRespuestas] = useState<Record<string, number>>({})

  const totalConsignas = useMemo(() => examen.consignas?.length || 0, [examen.consignas?.length])
  const respondidas = useMemo(() => Object.keys(respuestas).length, [respuestas])
  const progreso = useMemo(() => (totalConsignas > 0 ? (respondidas / totalConsignas) * 100 : 0), [respondidas, totalConsignas])

  const fechaActual = useMemo(() => new Date().toLocaleDateString('es-AR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }), [])

  const handleRespuestaChange = useCallback((consignaId: string, opcionIndex: number) => {
    setRespuestas((prev) => ({
      ...prev,
      [consignaId]: opcionIndex,
    }))
  }, [])

  const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // TODO: Implementar lógica de envío
    console.log('Respuestas:', respuestas)
  }, [respuestas])

  return (
    <div className="mx-auto min-h-dvh max-w-4xl p-6">
      {/* Header con logo e info */}
      <div className="mb-8 border-b pb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Logo height={60} />
          <div className="text-right">
            <div className="text-sm text-base-content/70">
              {fechaActual.charAt(0).toUpperCase() + fechaActual.slice(1)}
            </div>
            <div className="mt-1 text-xs text-base-content/60">
              Municipalidad de San Benito
            </div>
          </div>
        </div>
      </div>

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
                      <IconX className="h-4 w-4" />
                      Eliminatoria
                    </div>
                  )}
                </div>

                <div className="mt-4 space-y-2">
                  {consigna.opciones?.map((opcion, opcionIndex) => {
                    const isSelected = respuestas[consignaId] === opcionIndex
                    const radioId = `consigna-${consignaId}-opcion-${opcionIndex}`

                    return (
                      <label
                        key={opcionIndex}
                        htmlFor={radioId}
                        className={`flex cursor-pointer items-start gap-4 rounded-lg border-2 p-4 transition-all ${
                          isSelected
                            ? 'border-primary bg-primary/10'
                            : 'border-base-300 hover:border-primary/50'
                        }`}
                      >
                        <input
                          type="radio"
                          id={radioId}
                          name={`consigna-${consignaId}`}
                          className="radio radio-primary mt-0.5"
                          value={opcionIndex}
                          checked={isSelected}
                          onChange={() => handleRespuestaChange(consignaId, opcionIndex)}
                        />
                        <span className="flex-1 text-base">
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
                                  <Image
                                    src={imagen || ''}
                                    alt="Opción"
                                    width={500}
                                    height={300}
                                    className="max-h-48 w-auto rounded-lg"
                                  />
                                </div>
                              )
                            }
                            return null
                          })}
                        </span>
                      </label>
                    )
                  })}
                </div>
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
                <IconCheck className="h-5 w-5" />
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
