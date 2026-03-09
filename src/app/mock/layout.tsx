'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { PropsWithChildren } from 'react'

const SIDEBAR_WIDTH = 240

const NAV_ITEMS = [
  { href: '/mock', label: '📊 Dashboard' },
  { href: '/mock/ciudadanos', label: '👥 Ciudadanos' },
  { href: '/mock/tramite/nuevo', label: '➕ Nuevo Trámite' },
]

export default function MockLayout({ children }: PropsWithChildren) {
  const pathname = usePathname()

  return (
    <html lang="es">
      <body
        style={{
          margin: 0,
          fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
          background: '#f0f2f5',
          color: '#1a1a2e',
          minHeight: '100vh',
        }}
      >
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          {/* Sidebar */}
          <aside
            style={{
              width: SIDEBAR_WIDTH,
              background: 'linear-gradient(180deg, #1a237e 0%, #283593 100%)',
              color: '#fff',
              display: 'flex',
              flexDirection: 'column',
              flexShrink: 0,
            }}
          >
            {/* Logo / Título */}
            <div
              style={{
                padding: '24px 16px',
                borderBottom: '1px solid rgba(255,255,255,0.15)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 4 }}>🏛️</div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: 0.5,
                  textTransform: 'uppercase',
                }}
              >
                Municipalidad
              </div>
              <div style={{ fontSize: 11, opacity: 0.8, marginTop: 2 }}>
                San Benito · Entre Ríos
              </div>
            </div>

            {/* Navegación */}
            <nav style={{ padding: '16px 0', flex: 1 }}>
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    style={{
                      display: 'block',
                      padding: '12px 20px',
                      fontSize: 14,
                      fontWeight: isActive ? 600 : 400,
                      color: '#fff',
                      textDecoration: 'none',
                      background: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                      borderLeft: isActive ? '3px solid #64b5f6' : '3px solid transparent',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            {/* Footer sidebar */}
            <div
              style={{
                padding: '16px',
                borderTop: '1px solid rgba(255,255,255,0.15)',
                fontSize: 11,
                opacity: 0.6,
                textAlign: 'center',
              }}
            >
              Sistema de Licencias v0.1
            </div>
          </aside>

          {/* Contenido principal */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <header
              style={{
                background: '#fff',
                padding: '16px 32px',
                borderBottom: '1px solid #e0e0e0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              }}
            >
              <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: '#1a237e' }}>
                🚗 Licencias de Conducir
              </h1>
              <div style={{ fontSize: 13, color: '#666' }}>
                Operador: <strong>Admin</strong>
              </div>
            </header>

            {/* Contenido */}
            <main style={{ flex: 1, padding: 32 }}>{children}</main>
          </div>
        </div>
      </body>
    </html>
  )
}
