import { ESTADO_PASO } from '@/constants/tramites'
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
          <section>
            <dt className="text-[10px] tracking-wider uppercase opacity-40">FUT</dt>
            <dd className="font-mono text-sm font-bold">{tramite.fut}</dd>
          </section>
          <section>
            <dt className="text-[10px] tracking-wider uppercase opacity-40">ID Trámite</dt>
            <dd className="font-mono text-sm font-semibold">{tramite.id}</dd>
          </section>
          <section>
            <dt className="text-[10px] tracking-wider uppercase opacity-40">Fecha Inicio</dt>
            <dd className="text-sm font-medium">{formatDate(tramite.fechaInicio)}</dd>
          </section>
          <section>
            <dt className="text-[10px] tracking-wider uppercase opacity-40">Total Pasos</dt>
            <dd className="text-sm font-medium">
              {tramite.pasos.filter((p) => p.estado === ESTADO_PASO.COMPLETADO).length} /{' '}
              {tramite.pasos.length}
            </dd>
          </section>
        </dl>
      </section>
    </article>
  )
}
