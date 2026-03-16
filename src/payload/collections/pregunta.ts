import type { CollectionConfig } from 'payload'

import { CLASES_LICENCIA } from '@/constants/clases'

export const Pregunta: CollectionConfig = {
  slug: 'pregunta',
  labels: {
    singular: 'Pregunta',
    plural: 'Preguntas',
  },
  admin: {
    useAsTitle: 'consigna',
    group: 'Exámenes',
    description: 'Banco de preguntas para exámenes teóricos',
    hidden: ({ user }) => user?.collection !== 'dev', // Oculto en panel de Payload para no-devs
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'consigna',
      type: 'textarea',
      required: true,
      label: 'Consigna',
    },
    {
      name: 'imagenConsigna',
      type: 'upload',
      relationTo: 'archivo',
      label: 'Imagen de la consigna (Opcional)',
    },
    {
      name: 'clases',
      type: 'select',
      hasMany: true,
      required: true,
      options: [
        { label: 'Todas', value: 'todas' },
        ...CLASES_LICENCIA.map((clase) => ({
          label: clase,
          value: clase,
        })),
      ],
      label: 'Clases de licencia (seleccione "Todas" o las específicas)',
    },
    {
      name: 'opciones',
      type: 'array',
      required: true,
      minRows: 2,
      labels: {
        singular: 'Opción',
        plural: 'Opciones',
      },
      fields: [
        {
          name: 'texto',
          type: 'text',
          label: 'Texto de la opción',
        },
        {
          name: 'imagen',
          type: 'upload',
          relationTo: 'archivo',
          label: 'Imagen de la opción (Opcional)',
        },
        {
          name: 'esCorrecta',
          type: 'checkbox',
          required: true,
          defaultValue: false,
          label: '¿Es respuesta correcta?',
        },
      ],
    },
  ],
}
