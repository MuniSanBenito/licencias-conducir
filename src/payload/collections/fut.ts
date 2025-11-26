import { HIDE_API_URL } from '@/config'
import type { CollectionConfig } from 'payload'

export const Futs: CollectionConfig = {
  slug: 'futs',
  labels: {
    singular: 'FUT',
    plural: 'FUTs',
  },
  admin: {
    hideAPIURL: HIDE_API_URL,
    useAsTitle: 'futId',
  },
  trash: true,
  fields: [
    {
      name: 'futId',
      type: 'text',
      label: 'FUT',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'ciudadano',
      type: 'relationship',
      label: 'Ciudadano',
      relationTo: 'ciudadanos',
      required: true,
    },
  ],
}
