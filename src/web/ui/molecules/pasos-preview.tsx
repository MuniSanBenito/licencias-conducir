import { TIPO_TRAMITE, TIPO_TRAMITE_LABELS } from '@/constants/tramites'
import type { ItemLicencia, PasoTramitePreview } from '@/web/utils/pasos'
import { IconCheck, IconCircle, IconTicket } from '@tabler/icons-react'
import { twJoin } from 'tailwind-merge'

interface PasosPreviewProps {
  pasos: PasoTramitePreview[]
  items: ItemLicencia[]
}

export function PasosPreview({ pasos, items }: PasosPreviewProps) {
  return (
    <aside className="card card-border bg-base-100 sticky top-6 self-start">
      <section className="card-body">
        <h3 className="card-title text-sm">
          <IconCheck size={16} />
          Pasos del Trámite
        </h3>
        <p className="mb-4 text-xs opacity-50">
          Vista previa basada en las clases y tipos seleccionados
        </p>

        <ul className="timeline timeline-vertical timeline-compact" aria-label="Preview de pasos">
          {pasos.map((paso, i) => (
            <li key={paso.id}>
              {i > 0 && <hr />}
              <section className="timeline-middle">
                <IconCircle size={16} className="opacity-30" />
              </section>
              <section className="timeline-end pb-2">
                <span className="flex items-center gap-1 text-sm">
                  {paso.label}
                  {paso.requiereTurno && (
                    <span className="badge badge-warning badge-outline badge-xs">
                      <IconTicket size={8} />
                    </span>
                  )}
                </span>
              </section>
              {i < pasos.length - 1 && <hr />}
            </li>
          ))}
        </ul>

        <section className="border-base-200 mt-4 border-t pt-4">
          <p className="mb-2 text-xs font-semibold opacity-50">Resumen:</p>
          {items.map((item, i) => (
            <section key={i} className="flex items-center justify-between py-1">
              <span className="text-sm font-bold">{item.clase}</span>
              <span
                className={twJoin(
                  'text-xs',
                  item.tipo === TIPO_TRAMITE.NUEVA
                    ? 'text-info'
                    : item.tipo === TIPO_TRAMITE.RENOVACION
                      ? 'text-warning'
                      : 'text-secondary',
                )}
              >
                {TIPO_TRAMITE_LABELS[item.tipo]}
              </span>
            </section>
          ))}
          <p className="mt-2 text-xs opacity-40">Total: {pasos.length} pasos</p>
        </section>
      </section>
    </aside>
  )
}
