import type { CollectionConfig } from 'payload'

import { DISPLAY_DATE_FORMAT } from '@/constants/fechas'
import {
  ESTADO_TRAMITE_DEFAULT,
  ESTADOS_TRAMITE_CON_FECHA_FIN,
  OPCIONES_ESTADO_TRAMITE,
  OPCIONES_TIPO_TRAMITE,
} from '@/constants/tramites'

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

    // ─── Turnos (joins a colecciones independientes) ───
    {
      name: 'turnosCurso',
      type: 'join',
      collection: 'turno-curso',
      on: 'tramite',
      label: 'Turnos de Curso Presencial',
    },
    {
      name: 'turnosPsicofisico',
      type: 'join',
      collection: 'turno-psicofisico',
      on: 'tramite',
      label: 'Turnos de Examen Psicofísico',
    },
  ],
}
