import { basePayload } from '@/web/payload'
import { notFound } from 'next/navigation'
import { ExamenPageClient } from './examen-page-client'

export default async function ExamenPage({ params }: PageProps<'/examen/[examenId]'>) {
  const { examenId } = await params

  const examen = await basePayload.findByID({
    collection: 'examenes',
    id: examenId,
    depth: 4,
  })

  if (!examen) {
    return notFound()
  }

  return <ExamenPageClient examen={examen} />
}
