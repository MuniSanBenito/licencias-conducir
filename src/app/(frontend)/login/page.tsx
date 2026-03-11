import { basePayload } from '@/web/libs/payload/server'
import { LoginPage } from '@/web/ui/templates/login-page'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { redirect, RedirectType } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Iniciar sesión — Gestión de Licencias',
  description:
    'Accedé al sistema de gestión de licencias de conducir. Ingresá tus credenciales para continuar.',
}

export default async function Page() {
  const headersStore = await headers()
  const auth = await basePayload.auth({
    headers: headersStore,
  })

  if (auth.user) {
    redirect('/', RedirectType.replace)
  }

  return <LoginPage />
}
