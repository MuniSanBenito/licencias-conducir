'use server'

import type { Tramite, TramiteProceso, TramiteProgreso } from '@/payload-types'
import type { Res } from '@/types'
import { basePayload } from '@/web/libs/payload'
import { revalidatePath } from 'next/cache'

export async function getTramites(): Promise<Res<Tramite[]>> {
  try {
    const result = await basePayload.find({
      collection: 'tramite',
      limit: 100,
      depth: 1, // Depth to show relations like Ciudadano
      sort: '-createdAt',
    })
    return { ok: true, data: result.docs, message: 'Tramites obtenidos' }
  } catch (error) {
    return { ok: false, data: null, message: 'Error al obtener tramites' }
  }
}

export async function createTramite(data: any): Promise<Res<Tramite>> {
  try {
    const result = await basePayload.create({
      collection: 'tramite',
      data,
    })
    revalidatePath('/(frontend)/(protected)', 'page')
    return { ok: true, data: result, message: 'Tramite creado' }
  } catch (error) {
    return {
      ok: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al crear tramite',
    }
  }
}

export async function updateTramite(id: string | number, data: any): Promise<Res<Tramite>> {
  try {
    const result = await basePayload.update({
      collection: 'tramite',
      id,
      data,
    })
    revalidatePath('/(frontend)/(protected)', 'page')
    return { ok: true, data: result, message: 'Tramite actualizado' }
  } catch (error) {
    return {
      ok: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al actualizar tramite',
    }
  }
}

export async function deleteTramite(id: string | number): Promise<Res<Tramite>> {
  try {
    const result = await basePayload.delete({
      collection: 'tramite',
      id,
    })
    revalidatePath('/(frontend)/(protected)', 'page')
    return { ok: true, data: result, message: 'Tramite eliminado' }
  } catch (error) {
    return {
      ok: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al eliminar tramite',
    }
  }
}

export async function getTramiteProcesos(): Promise<Res<TramiteProceso[]>> {
  try {
    const result = await basePayload.find({
      collection: 'tramite-proceso',
      limit: 100,
      depth: 2, // Increased to 2 to get Citizen from Tramite
      sort: '-createdAt',
    })
    return { ok: true, data: result.docs, message: 'Tramite Procesos obtenidos' }
  } catch (error) {
    return { ok: false, data: null, message: 'Error al obtener tramite procesos' }
  }
}

export async function createTramiteProceso(data: any): Promise<Res<TramiteProceso>> {
  try {
    const result = await basePayload.create({
      collection: 'tramite-proceso',
      data,
    })
    revalidatePath('/(frontend)/(protected)', 'page')
    return { ok: true, data: result, message: 'Tramite Proceso creado' }
  } catch (error) {
    return {
      ok: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al crear tramite proceso',
    }
  }
}

export async function updateTramiteProceso(
  id: string | number,
  data: any,
): Promise<Res<TramiteProceso>> {
  try {
    const result = await basePayload.update({
      collection: 'tramite-proceso',
      id,
      data,
    })
    revalidatePath('/(frontend)/(protected)', 'page')
    return { ok: true, data: result, message: 'Tramite Proceso actualizado' }
  } catch (error) {
    return {
      ok: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al actualizar tramite proceso',
    }
  }
}

export async function deleteTramiteProceso(id: string | number): Promise<Res<TramiteProceso>> {
  try {
    const result = await basePayload.delete({
      collection: 'tramite-proceso',
      id,
    })
    revalidatePath('/(frontend)/(protected)', 'page')
    return { ok: true, data: result, message: 'Tramite Proceso eliminado' }
  } catch (error) {
    return {
      ok: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al eliminar tramite proceso',
    }
  }
}

// --- Tramite Progreso ---

export async function getTramiteProgresos(): Promise<Res<TramiteProgreso[]>> {
  try {
    const result = await basePayload.find({
      collection: 'tramite-progreso',
      limit: 100,
      depth: 3, // Increased to 3 to get Citizen from Tramite (Progreso->Proceso->Tramite->Ciudadano)
      sort: '-createdAt',
    })
    return { ok: true, data: result.docs, message: 'Tramite Progresos obtenidos' }
  } catch (error) {
    return { ok: false, data: null, message: 'Error al obtener tramite progresos' }
  }
}

export async function createTramiteProgreso(data: any): Promise<Res<TramiteProgreso>> {
  try {
    const result = await basePayload.create({
      collection: 'tramite-progreso',
      data,
    })
    revalidatePath('/(frontend)/(protected)', 'page')
    return { ok: true, data: result, message: 'Tramite Progreso creado' }
  } catch (error) {
    return {
      ok: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al crear tramite progreso',
    }
  }
}

export async function updateTramiteProgreso(
  id: string | number,
  data: any,
): Promise<Res<TramiteProgreso>> {
  try {
    const result = await basePayload.update({
      collection: 'tramite-progreso',
      id,
      data,
    })
    revalidatePath('/(frontend)/(protected)', 'page')
    return { ok: true, data: result, message: 'Tramite Progreso actualizado' }
  } catch (error) {
    return {
      ok: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al actualizar tramite progreso',
    }
  }
}

export async function deleteTramiteProgreso(id: string | number): Promise<Res<TramiteProgreso>> {
  try {
    const result = await basePayload.delete({
      collection: 'tramite-progreso',
      id,
    })
    revalidatePath('/(frontend)/(protected)', 'page')
    return { ok: true, data: result, message: 'Tramite Progreso eliminado' }
  } catch (error) {
    return {
      ok: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al eliminar tramite progreso',
    }
  }
}
