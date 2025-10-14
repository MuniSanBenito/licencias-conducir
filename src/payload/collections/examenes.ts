import { HIDE_API_URL } from '@/config'
import type { CollectionConfig } from 'payload'

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
      type: 'relationship',
      label: 'Consignas',
      relationTo: 'consignas',
      hasMany: true,
      required: true,
    },
  ],
}
