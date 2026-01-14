import type { CollectionConfig } from 'payload'

/* Table "clases_licencia" {
  "id" int [pk, not null, increment]
  "codigo" varchar(10) [not null, note: 'Ej: A, B, C, D4']
  "nombre" varchar(100)
  "descripcion" text
} */

export const ClaseLicencia: CollectionConfig = {
  slug: 'clase_licencia',
  labels: {
    singular: 'Clase Licencia',
    plural: 'Clases Licencia',
  },
  admin: {
    useAsTitle: 'nombre',
    description: 'Catálogo de categorías de licencia de conducir (A, B, C, D4, etc.)',
  },
  trash: true,
  fields: [
    {
      name: 'codigo',
      type: 'text',
      label: 'Codigo',
      required: true,
      admin: {
        description: 'Ej: A, B, C, D4',
      },
    },
    {
      name: 'nombre',
      type: 'text',
      label: 'Nombre',
    },
    {
      name: 'descripcion',
      type: 'text',
      label: 'Descripcion',
    },
  ],
}
