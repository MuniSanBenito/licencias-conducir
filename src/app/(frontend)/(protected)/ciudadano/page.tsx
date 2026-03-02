import { basePayload } from '@/web/libs/payload/server'
import { CiudadanoTable } from './ciudadano-table'

const DEFAULT_LIMIT = 10

export default async function CiudadanoPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageParam } = await searchParams
  const page = Math.max(1, Number(pageParam) || 1)

  const ciudadanos = await basePayload.find({
    collection: 'ciudadano',
    page,
    limit: DEFAULT_LIMIT,
    sort: '-createdAt',
  })

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Ciudadanos</h2>
      <CiudadanoTable
        ciudadanos={ciudadanos.docs}
        page={ciudadanos.page ?? 1}
        totalPages={ciudadanos.totalPages}
        totalDocs={ciudadanos.totalDocs}
      />
    </div>
  )
}
