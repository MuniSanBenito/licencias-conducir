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
      name: 'plantilla',
      type: 'relationship',
      relationTo: 'proceso-plantilla',
      required: true,
      label: 'Plantilla',
    },
    {
      name: 'codigo_interno',
      type: 'text',
      required: true,
      label: 'Codigo Interno',
    },
    {
      name: 'fut',
      type: 'text',
      required: true,
      label: 'FUT',
    },
    {
      name: 'estado_global',
      type: 'text',
      required: true,
      defaultValue: 'EN_CURSO',
      label: 'Estado Global',
    },
    {
      name: 'fecha_inicio',
      type: 'date',
      required: true,
      label: 'Fecha Inicio',
    },
  ],
}
