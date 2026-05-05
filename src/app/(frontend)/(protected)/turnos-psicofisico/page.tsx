import { TIPO_TURNO } from '@/constants/turnos'
import type { Ciudadano, TurnoPsicofisico } from '@/payload-types'
import { basePayload } from '@/web/libs/payload/server'
import { isCiudadanoDocument } from '@/web/utils/is-ciudadano-document'
import { TurnosListPage } from '@/web/ui/templates/turnos-list-page'
import { IconStethoscope } from '@tabler/icons-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Turnos de Examen Psicofísico',
}

type TurnoPsicoPopulated = TurnoPsicofisico & { ciudadano: Ciudadano }

export default async function Page() {
  const [result, diasInhabiles, excepcionesPsicofisico] = await Promise.all([
    basePayload.find({
      collection: 'turno-psicofisico',
      where: {
        estado: { not_in: ['cancelado'] },
      },
      sort: 'fecha',
      limit: 150,
      depth: 1,
    }),
    basePayload.find({ collection: 'dia-inhabil', where: { activo: { equals: true } }, limit: 365 }),
    basePayload.find({ collection: 'horario-psicofisico-excepcion', sort: '-fecha', limit: 365 }),
  ])

  const turnos = result.docs.filter((t): t is TurnoPsicoPopulated =>
    isCiudadanoDocument(t.ciudadano),
  )

  return (
    <TurnosListPage
      tipoTurno={TIPO_TURNO.PSICOFISICO}
      turnos={turnos}
      diasInhabiles={diasInhabiles.docs}
      excepcionesPsicofisico={excepcionesPsicofisico.docs}
      icon={<IconStethoscope size={22} className="text-info" />}
    />
  )
}
