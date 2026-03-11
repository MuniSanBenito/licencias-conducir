// ─── Enums y tipos base ───

import type { ClaseLicencia } from './constants/clases'
import {
  type EstadoPaso,
  type EstadoTramite,
  type EstadoTurno,
  type PasoId,
  type TipoTramite,
} from './constants/tramites'

// ─── Interfaces ───

export interface Turno {
  fecha: string
  hora: string
  estado: EstadoTurno
  observaciones?: string
}

export interface PasoTramite {
  id: PasoId
  label: string
  estado: EstadoPaso
  requiereTurno: boolean
  turno?: Turno
  fecha?: string
  observaciones?: string
}

export interface ItemLicencia {
  clase: ClaseLicencia
  tipo: TipoTramite
}

export interface Ciudadano {
  dni: string
  nombre: string
  apellido: string
  celular: string
  fechaNacimiento: string
  domicilio: string
}

export interface Tramite {
  id: string
  fut: string
  ciudadano: Ciudadano
  items: ItemLicencia[]
  pasos: PasoTramite[]
  estado: EstadoTramite
  fechaInicio: string
  fechaFin?: string
}

interface R {
  ok: boolean
  message: string
  data: unknown
}

interface ResOK<T> extends R {
  ok: true
  data: T
}

interface ResNOK extends R {
  ok: false
  data: null
}

export type Res<T> = ResOK<T> | ResNOK
