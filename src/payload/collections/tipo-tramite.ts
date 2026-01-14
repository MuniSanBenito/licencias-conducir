import type { CollectionConfig } from 'payload'

/* Table "tipos_tramite" {
  "id" int [pk, not null, increment, ref: < "proceso_plantilla"."tipo_tramite_id"]
  "nombre" varchar(50) [not null, note: 'Ej: Original, Renovacion, Ampliacion']
} */

export const TipoTramite: CollectionConfig = {
  slug: 'tipo_tramite',
  labels: {
    singular: 'Tipo Tramite',
    plural: 'Tipos Tramites',
  },
  admin: {
    useAsTitle: 'nombre',
    description: 'Tipos de trámite disponibles (Original, Renovación, Ampliación)',
  },
  trash: true,
  fields: [
    {
      name: 'nombre',
      type: 'text',
      label: 'Nombre',
      required: true,
      admin: {
        description: 'Ej: Original, Renovacion, Ampliacion',
      },
    },
  ],
}
