'use client'

import { EstadosTramiteEnum } from '@/constants/estados-tramite'
import type { TramiteProceso, TramiteProgreso } from '@/payload-types'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { createTramiteProgreso, getTramiteProcesos, updateTramiteProgreso } from '../../actions'

interface TramiteProgresoFormProps {
  initialData?: TramiteProgreso
  onSuccess: () => void
  onCancel: () => void
}

export function TramiteProgresoForm({
  initialData,
  onSuccess,
  onCancel,
}: TramiteProgresoFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [procesos, setProcesos] = useState<TramiteProceso[]>([])

  useEffect(() => {
    getTramiteProcesos().then((res) => {
      if (res.ok) setProcesos(res.data)
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const data = {
      tramite_proceso: formData.get('tramite_proceso') as string,
      etapa: Number(formData.get('etapa')),
      estado: formData.get('estado') as 'EN CURSO' | 'CANCELADO' | 'FINALIZADO' | 'SUSPENDIDO',
    }

    try {
      let res
      if (initialData?.id) {
        res = await updateTramiteProgreso(initialData.id, data)
      } else {
        res = await createTramiteProgreso(data)
      }

      if (res.ok) {
        toast.success(initialData ? 'Progreso actualizado' : 'Progreso creado')
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
          <span className="label-text">Trámite Proceso</span>
        </label>
        <select
          name="tramite_proceso"
          defaultValue={
            typeof initialData?.tramite_proceso === 'object'
              ? initialData.tramite_proceso.id
              : initialData?.tramite_proceso || ''
          }
          className="select select-bordered w-full"
          required
        >
          <option value="" disabled>
            Seleccione un proceso
          </option>
          {procesos.map((p) => {
            // Safe access to nested relations if expanded
            const tramite = typeof p.tramite === 'object' ? p.tramite : null
            const label =
              tramite && typeof tramite.ciudadano === 'object'
                ? `${tramite.ciudadano.dni} - ${p.proceso}`
                : `Proceso ${p.id} (${p.proceso})`

            return (
              <option key={p.id} value={p.id}>
                {label}
              </option>
            )
          })}
        </select>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Etapa (Número)</span>
        </label>
        <input
          type="number"
          name="etapa"
          defaultValue={initialData?.etapa || 0}
          className="input input-bordered w-full"
          required
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Estado</span>
        </label>
        <select
          name="estado"
          defaultValue={initialData?.estado || EstadosTramiteEnum.EN_CURSO}
          className="select select-bordered w-full"
          required
        >
          {Object.values(EstadosTramiteEnum).map((e) => (
            <option key={e} value={e}>
              {e}
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
