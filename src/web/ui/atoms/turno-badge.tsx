import type { EstadoTurno } from '@/constants/tramites'
import type { Tramite } from '@/payload-types'

type Turno = NonNullable<Tramite['pasos'][number]['turno']>

const ESTADO_TURNO_CONFIG: Record<EstadoTurno, { label: string; badgeClass: string }> = {
  programado: { label: 'Programado', badgeClass: 'badge badge-info badge-sm' },
  confirmado: { label: 'Confirmado', badgeClass: 'badge badge-success badge-sm' },
  ausente: { label: 'Ausente', badgeClass: 'badge badge-error badge-sm' },
  completado: { label: 'Completado', badgeClass: 'badge badge-success badge-soft badge-sm' },
  cancelado: { label: 'Cancelado', badgeClass: 'badge badge-ghost badge-sm' },
}

export function TurnoBadge({ turno }: { turno: Turno }) {
  if (!turno.estado) {
    return <span className="badge badge-ghost badge-sm">Sin estado</span>
  }

  const config = ESTADO_TURNO_CONFIG[turno.estado]
  return <span className={config.badgeClass}>{config.label}</span>
}
