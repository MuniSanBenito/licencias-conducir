import { TramiteProgresoForm } from '@/web/components/forms/tramite-progreso-form'
import { ResourceManager } from '@/web/components/resource-manager'

export default function TramiteProgresoPage() {
  return (
    <ResourceManager
      collection="tramite-progreso"
      title="Gestión de Trámite Progresos"
      FormComponent={TramiteProgresoForm}
    />
  )
}
