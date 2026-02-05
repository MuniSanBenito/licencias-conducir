import { basePayload } from '@/web/libs/payload'
import { TramiteProgresoPageClient } from './page-client'

export default async function TramiteProgresoPage() {
  const tramiteProgresos = await basePayload.find({
    collection: 'tramite-progreso',
    pagination: false,
    depth: 3,
  })

  return <TramiteProgresoPageClient tramiteProgresos={tramiteProgresos?.docs || []} />
}
