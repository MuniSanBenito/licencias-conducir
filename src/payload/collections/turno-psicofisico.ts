import type { CollectionConfig } from 'payload'

import { DISPLAY_DATE_FORMAT } from '@/constants/fechas'
import { ESTADO_TURNO_DEFAULT, OPCIONES_ESTADO_TURNO } from '@/constants/tramites'

export const TurnoPsicofisico: CollectionConfig = {
  slug: 'turno-psicofisico',
  labels: {
    singular: 'Turno Psicofísico',
    plural: 'Turnos Psicofísicos',
  },
  admin: {
    group: 'Trámites',
    description: 'Turnos para el examen psicofísico',
    defaultColumns: ['tramite', 'fecha', 'hora', 'estado'],
  },
  defaultSort: 'fecha',
  timestamps: true,
  fields: [
    {
      name: 'tramite',
      type: 'relationship',
      relationTo: 'tramite',
      required: true,
      unique: true,
      label: 'Trámite',
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
            width: '35%',
            date: { displayFormat: DISPLAY_DATE_FORMAT },
          },
        },
        {
          name: 'hora',
          type: 'text',
          required: true,
          label: 'Hora',
          admin: {
            width: '25%',
            placeholder: 'HH:MM',
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
