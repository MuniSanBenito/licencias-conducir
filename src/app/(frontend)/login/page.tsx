import { basePayload } from '@/web/libs/payload'
import { headers } from 'next/headers'
import { redirect, RedirectType } from 'next/navigation'
import { LoginPage } from './page-client'

export default async function Page() {
  const headersStore = await headers()
  const auth = await basePayload.auth({
    headers: headersStore,
  })

  console.log(auth)

  if (auth.user) {
    redirect('/', RedirectType.replace)
  }

  return <LoginPage />
}
