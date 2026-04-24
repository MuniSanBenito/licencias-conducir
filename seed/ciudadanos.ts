import { basePayload } from '@/web/libs/payload/server'
import {
  SEED_APELLIDOS,
  SEED_CALLES,
  SEED_CELULAR_PREFIJO,
  SEED_CELULAR_SUFIX_MIN,
  SEED_CELULAR_SUFIX_RANGE,
  SEED_CIUDADANOS_TOTAL,
  SEED_DIAS_POR_MES,
  SEED_DNI_MIN,
  SEED_DNI_RANGE,
  SEED_DOMICILIO_ALTURA_MIN,
  SEED_DOMICILIO_ALTURA_RANGE,
  SEED_EMAIL_DOMAIN,
  SEED_FECHA_NACIMIENTO_YEAR_MIN,
  SEED_FECHA_NACIMIENTO_YEAR_RANGE,
  SEED_LOCALIDAD,
  SEED_MESES_POR_ANIO,
  SEED_NOMBRES,
} from './constants'

function randomInt(maxExclusive: number): number {
  return Math.floor(Math.random() * maxExclusive)
}

function randomFrom<T>(values: readonly T[]): T {
  return values[randomInt(values.length)]
}

function stripDiacritics(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

const seed = async () => {
  console.log('🌱 Iniciando seed de ciudadanos...')

  for (let i = 0; i < SEED_CIUDADANOS_TOTAL; i++) {
    const nombre = randomFrom(SEED_NOMBRES)
    const apellido = randomFrom(SEED_APELLIDOS)
    const dni = (SEED_DNI_MIN + randomInt(SEED_DNI_RANGE)).toString()
    const celular = `${SEED_CELULAR_PREFIJO}${(SEED_CELULAR_SUFIX_MIN + randomInt(SEED_CELULAR_SUFIX_RANGE)).toString()}`
    const email = `${stripDiacritics(nombre).toLowerCase()}.${stripDiacritics(apellido).toLowerCase()}.${dni.slice(-4)}@${SEED_EMAIL_DOMAIN}`

    // Generar fecha entre 1960 y 2005
    const year = SEED_FECHA_NACIMIENTO_YEAR_MIN + randomInt(SEED_FECHA_NACIMIENTO_YEAR_RANGE)
    const month = randomInt(SEED_MESES_POR_ANIO)
    const day = 1 + randomInt(SEED_DIAS_POR_MES)
    const fechaNacimiento = new Date(year, month, day).toISOString()

    const domicilio = `${randomFrom(SEED_CALLES)} ${SEED_DOMICILIO_ALTURA_MIN + randomInt(SEED_DOMICILIO_ALTURA_RANGE)}, ${SEED_LOCALIDAD}`

    try {
      await basePayload.create({
        collection: 'ciudadano',
        data: {
          dni,
          nombre,
          apellido,
          celular,
          email,
          fechaNacimiento,
          domicilio,
        },
      })
      console.log(`✅ Ciudadano creado: ${nombre} ${apellido} (${dni})`)
    } catch (error) {
      console.error(
        `❌ Error al crear ciudadano ${dni}:`,
        error instanceof Error ? error.message : error,
      )
    }
  }

  console.log('✅ Seed de ciudadanos completado.')
  process.exit(0)
}

// Call the function here to run your seed script
await seed()
