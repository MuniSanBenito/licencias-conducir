'use client'

import { useSyncExternalStore } from 'react'
import {
  getCiudadanosSnapshot,
  getTramitesSnapshot,
  subscribeCiudadanos,
  subscribeTramites,
} from './store'

export function useCiudadanos() {
  return useSyncExternalStore(subscribeCiudadanos, getCiudadanosSnapshot, getCiudadanosSnapshot)
}

export function useTramites() {
  return useSyncExternalStore(subscribeTramites, getTramitesSnapshot, getTramitesSnapshot)
}
