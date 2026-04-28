import { TIPO_TURNO } from '@/constants/tramites'
import type { Ciudadano, Tramite, TurnoPsicofisico } from '@/payload-types'
import { basePayload } from '@/web/libs/payload/server'
import { TurnosListPage } from '@/web/ui/templates/turnos-list-page'
import { IconStethoscope } from '@tabler/icons-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Turnos de Examen Psicofísico',
}

type TurnoPsicoPopulated = TurnoPsicofisico & { tramite: Tramite & { ciudadano: Ciudadano } }

export default async function Page() {
  const result = await basePayload.find({
    collection: 'turno-psicofisico',
    where: {
      estado: { not_in: ['cancelado'] },
    },
    sort: 'fecha',
    limit: 100,
    depth: 2,
  })

  const turnos = result.docs.filter(
    (t): t is TurnoPsicoPopulated =>
      typeof t.tramite !== 'string' && typeof (t.tramite as Tramite).ciudadano !== 'string',
  )

  return (
    <TurnosListPage
      tipoTurno={TIPO_TURNO.PSICOFISICO}
      turnos={turnos}
      icon={<IconStethoscope size={22} className="text-info" />}
    />
  )
}
