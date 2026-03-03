import { basePayload } from '@/web/libs/payload/server'
import { CiudadanoTable } from '@/web/ui/organisms/ciudadano-table'
import type { Where } from 'payload'

const DEFAULT_LIMIT = 15

export default async function CiudadanoPage({ searchParams }: PageProps<'/ciudadano'>) {
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
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Ciudadanos</h2>
      </header>
      <CiudadanoTable
        ciudadanos={ciudadanos.docs}
        page={ciudadanos.page ?? 1}
        totalPages={ciudadanos.totalPages}
        totalDocs={ciudadanos.totalDocs}
      />
    </div>
  )
}
