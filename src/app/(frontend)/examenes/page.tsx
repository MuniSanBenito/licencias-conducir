import { IngresoExamenPage } from '@/web/ui/templates/ingreso-examen-page'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ingreso a Examen Teórico | Licencias San Benito',
  description: 'Portal de evaluación para licencias de conducir',
}

export default async function Page() {
  return <IngresoExamenPage />
}
