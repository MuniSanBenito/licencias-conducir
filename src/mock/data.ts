import { getPasosParaTramite, type Ciudadano, type PasoTramite, type Tramite } from '@/types'

// ─── Ciudadanos de ejemplo ───

export const CIUDADANOS_MOCK: Ciudadano[] = [
  {
    dni: '30456789',
    nombre: 'Carlos',
    apellido: 'Gómez',
    celular: '3436401234',
    fechaNacimiento: '1990-05-12',
    domicilio: 'Av. San Martín 450, San Benito',
  },
  {
    dni: '28123456',
    nombre: 'María',
    apellido: 'López',
    celular: '3436405678',
    fechaNacimiento: '1985-11-23',
    domicilio: 'Calle 9 de Julio 120, San Benito',
  },
  {
    dni: '35789012',
    nombre: 'Juan',
    apellido: 'Martínez',
    celular: '3436409012',
    fechaNacimiento: '1998-02-08',
    domicilio: 'Bv. Yrigoyen 890, San Benito',
  },
  {
    dni: '32654321',
    nombre: 'Laura',
    apellido: 'Fernández',
    celular: '3436403456',
    fechaNacimiento: '1992-07-30',
    domicilio: 'Calle Belgrano 315, San Benito',
  },
  {
    dni: '40112233',
    nombre: 'Diego',
    apellido: 'Ramírez',
    celular: '3436407890',
    fechaNacimiento: '2001-01-15',
    domicilio: 'Pasaje Sarmiento 55, San Benito',
  },
]

// ─── Helper para avanzar pasos ───

function avanzarPasos(pasos: PasoTramite[], cantidad: number): PasoTramite[] {
  return pasos.map((paso, i) => {
    if (i < cantidad) {
      const completado: PasoTramite = {
        ...paso,
        estado: 'completado' as const,
        fecha: '2026-03-0' + (i + 1),
      }
      // Si requiere turno y ya se completó, agregar turno completado
      if (paso.requiereTurno) {
        completado.turno = {
          fecha: '2026-03-0' + (i + 1),
          hora: `${8 + (i % 4)}:00`,
          estado: 'completado',
        }
      }
      return completado
    }
    if (i === cantidad) {
      const enCurso: PasoTramite = { ...paso, estado: 'en_curso' as const }
      // Si el paso en curso requiere turno, asignar uno programado
      if (paso.requiereTurno) {
        enCurso.turno = {
          fecha: '2026-03-15',
          hora: '10:00',
          estado: 'programado',
        }
      }
      return enCurso
    }
    return paso
  })
}

// ─── Trámites de ejemplo ───

// Trámite 1: Licencia nueva B1 - en paso de pago (paso 3)
const pasosTramite1 = getPasosParaTramite([{ clase: 'B1', tipo: 'nueva' }])

// Trámite 2: Renovación B1 + Nueva C1 (mix) - en examen psicofísico
const pasosTramite2 = getPasosParaTramite([
  { clase: 'B1', tipo: 'renovacion' },
  { clase: 'C1', tipo: 'nueva' },
])

// Trámite 3: Renovación B1 solamente - en revisión licencias (tiene menos pasos)
const pasosTramite3 = getPasosParaTramite([{ clase: 'B1', tipo: 'renovacion' }])

// Trámite 4: Ampliación D1 - completado
const pasosTramite4 = getPasosParaTramite([{ clase: 'D1', tipo: 'ampliacion' }])

// Trámite 5: Licencia nueva A1 - recién iniciado (mesa de entradas)
const pasosTramite5 = getPasosParaTramite([{ clase: 'A1', tipo: 'nueva' }])

export const TRAMITES_MOCK: Tramite[] = [
  {
    id: 'TRM-2026-001',
    fut: 'FUT-10482',
    ciudadano: CIUDADANOS_MOCK[0],
    items: [{ clase: 'B1', tipo: 'nueva' }],
    pasos: avanzarPasos(pasosTramite1, 2),
    estado: 'en_curso',
    fechaInicio: '2026-03-01',
  },
  {
    id: 'TRM-2026-002',
    fut: 'FUT-10391',
    ciudadano: CIUDADANOS_MOCK[1],
    items: [
      { clase: 'B1', tipo: 'renovacion' },
      { clase: 'C1', tipo: 'nueva' },
    ],
    pasos: avanzarPasos(pasosTramite2, 7),
    estado: 'en_curso',
    fechaInicio: '2026-02-15',
  },
  {
    id: 'TRM-2026-003',
    fut: 'FUT-10520',
    ciudadano: CIUDADANOS_MOCK[2],
    items: [{ clase: 'B1', tipo: 'renovacion' }],
    pasos: avanzarPasos(pasosTramite3, 3),
    estado: 'en_curso',
    fechaInicio: '2026-03-05',
  },
  {
    id: 'TRM-2026-004',
    fut: 'FUT-10215',
    ciudadano: CIUDADANOS_MOCK[3],
    items: [{ clase: 'D1', tipo: 'ampliacion' }],
    pasos: avanzarPasos(pasosTramite4, pasosTramite4.length),
    estado: 'completado',
    fechaInicio: '2026-01-20',
    fechaFin: '2026-02-28',
  },
  {
    id: 'TRM-2026-005',
    fut: 'FUT-10587',
    ciudadano: CIUDADANOS_MOCK[4],
    items: [{ clase: 'A1', tipo: 'nueva' }],
    pasos: avanzarPasos(pasosTramite5, 0),
    estado: 'en_curso',
    fechaInicio: '2026-03-09',
  },
]
