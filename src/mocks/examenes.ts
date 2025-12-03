/**
 * Tipos para el examen - Cliente
 */
export interface OpcionTexto {
  tipo: 'texto'
  texto: string
}

export interface OpcionImagen {
  tipo: 'imagen'
  url: string
}

export type Opcion = OpcionTexto | OpcionImagen

export interface OpcionCliente {
  id: string
  contenido: Opcion
}

export interface ConsignaCliente {
  id: string
  pregunta: string
  opciones: OpcionCliente[]
  eliminatoria: boolean
}

export interface Examen {
  id: string
  dni: string
  titulo: string
  categorias: string[]
  consignas: ConsignaCliente[]
  finalizado: boolean
  fechaCreacion: string
}

/**
 * Tipos internos del servidor
 */
interface OpcionServidor {
  id: string
  contenido: Opcion
}

interface ConsignaServidor {
  id: string
  pregunta: string
  opciones: OpcionServidor[]
  respuestasCorrectas: number[] // Array de índices de opciones correctas
  eliminatoria: boolean
}

interface ExamenServidor {
  id: string
  dni: string
  titulo: string
  categorias: string[]
  consignas: ConsignaServidor[]
  finalizado: boolean
  fechaCreacion: string
}

/**
 * Datos de exámenes para testing
 */
const EXAMENES_SERVIDOR: ExamenServidor[] = [
  {
    id: '1',
    dni: '12345678',
    titulo: 'Examen de Licencia de Conducir - Categoría A1',
    categorias: ['A1'],
    finalizado: false,
    fechaCreacion: new Date().toISOString(),
    consignas: [
      {
        id: 'c1-1',
        pregunta: '¿Cuál es la velocidad máxima permitida en zona urbana?',
        eliminatoria: false,
        respuestasCorrectas: [0],
        opciones: [
          {
            id: 'opt-1-1',
            contenido: { tipo: 'texto', texto: '40 km/h' },
          },
          {
            id: 'opt-1-2',
            contenido: { tipo: 'texto', texto: '60 km/h' },
          },
          {
            id: 'opt-1-3',
            contenido: { tipo: 'texto', texto: '80 km/h' },
          },
        ],
      },
      {
        id: 'c1-2',
        pregunta: '¿Qué significa esta señal de tránsito?',
        eliminatoria: true,
        respuestasCorrectas: [0],
        opciones: [
          {
            id: 'opt-2-1',
            contenido: {
              tipo: 'imagen',
              url: 'https://placehold.co/400x300/e74c3c/ffffff/png?text=PARE',
            },
          },
          {
            id: 'opt-2-2',
            contenido: {
              tipo: 'imagen',
              url: 'https://placehold.co/400x300/3498db/ffffff/png?text=CEDA+EL+PASO',
            },
          },
          {
            id: 'opt-2-3',
            contenido: {
              tipo: 'imagen',
              url: 'https://placehold.co/400x300/2ecc71/ffffff/png?text=VIA+LIBRE',
            },
          },
        ],
      },
      {
        id: 'c1-3',
        pregunta: '¿Cuándo debe usar las luces del vehículo? (Seleccione todas las correctas)',
        eliminatoria: false,
        respuestasCorrectas: [0, 1], // Múltiples respuestas correctas
        opciones: [
          {
            id: 'opt-3-1',
            contenido: { tipo: 'texto', texto: 'Durante todo el día y la noche' },
          },
          {
            id: 'opt-3-2',
            contenido: { tipo: 'texto', texto: 'Cuando hay mal clima' },
          },
          {
            id: 'opt-3-3',
            contenido: { tipo: 'texto', texto: 'Solo de noche' },
          },
        ],
      },
      {
        id: 'c1-4',
        pregunta: 'Identifique la señal de "Prohibido estacionar"',
        eliminatoria: false,
        respuestasCorrectas: [0],
        opciones: [
          {
            id: 'opt-4-1',
            contenido: {
              tipo: 'imagen',
              url: 'https://placehold.co/400x300/9b59b6/ffffff/png?text=E',
            },
          },
          {
            id: 'opt-4-2',
            contenido: {
              tipo: 'imagen',
              url: 'https://placehold.co/400x300/e74c3c/ffffff/png?text=P+con+linea',
            },
          },
          {
            id: 'opt-4-3',
            contenido: {
              tipo: 'imagen',
              url: 'https://placehold.co/400x300/3498db/ffffff/png?text=H',
            },
          },
        ],
      },
      {
        id: 'c1-5',
        pregunta: '¿Qué debe hacer ante un semáforo en amarillo?',
        eliminatoria: true,
        respuestasCorrectas: [0],
        opciones: [
          {
            id: 'opt-5-1',
            contenido: { tipo: 'texto', texto: 'Acelerar para pasar rápido' },
          },
          {
            id: 'opt-5-2',
            contenido: { tipo: 'texto', texto: 'Detenerse si es posible hacerlo con seguridad' },
          },
          {
            id: 'opt-5-3',
            contenido: { tipo: 'texto', texto: 'Mantener la velocidad' },
          },
        ],
      },
      {
        id: 'c1-6',
        pregunta: '¿Cuál es la distancia mínima de seguimiento en moto?',
        eliminatoria: false,
        respuestasCorrectas: [0],
        opciones: [
          {
            id: 'opt-6-1',
            contenido: { tipo: 'texto', texto: '1 segundo' },
          },
          {
            id: 'opt-6-2',
            contenido: { tipo: 'texto', texto: '2 segundos' },
          },
          {
            id: 'opt-6-3',
            contenido: { tipo: 'texto', texto: '5 segundos' },
          },
        ],
      },
      {
        id: 'c1-7',
        pregunta: 'Identifique la señal de "Curva peligrosa"',
        eliminatoria: false,
        respuestasCorrectas: [0],
        opciones: [
          {
            id: 'opt-7-1',
            contenido: {
              tipo: 'imagen',
              url: 'https://placehold.co/400x300/f39c12/000000/png?text=Flecha+curva',
            },
          },
          {
            id: 'opt-7-2',
            contenido: {
              tipo: 'imagen',
              url: 'https://placehold.co/400x300/f39c12/000000/png?text=Flecha+recta',
            },
          },
          {
            id: 'opt-7-3',
            contenido: {
              tipo: 'imagen',
              url: 'https://placehold.co/400x300/e74c3c/ffffff/png?text=STOP',
            },
          },
        ],
      },
      {
        id: 'c1-8',
        pregunta: '¿Qué elementos de seguridad son obligatorios en motocicleta? (Seleccione todas)',
        eliminatoria: true,
        respuestasCorrectas: [0, 1], // Múltiples respuestas correctas eliminatoria
        opciones: [
          {
            id: 'opt-8-1',
            contenido: { tipo: 'texto', texto: 'Casco homologado' },
          },
          {
            id: 'opt-8-2',
            contenido: { tipo: 'texto', texto: 'Chaleco reflectivo' },
          },
          {
            id: 'opt-8-3',
            contenido: { tipo: 'texto', texto: 'Guantes de cuero' },
          },
        ],
      },
      {
        id: 'c1-9',
        pregunta: '¿Qué indica esta señal?',
        eliminatoria: false,
        respuestasCorrectas: [0],
        opciones: [
          {
            id: 'opt-9-1',
            contenido: {
              tipo: 'imagen',
              url: 'https://placehold.co/400x300/27ae60/ffffff/png?text=Hospital',
            },
          },
          {
            id: 'opt-9-2',
            contenido: {
              tipo: 'imagen',
              url: 'https://placehold.co/400x300/3498db/ffffff/png?text=Escuela',
            },
          },
          {
            id: 'opt-9-3',
            contenido: {
              tipo: 'imagen',
              url: 'https://placehold.co/400x300/9b59b6/ffffff/png?text=Estacion',
            },
          },
        ],
      },
      {
        id: 'c1-10',
        pregunta: '¿Cuál es la tasa máxima de alcohol en sangre permitida?',
        eliminatoria: true,
        respuestasCorrectas: [0],
        opciones: [
          {
            id: 'opt-10-1',
            contenido: { tipo: 'texto', texto: '0 g/l (cero alcohol)' },
          },
          {
            id: 'opt-10-2',
            contenido: { tipo: 'texto', texto: '0.5 g/l' },
          },
          {
            id: 'opt-10-3',
            contenido: { tipo: 'texto', texto: '1.0 g/l' },
          },
        ],
      },
    ],
  },
  {
    id: '2',
    dni: '23456789',
    titulo: 'Examen de Licencia de Conducir - Categoría B1',
    categorias: ['B1'],
    finalizado: false,
    fechaCreacion: new Date().toISOString(),
    consignas: [
      {
        id: 'c2-1',
        pregunta: '¿A qué distancia debe colocar la baliza en caso de detención?',
        eliminatoria: false,
        respuestasCorrectas: [0],
        opciones: [
          {
            id: 'opt-11-1',
            contenido: { tipo: 'texto', texto: '10 metros' },
          },
          {
            id: 'opt-11-2',
            contenido: { tipo: 'texto', texto: '30 metros' },
          },
          {
            id: 'opt-11-3',
            contenido: { tipo: 'texto', texto: '50 metros' },
          },
        ],
      },
      {
        id: 'c2-2',
        pregunta: 'Identifique la señal de "Rotonda"',
        eliminatoria: false,
        respuestasCorrectas: [0],
        opciones: [
          {
            id: 'opt-12-1',
            contenido: {
              tipo: 'imagen',
              url: 'https://placehold.co/400x300/3498db/ffffff/png?text=Circulos',
            },
          },
          {
            id: 'opt-12-2',
            contenido: {
              tipo: 'imagen',
              url: 'https://placehold.co/400x300/e74c3c/ffffff/png?text=Cuadrado',
            },
          },
          {
            id: 'opt-12-3',
            contenido: {
              tipo: 'imagen',
              url: 'https://placehold.co/400x300/f39c12/000000/png?text=Triangulo',
            },
          },
        ],
      },
      {
        id: 'c2-3',
        pregunta:
          '¿Qué situaciones prohíben el uso del celular al conducir? (Seleccione todas las correctas)',
        eliminatoria: true,
        respuestasCorrectas: [0],
        opciones: [
          {
            id: 'opt-13-1',
            contenido: { tipo: 'texto', texto: 'Conduciendo en ciudad' },
          },
          {
            id: 'opt-13-2',
            contenido: { tipo: 'texto', texto: 'Conduciendo en ruta' },
          },
          {
            id: 'opt-13-3',
            contenido: { tipo: 'texto', texto: 'Con el vehículo detenido y motor apagado' },
          },
        ],
      },
      {
        id: 'c2-4',
        pregunta: '¿Qué significa esta señal?',
        eliminatoria: false,
        respuestasCorrectas: [1],
        opciones: [
          {
            id: 'opt-14-1',
            contenido: {
              tipo: 'imagen',
              url: 'https://placehold.co/400x300/27ae60/ffffff/png?text=Avanzar',
            },
          },
          {
            id: 'opt-14-2',
            contenido: {
              tipo: 'imagen',
              url: 'https://placehold.co/400x300/e74c3c/ffffff/png?text=Detenerse',
            },
          },
          {
            id: 'opt-14-3',
            contenido: {
              tipo: 'imagen',
              url: 'https://placehold.co/400x300/f39c12/000000/png?text=Precaucion',
            },
          },
        ],
      },
      {
        id: 'c2-5',
        pregunta:
          '¿Cuáles son elementos obligatorios en el vehículo? (Seleccione todas las correctas)',
        eliminatoria: false,
        respuestasCorrectas: [0, 1],
        opciones: [
          {
            id: 'opt-15-1',
            contenido: { tipo: 'texto', texto: 'Matafuegos' },
          },
          {
            id: 'opt-15-2',
            contenido: { tipo: 'texto', texto: 'Balizas' },
          },
          {
            id: 'opt-15-3',
            contenido: { tipo: 'texto', texto: 'GPS' },
          },
        ],
      },
      {
        id: 'c2-6',
        pregunta: '¿Es obligatorio el uso del cinturón de seguridad?',
        eliminatoria: true,
        respuestasCorrectas: [0],
        opciones: [
          {
            id: 'opt-16-1',
            contenido: { tipo: 'texto', texto: 'Sí, siempre' },
          },
          {
            id: 'opt-16-2',
            contenido: { tipo: 'texto', texto: 'Solo en ruta' },
          },
          {
            id: 'opt-16-3',
            contenido: { tipo: 'texto', texto: 'Solo en ciudad' },
          },
        ],
      },
      {
        id: 'c2-7',
        pregunta: 'Identifique la señal de "Ceda el paso"',
        eliminatoria: true,
        respuestasCorrectas: [1],
        opciones: [
          {
            id: 'opt-17-1',
            contenido: {
              tipo: 'imagen',
              url: 'https://placehold.co/400x300/e74c3c/ffffff/png?text=Octogono',
            },
          },
          {
            id: 'opt-17-2',
            contenido: {
              tipo: 'imagen',
              url: 'https://placehold.co/400x300/e74c3c/ffffff/png?text=Triangulo+invertido',
            },
          },
          {
            id: 'opt-17-3',
            contenido: {
              tipo: 'imagen',
              url: 'https://placehold.co/400x300/3498db/ffffff/png?text=Circulo',
            },
          },
        ],
      },
      {
        id: 'c2-8',
        pregunta: '¿Qué debe hacer ante un paso peatonal?',
        eliminatoria: true,
        respuestasCorrectas: [1],
        opciones: [
          {
            id: 'opt-18-1',
            contenido: { tipo: 'texto', texto: 'Acelerar para pasar antes' },
          },
          {
            id: 'opt-18-2',
            contenido: { tipo: 'texto', texto: 'Reducir velocidad y ceder el paso' },
          },
          {
            id: 'opt-18-3',
            contenido: { tipo: 'texto', texto: 'Tocar bocina' },
          },
        ],
      },
      {
        id: 'c2-9',
        pregunta: '¿Cuál es la señal de "Doble circulación"?',
        eliminatoria: false,
        respuestasCorrectas: [0],
        opciones: [
          {
            id: 'opt-19-1',
            contenido: {
              tipo: 'imagen',
              url: 'https://placehold.co/400x300/f39c12/000000/png?text=Flechas+opuestas',
            },
          },
          {
            id: 'opt-19-2',
            contenido: {
              tipo: 'imagen',
              url: 'https://placehold.co/400x300/27ae60/ffffff/png?text=Flecha+simple',
            },
          },
          {
            id: 'opt-19-3',
            contenido: {
              tipo: 'imagen',
              url: 'https://placehold.co/400x300/e74c3c/ffffff/png?text=Sin+flechas',
            },
          },
        ],
      },
      {
        id: 'c2-10',
        pregunta: '¿Puede adelantar en una curva?',
        eliminatoria: true,
        respuestasCorrectas: [2],
        opciones: [
          {
            id: 'opt-20-1',
            contenido: { tipo: 'texto', texto: 'Sí, con precaución' },
          },
          {
            id: 'opt-20-2',
            contenido: { tipo: 'texto', texto: 'Sí, si no viene nadie' },
          },
          {
            id: 'opt-20-3',
            contenido: { tipo: 'texto', texto: 'No, nunca' },
          },
        ],
      },
    ],
  },
  {
    id: '3',
    dni: '34567890',
    titulo: 'Examen de Licencia de Conducir - Categorías A2, B2',
    categorias: ['A2', 'B2'],
    finalizado: false,
    fechaCreacion: new Date().toISOString(),
    consignas: [
      {
        id: 'c3-1',
        pregunta: '¿Qué indica la luz amarilla intermitente en un semáforo?',
        eliminatoria: false,
        respuestasCorrectas: [0],
        opciones: [
          {
            id: 'opt-21-1',
            contenido: { tipo: 'texto', texto: 'Precaución, cruce con cuidado' },
          },
          {
            id: 'opt-21-2',
            contenido: { tipo: 'texto', texto: 'Detenerse obligatoriamente' },
          },
          {
            id: 'opt-21-3',
            contenido: { tipo: 'texto', texto: 'Acelerar para pasar' },
          },
        ],
      },
      {
        id: 'c3-2',
        pregunta: '¿Cuál es la señal de "Zona escolar"?',
        eliminatoria: false,
        respuestasCorrectas: [1],
        opciones: [
          {
            id: 'opt-22-1',
            contenido: {
              tipo: 'imagen',
              url: 'https://placehold.co/400x300/e74c3c/ffffff/png?text=Hospital',
            },
          },
          {
            id: 'opt-22-2',
            contenido: {
              tipo: 'imagen',
              url: 'https://placehold.co/400x300/f39c12/000000/png?text=Ninos+cruzando',
            },
          },
          {
            id: 'opt-22-3',
            contenido: {
              tipo: 'imagen',
              url: 'https://placehold.co/400x300/27ae60/ffffff/png?text=Parque',
            },
          },
        ],
      },
      {
        id: 'c3-3',
        pregunta: '¿Puede estacionar en doble fila?',
        eliminatoria: false,
        respuestasCorrectas: [2],
        opciones: [
          {
            id: 'opt-23-1',
            contenido: { tipo: 'texto', texto: 'Sí, por 5 minutos' },
          },
          {
            id: 'opt-23-2',
            contenido: { tipo: 'texto', texto: 'Sí, con balizas' },
          },
          {
            id: 'opt-23-3',
            contenido: { tipo: 'texto', texto: 'No, está prohibido' },
          },
        ],
      },
      {
        id: 'c3-4',
        pregunta: 'Identifique la señal de "Puente angosto"',
        eliminatoria: false,
        respuestasCorrectas: [0],
        opciones: [
          {
            id: 'opt-24-1',
            contenido: {
              tipo: 'imagen',
              url: 'https://placehold.co/400x300/f39c12/000000/png?text=Puente+estrecho',
            },
          },
          {
            id: 'opt-24-2',
            contenido: {
              tipo: 'imagen',
              url: 'https://placehold.co/400x300/3498db/ffffff/png?text=Puente+ancho',
            },
          },
          {
            id: 'opt-24-3',
            contenido: {
              tipo: 'imagen',
              url: 'https://placehold.co/400x300/27ae60/ffffff/png?text=Tunel',
            },
          },
        ],
      },
      {
        id: 'c3-5',
        pregunta: '¿Qué debe hacer si lo encandila un vehículo que viene de frente?',
        eliminatoria: false,
        respuestasCorrectas: [1],
        opciones: [
          {
            id: 'opt-25-1',
            contenido: { tipo: 'texto', texto: 'Encender las luces altas' },
          },
          {
            id: 'opt-25-2',
            contenido: { tipo: 'texto', texto: 'Mirar al borde derecho y reducir velocidad' },
          },
          {
            id: 'opt-25-3',
            contenido: { tipo: 'texto', texto: 'Cerrar los ojos brevemente' },
          },
        ],
      },
      {
        id: 'c3-6',
        pregunta:
          '¿Qué acciones son correctas antes de adelantar? (Seleccione todas las correctas)',
        eliminatoria: false,
        respuestasCorrectas: [0, 1],
        opciones: [
          {
            id: 'opt-26-1',
            contenido: { tipo: 'texto', texto: 'Verificar que haya visibilidad suficiente' },
          },
          {
            id: 'opt-26-2',
            contenido: { tipo: 'texto', texto: 'Señalizar la maniobra' },
          },
          {
            id: 'opt-26-3',
            contenido: { tipo: 'texto', texto: 'Tocar bocina continuamente' },
          },
        ],
      },
      {
        id: 'c3-7',
        pregunta: '¿Qué indica esta señal?',
        eliminatoria: false,
        respuestasCorrectas: [2],
        opciones: [
          {
            id: 'opt-27-1',
            contenido: {
              tipo: 'imagen',
              url: 'https://placehold.co/400x300/27ae60/ffffff/png?text=Via+libre',
            },
          },
          {
            id: 'opt-27-2',
            contenido: {
              tipo: 'imagen',
              url: 'https://placehold.co/400x300/e74c3c/ffffff/png?text=Peligro',
            },
          },
          {
            id: 'opt-27-3',
            contenido: {
              tipo: 'imagen',
              url: 'https://placehold.co/400x300/3498db/ffffff/png?text=Informativa',
            },
          },
        ],
      },
      {
        id: 'c3-8',
        pregunta: '¿Está permitido circular en moto por la banquina?',
        eliminatoria: true,
        respuestasCorrectas: [2],
        opciones: [
          {
            id: 'opt-28-1',
            contenido: { tipo: 'texto', texto: 'Sí, en caso de emergencia' },
          },
          {
            id: 'opt-28-2',
            contenido: { tipo: 'texto', texto: 'Sí, si hay tráfico' },
          },
          {
            id: 'opt-28-3',
            contenido: { tipo: 'texto', texto: 'No, está prohibido' },
          },
        ],
      },
      {
        id: 'c3-9',
        pregunta: 'Identifique la señal de "Curva y contracurva"',
        eliminatoria: false,
        respuestasCorrectas: [0],
        opciones: [
          {
            id: 'opt-29-1',
            contenido: {
              tipo: 'imagen',
              url: 'https://placehold.co/400x300/f39c12/000000/png?text=S+curvas',
            },
          },
          {
            id: 'opt-29-2',
            contenido: {
              tipo: 'imagen',
              url: 'https://placehold.co/400x300/f39c12/000000/png?text=U+curva',
            },
          },
          {
            id: 'opt-29-3',
            contenido: {
              tipo: 'imagen',
              url: 'https://placehold.co/400x300/f39c12/000000/png?text=Recta',
            },
          },
        ],
      },
      {
        id: 'c3-10',
        pregunta: '¿Debe respetar los límites de velocidad en moto?',
        eliminatoria: true,
        respuestasCorrectas: [0],
        opciones: [
          {
            id: 'opt-30-1',
            contenido: { tipo: 'texto', texto: 'Sí, siempre' },
          },
          {
            id: 'opt-30-2',
            contenido: { tipo: 'texto', texto: 'Solo en ciudad' },
          },
          {
            id: 'opt-30-3',
            contenido: { tipo: 'texto', texto: 'No es obligatorio' },
          },
        ],
      },
    ],
  },
  // Exámenes 4-10 con estructura simplificada (solo datos esenciales)
  {
    id: '4',
    dni: '45678901',
    titulo: 'Examen de Licencia de Conducir - Categoría B3',
    categorias: ['B3'],
    finalizado: false,
    fechaCreacion: new Date().toISOString(),
    consignas: Array.from({ length: 10 }, (_, i) => ({
      id: `c4-${i + 1}`,
      pregunta: `Pregunta ${i + 1} del examen B3`,
      eliminatoria: i % 3 === 0,
      respuestasCorrectas: [1],
      opciones: [
        {
          id: `opt-4${i}-1`,
          contenido: { tipo: 'texto' as const, texto: 'Opción A' },
        },
        {
          id: `opt-4${i}-2`,
          contenido: { tipo: 'texto' as const, texto: 'Opción B (correcta)' },
        },
        {
          id: `opt-4${i}-3`,
          contenido: { tipo: 'texto' as const, texto: 'Opción C' },
        },
      ],
    })),
  },
  {
    id: '5',
    dni: '56789012',
    titulo: 'Examen de Licencia de Conducir - Categoría A3',
    categorias: ['A3'],
    finalizado: false,
    fechaCreacion: new Date().toISOString(),
    consignas: Array.from({ length: 10 }, (_, i) => ({
      id: `c5-${i + 1}`,
      pregunta: `Pregunta ${i + 1} del examen A3`,
      eliminatoria: i % 4 === 0,
      respuestasCorrectas: [0],
      opciones: [
        {
          id: `opt-5${i}-1`,
          contenido: { tipo: 'texto' as const, texto: 'Opción correcta' },
        },
        {
          id: `opt-5${i}-2`,
          contenido: { tipo: 'texto' as const, texto: 'Opción incorrecta' },
        },
        {
          id: `opt-5${i}-3`,
          contenido: { tipo: 'texto' as const, texto: 'Otra opción incorrecta' },
        },
      ],
    })),
  },
  {
    id: '6',
    dni: '67890123',
    titulo: 'Examen de Licencia de Conducir - Categoría B4',
    categorias: ['B4'],
    finalizado: false,
    fechaCreacion: new Date().toISOString(),
    consignas: Array.from({ length: 10 }, (_, i) => ({
      id: `c6-${i + 1}`,
      pregunta: `Pregunta ${i + 1} del examen B4`,
      eliminatoria: i % 2 === 0,
      respuestasCorrectas: [2],
      opciones: [
        {
          id: `opt-6${i}-1`,
          contenido: { tipo: 'texto' as const, texto: 'Primera opción' },
        },
        {
          id: `opt-6${i}-2`,
          contenido: { tipo: 'texto' as const, texto: 'Segunda opción' },
        },
        {
          id: `opt-6${i}-3`,
          contenido: { tipo: 'texto' as const, texto: 'Tercera opción (correcta)' },
        },
      ],
    })),
  },
  {
    id: '7',
    dni: '78901234',
    titulo: 'Examen de Licencia de Conducir - Categorías A1, B1',
    categorias: ['A1', 'B1'],
    finalizado: false,
    fechaCreacion: new Date().toISOString(),
    consignas: Array.from({ length: 10 }, (_, i) => ({
      id: `c7-${i + 1}`,
      pregunta: `Pregunta ${i + 1} del examen A1/B1`,
      eliminatoria: i === 0 || i === 5,
      respuestasCorrectas: [i % 3],
      opciones: [
        {
          id: `opt-7${i}-1`,
          contenido: { tipo: 'texto' as const, texto: 'Opción A' },
        },
        {
          id: `opt-7${i}-2`,
          contenido: { tipo: 'texto' as const, texto: 'Opción B' },
        },
        {
          id: `opt-7${i}-3`,
          contenido: { tipo: 'texto' as const, texto: 'Opción C' },
        },
      ],
    })),
  },
  {
    id: '8',
    dni: '89012345',
    titulo: 'Examen de Licencia de Conducir - Categoría B2 con Imágenes',
    categorias: ['B2'],
    finalizado: false,
    fechaCreacion: new Date().toISOString(),
    consignas: Array.from({ length: 10 }, (_, i) => ({
      id: `c8-${i + 1}`,
      pregunta: `Pregunta ${i + 1} del examen B2 (con señales visuales)`,
      eliminatoria: i % 5 === 0,
      respuestasCorrectas: [0],
      opciones: [
        {
          id: `opt-8${i}-1`,
          contenido: {
            tipo: 'imagen' as const,
            url: `https://placehold.co/400x300/3498db/ffffff/png?text=Imagen+${i + 1}A`,
          },
        },
        {
          id: `opt-8${i}-2`,
          contenido: {
            tipo: 'imagen' as const,
            url: `https://placehold.co/400x300/e74c3c/ffffff/png?text=Imagen+${i + 1}B`,
          },
        },
        {
          id: `opt-8${i}-3`,
          contenido: {
            tipo: 'imagen' as const,
            url: `https://placehold.co/400x300/27ae60/ffffff/png?text=Imagen+${i + 1}C`,
          },
        },
      ],
    })),
  },
  {
    id: '9',
    dni: '90123456',
    titulo: 'Examen de Licencia de Conducir - Categoría A2',
    categorias: ['A2'],
    finalizado: false,
    fechaCreacion: new Date().toISOString(),
    consignas: Array.from({ length: 10 }, (_, i) => ({
      id: `c9-${i + 1}`,
      pregunta: `Pregunta ${i + 1} del examen A2`,
      eliminatoria: i < 3,
      respuestasCorrectas: [1],
      opciones: [
        {
          id: `opt-9${i}-1`,
          contenido: { tipo: 'texto' as const, texto: 'Respuesta incorrecta' },
        },
        {
          id: `opt-9${i}-2`,
          contenido: { tipo: 'texto' as const, texto: 'Respuesta correcta' },
        },
        {
          id: `opt-9${i}-3`,
          contenido: { tipo: 'texto' as const, texto: 'Otra respuesta incorrecta' },
        },
      ],
    })),
  },
  {
    id: '10',
    dni: '11223344',
    titulo: 'Examen de Licencia de Conducir - Todas las Categorías',
    categorias: ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'B4'],
    finalizado: false,
    fechaCreacion: new Date().toISOString(),
    consignas: Array.from({ length: 10 }, (_, i) => ({
      id: `c10-${i + 1}`,
      pregunta: `Pregunta general ${i + 1}`,
      eliminatoria: i === 0 || i === 9,
      respuestasCorrectas: i % 2 === 0 ? [0] : [1],
      opciones:
        i % 2 === 0
          ? [
              {
                id: `opt-10${i}-1`,
                contenido: { tipo: 'texto' as const, texto: 'Opción correcta A' },
              },
              {
                id: `opt-10${i}-2`,
                contenido: { tipo: 'texto' as const, texto: 'Opción incorrecta B' },
              },
              {
                id: `opt-10${i}-3`,
                contenido: { tipo: 'texto' as const, texto: 'Opción incorrecta C' },
              },
            ]
          : [
              {
                id: `opt-10${i}-1`,
                contenido: {
                  tipo: 'imagen' as const,
                  url: `https://placehold.co/400x300/9b59b6/ffffff/png?text=Opcion+${i + 1}A`,
                },
              },
              {
                id: `opt-10${i}-2`,
                contenido: {
                  tipo: 'imagen' as const,
                  url: `https://placehold.co/400x300/1abc9c/ffffff/png?text=Opcion+${i + 1}B`,
                },
              },
              {
                id: `opt-10${i}-3`,
                contenido: {
                  tipo: 'imagen' as const,
                  url: `https://placehold.co/400x300/34495e/ffffff/png?text=Opcion+${i + 1}C`,
                },
              },
            ],
    })),
  },
]

/**
 * Convierte examen a formato público
 */
function examenServidorACliente(examenServidor: ExamenServidor): Examen {
  return {
    ...examenServidor,
    consignas: examenServidor.consignas.map((consigna) => ({
      id: consigna.id,
      pregunta: consigna.pregunta,
      eliminatoria: consigna.eliminatoria,
      opciones: consigna.opciones.map((opcion) => ({
        id: opcion.id,
        contenido: opcion.contenido,
        // NO incluir esCorrecta
      })),
    })),
  }
}

/**
 * Busca examen por DNI
 */
export function buscarExamenPorDNI(dni: string): Examen | undefined {
  const examenServidor = EXAMENES_SERVIDOR.find((examen) => examen.dni === dni)
  if (!examenServidor) return undefined
  return examenServidorACliente(examenServidor)
}

/**
 * Valida respuestas del examen
 */
export function validarRespuestas(
  dni: string,
  respuestas: Record<string, number[]>,
): {
  aprobado: boolean
  correctas: number
  incorrectas: number
  total: number
  eliminatoriasIncorrectas: string[]
  detalles: Array<{
    consignaId: string
    correcta: boolean
    respuestaCorrecta: number[]
    respuestaUsuario: number[]
  }>
} {
  const examenServidor = EXAMENES_SERVIDOR.find((examen) => examen.dni === dni)

  if (!examenServidor) {
    throw new Error(`No se encontró examen para DNI ${dni}`)
  }

  let correctas = 0
  let incorrectas = 0
  const eliminatoriasIncorrectas: string[] = []
  const detalles: Array<{
    consignaId: string
    correcta: boolean
    respuestaCorrecta: number[]
    respuestaUsuario: number[]
  }> = []

  examenServidor.consignas.forEach((consigna) => {
    const respuestaUsuario = respuestas[consigna.id] || []
    const respuestasCorrectas = consigna.respuestasCorrectas

    // Comparar arrays (mismos elementos, sin importar orden)
    const respuestaUsuarioSorted = [...respuestaUsuario].sort((a, b) => a - b)
    const respuestasCorrectasSorted = [...respuestasCorrectas].sort((a, b) => a - b)

    const esCorrecta =
      respuestaUsuarioSorted.length === respuestasCorrectasSorted.length &&
      respuestaUsuarioSorted.every((val, idx) => val === respuestasCorrectasSorted[idx])

    if (esCorrecta) {
      correctas++
    } else {
      incorrectas++
      if (consigna.eliminatoria) {
        eliminatoriasIncorrectas.push(consigna.id)
      }
    }

    detalles.push({
      consignaId: consigna.id,
      correcta: esCorrecta,
      respuestaCorrecta: respuestasCorrectas,
      respuestaUsuario: respuestaUsuario,
    })
  })

  const total = examenServidor.consignas.length
  // Aprobar si: 90% correcto Y sin fallar eliminatorias
  const porcentaje = (correctas / total) * 100
  const aprobado = porcentaje >= 90 && eliminatoriasIncorrectas.length === 0

  return {
    aprobado,
    correctas,
    incorrectas,
    total,
    eliminatoriasIncorrectas,
    detalles,
  }
}
