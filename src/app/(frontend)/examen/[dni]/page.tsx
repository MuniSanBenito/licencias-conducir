import { buscarExamenPorDNI } from '@/mocks/examenes'
import { notFound } from 'next/navigation'
import { ExamenPageClient } from './examen-page-client'

export default async function ExamenPage({ params }: PageProps<'/examen/[dni]'>) {
  const { dni } = await params

  const examen = buscarExamenPorDNI(dni)

  if (!examen) {
    notFound()
  }

  return <ExamenPageClient examen={examen} />
}
