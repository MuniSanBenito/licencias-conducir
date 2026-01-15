/* export const LicenciasClaseEnum = {
  A: 'A',
  B: 'B',
  C: 'C',
  D: 'D',
  E: 'E',
  F: 'F',
  G: 'G',
} as const */

export const LicenciaClaseAEnum = {
  'A1.1': 'A1.1',
  'A1.2': 'A1.2',
  'A1.3': 'A1.3',
  'A1.4': 'A1.4',
  'A2.1': 'A2.1',
  'A2.2': 'A2.2',
  '3': 'A3',
} as const

export type LicenciaClaseA = keyof typeof LicenciaClaseAEnum

export const LicenciaClaseBEnum = {
  B1: 'B1',
  B2: 'B2',
} as const

export type LicenciaClaseB = keyof typeof LicenciaClaseBEnum

export const LicenciaClaseCEnum = {
  C1: 'C1',
  C2: 'C2',
  C3: 'C3',
} as const

export type LicenciaClaseC = keyof typeof LicenciaClaseCEnum

export const LicenciaClaseDEnum = {
  D1: 'D1',
  D2: 'D2',
  D3: 'D3',
  D4: 'D4',
} as const

export type LicenciaClaseD = keyof typeof LicenciaClaseDEnum

export const LicenciaClaseEEnum = {
  E1: 'E1',
  E2: 'E2',
} as const

export type LicenciaClaseE = keyof typeof LicenciaClaseEEnum

export const LicenciaClaseFEnum = {
  F: 'F',
} as const

export type LicenciaClaseF = keyof typeof LicenciaClaseFEnum

export const LicenciaClaseGEnum = {
  G1: 'G1',
  G2: 'G2',
  G3: 'G3',
} as const

export type LicenciaClaseG = keyof typeof LicenciaClaseGEnum

export type LicenciaClase =
  | LicenciaClaseA
  | LicenciaClaseB
  | LicenciaClaseC
  | LicenciaClaseD
  | LicenciaClaseE
  | LicenciaClaseF
  | LicenciaClaseG
