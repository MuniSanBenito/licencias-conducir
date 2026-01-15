import { ProcesosEnum } from '@/constants/procesos'
import type { CollectionConfig } from 'payload'

export const TramiteProceso: CollectionConfig = {
  slug: 'tramite-proceso',
  labels: {
    singular: 'Tramite Proceso',
    plural: 'Tramites Procesos',
  },
  admin: {
    useAsTitle: 'proceso',
  },
  indexes: [
    {
      fields: ['tramite', 'proceso'],
      unique: true,
    },
  ],
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
      name: 'proceso',
      type: 'select',
      label: 'Proceso',
      options: Object.values(ProcesosEnum).map((proceso) => ({
        label: proceso.nombre,
        value: proceso.nombre,
      })),
      required: true,
      defaultValue: ProcesosEnum['nuevaLicenciaA1_1'].nombre,
    },
    {
      type: 'join',
      name: 'progresos',
      collection: 'tramite-progreso',
      on: 'tramite_proceso',
      label: 'Progresos',
    },
  ],
}
