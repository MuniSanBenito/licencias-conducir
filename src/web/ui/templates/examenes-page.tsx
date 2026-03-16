import type { Examan as Examen } from '@/payload-types'
import { ExamenesTable } from '@/web/ui/organisms/examenes-table'

interface Props {
  examenes: Examen[]
  page: number
  totalPages: number
  totalDocs: number
}

export function ExamenesPage({ examenes, page, totalPages, totalDocs }: Props) {
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Historial de Exámenes</h1>

      <ExamenesTable
        examenes={examenes}
        page={page}
        totalPages={totalPages}
        totalDocs={totalDocs}
      />
    </section>
  )
}
