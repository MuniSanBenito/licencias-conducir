import type { CollectionConfig } from 'payload'

import { DISPLAY_DATE_FORMAT } from '@/constants/fechas'
import {
  ESTADO_TRAMITE_DEFAULT,
  ESTADO_TURNO_DEFAULT,
  ESTADOS_TRAMITE_CON_FECHA_FIN,
  OPCIONES_ESTADO_TRAMITE,
  OPCIONES_ESTADO_TURNO,
  OPCIONES_TIPO_TRAMITE,
} from '@/constants/tramites'

const TURNO_FIELDS = [
  {
    type: 'row' as const,
    fields: [
      {
        name: 'fecha',
        type: 'date' as const,
        label: 'Fecha del Turno',
        admin: {
          width: '35%',
          date: { displayFormat: DISPLAY_DATE_FORMAT },
        },
      },
      {
        name: 'hora',
        type: 'text' as const,
        label: 'Hora',
        admin: {
          width: '25%',
          placeholder: 'HH:MM',
        },
      },
      {
        name: 'estado',
        type: 'select' as const,
        options: OPCIONES_ESTADO_TURNO,
        label: 'Estado del Turno',
        defaultValue: ESTADO_TURNO_DEFAULT,
        admin: { width: '40%' },
      },
    ],
  },
  {
    name: 'observaciones',
    type: 'textarea' as const,
    label: 'Observaciones del Turno',
  },
]

export const Tramite: CollectionConfig = {
  slug: 'tramite',
  labels: {
    singular: 'Trámite',
    plural: 'Trámites',
  },
  admin: {
    useAsTitle: 'fut',
    group: 'Trámites',
    description: 'Gestión de trámites de licencias de conducir',
    defaultColumns: ['ciudadano', 'tipo', 'estado', 'fechaInicio'],
    listSearchableFields: ['fut'],
  },
  defaultSort: '-createdAt',
  timestamps: true,
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'ciudadano',
          type: 'relationship',
          relationTo: 'ciudadano',
          required: true,
          admin: { width: '50%' },
        },
        {
          name: 'tipo',
          type: 'select',
          options: OPCIONES_TIPO_TRAMITE,
          required: true,
          label: 'Tipo de Trámite',
          admin: { width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'fut',
          type: 'text',
          unique: true,
          index: true,
          label: 'FUT',
          admin: { width: '30%' },
        },
        {
          name: 'estado',
          type: 'select',
          options: OPCIONES_ESTADO_TRAMITE,
          required: true,
          defaultValue: ESTADO_TRAMITE_DEFAULT,
          admin: { width: '25%' },
        },
        {
          name: 'fechaInicio',
          type: 'date',
          required: true,
          label: 'Fecha de Inicio',
          admin: {
            width: '22%',
            date: { displayFormat: DISPLAY_DATE_FORMAT },
          },
        },
        {
          name: 'fechaFin',
          type: 'date',
          label: 'Fecha de Fin',
          admin: {
            width: '23%',
            date: { displayFormat: DISPLAY_DATE_FORMAT },
            condition: (data) => ESTADOS_TRAMITE_CON_FECHA_FIN.includes(data?.estado),
          },
        },
      ],
    },

    // ─── Turno Curso Presencial ───
    {
      name: 'turnoCurso',
      type: 'group',
      label: 'Turno Curso Presencial',
      admin: {
        description: 'Solo para trámites de tipo Original o Ampliación',
        condition: (data) => data?.tipo !== 'renovacion',
      },
      fields: TURNO_FIELDS,
    },

    // ─── Turno Examen Psicofísico ───
    {
      name: 'turnoPsicofisico',
      type: 'group',
      label: 'Turno Examen Psicofísico',
      admin: {
        description: 'Requerido para todos los tipos de trámite',
      },
      fields: TURNO_FIELDS,
    },
  ],
}
