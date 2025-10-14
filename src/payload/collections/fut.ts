import { HIDE_API_URL } from '@/config'
import type { CollectionConfig } from 'payload'

export const Fut: CollectionConfig = {
  slug: 'futs',
  labels: {
    singular: 'FUT',
    plural: 'FUTs',
  },
  admin: {
    hideAPIURL: HIDE_API_URL,
  },
  trash: true,
  fields: [
    {
      name: 'ciudadano',
      type: 'relationship',
      label: 'Ciudadano',
      relationTo: 'ciudadanos',
      required: true,
    },
  ],
}
