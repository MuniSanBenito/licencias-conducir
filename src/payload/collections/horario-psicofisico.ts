import type { CollectionConfig } from 'payload'

export const HorarioPsicofisico: CollectionConfig = {
  slug: 'horario-psicofisico',
  labels: {
    singular: 'Horario Psicofísico',
    plural: 'Horarios Psicofísicos',
  },
  admin: {
    group: 'Agenda',
    useAsTitle: 'diaSemana',
    defaultColumns: ['diaSemanaLabel', 'inicio', 'fin', 'activo'],
    description: 'Horario de atención por día para examen psicofísico',
  },
  defaultSort: 'diaSemana',
  timestamps: true,
  fields: [
    {
      name: 'diaSemana',
      type: 'select',
      required: true,
      unique: true,
      options: [
        { label: 'Lunes', value: '1' },
        { label: 'Martes', value: '2' },
        { label: 'Miércoles', value: '3' },
        { label: 'Jueves', value: '4' },
        { label: 'Viernes', value: '5' },
      ],
      label: 'Día de semana',
    },
    {
      name: 'diaSemanaLabel',
      type: 'text',
      virtual: true,
      admin: { hidden: true },
      hooks: {
        afterRead: [
          ({ siblingData }) => {
            const labels: Record<string, string> = {
              '1': 'Lunes',
              '2': 'Martes',
              '3': 'Miércoles',
              '4': 'Jueves',
              '5': 'Viernes',
            }
            return labels[siblingData?.diaSemana] ?? 'Día no definido'
          },
        ],
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'inicio',
          type: 'text',
          required: true,
          label: 'Inicio',
          admin: {
            width: '40%',
            placeholder: 'HH:MM',
          },
        },
        {
          name: 'fin',
          type: 'text',
          required: true,
          label: 'Fin',
          admin: {
            width: '40%',
            placeholder: 'HH:MM',
          },
        },
        {
          name: 'activo',
          type: 'checkbox',
          required: true,
          defaultValue: true,
          admin: { width: '20%' },
        },
      ],
    },
  ],
}
