import { basePayload } from '@/web/libs/payload/server'
import { NuevoTramitePage } from '@/web/ui/templates/nuevo-tramite-page'
import type { Where } from 'payload'

const DEFAULT_LIMIT = 15

export default async function Page({ searchParams }: PageProps<'/tramite/nuevo'>) {
  const { page: pageParam, sort: sortParam, q } = await searchParams
  const page = Math.max(1, Number(pageParam) || 1)
  const sort = sortParam || '-createdAt'

  const where: Where = q
    ? {
        or: [
          { dni: { contains: q } },
          { nombre: { contains: q } },
          { apellido: { contains: q } },
          { email: { contains: q } },
        ],
      }
    : {}

  const ciudadanos = await basePayload.find({
    collection: 'ciudadano',
    page,
    limit: DEFAULT_LIMIT,
    sort,
    where,
  })

  return (
    <NuevoTramitePage
      ciudadanos={ciudadanos.docs}
      page={ciudadanos.page ?? 1}
      totalPages={ciudadanos.totalPages}
      totalDocs={ciudadanos.totalDocs}
      currentQuery={typeof q === 'string' ? q : ''}
    />
  )
}
