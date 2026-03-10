import type { PropsWithChildren } from 'react'
import { Toaster } from 'sonner'
import './styles.css'

export const metadata = {
  title: {
    default: 'Gestión de Licencias — Municipalidad de San Benito',
    template: '%s — Licencias San Benito',
  },
  description:
    'Sistema de gestión de licencias de conducir de la Municipalidad de San Benito, Entre Ríos.',
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="es" data-theme="light">
      <body>
        {children}
        <Toaster richColors closeButton />
      </body>
    </html>
  )
}
