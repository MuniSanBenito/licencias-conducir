'use client'

import {
  createTramiteProgreso,
  getTramiteProcesos,
  updateTramiteProgreso,
} from '@/app/actions/tramites'
import { EstadosTramiteEnum } from '@/constants/estados-tramite'
import type { TramiteProceso, TramiteProgreso } from '@/payload-types'
import { IconDeviceFloppy, IconLoader2 } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { twJoin } from 'tailwind-merge'

interface TramiteProgresoFormValues {
  tramite_proceso: string
  etapa: number
  estado: TramiteProgreso['estado']
}

interface TramiteProgresoFormProps {
  defaultValues?: TramiteProgreso
  onSuccess: () => void
  onError: (error: Error) => void
  onCancel: () => void
}

export function TramiteProgresoForm({
  defaultValues,
  onSuccess,
  onError,
  onCancel,
}: TramiteProgresoFormProps) {
  const [procesos, setProcesos] = useState<TramiteProceso[]>([])

  useEffect(() => {
    getTramiteProcesos().then((res) => {
      if (res.ok) setProcesos(res.data!)
    })
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TramiteProgresoFormValues>({
    values: defaultValues
      ? {
          tramite_proceso:
            typeof defaultValues.tramite_proceso === 'object'
              ? defaultValues.tramite_proceso.id
              : defaultValues.tramite_proceso,
          etapa: defaultValues.etapa,
          estado: defaultValues.estado,
        }
      : undefined,
  })

  const onSubmit = handleSubmit(async (data) => {
    const res = await (defaultValues
      ? updateTramiteProgreso(defaultValues.id, data)
      : createTramiteProgreso(data))

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
      {/* Trámite Proceso */}
      <fieldset className="form-control">
        <label className="label" htmlFor="tramite_proceso">
          <span className="label-text">Trámite Proceso</span>
        </label>
        <select
          id="tramite_proceso"
          className={twJoin(
            'select select-bordered w-full',
            errors.tramite_proceso && 'select-error',
          )}
          {...register('tramite_proceso', {
            required: 'Debe seleccionar un proceso',
          })}
        >
          <option value="" disabled>
            Seleccione un proceso
          </option>
          {procesos.map((p) => {
            const tramite = typeof p.tramite === 'object' ? p.tramite : null
            const label =
              tramite && typeof tramite.ciudadano === 'object'
                ? `${tramite.ciudadano.dni} - ${tramite.ciudadano.apellido}, ${tramite.ciudadano.nombre} — ${p.proceso}`
                : `Proceso ${p.id} (${p.proceso})`

            return (
              <option key={p.id} value={p.id}>
                {label}
              </option>
            )
          })}
        </select>
        {errors.tramite_proceso && (
          <label className="label" htmlFor="tramite_proceso">
            <span className="label-text-alt text-error">{errors.tramite_proceso.message}</span>
          </label>
        )}
      </fieldset>

      {/* Etapa */}
      <fieldset className="form-control">
        <label className="label" htmlFor="etapa">
          <span className="label-text">Etapa</span>
        </label>
        <input
          id="etapa"
          type="number"
          min={0}
          placeholder="Ej: 1"
          className={twJoin('input input-bordered w-full', errors.etapa && 'input-error')}
          {...register('etapa', {
            required: 'La etapa es obligatoria',
            valueAsNumber: true,
            min: { value: 0, message: 'La etapa debe ser mayor o igual a 0' },
          })}
        />
        {errors.etapa && (
          <label className="label" htmlFor="etapa">
            <span className="label-text-alt text-error">{errors.etapa.message}</span>
          </label>
        )}
      </fieldset>

      {/* Estado */}
      <fieldset className="form-control">
        <label className="label" htmlFor="estado">
          <span className="label-text">Estado</span>
        </label>
        <select
          id="estado"
          className={twJoin('select select-bordered w-full', errors.estado && 'select-error')}
          {...register('estado', {
            required: 'Debe seleccionar un estado',
          })}
        >
          {Object.values(EstadosTramiteEnum).map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
        {errors.estado && (
          <label className="label" htmlFor="estado">
            <span className="label-text-alt text-error">{errors.estado.message}</span>
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
