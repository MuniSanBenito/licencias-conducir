import type { CollectionConfig } from 'payload'

import { CLASES_LICENCIA } from '@/constants/clases'

export const Examen: CollectionConfig = {
  slug: 'examen',
  labels: {
    singular: 'Examen',
    plural: 'Exámenes',
  },
  admin: {
    useAsTitle: 'id',
    group: 'Exámenes',
    hidden: ({ user }) => user?.collection !== 'dev',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
  },
  fields: [
    {
      name: 'ciudadano',
      type: 'relationship',
      relationTo: 'ciudadano',
      required: true,
      index: true,
    },
    {
      name: 'tramite',
      type: 'relationship',
      relationTo: 'tramite',
      required: true,
      index: true,
    },
    {
      name: 'estado',
      type: 'select',
      options: [
        { label: 'Abierto', value: 'abierto' },
        { label: 'Cerrado', value: 'cerrado' },
      ],
      required: true,
      defaultValue: 'abierto',
      index: true,
    },
    {
      name: 'fechaInicio',
      type: 'date',
      required: true,
    },
    {
      name: 'fechaFin',
      type: 'date',
      required: true,
    },
    {
      name: 'preguntasGeneradas',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'preguntaOriginal',
          type: 'relationship',
          relationTo: 'pregunta',
          required: true,
        },
        {
          name: 'consigna',
          type: 'textarea',
          required: true,
        },
        {
          name: 'imagenConsigna',
          type: 'upload',
          relationTo: 'archivo',
        },
        {
          name: 'clases',
          type: 'select',
          hasMany: true,
          options: [
            { label: 'Todas', value: 'todas' },
            ...CLASES_LICENCIA.map((clase) => ({
              label: clase,
              value: clase,
            })),
          ],
        },
        {
          name: 'opciones',
          type: 'array',
          required: true,
          minRows: 2,
          fields: [
            { name: 'idOp', type: 'text', required: true },
            { name: 'texto', type: 'text' },
            { name: 'imagen', type: 'upload', relationTo: 'archivo' },
            { name: 'esCorrecta', type: 'checkbox', required: true, defaultValue: false },
          ],
        },
      ],
    },
    {
      name: 'respuestasCiudadano',
      type: 'array',
      fields: [
        {
          name: 'preguntaRef',
          type: 'text',
          required: true,
        },
        {
          name: 'opcionesSeleccionadas', // array of idOp
          type: 'json',
          required: true,
          defaultValue: [],
        },
      ],
    },
    {
      name: 'resultado',
      type: 'group',
      fields: [
        { name: 'aprobado', type: 'checkbox' },
        { name: 'puntajeTotal', type: 'number' },
        { name: 'puntajeObtenido', type: 'number' },
      ],
    },
  ],
}
