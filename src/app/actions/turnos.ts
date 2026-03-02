'use server'

import type { Turno } from '@/payload-types'
import type { Res } from '@/types'
import { basePayload } from '@/web/libs/payload/server'
import { revalidatePath } from 'next/cache'

export async function getTurnos(): Promise<Res<Turno[]>> {
  try {
    const result = await basePayload.find({
      collection: 'turno',
      limit: 100,
      depth: 4, // Increased to 4 to get Citizen from Turno (Turno->Progreso->Proceso->Tramite->Ciudadano)
      sort: '-createdAt',
    })
    return { ok: true, data: result.docs, message: 'Turnos obtenidos' }
  } catch (error) {
    return { ok: false, data: null, message: 'Error al obtener turnos' }
  }
}

export async function createTurno(data: any): Promise<Res<Turno>> {
  try {
    const result = await basePayload.create({
      collection: 'turno',
      data,
    })
    revalidatePath('/(frontend)/(protected)', 'page')
    return { ok: true, data: result, message: 'Turno creado' }
  } catch (error) {
    return {
      ok: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al crear turno',
    }
  }
}

export async function updateTurno(id: string | number, data: any): Promise<Res<Turno>> {
  try {
    const result = await basePayload.update({
      collection: 'turno',
      id,
      data,
    })
    revalidatePath('/(frontend)/(protected)', 'page')
    return { ok: true, data: result, message: 'Turno actualizado' }
  } catch (error) {
    return {
      ok: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al actualizar turno',
    }
  }
}

export async function deleteTurno(id: string | number): Promise<Res<Turno>> {
  try {
    const result = await basePayload.delete({
      collection: 'turno',
      id,
    })
    revalidatePath('/(frontend)/(protected)', 'page')
    return { ok: true, data: result, message: 'Turno eliminado' }
  } catch (error) {
    return {
      ok: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al eliminar turno',
    }
  }
}
