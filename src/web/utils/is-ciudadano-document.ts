import type { Ciudadano } from '@/payload-types'

export function isCiudadanoDocument(value: unknown): value is Ciudadano {
  if (typeof value !== 'object' || value === null) return false
  const o = value as Record<string, unknown>
  return (
    typeof o.id === 'string' &&
    typeof o.apellido === 'string' &&
    typeof o.nombre === 'string' &&
    typeof o.dni === 'string'
  )
}
