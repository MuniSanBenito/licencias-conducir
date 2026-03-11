import type { CollectionConfig } from 'payload'

export const Ciudadano: CollectionConfig = {
  slug: 'ciudadano',
  labels: {
    singular: 'Ciudadano',
    plural: 'Ciudadanos',
  },
  admin: {
    useAsTitle: 'dni',
    group: 'Trámites',
    description: 'Registro de ciudadanos que realizan trámites de licencias de conducir',
    defaultColumns: ['dni', 'nombreCompleto', 'celular', 'domicilio'],
    listSearchableFields: ['dni', 'nombre', 'apellido'],
  },
  defaultSort: 'apellido',
  timestamps: true,
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'dni',
          type: 'text',
          required: true,
          unique: true,
          index: true,
          label: 'DNI',
          admin: { width: '30%' },
        },
        {
          name: 'nombre',
          type: 'text',
          required: true,
          admin: { width: '35%' },
        },
        {
          name: 'apellido',
          type: 'text',
          required: true,
          admin: { width: '35%' },
        },
      ],
    },
    {
      name: 'nombreCompleto',
      type: 'text',
      virtual: true,
      hooks: {
        afterRead: [
          ({ siblingData }) => `${siblingData.apellido}, ${siblingData.nombre}`,
        ],
      },
      admin: {
        hidden: true,
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'celular',
          type: 'text',
          required: true,
          admin: { width: '50%' },
        },
        {
          name: 'fechaNacimiento',
          type: 'date',
          required: true,
          label: 'Fecha de Nacimiento',
          admin: {
            width: '50%',
            date: {
              displayFormat: 'dd/MM/yyyy',
            },
          },
        },
      ],
    },
    {
      name: 'domicilio',
      type: 'text',
      required: true,
    },
  ],
}
