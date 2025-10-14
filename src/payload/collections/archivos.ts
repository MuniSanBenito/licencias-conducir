import { HIDE_API_URL } from '@/config'
import type { CollectionConfig } from 'payload'

export const Archivos: CollectionConfig = {
  slug: 'archivos',
  labels: {
    singular: 'Archivo',
    plural: 'Archivos',
  },
  admin: {
    hideAPIURL: HIDE_API_URL,
  },
  upload: true,
  trash: true,
  fields: [],
}
