import { basePayload } from '@/web/libs/payload/server'
import { ExamenResultadoPage } from '@/web/ui/templates/examen-resultado-page'
import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Resultado de Examen | Licencias San Benito',
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  const { id } = await params

  const examenes = await basePayload.find({
    collection: 'examen',
    where: {
      id: { equals: id },
    },
    limit: 1,
  })

  if (examenes.totalDocs === 0) {
    notFound()
  }

  const examen = examenes.docs[0]

  if (examen.estado === 'abierto') {
    redirect(`/examenes/${id}`)
  }

  return <ExamenResultadoPage examen={examen} />
}
