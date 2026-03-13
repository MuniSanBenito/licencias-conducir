'use client'

import {
  ESTADO_PASO,
  ESTADO_TRAMITE,
  ESTADO_TRAMITE_BADGE_SOFT_SM_CLASS,
  ESTADO_TRAMITE_LABELS,
  TIPO_TRAMITE_BADGE_SM_CLASS,
  TIPO_TRAMITE_LABELS,
} from '@/constants/tramites'
import type { Ciudadano, Tramite } from '@/payload-types'
import { BuscarForm } from '@/web/ui/atoms/buscar-form'
import {
  IconCheck,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronUp,
  IconFilePlus,
  IconPlayerPause,
  IconSelector,
  IconX,
} from '@tabler/icons-react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { twJoin } from 'tailwind-merge'

type TramiteConCiudadano = Tramite & {
  ciudadano: Ciudadano
}

interface DashboardStats {
  totalTramites: number
  enCurso: number
  completados: number
  cancelados: number
}

interface Props {
  tramites: TramiteConCiudadano[]
  page: number
  totalPages: number
  totalDocs: number
}

const columnHelper = createColumnHelper<TramiteConCiudadano>()

function getEstadoActual(tramite: TramiteConCiudadano): string {
  const pasoActivo = tramite.pasos.find((paso) => paso.estado === ESTADO_PASO.EN_CURSO)

  if (pasoActivo) {
    return pasoActivo.label
  }

  const todosCompletados = tramite.pasos.every((paso) => paso.estado === ESTADO_PASO.COMPLETADO)

  if (todosCompletados) {
    return ESTADO_TRAMITE_LABELS[ESTADO_TRAMITE.COMPLETADO]
  }

  return 'Pendiente de inicio'
}

function getProgreso(tramite: TramiteConCiudadano): number {
  const completados = tramite.pasos.filter((paso) => paso.estado === ESTADO_PASO.COMPLETADO).length

  if (tramite.pasos.length === 0) {
    return 0
  }

  return Math.round((completados / tramite.pasos.length) * 100)
}

function getEstadoBadgeClass(tramite: TramiteConCiudadano): string {
  return ESTADO_TRAMITE_BADGE_SOFT_SM_CLASS[tramite.estado]
}

function getSortIcon(currentSort: string, columnId: string) {
  if (currentSort === columnId) {
    return <IconChevronUp size={14} className="text-primary" aria-hidden="true" />
  }

  if (currentSort === `-${columnId}`) {
    return <IconChevronDown size={14} className="text-primary" aria-hidden="true" />
  }

  return <IconSelector size={14} className="opacity-20" aria-hidden="true" />
}

function buildColumns() {
  return [
    columnHelper.accessor('fut', {
      id: 'fut',
      header: 'FUT',
      cell: ({ row }) => (
        <Link
          href={`/tramite/${row.original.id}`}
          className="link link-primary font-mono text-sm font-bold"
          aria-label={`Ver detalle del trámite ${row.original.fut}`}
        >
          {row.original.fut}
        </Link>
      ),
    }),
    columnHelper.accessor((row) => row.ciudadano.dni, {
      id: 'ciudadano_dni',
      header: 'DNI',
      cell: (info) => <p className="font-mono text-sm">{info.getValue()}</p>,
    }),
    columnHelper.accessor((row) => `${row.ciudadano.apellido}, ${row.ciudadano.nombre}`, {
      id: 'ciudadano_nombre',
      header: 'Ciudadano',
      cell: (info) => <p className="font-medium">{info.getValue()}</p>,
    }),
    columnHelper.display({
      id: 'clases',
      header: 'Clases',
      cell: ({ row }) => (
        <section className="flex flex-wrap gap-1">
          {row.original.items.map((item) => (
            <span
              key={`${row.original.id}-${item.id ?? item.clase}-${item.tipo}`}
              className={TIPO_TRAMITE_BADGE_SM_CLASS[item.tipo]}
            >
              {item.clase} · {TIPO_TRAMITE_LABELS[item.tipo]}
            </span>
          ))}
        </section>
      ),
    }),
    columnHelper.display({
      id: 'estado_actual',
      header: 'Etapa Actual',
      cell: ({ row }) => (
        <span className={getEstadoBadgeClass(row.original)}>
          {row.original.estado === ESTADO_TRAMITE.COMPLETADO && <IconCheck size={12} />}
          {row.original.estado === ESTADO_TRAMITE.EN_CURSO && <IconPlayerPause size={12} />}
          {row.original.estado === ESTADO_TRAMITE.CANCELADO && <IconX size={12} />}
          {getEstadoActual(row.original)}
        </span>
      ),
    }),
    columnHelper.display({
      id: 'progreso',
      header: 'Progreso',
      cell: ({ row }) => {
        const progreso = getProgreso(row.original)

        return (
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
        )
      },
    }),
    columnHelper.accessor('fechaInicio', {
      id: 'fechaInicio',
      header: 'Fecha Inicio',
      cell: (info) => (
        <p className="text-sm opacity-70">
          {new Date(info.getValue()).toLocaleDateString('es-AR')}
        </p>
      ),
    }),
  ]
}

export function DashboardTable({ tramites, page, totalPages, totalDocs }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentSort = searchParams.get('sort') || '-createdAt'
  const currentQuery = searchParams.get('q') || ''

  const [searchTerm, setSearchTerm] = useState(currentQuery)

  const hasPrevPage = page > 1
  const hasNextPage = page < totalPages

  const columns = buildColumns()

  const table = useReactTable({
    data: tramites,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const navigateToPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(newPage))
    router.push(`?${params.toString()}`)
  }

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString())

    if (searchTerm) {
      params.set('q', searchTerm)
    } else {
      params.delete('q')
    }

    params.set('page', '1')
    router.push(`?${params.toString()}`)
  }

  const handleClear = () => {
    setSearchTerm('')

    const params = new URLSearchParams(searchParams.toString())
    params.delete('q')
    params.set('page', '1')

    router.push(`?${params.toString()}`)
  }

  const handleSort = (columnId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    const isCurrentDesc = currentSort === `-${columnId}`
    const isCurrentAsc = currentSort === columnId

    if (isCurrentAsc) {
      params.set('sort', `-${columnId}`)
    } else if (isCurrentDesc) {
      params.delete('sort')
    } else {
      params.set('sort', columnId)
    }

    params.set('page', '1')
    router.push(`?${params.toString()}`)
  }

  return (
    <section className="space-y-4">
      <section className="flex items-center justify-between gap-4">
        <BuscarForm
          value={searchTerm}
          onChange={setSearchTerm}
          onSearch={handleSearch}
          onClear={handleClear}
          label="Buscar trámites"
          placeholder="Buscar por FUT, DNI o nombre..."
          clearDisabled={!(searchTerm || currentQuery)}
          className="flex max-w-lg flex-1 gap-2"
        />

        <Link href="/tramite/nuevo" className="btn btn-primary btn-sm">
          <IconFilePlus size={18} aria-hidden="true" />
          Nuevo Trámite
        </Link>
      </section>

      <section className="bg-base-100 rounded-box overflow-hidden shadow">
        <section className="overflow-x-auto">
          <table className="table-zebra table w-full" aria-label="Lista de trámites recientes">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const columnId = header.column.id
                    const isSortable = ['fut', 'fechaInicio'].includes(columnId)

                    return (
                      <th
                        key={header.id}
                        className={twJoin(
                          isSortable &&
                            'hover:bg-base-200 cursor-pointer transition-colors select-none',
                        )}
                        onClick={() => isSortable && handleSort(columnId)}
                      >
                        <section className="flex items-center gap-2">
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                          {isSortable && getSortIcon(currentSort, columnId)}
                        </section>
                      </th>
                    )
                  })}
                </tr>
              ))}
            </thead>

            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="py-8 text-center">
                    No hay trámites para mostrar
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </section>

      {totalPages > 1 && (
        <section className="flex items-center justify-between">
          <output className="text-base-content/60 text-sm" aria-live="polite">
            Página {page} de {totalPages} - {totalDocs} trámites en total
          </output>
          <nav aria-label="Paginación de trámites">
            <section className="join">
              <button
                className={twJoin('join-item btn btn-sm', !hasPrevPage && 'btn-disabled')}
                onClick={() => navigateToPage(page - 1)}
                disabled={!hasPrevPage}
              >
                <IconChevronLeft size={16} aria-hidden="true" />
                Anterior
              </button>
              <button
                className={twJoin('join-item btn btn-sm', !hasNextPage && 'btn-disabled')}
                onClick={() => navigateToPage(page + 1)}
                disabled={!hasNextPage}
              >
                Siguiente
                <IconChevronRight size={16} aria-hidden="true" />
              </button>
            </section>
          </nav>
        </section>
      )}
    </section>
  )
}
