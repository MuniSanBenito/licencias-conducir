export const CLASES_LICENCIA = [
  'A1',
  'A2',
  'A3',
  'B1',
  'B2',
  'C1',
  'C2',
  'D1',
  'D2',
  'D3',
  'D4',
  'E1',
  'E2',
  'E3',
  'G1',
  'G2',
  'G3',
] as const

export type ClaseLicencia = (typeof CLASES_LICENCIA)[number]

export const CLASE_LICENCIA_DEFAULT: ClaseLicencia = 'B1'
