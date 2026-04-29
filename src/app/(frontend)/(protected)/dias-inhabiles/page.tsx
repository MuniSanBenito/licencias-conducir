import { basePayload } from '@/web/libs/payload/server'
import { DiasInhabilesPage } from '@/web/ui/templates/dias-inhabiles-page'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Días inhábiles',
}

export default async function Page() {
  const diasInhabiles = await basePayload.find({ collection: 'dia-inhabil', sort: '-fecha', limit: 365 })

  return <DiasInhabilesPage diasInhabiles={diasInhabiles.docs} />
}
