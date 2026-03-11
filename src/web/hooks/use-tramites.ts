'use client'
import { getTramitesSnapshot, subscribeTramites } from '@/app/(frontend)/(protected)/store'
import { useSyncExternalStore } from 'react'

export function useTramites() {
  return useSyncExternalStore(subscribeTramites, getTramitesSnapshot, getTramitesSnapshot)
}
