'use client'

import { CLASES_LICENCIA } from '@/constants/clases'
import type { Pregunta } from '@/payload-types'
import { sdk } from '@/web/libs/payload/client'
import { IconArrowLeft, IconLoader2, IconPlus, IconTrash } from '@tabler/icons-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface Props {
  pregunta: Pregunta | null
}

interface FormValues {
  consigna: string
  clases: string[]
  opciones: {
    texto: string
    esCorrecta: boolean
  }[]
}

export function PreguntaFormPage({ pregunta }: Props) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isEditing = !!pregunta

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      consigna: pregunta?.consigna || '',
      clases: pregunta?.clases || [],
      opciones: pregunta?.opciones?.map((op) => ({
        texto: op.texto || '',
        esCorrecta: !!op.esCorrecta,
      })) || [
        { texto: '', esCorrecta: false },
        { texto: '', esCorrecta: false },
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'opciones',
  })

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)

    // Validation
    const hasCorrect = data.opciones.some((op) => op.esCorrecta)
    if (!hasCorrect) {
      toast.error('Debe marcar al menos una opción como correcta')
      setIsSubmitting(false)
      return
    }
    
    if (data.opciones.length < 2) {
      toast.error('Debe haber al menos 2 opciones')
      setIsSubmitting(false)
      return
    }

    try {
      if (isEditing) {
        await sdk.update({
          collection: 'pregunta',
          id: pregunta.id,
          data: {
            consigna: data.consigna,
            clases: data.clases as any,
            opciones: data.opciones.map((op, i) => ({
              ...op,
              id: pregunta.opciones?.[i]?.id || undefined, // attempt to keep ids if possible
            })),
          },
        })
        toast.success('Pregunta actualizada con éxito')
        router.push('/gestion-examenes/preguntas')
        router.refresh()
      } else {
        await sdk.create({
          collection: 'pregunta',
          data: {
            consigna: data.consigna,
            clases: data.clases as any,
            opciones: data.opciones.map((op) => ({
              ...op,
            })),
          },
        })
        toast.success('Pregunta creada con éxito')
        router.push('/gestion-examenes/preguntas')
        router.refresh()
      }
    } catch (error) {
      console.error(error)
      toast.error('Ocurrió un error al guardar la pregunta')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section>
      <nav className="breadcrumbs mb-6 text-sm">
        <ul>
          <li>
            <Link href="/gestion-examenes/preguntas" className="gap-1">
              <IconArrowLeft size={14} />
              Banco de Preguntas
            </Link>
          </li>
          <li className="font-semibold">{isEditing ? 'Editar Pregunta' : 'Nueva Pregunta'}</li>
        </ul>
      </nav>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-8">
        <article className="card bg-base-100 shadow-sm border border-base-200">
          <section className="card-body">
            <h2 className="card-title text-lg mb-4">Detalles de la Consigna</h2>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Consigna *</span>
              </label>
              <textarea
                className={`textarea textarea-bordered h-24 ${errors.consigna ? 'textarea-error' : ''}`}
                placeholder="Ejemplo: ¿Cuál es la velocidad máxima en calles urbanas?"
                {...register('consigna', { required: 'La consigna es obligatoria' })}
              />
              {errors.consigna && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.consigna.message}</span>
                </label>
              )}
            </div>

            <div className="form-control w-full mt-4">
              <label className="label">
                <span className="label-text font-medium">Clases de Licencia *</span>
              </label>
              <div className="flex flex-wrap gap-4">
                <label className="cursor-pointer flex items-center gap-2">
                  <input
                    type="checkbox"
                    value="all"
                    className="checkbox checkbox-primary checkbox-sm"
                    {...register('clases', { required: 'Debe seleccionar al menos una clase' })}
                  />
                  <span>Todas (all)</span>
                </label>
                {CLASES_LICENCIA.map((clase) => (
                  <label key={clase} className="cursor-pointer flex items-center gap-2">
                    <input
                      type="checkbox"
                      value={clase}
                      className="checkbox checkbox-primary checkbox-sm"
                      {...register('clases')}
                    />
                    <span>{clase}</span>
                  </label>
                ))}
              </div>
              {errors.clases && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.clases.message}</span>
                </label>
              )}
            </div>
          </section>
        </article>

        <article className="card bg-base-100 shadow-sm border border-base-200">
          <section className="card-body">
            <h2 className="card-title text-lg mb-4 flex justify-between items-center">
              Opciones
              <button
                type="button"
                className="btn btn-sm btn-outline"
                onClick={() => append({ texto: '', esCorrecta: false })}
              >
                <IconPlus size={16} /> Agregar Opción
              </button>
            </h2>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-4 p-4 border border-base-200 rounded-box bg-base-50">
                  <div className="flex-1 space-y-3">
                    <div className="form-control w-full">
                      <input
                        type="text"
                        placeholder="Texto de la opción"
                        className="input input-bordered w-full"
                        {...register(`opciones.${index}.texto` as const, { required: true })}
                      />
                    </div>
                    <label className="cursor-pointer flex items-center gap-2 w-max">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-success checkbox-sm"
                        {...register(`opciones.${index}.esCorrecta` as const)}
                      />
                      <span className="text-sm font-medium">Es respuesta correcta</span>
                    </label>
                  </div>
                  
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm text-error"
                    onClick={() => remove(index)}
                    title="Eliminar opción"
                  >
                    <IconTrash size={18} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </article>

        <div className="flex justify-end gap-2">
          <Link href="/gestion-examenes/preguntas" className="btn btn-ghost">
            Cancelar
          </Link>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting && <IconLoader2 className="animate-spin" size={18} />}
            {isEditing ? 'Guardar Cambios' : 'Crear Pregunta'}
          </button>
        </div>
      </form>
    </section>
  )
}
