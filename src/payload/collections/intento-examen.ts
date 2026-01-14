import type { CollectionConfig } from 'payload'

/* Table "intentos_examen" {
  "id" int [pk, not null, increment]
  "tramite_progreso_id" int [not null, note: 'Paso Teorico del checklist', ref: < "tramites_progreso"."id"]
  "examen_id" int [ref: < "examenes"."id"]
  "fecha_inicio" datetime
  "fecha_fin" datetime
  "nota_final" decimal(5,2)
  "aprobado" boolean
} */

export const IntentoExamen: CollectionConfig = {
  slug: 'intento-examen',
  labels: {
    singular: 'Intento Examen',
    plural: 'Intentos Examenes',
  },
  admin: {
    description:
      'Registro de sesiones de examen de ciudadanos. Almacena fecha inicio/fin, nota final y resultado (aprobado/desaprobado)',
  },
  trash: true,
  fields: [
    {
      name: 'tramite_progreso',
      type: 'relationship',
      relationTo: 'tramite-progreso',
      required: true,
      label: 'Tramite Progreso',
    },
    {
      name: 'examen',
      type: 'relationship',
      relationTo: 'examen',
      required: true,
      label: 'Examen',
    },
    {
      name: 'fecha_inicio',
      type: 'date',
      required: true,
      label: 'Fecha Inicio',
    },
    {
      name: 'fecha_fin',
      type: 'date',
      required: true,
      label: 'Fecha Fin',
    },
    {
      name: 'nota_final',
      type: 'number',
      required: true,
      label: 'Nota Final',
    },
    {
      name: 'aprobado',
      type: 'checkbox',
      required: true,
      label: 'Aprobado',
    },
  ],
}
