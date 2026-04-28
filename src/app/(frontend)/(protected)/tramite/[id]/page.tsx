import type { Ciudadano, Tramite, TurnoCurso, TurnoPsicofisico } from '@/payload-types'
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

async function getTurnoCurso(tramiteId: string): Promise<TurnoCurso | null> {
  const result = await basePayload.find({
    collection: 'turno-curso',
    where: { tramite: { equals: tramiteId } },
    limit: 1,
    depth: 0,
  })

  return result.docs[0] ?? null
}

async function getTurnoPsicofisico(tramiteId: string): Promise<TurnoPsicofisico | null> {
  const result = await basePayload.find({
    collection: 'turno-psicofisico',
    where: { tramite: { equals: tramiteId } },
    limit: 1,
    depth: 0,
  })

  return result.docs[0] ?? null
}

/**
 * Obtiene todos los turnos de curso activos para calcular disponibilidad.
 * Solo se necesitan fecha y hora para la lógica de slots.
 */
async function getTurnosCursoActivos(): Promise<{ fecha: string; hora: string }[]> {
  const result = await basePayload.find({
    collection: 'turno-curso',
    where: {
      estado: { not_in: ['cancelado'] },
    },
    limit: 1000,
    depth: 0,
  })

  return result.docs.map((doc) => ({
    fecha: doc.fecha,
    hora: doc.hora ?? '',
  }))
}

/**
 * Obtiene todos los turnos psicofísicos activos para calcular slots disponibles.
 */
async function getTurnosPsicoActivos(): Promise<{ fecha: string; hora: string }[]> {
  const result = await basePayload.find({
    collection: 'turno-psicofisico',
    where: {
      estado: { not_in: ['cancelado'] },
    },
    limit: 1000,
    depth: 0,
  })

  return result.docs.map((doc) => ({
    fecha: doc.fecha,
    hora: doc.hora,
  }))
}

export default async function Page({ params }: PageProps<'/tramite/[id]'>) {
  const { id: tramiteId } = await params
  const tramite = await getTramite(tramiteId)

  if (!tramite) {
    notFound()
  }

  const [turnoCurso, turnoPsicofisico, turnosCursoActivos, turnosPsicoActivos] = await Promise.all([
    getTurnoCurso(tramiteId),
    getTurnoPsicofisico(tramiteId),
    getTurnosCursoActivos(),
    getTurnosPsicoActivos(),
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
        turnoCurso={turnoCurso}
        turnoPsicofisico={turnoPsicofisico}
        turnosCursoActivos={turnosCursoActivos}
        turnosPsicoActivos={turnosPsicoActivos}
      />
    </section>
  )
}
