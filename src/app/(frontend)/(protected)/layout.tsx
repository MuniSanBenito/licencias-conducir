import { basePayload } from '@/web/libs/payload/server'
import { Navbar } from '@/web/ui/molecules/navbar'
import { IconBuildingCommunity } from '@tabler/icons-react'
import { headers } from 'next/headers'
import { redirect, RedirectType } from 'next/navigation'
import type { PropsWithChildren } from 'react'

export default async function ProtectedLayout({ children }: PropsWithChildren) {
  const headersStore = await headers()
  const auth = await basePayload.auth({
    headers: headersStore,
  })

  if (!auth.user) {
    redirect('/login', RedirectType.replace)
  }

  return (
    <section className="drawer drawer-open">
      <a href="#main-content" className="btn btn-primary absolute -top-12 left-4 z-50 focus:top-4">
        Saltar al contenido principal
      </a>
      <input id="protected-drawer" type="checkbox" className="drawer-toggle" />

      <main id="main-content" className="drawer-content flex flex-col" tabIndex={-1}>
        {/* <header className="navbar bg-base-100 border-base-300 sticky top-0 z-40 border-b shadow-sm">
          <section className="flex flex-1 items-center gap-2">
            <IconCar size={24} className="text-primary" />
            <h1 className="text-lg font-semibold">Licencias de Conducir</h1>
          </section>
          <section className="flex-none">
            <span className="text-sm opacity-70">
              Usuario: <strong>{auth.user?.email}</strong>
            </span>
          </section>
        </header> */}

        <article className="flex-1 p-8">{children}</article>
      </main>

      <aside className="drawer-side">
        <label htmlFor="protected-drawer" aria-label="Cerrar sidebar" className="drawer-overlay" />
        <section className="menu bg-neutral text-neutral-content flex min-h-full w-60 flex-col p-0">
          <header className="border-b border-white/15 p-6 text-center">
            <IconBuildingCommunity size={32} className="mx-auto mb-1" />
            <p className="text-xs font-bold tracking-wider uppercase">Municipalidad</p>
            <p className="mt-1 text-[11px] opacity-80">San Benito · Entre Ríos</p>
          </header>

          <Navbar />
        </section>
      </aside>
    </section>
  )
}
