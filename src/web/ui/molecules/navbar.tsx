'use client'

import { signOut } from '@/app/actions/auth'
import { IconCalendar, IconChecklist, IconFiles, IconLogout, IconUsers } from '@tabler/icons-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { type ReactNode } from 'react'
import { twJoin } from 'tailwind-merge'

type CollectionKey = 'ciudadano' | 'tramite' | 'tramite-progreso' | 'turno'

const menuItems: { key: CollectionKey; label: string; icon: ReactNode }[] = [
  { key: 'ciudadano', label: 'Ciudadanos', icon: <IconUsers size={20} /> },
  { key: 'tramite', label: 'Trámites', icon: <IconFiles size={20} /> },
  { key: 'tramite-progreso', label: 'Trámite Progresos', icon: <IconChecklist size={20} /> },
  { key: 'turno', label: 'Turnos', icon: <IconCalendar size={20} /> },
]

export function NavBar() {
  const pathname = usePathname()

  const [, basePath] = pathname.split('/')

  return (
    <>
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
    </>
  )
}
