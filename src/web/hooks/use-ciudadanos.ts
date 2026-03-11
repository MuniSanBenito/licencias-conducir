'use client'
import { getCiudadanosSnapshot, subscribeCiudadanos } from '@/app/(frontend)/(protected)/store'
import { useSyncExternalStore } from 'react'

export function useCiudadanos() {
  return useSyncExternalStore(subscribeCiudadanos, getCiudadanosSnapshot, getCiudadanosSnapshot)
}
