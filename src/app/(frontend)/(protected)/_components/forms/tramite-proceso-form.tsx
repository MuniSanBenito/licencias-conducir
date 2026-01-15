'use client'

import { ProcesosEnum } from '@/constants/procesos'
import type { Tramite, TramiteProceso } from '@/payload-types'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { createTramiteProceso, getTramites, updateTramiteProceso } from '../../actions'

interface TramiteProcesoFormProps {
  initialData?: TramiteProceso
  onSuccess: () => void
  onCancel: () => void
}

export function TramiteProcesoForm({ initialData, onSuccess, onCancel }: TramiteProcesoFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tramites, setTramites] = useState<Tramite[]>([])

  useEffect(() => {
    getTramites().then((res) => {
      if (res.ok) setTramites(res.data)
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const data = {
      tramite: formData.get('tramite') as string,
      proceso: formData.get('proceso') as string,
    }

    try {
      let res
      if (initialData?.id) {
        res = await updateTramiteProceso(initialData.id, data)
      } else {
        res = await createTramiteProceso(data)
      }

      if (res.ok) {
        toast.success(initialData ? 'Trámite Proceso actualizado' : 'Trámite Proceso creado')
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
          <span className="label-text">Trámite</span>
        </label>
        <select
          name="tramite"
          defaultValue={
            typeof initialData?.tramite === 'object'
              ? initialData?.tramite?.id
              : initialData?.tramite || ''
          }
          className="select select-bordered w-full"
          required
        >
          <option value="" disabled>
            Seleccione un trámite
          </option>
          {tramites.map((t) => {
            const label =
              typeof t.ciudadano === 'object'
                ? `${t.ciudadano.dni} - ${t.ciudadano.nombre} ${t.ciudadano.apellido}`
                : `Trámite ${t.id} (Ciudadano ID: ${t.ciudadano})`
            return (
              <option key={t.id} value={t.id}>
                {label} - FUT: {t.fut || 'N/A'}
              </option>
            )
          })}
        </select>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Proceso</span>
        </label>
        <select
          name="proceso"
          defaultValue={initialData?.proceso || ''}
          className="select select-bordered w-full"
          required
        >
          <option value="" disabled>
            Seleccione un proceso
          </option>
          {Object.values(ProcesosEnum).map((p) => (
            <option key={p.nombre} value={p.nombre}>
              {p.nombre}
            </option>
          ))}
        </select>
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
