'use server'

import type { Ciudadano } from '@/payload-types'
import type { Res } from '@/types'
import { basePayload } from '@/web/libs/payload'
import { revalidatePath } from 'next/cache'

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
