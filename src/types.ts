export interface ResOK {
  ok: true
  message: string
}

export interface ResNOK {
  ok: false
  message: string
}

export type Res = ResOK | ResNOK
