'use client'

import { TIPO_TURNO_LABELS } from '@/constants/tramites'
import type { Ciudadano, Tramite, TurnoCurso, TurnoPsicofisico } from '@/payload-types'
import { TurnoBadge } from '@/web/ui/atoms/turno-badge'
import { formatDate } from '@/web/utils/fechas'
import { IconCalendar, IconClock, IconSchool, IconStethoscope } from '@tabler/icons-react'
import Link from 'next/link'

type TurnoCursoPopulated = TurnoCurso & { tramite: Tramite & { ciudadano: Ciudadano } }
type TurnoPsicofisicoPopulated = TurnoPsicofisico & { tramite: Tramite & { ciudadano: Ciudadano } }

interface Props {
  turnosCurso: TurnoCursoPopulated[]
  turnosPsicofisico: TurnoPsicofisicoPopulated[]
}

function TurnoRow({
  turno,
  ciudadanoNombre,
  tramiteId,
}: {
  turno: { fecha: string; hora?: string | null; estado: string }
  ciudadanoNombre: string
  tramiteId: string
}) {
  return (
    <li>
      <Link
        href={`/tramite/${tramiteId}`}
        className="hover:bg-base-200 flex items-center justify-between rounded-lg p-3 transition-colors"
      >
        <section className="flex flex-col gap-1">
          <p className="text-sm font-medium">{ciudadanoNombre}</p>
          <section className="flex items-center gap-3">
            <p className="flex items-center gap-1 text-xs opacity-60">
              <IconCalendar size={12} />
              {formatDate(turno.fecha)}
            </p>
            {turno.hora && (
              <p className="flex items-center gap-1 text-xs opacity-60">
                <IconClock size={12} />
                {turno.hora}
              </p>
            )}
          </section>
        </section>
        <TurnoBadge estado={turno.estado as Parameters<typeof TurnoBadge>[0]['estado']} />
      </Link>
    </li>
  )
}

function getTramiteData(tramite: Tramite & { ciudadano: Ciudadano }) {
  const ciudadanoNombre = `${tramite.ciudadano.apellido}, ${tramite.ciudadano.nombre}`
  return { ciudadanoNombre, tramiteId: tramite.id }
}

export function TurnosAsignadosCard({ turnosCurso, turnosPsicofisico }: Props) {
  const sinTurnos = turnosCurso.length === 0 && turnosPsicofisico.length === 0

  return (
    <article className="card card-border bg-base-100">
      <section className="card-body gap-4">
        <h3 className="card-title text-base">Turnos Asignados</h3>

        {sinTurnos ? (
          <p className="py-4 text-center text-sm opacity-50">
            No hay turnos asignados próximamente
          </p>
        ) : (
          <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Curso Presencial */}
            <section>
              <header className="flex items-center gap-2 border-b pb-2">
                <IconSchool size={16} className="text-warning" />
                <h4 className="text-sm font-semibold">{TIPO_TURNO_LABELS.curso}</h4>
                <span className="badge badge-ghost badge-sm">{turnosCurso.length}</span>
              </header>
              {turnosCurso.length === 0 ? (
                <p className="py-3 text-xs opacity-40">Sin turnos de curso</p>
              ) : (
                <ul className="mt-2 flex flex-col gap-1" role="list">
                  {turnosCurso.map((turno) => {
                    const { ciudadanoNombre, tramiteId } = getTramiteData(turno.tramite)
                    return (
                      <TurnoRow
                        key={turno.id}
                        turno={turno}
                        ciudadanoNombre={ciudadanoNombre}
                        tramiteId={tramiteId}
                      />
                    )
                  })}
                </ul>
              )}
            </section>

            {/* Examen Psicofísico */}
            <section>
              <header className="flex items-center gap-2 border-b pb-2">
                <IconStethoscope size={16} className="text-info" />
                <h4 className="text-sm font-semibold">{TIPO_TURNO_LABELS.psicofisico}</h4>
                <span className="badge badge-ghost badge-sm">{turnosPsicofisico.length}</span>
              </header>
              {turnosPsicofisico.length === 0 ? (
                <p className="py-3 text-xs opacity-40">Sin turnos de psicofísico</p>
              ) : (
                <ul className="mt-2 flex flex-col gap-1" role="list">
                  {turnosPsicofisico.map((turno) => {
                    const { ciudadanoNombre, tramiteId } = getTramiteData(turno.tramite)
                    return (
                      <TurnoRow
                        key={turno.id}
                        turno={turno}
                        ciudadanoNombre={ciudadanoNombre}
                        tramiteId={tramiteId}
                      />
                    )
                  })}
                </ul>
              )}
            </section>
          </section>
        )}
      </section>
    </article>
  )
}
