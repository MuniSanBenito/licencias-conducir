'use client'

import type { Ciudadano } from '@/payload-types'
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronUp,
  IconSearch,
  IconSelector,
  IconX,
} from '@tabler/icons-react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { twJoin } from 'tailwind-merge'

const columnHelper = createColumnHelper<Ciudadano>()

const COLUMNS = [
  columnHelper.accessor('dni', {
    id: 'dni',
    header: 'DNI',
  }),
  columnHelper.accessor((row) => `${row.apellido}, ${row.nombre}`, {
    id: 'apellido', // Usamos apellido para el sorting de esta columna
    header: 'Nombre Completo',
  }),
  columnHelper.accessor('email', {
    id: 'email',
    header: 'Email',
  }),
  columnHelper.accessor('fecha_nacimiento', {
    id: 'fecha_nacimiento',
    header: 'Fecha de Nacimiento',
    cell: (info) => new Date(info.getValue()).toLocaleDateString('es-AR'),
  }),
]

interface CiudadanoTableProps {
  ciudadanos: Ciudadano[]
  page: number
  totalPages: number
  totalDocs: number
}

export function CiudadanoTable({ ciudadanos, page, totalPages, totalDocs }: CiudadanoTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSort = searchParams.get('sort') || '-createdAt'
  const currentQuery = searchParams.get('q') || ''

  const [searchTerm, setSearchTerm] = useState(currentQuery)

  const table = useReactTable({
    data: ciudadanos,
    columns: COLUMNS,
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
    params.set('page', '1') // Reiniciar a la primera página al buscar
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
      params.delete('sort') // Vuelve al default (-createdAt)
    } else {
      params.set('sort', columnId)
    }

    params.set('page', '1') // Reiniciar a la primera página al cambiar el orden
    router.push(`?${params.toString()}`)
  }

  const getSortIcon = (columnId: string) => {
    if (currentSort === columnId) return <IconChevronUp size={14} className="text-primary" />
    if (currentSort === `-${columnId}`)
      return <IconChevronDown size={14} className="text-primary" />
    return <IconSelector size={14} className="opacity-20" />
  }

  const hasPrevPage = page > 1
  const hasNextPage = page < totalPages

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex max-w-lg flex-1 gap-2">
          <input
            type="text"
            placeholder="Buscar por DNI, nombre o email..."
            className="input input-bordered input-sm flex-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button className="btn btn-primary btn-sm" onClick={handleSearch}>
            <IconSearch size={18} />
            Buscar
          </button>
          <button
            className="btn btn-ghost btn-sm"
            onClick={handleClear}
            disabled={!(searchTerm || currentQuery)}
          >
            <IconX size={18} />
            Limpiar
          </button>
        </div>
      </div>

      <div className="bg-base-100 rounded-box overflow-hidden shadow">
        <div className="overflow-x-auto">
          <table className="table-zebra table w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const columnId = header.column.id
                    const isSortable = columnId !== 'acciones' // Todas menos acciones si las hubiera

                    return (
                      <th
                        key={header.id}
                        className={twJoin(
                          isSortable &&
                            'hover:bg-base-200 cursor-pointer transition-colors select-none',
                        )}
                        onClick={() => isSortable && handleSort(columnId)}
                      >
                        <div className="flex items-center gap-2">
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                          {isSortable && getSortIcon(columnId)}
                        </div>
                      </th>
                    )
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={COLUMNS.length} className="py-8 text-center">
                    No hay ciudadanos registrados
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
        </div>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-base-content/60 text-sm">
            Página {page} de {totalPages} — {totalDocs} ciudadanos en total
          </span>
          <div className="join">
            <button
              className={twJoin('join-item btn btn-sm', !hasPrevPage && 'btn-disabled')}
              onClick={() => navigateToPage(page - 1)}
              disabled={!hasPrevPage}
            >
              <IconChevronLeft size={16} />
              Anterior
            </button>
            <button
              className={twJoin('join-item btn btn-sm', !hasNextPage && 'btn-disabled')}
              onClick={() => navigateToPage(page + 1)}
              disabled={!hasNextPage}
            >
              Siguiente
              <IconChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
