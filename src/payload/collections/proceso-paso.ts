import type { CollectionConfig } from 'payload'

/* Table "proceso_pasos" {
  "id" int [pk, not null, increment]
  "plantilla_id" int [ref: < "proceso_plantilla"."id"]
  "etapa_id" int [ref: < "catalogo_etapas"."id"]
  "orden" int [not null]
  "es_bloqueante" boolean [default: true]
} */

export const ProcesoPaso: CollectionConfig = {
  slug: 'proceso-paso',
  labels: {
    singular: 'Proceso Paso',
    plural: 'Proceso Pasos',
  },
  indexes: [
    {
      fields: ['plantilla', 'etapa'],
      unique: true,
    },
  ],
  admin: {
    description:
      'Pasos ordenados que componen cada plantilla de proceso. Define la secuencia de etapas para cada tipo de trámite',
  },
  trash: true,
  fields: [
    {
      name: 'plantilla',
      type: 'relationship',
      label: 'Plantilla',
      relationTo: 'proceso-plantilla',
    },
    {
      name: 'etapa',
      type: 'relationship',
      label: 'Etapa',
      relationTo: 'catalogo-etapa',
    },
    {
      name: 'orden',
      type: 'number',
      label: 'Orden',
      defaultValue: 0,
    },
    {
      name: 'es_bloqueante',
      type: 'checkbox',
      label: 'Es bloqueante',
      defaultValue: true,
    },
  ],
}
