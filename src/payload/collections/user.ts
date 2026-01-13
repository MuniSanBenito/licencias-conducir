import type { CollectionConfig } from 'payload'

export const User: CollectionConfig = {
  slug: 'user',
  labels: {
    singular: 'Usuario',
    plural: 'Usuarios',
  },
  /* admin: {
    useAsTitle: 'email',
  }, */
  auth: true,
  trash: true,
  fields: [
    // Email added by default
    // Add more fields as needed
  ],
}
