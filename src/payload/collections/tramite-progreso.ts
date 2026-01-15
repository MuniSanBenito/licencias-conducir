import { EstadosTramiteEnum } from '@/constants/estados-tramite'
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
  admin: {
    useAsTitle: 'estado',
  },
  trash: true,
  fields: [
    {
      name: 'tramite_proceso',
      type: 'relationship',
      relationTo: 'tramite-proceso',
      required: true,
      label: 'Tramite Proceso',
    },
    {
      name: 'etapa',
      type: 'number',
      min: 0,
      defaultValue: 0,
      admin: {
        step: 1,
      },
      required: true,
      label: 'Etapa',
    },
    {
      name: 'estado',
      type: 'select',
      options: [
        ...Object.values(EstadosTramiteEnum).map((estado) => ({
          label: estado,
          value: estado,
        })),
      ],
      required: true,
      defaultValue: EstadosTramiteEnum.EN_CURSO,
      label: 'Estado',
    },
    {
      type: 'join',
      name: 'turnos',
      collection: 'turno',
      on: 'tramite',
      label: 'Turnos',
    },
    {
      name: 'aprobado_por_usuario',
      type: 'relationship',
      relationTo: 'usuario',
      label: 'Aprobado Por Usuario',
    },
    {
      name: 'fecha_aprobacion',
      type: 'date',
      label: 'Fecha Aprobacion',
    },
    {
      name: 'observaciones',
      type: 'text',
      label: 'Observaciones',
    },
  ],
}
