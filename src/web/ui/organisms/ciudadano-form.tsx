'use client'
import type { Ciudadano } from '@/payload-types'
import { sdk } from '@/web/libs/payload/client'
import { PayloadSDKError } from '@payloadcms/sdk'
import { IconDeviceFloppy, IconLoader2 } from '@tabler/icons-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { twJoin } from 'tailwind-merge'
import { FormField } from '../atoms/form-field'

const DNI_MIN_LENGTH = 7
const DNI_MAX_LENGTH = 8
const NOMBRE_MIN_LENGTH = 2
const NOMBRE_MAX_LENGTH = 50
const DNI_PATTERN = /^\d+$/
const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

interface CiudadanoFormProps {
  defaultValues?: Ciudadano
  onSuccess: () => void
  onError: (error?: Error) => void
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
          fechaNacimiento: defaultValues.fechaNacimiento.split('T')[0],
        }
      : undefined,
  })

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await (defaultValues
        ? sdk.update({
            collection: 'ciudadano',
            id: defaultValues.id,
            data,
          })
        : sdk.create({
            collection: 'ciudadano',
            data,
          }))

      if (response?.id) {
        toast.success(`Ciudadano ${defaultValues ? 'actualizado' : 'creado'} correctamente`)
        return onSuccess()
      } else {
        throw new Error('Error al guardar el ciudadano')
      }
    } catch (error) {
      console.error(error)
      if (error instanceof PayloadSDKError) {
        error.errors.forEach((err) => toast.error(err.message))
      } else {
        toast.error('Error al guardar el ciudadano')
      }
      onError()
    }
  })

  return (
    <form
      className="bg-base-100 rounded-box space-y-6 p-6 shadow"
      onSubmit={onSubmit}
      aria-busy={isSubmitting}
    >
      {/* DNI */}
      <FormField id="dni" label="DNI" error={errors.dni}>
        <input
          id="dni"
          type="text"
          inputMode="numeric"
          placeholder="Ej: 12345678"
          className={twJoin('input input-bordered w-full', errors.dni && 'input-error')}
          aria-invalid={!!errors.dni}
          aria-describedby={errors.dni ? 'dni-error' : undefined}
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
            pattern: { value: DNI_PATTERN, message: 'El DNI solo debe contener números' },
          })}
        />
      </FormField>

      {/* Nombre y Apellido */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormField id="nombre" label="Nombre" error={errors.nombre}>
          <input
            id="nombre"
            type="text"
            placeholder="Ej: Juan"
            className={twJoin('input input-bordered w-full', errors.nombre && 'input-error')}
            aria-invalid={!!errors.nombre}
            aria-describedby={errors.nombre ? 'nombre-error' : undefined}
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
        </FormField>

        <FormField id="apellido" label="Apellido" error={errors.apellido}>
          <input
            id="apellido"
            type="text"
            placeholder="Ej: Pérez"
            className={twJoin('input input-bordered w-full', errors.apellido && 'input-error')}
            aria-invalid={!!errors.apellido}
            aria-describedby={errors.apellido ? 'apellido-error' : undefined}
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
        </FormField>
      </div>

      {/* Email */}
      <FormField id="email" label="Email" error={errors.email}>
        <input
          id="email"
          type="email"
          placeholder="juan.perez@email.com"
          className={twJoin('input input-bordered w-full', errors.email && 'input-error')}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          {...register('email', {
            required: 'El email es obligatorio',
            pattern: { value: EMAIL_PATTERN, message: 'Ingrese un email válido' },
          })}
        />
      </FormField>

      {/* Celular */}
      <FormField id="celular" label="Celular" error={errors.celular}>
        <input
          id="celular"
          type="tel"
          placeholder="Ej: 3364123456"
          className={twJoin('input input-bordered w-full', errors.celular && 'input-error')}
          {...register('celular')}
        />
      </FormField>

      {/* Domicilio */}
      <FormField id="domicilio" label="Domicilio" error={errors.domicilio}>
        <input
          id="domicilio"
          type="text"
          placeholder="Ej: San Martin 123"
          className={twJoin('input input-bordered w-full', errors.domicilio && 'input-error')}
          {...register('domicilio')}
        />
      </FormField>

      {/* Fecha de Nacimiento */}
      <FormField id="fecha_nacimiento" label="Fecha de Nacimiento" error={errors.fechaNacimiento}>
        <input
          id="fecha_nacimiento"
          type="date"
          className={twJoin('input input-bordered w-full', errors.fechaNacimiento && 'input-error')}
          aria-invalid={!!errors.fechaNacimiento}
          aria-describedby={errors.fechaNacimiento ? 'fecha_nacimiento-error' : undefined}
          {...register('fechaNacimiento', {
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
      </FormField>

      {/* Acciones */}
      <footer className="flex justify-end gap-3 pt-2">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? (
            <IconLoader2 size={20} className="animate-spin" aria-hidden="true" />
          ) : (
            <IconDeviceFloppy size={20} aria-hidden="true" />
          )}
          {isSubmitting ? 'Guardando...' : 'Guardar'}
        </button>
      </footer>
    </form>
  )
}
