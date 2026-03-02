import { basePayload } from '@/web/libs/payload'

const NOMBRES = [
  'Juan',
  'María',
  'José',
  'Ana',
  'Carlos',
  'Laura',
  'Luis',
  'Sofía',
  'Diego',
  'Lucía',
  'Pedro',
  'Elena',
  'Miguel',
  'Carmen',
  'Javier',
  'Isabel',
  'Ricardo',
  'Paula',
  'Andrés',
  'Marta',
  'Fernando',
  'Beatriz',
  'Hugo',
  'Valentina',
  'Mateo',
  'Camila',
  'Santiago',
  'Martina',
  'Nicolás',
  'Daniela',
]

const APELLIDOS = [
  'García',
  'Rodríguez',
  'González',
  'Fernández',
  'López',
  'Martínez',
  'Sánchez',
  'Pérez',
  'Gómez',
  'Martin',
  'Jiménez',
  'Ruiz',
  'Hernández',
  'Díaz',
  'Moreno',
  'Muñoz',
  'Álvarez',
  'Romero',
  'Alonso',
  'Gutiérrez',
  'Navarro',
  'Torres',
  'Domínguez',
  'Vázquez',
  'Ramos',
  'Gil',
  'Ramírez',
  'Serrano',
  'Blanco',
  'Molina',
]

const seed = async () => {
  console.log('🌱 Iniciando seed de ciudadanos...')

  for (let i = 0; i < 35; i++) {
    const nombre = NOMBRES[Math.floor(Math.random() * NOMBRES.length)]
    const apellido = APELLIDOS[Math.floor(Math.random() * APELLIDOS.length)]
    const dni = (20000000 + Math.floor(Math.random() * 30000000)).toString()
    const email = `${nombre.toLowerCase()}.${apellido.toLowerCase()}.${dni.slice(-4)}@example.com`

    // Generar fecha entre 1960 y 2005
    const year = 1960 + Math.floor(Math.random() * 45)
    const month = Math.floor(Math.random() * 12)
    const day = 1 + Math.floor(Math.random() * 28)
    const fecha_nacimiento = new Date(year, month, day).toISOString()

    try {
      await basePayload.create({
        collection: 'ciudadano',
        data: {
          dni,
          nombre,
          apellido,
          email,
          fecha_nacimiento,
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
