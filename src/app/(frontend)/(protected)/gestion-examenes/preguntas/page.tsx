import { basePayload } from '@/web/libs/payload/server'
import { PreguntasPage } from '@/web/ui/templates/preguntas-page'
import type { Metadata } from 'next'
import type { Where } from 'payload'

const DEFAULT_LIMIT = 15

export const metadata: Metadata = {
  title: 'Banco de Preguntas | Exámenes',
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
        consigna: { contains: q },
      }
    : {}

  const preguntas = await basePayload.find({
    collection: 'pregunta',
    page,
    limit: DEFAULT_LIMIT,
    sort,
    where,
  })

  return (
    <PreguntasPage
      preguntas={preguntas.docs}
      page={preguntas.page ?? 1}
      totalPages={preguntas.totalPages}
      totalDocs={preguntas.totalDocs}
    />
  )
}
