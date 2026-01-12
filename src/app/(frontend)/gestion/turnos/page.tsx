import { TurnoList } from '@/components/turnos/TurnoList'
import { mockDb } from '@/lib/mock-db'
import { IconPlus } from '@tabler/icons-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic' // Ensure we fetch fresh data

export default async function TurnosPage() {
  const [appointments, areas, users] = await Promise.all([
    mockDb.getAppointments(),
    mockDb.getAreas(),
    mockDb.getUsers(),
  ])

  return (
    <div className="container mx-auto max-w-5xl p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestión de Turnos</h1>
        <Link href="/gestion/turnos/nuevo" className="btn btn-primary">
          <IconPlus size={20} />
          Nuevo Turno
        </Link>
      </div>

      <TurnoList initialAppointments={appointments} areas={areas} users={users} />
    </div>
  )
}
