import { DISPLAY_DATE_FORMAT } from '@/constants/fechas'
import type { CollectionConfig } from 'payload'

export const DiaInhabil: CollectionConfig = {
  slug: 'dia-inhabil',
  labels: {
    singular: 'Día Inhábil',
    plural: 'Días Inhábiles',
  },
  admin: {
    group: 'Agenda',
    useAsTitle: 'motivo',
    defaultColumns: ['fecha', 'motivo', 'activo'],
    description: 'Fechas inhabilitadas para asignación de turnos',
  },
  defaultSort: '-fecha',
  timestamps: true,
  fields: [
    {
      name: 'fecha',
      type: 'date',
      required: true,
      unique: true,
      index: true,
      admin: {
        date: { displayFormat: DISPLAY_DATE_FORMAT },
      },
    },
    {
      name: 'motivo',
      type: 'text',
      required: true,
      label: 'Motivo',
    },
    {
      name: 'activo',
      type: 'checkbox',
      defaultValue: true,
      required: true,
      label: 'Bloquear turnos en esta fecha',
    },
  ],
}
