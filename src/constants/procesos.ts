import {
  LicenciaClaseAEnum,
  LicenciaClaseBEnum,
  LicenciaClaseCEnum,
  type LicenciaClase,
} from './clases'
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

const nuevaLicenciaA1_3: Proceso = {
  nombre: 'Licencia Original A1.3',
  clase: LicenciaClaseAEnum['A1.3'],
  tipo_tramite: TramitesEnum.ORIGINAL,
  activo: false,
  pasos: [
    EtapasEnum.PAPELES,
    EtapasEnum.CURSO,
    EtapasEnum.TEORICO,
    EtapasEnum.PRACTICO_AUTO,
    EtapasEnum.PSICOFOISICO,
  ],
}

const nuevaLicenciaA1_4: Proceso = {
  nombre: 'Licencia Original A1.4',
  clase: LicenciaClaseAEnum['A1.4'],
  tipo_tramite: TramitesEnum.ORIGINAL,
  activo: false,
  pasos: [
    EtapasEnum.PAPELES,
    EtapasEnum.CURSO,
    EtapasEnum.TEORICO,
    EtapasEnum.PRACTICO_AUTO,
    EtapasEnum.PSICOFOISICO,
  ],
}

const nuevaLicenciaA2_1: Proceso = {
  nombre: 'Licencia Original A2.1',
  clase: LicenciaClaseAEnum['A2.1'],
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

const nuevaLicenciaA2_2: Proceso = {
  nombre: 'Licencia Original A2.2',
  clase: LicenciaClaseAEnum['A2.2'],
  tipo_tramite: TramitesEnum.ORIGINAL,
  activo: false,
  pasos: [
    EtapasEnum.PAPELES,
    EtapasEnum.CURSO,
    EtapasEnum.TEORICO,
    EtapasEnum.PRACTICO_AUTO,
    EtapasEnum.PSICOFOISICO,
  ],
}

const nuevaLicenciaB1: Proceso = {
  nombre: 'Licencia Original B1',
  clase: LicenciaClaseBEnum.B1,
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

const nuevaLicenciaB2: Proceso = {
  nombre: 'Licencia Original B2',
  clase: LicenciaClaseBEnum.B2,
  tipo_tramite: TramitesEnum.ORIGINAL,
  activo: false,
  pasos: [
    EtapasEnum.PAPELES,
    EtapasEnum.CURSO,
    EtapasEnum.TEORICO,
    EtapasEnum.PRACTICO_AUTO,
    EtapasEnum.PSICOFOISICO,
  ],
}

const nuevaLicenciaC1: Proceso = {
  nombre: 'Licencia Original C1',
  clase: LicenciaClaseCEnum.C1,
  tipo_tramite: TramitesEnum.ORIGINAL,
  activo: false,
  pasos: [
    EtapasEnum.PAPELES,
    EtapasEnum.CURSO,
    EtapasEnum.TEORICO,
    EtapasEnum.PRACTICO_AUTO,
    EtapasEnum.PSICOFOISICO,
  ],
}

const nuevaLicenciaC2: Proceso = {
  nombre: 'Licencia Original C2',
  clase: LicenciaClaseCEnum.C2,
  tipo_tramite: TramitesEnum.ORIGINAL,
  activo: false,
  pasos: [
    EtapasEnum.PAPELES,
    EtapasEnum.CURSO,
    EtapasEnum.TEORICO,
    EtapasEnum.PRACTICO_AUTO,
    EtapasEnum.PSICOFOISICO,
  ],
}

const nuevaLicenciaC3: Proceso = {
  nombre: 'Licencia Original C3',
  clase: LicenciaClaseCEnum.C3,
  tipo_tramite: TramitesEnum.ORIGINAL,
  activo: false,
  pasos: [
    EtapasEnum.PAPELES,
    EtapasEnum.CURSO,
    EtapasEnum.TEORICO,
    EtapasEnum.PRACTICO_AUTO,
    EtapasEnum.PSICOFOISICO,
  ],
}

const nuevaLicenciaD1: Proceso = {
  nombre: 'Licencia Original D1',
  clase: 'D1',
  tipo_tramite: TramitesEnum.ORIGINAL,
  activo: false,
  pasos: [
    EtapasEnum.PAPELES,
    EtapasEnum.CURSO,
    EtapasEnum.TEORICO,
    EtapasEnum.PRACTICO_AUTO,
    EtapasEnum.PSICOFOISICO,
  ],
}

const nuevaLicenciaD2: Proceso = {
  nombre: 'Licencia Original D2',
  clase: 'D2',
  tipo_tramite: TramitesEnum.ORIGINAL,
  activo: false,
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
  nuevaLicenciaA1_3,
  nuevaLicenciaA1_4,
  nuevaLicenciaA2_1,
  nuevaLicenciaA2_2,
  nuevaLicenciaB1,
  nuevaLicenciaB2,
  nuevaLicenciaC1,
  nuevaLicenciaC2,
  nuevaLicenciaC3,
  nuevaLicenciaD1,
  nuevaLicenciaD2,
} as const
