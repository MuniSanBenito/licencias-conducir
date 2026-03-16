'use client'

import { IconId, IconLoader2 } from '@tabler/icons-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

interface FormData {
  dni: string
}

export function IngresoExamenPage() {
  const router = useRouter()
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    setErrorMsg(null)
    
    try {
      const res = await fetch(`/api/examenes/validar-dni?dni=${data.dni}`)
      const result = await res.json()
      
      if (!res.ok) {
        setErrorMsg(result.error || 'Ocurrió un error al validar su identidad.')
        return
      }

      if (result.estado === 'abierto') {
        router.push(`/examenes/${result.examenId}`)
      } else if (result.estado === 'cerrado') {
        router.push(`/examenes/${result.examenId}/resultado`)
      } else {
        setErrorMsg('No se encontraron exámenes asignados para este DNI en este momento. Por favor, comuníquese con el Área de Licencias.')
      }
    } catch (e) {
      setErrorMsg('Error de red. Intente nuevamente.')
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-base-200 px-4 py-12">
      <article className="card w-full max-w-md bg-base-100 shadow-xl">
        <section className="card-body mt-4 items-center text-center">
          <h1 className="text-2xl font-bold">Examen Teórico</h1>
          <p className="text-sm opacity-80">
            Ingrese su Documento Nacional de Identidad para acceder a su examen asigando.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="w-full mt-6 space-y-4">
            <section className="form-control w-full">
              <label className="label">
                <span className="label-text">DNI (Sin puntos)</span>
              </label>
              <section className="relative">
                <IconId
                  size={20}
                  className="text-base-content/40 absolute top-1/2 left-3 -translate-y-1/2"
                />
                <input
                  type="text"
                  placeholder="Ej: 35123456"
                  className={`input input-bordered w-full pl-10 ${errors.dni ? 'input-error' : ''}`}
                  {...register('dni', {
                    required: 'El DNI es obligatorio',
                    pattern: {
                      value: /^[0-9]+$/,
                      message: 'El DNI solo debe contener números',
                    },
                  })}
                />
              </section>
              {errors.dni && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.dni.message}</span>
                </label>
              )}
            </section>

            {errorMsg && (
              <section className="alert alert-error text-sm">
                <span>{errorMsg}</span>
              </section>
            )}

            <section className="form-control mt-6">
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? <IconLoader2 className="animate-spin" /> : 'Ingresar'}
              </button>
            </section>
          </form>
        </section>
      </article>
    </main>
  )
}
