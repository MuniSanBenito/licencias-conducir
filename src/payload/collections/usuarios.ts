import { HIDE_API_URL } from '@/config'
import type { CollectionConfig } from 'payload'

export const Usuarios: CollectionConfig = {
  slug: 'usuarios',
  labels: {
    singular: 'Usuario',
    plural: 'Usuarios',
  },
  admin: {
    useAsTitle: 'email',
    hideAPIURL: HIDE_API_URL,
    hidden: ({ user }) => !user?.dev,
  },
  auth: true,
  trash: true,
  fields: [
    // Email added by default
    // Add more fields as needed
    {
      name: 'dev',
      type: 'checkbox',
      label: 'Desarrollador',
      defaultValue: false,
      access: {
        create: ({ req }) => Boolean(req.user?.dev),
        read: ({ req }) => Boolean(req.user?.dev),
        update: ({ req }) => Boolean(req.user?.dev),
      },
      admin: {
        hidden: true,
        disableListColumn: true,
        disableListFilter: true,
      },
    },
  ],
}
