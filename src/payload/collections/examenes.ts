import { HIDE_API_URL } from '@/config'
import { CATEGORIAS_AUTO, CATEGORIAS_MOTO } from '@/constants/categorias'
import type { Ciudadano, Consigna, Examen } from '@/payload-types'
import {
  APIError,
  type CollectionBeforeChangeHook,
  type CollectionConfig,
  type FieldHook,
  type FilterOptions,
} from 'payload'

const afterChangeTitulo: FieldHook<Examen, string, Examen> = async ({ data, req }) => {
  const fut =
    typeof data?.fut === 'string'
      ? await req.payload.findByID({
          collection: 'futs',
          id: data.fut,
        })
      : data!.fut

  if (!fut) {
    return ''
  }

  const titulo = `FUT ${fut.futId} - DNI ${(fut.ciudadano as Ciudadano).dni}`

  return titulo
}

function getUniqueRandomIndicesFisherYates(cantidad: number, k = 2): number[] {
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
    for (const item of data?.consignas || []) {
      const consigna =
        typeof item.consigna === 'string'
          ? await req.payload.findByID({
              collection: 'consignas',
              id: item.consigna,
            })
          : item.consigna

      consignas.push(consigna)
    }

    console.log('Consignas en update:', consignas)

    const duplicados =
      consignas?.filter(
        (consigna, index) =>
          consignas.map((consigna) => consigna.id)?.indexOf(consigna.id) !== index,
      ) || []
    console.log('Consignas duplicadas encontradas en update:', duplicados)

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
    where: {
      categorias: {
        in: data.categorias || [],
      },
    },
  })

  const indices = getUniqueRandomIndicesFisherYates(consignas.totalDocs, 3)

  const selectedConsignas = indices.map((index) => {
    const consigna = consignas.docs[index]
    console.log('Consignas encontradas para el examen:', consigna)
    return {
      consigna: consigna.id,
      respuesta: null,
      correcta: null,
    }
  })

  data.consignas = selectedConsignas

  return data
}

const consignaFilter: FilterOptions<Examen> = ({ data }) => {
  if (!data.categorias || data.categorias.length < 1) {
    return false
  }

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
      type: 'array',
      fields: [
        {
          name: 'consigna',
          type: 'relationship',
          label: 'Consigna',
          relationTo: 'consignas',
          required: true,
          filterOptions: consignaFilter,
        },
        {
          name: 'respuesta',
          type: 'number',
          label: 'Respuesta',
          required: false,
        },
        {
          name: 'correcta',
          type: 'checkbox',
          label: 'Correcta',
          defaultValue: false,
        },
      ],
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
    // hidden fields
    {
      name: 'titulo',
      type: 'text',
      label: 'Título',
      admin: {
        hidden: true,
      },
      hooks: {
        afterChange: [afterChangeTitulo],
      },
    },
  ],
  /* endpoints: [
    {
      path: '/iniciar-examen',
      method: 'put',
      handler: async (req) => {
        const usuarios = await req.payload.find({
          collection: 'usuarios',
        })
        console.log('users', usuarios)
        const data = req.json && (await req.json())
        console.log('Iniciar examen endpoint called with args:', data)

        const response: Res = {
          ok: true,
          message: 'Examen iniciado',
        }
        return Response.json(response, {
          status: 200,
        })
      },
    },
  ], */
}
