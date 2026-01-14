import type { CollectionConfig } from 'payload'
/* Table "examenes" {
  "id" int [pk, not null, increment]
  "titulo" varchar(200) [not null]
  "descripcion" text
  "activo" boolean [default: true]
} */

export const Examen: CollectionConfig = {
  slug: 'examen',
  labels: {
    singular: 'Examen',
    plural: 'Examenes',
  },
  admin: {
    useAsTitle: 'titulo',
    description: 'Banco de exámenes teóricos para licencias de conducir',
  },
  trash: true,
  fields: [
    {
      name: 'titulo',
      type: 'text',
      label: 'Titulo',
      required: true,
    },
    {
      name: 'descripcion',
      type: 'text',
      label: 'Descripcion',
    },
    {
      name: 'activo',
      type: 'checkbox',
      label: 'Activo',
      defaultValue: true,
    },
  ],
}
