import type { CollectionConfig } from 'payload'

/* Table "tramites" {
  "id" int [pk, not null, increment, ref: < "emisiones_licencia"."tramite_id"]
  "ciudadano_id" int [ref: < "ciudadanos"."id"]
  "plantilla_id" int [ref: < "proceso_plantilla"."id"]
  "codigo_interno" varchar(50) [unique, note: 'MUNI-2026-XXXX']
  "nro_fut_nacional" varchar(50) [unique, note: 'Se carga antes del teorico']
  "estado_global" varchar(20) [default: `EN_CURSO`]
  "fecha_inicio" datetime [default: `CURRENT_TIMESTAMP`]
} */

export const Tramite: CollectionConfig = {
  slug: 'tramite',
  labels: {
    singular: 'Tramite',
    plural: 'Tramites',
  },
  admin: {
    useAsTitle: 'ciudadano',
  },
  trash: true,
  fields: [
    {
      name: 'ciudadano',
      type: 'relationship',
      relationTo: 'ciudadano',
      required: true,
      label: 'Ciudadano',
    },
    {
      type: 'join',
      name: 'procesos',
      collection: 'tramite-proceso',
      on: 'tramite',
      label: 'Procesos',
    },
    {
      name: 'fut',
      type: 'text',
      required: false,
      label: 'FUT',
      unique: true,
      index: true,
    },
  ],
}
