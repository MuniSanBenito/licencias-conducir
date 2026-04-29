import { TIPO_TURNO } from '@/constants/turnos'
import type { Ciudadano, TurnoCurso } from '@/payload-types'
import { basePayload } from '@/web/libs/payload/server'
import { TurnosListPage } from '@/web/ui/templates/turnos-list-page'
import { IconSchool } from '@tabler/icons-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Turnos de Curso Presencial',
}

type TurnoCursoPopulated = TurnoCurso & { ciudadano: Ciudadano }

export default async function Page() {
  const [result, diasInhabiles, horariosPsicofisico, excepcionesPsicofisico] = await Promise.all([
    basePayload.find({
      collection: 'turno-curso',
      where: {
        estado: { not_in: ['cancelado'] },
      },
      sort: 'fecha',
      limit: 100,
      depth: 1,
    }),
    basePayload.find({ collection: 'dia-inhabil', where: { activo: { equals: true } }, limit: 365 }),
    basePayload.find({ collection: 'horario-psicofisico', sort: 'diaSemana', limit: 10 }),
    basePayload.find({ collection: 'horario-psicofisico-excepcion', sort: '-fecha', limit: 365 }),
  ])

  const turnos = result.docs.filter(
    (t): t is TurnoCursoPopulated => typeof t.ciudadano !== 'string',
  )

  return (
    <TurnosListPage
      tipoTurno={TIPO_TURNO.CURSO}
      turnos={turnos}
      diasInhabiles={diasInhabiles.docs}
      horariosPsicofisico={horariosPsicofisico.docs}
      excepcionesPsicofisico={excepcionesPsicofisico.docs}
      icon={<IconSchool size={22} className="text-warning" />}
    />
  )
}
