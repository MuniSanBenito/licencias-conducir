'use client'

import { createCiudadano, updateCiudadano } from '@/app/actions/ciudadano'
import type { Ciudadano } from '@/payload-types'
import { useState, type FormEvent } from 'react'
import { toast } from 'sonner'

interface CiudadanoFormProps {
  initialData?: Ciudadano
  onSuccess: () => void
  onCancel: () => void
}

export function CiudadanoForm({ initialData, onSuccess, onCancel }: CiudadanoFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const data = {
      dni: formData.get('dni') as string,
      nombre: formData.get('nombre') as string,
      apellido: formData.get('apellido') as string,
      email: formData.get('email') as string,
      fecha_nacimiento: formData.get('fecha_nacimiento') as string,
    }

    try {
      let res
      if (initialData?.id) {
        res = await updateCiudadano(initialData.id, data)
      } else {
        res = await createCiudadano(data)
      }

      if (res.ok) {
        toast.success(initialData ? 'Ciudadano actualizado' : 'Ciudadano creado')
        onSuccess()
      } else {
        setError(res.message)
        toast.error(res.message)
      }
    } catch (err) {
      setError('Error inesperado')
      toast.error('Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="alert alert-error text-sm">{error}</div>}

      <div className="form-control">
        <label className="label">
          <span className="label-text">DNI</span>
        </label>
        <input
          type="text"
          name="dni"
          defaultValue={initialData?.dni}
          className="input input-bordered w-full"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Nombre</span>
          </label>
          <input
            type="text"
            name="nombre"
            defaultValue={initialData?.nombre}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Apellido</span>
          </label>
          <input
            type="text"
            name="apellido"
            defaultValue={initialData?.apellido}
            className="input input-bordered w-full"
            required
          />
        </div>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Email</span>
        </label>
        <input
          type="email"
          name="email"
          defaultValue={initialData?.email}
          className="input input-bordered w-full"
          required
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Fecha de Nacimiento</span>
        </label>
        <input
          type="date"
          name="fecha_nacimiento"
          defaultValue={
            initialData?.fecha_nacimiento
              ? new Date(initialData.fecha_nacimiento).toISOString().split('T')[0]
              : ''
          }
          className="input input-bordered w-full"
          required
        />
      </div>

      <div className="modal-action">
        <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={loading}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  )
}
