import { TurnoForm } from '@/components/turnos/TurnoForm'
import { mockDb } from '@/lib/mock-db'
import { IconArrowLeft } from '@tabler/icons-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function NuevoTurnoPage() {
  const [areas, users] = await Promise.all([mockDb.getAreas(), mockDb.getUsers()])

  return (
    <div className="container mx-auto max-w-2xl p-4">
      <div className="mb-6">
        <Link href="/gestion/turnos" className="btn btn-ghost gap-2">
          <IconArrowLeft size={20} />
          Volver al listado
        </Link>
      </div>

      <TurnoForm areas={areas} users={users} />
    </div>
  )
}
