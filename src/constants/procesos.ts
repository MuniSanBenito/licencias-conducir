import { LicenciaClaseAEnum, type LicenciaClase } from './clases'
import { EtapasEnum, type Etapa } from './etapas'
import { TramitesEnum, type Tramite } from './tramites'

interface Proceso {
  nombre: string
  clase: LicenciaClase
  tipo_tramite: Tramite
  activo: boolean
  pasos: Etapa[]
}

const nuevaLicenciaA1_1: Proceso = {
  nombre: 'Licencia Original A1.1',
  clase: LicenciaClaseAEnum['A1.1'],
  tipo_tramite: TramitesEnum.ORIGINAL,
  activo: true,
  pasos: [
    EtapasEnum.PAPELES,
    EtapasEnum.CURSO,
    EtapasEnum.TEORICO,
    EtapasEnum.PRACTICO_AUTO,
    EtapasEnum.PSICOFOISICO,
  ],
}

const nuevaLicenciaA1_2: Proceso = {
  nombre: 'Licencia Original A1.2',
  clase: LicenciaClaseAEnum['A1.2'],
  tipo_tramite: TramitesEnum.ORIGINAL,
  activo: true,
  pasos: [
    EtapasEnum.PAPELES,
    EtapasEnum.CURSO,
    EtapasEnum.TEORICO,
    EtapasEnum.PRACTICO_AUTO,
    EtapasEnum.PSICOFOISICO,
  ],
}

export const ProcesosEnum: Record<string, Proceso> = {
  nuevaLicenciaA1_1,
  nuevaLicenciaA1_2,
} as const
