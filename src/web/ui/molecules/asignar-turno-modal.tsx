'use client'

import { IconCalendarPlus } from '@tabler/icons-react'
import { useState } from 'react'

interface AsignarTurnoModalProps {
  pasoLabel: string
  ciudadanoNombre: string
  onConfirm: (fecha: string, hora: string) => void
  onCancel: () => void
}

export function AsignarTurnoModal({
  pasoLabel,
  ciudadanoNombre,
  onConfirm,
  onCancel,
}: AsignarTurnoModalProps) {
  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')

  return (
    <dialog className="modal modal-open" aria-modal="true" role="dialog" aria-label="Asignar turno">
      <section className="modal-box">
        <h3 className="flex items-center gap-2 text-lg font-bold">
          <IconCalendarPlus size={20} />
          Asignar Turno
        </h3>
        <p className="mt-1 text-sm opacity-60">
          {pasoLabel} — {ciudadanoNombre}
        </p>

        <section className="mt-6 grid gap-4">
          <fieldset className="fieldset">
            <label className="fieldset-legend" htmlFor="turno-fecha">
              Fecha
            </label>
            <input
              id="turno-fecha"
              type="date"
              className="input input-bordered w-full"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
              aria-required="true"
            />
          </fieldset>
          <fieldset className="fieldset">
            <label className="fieldset-legend" htmlFor="turno-hora">
              Hora
            </label>
            <input
              id="turno-hora"
              type="time"
              className="input input-bordered w-full"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              required
              aria-required="true"
            />
          </fieldset>
        </section>

        <section className="modal-action">
          <button className="btn btn-ghost" onClick={onCancel}>
            Cancelar
          </button>
          <button
            className="btn btn-warning"
            onClick={() => onConfirm(fecha, hora)}
            disabled={!fecha || !hora}
          >
            <IconCalendarPlus size={16} />
            Confirmar Turno
          </button>
        </section>
      </section>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onCancel}>Cerrar</button>
      </form>
    </dialog>
  )
}
