'use client'

import type { Ciudadano } from '@/payload-types'
import { IconPlus } from '@tabler/icons-react'
import { useState } from 'react'

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
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Ciudadanos</h2>
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
                {/* ID Column Removed */}
                <th>Ciudadano (DNI - Nombre)</th>
                <th>Email</th>
                <th>Fecha Nacimiento</th>
                <th className="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-4 text-center">
                    No hay registros
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr key={item.id}>
                    {/* ID Cell Removed */}
                    {renderRow(item)}
                    <td className="space-x-2 text-right">
                      <button className="btn btn-ghost btn-xs" onClick={() => handleEdit(item)}>
                        <IconEdit size={16} />
                      </button>
                      <button
                        className="btn btn-ghost btn-xs text-error"
                        onClick={() => handleDelete(item.id)}
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
            <FormComponent
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
