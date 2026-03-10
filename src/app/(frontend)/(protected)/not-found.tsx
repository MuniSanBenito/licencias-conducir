import { IconFileOff } from '@tabler/icons-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="flex flex-col items-center justify-center py-20">
      <IconFileOff size={48} className="mb-4 opacity-30" />
      <h2 className="text-lg font-bold">Página no encontrada</h2>
      <p className="mt-2 text-sm opacity-60">La página que buscás no existe.</p>
      <Link href="/" className="btn btn-primary mt-6">
        Volver al tablero
      </Link>
    </section>
  )
}
