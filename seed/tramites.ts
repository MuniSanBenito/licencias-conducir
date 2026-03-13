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
import {
  SEED_CANTIDAD_ITEMS_MAX,
  SEED_DIAS_POR_MES,
  SEED_FUT_MIN,
  SEED_FUT_PREFIX,
  SEED_FUT_RANGE,
  SEED_PASO_FECHA_DAY_CYCLE,
  SEED_PASO_FECHA_PREFIX,
  SEED_PROBABILIDAD_DOS_ITEMS,
  SEED_TRAMITES_FECHA_INICIO_MONTH_RANGE,
  SEED_TRAMITES_FECHA_INICIO_YEAR,
  SEED_TRAMITES_TOTAL,
  SEED_TURNO_FECHA_DEFAULT,
  SEED_TURNO_HORA_BASE,
  SEED_TURNO_HORA_DEFAULT,
  SEED_TURNO_HORA_RANGE,
} from './constants'

function randomInt(maxExclusive: number): number {
  return Math.floor(Math.random() * maxExclusive)
}

function randomFrom<T>(values: readonly T[]): T {
  return values[randomInt(values.length)]
}

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
        fecha: `${SEED_PASO_FECHA_PREFIX}${(i % SEED_PASO_FECHA_DAY_CYCLE) + 1}`,
        turno: base.requiereTurno
          ? {
              fecha: `${SEED_PASO_FECHA_PREFIX}${(i % SEED_PASO_FECHA_DAY_CYCLE) + 1}`,
              hora: `${SEED_TURNO_HORA_BASE + (i % SEED_TURNO_HORA_RANGE)}:00`,
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
              fecha: SEED_TURNO_FECHA_DEFAULT,
              hora: SEED_TURNO_HORA_DEFAULT,
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

  for (let i = 0; i < SEED_TRAMITES_TOTAL; i++) {
    try {
      const ciudadano = randomFrom(ciudadanos)
      const fut = `${SEED_FUT_PREFIX}-${SEED_FUT_MIN + randomInt(SEED_FUT_RANGE)}`

      // Determinar cantidad de items (1 o 2)
      const cantItems = Math.random() < SEED_PROBABILIDAD_DOS_ITEMS ? SEED_CANTIDAD_ITEMS_MAX : 1
      const items: ItemLicencia[] = []
      for (let j = 0; j < cantItems; j++) {
        items.push({
          clase: randomFrom(CLASES_LICENCIA),
          tipo: randomFrom(TIPOS),
        })
      }

      const totalPasos = getPasosParaTramite(items).length

      // Estado aleatorio
      const estado = randomFrom(ESTADOS)

      // Cuántos pasos avanzar
      let pasosAvanzados = 0
      if (estado === ESTADO_TRAMITE.COMPLETADO) {
        pasosAvanzados = totalPasos
      } else if (estado === ESTADO_TRAMITE.EN_CURSO) {
        pasosAvanzados = randomInt(totalPasos)
      } else {
        pasosAvanzados = randomInt(Math.max(1, Math.floor(totalPasos / 2)))
      }

      const pasos = avanzarPasos(items, pasosAvanzados)
      const fechaInicio = new Date(
        SEED_TRAMITES_FECHA_INICIO_YEAR,
        randomInt(SEED_TRAMITES_FECHA_INICIO_MONTH_RANGE),
        1 + randomInt(SEED_DIAS_POR_MES),
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
