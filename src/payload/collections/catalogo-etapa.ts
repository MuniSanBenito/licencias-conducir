/* Table "catalogo_etapas" {
  "id" int [pk, not null, increment, ref: < "tramites_progreso"."etapa_id"]
  "nombre" varchar(50) [not null, note: 'Ej: Papeles, Curso, Teorico, Practico, Medico']
  "requiere_turno" boolean [default: true]
  "es_digital" boolean [default: false, note: 'Habilita examen en PC']
  "es_carga_fut" boolean [default: false, note: 'Pide cargar ID Nacional']
  "es_multiplicable_por_clase" boolean [default: false, note: 'Si es TRUE (Practico), se genera una fila por cada categoria solicitada']
} */

import type { CollectionConfig } from 'payload'

export const CatalogoEtapa: CollectionConfig = {
  slug: 'catalogo-etapa',
  labels: {
    singular: 'Catalogo Etapa',
    plural: 'Catalogo Etapas',
  },
  admin: {
    useAsTitle: 'nombre',
    description:
      'Catálogo de etapas posibles en un trámite (Papeles, Curso, Teórico, Práctico, Médico). Define características como si requiere turno, es digital, etc.',
  },
  trash: true,
  fields: [
    {
      name: 'nombre',
      type: 'text',
      label: 'Nombre',
      required: true,
      admin: {
        description: 'Ej: Papeles, Curso, Teorico, Practico, Medico',
      },
    },
    {
      name: 'requiere_turno',
      type: 'checkbox',
      label: 'Requiere turno',
      defaultValue: true,
      admin: {
        description: 'Si es TRUE (Practico), se genera una fila por cada categoria solicitada',
      },
    },
    {
      name: 'es_digital',
      type: 'checkbox',
      label: 'Es digital',
      defaultValue: false,
      admin: {
        description: 'Habilita examen en PC',
      },
    },
    {
      name: 'es_carga_fut',
      type: 'checkbox',
      label: 'Es carga fut',
      defaultValue: false,
      admin: {
        description: 'Pide cargar ID Nacional',
      },
    },
    {
      name: 'es_multiplicable_por_clase',
      type: 'checkbox',
      label: 'Es multiplicable por clase',
      defaultValue: false,
      admin: {
        description: 'Si es TRUE (Practico), se genera una fila por cada categoria solicitada',
      },
    },
  ],
}
