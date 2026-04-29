import { basePayload } from '@/web/libs/payload/server'
import { IconCalendarEvent, IconSchool, IconStethoscope, IconUsers } from '@tabler/icons-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tablero',
}

export default async function Page() {
  const [ciudadanos, turnosCurso, turnosPsico, diasInhabiles] = await Promise.all([
    basePayload.count({ collection: 'ciudadano' }),
    basePayload.count({ collection: 'turno-curso', where: { estado: { not_equals: 'cancelado' } } }),
    basePayload.count({ collection: 'turno-psicofisico', where: { estado: { not_equals: 'cancelado' } } }),
    basePayload.count({ collection: 'dia-inhabil', where: { activo: { equals: true } } }),
  ])

  return (
    <section aria-labelledby="dashboard-heading">
      <header className="mb-6 flex items-center justify-between">
        <h2 id="dashboard-heading" className="text-xl font-bold">
          Tablero Operativo
        </h2>
      </header>

      <section
        className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
        aria-label="Estadísticas operativas"
      >
        <article className="card card-border bg-base-100">
          <section className="card-body flex-row items-center gap-4">
            <figure className="rounded-btn bg-base-200 text-primary p-3">
              <IconUsers size={24} aria-hidden="true" />
            </figure>
            <section>
              <p className="text-sm opacity-60">Ciudadanos</p>
              <p className="text-primary text-3xl font-bold">{ciudadanos.totalDocs}</p>
            </section>
          </section>
        </article>

        <article className="card card-border bg-base-100">
          <section className="card-body flex-row items-center gap-4">
            <figure className="rounded-btn bg-base-200 text-warning p-3">
              <IconSchool size={24} aria-hidden="true" />
            </figure>
            <section>
              <p className="text-sm opacity-60">Turnos Curso</p>
              <p className="text-warning text-3xl font-bold">{turnosCurso.totalDocs}</p>
            </section>
          </section>
        </article>

        <article className="card card-border bg-base-100">
          <section className="card-body flex-row items-center gap-4">
            <figure className="rounded-btn bg-base-200 text-success p-3">
              <IconStethoscope size={24} aria-hidden="true" />
            </figure>
            <section>
              <p className="text-sm opacity-60">Turnos Psicofísico</p>
              <p className="text-success text-3xl font-bold">{turnosPsico.totalDocs}</p>
            </section>
          </section>
        </article>

        <article className="card card-border bg-base-100">
          <section className="card-body flex-row items-center gap-4">
            <figure className="rounded-btn bg-base-200 text-error p-3">
              <IconCalendarEvent size={24} aria-hidden="true" />
            </figure>
            <section>
              <p className="text-sm opacity-60">Días Inhábiles</p>
              <p className="text-error text-3xl font-bold">{diasInhabiles.totalDocs}</p>
            </section>
          </section>
        </article>
      </section>
    </section>
  )
}
