import type { CollectionConfig } from 'payload'

/* Table "tramites_categorias_solicitadas" {
  "id" int [pk, not null, increment]
  "tramite_id" int [ref: < "tramites"."id"]
  "clase_licencia_id" int [ref: < "clases_licencia"."id"]
  Indexes {
    (tramite_id, clase_licencia_id) [unique, name: "idx_tramites_categorias_solicitadas_tramite_id_clase_licencia_id"]
  }
} */

export const TramiteCategoriaSeleccionada: CollectionConfig = {
  slug: 'tramite-categoria-seleccionada',
  labels: {
    singular: 'Tramite Categoria Seleccionada',
    plural: 'Tramites Categorias Seleccionadas',
  },
  indexes: [
    {
      fields: ['tramite', 'clase_licencia'],
      unique: true,
    },
  ],
  admin: {
    description:
      'Categorías de licencia solicitadas en cada trámite. Permite gestionar trámites multi-categoría (ej: solicitar A + B simultáneamente)',
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
      name: 'clase_licencia',
      type: 'relationship',
      relationTo: 'clase_licencia',
      required: true,
      label: 'Clase Licencia',
    },
  ],
}
