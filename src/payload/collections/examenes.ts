import { HIDE_API_URL } from '@/config'
import { CATEGORIAS_AUTO, CATEGORIAS_MOTO } from '@/constants/categorias'
import type { Ciudadano, Consigna, Examen } from '@/payload-types'
import {
  APIError,
  type CollectionBeforeChangeHook,
  type CollectionConfig,
  type FilterOptions,
} from 'payload'

const CONSIGNAS_CANTIDAD = 3

function getUniqueRandomIndicesFisherYates(cantidad = 0, k = 2): number[] {
  if (cantidad < k) throw new Error('La cantidad debe ser mayor o igual a k')
  const arr = Array.from({ length: cantidad }, (_, i) => i)
  for (let i = cantidad - 1; i > cantidad - 1 - k; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr.slice(cantidad - k)
}

const beforeChange: CollectionBeforeChangeHook<Examen> = async ({ operation, data, req }) => {
  if (operation === 'update') {
    // Verificar duplicados en update
    const consignas: Consigna[] = []
    for (const c of data?.consignas || []) {
      const consigna =
        typeof c === 'string'
          ? await req.payload.findByID({
              collection: 'consignas',
              id: c,
            })
          : c

      consignas.push(consigna)
    }

    const duplicados =
      consignas?.filter(
        (consigna, index) =>
          consignas.map((consigna) => consigna.id)?.indexOf(consigna.id) !== index,
      ) || []

    if (duplicados.length > 0) {
      throw new APIError(
        `Consignas duplicadas: ${duplicados.map((d) => d.pregunta).join(', ')}`,
        400,
        null,
        true,
      )
    }

    return data
  }

  const consignas = await req.payload.find({
    collection: 'consignas',
    pagination: false,
    where: {
      categorias: {
        in: data?.categorias || [],
      },
    },
  })

  if (!consignas?.docs || consignas.docs.length === 0) {
    throw new APIError(
      `No hay consignas disponibles para las categorías seleccionadas.`,
      400,
      null,
      true,
    )
  }

  const cantidad =
    consignas.docs.length < CONSIGNAS_CANTIDAD ? consignas.docs.length : CONSIGNAS_CANTIDAD

  // Usar consignas.docs.length en lugar de totalDocs para evitar índices fuera de rango
  const indices = getUniqueRandomIndicesFisherYates(consignas.docs.length, cantidad)

  // Asignar solo los IDs de las consignas, no los objetos completos
  data.consignas = indices.map((index) => consignas.docs[index].id)

  const fut =
    typeof data?.fut === 'string'
      ? await req.payload.findByID({
          collection: 'futs',
          id: data.fut,
        })
      : data.fut

  data.titulo = `FUT ${fut?.futId} - DNI ${(fut?.ciudadano as Ciudadano).dni}`

  const ahora = new Date()
  data.horarioInicio = ahora.toISOString()

  // horarioCierre debe ser 1 hora despues de la horarioInicio
  const unaHoraDespues = new Date(ahora.getTime() + 60 * 60 * 1000)
  data.horarioCierre = unaHoraDespues.toISOString()

  return data
}

const consignaFilter: FilterOptions<Examen> = ({ data }) => {
  if (!data.categorias || data.categorias.length < 1) {
    return false
  }

  // solo devuelve consignas que coincidan con las categorías del examen
  return {
    categorias: {
      in: data.categorias,
    },
  }
}

export const Examenes: CollectionConfig = {
  slug: 'examenes',
  labels: {
    singular: 'Examen',
    plural: 'Examenes',
  },
  admin: {
    hideAPIURL: HIDE_API_URL,
    useAsTitle: 'titulo',
  },
  typescript: {
    interface: 'Examen',
  },
  hooks: {
    beforeChange: [beforeChange],
  },
  trash: true,
  fields: [
    {
      name: 'fut',
      type: 'relationship',
      label: 'FUT',
      relationTo: 'futs',
      required: true,
    },
    {
      name: 'consignas',
      type: 'relationship',
      label: 'Consignas',
      relationTo: 'consignas',
      hasMany: true,
      filterOptions: consignaFilter,
    },
    {
      name: 'respuestas',
      type: 'array',
      label: 'Respuestas',
      fields: [
        {
          name: 'consigna',
          type: 'relationship',
          relationTo: 'consignas',
          required: true,
          hasMany: false,
          access: {
            create: () => false,
            update: () => false,
          },
        },
        {
          name: 'respuestas',
          type: 'array',
          label: 'Respuestas',
          labels: {
            singular: 'Respuesta',
            plural: 'Respuestas',
          },
          required: true,
          fields: [
            {
              name: 'respuesta',
              type: 'number',
              label: 'Respuesta',
              required: true,
              min: 0,
            },
          ],
        },
      ],
      access: {
        create: () => false,
      },
    },
    // aside fields
    {
      name: 'categorias',
      type: 'select',
      label: 'Categorías',
      options: [...CATEGORIAS_MOTO, ...CATEGORIAS_AUTO],
      defaultValue: [CATEGORIAS_MOTO[0]],
      hasMany: true,
      required: true,
      admin: {
        description: 'Selecciona una o más categorías para esta consigna.',
        position: 'sidebar',
      },
    },
    {
      name: 'finalizado',
      type: 'checkbox',
      label: 'Finalizado',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'horarioInicio',
      type: 'date',
      label: 'Horario de Inicio',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      access: {
        create: () => false,
        update: () => false,
      },
    },
    {
      name: 'horarioCierre',
      type: 'date',
      label: 'Horario de Cierre',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      access: {
        create: () => false,
        update: () => false,
      },
    },
    {
      name: 'horarioFin',
      type: 'date',
      label: 'Horario de Fin',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      access: {
        create: () => false,
        update: () => false,
      },
    },
    // hidden fields
    {
      name: 'titulo',
      type: 'text',
      label: 'Título',
      admin: {
        hidden: true,
      },
    },
  ],
}
