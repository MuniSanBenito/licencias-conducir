import { HIDE_API_URL } from '@/config'
import { CATEGORIAS_AUTO, CATEGORIAS_MOTO } from '@/constants/categorias'
import type { Examene } from '@/payload-types'
import type { CollectionConfig, FilterOptions } from 'payload'

const consignaFilter: FilterOptions<Examene> = ({ data }) => {
  if (!data.categorias || data.categorias.length < 1) {
    return false
  }

  return {
    categorias: {
      in: data.categorias,
    },
  }
}

export const Examenes: CollectionConfig = {
  slug: 'examenes',
  labels: {
    singular: 'Examen',
    plural: 'Examenes',
  },
  admin: {
    hideAPIURL: HIDE_API_URL,
  },
  trash: true,
  fields: [
    {
      name: 'fut',
      type: 'relationship',
      label: 'FUT',
      relationTo: 'futs',
      required: true,
    },
    {
      name: 'consignas',
      type: 'array',
      fields: [
        {
          name: 'consigna',
          type: 'relationship',
          label: 'Consigna',
          relationTo: 'consignas',
          hasMany: false,
          required: true,
          filterOptions: consignaFilter,
        },
        {
          name: 'respuesta',
          type: 'text',
          label: 'Respuesta',
          required: true,
        },
        {
          name: 'correcta',
          type: 'checkbox',
          label: 'Correcta',
          defaultValue: false,
        },
      ],
    }, // aside fields
    {
      name: 'categorias',
      type: 'select',
      label: 'Categorías',
      options: [...CATEGORIAS_MOTO, ...CATEGORIAS_AUTO],
      defaultValue: [CATEGORIAS_MOTO[0]],
      hasMany: true,
      required: true,
      admin: {
        description: 'Selecciona una o más categorías para esta consigna.',
        position: 'sidebar',
      },
    },
    {
      name: 'finalizado',
      type: 'checkbox',
      label: 'Finalizado',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
