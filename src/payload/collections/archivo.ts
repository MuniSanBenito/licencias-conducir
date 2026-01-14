import type { CollectionConfig } from 'payload'

export const Archivo: CollectionConfig = {
  slug: 'archivo',
  labels: {
    singular: 'Archivo',
    plural: 'Archivos',
  },
  admin: {
    description:
      'Gestión de archivos y documentos del sistema (imágenes de preguntas, documentos adjuntos, etc.)',
  },
  upload: true,
  trash: true,
  fields: [],
}
