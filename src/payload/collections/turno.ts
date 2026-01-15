import { AreasEnum } from '@/constants/areas'
import type { CollectionConfig } from 'payload'

/* Table "turnos" {
  "id" int [pk, not null, increment]
  "tramite_progreso_id" int [unique, note: 'Se vincula al paso especifico']
  "agenda_recurso_id" int [ref: < "agenda_recursos"."id"]
  "fecha_hora_inicio" datetime
  "fecha_hora_fin" datetime
  "estado" varchar(20) [default: `RESERVADO`]
} */

export const Turno: CollectionConfig = {
  slug: 'turno',
  labels: {
    singular: 'Turno',
    plural: 'Turnos',
  },
  admin: {
    description:
      'Asignación de turnos. Vincula un paso específico del progreso con un recurso y fecha/hora',
  },
  trash: true,
  fields: [
    {
      name: 'tramite',
      type: 'relationship',
      relationTo: 'tramite-progreso',
      required: true,
      label: 'Tramite Progreso',
    },
    {
      name: 'area',
      type: 'select',
      options: Object.values(AreasEnum),
      defaultValue: AreasEnum.TEORICO,
      required: true,
      label: 'Area',
    },
    {
      name: 'fecha_hora_inicio',
      type: 'date',
      required: true,
      label: 'Fecha Hora Inicio',
    },
    {
      name: 'fecha_hora_fin',
      type: 'date',
      required: true,
      label: 'Fecha Hora Fin',
    },
    {
      name: 'estado',
      type: 'select',
      required: true,
      options: [
        { label: 'RESERVADO', value: 'RESERVADO' },
        { label: 'AUSENTE', value: 'AUSENTE' },
        { label: 'FINALIZADO', value: 'FINALIZADO' },
        { label: 'CANCELADO', value: 'CANCELADO' },
      ],
      defaultValue: 'RESERVADO',
      label: 'Estado',
    },
  ],
}
