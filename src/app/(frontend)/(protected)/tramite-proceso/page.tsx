import { TramiteProcesoForm } from '@/web/components/forms/tramite-proceso-form'
import { ResourceManager } from '@/web/components/resource-manager'

export default function TramiteProcesoPage() {
  return (
    <ResourceManager
      collection="tramite-proceso"
      title="Gestión de Trámite Procesos"
      FormComponent={TramiteProcesoForm}
    />
  )
}
