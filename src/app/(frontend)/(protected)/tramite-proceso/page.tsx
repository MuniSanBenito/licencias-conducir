import { basePayload } from '@/web/libs/payload'
import { TramiteProcesoPageClient } from './page-client'

export default async function TramiteProcesoPage() {
  const tramiteProcesos = await basePayload.find({
    collection: 'tramite-proceso',
    pagination: false,
  })

  return <TramiteProcesoPageClient tramiteProcesos={tramiteProcesos?.docs || []} />
}
