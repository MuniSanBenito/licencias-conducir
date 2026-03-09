'use client'
import './styles.css'

import {
  IconBuildingCommunity,
  IconCar,
  IconFilePlus,
  IconLayoutDashboard,
  IconUsers,
} from '@tabler/icons-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { PropsWithChildren } from 'react'
import { twJoin } from 'tailwind-merge'

const NAV_ITEMS = [
  { href: '/mock', label: 'Tablero', icon: IconLayoutDashboard },
  { href: '/mock/ciudadanos', label: 'Ciudadanos', icon: IconUsers },
  { href: '/mock/tramite/nuevo', label: 'Nuevo Trámite', icon: IconFilePlus },
]

export default function MockLayout({ children }: PropsWithChildren) {
  const pathname = usePathname()

  return (
    <html lang="es">
      <body>
        <section className="drawer drawer-open">
          <input id="mock-drawer" type="checkbox" className="drawer-toggle" />

          <main className="drawer-content flex flex-col">
            <header className="navbar bg-base-100 border-base-300 border-b shadow-sm">
              <section className="flex flex-1 items-center gap-2">
                <IconCar size={24} className="text-primary" />
                <h1 className="text-lg font-semibold">Licencias de Conducir</h1>
              </section>
              <section className="flex-none">
                <span className="text-sm opacity-70">
                  Operador: <strong>Admin</strong>
                </span>
              </section>
            </header>

            <article className="flex-1 p-8">{children}</article>
          </main>

          <aside className="drawer-side">
            <label htmlFor="mock-drawer" aria-label="Cerrar sidebar" className="drawer-overlay" />
            <section className="menu bg-neutral text-neutral-content flex min-h-full w-60 flex-col p-0">
              <header className="border-b border-white/15 p-6 text-center">
                <IconBuildingCommunity size={32} className="mx-auto mb-1" />
                <p className="text-xs font-bold tracking-wider uppercase">Municipalidad</p>
                <p className="mt-1 text-[11px] opacity-80">San Benito · Entre Ríos</p>
              </header>

              <nav className="flex-1 py-4">
                <ul className="menu w-full gap-1 px-2">
                  {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={twJoin(isActive && 'menu-active')}
                          aria-current={isActive ? 'page' : undefined}
                        >
                          <item.icon size={18} />
                          {item.label}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </nav>

              <footer className="border-t border-white/15 p-4 text-center text-[11px] opacity-60">
                Sistema de Licencias v0.1
              </footer>
            </section>
          </aside>
        </section>
      </body>
    </html>
  )
}
