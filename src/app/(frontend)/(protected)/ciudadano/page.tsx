import { CiudadanoForm } from '@/web/components/forms/ciudadano-form'
import { ResourceManager } from '@/web/components/resource-manager'
import { basePayload } from '@/web/libs/payload'

export default async function CiudadanoPage() {
  const ciudadanos = await basePayload.find({
    collection: 'ciudadano',
    depth: 0,
    pagination: false,
  })

  return (
    <ResourceManager
      collection="ciudadano"
      title="Gestión de Ciudadanos"
      FormComponent={CiudadanoForm}
      data={ciudadanos.docs}
    />
  )
}
