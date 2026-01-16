'use client'

import { getTramiteProgresos } from '@/app/actions/tramites'
import { createTurno, updateTurno } from '@/app/actions/turnos'
import { AreasEnum } from '@/constants/areas'
import type { TramiteProgreso, Turno } from '@/payload-types'
import { useEffect, useState, type FormEvent } from 'react'
import { toast } from 'sonner'

interface TurnoFormProps {
  initialData?: Turno
  onSuccess: () => void
  onCancel: () => void
}

export function TurnoForm({ initialData, onSuccess, onCancel }: TurnoFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progresos, setProgresos] = useState<TramiteProgreso[]>([])

  useEffect(() => {
    getTramiteProgresos().then((res) => {
      if (res.ok) setProgresos(res.data)
    })
  }, [])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const data = {
      tramite: formData.get('tramite') as string, // This maps to 'tramite' field in Turno which relates to TramiteProgreso
      area: formData.get('area') as any,
      fecha_hora_inicio: formData.get('fecha_hora_inicio') as string,
      fecha_hora_fin: formData.get('fecha_hora_fin') as string,
      estado: formData.get('estado') as any,
    }

    try {
      let res
      if (initialData?.id) {
        res = await updateTurno(initialData.id, data)
      } else {
        res = await createTurno(data)
      }

      if (res.ok) {
        toast.success(initialData ? 'Turno actualizado' : 'Turno creado')
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

  // Helper to format date for datetime-local input
  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    return new Date(dateString).toISOString().slice(0, 16)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="alert alert-error text-sm">{error}</div>}

      <div className="form-control">
        <label className="label">
          <span className="label-text">Trámite Progreso</span>
        </label>
        <select
          name="tramite"
          defaultValue={
            typeof initialData?.tramite === 'object'
              ? initialData.tramite.id
              : initialData?.tramite || ''
          }
          className="select select-bordered w-full"
          required
        >
          <option value="" disabled>
            Seleccione un progreso
          </option>
          {progresos.map((p) => (
            <option key={p.id} value={p.id}>
              Progreso ID: {p.id} - Etapa {p.etapa} ({p.estado})
            </option>
          ))}
        </select>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Área</span>
        </label>
        <select
          name="area"
          defaultValue={initialData?.area || AreasEnum.TEORICO}
          className="select select-bordered w-full"
          required
        >
          {Object.values(AreasEnum).map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Inicio</span>
          </label>
          <input
            type="datetime-local"
            name="fecha_hora_inicio"
            defaultValue={formatDate(initialData?.fecha_hora_inicio)}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Fin</span>
          </label>
          <input
            type="datetime-local"
            name="fecha_hora_fin"
            defaultValue={formatDate(initialData?.fecha_hora_fin)}
            className="input input-bordered w-full"
            required
          />
        </div>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Estado</span>
        </label>
        <select
          name="estado"
          defaultValue={initialData?.estado || 'RESERVADO'}
          className="select select-bordered w-full"
          required
        >
          {['RESERVADO', 'AUSENTE', 'FINALIZADO', 'CANCELADO'].map((e) => (
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
