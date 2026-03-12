'use client'

import type { Ciudadano } from '@/payload-types'
import { sdk } from '@/web/libs/payload/client'
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
import { CiudadanoForm } from '../organisms/ciudadano-form'

const columnHelper = createColumnHelper<Ciudadano>()

function buildColumns(
  onEdit: (ciudadano: Ciudadano) => void,
  onDelete: (ciudadano: Ciudadano) => void,
) {
  return [
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
    columnHelper.accessor('celular', {
      id: 'celular',
      header: 'Celular',
    }),
    columnHelper.accessor('fechaNacimiento', {
      id: 'fecha_nacimiento',
      header: 'Fecha de Nacimiento',
      cell: (info) => new Date(info.getValue()).toLocaleDateString('es-AR'),
    }),
    columnHelper.display({
      id: 'acciones',
      header: 'Acciones',
      cell: ({ row }) => (
        <div className="flex gap-1">
          <button
            className="btn btn-ghost btn-xs"
            aria-label={`Editar ciudadano ${row.original.dni}`}
            onClick={() => onEdit(row.original)}
          >
            <IconEdit size={16} />
          </button>
          <button
            className="btn btn-ghost btn-xs text-error"
            aria-label={`Eliminar ciudadano ${row.original.dni}`}
            onClick={() => onDelete(row.original)}
          >
            <IconTrash size={16} />
          </button>
        </div>
      ),
    }),
  ]
}

interface Props {
  ciudadanos: Ciudadano[]
  page: number
  totalPages: number
  totalDocs: number
}
export function CiudadanosPage({ ciudadanos, page, totalPages, totalDocs }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentSort = searchParams.get('sort') || '-createdAt'
  const currentQuery = searchParams.get('q') || ''

  const [searchTerm, setSearchTerm] = useState(currentQuery)

  const [showEditModal, setShowEditModal] = useState(false)
  const deleteModalRef = useRef<HTMLDialogElement>(null)

  const [ciudadanoToEdit, setCiudadanoToEdit] = useState<Ciudadano>()
  const [ciudadanoToDelete, setCiudadanoToDelete] = useState<Ciudadano>()

  const [isDeleting, setIsDeleting] = useState(false)

  const hasPrevPage = page > 1
  const hasNextPage = page < totalPages

  const handleClickCreate = () => {
    setCiudadanoToEdit(undefined)

    setShowEditModal(true)
  }

  const handleClickEdit = (ciudadano: Ciudadano) => {
    setCiudadanoToEdit(ciudadano)

    setShowEditModal(true)
  }

  const handleCloseEditModal = () => {
    setShowEditModal(false)

    setCiudadanoToEdit(undefined)
  }

  const handleDeleteCancel = () => {
    deleteModalRef.current?.close()

    setCiudadanoToDelete(undefined)
  }

  const handleDeleteConfirm = async () => {
    if (!ciudadanoToDelete) {
      return
    }

    setIsDeleting(true)

    try {
      const response = await sdk.delete({
        collection: 'ciudadano',
        id: ciudadanoToDelete.id,
      })

      if (response?.id) {
        toast.success(
          `Ciudadano ${ciudadanoToDelete.apellido}, ${ciudadanoToDelete.nombre} eliminado correctamente`,
        )
        router.refresh()
      } else {
        throw new Error('Error al eliminar el ciudadano')
      }
    } catch (error) {
      console.error(error)
      toast.error(
        error instanceof Error ? error.message : 'Error desconocido al eliminar el ciudadano',
      )
    }

    setIsDeleting(false)
    deleteModalRef.current?.close()

    setCiudadanoToDelete(undefined)
  }

  const handleClickDelete = (ciudadano: Ciudadano) => {
    setCiudadanoToDelete(ciudadano)
    deleteModalRef.current?.showModal()
  }

  const columns = buildColumns(handleClickEdit, handleClickDelete)

  const table = useReactTable({
    data: ciudadanos,
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
    <section>
      {/* Header */}
      <header className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">Ciudadanos Registrados</h2>
      </header>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex max-w-lg flex-1 gap-2">
            <input
              type="text"
              placeholder="Buscar por DNI, nombre, email o celular..."
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
                    <td colSpan={columns.length} className="py-8 text-center">
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

        {/* Modal de crear/editar ciudadano. motanmos y desmontamos en lugar de via ref para poder "resetear" el form */}
        {showEditModal ? (
          <dialog className="modal modal-open">
            <div className="modal-box">
              <h3 className="mb-4 text-lg font-bold">
                {ciudadanoToEdit ? 'Editar Ciudadano' : 'Nuevo Ciudadano'}
              </h3>
              <CiudadanoForm
                defaultValues={ciudadanoToEdit}
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
          <div className="modal-box max-w-xl">
            <h3 className="text-lg font-bold">Confirmar eliminación</h3>
            {ciudadanoToDelete && (
              <>
                <p className="py-4">
                  ¿Estás seguro que deseas eliminar a{' '}
                  <strong>
                    {ciudadanoToDelete.apellido}, {ciudadanoToDelete.nombre}
                  </strong>{' '}
                  (DNI: {ciudadanoToDelete.dni})? Esta acción no se puede deshacer.
                </p>
                <p></p>
              </>
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
    </section>
  )
}
