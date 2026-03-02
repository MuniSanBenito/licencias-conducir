import { basePayload } from '@/web/libs/payload/server'
import { notFound } from 'next/navigation'
import { EditarCiudadanoClient } from './page-client'

export default async function CiudadanoPage({ params }: PageProps<'/ciudadano/[id]'>) {
  const { id } = await params

  try {
    const ciudadano = await basePayload.findByID({
      collection: 'ciudadano',
      id,
      depth: 0,
    })
    if (ciudadano) {
      return <EditarCiudadanoClient ciudadano={ciudadano} />
    }

    // Si no se encuentra el ciudadano, mostrar página 404
  } catch (error) {
    console.error(error)
  }

  notFound()
}
