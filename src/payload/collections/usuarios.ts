import type { CollectionConfig } from 'payload'

export const Usuarios: CollectionConfig = {
  slug: 'usuarios',
  labels: {
    singular: 'Usuario',
    plural: 'Usuarios',
  },
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  trash: true,
  fields: [
    // Email added by default
    // Add more fields as needed
  ],
}
