import { basePayload } from '@/web/libs/payload/server'
import { TramiteTable } from '@/web/ui/organisms/tramite-table'
import type { Where } from 'payload'

const DEFAULT_LIMIT = 15

export default async function TramitePage({ searchParams }: PageProps<'/tramite'>) {
  const { page: pageParam, sort: sortParam, q } = await searchParams
  const page = Math.max(1, Number(pageParam) || 1)
  const sort = sortParam || '-createdAt'

  const where: Where = q
    ? {
        or: [{ fut: { contains: q } }],
      }
    : {}

  const tramites = await basePayload.find({
    collection: 'tramite',
    page,
    limit: DEFAULT_LIMIT,
    sort,
    where,
    depth: 1, // Resuelve la relación con Ciudadano
  })

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Trámites</h2>
      </header>
      <TramiteTable
        tramites={tramites.docs}
        page={tramites.page ?? 1}
        totalPages={tramites.totalPages}
        totalDocs={tramites.totalDocs}
      />
    </div>
  )
}
