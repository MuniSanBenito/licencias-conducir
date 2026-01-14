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
      name: 'agenda_recurso',
      type: 'relationship',
      relationTo: 'agenda-recurso',
      required: true,
      label: 'Agenda Recurso',
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
      type: 'text',
      required: true,
      defaultValue: 'RESERVADO',
      label: 'Estado',
    },
  ],
}
