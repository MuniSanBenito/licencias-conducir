'use client'

import { IconAlertTriangle } from '@tabler/icons-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <section className="flex flex-col items-center justify-center py-20">
      <IconAlertTriangle size={48} className="text-error mb-4" />
      <h2 className="text-lg font-bold">Ocurrió un error inesperado</h2>
      <p className="mt-2 text-sm opacity-60">
        {error.message || 'Algo salió mal. Intentá nuevamente.'}
      </p>
      <button className="btn btn-primary mt-6" onClick={reset}>
        Reintentar
      </button>
    </section>
  )
}
