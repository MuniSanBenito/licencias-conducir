'use client'

import { signOut } from '@/app/actions/auth'
import {
  IconArrowRight,
  IconCalendar,
  IconChecklist,
  IconFiles,
  IconLogout,
  IconUsers,
} from '@tabler/icons-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { type PropsWithChildren, type ReactNode } from 'react'
import { twJoin } from 'tailwind-merge'

type CollectionKey = 'ciudadano' | 'tramite' | 'tramite-proceso' | 'tramite-progreso' | 'turno'

const menuItems: { key: CollectionKey; label: string; icon: ReactNode }[] = [
  { key: 'ciudadano', label: 'Ciudadanos', icon: <IconUsers size={20} /> },
  { key: 'tramite', label: 'Trámites', icon: <IconFiles size={20} /> },
  { key: 'tramite-proceso', label: 'Trámite Procesos', icon: <IconArrowRight size={20} /> },
  { key: 'tramite-progreso', label: 'Trámite Progresos', icon: <IconChecklist size={20} /> },
  { key: 'turno', label: 'Turnos', icon: <IconCalendar size={20} /> },
]

export function ProtectedLayoutClient({ children }: PropsWithChildren) {
  const pathname = usePathname()

  const [, basePath] = pathname.split('/')

  return (
    <div className="bg-base-200 flex h-screen">
      {/* Sidebar */}
      <aside className="bg-base-100 flex w-64 flex-col shadow-lg">
        <div className="border-base-200 border-b p-4">
          <h1 className="text-primary text-xl font-bold">Panel de Control</h1>
          <p className="text-base-content/60 text-xs">Licencias San Benito</p>
        </div>

        <nav className="flex-1">
          <ul className="menu w-full">
            {menuItems.map((item) => (
              <li key={item.key}>
                <Link
                  href={`/${item.key}`}
                  className={twJoin(basePath === item.key && 'menu-active')}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-base-200 border-t p-4">
          <button onClick={() => signOut()} className="btn btn-ghost btn-error w-full">
            <IconLogout size={20} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  )
}
