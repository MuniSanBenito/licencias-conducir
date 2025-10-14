import type { CollectionConfig } from 'payload'

export const Ciudadanos: CollectionConfig = {
  slug: 'ciudadanos',
  labels: {
    singular: 'Ciudadano',
    plural: 'Ciudadanos',
  },
  admin: {
    useAsTitle: 'dni',
  },
  trash: true,
  fields: [
    {
      name: 'dni',
      type: 'text',
      label: 'DNI',
      required: true,
      unique: true,
      index: true,
    },
  ],
}
