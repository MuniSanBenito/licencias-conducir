'use client'
import { deleteTramite } from '@/app/actions/tramites'
import type { Tramite } from '@/payload-types'
import { TramiteForm } from '@/web/ui/organisms/tramite-form'
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface Props {
  tramites: Tramite[]
}
export function TramitePageClient({ tramites }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any | null>(null)

  const handleEdit = (tramite: Tramite) => {
    setEditingItem(tramite)
    setIsModalOpen(true)
  }

  const handleCreate = () => {
    setEditingItem(null)
    setIsModalOpen(true)
  }

  const handleSuccess = () => {
    setIsModalOpen(false)
    setEditingItem(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Está seguro de eliminar este registro?')) return
    const res = await deleteTramite(id)

    if (res?.ok) {
      toast.success('Registro eliminado')
    } else {
      toast.error('Error al eliminar')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gestión de Trámites</h2>
        <button className="btn btn-primary" onClick={handleCreate}>
          <IconPlus size={20} />
          Nuevo
        </button>
      </div>

      <div className="bg-base-100 rounded-box overflow-hidden shadow">
        <div className="overflow-x-auto">
          <table className="table-zebra table w-full">
            <thead>
              <tr>
                <th>Tramite (Ciudadano)</th>
                <th>FUT</th>
                <th>Fecha Inicio</th>
                <th className="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tramites.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-4 text-center">
                    No hay registros
                  </td>
                </tr>
              ) : (
                tramites.map((tramite) => {
                  const ciudadanoName =
                    typeof tramite.ciudadano === 'object'
                      ? `${tramite.ciudadano.dni} - ${tramite.ciudadano.nombre} ${tramite.ciudadano.apellido}`
                      : 'ID: ' + tramite.ciudadano

                  return (
                    <tr key={tramite.id}>
                      <td>{ciudadanoName}</td>
                      <td>{tramite.fut || '-'}</td>
                      <td>{new Date(tramite.createdAt).toLocaleDateString('es-AR')}</td>

                      <td className="space-x-2 text-right">
                        <button
                          className="btn btn-ghost btn-xs"
                          onClick={() => handleEdit(tramite)}
                        >
                          <IconEdit size={16} />
                        </button>
                        <button
                          className="btn btn-ghost btn-xs text-error"
                          onClick={() => handleDelete(tramite.id)}
                        >
                          <IconTrash size={16} />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="mb-4 text-lg font-bold">
              {editingItem ? 'Editar Registro' : 'Nuevo Registro'}
            </h3>
            <TramiteForm
              initialData={editingItem}
              onSuccess={handleSuccess}
              onCancel={() => setIsModalOpen(false)}
            />
          </div>
          <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}></div>
        </div>
      )}
    </div>
  )
}
