import type { CollectionConfig } from 'payload'

export const Citizen: CollectionConfig = {
  slug: 'citizen',
  labels: {
    singular: 'Ciudadano',
    plural: 'Ciudadanos',
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
