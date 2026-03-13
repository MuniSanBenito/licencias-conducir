import { ESTADO_TRAMITE } from '@/constants/tramites'
import type { Ciudadano, Tramite } from '@/payload-types'
import { basePayload } from '@/web/libs/payload/server'
import { DashboardTable } from '@/web/ui/organisms/dashboard-table'
import { IconCheck, IconClock, IconFilePlus, IconX } from '@tabler/icons-react'
import type { Metadata } from 'next'
import type { Where } from 'payload'

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
    basePayload.count({
      collection: 'tramite',
      where: { estado: { equals: ESTADO_TRAMITE.EN_CURSO } },
    }),
    basePayload.count({
      collection: 'tramite',
      where: { estado: { equals: ESTADO_TRAMITE.COMPLETADO } },
    }),
    basePayload.count({
      collection: 'tramite',
      where: { estado: { equals: ESTADO_TRAMITE.CANCELADO } },
    }),
  ])

  const tramitesConCiudadano = tramites.docs.filter(
    (tramite): tramite is Tramite & { ciudadano: Ciudadano } =>
      typeof tramite.ciudadano !== 'string',
  )

  return (
    <section aria-labelledby="dashboard-heading">
      <header className="mb-6 flex items-center justify-between">
        <h2 id="dashboard-heading" className="text-xl font-bold">
          Tablero de Trámites
        </h2>
      </header>

      <section
        className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
        aria-label="Estadísticas de trámites"
      >
        <article className="card card-border bg-base-100">
          <section className="card-body flex-row items-center gap-4">
            <figure className="rounded-btn bg-base-200 text-primary p-3">
              <IconFilePlus size={24} aria-hidden="true" />
            </figure>
            <section>
              <p className="text-sm opacity-60">Total Trámites</p>
              <p className="text-primary text-3xl font-bold">{totalTramites.totalDocs}</p>
            </section>
          </section>
        </article>

        <article className="card card-border bg-base-100">
          <section className="card-body flex-row items-center gap-4">
            <figure className="rounded-btn bg-base-200 text-warning p-3">
              <IconClock size={24} aria-hidden="true" />
            </figure>
            <section>
              <p className="text-sm opacity-60">En Curso</p>
              <p className="text-warning text-3xl font-bold">{enCurso.totalDocs}</p>
            </section>
          </section>
        </article>

        <article className="card card-border bg-base-100">
          <section className="card-body flex-row items-center gap-4">
            <figure className="rounded-btn bg-base-200 text-success p-3">
              <IconCheck size={24} aria-hidden="true" />
            </figure>
            <section>
              <p className="text-sm opacity-60">Completados</p>
              <p className="text-success text-3xl font-bold">{completados.totalDocs}</p>
            </section>
          </section>
        </article>

        <article className="card card-border bg-base-100">
          <section className="card-body flex-row items-center gap-4">
            <figure className="rounded-btn bg-base-200 text-error p-3">
              <IconX size={24} aria-hidden="true" />
            </figure>
            <section>
              <p className="text-sm opacity-60">Cancelados</p>
              <p className="text-error text-3xl font-bold">{cancelados.totalDocs}</p>
            </section>
          </section>
        </article>
      </section>

      <DashboardTable
        tramites={tramitesConCiudadano}
        page={tramites.page ?? 1}
        totalPages={tramites.totalPages}
        totalDocs={tramites.totalDocs}
      />
    </section>
  )
}
