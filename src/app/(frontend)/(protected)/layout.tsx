import { basePayload } from '@/web/libs/payload'
import { headers } from 'next/headers'
import { redirect, RedirectType } from 'next/navigation'
import type { PropsWithChildren } from 'react'

export default async function Layout({ children }: PropsWithChildren) {
  const headersStore = await headers()
  const auth = await basePayload.auth({
    headers: headersStore,
  })

  if (!auth.user) {
    redirect('/login', RedirectType.replace)
  }

  return <>{children}</>
}
