import type { CollectionConfig } from 'payload'

/* Table "emisiones_licencia" {
  "id" int [pk, not null, increment]
  "tramite_id" int [unique]
  "fecha_emision" datetime [default: `CURRENT_TIMESTAMP`]
  "usuario_emisor_id" int
  "numero_control_plastico" varchar(50)
} */

export const EmisionLicencia: CollectionConfig = {
  slug: 'emision-licencia',
  labels: {
    singular: 'Emision Licencia',
    plural: 'Emisiones Licencias',
  },
  admin: {
    description:
      'Registro de emisión final de licencias. Almacena fecha de emisión, usuario emisor y número de control del plástico',
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
      name: 'fecha_emision',
      type: 'date',
      required: true,
      label: 'Fecha Emision',
    },
    /* {
      name: 'usuario_emisor',
      type: 'relationship',
      relationTo: 'usuario',
      required: true,
      label: 'Usuario Emisor',
    }, */
    {
      name: 'numero_control_plastico',
      type: 'text',
      required: true,
      label: 'Numero Control Plastico',
    },
  ],
}
