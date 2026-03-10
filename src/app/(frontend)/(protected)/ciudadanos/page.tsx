import type { Metadata } from 'next'
import CiudadanosPage from './page-client'

export const metadata: Metadata = {
  title: 'Ciudadanos',
}

export default function Page() {
  return <CiudadanosPage />
}
