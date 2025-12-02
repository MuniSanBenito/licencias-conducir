'use client'

import type { Examen as ExamenMock } from '@/mocks/examenes'
import { Logo } from '@/payload/brand/logo'
import { IconCheck, IconX } from '@tabler/icons-react'
import Image from 'next/image'
import type { FormEvent } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'

interface ExamenPageClientProps {
  examen: ExamenMock
}

const STORAGE_PREFIX = 'examen_'

function getStorageKey(examenId: string): string {
  return `${STORAGE_PREFIX}${examenId}`
}

function saveRespuestasToStorage(examenId: string, respuestas: Record<string, number>): void {
  try {
    const data = {
      respuestas,
      timestamp: Date.now(),
      examenId,
    }
    localStorage.setItem(getStorageKey(examenId), JSON.stringify(data))
  } catch (error) {
    console.error('Error guardando en localStorage:', error)
  }
}

function loadRespuestasFromStorage(examenId: string): Record<string, number> | null {
  try {
    const stored = localStorage.getItem(getStorageKey(examenId))
    if (!stored) return null

    const data = JSON.parse(stored)
    // Validar que sea del mismo examen
    if (data.examenId === examenId) {
      return data.respuestas
    }
    return null
  } catch (error) {
    console.error('Error cargando desde localStorage:', error)
    return null
  }
}

function clearExamenFromStorage(examenId: string): void {
  try {
    localStorage.removeItem(getStorageKey(examenId))
  } catch (error) {
    console.error('Error limpiando localStorage:', error)
  }
}

export function ExamenPageClient({ examen }: ExamenPageClientProps) {
  const examenId = useMemo(() => examen.dni, [examen.dni])

  // Inicializar estado desde localStorage si existe
  const [respuestas, setRespuestas] = useState<Record<string, number>>(() => {
    if (typeof window === 'undefined') return {}
    return loadRespuestasFromStorage(examenId) || {}
  })

  const totalConsignas = useMemo(() => examen.consignas.length, [examen.consignas])
  const respondidas = useMemo(() => Object.keys(respuestas).length, [respuestas])
  const progreso = useMemo(
    () => (totalConsignas > 0 ? Math.round((respondidas / totalConsignas) * 100) : 0),
    [respondidas, totalConsignas],
  )

  const [guardadoReciente, setGuardadoReciente] = useState(false)
  const [mostrarAlertaRecuperado, setMostrarAlertaRecuperado] = useState(() => {
    // Verificar si hay datos recuperados al inicializar
    if (typeof window === 'undefined') return false
    const stored = loadRespuestasFromStorage(examenId)
    return stored !== null && Object.keys(stored).length > 0
  })

  // Auto-ocultar alerta después de 5 segundos
  useEffect(() => {
    if (mostrarAlertaRecuperado) {
      const timer = setTimeout(() => setMostrarAlertaRecuperado(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [mostrarAlertaRecuperado])

  const fechaActual = useMemo(
    () =>
      new Date().toLocaleDateString('es-AR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    [],
  )

  const handleRespuestaChange = useCallback(
    (consignaId: string, opcionIndex: number) => {
      setRespuestas((prev) => {
        const newRespuestas = { ...prev, [consignaId]: opcionIndex }
        // Guardar en localStorage cada vez que cambia una respuesta
        saveRespuestasToStorage(examenId, newRespuestas)
        return newRespuestas
      })
    },
    [examenId],
  )

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      console.log('Respuestas:', respuestas)

      // Simular envío al backend
      // TODO: Reemplazar con llamada real a la API
      const envioExitoso = true // Simular respuesta exitosa

      if (envioExitoso) {
        // Limpiar localStorage solo si el envío fue exitoso
        clearExamenFromStorage(examenId)
        console.log('Examen enviado exitosamente y datos limpiados de localStorage')
        // Aquí podrías redirigir a una página de resultados
      }
    },
    [respuestas, examenId],
  )

  const handleGuardarBorrador = useCallback(() => {
    saveRespuestasToStorage(examenId, respuestas)
    setGuardadoReciente(true)
    setTimeout(() => setGuardadoReciente(false), 2000)
  }, [examenId, respuestas])

  return (
    <div className="mx-auto min-h-dvh max-w-4xl p-3 sm:p-6">
      {/* Header con logo e info */}
      <div className="mb-4 border-b pb-3 sm:mb-8 sm:pb-6">
        <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4">
          <div className="h-10 sm:h-[60px]">
            <Logo height={40} />
          </div>
          <div className="text-right">
            <div className="text-base-content/70 text-xs sm:text-sm">
              {fechaActual.charAt(0).toUpperCase() + fechaActual.slice(1)}
            </div>
            <div className="text-base-content/60 mt-0.5 text-[10px] sm:mt-1 sm:text-xs">
              Municipalidad de San Benito
            </div>
          </div>
        </div>
      </div>

      {/* Header con stats */}
      <div className="mb-4 sm:mb-8">
        <h1 className="text-xl font-bold sm:text-3xl">{examen.titulo}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-2 sm:mt-4 sm:gap-4">
          <div className="badge badge-primary badge-sm sm:badge-lg">
            Categorías: {examen.categorias.join(', ')}
          </div>
          <div className="badge badge-neutral badge-sm sm:badge-lg">
            {respondidas} de {totalConsignas} respondidas
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 sm:mt-4">
          <progress className="progress progress-primary w-full" value={progreso} max={100} />
        </div>

        {/* Alerta de datos recuperados */}
        {mostrarAlertaRecuperado && (
          <div className="alert alert-info mt-3 text-sm sm:mt-4">
            <IconCheck className="h-5 w-5" />
            <span>Se recuperaron tus respuestas anteriores</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 pb-24 sm:space-y-6 sm:pb-28">
        {examen.consignas.map((consigna, index) => {
          const consignaId = consigna.id
          const isAnswered = consignaId in respuestas

          return (
            <div key={consigna.id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-start justify-between gap-2 sm:gap-4">
                  <h2 className="card-title flex-1 text-base sm:text-xl">
                    <span className="badge badge-neutral badge-sm sm:badge-md mr-1 sm:mr-2">
                      {index + 1}
                    </span>
                    {consigna.pregunta}
                  </h2>
                  {consigna.eliminatoria && (
                    <div className="badge badge-error badge-sm sm:badge-md flex items-center gap-1 sm:gap-2">
                      <IconX className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Eliminatoria</span>
                      <span className="sm:hidden">Elim.</span>
                    </div>
                  )}
                </div>

                {consigna.opciones.every((op) => op.contenido.tipo === 'texto') ? (
                  <div className="mt-3 space-y-2 sm:mt-4">
                    {consigna.opciones.map((opcion, opcionIndex) => {
                      const isSelected = respuestas[consignaId] === opcionIndex
                      const radioId = `consigna-${consignaId}-opcion-${opcionIndex}`

                      return (
                        <label
                          key={opcion.id}
                          htmlFor={radioId}
                          className={`flex cursor-pointer items-start gap-3 rounded-lg border-2 p-3 transition-all sm:gap-4 sm:p-4 ${
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
                          <span className="flex-1 text-sm sm:text-base">
                            {opcion.contenido.tipo === 'texto' ? opcion.contenido.texto : ''}
                          </span>
                        </label>
                      )
                    })}
                  </div>
                ) : (
                  <div className="mt-3 grid grid-cols-1 gap-2 sm:mt-4 sm:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] sm:gap-3">
                    {consigna.opciones.map((opcion, opcionIndex) => {
                      const isSelected = respuestas[consignaId] === opcionIndex
                      const radioId = `consigna-${consignaId}-opcion-${opcionIndex}`

                      return (
                        <label
                          key={opcion.id}
                          htmlFor={radioId}
                          className={`flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 p-2 transition-all sm:gap-3 sm:p-3 ${
                            isSelected
                              ? 'border-primary bg-primary/10'
                              : 'border-base-300 hover:border-primary/50'
                          }`}
                        >
                          <input
                            type="radio"
                            id={radioId}
                            name={`consigna-${consignaId}`}
                            className="radio radio-primary"
                            value={opcionIndex}
                            checked={isSelected}
                            onChange={() => handleRespuestaChange(consignaId, opcionIndex)}
                          />
                          <div className="text-center text-sm sm:text-base">
                            {opcion.contenido.tipo === 'texto' ? (
                              <span>{opcion.contenido.texto}</span>
                            ) : (
                              <Image
                                src={opcion.contenido.url}
                                alt="Opción"
                                width={300}
                                height={180}
                                className="h-auto w-full max-w-[300px] rounded-lg object-cover sm:h-[180px] sm:w-[300px]"
                                unoptimized
                              />
                            )}
                          </div>
                        </label>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {/* Botones sticky */}
        <div className="bg-base-100 fixed right-0 bottom-0 left-0 z-10 flex flex-col gap-2 border-t p-3 shadow-lg sm:sticky sm:flex-row sm:justify-end sm:gap-3 sm:p-6">
          <button
            type="button"
            className="btn btn-outline btn-neutral btn-sm sm:btn-md"
            onClick={handleGuardarBorrador}
          >
            {guardadoReciente ? (
              <>
                <IconCheck className="mr-1 h-4 w-4" />
                <span className="hidden sm:inline">Guardado</span>
                <span className="sm:hidden">✓</span>
              </>
            ) : (
              <>
                <span className="hidden sm:inline">Guardar borrador</span>
                <span className="sm:hidden">Guardar</span>
              </>
            )}
          </button>
          <button
            type="submit"
            className="btn btn-primary btn-sm sm:btn-md"
            disabled={respondidas !== totalConsignas}
          >
            {respondidas === totalConsignas ? (
              <>
                <IconCheck className="mr-1 h-4 w-4 sm:mr-2 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">Finalizar examen</span>
                <span className="sm:hidden">Finalizar</span>
              </>
            ) : (
              <>
                <span className="hidden sm:inline">{`Responde todas (${totalConsignas - respondidas} restantes)`}</span>
                <span className="sm:hidden">{`${totalConsignas - respondidas} restantes`}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
