import {
  ESTADO_TRAMITE,
  ESTADO_TURNO,
  ESTADOS_TRAMITE,
  tipoRequiereCurso,
  TIPOS_TRAMITE,
} from '@/constants/tramites'
import { basePayload } from '@/web/libs/payload/server'
import {
  SEED_DIAS_POR_MES,
  SEED_FUT_MIN,
  SEED_FUT_PREFIX,
  SEED_FUT_RANGE,
  SEED_TRAMITES_FECHA_INICIO_MONTH_RANGE,
  SEED_TRAMITES_FECHA_INICIO_YEAR,
  SEED_TRAMITES_TOTAL,
  SEED_TURNO_FECHA_DEFAULT,
} from './constants'

function randomInt(maxExclusive: number): number {
  return Math.floor(Math.random() * maxExclusive)
}

function randomFrom<T>(values: readonly T[]): T {
  return values[randomInt(values.length)]
}

const HORAS_PSICOFISICO = [
  '07:00',
  '07:20',
  '07:40',
  '08:00',
  '08:20',
  '08:40',
  '09:00',
  '09:20',
  '09:40',
  '10:00',
  '10:20',
  '10:40',
]

const seed = async () => {
  console.log('🌱 Iniciando seed de trámites...')

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

  for (let i = 0; i < SEED_TRAMITES_TOTAL; i++) {
    try {
      const ciudadano = randomFrom(ciudadanos)
      const tipo = randomFrom(TIPOS_TRAMITE)
      const estado = randomFrom(ESTADOS_TRAMITE)
      const requiereCurso = tipoRequiereCurso(tipo)

      const fut =
        Math.random() > 0.3
          ? `${SEED_FUT_PREFIX}-${SEED_FUT_MIN + randomInt(SEED_FUT_RANGE)}`
          : undefined

      const fechaInicio = new Date(
        SEED_TRAMITES_FECHA_INICIO_YEAR,
        randomInt(SEED_TRAMITES_FECHA_INICIO_MONTH_RANGE),
        1 + randomInt(SEED_DIAS_POR_MES),
      ).toISOString()

      const tramite = await basePayload.create({
        collection: 'tramite',
        data: {
          ciudadano: ciudadano.id,
          tipo,
          fut,
          estado,
          fechaInicio,
          fechaFin: estado === ESTADO_TRAMITE.COMPLETADO ? new Date().toISOString() : undefined,
        },
      })

      // Crear turno de curso si corresponde
      if (requiereCurso) {
        await basePayload.create({
          collection: 'turno-curso',
          data: {
            tramite: tramite.id,
            fecha: SEED_TURNO_FECHA_DEFAULT,
            hora: '08:30',
            estado:
              estado === ESTADO_TRAMITE.COMPLETADO
                ? ESTADO_TURNO.COMPLETADO
                : ESTADO_TURNO.PROGRAMADO,
          },
        })
      }

      // Crear turno de psicofísico
      await basePayload.create({
        collection: 'turno-psicofisico',
        data: {
          tramite: tramite.id,
          fecha: SEED_TURNO_FECHA_DEFAULT,
          hora: randomFrom(HORAS_PSICOFISICO),
          estado:
            estado === ESTADO_TRAMITE.COMPLETADO
              ? ESTADO_TURNO.COMPLETADO
              : ESTADO_TURNO.PROGRAMADO,
        },
      })

      console.log(
        `✅ Trámite creado: ${fut || '(sin FUT)'} → ${ciudadano.nombre} ${ciudadano.apellido} (${tipo}, ${estado})`,
      )
    } catch (error) {
      console.error(`❌ Error al crear trámite:`, error instanceof Error ? error.message : error)
    }
  }

  console.log('✅ Seed de trámites completado.')
  process.exit(0)
}

await seed()
