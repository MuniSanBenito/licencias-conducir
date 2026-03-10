import { IconFileOff } from '@tabler/icons-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="bg-base-200 flex min-h-screen flex-col items-center justify-center px-4">
      <IconFileOff size={48} className="mb-4 opacity-30" />
      <h1 className="text-lg font-bold">Página no encontrada</h1>
      <p className="mt-2 text-sm opacity-60">La página que buscás no existe.</p>
      <Link href="/login" className="btn btn-primary mt-6">
        Ir al inicio de sesión
      </Link>
    </main>
  )
}
