import type { CollectionConfig } from 'payload'

export const Dev: CollectionConfig = {
  slug: 'dev',
  labels: {
    singular: 'Dev',
    plural: 'Devs',
  },
  auth: true,
  trash: true,
  fields: [],
}
