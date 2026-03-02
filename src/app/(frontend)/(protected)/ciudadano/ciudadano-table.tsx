'use client'

import type { Ciudadano } from '@/payload-types'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useRouter, useSearchParams } from 'next/navigation'
import { twJoin } from 'tailwind-merge'

const columnHelper = createColumnHelper<Ciudadano>()

const COLUMNS = [
  columnHelper.accessor('dni', {
    header: 'DNI',
  }),
  columnHelper.accessor((row) => `${row.apellido}, ${row.nombre}`, {
    id: 'nombre_completo',
    header: 'Nombre Completo',
  }),
  columnHelper.accessor('email', {
    header: 'Email',
  }),
  columnHelper.accessor('fecha_nacimiento', {
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

  const hasPrevPage = page > 1
  const hasNextPage = page < totalPages

  return (
    <div className="space-y-4">
      <div className="bg-base-100 rounded-box overflow-hidden shadow">
        <div className="overflow-x-auto">
          <table className="table-zebra table w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
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
