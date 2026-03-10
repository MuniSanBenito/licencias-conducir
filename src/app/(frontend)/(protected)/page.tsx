import type { Metadata } from 'next'
import DashboardPage from './page-client'

export const metadata: Metadata = {
  title: 'Tablero',
}

export default function Page() {
  return <DashboardPage />
}
