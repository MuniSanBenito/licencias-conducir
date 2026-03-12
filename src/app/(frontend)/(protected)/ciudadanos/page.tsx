import { basePayload } from '@/web/libs/payload/server'
import { CiudadanosPage } from '@/web/ui/templates/ciudadanos-page'
import type { Metadata } from 'next'
import type { Where } from 'payload'

const DEFAULT_LIMIT = 15

export const metadata: Metadata = {
  title: 'Ciudadanos',
}

export default async function Page({ searchParams }: PageProps<'/ciudadanos'>) {
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
    <CiudadanosPage
      ciudadanos={ciudadanos.docs}
      page={ciudadanos.page ?? 1}
      totalPages={ciudadanos.totalPages}
      totalDocs={ciudadanos.totalDocs}
    />
  )
}
