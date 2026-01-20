import { TurnoForm } from '@/web/components/forms/turno-form'
import { ResourceManager } from '@/web/components/resource-manager'

export default function TurnoPage() {
  return <ResourceManager collection="turno" title="Gestión de Turnos" FormComponent={TurnoForm} />
}
