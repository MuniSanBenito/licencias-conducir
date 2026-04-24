'use client'

import {
  HORARIOS_PSICOFISICO,
  HORARIO_CURSO,
  MAX_TURNOS_CURSO_POR_DIA,
  TIPO_TURNO,
  TIPO_TURNO_LABELS,
  type TipoTurno,
} from '@/constants/tramites'
import { contarTurnosCursoPorFecha, esDiaDeCurso, formatFechaISO, getSlotsPsicofisico } from '@/web/utils/turnos'
import { IconAlertTriangle, IconCalendarPlus } from '@tabler/icons-react'
import { useState } from 'react'

interface AsignarTurnoModalProps {
  tipoTurno: TipoTurno
  ciudadanoNombre: string
  turnosExistentes: { fecha: string; hora: string }[]
  onConfirm: (fecha: string, hora: string) => void
  onCancel: () => void
}

export function AsignarTurnoModal({
  tipoTurno,
  ciudadanoNombre,
  turnosExistentes,
  onConfirm,
  onCancel,
}: AsignarTurnoModalProps) {
  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')
  const [confirmoNoFeriado, setConfirmoNoFeriado] = useState(false)

  const esCurso = tipoTurno === TIPO_TURNO.CURSO

  const fechaDate = fecha ? new Date(fecha + 'T12:00:00') : null

  // Validaciones según tipo de turno
  let errorFecha = ''
  let slotsDisponibles: string[] = []
  let turnosDelDia = 0

  if (esCurso && fechaDate) {
    if (!esDiaDeCurso(fechaDate)) {
      errorFecha = 'El curso presencial se dicta solo los días lunes'
    } else {
      turnosDelDia = contarTurnosCursoPorFecha(fecha, turnosExistentes)
      if (turnosDelDia >= MAX_TURNOS_CURSO_POR_DIA) {
        errorFecha = `Este lunes ya tiene ${MAX_TURNOS_CURSO_POR_DIA} turnos asignados`
      }
    }
  }

  if (!esCurso && fechaDate) {
    const horarioDia = HORARIOS_PSICOFISICO[fechaDate.getDay()]
    if (!horarioDia) {
      errorFecha = 'No hay atención de psicofísico este día'
    } else {
      slotsDisponibles = getSlotsPsicofisico(fechaDate, turnosExistentes)
      if (slotsDisponibles.length === 0) {
        errorFecha = 'No quedan turnos disponibles para este día'
      }
    }
  }

  const puedeConfirmar = esCurso
    ? fecha && !errorFecha && confirmoNoFeriado
    : fecha && hora && !errorFecha

  return (
    <dialog className="modal modal-open" aria-modal="true" role="dialog" aria-label="Asignar turno">
      <section className="modal-box">
        <h3 className="flex items-center gap-2 text-lg font-bold">
          <IconCalendarPlus size={20} />
          Asignar Turno — {TIPO_TURNO_LABELS[tipoTurno]}
        </h3>
        <p className="mt-1 text-sm opacity-60">{ciudadanoNombre}</p>

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
              onChange={(e) => {
                setFecha(e.target.value)
                setHora('')
                setConfirmoNoFeriado(false)
              }}
              min={formatFechaISO(new Date())}
              required
              aria-required="true"
            />
            {errorFecha && (
              <p className="mt-1 text-xs text-error" role="alert">{errorFecha}</p>
            )}
          </fieldset>

          {esCurso ? (
            <>
              {fecha && !errorFecha && (
                <section className="bg-base-200 rounded-lg p-3">
                  <p className="text-sm">
                    Horario del curso: <strong>{HORARIO_CURSO.INICIO} a {HORARIO_CURSO.FIN}</strong>
                  </p>
                  <p className="mt-1 text-xs opacity-60">
                    Turnos asignados para este día: {turnosDelDia} / {MAX_TURNOS_CURSO_POR_DIA}
                  </p>
                </section>
              )}

              {fecha && !errorFecha && (
                <label className="flex cursor-pointer items-start gap-3" htmlFor="confirmo-feriado">
                  <input
                    id="confirmo-feriado"
                    type="checkbox"
                    className="checkbox checkbox-warning mt-0.5"
                    checked={confirmoNoFeriado}
                    onChange={(e) => setConfirmoNoFeriado(e.target.checked)}
                  />
                  <section>
                    <p className="flex items-center gap-1 text-sm font-semibold">
                      <IconAlertTriangle size={14} className="text-warning" />
                      Confirmación de día hábil
                    </p>
                    <p className="mt-0.5 text-xs opacity-60">
                      Confirmo que este día <strong>no es feriado</strong> (nacional, provincial o
                      municipal). Si lo fuera, el curso se traslada al siguiente día hábil.
                    </p>
                  </section>
                </label>
              )}
            </>
          ) : (
            <>
              {fecha && !errorFecha && slotsDisponibles.length > 0 && (
                <fieldset className="fieldset">
                  <label className="fieldset-legend" htmlFor="turno-hora">
                    Horario disponible
                  </label>
                  <select
                    id="turno-hora"
                    className="select select-bordered w-full"
                    value={hora}
                    onChange={(e) => setHora(e.target.value)}
                    required
                    aria-required="true"
                  >
                    <option value="">Seleccionar horario...</option>
                    {slotsDisponibles.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs opacity-50">
                    {slotsDisponibles.length} turnos disponibles · 20 minutos cada uno
                  </p>
                </fieldset>
              )}
            </>
          )}
        </section>

        <section className="modal-action">
          <button className="btn btn-ghost" onClick={onCancel}>
            Cancelar
          </button>
          <button
            className="btn btn-warning"
            onClick={() => {
              const horaFinal = esCurso ? HORARIO_CURSO.INICIO : hora
              onConfirm(fecha, horaFinal)
            }}
            disabled={!puedeConfirmar}
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
