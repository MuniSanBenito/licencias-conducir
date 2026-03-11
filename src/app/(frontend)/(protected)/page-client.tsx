'use client'

import { TIPO_TRAMITE_LABELS, type Tramite } from '@/types'
import { useTramites } from '@/web/hooks/use-tramites'
import {
  IconCheck,
  IconClock,
  IconFilePlus,
  IconFiles,
  IconHourglass,
  IconPlayerPause,
  IconSearch,
} from '@tabler/icons-react'
import Link from 'next/link'
import { useState } from 'react'
import { twJoin } from 'tailwind-merge'

function getEstadoActual(tramite: Tramite): string {
  const pasoActivo = tramite.pasos.find((p) => p.estado === 'en_curso')
  if (pasoActivo) return pasoActivo.label

  const todosCompletados = tramite.pasos.every((p) => p.estado === 'completado')
  if (todosCompletados) return 'Completado'

  return 'Pendiente de inicio'
}

function getProgreso(tramite: Tramite): number {
  const completados = tramite.pasos.filter((p) => p.estado === 'completado').length
  return Math.round((completados / tramite.pasos.length) * 100)
}

function getBadgeClass(tipo: string): string {
  if (tipo === 'nueva') return 'badge badge-info badge-sm'
  if (tipo === 'renovacion') return 'badge badge-warning badge-sm'
  return 'badge badge-secondary badge-sm'
}

function getEstadoBadgeClass(tramite: Tramite): string {
  if (tramite.estado === 'completado') return 'badge badge-success badge-soft badge-sm'
  if (tramite.estado === 'cancelado') return 'badge badge-error badge-soft badge-sm'
  return 'badge badge-warning badge-soft badge-sm'
}

export default function DashboardPage() {
  const tramites = useTramites()
  const [busqueda, setBusqueda] = useState('')

  const q = busqueda.toLowerCase().trim()
  const filtrados = q
    ? tramites.filter(
        (t) =>
          t.fut.toLowerCase().includes(q) ||
          t.ciudadano.dni.includes(q) ||
          t.ciudadano.nombre.toLowerCase().includes(q) ||
          t.ciudadano.apellido.toLowerCase().includes(q),
      )
    : tramites
  const totalTramites = tramites.length
  const enCurso = tramites.filter((t) => t.estado === 'en_curso').length
  const completados = tramites.filter((t) => t.estado === 'completado').length
  const pendientes = tramites.filter(
    (t) => t.estado === 'en_curso' && t.pasos[0].estado === 'pendiente',
  ).length

  const stats = [
    { label: 'Total Trámites', value: totalTramites, icon: IconFiles, color: 'text-primary' },
    { label: 'En Curso', value: enCurso, icon: IconClock, color: 'text-warning' },
    { label: 'Completados', value: completados, icon: IconCheck, color: 'text-success' },
    { label: 'Sin Iniciar', value: pendientes, icon: IconHourglass, color: 'text-secondary' },
  ]

  return (
    <section>
      {/* Stats Cards */}
      <section
        className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
        aria-label="Estadísticas de trámites"
      >
        {stats.map((stat) => (
          <article key={stat.label} className="card card-border bg-base-100">
            <section className="card-body flex-row items-center gap-4">
              <figure className={twJoin('rounded-btn bg-base-200 p-3', stat.color)}>
                <stat.icon size={24} />
              </figure>
              <section>
                <p className="text-sm opacity-60">{stat.label}</p>
                <p className={twJoin('text-3xl font-bold', stat.color)}>{stat.value}</p>
              </section>
            </section>
          </article>
        ))}
      </section>

      {/* Header de tabla */}
      <section className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Trámites Recientes</h2>
        <Link href="/tramite/nuevo" className="btn btn-primary">
          <IconFilePlus size={18} />
          Nuevo Trámite
        </Link>
      </section>

      {/* Búsqueda */}
      <label className="input input-bordered mb-4 flex max-w-md items-center gap-2">
        <IconSearch size={16} className="opacity-50" />
        <input
          type="search"
          className="grow"
          placeholder="Buscar por FUT, DNI o nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          aria-label="Buscar trámites"
        />
      </label>

      {/* Tabla */}
      <section className="card card-border bg-base-100 overflow-x-auto">
        <table className="table" aria-label="Lista de trámites recientes">
          <thead>
            <tr>
              <th>FUT</th>
              <th>ID</th>
              <th>DNI</th>
              <th>Ciudadano</th>
              <th>Clases</th>
              <th>Etapa Actual</th>
              <th>Progreso</th>
              <th>Fecha Inicio</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((tramite) => {
              const progreso = getProgreso(tramite)
              return (
                <tr key={tramite.id} className="hover:bg-base-200/50">
                  <td className="font-mono text-sm font-bold">{tramite.fut}</td>
                  <td>
                    <Link
                      href={`/tramite/${tramite.id}`}
                      className="link link-primary text-sm font-semibold"
                    >
                      {tramite.id}
                    </Link>
                  </td>
                  <td className="font-mono text-sm">{tramite.ciudadano.dni}</td>
                  <td className="font-medium">
                    {tramite.ciudadano.apellido}, {tramite.ciudadano.nombre}
                  </td>
                  <td>
                    <section className="flex flex-wrap gap-1">
                      {tramite.items.map((item, i) => (
                        <span key={i} className={getBadgeClass(item.tipo)}>
                          {item.clase} · {TIPO_TRAMITE_LABELS[item.tipo]}
                        </span>
                      ))}
                    </section>
                  </td>
                  <td>
                    <span className={getEstadoBadgeClass(tramite)}>
                      {tramite.estado === 'completado' && <IconCheck size={12} />}
                      {tramite.estado === 'en_curso' && <IconPlayerPause size={12} />}
                      {getEstadoActual(tramite)}
                    </span>
                  </td>
                  <td>
                    <section className="flex items-center gap-2">
                      <progress
                        className={twJoin(
                          'progress w-24',
                          progreso === 100 ? 'progress-success' : 'progress-primary',
                        )}
                        value={progreso}
                        max={100}
                        aria-label={`${progreso}% completado`}
                      />
                      <span className="text-xs opacity-60">{progreso}%</span>
                    </section>
                  </td>
                  <td className="text-sm opacity-70">{tramite.fechaInicio}</td>
                </tr>
              )
            })}
            {filtrados.length === 0 && (
              <tr>
                <td colSpan={8} className="py-10 text-center opacity-50">
                  {busqueda ? 'No se encontraron trámites' : 'No hay trámites registrados'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </section>
  )
}
