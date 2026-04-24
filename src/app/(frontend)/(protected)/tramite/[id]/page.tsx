import { ESTADO_TURNO } from '@/constants/tramites'
import type { Ciudadano, Tramite } from '@/payload-types'
import { basePayload } from '@/web/libs/payload/server'
import { TramiteDetallePage } from '@/web/ui/templates/tramite-detalle-page'
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

/**
 * Obtiene todos los turnos activos (no cancelados) de un tipo determinado
 * para calcular disponibilidad al asignar nuevos turnos.
 */
async function getTurnosActivos(campo: 'turnoCurso' | 'turnoPsicofisico') {
  const estadosCancelados = [ESTADO_TURNO.CANCELADO]

  const result = await basePayload.find({
    collection: 'tramite',
    where: {
      [`${campo}.fecha`]: { exists: true },
      [`${campo}.estado`]: { not_in: estadosCancelados },
    },
    limit: 1000,
    depth: 0,
  })

  return result.docs
    .map((doc) => {
      const turno = doc[campo]
      if (!turno?.fecha || !turno?.hora) return null
      return { fecha: turno.fecha, hora: turno.hora }
    })
    .filter(Boolean) as { fecha: string; hora: string }[]
}

export default async function Page({ params }: PageProps<'/tramite/[id]'>) {
  const { id: tramiteId } = await params
  const tramite = await getTramite(tramiteId)

  if (!tramite) {
    notFound()
  }

  const [turnosCursoExistentes, turnosPsicoExistentes] = await Promise.all([
    getTurnosActivos('turnoCurso'),
    getTurnosActivos('turnoPsicofisico'),
  ])

  const ciudadanoDisplayName = `${tramite.ciudadano.nombre} ${tramite.ciudadano.apellido}`
  const breadcrumbDetail = tramite.fut
    ? `${ciudadanoDisplayName} - FUT ${tramite.fut}`
    : ciudadanoDisplayName

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
          <li className="font-semibold">{breadcrumbDetail}</li>
        </ul>
      </nav>

      <TramiteDetallePage
        tramite={tramite}
        turnosCursoExistentes={turnosCursoExistentes}
        turnosPsicoExistentes={turnosPsicoExistentes}
      />
    </section>
  )
}
