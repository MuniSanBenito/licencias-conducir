export const CATEGORIAS_MOTO = ['A1', 'A2', 'A3'] as const
export type CategoriaMoto = (typeof CATEGORIAS_MOTO)[number]

export const CATEGORIAS_AUTO = ['B1', 'B2', 'B3', 'B4'] as const
export type CategoriaAuto = (typeof CATEGORIAS_AUTO)[number]
