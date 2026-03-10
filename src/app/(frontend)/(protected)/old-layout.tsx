import { basePayload } from '@/web/libs/payload/server'
import { NavBar } from '@/web/ui/molecules/old-navbar'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { redirect, RedirectType } from 'next/navigation'
import type { PropsWithChildren } from 'react'

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

  return (
    <div className="bg-base-200 flex h-screen">
      {/* Sidebar */}
      <aside className="bg-base-100 flex w-64 flex-col shadow-lg">
        <div className="border-base-200 border-b p-4">
          <h1 className="text-primary text-xl font-bold">Panel de Control</h1>
          <p className="text-base-content/60 text-xs">Licencias San Benito</p>
        </div>

        <NavBar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  )
}
