/**
 * Store reactivo para datos mock.
 * Usa un patrón de suscripción simple para que los componentes
 * puedan re-renderizar cuando los datos cambian.
 */

import { CIUDADANOS_MOCK, TRAMITES_MOCK } from '@/mock/data'
import type { Ciudadano, Tramite } from '@/types'

// ─── Estado global mutable ───

let ciudadanos: Ciudadano[] = [...CIUDADANOS_MOCK]
let tramites: Tramite[] = [...TRAMITES_MOCK]

type Listener = () => void

const ciudadanosListeners = new Set<Listener>()
const tramitesListeners = new Set<Listener>()

function notifyCiudadanos() {
  ciudadanosListeners.forEach((l) => l())
}

function notifyTramites() {
  tramitesListeners.forEach((l) => l())
}

// ─── API Ciudadanos ───

export function getCiudadanos(): Ciudadano[] {
  return ciudadanos
}

export function getCiudadanoByDni(dni: string): Ciudadano | undefined {
  return ciudadanos.find((c) => c.dni === dni)
}

export function addCiudadano(ciudadano: Ciudadano): void {
  ciudadanos = [...ciudadanos, ciudadano]
  notifyCiudadanos()
}

export function buscarCiudadanos(query: string): Ciudadano[] {
  const q = query.toLowerCase().trim()
  if (!q) return ciudadanos
  return ciudadanos.filter(
    (c) =>
      c.dni.includes(q) ||
      c.nombre.toLowerCase().includes(q) ||
      c.apellido.toLowerCase().includes(q),
  )
}

// ─── API Trámites ───

export function getTramites(): Tramite[] {
  return tramites
}

export function getTramiteById(id: string): Tramite | undefined {
  return tramites.find((t) => t.id === id)
}

export function addTramite(tramite: Tramite): void {
  tramites = [...tramites, tramite]
  notifyTramites()
}

export function updateTramite(id: string, updates: Partial<Tramite>): void {
  tramites = tramites.map((t) => (t.id === id ? { ...t, ...updates } : t))
  notifyTramites()
}

// ─── Hooks de suscripción (useSyncExternalStore) ───

export function subscribeCiudadanos(listener: Listener): () => void {
  ciudadanosListeners.add(listener)
  return () => ciudadanosListeners.delete(listener)
}

export function subscribeTramites(listener: Listener): () => void {
  tramitesListeners.add(listener)
  return () => tramitesListeners.delete(listener)
}

export function getCiudadanosSnapshot(): Ciudadano[] {
  return ciudadanos
}

export function getTramitesSnapshot(): Tramite[] {
  return tramites
}
