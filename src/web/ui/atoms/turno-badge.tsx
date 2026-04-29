import { ESTADO_TURNO, ESTADO_TURNO_LABELS, type EstadoTurno } from '@/constants/turnos'

interface TurnoBadgeProps {
  estado: EstadoTurno | null | undefined
}

const ESTADO_TURNO_CONFIG: Record<EstadoTurno, { label: string; badgeClass: string }> = {
  [ESTADO_TURNO.PROGRAMADO]: {
    label: ESTADO_TURNO_LABELS[ESTADO_TURNO.PROGRAMADO],
    badgeClass: 'badge badge-info badge-sm',
  },
  [ESTADO_TURNO.CONFIRMADO]: {
    label: ESTADO_TURNO_LABELS[ESTADO_TURNO.CONFIRMADO],
    badgeClass: 'badge badge-success badge-sm',
  },
  [ESTADO_TURNO.AUSENTE]: {
    label: ESTADO_TURNO_LABELS[ESTADO_TURNO.AUSENTE],
    badgeClass: 'badge badge-error badge-sm',
  },
  [ESTADO_TURNO.COMPLETADO]: {
    label: ESTADO_TURNO_LABELS[ESTADO_TURNO.COMPLETADO],
    badgeClass: 'badge badge-success badge-soft badge-sm',
  },
  [ESTADO_TURNO.CANCELADO]: {
    label: ESTADO_TURNO_LABELS[ESTADO_TURNO.CANCELADO],
    badgeClass: 'badge badge-ghost badge-sm',
  },
}

export function TurnoBadge({ estado }: TurnoBadgeProps) {
  if (!estado) {
    return <span className="badge badge-ghost badge-sm">Sin estado</span>
  }

  const config = ESTADO_TURNO_CONFIG[estado]
  return <span className={config.badgeClass}>{config.label}</span>
}
