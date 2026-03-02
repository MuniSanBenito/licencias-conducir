import { basePayload } from '@/web/libs/payload/server'
import { TurnoPageClient } from './page-client'

export default async function TurnoPage() {
  const turnos = await basePayload.find({
    collection: 'turno',
    pagination: false,
    depth: 4,
  })

  return <TurnoPageClient turnos={turnos?.docs || []} />
}
