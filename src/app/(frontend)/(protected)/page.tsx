import { DashboardPage } from '@/web/ui/templates/dashboard-page'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tablero',
}

export default function Page() {
  return <DashboardPage />
}
