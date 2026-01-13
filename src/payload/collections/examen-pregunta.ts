import type { CollectionConfig } from 'payload'

/* Table "examen_preguntas" {
  "id" int [pk, not null, increment]
  "examen_id" int [ref: < "examenes"."id"]
  "pregunta_id" int [ref: < "preguntas"."id"]
  "orden" int [default: 0]
  "puntaje" decimal(5,2)

  Indexes {
    (examen_id, pregunta_id) [unique, name: "idx_examen_preguntas_examen_id_pregunta_id"]
  }
} */

export const ExamenPregunta: CollectionConfig = {
  slug: 'examen-pregunta',
  labels: {
    singular: 'Examen Pregunta',
    plural: 'Examenes Preguntas',
  },
  admin: {
    useAsTitle: 'examen_id',
  },
  indexes: [
    {
      fields: ['examen_id', 'pregunta_id'],
      unique: true,
    },
  ],
  trash: true,
  fields: [
    {
      name: 'examen',
      type: 'relationship',
      label: 'Examen',
      relationTo: 'examen',
    },
    {
      name: 'pregunta',
      type: 'relationship',
      label: 'Pregunta',
      relationTo: 'pregunta',
    },
    {
      name: 'orden',
      type: 'number',
      label: 'Orden',
      defaultValue: 0,
    },
    {
      name: 'puntaje',
      type: 'number',
      label: 'Puntaje',
      defaultValue: 0,
    },
  ],
}
