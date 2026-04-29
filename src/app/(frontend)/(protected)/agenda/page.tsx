import { basePayload } from '@/web/libs/payload/server'
import { AgendaPage } from '@/web/ui/templates/agenda-page'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Agenda Operativa',
}

export default async function Page() {
  const [diasInhabiles, excepcionesPsicofisico] = await Promise.all([
    basePayload.find({ collection: 'dia-inhabil', sort: '-fecha', limit: 365 }),
    basePayload.find({ collection: 'horario-psicofisico-excepcion', sort: '-fecha', limit: 365 }),
  ])

  return (
    <AgendaPage
      diasInhabiles={diasInhabiles.docs}
      excepcionesPsicofisico={excepcionesPsicofisico.docs}
    />
  )
}
