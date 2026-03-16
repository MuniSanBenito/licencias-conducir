import { basePayload } from '@/web/libs/payload/server'
import { PreguntaFormPage } from '@/web/ui/templates/pregunta-form-page'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Editar Pregunta | Exámenes',
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  const { id } = await params
  let pregunta = null

  if (id !== 'nueva') {
    try {
      pregunta = await basePayload.findByID({
        collection: 'pregunta',
        id,
      })
    } catch (e) {
      notFound()
    }
  }

  return <PreguntaFormPage pregunta={pregunta} />
}
