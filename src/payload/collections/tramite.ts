import type { CollectionConfig } from 'payload'

import { CLASES_LICENCIA } from '@/constants/clases'
import {
  ESTADO_PASO_DEFAULT,
  ESTADO_TRAMITE_DEFAULT,
  ESTADOS_TRAMITE_CON_FECHA_FIN,
  OPCIONES_ESTADO_PASO,
  OPCIONES_ESTADO_TRAMITE,
  OPCIONES_ESTADO_TURNO,
  OPCIONES_PASO_ID,
  OPCIONES_TIPO_TRAMITE,
} from '@/constants/tramites'

const OPCIONES_CLASE = CLASES_LICENCIA.map((clase) => ({
  label: clase,
  value: clase,
}))

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
    defaultColumns: ['fut', 'ciudadano', 'estado', 'fechaInicio'],
    listSearchableFields: ['fut'],
  },
  defaultSort: '-createdAt',
  timestamps: true,
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'fut',
          type: 'text',
          required: true,
          unique: true,
          index: true,
          label: 'FUT',
          admin: { width: '30%' },
        },
        {
          name: 'ciudadano',
          type: 'relationship',
          relationTo: 'ciudadano',
          required: true,
          admin: { width: '70%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'estado',
          type: 'select',
          options: OPCIONES_ESTADO_TRAMITE,
          required: true,
          defaultValue: ESTADO_TRAMITE_DEFAULT,
          admin: { width: '30%' },
        },
        {
          name: 'fechaInicio',
          type: 'date',
          required: true,
          label: 'Fecha de Inicio',
          admin: {
            width: '35%',
            date: { displayFormat: 'dd/MM/yyyy' },
          },
        },
        {
          name: 'fechaFin',
          type: 'date',
          label: 'Fecha de Fin',
          admin: {
            width: '35%',
            date: { displayFormat: 'dd/MM/yyyy' },
            condition: (data) => ESTADOS_TRAMITE_CON_FECHA_FIN.includes(data?.estado),
          },
        },
      ],
    },

    // ─── Items de Licencia ───
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      labels: {
        singular: 'Licencia',
        plural: 'Licencias',
      },
      admin: {
        description: 'Licencias solicitadas en este trámite',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'clase',
              type: 'select',
              options: OPCIONES_CLASE,
              required: true,
              label: 'Clase',
              admin: { width: '50%' },
            },
            {
              name: 'tipo',
              type: 'select',
              options: OPCIONES_TIPO_TRAMITE,
              required: true,
              label: 'Tipo',
              admin: { width: '50%' },
            },
          ],
        },
      ],
    },

    // ─── Pasos del Trámite ───
    {
      name: 'pasos',
      type: 'array',
      required: true,
      labels: {
        singular: 'Paso',
        plural: 'Pasos',
      },
      admin: {
        description: 'Progreso del trámite a través de sus pasos requeridos',
        initCollapsed: true,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'pasoId',
              type: 'select',
              options: OPCIONES_PASO_ID,
              required: true,
              label: 'Paso',
              admin: { width: '40%' },
            },
            {
              name: 'label',
              type: 'text',
              required: true,
              admin: { width: '35%' },
            },
            {
              name: 'estado',
              type: 'select',
              options: OPCIONES_ESTADO_PASO,
              required: true,
              defaultValue: ESTADO_PASO_DEFAULT,
              admin: { width: '25%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'requiereTurno',
              type: 'checkbox',
              label: 'Requiere Turno',
              defaultValue: false,
              admin: { width: '25%' },
            },
            {
              name: 'fecha',
              type: 'date',
              label: 'Fecha de Realización',
              admin: {
                width: '35%',
                date: { displayFormat: 'dd/MM/yyyy' },
              },
            },
            {
              name: 'observaciones',
              type: 'textarea',
              admin: { width: '40%' },
            },
          ],
        },

        // Turno embebido (group condicional)
        {
          name: 'turno',
          type: 'group',
          label: 'Turno',
          admin: {
            condition: (_, siblingData) => siblingData?.requiereTurno === true,
          },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'fecha',
                  type: 'date',
                  label: 'Fecha del Turno',
                  admin: {
                    width: '35%',
                    date: { displayFormat: 'dd/MM/yyyy' },
                  },
                },
                {
                  name: 'hora',
                  type: 'text',
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
                  label: 'Estado del Turno',
                  admin: { width: '40%' },
                },
              ],
            },
            {
              name: 'observaciones',
              type: 'textarea',
              label: 'Observaciones del Turno',
            },
          ],
        },
      ],
    },
  ],
}
