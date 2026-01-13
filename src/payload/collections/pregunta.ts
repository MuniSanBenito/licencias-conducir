import type { CollectionConfig } from 'payload'

/* Table "preguntas" {
  "id" int [pk, not null, increment]
  "enunciado" text [not null]
  "imagen_url" varchar(255)
} */

export const Pregunta: CollectionConfig = {
  slug: 'pregunta',
  labels: {
    singular: 'Pregunta',
    plural: 'Preguntas',
  },
  admin: {
    useAsTitle: 'enunciado',
  },
  trash: true,
  fields: [
    {
      name: 'enunciado',
      type: 'text',
      label: 'Enunciado',
      required: true,
    },
    {
      name: 'archivo',
      type: 'upload',
      label: 'Imagen',
      relationTo: 'archivo',
    },
  ],
}
