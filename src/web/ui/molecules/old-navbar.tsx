'use client'

import { IconCalendar, IconChecklist, IconFiles, IconLogout, IconUsers } from '@tabler/icons-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { type ReactNode } from 'react'
import { toast } from 'sonner'
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
  const router = useRouter()

  const [, basePath] = pathname.split('/')

  const handleClickLogout = async () => {
    try {
      const req = await fetch('/api/usuario/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (req.ok) {
        toast.success('Sesión cerrada exitosamente')
        router.replace('/login')
      } else {
        toast.error('Ocurrió un error al cerrar sesión')
      }
    } catch (error) {
      console.error(error)
      toast.error(error instanceof Error ? error.message : 'Ocurrió un error al cerrar sesión')
    }
  }

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
        <button onClick={handleClickLogout} className="btn btn-ghost btn-error w-full">
          <IconLogout size={20} />
          Cerrar Sesión
        </button>
      </div>
    </>
  )
}
