import { Logo } from '@/payload/brand/logo'
import { basePayload } from '@/web/libs/payload'
import { IconCheck, IconInfoCircle, IconX } from '@tabler/icons-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function ExamenFinalizadoPage({
  params,
}: PageProps<'/examen/[dni]/finalizado'>) {
  const { dni } = await params

  // Buscar ciudadano por DNI
  const ciudadanos = await basePayload.find({
    collection: 'ciudadanos',
    where: { dni: { equals: dni } },
    limit: 1,
  })

  if (ciudadanos.docs.length === 0) {
    notFound()
  }

  const ciudadano = ciudadanos.docs[0]

  // Buscar FUT del ciudadano
  const futs = await basePayload.find({
    collection: 'futs',
    where: { ciudadano: { equals: ciudadano.id } },
    limit: 1,
  })

  if (futs.docs.length === 0) {
    notFound()
  }

  const fut = futs.docs[0]

  // Buscar examen del FUT
  const examenes = await basePayload.find({
    collection: 'examenes',
    where: { fut: { equals: fut.id } },
    limit: 1,
  })

  if (examenes.docs.length === 0) {
    notFound()
  }

  const examen = examenes.docs[0]

  // Si no está finalizado, redirigir al examen
  if (!examen.finalizado) {
    notFound()
  }

  const aprobado = examen.aprobado || false
  const porcentaje = examen.porcentaje || 0
  const correctas = examen.correctas || 0
  const incorrectas = examen.incorrectas || 0
  const total = correctas + incorrectas

  return (
    <div className="mx-auto flex min-h-dvh max-w-2xl flex-col items-center justify-center p-6">
      <div className="mb-8">
        <Logo height={80} />
      </div>

      <div className="card bg-base-100 w-full shadow-xl">
        <div className="card-body items-center text-center">
          <div
            className={`mb-4 flex h-20 w-20 items-center justify-center rounded-full ${
              aprobado ? 'bg-success/20' : 'bg-error/20'
            }`}
          >
            {aprobado ? (
              <IconCheck className="text-success h-12 w-12" />
            ) : (
              <IconX className="text-error h-12 w-12" />
            )}
          </div>

          <h1 className="card-title text-2xl sm:text-3xl">
            {aprobado ? '¡Examen Aprobado!' : 'Examen No Aprobado'}
          </h1>

          <p className="text-base-content/70 mt-4">
            {aprobado
              ? 'Felicitaciones, has aprobado el examen teórico.'
              : 'Lamentablemente no has alcanzado el puntaje necesario.'}
          </p>

          <div className="divider" />

          {/* Estadísticas */}
          <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="stat place-items-center p-3">
              <div className="stat-title text-xs">Correctas</div>
              <div className="stat-value text-success text-2xl">{correctas}</div>
            </div>
            <div className="stat place-items-center p-3">
              <div className="stat-title text-xs">Incorrectas</div>
              <div className="stat-value text-error text-2xl">{incorrectas}</div>
            </div>
            <div className="stat place-items-center p-3">
              <div className="stat-title text-xs">Total</div>
              <div className="stat-value text-2xl">{total}</div>
            </div>
            <div className="stat place-items-center p-3">
              <div className="stat-title text-xs">Porcentaje</div>
              <div className={`stat-value text-2xl ${aprobado ? 'text-success' : 'text-error'}`}>
                {porcentaje}%
              </div>
            </div>
          </div>

          <div className="divider" />

          <div className={`alert ${aprobado ? 'alert-success' : 'alert-info'} mt-6 text-left`}>
            <IconInfoCircle className="h-6 w-6 shrink-0 stroke-current" />
            <div className="text-sm">
              <p className="font-semibold">Próximos pasos:</p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                {aprobado ? (
                  <>
                    <li>Dirígete a la Municipalidad con tu DNI</li>
                    <li>Completa el trámite de emisión de licencia</li>
                    <li>Abona las tasas correspondientes</li>
                  </>
                ) : (
                  <>
                    <li>Puedes solicitar un nuevo turno para rendir</li>
                    <li>Recuerda repasar el material de estudio</li>
                    <li>El puntaje mínimo es del 90%</li>
                  </>
                )}
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

      <p className="text-base-content/60 mt-6 text-center text-sm">
        DNI: {dni} | FUT: {fut.futId}
      </p>
    </div>
  )
}
