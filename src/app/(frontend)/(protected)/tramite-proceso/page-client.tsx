'use client'
import { deleteTramiteProceso } from '@/app/actions/tramites'
import type { TramiteProceso } from '@/payload-types'
import { TramiteProcesoForm } from '@/web/ui/organisms/tramite-proceso-form'
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface Props {
  tramiteProcesos: TramiteProceso[]
}
export function TramiteProcesoPageClient({ tramiteProcesos }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('¿Está seguro de eliminar este registro?')) return

    const res = await deleteTramiteProceso(id)

    if (res?.ok) {
      toast.success('Registro eliminado')
    } else {
      toast.error('Error al eliminar')
    }
  }

  const handleEdit = (item: any) => {
    setEditingItem(item)
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gestión de Trámite Procesos</h2>
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
                <th>Proceso</th>
                <th className="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tramiteProcesos.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-4 text-center">
                    No hay registros
                  </td>
                </tr>
              ) : (
                tramiteProcesos.map((item) => {
                  const tp = item as TramiteProceso
                  // Display logic for Tramite Proceso: Show Citizen Name + DNI
                  let tpDesc = 'Desconocido'
                  let tpFut = 'Sin FUT'

                  if (typeof tp.tramite === 'object') {
                    tpFut = tp.tramite.fut || 'Sin FUT'
                    if (typeof tp.tramite.ciudadano === 'object') {
                      const c = tp.tramite.ciudadano
                      tpDesc = `${c.dni} - ${c.nombre} ${c.apellido}`
                    } else {
                      tpDesc = `Ciudadano ID: ${tp.tramite.ciudadano}`
                    }
                  }

                  return (
                    <tr key={item.id}>
                      <td>
                        <div className="font-bold">{tpDesc}</div>
                        <div className="text-xs opacity-60">FUT: {tpFut}</div>
                      </td>
                      <td>{tp.proceso}</td>

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
            <TramiteProcesoForm
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
