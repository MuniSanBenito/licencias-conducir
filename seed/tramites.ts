import { CLASES_LICENCIA } from '@/constants/clases'
import {
  ESTADO_PASO,
  ESTADO_TRAMITE,
  ESTADO_TURNO,
  ESTADOS_TRAMITE,
  PASO_LABELS,
  PASOS_CON_TURNO,
  TIPOS_TRAMITE,
} from '@/constants/tramites'
import { basePayload } from '@/web/libs/payload/server'
import { getPasosParaTramite, type ItemLicencia } from '@/web/utils/pasos'

// ─── Helper para avanzar pasos (adapta al schema de Payload) ───

function avanzarPasos(items: ItemLicencia[], cantidad: number) {
  const pasos = getPasosParaTramite(items)

  return pasos.map((paso, i) => {
    const base = {
      pasoId: paso.id,
      label: PASO_LABELS[paso.id],
      requiereTurno: PASOS_CON_TURNO.has(paso.id),
    }

    if (i < cantidad) {
      return {
        ...base,
        estado: ESTADO_PASO.COMPLETADO,
        fecha: `2026-03-0${(i % 9) + 1}`,
        turno: base.requiereTurno
          ? {
              fecha: `2026-03-0${(i % 9) + 1}`,
              hora: `${8 + (i % 4)}:00`,
              estado: ESTADO_TURNO.COMPLETADO,
            }
          : undefined,
      }
    }

    if (i === cantidad) {
      return {
        ...base,
        estado: ESTADO_PASO.EN_CURSO,
        turno: base.requiereTurno
          ? {
              fecha: '2026-03-15',
              hora: '10:00',
              estado: ESTADO_TURNO.PROGRAMADO,
            }
          : undefined,
      }
    }

    return { ...base, estado: ESTADO_PASO.PENDIENTE }
  })
}

// ─── Seed ───

const seed = async () => {
  console.log('🌱 Iniciando seed de trámites...')

  // Obtener todos los ciudadanos existentes
  const { docs: ciudadanos } = await basePayload.find({
    collection: 'ciudadano',
    limit: 0,
  })

  if (ciudadanos.length === 0) {
    console.error(
      '❌ No hay ciudadanos en la base de datos. Ejecutá primero el seed de ciudadanos.',
    )
    process.exit(1)
  }

  console.log(`📋 ${ciudadanos.length} ciudadanos encontrados, generando trámites...`)

  const TIPOS = TIPOS_TRAMITE
  const ESTADOS = ESTADOS_TRAMITE

  // Generar 25 trámites (5 originales + 20 extras)
  for (let i = 0; i < 25; i++) {
    try {
      const ciudadano = ciudadanos[Math.floor(Math.random() * ciudadanos.length)]
      const fut = `FUT-${10000 + Math.floor(Math.random() * 90000)}`

      // Determinar cantidad de items (1 o 2)
      const cantItems = Math.random() > 0.8 ? 2 : 1
      const items: ItemLicencia[] = []
      for (let j = 0; j < cantItems; j++) {
        items.push({
          clase: CLASES_LICENCIA[Math.floor(Math.random() * CLASES_LICENCIA.length)] as any,
          tipo: TIPOS[Math.floor(Math.random() * TIPOS.length)],
        })
      }

      const totalPasos = getPasosParaTramite(items).length

      // Estado aleatorio
      const estado = ESTADOS[Math.floor(Math.random() * ESTADOS.length)]

      // Cuántos pasos avanzar
      let pasosAvanzados = 0
      if (estado === ESTADO_TRAMITE.COMPLETADO) {
        pasosAvanzados = totalPasos
      } else if (estado === ESTADO_TRAMITE.EN_CURSO) {
        pasosAvanzados = Math.floor(Math.random() * totalPasos)
      } else {
        pasosAvanzados = Math.floor(Math.random() * (totalPasos / 2))
      }

      const pasos = avanzarPasos(items, pasosAvanzados)
      const fechaInicio = new Date(
        2026,
        0 + Math.floor(Math.random() * 3),
        1 + Math.floor(Math.random() * 28),
      ).toISOString()

      await basePayload.create({
        collection: 'tramite',
        data: {
          fut,
          ciudadano: ciudadano.id,
          items,
          pasos,
          estado,
          fechaInicio,
          fechaFin: estado === ESTADO_TRAMITE.COMPLETADO ? new Date().toISOString() : undefined,
        },
      })

      console.log(
        `✅ Trámite creado: ${fut} → ${ciudadano.nombre} ${ciudadano.apellido} (${estado})`,
      )
    } catch (error) {
      console.error(`❌ Error al crear trámite:`, error instanceof Error ? error.message : error)
    }
  }

  console.log('✅ Seed de trámites completado.')
  process.exit(0)
}

// Call the function here to run your seed script
await seed()
