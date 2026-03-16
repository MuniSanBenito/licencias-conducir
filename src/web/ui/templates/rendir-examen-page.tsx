'use client'

import type { Examan as Examen } from '@/payload-types'
import { IconAlertTriangle, IconCheck, IconClock, IconLoader2 } from '@tabler/icons-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Props {
  examen: Examen
}

export function RendirExamenPage({ examen }: Props) {
  const router = useRouter()
  const [respuestas, setRespuestas] = useState<Record<string, string[]>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  
  // Convert payload date to timestamp
  const endTime = new Date(examen.fechaFin).getTime()
  const [timeLeft, setTimeLeft] = useState(endTime - Date.now())

  useEffect(() => {
    // Restore answers from local storage just in case page reloads
    const saved = localStorage.getItem(`examen_${examen.id}`)
    if (saved) {
      try {
        setRespuestas(JSON.parse(saved))
      } catch (e) {
        // ignore
      }
    }

    const timer = setInterval(() => {
      const remaining = endTime - Date.now()
      setTimeLeft(remaining)
      
      if (remaining <= 0) {
        clearInterval(timer)
        // Auto-submit when time is up
        handleSubmit(true)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [examen.id, endTime])

  // Format mm:ss
  const formatTime = (ms: number) => {
    if (ms <= 0) return '00:00'
    const totalSeconds = Math.floor(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const handleToggleOption = (preguntaId: string, opcionId: string) => {
    setRespuestas((prev) => {
      const selected = prev[preguntaId] || []
      const isSelected = selected.includes(opcionId)
      
      const updated = isSelected
        ? selected.filter((id) => id !== opcionId)
        : [...selected, opcionId]
      
      const newState = { ...prev, [preguntaId]: updated }
      localStorage.setItem(`examen_${examen.id}`, JSON.stringify(newState))
      return newState
    })
  }

  const handleSubmit = async (isAutoSubmit = false) => {
    if (!isAutoSubmit) {
      const allAnswered = examen.preguntasGeneradas.every(
        (p) => respuestas[p.preguntaOriginal as string]?.length > 0
      )
      
      if (!allAnswered) {
        const confirmResult = window.confirm(
          'Hay preguntas sin responder. ¿Estás seguro que deseas finalizar el examen?'
        )
        if (!confirmResult) return
      } else {
        const confirmResult = window.confirm(
          '¿Estás seguro que deseas finalizar el examen? No podrás cambiar las respuestas luego.'
        )
        if (!confirmResult) return
      }
    }

    setIsSubmitting(true)
    setErrorMsg(null)

    try {
      const req = await fetch(`/api/examenes/${examen.id}/finalizar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ respuestas }),
      })
      const result = await req.json()

      if (!req.ok) {
        setErrorMsg(result.error || 'Ocurrió un error al enviar el examen.')
        setIsSubmitting(false)
        return
      }

      localStorage.removeItem(`examen_${examen.id}`)
      router.push(`/examenes/${examen.id}/resultado`)
    } catch (e) {
      setErrorMsg('Error de red al intentar enviar el examen.')
      setIsSubmitting(false)
    }
  }

  const renderOpcionImagen = (imgId: any) => {
    // Depending on upload config, imgId could be string ID or populated object
    if (!imgId) return null
    // Here we assume it's an object with url if populated, or we skip if just ID for now
    const url = typeof imgId === 'object' ? imgId.url : `/api/media/file/${imgId}` 
    return (
      <Image src={url} alt="Opción" width={100} height={100} className="rounded mb-2 object-contain" />
    )
  }

  return (
    <main className="min-h-screen bg-base-200 py-8 px-4 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-4xl space-y-6">
        
        {/* Header / StatusBar */}
        <section className="bg-base-100 rounded-box shadow flex items-center justify-between p-4 sticky top-4 z-50 border-2 border-primary/20">
          <div className="flex flex-col">
            <h1 className="font-bold text-lg">Examen Teórico</h1>
            <span className="text-sm opacity-70">
              {typeof examen.ciudadano === 'object' 
                ? `${examen.ciudadano.nombre} ${examen.ciudadano.apellido}`
                : `Respondiendo a Trámite: ${(examen.tramite as any)?.fut || 'N/A'}`
              }
            </span>
          </div>

          <div className={`flex items-center gap-2 font-mono text-xl md:text-2xl font-bold ${timeLeft < 60000 ? 'text-error animate-pulse' : 'text-primary'}`}>
            <IconClock />
            {formatTime(timeLeft)}
          </div>
        </section>

        {/* Questions List */}
        <section className="space-y-8">
          {examen.preguntasGeneradas.map((preg, index) => {
            const pId = preg.preguntaOriginal as string
            const isAnswered = respuestas[pId]?.length > 0

            return (
              <article key={pId} id={`pregunta-${index}`} className={`bg-base-100 rounded-box p-6 shadow-sm border-l-4 transition-colors ${isAnswered ? 'border-l-success' : 'border-l-base-300'}`}>
                <header className="mb-6 border-b border-base-200 pb-4">
                  <h2 className="text-xl font-medium mb-1 flex items-start justify-between gap-4">
                    <span>
                      <span className="text-primary font-bold mr-2">{index + 1}.</span> 
                      {preg.consigna}
                    </span>
                    {isAnswered && <IconCheck className="text-success shrink-0" />}
                  </h2>
                  
                  {/* Si hay imagen en la consigna */}
                  {preg.imagenConsigna && (
                    <div className="mt-4 bg-base-200 inline-block p-2 rounded">
                      <Image 
                        src={typeof preg.imagenConsigna === 'object' ? preg.imagenConsigna.url! : `/api/media/file/${preg.imagenConsigna}`} 
                        alt="Imagen de consigna" 
                        width={300} 
                        height={200} 
                        className="rounded"
                      />
                    </div>
                  )}
                  <p className="text-sm text-base-content/60 mt-2 font-semibold">Seleccione una o más opciones correctas:</p>
                </header>

                <div className="grid gap-3 sm:grid-cols-2">
                  {preg.opciones.map((opcion) => {
                    const isSelected = respuestas[pId]?.includes(opcion.idOp)

                    return (
                      <label 
                        key={opcion.idOp} 
                        className={`
                          flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-all
                          hover:bg-primary/5 
                          ${isSelected ? 'border-primary bg-primary/10 ring-1 ring-primary' : 'border-base-300'}
                        `}
                      >
                        <input
                          type="checkbox"
                          className="checkbox checkbox-primary mt-0.5 checkbox-sm md:checkbox-md"
                          checked={isSelected}
                          onChange={() => handleToggleOption(pId, opcion.idOp)}
                        />
                        <div className="flex flex-col">
                          {opcion.imagen && renderOpcionImagen(opcion.imagen)}
                          {opcion.texto && <span className={isSelected ? 'font-medium text-primary' : ''}>{opcion.texto}</span>}
                        </div>
                      </label>
                    )
                  })}
                </div>
              </article>
            )
          })}
        </section>

        {errorMsg && (
          <div className="alert alert-error">
            <IconAlertTriangle />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Footer actions */}
        <section className="bg-base-100 rounded-box p-6 shadow text-right">
          <button 
            className="btn btn-primary btn-lg w-full md:w-auto"
            onClick={() => handleSubmit(false)}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <IconLoader2 className="animate-spin" /> Procesando...
              </>
            ) : (
              'Finalizar Examen'
            )}
          </button>
        </section>

      </article>
    </main>
  )
}
