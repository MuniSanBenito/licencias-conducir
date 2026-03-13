import type { Tramite } from '@/payload-types'
import { TurnoBadge } from '@/web/ui/atoms/turno-badge'
import { IconTicket } from '@tabler/icons-react'

type PasoTramite = Tramite['pasos'][number]

interface TramiteTurnosCardProps {
  pasos: PasoTramite[]
}

export function TramiteTurnosCard({ pasos }: TramiteTurnosCardProps) {
  const pasosConTurno = pasos.filter((p) => p.requiereTurno)
  if (pasosConTurno.length === 0) return null

  return (
    <article className="card card-border bg-base-100 card-sm">
      <section className="card-body">
        <h3 className="card-title text-sm">
          <IconTicket size={16} />
          Turnos
        </h3>
        <section className="mt-2 flex flex-col gap-2">
          {pasosConTurno.map((paso) => (
            <section
              key={paso.id}
              className="bg-base-200 flex items-center justify-between rounded-md px-3 py-2"
            >
              <span className="text-sm font-medium">{paso.label}</span>
              {paso.turno ? (
                <section className="flex items-center gap-2">
                  <span className="text-xs opacity-60">
                    {paso.turno.fecha} {paso.turno.hora}
                  </span>
                  <TurnoBadge turno={paso.turno} />
                </section>
              ) : (
                <span className="text-xs opacity-30">Sin turno</span>
              )}
            </section>
          ))}
        </section>
      </section>
    </article>
  )
}
