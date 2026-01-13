import type { CollectionConfig } from 'payload'

export const File: CollectionConfig = {
  slug: 'file',
  labels: {
    singular: 'Archivo',
    plural: 'Archivos',
  },
  upload: true,
  trash: true,
  fields: [],
}
