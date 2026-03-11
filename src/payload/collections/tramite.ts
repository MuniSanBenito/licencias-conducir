import type { CollectionConfig } from 'payload'

import { CLASES_LICENCIA } from '@/constants/clases'

const OPCIONES_CLASE = CLASES_LICENCIA.map((clase) => ({
  label: clase,
  value: clase,
}))

const OPCIONES_TIPO_TRAMITE = [
  { label: 'Nueva', value: 'nueva' },
  { label: 'Renovación', value: 'renovacion' },
  { label: 'Ampliación', value: 'ampliacion' },
]

const OPCIONES_ESTADO_TRAMITE = [
  { label: 'En Curso', value: 'en_curso' },
  { label: 'Completado', value: 'completado' },
  { label: 'Cancelado', value: 'cancelado' },
]

const OPCIONES_ESTADO_PASO = [
  { label: 'Pendiente', value: 'pendiente' },
  { label: 'En Curso', value: 'en_curso' },
  { label: 'Completado', value: 'completado' },
]

const OPCIONES_PASO_ID = [
  { label: 'Mesa de Entradas', value: 'mesa_entradas' },
  { label: 'Área de Licencias', value: 'area_licencias' },
  { label: 'Pago', value: 'pago' },
  { label: 'Revisión Licencias', value: 'revision_licencias' },
  { label: 'Turno Curso', value: 'turno_curso' },
  { label: 'Examen Teórico', value: 'examen_teorico' },
  { label: 'Examen Práctico', value: 'examen_practico' },
  { label: 'Examen Psicofísico', value: 'examen_psicofisico' },
  { label: 'Emisión de Licencia', value: 'emision' },
]

const OPCIONES_ESTADO_TURNO = [
  { label: 'Programado', value: 'programado' },
  { label: 'Confirmado', value: 'confirmado' },
  { label: 'Ausente', value: 'ausente' },
  { label: 'Completado', value: 'completado' },
  { label: 'Cancelado', value: 'cancelado' },
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
          defaultValue: 'en_curso',
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
            condition: (data) => data?.estado === 'completado' || data?.estado === 'cancelado',
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
              defaultValue: 'pendiente',
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
