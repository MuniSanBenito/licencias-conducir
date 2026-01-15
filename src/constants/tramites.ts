export const TramitesEnum = {
  ORIGINAL: 'Original',
  RENOVACION: 'Renovación',
  AMPLIACION: 'Ampliación',
} as const

export type Tramite = (typeof TramitesEnum)[keyof typeof TramitesEnum]
