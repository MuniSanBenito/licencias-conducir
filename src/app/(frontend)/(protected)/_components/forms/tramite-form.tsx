'use client'

import type { Ciudadano, Tramite } from '@/payload-types'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { createTramite, getCiudadanos, updateTramite } from '../../actions'

interface TramiteFormProps {
  initialData?: Tramite
  onSuccess: () => void
  onCancel: () => void
}

export function TramiteForm({ initialData, onSuccess, onCancel }: TramiteFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ciudadanos, setCiudadanos] = useState<Ciudadano[]>([])

  useEffect(() => {
    // Fetch ciudadanos for the select input
    getCiudadanos().then((res) => {
      if (res.ok) setCiudadanos(res.data)
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    // The relation field 'ciudadano' expects an ID
    const data = {
      ciudadano: formData.get('ciudadano') as string,
      fut: formData.get('fut') as string,
    }

    try {
      let res
      if (initialData?.id) {
        res = await updateTramite(initialData.id, data)
      } else {
        res = await createTramite(data)
      }

      if (res.ok) {
        toast.success(initialData ? 'Trámite actualizado' : 'Trámite creado')
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
          <span className="label-text">Ciudadano</span>
        </label>
        <select
          name="ciudadano"
          defaultValue={
            typeof initialData?.ciudadano === 'object'
              ? initialData?.ciudadano?.id
              : initialData?.ciudadano || ''
          }
          className="select select-bordered w-full"
          required
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
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">FUT</span>
        </label>
        <input
          type="text"
          name="fut"
          defaultValue={initialData?.fut || ''}
          className="input input-bordered w-full"
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
