import type { CollectionConfig } from 'payload'

/* Table "respuestas_seleccionadas" {
  "id" int [pk, not null, increment]
  "intento_id" int [ref: < "intentos_examen"."id"]
  "pregunta_id" int [ref: < "preguntas"."id"]
  "opcion_id" int [ref: < "opciones"."id"]
  Indexes {
    (intento_id, opcion_id) [unique, name: "idx_respuestas_seleccionadas_intento_id_opcion_id"]
  }
} */

export const RespuestaSeleccionada: CollectionConfig = {
  slug: 'respuesta-seleccionada',
  labels: {
    singular: 'Respuesta Seleccionada',
    plural: 'Respuestas Seleccionadas',
  },
  trash: true,
  admin: {
    description:
      'Respuestas marcadas por ciudadanos durante exámenes. Guarda cada opción seleccionada para auditoría detallada',
  },
  indexes: [
    {
      fields: ['intento', 'opcion'],
      unique: true,
    },
  ],
  fields: [
    {
      name: 'intento',
      type: 'relationship',
      relationTo: 'intento-examen',
      required: true,
      label: 'Intento',
    },
    {
      name: 'pregunta',
      type: 'relationship',
      relationTo: 'pregunta',
      required: true,
      label: 'Pregunta',
    },
    {
      name: 'opcion',
      type: 'relationship',
      relationTo: 'opcion',
      required: true,
      label: 'Opcion',
    },
  ],
}
