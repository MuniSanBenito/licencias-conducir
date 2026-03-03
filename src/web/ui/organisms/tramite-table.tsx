'use client'
import { deleteTramite } from '@/app/actions/tramites'
import type { Ciudadano, Tramite } from '@/payload-types'
import { TramiteForm } from '@/web/ui/organisms/tramite-form'
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronUp,
  IconEdit,
  IconPlus,
  IconSearch,
  IconSelector,
  IconTrash,
  IconX,
} from '@tabler/icons-react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useRouter, useSearchParams } from 'next/navigation'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { twJoin } from 'tailwind-merge'

const columnHelper = createColumnHelper<Tramite>()

function getCiudadanoLabel(ciudadano: string | Ciudadano): string {
  if (typeof ciudadano === 'object') {
    return `${ciudadano.dni} - ${ciudadano.apellido}, ${ciudadano.nombre}`
  }
  return `ID: ${ciudadano}`
}

function buildColumns(onEdit: (tramite: Tramite) => void, onDelete: (tramite: Tramite) => void) {
  return [
    columnHelper.accessor((row) => getCiudadanoLabel(row.ciudadano), {
      id: 'ciudadano',
      header: 'Ciudadano',
    }),
    columnHelper.accessor('fut', {
      id: 'fut',
      header: 'FUT',
      cell: (info) => info.getValue() || '-',
    }),
    columnHelper.accessor('createdAt', {
      id: 'createdAt',
      header: 'Fecha Inicio',
      cell: (info) => new Date(info.getValue()).toLocaleDateString('es-AR'),
    }),
    columnHelper.display({
      id: 'acciones',
      header: 'Acciones',
      cell: ({ row }) => (
        <div className="flex gap-1">
          <button
            className="btn btn-ghost btn-xs"
            aria-label={`Editar trámite ${row.original.id}`}
            onClick={() => onEdit(row.original)}
          >
            <IconEdit size={16} />
          </button>
          <button
            className="btn btn-ghost btn-xs text-error"
            aria-label={`Eliminar trámite ${row.original.id}`}
            onClick={() => onDelete(row.original)}
          >
            <IconTrash size={16} />
          </button>
        </div>
      ),
    }),
  ]
}

interface TramiteTableProps {
  tramites: Tramite[]
  page: number
  totalPages: number
  totalDocs: number
}

export function TramiteTable({ tramites, page, totalPages, totalDocs }: TramiteTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSort = searchParams.get('sort') || '-createdAt'
  const currentQuery = searchParams.get('q') || ''

  const [searchTerm, setSearchTerm] = useState(currentQuery)

  const [showEditModal, setShowEditModal] = useState(false)
  const deleteModalRef = useRef<HTMLDialogElement>(null)

  const [tramiteToEdit, setTramiteToEdit] = useState<Tramite>()
  const [tramiteToDelete, setTramiteToDelete] = useState<Tramite>()

  const [isDeleting, setIsDeleting] = useState(false)

  const hasPrevPage = page > 1
  const hasNextPage = page < totalPages

  const handleClickCreate = () => {
    setTramiteToEdit(undefined)

    setShowEditModal(true)
  }

  const handleClickEdit = (tramite: Tramite) => {
    setTramiteToEdit(tramite)

    setShowEditModal(true)
  }

  const handleCloseEditModal = () => {
    setShowEditModal(false)

    setTramiteToEdit(undefined)
  }

  const handleDeleteCancel = () => {
    deleteModalRef.current?.close()

    setTramiteToDelete(undefined)
  }

  const handleDeleteConfirm = async () => {
    if (!tramiteToDelete) {
      return
    }

    setIsDeleting(true)

    const res = await deleteTramite(tramiteToDelete.id)

    setIsDeleting(false)
    deleteModalRef.current?.close()

    setTramiteToDelete(undefined)

    if (res.ok) {
      toast.success(res.message)
      router.refresh()
    } else {
      toast.error(res.message)
    }
  }

  const handleClickDelete = (tramite: Tramite) => {
    setTramiteToDelete(tramite)
    deleteModalRef.current?.showModal()
  }

  const columns = buildColumns(handleClickEdit, handleClickDelete)

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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex max-w-lg flex-1 gap-2">
          <input
            type="text"
            placeholder="Buscar por FUT..."
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
        <button className="btn btn-primary btn-sm" onClick={handleClickCreate}>
          <IconPlus />
          Nuevo
        </button>
      </div>

      <div className="bg-base-100 rounded-box overflow-hidden shadow">
        <div className="overflow-x-auto">
          <table className="table-zebra table w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const columnId = header.column.id
                    const isSortable = columnId !== 'acciones'

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
                  <td colSpan={columns.length} className="py-8 text-center">
                    No hay trámites registrados
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

      {/* Modal de crear/editar trámite. Montamos y desmontamos para resetear el form */}
      {showEditModal ? (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="mb-4 text-lg font-bold">
              {tramiteToEdit ? 'Editar Trámite' : 'Nuevo Trámite'}
            </h3>
            <TramiteForm
              defaultValues={tramiteToEdit}
              onSuccess={handleCloseEditModal}
              onError={handleCloseEditModal}
              onCancel={handleCloseEditModal}
            />
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={handleCloseEditModal}>cerrar</button>
          </form>
        </dialog>
      ) : null}

      {/* Modal de confirmación de eliminación */}
      <dialog ref={deleteModalRef} className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Confirmar eliminación</h3>
          {tramiteToDelete && (
            <p className="py-4">
              ¿Estás seguro que deseas eliminar el trámite de{' '}
              <strong>{getCiudadanoLabel(tramiteToDelete.ciudadano)}</strong>
              {tramiteToDelete.fut ? ` (FUT: ${tramiteToDelete.fut})` : ''}? Esta acción no se puede
              deshacer.
            </p>
          )}
          <div className="modal-action">
            <button className="btn btn-ghost" onClick={handleDeleteCancel} disabled={isDeleting}>
              Cancelar
            </button>
            <button className="btn btn-error" onClick={handleDeleteConfirm} disabled={isDeleting}>
              {isDeleting ? 'Eliminando...' : 'Eliminar'}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={handleDeleteCancel}>cerrar</button>
        </form>
      </dialog>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-base-content/60 text-sm">
            Página {page} de {totalPages} — {totalDocs} trámites en total
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
