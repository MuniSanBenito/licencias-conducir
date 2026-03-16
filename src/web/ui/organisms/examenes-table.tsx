'use client'

import type { Ciudadano, Examan as Examen, Tramite } from '@/payload-types'
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronUp,
  IconSelector,
} from '@tabler/icons-react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { twJoin } from 'tailwind-merge'

interface Props {
  examenes: Examen[]
  page: number
  totalPages: number
  totalDocs: number
}

const columnHelper = createColumnHelper<Examen>()

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
    columnHelper.display({
      id: 'ciudadano',
      header: 'Ciudadano',
      cell: ({ row }) => {
        const ciudadano = row.original.ciudadano as Ciudadano | undefined | string
        if (!ciudadano || typeof ciudadano === 'string') return 'N/A'
        return (
          <section>
            <p className="font-medium">{ciudadano.apellido}, {ciudadano.nombre}</p>
            <p className="text-xs opacity-70">DNI: {ciudadano.dni}</p>
          </section>
        )
      },
    }),
    columnHelper.display({
      id: 'tramite',
      header: 'FUT',
      cell: ({ row }) => {
        const tramite = row.original.tramite as Tramite | undefined | string
        if (!tramite || typeof tramite === 'string') return 'N/A'
        return <span className="font-mono text-sm">{tramite.fut}</span>
      },
    }),
    columnHelper.accessor('estado', {
      id: 'estado',
      header: 'Estado',
      cell: ({ row }) => (
        <span
          className={twJoin(
            'badge badge-sm',
            row.original.estado === 'abierto' ? 'badge-primary' : 'badge-ghost'
          )}
        >
          {row.original.estado.toUpperCase()}
        </span>
      ),
    }),
    columnHelper.display({
      id: 'resultado',
      header: 'Resultado',
      cell: ({ row }) => {
        if (row.original.estado === 'abierto') return <span className="text-xs opacity-50">Pendiente</span>
        const res = row.original.resultado
        if (!res) return 'Sin evaluar'
        return (
          <section>
            <span className={twJoin('badge badge-sm', res.aprobado ? 'badge-success' : 'badge-error')}>
              {res.aprobado ? 'APROBADO' : 'DESAPROBADO'}
            </span>
            {res.puntajeObtenido !== undefined ? <p className="text-xs mt-1">{res.puntajeObtenido} / {res.puntajeTotal}</p> : null}
          </section>
        )
      },
    }),
    columnHelper.accessor('fechaInicio', {
      id: 'fechaInicio',
      header: 'Fecha',
      cell: (info) => {
        const d = new Date(info.getValue())
        return (
          <section>
            <p className="text-sm">{d.toLocaleDateString('es-AR')}</p>
            <p className="text-xs opacity-70">{d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit'})}</p>
          </section>
        )
      },
    }),
    columnHelper.display({
      id: 'acciones',
      header: 'Acciones',
      cell: ({ row }) => (
        <Link
          href={`/gestion-examenes/${row.original.id}`}
          className="btn btn-ghost btn-sm text-primary"
        >
          Ver Detalle
        </Link>
      ),
    }),
  ]
}

export function ExamenesTable({ examenes, page, totalPages, totalDocs }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentSort = searchParams.get('sort') || '-createdAt'

  const hasPrevPage = page > 1
  const hasNextPage = page < totalPages

  const columns = buildColumns()

  const table = useReactTable({
    data: examenes,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const navigateToPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(newPage))
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
      <section className="bg-base-100 rounded-box overflow-hidden shadow">
        <section className="overflow-x-auto">
          <table className="table-zebra table w-full" aria-label="Historial de exámenes">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const columnId = header.column.id
                    const isSortable = ['estado', 'fechaInicio'].includes(columnId)

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
                    No hay exámenes registrados
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

      {totalPages > 0 && (
        <section className="flex items-center justify-between">
          <output className="text-base-content/60 text-sm" aria-live="polite">
            Página {page} de {totalPages} - {totalDocs} exámenes en total
          </output>
          <nav aria-label="Paginación de exámenes">
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
