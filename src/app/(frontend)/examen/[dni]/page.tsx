import { adaptarExamen } from '@/web/libs/examen-adapter'
import { basePayload } from '@/web/libs/payload'
import { notFound, redirect } from 'next/navigation'
import { ExamenPageClient } from './examen-page-client'

export default async function ExamenPage({ params }: PageProps<'/examen/[dni]'>) {
  const { dni } = await params

  const ciudadanos = await basePayload.find({
    collection: 'ciudadanos',
    where: { dni: { equals: dni } },
    limit: 1,
  })

  if (ciudadanos.docs.length === 0) {
    notFound()
  }

  const ciudadano = ciudadanos.docs[0]

  const futs = await basePayload.find({
    collection: 'futs',
    where: { ciudadano: { equals: ciudadano.id } },
    limit: 1,
  })

  if (futs.docs.length === 0) {
    notFound()
  }

  const fut = futs.docs[0]

  const examenes = await basePayload.find({
    collection: 'examenes',
    where: { fut: { equals: fut.id } },
    depth: 3,
    limit: 1,
  })

  if (examenes.docs.length === 0) {
    notFound()
  }

  const examenPayload = examenes.docs[0]

  if (examenPayload.finalizado) {
    redirect(`/examen/${dni}/finalizado`)
  }

  if (examenPayload.horarioCierre) {
    const ahora = new Date()
    const cierre = new Date(examenPayload.horarioCierre)
    if (ahora > cierre) {
      redirect(`/examen/${dni}/expirado`)
    }
  }

  const examen = adaptarExamen(examenPayload, dni)

  return <ExamenPageClient examen={examen} />
}
