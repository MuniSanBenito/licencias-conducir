import type { Ciudadano, Tramite } from '@/payload-types'
import { basePayload } from '@/web/libs/payload/server'
import { TramiteCiudadanoCard } from '@/web/ui/molecules/tramite-ciudadano-card'
import { TramiteInfoCard } from '@/web/ui/molecules/tramite-info-card'
import { TramiteLicenciasCard } from '@/web/ui/molecules/tramite-licencias-card'
import { TramiteTurnosCard } from '@/web/ui/molecules/tramite-turnos-card'
import { TramiteTimeline } from '@/web/ui/organisms/tramite-timeline'
import { IconArrowLeft } from '@tabler/icons-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

type TramiteConCiudadano = Tramite & { ciudadano: Ciudadano }

async function getTramite(tramiteId: string): Promise<TramiteConCiudadano | null> {
  try {
    const tramite = await basePayload.findByID({
      collection: 'tramite',
      id: tramiteId,
      depth: 1,
    })

    if (!tramite || typeof tramite.ciudadano === 'string') {
      return null
    }

    return tramite as TramiteConCiudadano
  } catch {
    return null
  }
}

export default async function TramiteDetallePage({ params }: PageProps<'/tramite/[id]'>) {
  const { id: tramiteId } = await params
  const tramite = await getTramite(tramiteId)

  if (!tramite) {
    notFound()
  }

  const todosCompletados = tramite.pasos.every((p) => p.estado === 'completado')
  const progreso = Math.round(
    (tramite.pasos.filter((p) => p.estado === 'completado').length / tramite.pasos.length) * 100,
  )

  return (
    <section>
      <nav className="breadcrumbs mb-6 text-sm" aria-label="Navegación">
        <ul>
          <li>
            <Link href="/" className="gap-1">
              <IconArrowLeft size={14} />
              Tablero
            </Link>
          </li>
          <li className="font-semibold">{tramite.id}</li>
        </ul>
      </nav>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <TramiteTimeline
          pasos={tramite.pasos}
          progreso={progreso}
          todosCompletados={todosCompletados}
        />

        <aside className="flex flex-col gap-5">
          <TramiteCiudadanoCard ciudadano={tramite.ciudadano} />
          <TramiteLicenciasCard items={tramite.items} />
          <TramiteTurnosCard pasos={tramite.pasos} />
          <TramiteInfoCard tramite={tramite} />
        </aside>
      </section>
    </section>
  )
}
