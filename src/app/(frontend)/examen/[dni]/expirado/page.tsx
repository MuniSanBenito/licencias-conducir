import { IconClock } from '@tabler/icons-react'
import Link from 'next/link'

export default function ExamenExpiradoPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-lg">
        <div className="alert alert-error">
          <IconClock className="h-6 w-6" />
          <div>
            <h3 className="font-bold">Examen expirado</h3>
            <div className="text-sm">
              El tiempo límite de 1 hora para completar el examen ha finalizado.
            </div>
          </div>
        </div>

        <div className="card bg-base-100 mt-8 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">¿Qué puedo hacer?</h2>
            <p>
              Por favor, contacte con la Municipalidad de San Benito para reprogramar su examen.
            </p>
            <div className="card-actions mt-4 justify-end">
              <Link href="/" className="btn btn-primary">
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
