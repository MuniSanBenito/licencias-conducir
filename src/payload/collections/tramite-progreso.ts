import type { CollectionConfig } from 'payload'

/* Table "tramites_progreso" {
  "id" int [pk, not null, increment, ref: < "turnos"."tramite_progreso_id"]
  "tramite_id" int [ref: < "tramites"."id"]
  "etapa_id" int
  "orden" int
  "clase_referencia_id" int [ref: < "clases_licencia"."id"]
  "estado" varchar(20) [default: `PENDIENTE`]
  "aprobado_por_usuario_id" int
  "fecha_aprobacion" datetime
  "observaciones" text
} */

export const TramiteProgreso: CollectionConfig = {
  slug: 'tramite-progreso',
  labels: {
    singular: 'Tramite Progreso',
    plural: 'Tramites Progreso',
  },
  trash: true,
  fields: [
    {
      name: 'tramite',
      type: 'relationship',
      relationTo: 'tramite',
      required: true,
      label: 'Tramite',
    },
    {
      name: 'etapa',
      type: 'relationship',
      relationTo: 'catalogo-etapa',
      required: true,
      label: 'Etapa',
    },
    {
      name: 'orden',
      type: 'number',
      required: true,
      label: 'Orden',
    },
    {
      name: 'clase_referencia',
      type: 'relationship',
      relationTo: 'clase_licencia',
      required: true,
      label: 'Clase Referencia',
    },
    {
      name: 'estado',
      type: 'text',
      required: true,
      defaultValue: 'PENDIENTE',
      label: 'Estado',
    },
    {
      name: 'aprobado_por_usuario',
      type: 'relationship',
      relationTo: 'usuario',
      required: true,
      label: 'Aprobado Por Usuario',
    },
    {
      name: 'fecha_aprobacion',
      type: 'date',
      required: true,
      label: 'Fecha Aprobacion',
    },
    {
      name: 'observaciones',
      type: 'text',
      required: true,
      label: 'Observaciones',
    },
  ],
}
