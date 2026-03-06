import { EstadosTramiteEnum } from '@/constants/estados-tramite'
import type { CollectionConfig } from 'payload'

/* Table "tramites" {
  "id" int [pk, not null, increment, ref: < "emisiones_licencia"."tramite_id"]
  "ciudadano_id" int [ref: < "ciudadanos"."id"]
  "plantilla_id" int [ref: < "proceso_plantilla"."id"]
  "codigo_interno" varchar(50) [unique, note: 'MUNI-2026-XXXX']
  "nro_fut_nacional" varchar(50) [unique, note: 'Se carga antes del teorico']
  "estado_global" varchar(20) [default: `EN_CURSO`]
  "fecha_inicio" datetime [default: `CURRENT_TIMESTAMP`]
} */

export const Tramite: CollectionConfig = {
  slug: 'tramite',
  labels: {
    singular: 'Tramite',
    plural: 'Tramites',
  },
  admin: {
    useAsTitle: 'ciudadano',
  },
  trash: true,
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
    {
      name: 'categorias',
      required: true,
      label: 'Categorias',
      labels: {
        singular: 'Categoria',
        plural: 'Categorias',
      },
      type: 'blocks',
      blocks: [
        {
          admin: {
            disableBlockName: true,
          },
          slug: 'a1',
          fields: [
            {
              name: 'etapas',
              type: 'array',
              fields: [
                {
                  name: 'numero',
                  type: 'number',
                  min: 1,
                  defaultValue: 1,
                  admin: {
                    step: 1,
                  },
                  required: true,
                  label: 'Numero de Etapa',
                },
                {
                  name: 'estado',
                  type: 'select',
                  options: [
                    ...Object.values(EstadosTramiteEnum).map((estado) => ({
                      label: estado,
                      value: estado,
                    })),
                  ],
                  required: true,
                  defaultValue: EstadosTramiteEnum.EN_CURSO,
                  label: 'Estado',
                },
                {
                  name: 'fecha_aprobacion',
                  type: 'date',
                  label: 'Fecha Aprobacion',
                },
                {
                  name: 'observaciones',
                  type: 'textarea',
                  label: 'Observaciones',
                },
              ],
            },
          ],
        },
        {
          slug: 'a2',
          fields: [
            {
              name: 'a2',
              type: 'checkbox',
              label: 'A2',
              required: false,
            },
          ],
        },
        {
          slug: 'a3',
          fields: [
            {
              name: 'a3',
              type: 'checkbox',
              label: 'A3',
              required: false,
            },
          ],
        },
        {
          slug: 'a4',
          fields: [
            {
              name: 'a4',
              type: 'checkbox',
              label: 'A4',
              required: false,
            },
          ],
        },
        {
          slug: 'b1',
          fields: [
            {
              name: 'b1',
              type: 'checkbox',
              label: 'B1',
              required: false,
            },
          ],
        },
        {
          slug: 'b2',
          fields: [
            {
              name: 'b2',
              type: 'checkbox',
              label: 'B2',
              required: false,
            },
          ],
        },
        {
          slug: 'c1',
          fields: [
            {
              name: 'c1',
              type: 'checkbox',
              label: 'C1',
              required: false,
            },
          ],
        },
        {
          slug: 'c2',
          fields: [
            {
              name: 'c2',
              type: 'checkbox',
              label: 'C2',
              required: false,
            },
          ],
        },
        {
          slug: 'c3',
          fields: [
            {
              name: 'c3',
              type: 'checkbox',
              label: 'C3',
              required: false,
            },
          ],
        },
        {
          slug: 'd1',
          fields: [
            {
              name: 'd1',
              type: 'checkbox',
              label: 'D1',
              required: false,
            },
          ],
        },
        {
          slug: 'd2',
          fields: [
            {
              name: 'd2',
              type: 'checkbox',
              label: 'D2',
              required: false,
            },
          ],
        },
      ],
      /* type: 'select',
          hasMany: true,
          options: [
            { label: 'A1', value: 'a1' },
            { label: 'A2', value: 'a2' },
            { label: 'A3', value: 'a3' },
            { label: 'A4', value: 'a4' },
            { label: 'B1', value: 'b1' },
            { label: 'B2', value: 'b2' },
            { label: 'C1', value: 'c1' },
            { label: 'C2', value: 'c2' },
            { label: 'C3', value: 'c3' },
            { label: 'D1', value: 'd1' },
            { label: 'D2', value: 'd2' },
          ], */
    },

    /* {
      type: 'join',
      name: 'procesos',
      collection: 'tramite-proceso',
      on: 'tramite',
      label: 'Procesos',
    }, */
  ],
}
