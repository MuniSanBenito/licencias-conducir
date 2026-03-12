'use client'
import type { PasoTramite } from '@/types'
import { TurnoBadge } from '@/web/ui/atoms/turno-badge'
import {
  IconArrowBackUp,
  IconCalendar,
  IconCalendarPlus,
  IconCalendarX,
  IconCheck,
  IconCircle,
  IconCircleCheck,
  IconCircleDot,
  IconClock,
  IconTicket,
  IconTrophy,
} from '@tabler/icons-react'
import { twJoin } from 'tailwind-merge'

interface TramiteTimelineProps {
  pasos: PasoTramite[]
  progreso: number
  todosCompletados: boolean
  onAvanzarPaso: () => void
  onAsignarTurno: (pasoIndex: number) => void
  onCancelarTurno: (pasoIndex: number) => void
  onRevertirPaso: (pasoIndex: number) => void
}

function turnoFalta(paso: PasoTramite) {
  return paso.requiereTurno && (!paso.turno || paso.turno.estado === 'cancelado')
}

export function TramiteTimeline({
  pasos,
  progreso,
  todosCompletados,
  onAvanzarPaso,
  onAsignarTurno,
  onCancelarTurno,
  onRevertirPaso,
}: TramiteTimelineProps) {
  return (
    <article className="card card-border bg-base-100">
      <section className="card-body">
        <header className="mb-4 flex items-center justify-between">
          <h2 className="card-title">Progreso del Trámite</h2>
          <section className="flex items-center gap-3">
            <progress
              className={twJoin(
                'progress w-32',
                todosCompletados ? 'progress-success' : 'progress-primary',
              )}
              value={progreso}
              max={100}
              aria-label={`${progreso}% completado`}
            />
            <span className="text-sm font-semibold opacity-60">{progreso}%</span>
          </section>
        </header>

        <ul className="timeline timeline-vertical timeline-compact" aria-label="Pasos del trámite">
          {pasos.map((paso, index) => (
            <li key={paso.id}>
              {index > 0 && (
                <hr className={twJoin(pasos[index - 1].estado === 'completado' && 'bg-success')} />
              )}
              <section className="timeline-middle">
                {paso.estado === 'completado' ? (
                  <IconCircleCheck size={24} className="text-success" />
                ) : paso.estado === 'en_curso' ? (
                  <IconCircleDot size={24} className="text-primary" />
                ) : (
                  <IconCircle size={24} className="opacity-30" />
                )}
              </section>
              <article className="timeline-end pb-6">
                <header className="flex items-center gap-2">
                  <span
                    className={twJoin(
                      'font-medium',
                      paso.estado === 'en_curso' && 'font-bold',
                      paso.estado === 'pendiente' && 'opacity-50',
                    )}
                  >
                    {paso.label}
                  </span>
                  {paso.requiereTurno && (
                    <span className="badge badge-warning badge-outline badge-xs gap-1">
                      <IconTicket size={10} />
                      Turno
                    </span>
                  )}
                </header>

                {paso.fecha && (
                  <p className="mt-1 flex items-center gap-1 text-xs opacity-50">
                    <IconCalendar size={12} />
                    {paso.fecha}
                  </p>
                )}

                {paso.estado === 'completado' && !todosCompletados && (
                  <button
                    className="btn btn-ghost btn-xs mt-1 opacity-50 hover:opacity-100"
                    onClick={() => onRevertirPaso(index)}
                    aria-label={`Revertir a ${paso.label}`}
                  >
                    <IconArrowBackUp size={14} />
                    Revertir a este paso
                  </button>
                )}

                {paso.requiereTurno && paso.turno && (
                  <section
                    className="bg-base-200 mt-2 flex items-center justify-between rounded-lg p-3"
                    aria-label={`Turno para ${paso.label}`}
                  >
                    <section className="flex items-center gap-3">
                      <section>
                        <p className="text-xs opacity-50">Turno asignado</p>
                        <p className="flex items-center gap-2 text-sm font-semibold">
                          <IconCalendar size={14} /> {paso.turno.fecha}
                          <IconClock size={14} /> {paso.turno.hora}
                        </p>
                      </section>
                      <TurnoBadge turno={paso.turno} />
                    </section>
                    {paso.estado === 'en_curso' && paso.turno.estado === 'programado' && (
                      <button
                        className="btn btn-error btn-ghost btn-xs"
                        onClick={() => onCancelarTurno(index)}
                        aria-label={`Cancelar turno de ${paso.label}`}
                      >
                        <IconCalendarX size={14} />
                        Cancelar
                      </button>
                    )}
                  </section>
                )}

                {paso.estado === 'en_curso' && (
                  <section className="mt-3 flex gap-2">
                    {turnoFalta(paso) && (
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => onAsignarTurno(index)}
                      >
                        <IconCalendarPlus size={16} />
                        {paso.turno?.estado === 'cancelado' ? 'Reasignar Turno' : 'Asignar Turno'}
                      </button>
                    )}
                    <button
                      className={twJoin(
                        'btn btn-sm',
                        turnoFalta(paso) ? 'btn-disabled' : 'btn-primary',
                      )}
                      onClick={onAvanzarPaso}
                      disabled={turnoFalta(paso)}
                      aria-label={`Completar paso ${paso.label}`}
                    >
                      <IconCheck size={16} />
                      Completar paso
                    </button>
                  </section>
                )}
              </article>
              {index < pasos.length - 1 && (
                <hr className={twJoin(paso.estado === 'completado' && 'bg-success')} />
              )}
            </li>
          ))}
        </ul>

        {todosCompletados && (
          <section role="alert" className="alert alert-success mt-4">
            <IconTrophy size={20} />
            <span className="font-semibold">Trámite completado exitosamente</span>
          </section>
        )}
      </section>
    </article>
  )
}
