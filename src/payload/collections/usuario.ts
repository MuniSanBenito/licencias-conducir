import type { CollectionConfig } from 'payload'

export const Usuario: CollectionConfig = {
  slug: 'usuario',
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
