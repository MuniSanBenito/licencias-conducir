import { basePayload } from '@/web/libs/payload/server'
import { RendirExamenPage } from '@/web/ui/templates/rendir-examen-page'
import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Rendir Examen | Licencias San Benito',
  description: 'Examen Teórico de Conducir',
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  const { id } = await params

  const examenes = await basePayload.find({
    collection: 'examen',
    where: {
      id: { equals: id },
    },
    limit: 1,
  })

  if (examenes.totalDocs === 0) {
    notFound()
  }

  const examen = examenes.docs[0]

  if (examen.estado === 'cerrado') {
    redirect(`/examenes/${id}/resultado`)
  }

  const tiempoRestante = new Date(examen.fechaFin).getTime() - Date.now()

  // Si ya se pasó la fecha y aún está abierto, deberíamos cerrarlo o avisar
  if (tiempoRestante <= 0 && examen.estado === 'abierto') {
    // Para simplificar la demo, podemos permitir que igual lo envíe, el Action validará luego,
    // o redirigirlo y cerrarlo silenciosamente. Vamos a cerrarlo en el frontend action.
  }

  return <RendirExamenPage examen={examen} />
}
