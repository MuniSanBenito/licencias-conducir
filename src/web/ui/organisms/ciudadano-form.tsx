'use client'

import { createCiudadano, updateCiudadano } from '@/app/actions/ciudadano'
import type { Ciudadano } from '@/payload-types'
import { IconDeviceFloppy, IconLoader2 } from '@tabler/icons-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { twJoin } from 'tailwind-merge'

const DNI_MIN_LENGTH = 7
const DNI_MAX_LENGTH = 8
const NOMBRE_MIN_LENGTH = 2
const NOMBRE_MAX_LENGTH = 50

interface CiudadanoFormProps {
  defaultValues?: Ciudadano
  onSuccess: () => void
  onError: (error: Error) => void
  onCancel: () => void
}
export function CiudadanoForm({ defaultValues, onSuccess, onError, onCancel }: CiudadanoFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Ciudadano>({
    values: defaultValues
      ? {
          ...defaultValues,
          fecha_nacimiento: defaultValues.fecha_nacimiento.split('T')[0],
        }
      : undefined,
  })

  const onSubmit = handleSubmit(async (data) => {
    const res = await (defaultValues
      ? updateCiudadano(defaultValues.id, data)
      : createCiudadano(data))

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
      {/* DNI */}
      <fieldset className="form-control">
        <label className="label" htmlFor="dni">
          <span className="label-text">DNI</span>
        </label>
        <input
          id="dni"
          type="text"
          inputMode="numeric"
          placeholder="Ej: 12345678"
          className={twJoin('input input-bordered w-full', errors.dni && 'input-error')}
          {...register('dni', {
            required: 'El DNI es obligatorio',
            minLength: {
              value: DNI_MIN_LENGTH,
              message: `El DNI debe tener al menos ${DNI_MIN_LENGTH} dígitos`,
            },
            maxLength: {
              value: DNI_MAX_LENGTH,
              message: `El DNI no puede exceder ${DNI_MAX_LENGTH} dígitos`,
            },
            pattern: { value: /^\d+$/, message: 'El DNI solo debe contener números' },
          })}
        />
        {errors.dni && (
          <label className="label" htmlFor="dni">
            <span className="label-text-alt text-error">{errors.dni.message}</span>
          </label>
        )}
      </fieldset>

      {/* Nombre y Apellido */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <fieldset className="form-control">
          <label className="label" htmlFor="nombre">
            <span className="label-text">Nombre</span>
          </label>
          <input
            id="nombre"
            type="text"
            placeholder="Ej: Juan"
            className={twJoin('input input-bordered w-full', errors.nombre && 'input-error')}
            {...register('nombre', {
              required: 'El nombre es obligatorio',
              minLength: {
                value: NOMBRE_MIN_LENGTH,
                message: `Mínimo ${NOMBRE_MIN_LENGTH} caracteres`,
              },
              maxLength: {
                value: NOMBRE_MAX_LENGTH,
                message: `Máximo ${NOMBRE_MAX_LENGTH} caracteres`,
              },
            })}
          />
          {errors.nombre && (
            <label className="label" htmlFor="nombre">
              <span className="label-text-alt text-error">{errors.nombre.message}</span>
            </label>
          )}
        </fieldset>

        <fieldset className="form-control">
          <label className="label" htmlFor="apellido">
            <span className="label-text">Apellido</span>
          </label>
          <input
            id="apellido"
            type="text"
            placeholder="Ej: Pérez"
            className={twJoin('input input-bordered w-full', errors.apellido && 'input-error')}
            {...register('apellido', {
              required: 'El apellido es obligatorio',
              minLength: {
                value: NOMBRE_MIN_LENGTH,
                message: `Mínimo ${NOMBRE_MIN_LENGTH} caracteres`,
              },
              maxLength: {
                value: NOMBRE_MAX_LENGTH,
                message: `Máximo ${NOMBRE_MAX_LENGTH} caracteres`,
              },
            })}
          />
          {errors.apellido && (
            <label className="label" htmlFor="apellido">
              <span className="label-text-alt text-error">{errors.apellido.message}</span>
            </label>
          )}
        </fieldset>
      </div>

      {/* Email */}
      <fieldset className="form-control">
        <label className="label" htmlFor="email">
          <span className="label-text">Email</span>
        </label>
        <input
          id="email"
          type="email"
          placeholder="juan.perez@email.com"
          className={twJoin('input input-bordered w-full', errors.email && 'input-error')}
          {...register('email', {
            required: 'El email es obligatorio',
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: 'Ingrese un email válido',
            },
          })}
        />
        {errors.email && (
          <label className="label" htmlFor="email">
            <span className="label-text-alt text-error">{errors.email.message}</span>
          </label>
        )}
      </fieldset>

      {/* Fecha de Nacimiento */}
      <fieldset className="form-control">
        <label className="label" htmlFor="fecha_nacimiento">
          <span className="label-text">Fecha de Nacimiento</span>
        </label>
        <input
          id="fecha_nacimiento"
          type="date"
          className={twJoin(
            'input input-bordered w-full',
            errors.fecha_nacimiento && 'input-error',
          )}
          {...register('fecha_nacimiento', {
            required: 'La fecha de nacimiento es obligatoria',
            validate: (value) => {
              const selected = new Date(value)
              const today = new Date()
              today.setHours(0, 0, 0, 0)
              if (selected >= today) return 'La fecha debe ser anterior a hoy'
              return true
            },
          })}
        />
        {errors.fecha_nacimiento && (
          <label className="label" htmlFor="fecha_nacimiento">
            <span className="label-text-alt text-error">{errors.fecha_nacimiento.message}</span>
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
