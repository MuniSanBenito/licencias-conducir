import { adaptarExamen } from '@/web/libs/examen-adapter'
import { basePayload } from '@/web/libs/payload'
import { notFound } from 'next/navigation'
import { ExamenPageClient } from './examen-page-client'

export default async function ExamenPage({ params }: PageProps<'/examen/[dni]'>) {
  const { dni } = await params

  // Buscar ciudadano por DNI
  const ciudadanos = await basePayload.find({
    collection: 'ciudadanos',
    where: { dni: { equals: dni } },
    limit: 1,
  })

  if (ciudadanos.docs.length === 0) {
    notFound()
  }

  const ciudadano = ciudadanos.docs[0]

  // Buscar FUT del ciudadano
  const futs = await basePayload.find({
    collection: 'futs',
    where: { ciudadano: { equals: ciudadano.id } },
    limit: 1,
  })

  if (futs.docs.length === 0) {
    notFound()
  }

  const fut = futs.docs[0]

  // Buscar examen del FUT
  const examenes = await basePayload.find({
    collection: 'examenes',
    where: { fut: { equals: fut.id } },
    depth: 3, // Para traer consignas completas con opciones
    limit: 1,
  })

  if (examenes.docs.length === 0) {
    notFound()
  }

  const examenPayload = examenes.docs[0]

  // Adaptar a formato del cliente
  const examen = adaptarExamen(examenPayload, dni)

  return <ExamenPageClient examen={examen} />
}
