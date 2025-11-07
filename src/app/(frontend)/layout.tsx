import type { PropsWithChildren } from 'react'
import './styles.css'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="es" data-theme="light">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
