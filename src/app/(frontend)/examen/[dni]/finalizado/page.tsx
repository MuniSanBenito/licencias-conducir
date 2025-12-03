import { Logo } from '@/payload/brand/logo'
import { IconCheck, IconClock, IconInfoCircle } from '@tabler/icons-react'
import Link from 'next/link'

export default async function ExamenFinalizadoPage({ params }: PageProps<'/examen/[dni]/finalizado'>) {
  const { dni } = await params

  return (
    <div className="mx-auto flex min-h-dvh max-w-2xl flex-col items-center justify-center p-6">
      <div className="mb-8">
        <Logo height={80} />
      </div>

      <div className="card w-full bg-base-100 shadow-xl">
        <div className="card-body items-center text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-success/20">
            <IconCheck className="h-12 w-12 text-success" />
          </div>

          <h1 className="card-title text-2xl sm:text-3xl">¡Examen Finalizado!</h1>

          <p className="mt-4 text-base-content/70">
            Tu examen ha sido enviado correctamente y está siendo procesado.
          </p>

          <div className="divider" />

          <div className="flex items-center gap-3 text-base-content/60">
            <IconClock className="h-5 w-5" />
            <span className="text-sm">
              Los resultados estarán disponibles en las próximas horas
            </span>
          </div>

          <div className="alert alert-info mt-6 text-left">
            <IconInfoCircle className="h-6 w-6 shrink-0 stroke-current" />
            <div className="text-sm">
              <p className="font-semibold">Próximos pasos:</p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li>Recibirás una notificación con los resultados</li>
                <li>Si aprobaste, podrás solicitar tu licencia</li>
                <li>En caso de no aprobar, podrás agendar un nuevo turno</li>
              </ul>
            </div>
          </div>

          <div className="card-actions mt-6">
            <Link href="/" className="btn btn-primary">
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-base-content/60">
        DNI: {dni}
      </p>
    </div>
  )
}
