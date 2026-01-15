'use client'

import {
  IconArrowRight,
  IconCalendar,
  IconChecklist,
  IconFiles,
  IconLogout,
  IconUsers,
} from '@tabler/icons-react'
import { useState } from 'react'
import { twJoin } from 'tailwind-merge'
import { logoutAction } from '../actions'
import { CiudadanoForm } from './forms/ciudadano-form'
import { TramiteForm } from './forms/tramite-form'
import { TramiteProcesoForm } from './forms/tramite-proceso-form'
import { TramiteProgresoForm } from './forms/tramite-progreso-form'
import { TurnoForm } from './forms/turno-form'
import { ResourceManager } from './resource-manager'
// Import other forms as created

type CollectionKey = 'ciudadano' | 'tramite' | 'tramite-proceso' | 'tramite-progreso' | 'turno'

export function DashboardClient() {
  const [activeCollection, setActiveCollection] = useState<CollectionKey>('ciudadano')

  const menuItems: { key: CollectionKey; label: string; icon: React.ReactNode }[] = [
    { key: 'ciudadano', label: 'Ciudadanos', icon: <IconUsers size={20} /> },
    { key: 'tramite', label: 'Trámites', icon: <IconFiles size={20} /> },
    { key: 'tramite-proceso', label: 'Trámite Procesos', icon: <IconArrowRight size={20} /> },
    { key: 'tramite-progreso', label: 'Trámite Progresos', icon: <IconChecklist size={20} /> },
    { key: 'turno', label: 'Turnos', icon: <IconCalendar size={20} /> },
  ]

  return (
    <div className="bg-base-200 flex h-screen">
      {/* Sidebar */}
      <aside className="bg-base-100 flex w-64 flex-col shadow-lg">
        <div className="border-base-200 border-b p-4">
          <h1 className="text-primary text-xl font-bold">Admin Panel</h1>
          <p className="text-base-content/60 text-xs">Licencias San Benito</p>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveCollection(item.key)}
              className={twJoin(
                'flex w-full items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                activeCollection === item.key
                  ? 'bg-primary text-primary-content'
                  : 'text-base-content hover:bg-base-200',
              )}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="border-base-200 border-t p-4">
          <button
            onClick={() => logoutAction()}
            className="text-error hover:bg-error/10 flex w-full items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          >
            <IconLogout size={20} className="mr-3" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">
        <div className="mx-auto max-w-6xl">
          {activeCollection === 'ciudadano' && (
            <ResourceManager
              collection="ciudadano"
              title="Gestión de Ciudadanos"
              FormComponent={CiudadanoForm}
            />
          )}
          {activeCollection === 'tramite' && (
            <ResourceManager
              collection="tramite"
              title="Gestión de Trámites"
              FormComponent={TramiteForm}
            />
          )}
          {activeCollection === 'tramite-proceso' && (
            <ResourceManager
              collection="tramite-proceso"
              title="Gestión de Trámite Procesos"
              FormComponent={TramiteProcesoForm}
            />
          )}
          {activeCollection === 'tramite-progreso' && (
            <ResourceManager
              collection="tramite-progreso"
              title="Gestión de Trámite Progresos"
              FormComponent={TramiteProgresoForm}
            />
          )}
          {activeCollection === 'turno' && (
            <ResourceManager
              collection="turno"
              title="Gestión de Turnos"
              FormComponent={TurnoForm}
            />
          )}
        </div>
      </main>
    </div>
  )
}
