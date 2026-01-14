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
