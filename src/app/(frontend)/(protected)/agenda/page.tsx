import { basePayload } from '@/web/libs/payload/server'
import { AgendaPage } from '@/web/ui/templates/agenda-page'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Agenda Operativa',
}

export default async function Page() {
  const [diasInhabiles, horariosPsicofisico] = await Promise.all([
    basePayload.find({ collection: 'dia-inhabil', sort: '-fecha', limit: 365 }),
    basePayload.find({ collection: 'horario-psicofisico', sort: 'diaSemana', limit: 10 }),
  ])

  return <AgendaPage diasInhabiles={diasInhabiles.docs} horariosPsicofisico={horariosPsicofisico.docs} />
}
