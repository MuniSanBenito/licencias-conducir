import { DISPLAY_DATE_FORMAT } from '@/constants/fechas'
import type { CollectionConfig } from 'payload'

export const HorarioPsicofisicoExcepcion: CollectionConfig = {
  slug: 'horario-psicofisico-excepcion',
  labels: {
    singular: 'Excepción de Horario Psicofísico',
    plural: 'Excepciones de Horario Psicofísico',
  },
  admin: {
    group: 'Agenda',
    useAsTitle: 'fecha',
    defaultColumns: ['fecha', 'inicio', 'fin', 'activo'],
    description: 'Permite configurar horario especial de psicofísico para fechas puntuales',
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
      type: 'row',
      fields: [
        {
          name: 'inicio',
          type: 'text',
          required: true,
          admin: {
            width: '40%',
            placeholder: 'HH:MM',
          },
        },
        {
          name: 'fin',
          type: 'text',
          required: true,
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
          admin: {
            width: '20%',
            description: 'Si está inactivo, se bloquea la agenda de psicofísico en esta fecha',
          },
        },
      ],
    },
    {
      name: 'motivo',
      type: 'text',
      label: 'Motivo (opcional)',
    },
  ],
}
