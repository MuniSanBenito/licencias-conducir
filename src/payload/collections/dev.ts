import type { CollectionConfig } from 'payload'

export const Dev: CollectionConfig = {
  slug: 'dev',
  labels: {
    singular: 'Dev',
    plural: 'Devs',
  },
  admin: {
    useAsTitle: 'email',
    description: 'Colección de desarrollo para testing y pruebas',
  },
  auth: true,
  trash: true,
  fields: [],
}
