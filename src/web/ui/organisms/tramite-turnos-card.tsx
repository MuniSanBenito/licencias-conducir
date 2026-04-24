'use client'

import {
  ESTADO_TURNO,
  HORARIO_CURSO,
  TIPO_TURNO_LABELS,
  tipoRequiereCurso,
  type TipoTramite,
} from '@/constants/tramites'
import type { Tramite } from '@/payload-types'
import { TurnoBadge } from '@/web/ui/atoms/turno-badge'
import { formatDate } from '@/web/utils/fechas'
import {
  IconCalendar,
  IconCalendarPlus,
  IconCalendarX,
  IconClock,
  IconSchool,
  IconStethoscope,
} from '@tabler/icons-react'

type TurnoGroup = NonNullable<Tramite['turnoCurso']>

interface TurnoCardProps {
  tipo: TipoTramite
  turnoCurso: TurnoGroup | undefined | null
  turnoPsicofisico: TurnoGroup | undefined | null
  onAsignarTurnoCurso?: () => void
  onAsignarTurnoPsicofisico?: () => void
  onCancelarTurnoCurso?: () => void
  onCancelarTurnoPsicofisico?: () => void
  disabled?: boolean
}

function turnoTieneEstadoActivo(turno: TurnoGroup | undefined | null): boolean {
  return Boolean(turno?.estado && turno.estado !== ESTADO_TURNO.CANCELADO)
}

function turnoEsCancelable(turno: TurnoGroup | undefined | null): boolean {
  return turno?.estado === ESTADO_TURNO.PROGRAMADO
}

function TurnoDetalle({
  label,
  icon: Icon,
  turno,
  onAsignar,
  onCancelar,
  disabled,
  horarioRef,
}: {
  label: string
  icon: typeof IconSchool
  turno: TurnoGroup | undefined | null
  onAsignar?: () => void
  onCancelar?: () => void
  disabled?: boolean
  horarioRef?: string
}) {
  const tieneEstado = turnoTieneEstadoActivo(turno)

  return (
    <article className="bg-base-200 rounded-lg p-4">
      <header className="flex items-center justify-between">
        <h4 className="flex items-center gap-2 text-sm font-bold">
          <Icon size={16} />
          {label}
        </h4>
        <TurnoBadge estado={turno?.estado} />
      </header>

      {tieneEstado && turno?.fecha ? (
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

      {turno?.observaciones && (
        <p className="mt-2 text-xs opacity-60">{turno.observaciones}</p>
      )}

      <footer className="mt-3 flex gap-2">
        {!tieneEstado && onAsignar && (
          <button
            className="btn btn-warning btn-sm"
            onClick={onAsignar}
            disabled={disabled}
          >
            <IconCalendarPlus size={16} />
            Asignar Turno
          </button>
        )}
        {turnoEsCancelable(turno) && onCancelar && (
          <button
            className="btn btn-error btn-ghost btn-xs"
            onClick={onCancelar}
            disabled={disabled}
            aria-label={`Cancelar turno de ${label}`}
          >
            <IconCalendarX size={14} />
            Cancelar
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
          onCancelar={onCancelarTurnoPsicofisico}
          disabled={disabled}
          horarioRef="Variable según día de semana"
        />
      </section>
    </article>
  )
}
