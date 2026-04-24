'use client'

import {
  ESTADO_TRAMITE,
  ESTADO_TRAMITE_BADGE_SOFT_SM_CLASS,
  ESTADO_TRAMITE_LABELS,
  TIPO_TRAMITE_BADGE_SM_CLASS,
  TIPO_TRAMITE_LABELS,
  tipoRequiereCurso,
} from '@/constants/tramites'
import type { Ciudadano, Tramite } from '@/payload-types'
import { BuscarForm } from '@/web/ui/atoms/buscar-form'
import {
  IconCheck,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronUp,
  IconClock,
  IconFilePlus,
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

interface Props {
  tramites: TramiteConCiudadano[]
  page: number
  totalPages: number
  totalDocs: number
}

const columnHelper = createColumnHelper<TramiteConCiudadano>()

function getTurnoResumen(tramite: TramiteConCiudadano) {
  const requiereCurso = tipoRequiereCurso(tramite.tipo)
  const cursoProgramado = Boolean(tramite.turnoCurso?.estado && tramite.turnoCurso.estado !== 'cancelado')
  const psicoProgramado = Boolean(tramite.turnoPsicofisico?.estado && tramite.turnoPsicofisico.estado !== 'cancelado')

  return { requiereCurso, cursoProgramado, psicoProgramado }
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
    columnHelper.accessor((row) => row.fut || '—', {
      id: 'fut',
      header: 'FUT',
      cell: ({ row }) => (
        <Link
          href={`/tramite/${row.original.id}`}
          className="link link-primary font-mono text-sm font-bold"
          aria-label={`Ver detalle del trámite ${row.original.fut || row.original.id}`}
        >
          {row.original.fut || '—'}
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
    columnHelper.accessor('tipo', {
      id: 'tipo',
      header: 'Tipo',
      cell: ({ row }) => (
        <span className={TIPO_TRAMITE_BADGE_SM_CLASS[row.original.tipo]}>
          {TIPO_TRAMITE_LABELS[row.original.tipo]}
        </span>
      ),
    }),
    columnHelper.display({
      id: 'turnos',
      header: 'Turnos',
      cell: ({ row }) => {
        const { requiereCurso, cursoProgramado, psicoProgramado } = getTurnoResumen(row.original)

        return (
          <section className="flex flex-col gap-1">
            {requiereCurso && (
              <span className="flex items-center gap-1 text-xs">
                {cursoProgramado ? (
                  <IconCheck size={12} className="text-success" />
                ) : (
                  <IconClock size={12} className="text-warning" />
                )}
                Curso
              </span>
            )}
            <span className="flex items-center gap-1 text-xs">
              {psicoProgramado ? (
                <IconCheck size={12} className="text-success" />
              ) : (
                <IconClock size={12} className="text-warning" />
              )}
              Psicofísico
            </span>
          </section>
        )
      },
    }),
    columnHelper.accessor('estado', {
      id: 'estado',
      header: 'Estado',
      cell: ({ row }) => (
        <span className={ESTADO_TRAMITE_BADGE_SOFT_SM_CLASS[row.original.estado]}>
          {row.original.estado === ESTADO_TRAMITE.COMPLETADO && <IconCheck size={12} />}
          {row.original.estado === ESTADO_TRAMITE.CANCELADO && <IconX size={12} />}
          {ESTADO_TRAMITE_LABELS[row.original.estado]}
        </span>
      ),
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
