import type { ConsignasExamen } from '@/payload-types'
import { basePayload } from '@/web/payload'
import { notFound } from 'next/navigation'
import { ExamenPageClient } from './examen-page-client'

export default async function ExamenPage({ params }: PageProps<'/examen/[dni]'>) {
  const { dni } = await params

  const { docs: futs } = await basePayload.find({
    collection: 'futs',
    where: {
      'ciudadano.dni': {
        equals: dni,
      },
    },
  })
  if (!futs || futs.length === 0) {
    console.log('FUT no encontrado para el ciudadano con DNI:', dni)
    return notFound()
  }

  const [fut] = futs
  const { docs: examenes } = await basePayload.find({
    collection: 'examenes',
    where: {
      and: [
        {
          'fut.id': {
            equals: fut.id,
          },
        },
        {
          finalizado: {
            equals: false,
          },
        },
      ],
    },
    depth: 0,
    limit: 1,
    sort: '-createdAt',
  })
  if (!examenes || examenes.length === 0) {
    console.log('No hay examenes asignados para este FUT:', fut.id)
    return notFound()
  }
  const [examen] = examenes

  console.log('Examen encontrado:', examen)

  const { consignas, ...restOfExamen } = examen

  const mappedConsignas: ConsignasExamen = []
  for (const c of examen.consignas || []) {
    const consigna =
      typeof c.consigna === 'string'
        ? await basePayload.findByID({ collection: 'consignas', id: c.consigna })
        : c.consigna

    console.log('Consigna encontrada:', consigna)
    const opciones = consigna.opciones?.map((o) => ({ ...o, correcta: false }))
    mappedConsignas.push({
      ...c,
      consigna: { ...consigna, opciones },
    })
  }

  console.log('Consignas mapeadas:', mappedConsignas)

  return <ExamenPageClient examen={restOfExamen} consignas={mappedConsignas} />
}
