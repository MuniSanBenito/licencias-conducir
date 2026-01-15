'use server'

import type { Ciudadano, Tramite, TramiteProceso, TramiteProgreso, Turno } from '@/payload-types'
import type { Res } from '@/types'
import { basePayload } from '@/web/libs/payload'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

// --- Auth ---

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('payload-token')
  redirect('/admin/login')
}

// --- Ciudadano ---

export async function getCiudadanos(): Promise<Res<Ciudadano[]>> {
  try {
    const result = await basePayload.find({
      collection: 'ciudadano',
      limit: 100,
      depth: 0,
      sort: '-createdAt',
    })
    return { ok: true, data: result.docs, message: 'Ciudadanos obtenidos' }
  } catch (error) {
    return {
      ok: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al obtener ciudadanos',
    }
  }
}

export async function createCiudadano(
  data: Omit<Ciudadano, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<Res<Ciudadano>> {
  try {
    const result = await basePayload.create({
      collection: 'ciudadano',
      data,
    })
    revalidatePath('/(frontend)/(protected)', 'page')
    return { ok: true, data: result, message: 'Ciudadano creado' }
  } catch (error) {
    return {
      ok: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al crear ciudadano',
    }
  }
}

export async function updateCiudadano(
  id: string | number,
  data: Partial<Ciudadano>,
): Promise<Res<Ciudadano>> {
  try {
    const result = await basePayload.update({
      collection: 'ciudadano',
      id,
      data,
    })
    revalidatePath('/(frontend)/(protected)', 'page')
    return { ok: true, data: result, message: 'Ciudadano actualizado' }
  } catch (error) {
    return {
      ok: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al actualizar ciudadano',
    }
  }
}

export async function deleteCiudadano(id: string | number): Promise<Res<Ciudadano>> {
  try {
    const result = await basePayload.delete({
      collection: 'ciudadano',
      id,
    })
    revalidatePath('/(frontend)/(protected)', 'page')
    return { ok: true, data: result, message: 'Ciudadano eliminado' }
  } catch (error) {
    return {
      ok: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al eliminar ciudadano',
    }
  }
}

// --- Tramite ---

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

// --- Tramite Proceso ---

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

// --- Turno ---

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
