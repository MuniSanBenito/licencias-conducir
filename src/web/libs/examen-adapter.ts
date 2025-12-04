/**
 * Adaptadores para convertir tipos de Payload a tipos del cliente
 */

import type { Consigna, Examen as ExamenPayload } from '@/payload-types'

// Tipos del cliente (igual que en el mock)
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

export interface ExamenCliente {
  id: string
  dni: string
  titulo: string
  categorias: string[]
  consignas: ConsignaCliente[]
  finalizado: boolean
  fechaCreacion: string
}

/**
 * Convierte una consigna de Payload a formato cliente
 */
export function adaptarConsigna(consigna: Consigna): ConsignaCliente {
  const opciones: OpcionCliente[] = []

  if (consigna.opciones) {
    for (const opcionGroup of consigna.opciones) {
      if (!opcionGroup.opcion) continue

      const bloqueContenido = opcionGroup.opcion[0]
      if (!bloqueContenido) continue

      let contenido: Opcion

      if (bloqueContenido.blockType === 'texto') {
        contenido = {
          tipo: 'texto',
          texto: bloqueContenido.texto,
        }
      } else if (bloqueContenido.blockType === 'imagen') {
        const imagen = bloqueContenido.imagen
        const url = typeof imagen === 'string' ? imagen : imagen.url || ''
        contenido = {
          tipo: 'imagen',
          url,
        }
      } else {
        continue
      }

      opciones.push({
        id: opcionGroup.id || `opcion-${opciones.length}`,
        contenido,
      })
    }
  }

  return {
    id: consigna.id,
    pregunta: consigna.pregunta,
    opciones,
    eliminatoria: consigna.eliminatoria,
  }
}

/**
 * Convierte un examen de Payload a formato cliente
 */
export function adaptarExamen(examenPayload: ExamenPayload, dni: string): ExamenCliente {
  // Extraer consignas (pueden ser IDs o objetos completos con depth)
  const consignas: ConsignaCliente[] = []

  if (examenPayload.consignas) {
    for (const consigna of examenPayload.consignas) {
      // Si es un objeto completo (depth > 0)
      if (typeof consigna === 'object') {
        consignas.push(adaptarConsigna(consigna))
      }
      // Si es solo un ID, no podemos hacer nada aquí (necesitaríamos depth)
    }
  }

  return {
    id: examenPayload.id,
    dni,
    titulo: examenPayload.titulo || `Examen - Categorías ${examenPayload.categorias.join(', ')}`,
    categorias: examenPayload.categorias,
    consignas,
    finalizado: examenPayload.finalizado || false,
    fechaCreacion: examenPayload.createdAt,
  }
}
