import { basePayload } from '@/web/libs/payload/server'
import { TramiteProgresoTable } from '@/web/ui/organisms/tramite-progreso-table'
import type { Where } from 'payload'

const DEFAULT_LIMIT = 15

export default async function TramiteProgresoPage({
  searchParams,
}: PageProps<'/tramite-progreso'>) {
  const { page: pageParam, sort: sortParam, q } = await searchParams
  const page = Math.max(1, Number(pageParam) || 1)
  const sort = sortParam || '-createdAt'

  const where: Where = q
    ? {
        or: [{ estado: { contains: q } }],
      }
    : {}

  const progresos = await basePayload.find({
    collection: 'tramite-progreso',
    page,
    limit: DEFAULT_LIMIT,
    sort,
    where,
    depth: 3, // Resuelve TramiteProceso → Tramite → Ciudadano
  })

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Trámite Progresos</h2>
      </header>
      <TramiteProgresoTable
        progresos={progresos.docs}
        page={progresos.page ?? 1}
        totalPages={progresos.totalPages}
        totalDocs={progresos.totalDocs}
      />
    </div>
  )
}
