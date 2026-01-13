import type { CollectionConfig } from 'payload'

export const Dev: CollectionConfig = {
  slug: 'dev',
  labels: {
    singular: 'Dev',
    plural: 'Devs',
  },
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  trash: true,
  fields: [],
}
