import { TramiteForm } from '@/web/components/forms/tramite-form'
import { ResourceManager } from '@/web/components/resource-manager'

export default function TramitePage() {
  return (
    <ResourceManager collection="tramite" title="Gestión de Trámites" FormComponent={TramiteForm} />
  )
}
