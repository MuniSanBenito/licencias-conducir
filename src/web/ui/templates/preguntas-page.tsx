import type { Pregunta } from '@/payload-types'
import { PreguntasTable } from '@/web/ui/organisms/preguntas-table'

interface Props {
  preguntas: Pregunta[]
  page: number
  totalPages: number
  totalDocs: number
}

export function PreguntasPage({ preguntas, page, totalPages, totalDocs }: Props) {
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Banco de Preguntas</h1>

      <PreguntasTable
        preguntas={preguntas}
        page={page}
        totalPages={totalPages}
        totalDocs={totalDocs}
      />
    </section>
  )
}
