'use client'
import { IconFilePlus, IconLayoutDashboard, IconUsers } from '@tabler/icons-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { twJoin } from 'tailwind-merge'

const NAV_ITEMS = [
  { href: '/', label: 'Tablero', icon: IconLayoutDashboard },
  { href: '/ciudadanos', label: 'Ciudadanos', icon: IconUsers },
  { href: '/tramite/nuevo', label: 'Nuevo Trámite', icon: IconFilePlus },
]

export function Navbar() {
  const pathname = usePathname()

  return (
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
  )
}
