'use client'

import {
  HORARIO_CURSO,
  TIPO_TURNO_LABELS,
  tipoRequiereCurso,
  type TipoTramite,
} from '@/constants/tramites'
import type { TurnoCurso, TurnoPsicofisico } from '@/payload-types'
import { TurnoBadge } from '@/web/ui/atoms/turno-badge'
import { formatDate } from '@/web/utils/fechas'
import {
  IconCalendar,
  IconCalendarPlus,
  IconClock,
  IconEdit,
  IconSchool,
  IconStethoscope,
  IconTrash,
} from '@tabler/icons-react'

interface TurnoCardProps {
  tipo: TipoTramite
  turnoCurso: TurnoCurso | null
  turnoPsicofisico: TurnoPsicofisico | null
  onAsignarTurnoCurso?: () => void
  onAsignarTurnoPsicofisico?: () => void
  onModificarTurnoCurso?: () => void
  onModificarTurnoPsicofisico?: () => void
  onCancelarTurnoCurso?: () => void
  onCancelarTurnoPsicofisico?: () => void
  disabled?: boolean
}

function TurnoDetalle({
  label,
  icon: Icon,
  turno,
  onAsignar,
  onModificar,
  onCancelar,
  disabled,
  horarioRef,
}: {
  label: string
  icon: typeof IconSchool
  turno: TurnoCurso | TurnoPsicofisico | null
  onAsignar?: () => void
  onModificar?: () => void
  onCancelar?: () => void
  disabled?: boolean
  horarioRef?: string
}) {
  const tieneTurno = turno !== null

  return (
    <article className="bg-base-200 rounded-lg p-4">
      <header className="flex items-center justify-between">
        <h4 className="flex items-center gap-2 text-sm font-bold">
          <Icon size={16} />
          {label}
        </h4>
        {tieneTurno && <TurnoBadge estado={turno.estado} />}
      </header>

      {tieneTurno ? (
        <section className="mt-3 flex items-center gap-4">
          <p className="flex items-center gap-1 text-sm">
            <IconCalendar size={14} className="opacity-50" />
            {formatDate(turno.fecha)}
          </p>
          {turno.hora && (
            <p className="flex items-center gap-1 text-sm">
              <IconClock size={14} className="opacity-50" />
              {turno.hora}
            </p>
          )}
        </section>
      ) : (
        <p className="mt-2 text-xs opacity-40">
          {horarioRef ? `Horario: ${horarioRef}` : 'Sin turno asignado'}
        </p>
      )}

      {tieneTurno && turno.observaciones && (
        <p className="mt-2 text-xs opacity-60">{turno.observaciones}</p>
      )}

      <footer className="mt-3 flex gap-2">
        {!tieneTurno && onAsignar && (
          <button
            className="btn btn-warning btn-sm"
            onClick={onAsignar}
            disabled={disabled}
          >
            <IconCalendarPlus size={16} />
            Asignar Turno
          </button>
        )}
        {tieneTurno && onModificar && (
          <button
            className="btn btn-info btn-sm"
            onClick={onModificar}
            disabled={disabled}
          >
            <IconEdit size={16} />
            Modificar
          </button>
        )}
        {tieneTurno && onCancelar && (
          <button
            className="btn btn-error btn-ghost btn-xs"
            onClick={onCancelar}
            disabled={disabled}
            aria-label={`Eliminar turno de ${label}`}
          >
            <IconTrash size={14} />
            Eliminar
          </button>
        )}
      </footer>
    </article>
  )
}

export function TramiteTurnosCard({
  tipo,
  turnoCurso,
  turnoPsicofisico,
  onAsignarTurnoCurso,
  onAsignarTurnoPsicofisico,
  onModificarTurnoCurso,
  onModificarTurnoPsicofisico,
  onCancelarTurnoCurso,
  onCancelarTurnoPsicofisico,
  disabled,
}: TurnoCardProps) {
  const requiereCurso = tipoRequiereCurso(tipo)

  return (
    <article className="card card-border bg-base-100">
      <section className="card-body gap-4">
        <h3 className="card-title text-base">Turnos del Trámite</h3>

        {requiereCurso && (
          <TurnoDetalle
            label={TIPO_TURNO_LABELS.curso}
            icon={IconSchool}
            turno={turnoCurso}
            onAsignar={onAsignarTurnoCurso}
            onModificar={onModificarTurnoCurso}
            onCancelar={onCancelarTurnoCurso}
            disabled={disabled}
            horarioRef={`Lunes ${HORARIO_CURSO.INICIO} a ${HORARIO_CURSO.FIN}`}
          />
        )}

        <TurnoDetalle
          label={TIPO_TURNO_LABELS.psicofisico}
          icon={IconStethoscope}
          turno={turnoPsicofisico}
          onAsignar={onAsignarTurnoPsicofisico}
          onModificar={onModificarTurnoPsicofisico}
          onCancelar={onCancelarTurnoPsicofisico}
          disabled={disabled}
          horarioRef="Variable según día de semana"
        />
      </section>
    </article>
  )
}
