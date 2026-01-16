'use server'

import type { Usuario } from '@/payload-types'
import type { Res } from '@/types'
import config from '@payload-config'
import { login, logout } from '@payloadcms/next/auth'

export async function signIn(args: { email: string; password: string }): Promise<Res<Usuario>> {
  try {
    const result = await login({
      config,
      collection: 'usuario',
      email: args.email,
      password: args.password,
    })

    if (result.user) {
      return {
        ok: true,
        message: 'Usuario autenticado correctamente',
        data: result.user,
      }
    }

    return {
      ok: false,
      message: 'Usuario no encontrado',
      data: null,
    }
  } catch (error) {
    console.error(error)
    return {
      ok: false,
      message: 'Error al autenticar usuario',
      data: null,
    }
  }
}

export async function signOut(): Promise<Res<null>> {
  try {
    const response = await logout({ config })
    if (response.success) {
      return {
        ok: true,
        message: 'Cerro sesión correctamente',
        data: null,
      }
    }
    return {
      ok: false,
      message: 'Error al cerrar sesión',
      data: null,
    }
  } catch (error) {
    console.error(error)

    return {
      ok: false,
      message: error instanceof Error ? error.message : 'Error al cerrar sesión',
      data: null,
    }
  }
}
