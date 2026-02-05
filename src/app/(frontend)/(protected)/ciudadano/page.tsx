import { basePayload } from '@/web/libs/payload'
import { CiudadanoPageClient } from './page-client'

export default async function CiudadanoPage() {
  const ciudadanos = await basePayload.find({
    collection: 'ciudadano',
    pagination: false,
  })

  return <CiudadanoPageClient ciudadanos={ciudadanos.docs} />
}
