import { HIDE_API_URL } from '@/config'
import { CATEGORIAS_AUTO, CATEGORIAS_MOTO } from '@/data/categorias'
import type { CollectionConfig } from 'payload'

export const Consignas: CollectionConfig = {
  slug: 'consignas',
  labels: {
    singular: 'Consigna',
    plural: 'Consignas',
  },
  admin: {
    hideAPIURL: HIDE_API_URL,
    useAsTitle: 'titulo',
  },
  trash: true,
  fields: [
    {
      name: 'titulo',
      type: 'text',
      label: 'Título',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'categorias',
      type: 'select',
      label: 'Categorías',
      options: [...CATEGORIAS_MOTO, ...CATEGORIAS_AUTO],
      defaultValue: [CATEGORIAS_MOTO[0]],
      hasMany: true,
      required: true,
    },
    {
      name: 'pregunta',
      type: 'text',
      label: 'Pregunta',
      required: true,
    },
    {
      name: 'opciones',
      type: 'array',
      label: 'Opciones',
      labels: {
        singular: 'Opción',
        plural: 'Opciones',
      },
      fields: [
        {
          name: 'opcion',
          type: 'blocks',
          label: 'Opción',
          labels: {
            singular: 'Opción',
            plural: 'Opciones',
          },
          maxRows: 1,
          blocks: [
            {
              slug: 'texto',
              admin: {
                disableBlockName: true,
              },
              labels: {
                singular: 'Texto',
                plural: 'Texto',
              },
              fields: [
                {
                  name: 'texto',
                  type: 'text',
                  label: 'Texto',
                  required: true,
                },
              ],
            },
            {
              slug: 'imagen',
              admin: {
                disableBlockName: true,
              },
              labels: {
                singular: 'Imagen',
                plural: 'Imagenes',
              },
              fields: [
                {
                  name: 'imagen',
                  type: 'upload',
                  label: 'Imagen',
                  relationTo: 'archivos',
                  required: true,
                },
              ],
            },
          ],
        },
        {
          name: 'correcta',
          type: 'checkbox',
          label: 'Correcta',
          required: true,
        },
      ],
    },
  ],
}
