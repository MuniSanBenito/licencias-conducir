import { ESTADO_TRAMITE_LABELS, TIPO_TRAMITE_BADGE_CLASS, TIPO_TRAMITE_LABELS } from '@/constants/tramites'
import type { Tramite } from '@/payload-types'
import { formatDate } from '@/web/utils/fechas'
import { IconId } from '@tabler/icons-react'

interface TramiteInfoCardProps {
  tramite: Tramite
}

export function TramiteInfoCard({ tramite }: TramiteInfoCardProps) {
  return (
    <article className="card card-border bg-base-100 card-sm">
      <section className="card-body">
        <h3 className="card-title text-sm">
          <IconId size={16} />
          Información
        </h3>
        <dl className="mt-2 grid gap-2">
          {tramite.fut && (
            <section>
              <dt className="text-[10px] tracking-wider uppercase opacity-40">FUT</dt>
              <dd className="font-mono text-sm font-bold">{tramite.fut}</dd>
            </section>
          )}
          <section>
            <dt className="text-[10px] tracking-wider uppercase opacity-40">Tipo</dt>
            <dd>
              <span className={TIPO_TRAMITE_BADGE_CLASS[tramite.tipo]}>
                {TIPO_TRAMITE_LABELS[tramite.tipo]}
              </span>
            </dd>
          </section>
          <section>
            <dt className="text-[10px] tracking-wider uppercase opacity-40">Estado</dt>
            <dd className="text-sm font-medium">{ESTADO_TRAMITE_LABELS[tramite.estado]}</dd>
          </section>
          <section>
            <dt className="text-[10px] tracking-wider uppercase opacity-40">Fecha Inicio</dt>
            <dd className="text-sm font-medium">{formatDate(tramite.fechaInicio)}</dd>
          </section>
          <section>
            <dt className="text-[10px] tracking-wider uppercase opacity-40">ID Trámite</dt>
            <dd className="font-mono text-sm font-semibold">{tramite.id}</dd>
          </section>
        </dl>
      </section>
    </article>
  )
}
