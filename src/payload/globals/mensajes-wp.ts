import type { CollectionConfig, GlobalConfig } from 'payload'

export const MensajesWp: GlobalConfig = {
  slug: 'mensajes-wp',
  label: 'Mensajes Whatsapp',
  admin: {
    group: 'Whatsapp',
    description: 'Mensajes para el bot de Whatsapp',
  },

  fields: [
    {
      name: 'mensajes_psicofisico',
      type: 'array',
      label: 'Mensajes Psicofísico',
      labels: {
        singular: 'Mensaje Psicofísico',
        plural: 'Mensajes Psicofísicos',
      },
      fields: [{ name: 'mensaje', type: 'textarea', label: 'Mensaje', required: true }],
    },
    {
      name: 'mensajes_curso',
      type: 'array',
      label: 'Mensajes Curso',
      labels: {
        singular: 'Mensaje Curso',
        plural: 'Mensajes Cursos',
      },
      fields: [{ name: 'mensaje', type: 'textarea', label: 'Mensaje', required: true }],
    },
  ],
}
