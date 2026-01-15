import type { CollectionConfig } from 'payload'

export const Ciudadano: CollectionConfig = {
  slug: 'ciudadano',
  labels: {
    singular: 'Ciudadano',
    plural: 'Ciudadanos',
  },
  admin: {
    useAsTitle: 'dni',
  },
  trash: true,
  fields: [
    {
      name: 'dni',
      type: 'text',
      label: 'DNI',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'nombre',
      type: 'text',
      label: 'Nombre',
      required: true,
    },
    {
      name: 'apellido',
      type: 'text',
      label: 'Apellido',
      required: true,
    },
    {
      name: 'email',
      type: 'text',
      label: 'Email',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'fecha_nacimiento',
      type: 'date',
      label: 'Fecha de nacimiento',
      required: true,
    },
  ],
}
