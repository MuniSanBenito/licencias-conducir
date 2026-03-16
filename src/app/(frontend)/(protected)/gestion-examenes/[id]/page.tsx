import { basePayload } from '@/web/libs/payload/server'
import { ExamenDetallePage } from '@/web/ui/templates/examen-detalle-admin-page'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Detalle de Examen | Backoffice',
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  const { id } = await params

  try {
    const examen = await basePayload.findByID({
      collection: 'examen',
      id,
      depth: 1, // To populate Tramite and Ciudadano
    })

    return <ExamenDetallePage examen={examen} />
  } catch (e) {
    notFound()
  }
}
