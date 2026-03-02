import { basePayload } from '@/web/libs/payload/server'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { redirect, RedirectType } from 'next/navigation'
import type { PropsWithChildren } from 'react'
import { ProtectedLayoutClient } from './layout-client'

export const metadata: Metadata = {
  title: 'Admin Panel | Licencias',
  description: 'Gestión administrativa de licencias',
}

export default async function ProtectedLayout({ children }: PropsWithChildren) {
  const headersStore = await headers()
  const auth = await basePayload.auth({
    headers: headersStore,
  })

  if (!auth.user) {
    redirect('/login', RedirectType.replace)
  }

  return <ProtectedLayoutClient>{children}</ProtectedLayoutClient>
}
