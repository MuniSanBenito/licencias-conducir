import { basePayload } from '@/web/libs/payload/server'
import { headers } from 'next/headers'
import { redirect, RedirectType } from 'next/navigation'
import { LoginPageClient } from './page-client'

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
