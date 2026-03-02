import { basePayload } from '@/web/libs/payload/server'
import { TramitePageClient } from './page-client'

export default async function TramitePage() {
  const tramites = await basePayload.find({
    collection: 'tramite',
  })

  const tramitesProceso = await basePayload.find({
    collection: 'tramite-proceso',
  })

  return <TramitePageClient tramites={tramites.docs} />
}
