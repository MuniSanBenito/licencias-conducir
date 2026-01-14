import type { CollectionConfig } from 'payload'

/* Table "proceso_plantilla" {
  "id" int [pk, not null, increment]
  "nombre" varchar(100) [not null, note: 'Ej: Workflow Licencia Original']
  "clase_licencia_id" int [ref: < "clases_licencia"."id"]
  "tipo_tramite_id" int
  "activo" boolean [default: true]
} */

export const ProcesoPlantilla: CollectionConfig = {
  slug: 'proceso-plantilla',
  labels: {
    singular: 'Proceso Plantilla',
    plural: 'Proceso Plantillas',
  },
  admin: {
    useAsTitle: 'nombre',
    description:
      'Plantillas de flujo de trámites. Define la "receta" de qué pasos componen cada tipo de trámite (ej: Renovación B requiere Papeles, Médico)',
  },
  trash: true,
  fields: [
    {
      name: 'nombre',
      type: 'text',
      label: 'Nombre',
      required: true,
      admin: {
        description: 'Ej: Workflow Licencia Original',
      },
    },
    {
      name: 'clase_licencia',
      type: 'relationship',
      label: 'Clase Licencia',
      relationTo: 'clase_licencia',
    },
    {
      name: 'tipo_tramite',
      type: 'relationship',
      label: 'Tipo Tramite',
      relationTo: 'tipo_tramite',
    },
    {
      name: 'activo',
      type: 'checkbox',
      label: 'Activo',
      defaultValue: true,
    },
  ],
}
