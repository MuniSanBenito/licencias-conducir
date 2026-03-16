'use client'

import type { Pregunta } from '@/payload-types'
import { BuscarForm } from '@/web/ui/atoms/buscar-form'
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronUp,
  IconFilePlus,
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
import { useState } from 'react'
import { twJoin } from 'tailwind-merge'

interface Props {
  preguntas: Pregunta[]
  page: number
  totalPages: number
  totalDocs: number
}

const columnHelper = createColumnHelper<Pregunta>()

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
    columnHelper.accessor('consigna', {
      id: 'consigna',
      header: 'Consigna',
      cell: ({ row }) => (
        <section className="max-w-xs truncate" title={row.original.consigna}>
          {row.original.consigna}
        </section>
      ),
    }),
    columnHelper.display({
      id: 'clases',
      header: 'Clases',
      cell: ({ row }) => (
        <section className="flex flex-wrap gap-1">
          {row.original.clases.map((clase) => (
            <span key={`${row.original.id}-${clase}`} className="badge badge-info badge-sm">
              {clase}
            </span>
          ))}
        </section>
      ),
    }),
    columnHelper.display({
      id: 'opciones',
      header: 'Opciones',
      cell: ({ row }) => (
        <span className="text-sm opacity-80">
          {row.original.opciones?.length || 0} opciones
        </span>
      ),
    }),
    columnHelper.display({
      id: 'acciones',
      header: 'Acciones',
      cell: ({ row }) => (
        <Link
          href={`/gestion-examenes/preguntas/${row.original.id}`}
          className="btn btn-ghost btn-sm text-primary"
        >
          Editar
        </Link>
      ),
    }),
  ]
}

export function PreguntasTable({ preguntas, page, totalPages, totalDocs }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentSort = searchParams.get('sort') || '-createdAt'
  const currentQuery = searchParams.get('q') || ''

  const [searchTerm, setSearchTerm] = useState(currentQuery)

  const hasPrevPage = page > 1
  const hasNextPage = page < totalPages

  const columns = buildColumns()

  const table = useReactTable({
    data: preguntas,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  // same logic 
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
          label="Buscar preguntas"
          placeholder="Buscar por consigna..."
          clearDisabled={!(searchTerm || currentQuery)}
          className="flex max-w-lg flex-1 gap-2"
        />

        <Link href="/gestion-examenes/preguntas/nueva" className="btn btn-primary btn-sm">
          <IconFilePlus size={18} aria-hidden="true" />
          Nueva Pregunta
        </Link>
      </section>

      <section className="bg-base-100 rounded-box overflow-hidden shadow">
        <section className="overflow-x-auto">
          <table className="table-zebra table w-full" aria-label="Lista de preguntas">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const columnId = header.column.id
                    const isSortable = ['consigna'].includes(columnId)

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
                    No hay preguntas para mostrar
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
            Página {page} de {totalPages} - {totalDocs} preguntas en total
          </output>
          <nav aria-label="Paginación de preguntas">
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
