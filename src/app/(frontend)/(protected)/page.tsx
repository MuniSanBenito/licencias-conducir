import type { Ciudadano, Tramite } from '@/payload-types'
import { basePayload } from '@/web/libs/payload/server'
import type { Metadata } from 'next'
import type { Where } from 'payload'
import { DashboardPage } from '../../../web/ui/templates/dashboard-page'

const DEFAULT_LIMIT = 15

export const metadata: Metadata = {
  title: 'Tablero',
}

export default async function Page({ searchParams }: PageProps<'/'>) {
  const { page: pageParam, sort: sortParam, q } = await searchParams

  const page = Math.max(1, Number(pageParam) || 1)
  const sort = typeof sortParam === 'string' ? sortParam : '-createdAt'
  const query = typeof q === 'string' ? q.trim() : ''

  let where: Where = {}

  if (query) {
    const ciudadanos = await basePayload.find({
      collection: 'ciudadano',
      where: {
        or: [
          { dni: { contains: query } },
          { nombre: { contains: query } },
          { apellido: { contains: query } },
        ],
      },
      limit: 200,
      depth: 0,
      sort: '-createdAt',
    })

    const ciudadanoIds = ciudadanos.docs.map((ciudadano) => ciudadano.id)

    where = ciudadanoIds.length
      ? {
          or: [{ fut: { contains: query } }, { ciudadano: { in: ciudadanoIds } }],
        }
      : { fut: { contains: query } }
  }

  const [tramites, totalTramites, enCurso, completados, cancelados] = await Promise.all([
    basePayload.find({
      collection: 'tramite',
      page,
      limit: DEFAULT_LIMIT,
      sort,
      where,
      depth: 1,
    }),
    basePayload.count({ collection: 'tramite' }),
    basePayload.count({ collection: 'tramite', where: { estado: { equals: 'en_curso' } } }),
    basePayload.count({ collection: 'tramite', where: { estado: { equals: 'completado' } } }),
    basePayload.count({ collection: 'tramite', where: { estado: { equals: 'cancelado' } } }),
  ])

  const tramitesConCiudadano = tramites.docs.filter(
    (tramite): tramite is Tramite & { ciudadano: Ciudadano } =>
      typeof tramite.ciudadano !== 'string',
  )

  return (
    <DashboardPage
      tramites={tramitesConCiudadano}
      page={tramites.page ?? 1}
      totalPages={tramites.totalPages}
      totalDocs={tramites.totalDocs}
      stats={{
        totalTramites: totalTramites.totalDocs,
        enCurso: enCurso.totalDocs,
        completados: completados.totalDocs,
        cancelados: cancelados.totalDocs,
      }}
    />
  )
}
