import type { CollectionConfig } from 'payload'

import { DISPLAY_DATE_FORMAT } from '@/constants/fechas'
import { ESTADO_TURNO_DEFAULT, HORARIO_CURSO, OPCIONES_ESTADO_TURNO } from '@/constants/turnos'

export const TurnoCurso: CollectionConfig = {
  slug: 'turno-curso',
  labels: {
    singular: 'Turno de Curso',
    plural: 'Turnos de Curso',
  },
  admin: {
    group: 'Trámites',
    description: 'Turnos para el curso presencial de educación vial',
    defaultColumns: ['ciudadano', 'fecha', 'estado'],
  },
  defaultSort: 'fecha',
  timestamps: true,
  fields: [
    {
      name: 'ciudadano',
      type: 'relationship',
      relationTo: 'ciudadano',
      required: true,
      label: 'Ciudadano',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'fecha',
          type: 'date',
          required: true,
          label: 'Fecha del Turno',
          admin: {
            width: '40%',
            date: { displayFormat: DISPLAY_DATE_FORMAT },
          },
        },
        {
          name: 'hora',
          type: 'text',
          label: 'Hora',
          defaultValue: HORARIO_CURSO.INICIO,
          admin: {
            width: '20%',
            placeholder: 'HH:MM',
            readOnly: true,
            description: `Horario fijo: ${HORARIO_CURSO.INICIO} a ${HORARIO_CURSO.FIN}`,
          },
        },
        {
          name: 'estado',
          type: 'select',
          options: OPCIONES_ESTADO_TURNO,
          required: true,
          defaultValue: ESTADO_TURNO_DEFAULT,
          label: 'Estado',
          admin: { width: '40%' },
        },
      ],
    },
    {
      name: 'observaciones',
      type: 'textarea',
      label: 'Observaciones',
    },
  ],
}
