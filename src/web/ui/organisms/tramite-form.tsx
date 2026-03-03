'use client'

import { getCiudadanos } from '@/app/actions/ciudadano'
import { createTramite, updateTramite } from '@/app/actions/tramites'
import type { Ciudadano, Tramite } from '@/payload-types'
import { IconDeviceFloppy, IconLoader2 } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { twJoin } from 'tailwind-merge'

interface TramiteFormValues {
  ciudadano: string
  fut: string
}

interface TramiteFormProps {
  defaultValues?: Tramite
  onSuccess: () => void
  onError: (error: Error) => void
  onCancel: () => void
}

export function TramiteForm({ defaultValues, onSuccess, onError, onCancel }: TramiteFormProps) {
  const [ciudadanos, setCiudadanos] = useState<Ciudadano[]>([])

  useEffect(() => {
    getCiudadanos().then((res) => {
      if (res.ok) setCiudadanos(res.data!)
    })
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TramiteFormValues>({
    values: defaultValues
      ? {
          ciudadano:
            typeof defaultValues.ciudadano === 'object'
              ? defaultValues.ciudadano.id
              : defaultValues.ciudadano,
          fut: defaultValues.fut || '',
        }
      : undefined,
  })

  const onSubmit = handleSubmit(async (data) => {
    const res = await (defaultValues ? updateTramite(defaultValues.id, data) : createTramite(data))

    if (res.ok) {
      toast.success(res.message)
      onSuccess()
    } else {
      toast.error(res.message)
      onError(new Error(res.message))
    }
  })

  return (
    <form className="bg-base-100 rounded-box space-y-6 p-6 shadow" onSubmit={onSubmit}>
      {/* Ciudadano */}
      <fieldset className="form-control">
        <label className="label" htmlFor="ciudadano">
          <span className="label-text">Ciudadano</span>
        </label>
        <select
          id="ciudadano"
          className={twJoin('select select-bordered w-full', errors.ciudadano && 'select-error')}
          {...register('ciudadano', {
            required: 'Debe seleccionar un ciudadano',
          })}
        >
          <option value="" disabled>
            Seleccione un ciudadano
          </option>
          {ciudadanos.map((c) => (
            <option key={c.id} value={c.id}>
              {c.dni} - {c.nombre} {c.apellido}
            </option>
          ))}
        </select>
        {errors.ciudadano && (
          <label className="label" htmlFor="ciudadano">
            <span className="label-text-alt text-error">{errors.ciudadano.message}</span>
          </label>
        )}
      </fieldset>

      {/* FUT */}
      <fieldset className="form-control">
        <label className="label" htmlFor="fut">
          <span className="label-text">FUT</span>
        </label>
        <input
          id="fut"
          type="text"
          placeholder="Ej: FUT-001"
          className={twJoin('input input-bordered w-full', errors.fut && 'input-error')}
          {...register('fut')}
        />
        {errors.fut && (
          <label className="label" htmlFor="fut">
            <span className="label-text-alt text-error">{errors.fut.message}</span>
          </label>
        )}
      </fieldset>

      {/* Acciones */}
      <footer className="flex justify-end gap-3 pt-2">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? (
            <IconLoader2 size={20} className="animate-spin" />
          ) : (
            <IconDeviceFloppy size={20} />
          )}
          {isSubmitting ? 'Guardando...' : 'Guardar'}
        </button>
      </footer>
    </form>
  )
}
