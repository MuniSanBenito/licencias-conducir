import type { CollectionConfig } from 'payload'

export const Tramite: CollectionConfig = {
  slug: 'tramite',
  labels: {
    singular: 'Tramite',
    plural: 'Tramites',
  },
  admin: {
    useAsTitle: 'title',
  },
  trash: true,
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'ciudadano',
          type: 'relationship',
          relationTo: 'ciudadano',
          required: true,
          label: 'Ciudadano',
        },
        {
          name: 'fut',
          type: 'text',
          required: false,
          label: 'FUT',
          unique: true,
          index: true,
        },
      ],
    },
    {
      name: 'clases',
      type: 'array',
      label: 'Clases',
      labels: {
        singular: 'Clase',
        plural: 'Clases',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'categoria',
              type: 'select',
              hasMany: false,
              options: ['A1', 'A2', 'B1', 'B2', 'C1'],
              defaultValue: 'A1',
              required: true,
              admin: {
                description: 'Categoria o categorias que este tramite va a solicitar.',
              },
            },
            {
              name: 'tipo',
              type: 'select',
              hasMany: false,
              options: ['Original', 'Renovacion', 'Ampliacion'],
              defaultValue: 'Original',
              required: true,
              admin: {
                description: 'Tipo de tramite que corresponda a esta categoria.',
              },
            },
          ],
        },
      ],
    },
    // aside fields
    {
      name: 'etapas',
      type: 'select',
      label: 'Etapas',
      hasMany: true,
      options: ['Papeles', 'Curso', 'Teorico', 'Practico', 'Psicofisico'],
      required: true,
      admin: {
        description: 'Todas las etapas en orden que se deben realizar en este tramite',
        position: 'sidebar',
      },
    },
    // hidden fields
    {
      name: 'title',
      type: 'text',
      label: 'Titulo',
      admin: {
        hidden: true,
      },
      hooks: {
        beforeValidate: [
          async ({ data, req }) => {
            if (!data?.ciudadano) return
            const ciudadano =
              typeof data.ciudadano === 'string'
                ? await req.payload.findByID({ collection: 'ciudadano', id: data.ciudadano, req })
                : data.ciudadano
            return `${ciudadano?.dni}${data?.fut ? ` - FUT: ${data.fut}` : ''}`
          },
        ],
      },
    },
  ],
}
