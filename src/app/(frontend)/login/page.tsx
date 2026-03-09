import { basePayload } from '@/web/libs/payload/server'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { redirect, RedirectType } from 'next/navigation'
import { LoginPageClient } from './page-client'

export const metadata: Metadata = {
  title: 'Iniciar sesión — Gestión de Licencias',
  description:
    'Accedé al sistema de gestión de licencias de conducir. Ingresá tus credenciales para continuar.',
}

export default async function LoginPage() {
  const headersStore = await headers()
  const auth = await basePayload.auth({
    headers: headersStore,
  })

  if (auth.user) {
    redirect('/', RedirectType.replace)
  }

  return <LoginPageClient />
}
