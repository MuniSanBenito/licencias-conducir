import type { CollectionConfig } from 'payload'

/* Table "agenda_recursos" {
  "id" int [pk, not null, increment]
  "nombre" varchar(100) [note: 'Ej: Pista de Motos, Box Medico']
  "capacidad" int [default: 1]
} */

export const AgendaRecurso: CollectionConfig = {
  slug: 'agenda-recurso',
  labels: {
    singular: 'Agenda Recurso',
    plural: 'Agenda Recursos',
  },
  admin: {
    useAsTitle: 'nombre',
    description:
      'Recursos disponibles para asignar turnos (aulas, boxes médicos, pistas de manejo)',
  },
  trash: true,
  fields: [
    {
      name: 'nombre',
      type: 'text',
      label: 'Nombre',
      required: true,
      admin: {
        description: 'Ej: Pista de Motos, Box Medico',
      },
    },
    {
      name: 'capacidad',
      type: 'number',
      label: 'Capacidad',
      defaultValue: 1,
    },
  ],
}
