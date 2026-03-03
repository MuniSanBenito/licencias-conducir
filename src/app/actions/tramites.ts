'use server'

import type { Tramite, TramiteProceso, TramiteProgreso } from '@/payload-types'
import type { Res } from '@/types'
import { basePayload } from '@/web/libs/payload/server'
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

interface CreateTramiteData {
  ciudadano: string
  fut?: string
  procesos: TramiteProceso['proceso'][]
}

export async function createTramite(data: CreateTramiteData): Promise<Res<Tramite>> {
  try {
    const { procesos, ...tramiteData } = data

    const result = await basePayload.create({
      collection: 'tramite',
      data: tramiteData,
    })

    // Crear un tramite-proceso por cada proceso seleccionado
    await Promise.all(
      procesos.map((proceso) =>
        basePayload.create({
          collection: 'tramite-proceso',
          data: { tramite: result.id, proceso },
        }),
      ),
    )

    revalidatePath('/(frontend)/(protected)', 'page')
    return { ok: true, data: result, message: 'Trámite creado' }
  } catch (error) {
    return {
      ok: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al crear trámite',
    }
  }
}

interface UpdateTramiteData {
  ciudadano: string
  fut?: string
  procesos: TramiteProceso['proceso'][]
}

export async function updateTramite(
  id: string | number,
  data: UpdateTramiteData,
): Promise<Res<Tramite>> {
  try {
    const { procesos: newProcesos, ...tramiteData } = data

    const result = await basePayload.update({
      collection: 'tramite',
      id,
      data: tramiteData,
    })

    // Obtener los tramite-proceso existentes
    const existing = await basePayload.find({
      collection: 'tramite-proceso',
      where: { tramite: { equals: id } },
      limit: 100,
    })

    const existingProcesos = existing.docs.map((tp) => ({
      id: tp.id,
      proceso: tp.proceso,
    }))

    // Diff: eliminar los que ya no están
    const toDelete = existingProcesos.filter((ep) => !newProcesos.includes(ep.proceso))
    await Promise.all(
      toDelete.map((tp) => basePayload.delete({ collection: 'tramite-proceso', id: tp.id })),
    )

    // Diff: crear los nuevos
    const existingNames = existingProcesos.map((ep) => ep.proceso)
    const toCreate = newProcesos.filter((p) => !existingNames.includes(p))
    await Promise.all(
      toCreate.map((proceso) =>
        basePayload.create({
          collection: 'tramite-proceso',
          data: { tramite: String(id), proceso },
        }),
      ),
    )

    revalidatePath('/(frontend)/(protected)', 'page')
    return { ok: true, data: result, message: 'Trámite actualizado' }
  } catch (error) {
    return {
      ok: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al actualizar trámite',
    }
  }
}

export async function deleteTramite(id: string | number): Promise<Res<Tramite>> {
  try {
    // Cascade: eliminar todos los tramite-proceso asociados
    const procesos = await basePayload.find({
      collection: 'tramite-proceso',
      where: { tramite: { equals: id } },
      limit: 100,
    })

    await Promise.all(
      procesos.docs.map((tp) => basePayload.delete({ collection: 'tramite-proceso', id: tp.id })),
    )

    const result = await basePayload.delete({
      collection: 'tramite',
      id,
    })

    revalidatePath('/(frontend)/(protected)', 'page')
    return { ok: true, data: result, message: 'Trámite eliminado' }
  } catch (error) {
    return {
      ok: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error al eliminar trámite',
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
