'use client'
import { Logo } from '@/payload/brand/logo'
import { toast } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'

export default function IniciarExamenPage() {
  const router = useRouter()

  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)

    const dni: string = event.currentTarget.dni.value
    if (!dni) {
      toast.error('Por favor ingrese un DNI')
      setIsSubmitting(false)
      return
    }

    router.push(`/examen/${dni}`)

    /* const res = await iniciarExamen({ dni })
    setIsSubmitting(false)

    if (!res.ok) {
      toast.error(res.message)
      return
    }

    router.push(`/examen/${res.examen.id}`) */
  }

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-8">
      <Logo height={100} />
      <form className="flex flex-col items-center gap-6" onSubmit={handleSubmit}>
        <h2 className="font-bold">Ingrese su DNI para comenzar el examen</h2>
        <fieldset className="fieldset w-full">
          <label htmlFor="dni" className="fieldset-legend">
            DNI
          </label>
          <input
            name="dni"
            id="dni"
            type="number"
            min={1000000}
            max={999999999}
            required
            placeholder="27384961"
            className="input"
          />
          <span className="label">Ingrese su DNI, sin puntos ni espacios</span>
        </fieldset>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          Iniciar examen
        </button>
      </form>
    </main>
  )
}
