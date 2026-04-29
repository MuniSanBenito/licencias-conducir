import { basePayload } from '@/web/libs/payload/server'
import { ExcepcionesPsicofisicoPage } from '@/web/ui/templates/excepciones-psicofisico-page'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Excepciones psicofísico',
}

export default async function Page() {
  const excepcionesPsicofisico = await basePayload.find({
    collection: 'horario-psicofisico-excepcion',
    sort: '-fecha',
    limit: 365,
  })

  return <ExcepcionesPsicofisicoPage excepcionesPsicofisico={excepcionesPsicofisico.docs} />
}
