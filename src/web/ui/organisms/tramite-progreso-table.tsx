'use client'
import { deleteTramiteProgreso } from '@/app/actions/tramites'
import type { TramiteProgreso } from '@/payload-types'
import { TramiteProgresoForm } from '@/web/ui/organisms/tramite-progreso-form'
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

const columnHelper = createColumnHelper<TramiteProgreso>()

function getProgresoLabel(progreso: TramiteProgreso): string {
  if (typeof progreso.tramite_proceso === 'object') {
    const proc = progreso.tramite_proceso
    const procesoName = proc.proceso
    if (typeof proc.tramite === 'object') {
      const tramite = proc.tramite
      if (typeof tramite.ciudadano === 'object') {
        const c = tramite.ciudadano
        return `${c.dni} - ${c.apellido}, ${c.nombre}`
      }
    }
    return procesoName
  }
  return `ID: ${progreso.tramite_proceso}`
}

function getProcesoName(progreso: TramiteProgreso): string {
  if (typeof progreso.tramite_proceso === 'object') {
    return progreso.tramite_proceso.proceso
  }
  return '-'
}

function getEstadoBadgeClass(estado: TramiteProgreso['estado']): string {
  switch (estado) {
    case 'FINALIZADO':
      return 'badge-success'
    case 'CANCELADO':
      return 'badge-error'
    case 'SUSPENDIDO':
      return 'badge-warning'
    default:
      return 'badge-info'
  }
}

function buildColumns(
  onEdit: (progreso: TramiteProgreso) => void,
  onDelete: (progreso: TramiteProgreso) => void,
) {
  return [
    columnHelper.accessor((row) => getProgresoLabel(row), {
      id: 'ciudadano',
      header: 'Ciudadano',
    }),
    columnHelper.accessor((row) => getProcesoName(row), {
      id: 'proceso',
      header: 'Proceso',
    }),
    columnHelper.accessor('etapa', {
      id: 'etapa',
      header: 'Etapa',
    }),
    columnHelper.accessor('estado', {
      id: 'estado',
      header: 'Estado',
      cell: (info) => (
        <span className={twJoin('badge badge-sm', getEstadoBadgeClass(info.getValue()))}>
          {info.getValue()}
        </span>
      ),
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
            aria-label={`Editar progreso ${row.original.id}`}
            onClick={() => onEdit(row.original)}
          >
            <IconEdit size={16} />
          </button>
          <button
            className="btn btn-ghost btn-xs text-error"
            aria-label={`Eliminar progreso ${row.original.id}`}
            onClick={() => onDelete(row.original)}
          >
            <IconTrash size={16} />
          </button>
        </div>
      ),
    }),
  ]
}

interface TramiteProgresoTableProps {
  progresos: TramiteProgreso[]
  page: number
  totalPages: number
  totalDocs: number
}

export function TramiteProgresoTable({
  progresos,
  page,
  totalPages,
  totalDocs,
}: TramiteProgresoTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSort = searchParams.get('sort') || '-createdAt'
  const currentQuery = searchParams.get('q') || ''

  const [searchTerm, setSearchTerm] = useState(currentQuery)

  const [showEditModal, setShowEditModal] = useState(false)
  const deleteModalRef = useRef<HTMLDialogElement>(null)

  const [progresoToEdit, setProgresoToEdit] = useState<TramiteProgreso>()
  const [progresoToDelete, setProgresoToDelete] = useState<TramiteProgreso>()

  const [isDeleting, setIsDeleting] = useState(false)

  const hasPrevPage = page > 1
  const hasNextPage = page < totalPages

  const handleClickCreate = () => {
    setProgresoToEdit(undefined)
    setShowEditModal(true)
  }

  const handleClickEdit = (progreso: TramiteProgreso) => {
    setProgresoToEdit(progreso)
    setShowEditModal(true)
  }

  const handleCloseEditModal = () => {
    setShowEditModal(false)
    setProgresoToEdit(undefined)
  }

  const handleDeleteCancel = () => {
    deleteModalRef.current?.close()
    setProgresoToDelete(undefined)
  }

  const handleDeleteConfirm = async () => {
    if (!progresoToDelete) {
      return
    }

    setIsDeleting(true)

    const res = await deleteTramiteProgreso(progresoToDelete.id)

    setIsDeleting(false)
    deleteModalRef.current?.close()

    setProgresoToDelete(undefined)

    if (res.ok) {
      toast.success(res.message)
      router.refresh()
    } else {
      toast.error(res.message)
    }
  }

  const handleClickDelete = (progreso: TramiteProgreso) => {
    setProgresoToDelete(progreso)
    deleteModalRef.current?.showModal()
  }

  const columns = buildColumns(handleClickEdit, handleClickDelete)

  const table = useReactTable({
    data: progresos,
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
            placeholder="Buscar por estado..."
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
                    const isSortable =
                      columnId !== 'acciones' && columnId !== 'ciudadano' && columnId !== 'proceso'

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
                    No hay progresos registrados
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

      {/* Modal de crear/editar progreso */}
      {showEditModal ? (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="mb-4 text-lg font-bold">
              {progresoToEdit ? 'Editar Progreso' : 'Nuevo Progreso'}
            </h3>
            <TramiteProgresoForm
              defaultValues={progresoToEdit}
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
          {progresoToDelete && (
            <p className="py-4">
              ¿Estás seguro que deseas eliminar el progreso de{' '}
              <strong>{getProgresoLabel(progresoToDelete)}</strong> (Etapa {progresoToDelete.etapa}
              )? Esta acción no se puede deshacer.
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
            Página {page} de {totalPages} — {totalDocs} progresos en total
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
