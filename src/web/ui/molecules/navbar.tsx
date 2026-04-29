'use client'
import {
  IconCalendarOff,
  IconCalendarTime,
  IconLayoutDashboard,
  IconLogout,
  IconSchool,
  IconStethoscope,
  IconUsers,
} from '@tabler/icons-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { twJoin } from 'tailwind-merge'

const NAV_ITEMS = [
  { href: '/', label: 'Tablero', icon: IconLayoutDashboard },
  { href: '/ciudadanos', label: 'Ciudadanos', icon: IconUsers },
  { href: '/turnos-curso', label: 'Turnos Curso', icon: IconSchool },
  { href: '/turnos-psicofisico', label: 'Turnos Psicofísico', icon: IconStethoscope },
  { href: '/dias-inhabiles', label: 'Días inhábiles', icon: IconCalendarOff },
  { href: '/excepciones-psicofisico', label: 'Excepciones psicofísico', icon: IconCalendarTime },
]

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()

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
      toast.error(error instanceof Error ? error.message : 'Ocurrió un error al cerrar sesión')
    }
  }

  return (
    <>
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
      <button onClick={handleClickLogout} className="btn btn-ghost mx-3 mb-3">
        <IconLogout size={20} />
        Cerrar Sesión
      </button>
    </>
  )
}
