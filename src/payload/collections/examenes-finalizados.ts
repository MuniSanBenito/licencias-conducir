import { HIDE_API_URL } from '@/config'
import type { CollectionConfig } from 'payload'

export const ExamenesFinalizados: CollectionConfig = {
  slug: 'examenes-finalizados',
  labels: {
    singular: 'Examen Finalizado',
    plural: 'Examenes Finalizados',
  },
  admin: {
    hideAPIURL: HIDE_API_URL,
  },
  trash: true,
  fields: [
    {
      name: 'examen',
      type: 'relationship',
      label: 'Examen',
      relationTo: 'examenes',
      required: true,
    },
    {
      name: 'ciudadanos',
      type: 'relationship',
      label: 'Ciudadano',
      relationTo: 'ciudadanos',
      hasMany: false,
      required: true,
    },
  ],
}
