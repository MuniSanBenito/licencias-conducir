'use client'

import { deleteCiudadano } from '@/app/actions/ciudadano'
import type { Ciudadano } from '@/payload-types'
import { CiudadanoForm } from '@/web/components/forms/ciudadano-form'
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface Props {
  ciudadanos: Ciudadano[]
}
export function CiudadanoPageClient({ ciudadanos }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any | null>(null)

  const handleCreate = () => {
    setEditingItem(null)
    setIsModalOpen(true)
  }

  const handleEdit = (ciudadano: Ciudadano) => {
    setEditingItem(ciudadano)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Está seguro de eliminar este registro?')) return

    const res = await deleteCiudadano(id)

    if (res?.ok) {
      toast.success('Registro eliminado')
    } else {
      toast.error('Error al eliminar')
    }
  }

  const handleSuccess = () => {
    setIsModalOpen(false)
    setEditingItem(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Ciudadanos</h2>
        <button className="btn btn-primary" onClick={handleCreate}>
          <IconPlus size={20} />
          Nuevo Ciudadano
        </button>
      </div>

      <div className="bg-base-100 rounded-box overflow-hidden shadow">
        <div className="overflow-x-auto">
          <table className="table-zebra table w-full">
            <thead>
              <tr>
                {/* ID Column Removed */}
                <th>Ciudadano (DNI - Nombre)</th>
                <th>Email</th>
                <th>Fecha Nacimiento</th>
                <th className="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ciudadanos.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-4 text-center">
                    No hay registros
                  </td>
                </tr>
              ) : (
                ciudadanos.map((ciudadano) => (
                  <tr key={ciudadano.id}>
                    {/* ID Cell Removed */}
                    <td>
                      <div className="font-bold">{ciudadano.dni}</div>
                      <div className="text-sm opacity-60">
                        {ciudadano.nombre} {ciudadano.apellido}
                      </div>
                    </td>
                    <td>{ciudadano.email}</td>
                    <td>{new Date(ciudadano.fecha_nacimiento).toLocaleDateString('es-AR')}</td>
                    <td className="space-x-2 text-right">
                      <button
                        className="btn btn-ghost btn-xs"
                        onClick={() => handleEdit(ciudadano)}
                      >
                        <IconEdit size={16} />
                      </button>
                      <button
                        className="btn btn-ghost btn-xs text-error"
                        onClick={() => handleDelete(ciudadano.id)}
                      >
                        <IconTrash size={16} />
                      </button>
                    </td>
                  </tr>
                ))
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
            <CiudadanoForm
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
