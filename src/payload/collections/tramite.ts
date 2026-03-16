import type { CollectionAfterChangeHook, CollectionConfig } from 'payload'

import { CLASES_LICENCIA } from '@/constants/clases'
import { DISPLAY_DATE_FORMAT } from '@/constants/fechas'
import {
  ESTADO_PASO_DEFAULT,
  ESTADO_TRAMITE_DEFAULT,
  ESTADOS_TRAMITE_CON_FECHA_FIN,
  OPCIONES_ESTADO_PASO,
  OPCIONES_ESTADO_TRAMITE,
  OPCIONES_ESTADO_TURNO,
  OPCIONES_PASO_ID,
  OPCIONES_TIPO_TRAMITE,
  PASO_ID,
} from '@/constants/tramites'

const OPCIONES_CLASE = CLASES_LICENCIA.map((clase) => ({
  label: clase,
  value: clase,
}))

const generarExamenTeorico: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  operation,
  req,
}) => {
  if (operation !== 'create' && operation !== 'update') return doc

  const pasoExamenTeorico = doc.pasos?.find((p: any) => p.pasoId === PASO_ID.EXAMEN_TEORICO)
  const pasoExamenTeoricoPrevio = previousDoc?.pasos?.find((p: any) => p.pasoId === PASO_ID.EXAMEN_TEORICO)

  const turno = pasoExamenTeorico?.turno
  const previoTurno = pasoExamenTeoricoPrevio?.turno

  const tieneTurnoValido = turno && turno.fecha && turno.hora && turno.estado !== 'cancelado'

  if (tieneTurnoValido && (!previoTurno || previoTurno.fecha !== turno.fecha || previoTurno.hora !== turno.hora)) {
    const examenesExistentes = await req.payload.find({
      collection: 'examen',
      where: {
        tramite: {
          equals: doc.id,
        },
        estado: {
          equals: 'abierto',
        },
      },
    })

    if (examenesExistentes.totalDocs === 0) {
      const clases = doc.items.map((item: any) => item.clase)
      const preguntasGeneradas: any[] = []
      const preguntasAgregadasIds = new Set<string>()

      for (const clase of clases) {
        const preguntasQuery = await req.payload.find({
          collection: 'pregunta',
          limit: 100,
          where: {
            clases: {
              contains: clase,
            },
          },
        })

        const preguntasClase = preguntasQuery.docs.filter((p) => !preguntasAgregadasIds.has(p.id))
        const shuffled = preguntasClase.sort(() => 0.5 - Math.random())
        const seleccionadas = shuffled.slice(0, 5)

        for (const p of seleccionadas) {
          preguntasAgregadasIds.add(p.id)
          preguntasGeneradas.push({
            preguntaOriginal: p.id,
            consigna: p.consigna,
            imagenConsigna: typeof p.imagenConsigna === 'object' ? p.imagenConsigna?.id : p.imagenConsigna,
            clases: p.clases,
            opciones: p.opciones?.map((o: any) => ({
              idOp: o.id || Math.random().toString(36).substring(2, 9),
              texto: o.texto,
              imagen: typeof o.imagen === 'object' ? o.imagen?.id : o.imagen,
              esCorrecta: o.esCorrecta,
            })),
          })
        }
      }

      if (preguntasGeneradas.length > 0) {
        let fechaInicio: Date
        if (turno.fecha.includes('T')) {
          const [yyyy, mm, dd] = turno.fecha.split('T')[0].split('-')
          const [hh, min] = turno.hora.split(':')
          fechaInicio = new Date(Date.UTC(Number(yyyy), Number(mm) - 1, Number(dd), Number(hh), Number(min)))
        } else {
          // If already a valid ISO string, though payload stores as ISO string date only
          const d = new Date(turno.fecha)
          const [hh, min] = turno.hora.split(':')
          d.setUTCHours(Number(hh), Number(min), 0, 0)
          fechaInicio = d
        }
        
        const fechaFin = new Date(fechaInicio.getTime() + 5 * 60000)

        await req.payload.create({
          collection: 'examen',
          data: {
            ciudadano: typeof doc.ciudadano === 'object' ? doc.ciudadano.id : doc.ciudadano,
            tramite: doc.id,
            estado: 'abierto',
            fechaInicio: fechaInicio.toISOString(),
            fechaFin: fechaFin.toISOString(),
            preguntasGeneradas,
          },
        })
      }
    }
  }

  return doc
}

export const Tramite: CollectionConfig = {
  slug: 'tramite',
  labels: {
    singular: 'Trámite',
    plural: 'Trámites',
  },
  admin: {
    useAsTitle: 'fut',
    group: 'Trámites',
    description: 'Gestión de trámites de licencias de conducir',
    defaultColumns: ['fut', 'ciudadano', 'estado', 'fechaInicio'],
    listSearchableFields: ['fut'],
  },
  defaultSort: '-createdAt',
  timestamps: true,
  hooks: {
    afterChange: [generarExamenTeorico],
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'fut',
          type: 'text',
          required: true,
          unique: true,
          index: true,
          label: 'FUT',
          admin: { width: '30%' },
        },
        {
          name: 'ciudadano',
          type: 'relationship',
          relationTo: 'ciudadano',
          required: true,
          admin: { width: '70%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'estado',
          type: 'select',
          options: OPCIONES_ESTADO_TRAMITE,
          required: true,
          defaultValue: ESTADO_TRAMITE_DEFAULT,
          admin: { width: '30%' },
        },
        {
          name: 'fechaInicio',
          type: 'date',
          required: true,
          label: 'Fecha de Inicio',
          admin: {
            width: '35%',
            date: { displayFormat: DISPLAY_DATE_FORMAT },
          },
        },
        {
          name: 'fechaFin',
          type: 'date',
          label: 'Fecha de Fin',
          admin: {
            width: '35%',
            date: { displayFormat: DISPLAY_DATE_FORMAT },
            condition: (data) => ESTADOS_TRAMITE_CON_FECHA_FIN.includes(data?.estado),
          },
        },
      ],
    },

    // ─── Items de Licencia ───
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      labels: {
        singular: 'Licencia',
        plural: 'Licencias',
      },
      admin: {
        description: 'Licencias solicitadas en este trámite',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'clase',
              type: 'select',
              options: OPCIONES_CLASE,
              required: true,
              label: 'Clase',
              admin: { width: '50%' },
            },
            {
              name: 'tipo',
              type: 'select',
              options: OPCIONES_TIPO_TRAMITE,
              required: true,
              label: 'Tipo',
              admin: { width: '50%' },
            },
          ],
        },
      ],
    },

    // ─── Pasos del Trámite ───
    {
      name: 'pasos',
      type: 'array',
      required: true,
      labels: {
        singular: 'Paso',
        plural: 'Pasos',
      },
      admin: {
        description: 'Progreso del trámite a través de sus pasos requeridos',
        initCollapsed: true,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'pasoId',
              type: 'select',
              options: OPCIONES_PASO_ID,
              required: true,
              label: 'Paso',
              admin: { width: '40%' },
            },
            {
              name: 'label',
              type: 'text',
              required: true,
              admin: { width: '35%' },
            },
            {
              name: 'estado',
              type: 'select',
              options: OPCIONES_ESTADO_PASO,
              required: true,
              defaultValue: ESTADO_PASO_DEFAULT,
              admin: { width: '25%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'requiereTurno',
              type: 'checkbox',
              label: 'Requiere Turno',
              defaultValue: false,
              admin: { width: '25%' },
            },
            {
              name: 'fecha',
              type: 'date',
              label: 'Fecha de Realización',
              admin: {
                width: '35%',
                date: { displayFormat: DISPLAY_DATE_FORMAT },
              },
            },
            {
              name: 'observaciones',
              type: 'textarea',
              admin: { width: '40%' },
            },
          ],
        },

        // Turno embebido (group condicional)
        {
          name: 'turno',
          type: 'group',
          label: 'Turno',
          admin: {
            condition: (_, siblingData) => siblingData?.requiereTurno === true,
          },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'fecha',
                  type: 'date',
                  label: 'Fecha del Turno',
                  admin: {
                    width: '35%',
                    date: { displayFormat: DISPLAY_DATE_FORMAT },
                  },
                },
                {
                  name: 'hora',
                  type: 'text',
                  label: 'Hora',
                  admin: {
                    width: '25%',
                    placeholder: 'HH:MM',
                  },
                },
                {
                  name: 'estado',
                  type: 'select',
                  options: OPCIONES_ESTADO_TURNO,
                  label: 'Estado del Turno',
                  admin: { width: '40%' },
                },
              ],
            },
            {
              name: 'observaciones',
              type: 'textarea',
              label: 'Observaciones del Turno',
            },
          ],
        },
      ],
    },
  ],
}
