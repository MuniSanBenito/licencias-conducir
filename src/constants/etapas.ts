/* Table "catalogo_etapas" {
  "id" int [pk, not null, increment, ref: < "tramites_progreso"."etapa_id"]
  "nombre" varchar(50) [not null, note: 'Ej: Papeles, Curso, Teorico, Practico, Medico']
  "requiere_turno" boolean [default: true]
  "es_digital" boolean [default: false, note: 'Habilita examen en PC']
  "es_carga_fut" boolean [default: false, note: 'Pide cargar ID Nacional']
  "es_multiplicable_por_clase" boolean [default: false, note: 'Si es TRUE (Practico), se genera una fila por cada categoria solicitada']
} */

export interface Etapa {
  nombre: string
  requiere_turno: boolean
  es_digital: boolean
  es_carga_fut: boolean
  es_multiplicable_por_clase: boolean
}

const ETAPA_PAPELES: Etapa = {
  nombre: 'Papeles',
  requiere_turno: false,
  es_digital: false,
  es_carga_fut: false,
  es_multiplicable_por_clase: false,
} as const

const ETAPA_CURSO: Etapa = {
  nombre: 'Curso',
  requiere_turno: false,
  es_digital: true,
  es_carga_fut: false,
  es_multiplicable_por_clase: false,
} as const

const ETAPA_TEORICO: Etapa = {
  nombre: 'Teorico',
  requiere_turno: true,
  es_digital: false,
  es_carga_fut: false,
  es_multiplicable_por_clase: false,
} as const

const ETAPA_PRACTICO_MOTO: Etapa = {
  nombre: 'Practico',
  requiere_turno: true,
  es_digital: false,
  es_carga_fut: false,
  es_multiplicable_por_clase: true,
} as const

const ETAPA_PRACTICO_AUTO: Etapa = {
  nombre: 'Practico',
  requiere_turno: true,
  es_digital: false,
  es_carga_fut: false,
  es_multiplicable_por_clase: true,
} as const

const ETAPA_PSICOFOISICO: Etapa = {
  nombre: 'Psicofísico',
  requiere_turno: false,
  es_digital: false,
  es_carga_fut: false,
  es_multiplicable_por_clase: false,
} as const

export const EtapasEnum = {
  PAPELES: ETAPA_PAPELES,
  CURSO: ETAPA_CURSO,
  TEORICO: ETAPA_TEORICO,
  PRACTICO_MOTO: ETAPA_PRACTICO_MOTO,
  PRACTICO_AUTO: ETAPA_PRACTICO_AUTO,
  PSICOFOISICO: ETAPA_PSICOFOISICO,
} as const
