import { TIPO_TRAMITE_BADGE_CLASS, TIPO_TRAMITE_LABELS } from '@/constants/tramites'
import type { Tramite } from '@/payload-types'
import { IconLicense } from '@tabler/icons-react'

type ItemLicencia = Tramite['items'][number]

interface TramiteLicenciasCardProps {
  items: ItemLicencia[]
}

export function TramiteLicenciasCard({ items }: TramiteLicenciasCardProps) {
  return (
    <article className="card card-border bg-base-100 card-sm">
      <section className="card-body">
        <h3 className="card-title text-sm">
          <IconLicense size={16} />
          Licencias Solicitadas
        </h3>
        <section className="mt-2 flex flex-col gap-2">
          {items.map((item, i) => (
            <section
              key={i}
              className="bg-base-200 flex items-center justify-between rounded-lg px-4 py-3"
            >
              <span className="text-primary font-bold">{item.clase}</span>
              <span className={TIPO_TRAMITE_BADGE_CLASS[item.tipo]}>
                {TIPO_TRAMITE_LABELS[item.tipo]}
              </span>
            </section>
          ))}
        </section>
      </section>
    </article>
  )
}
