export const AreasEnum = {
  TEORICO: 'Teórico',
  PRACTICO: 'Práctico',
  PSICOFISICO: 'Psicofísico',
  CURSO: 'Curso',
  LICENCIAS: 'Licencias',
  OTRO: 'Otro',
} as const

export type Areas = keyof typeof AreasEnum
