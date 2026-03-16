import { basePayload } from '@/web/libs/payload/server'
import { ExamenesPage } from '@/web/ui/templates/examenes-page'
import type { Metadata } from 'next'
import type { Where } from 'payload'

const DEFAULT_LIMIT = 15

export const metadata: Metadata = {
  title: 'Historial de Exámenes',
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

export default async function Page({ searchParams }: PageProps) {
  const { page: pageParam, sort: sortParam, q } = await searchParams
  const page = Math.max(1, Number(pageParam) || 1)
  const sort = sortParam || '-createdAt'

  const where: Where = q
    ? {
        estado: { equals: q },
      }
    : {}

  const examenes = await basePayload.find({
    collection: 'examen',
    page,
    limit: DEFAULT_LIMIT,
    sort,
    where,
    // Populate relationships to display citizen details
    depth: 1, 
  })

  return (
    <ExamenesPage
      examenes={examenes.docs}
      page={examenes.page ?? 1}
      totalPages={examenes.totalPages}
      totalDocs={examenes.totalDocs}
    />
  )
}
