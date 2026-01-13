import type { CollectionConfig } from 'payload'

/* Table "opciones" {
  "id" int [pk, not null, increment]
  "pregunta_id" int [ref: < "preguntas"."id"]
  "texto_opcion" varchar(255)
  "es_correcta" boolean [default: false, note: 'Soporta Checkboxes']
} */

export const Opcion: CollectionConfig = {
  slug: 'opcion',
  labels: {
    singular: 'Opcion',
    plural: 'Opciones',
  },
  admin: {
    useAsTitle: 'texto_opcion',
  },
  trash: true,
  fields: [
    {
      name: 'pregunta',
      type: 'relationship',
      label: 'Pregunta',
      relationTo: 'pregunta',
    },
    {
      name: 'texto_opcion',
      type: 'text',
      label: 'Texto Opcion',
    },
    {
      name: 'imagen_opcion',
      type: 'upload',
      label: 'Imagen Opcion',
      relationTo: 'archivo',
    },
    {
      name: 'es_correcta',
      type: 'checkbox',
      label: 'Es correcta',
      defaultValue: false,
    },
  ],
}
