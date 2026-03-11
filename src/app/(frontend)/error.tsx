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
    <main className="bg-base-200 flex min-h-screen flex-col items-center justify-center px-4">
      <IconAlertTriangle size={48} className="text-error mb-4" />
      <h1 className="text-lg font-bold text-center">Algo no salió como esperábamos</h1>
      <p className="mt-2 text-sm opacity-60 text-center max-w-sm">
        {error.message || 'El sistema encontró un error inesperado. Podés intentar recargar la página.'}
      </p>
      <div className="flex gap-4 mt-6">
        <button className="btn btn-primary" onClick={reset}>
          Reintentar
        </button>
        <a href="/login" className="btn btn-ghost">
          Volver al inicio
        </a>
      </div>
    </main>
  )
}
