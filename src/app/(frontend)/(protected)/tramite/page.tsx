import { basePayload } from '@/web/libs/payload/server'
import { TramitePageClient } from './page-client'

export default async function TramitePage() {
  const tramite = await basePayload.find({
    collection: 'tramite',
    pagination: false,
  })

  return <TramitePageClient tramites={tramite?.docs || []} />
}
