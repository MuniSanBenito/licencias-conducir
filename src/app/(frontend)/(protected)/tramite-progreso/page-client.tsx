'use client'
import { deleteTramiteProgreso } from '@/app/actions/tramites'
import type { TramiteProgreso } from '@/payload-types'
import { TramiteProgresoForm } from '@/web/components/forms/tramite-progreso-form'
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface Props {
  tramiteProgresos: TramiteProgreso[]
}

export function TramiteProgresoPageClient({ tramiteProgresos }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('¿Está seguro de eliminar este registro?')) return

    const res = await deleteTramiteProgreso(id)
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
        <h2 className="text-2xl font-bold">Gestión de Trámite Progresos</h2>
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
                <th>Progreso (Ciudadano - Etapa)</th>
                <th>Estado</th>
                <th className="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tramiteProgresos.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-4 text-center">
                    No hay registros
                  </td>
                </tr>
              ) : (
                tramiteProgresos.map((item) => {
                  const tprog = item as TramiteProgreso
                  // Display logic for Tramite Progreso: Show Citizen Name + DNI + Stage
                  let progCiudadano = 'Desconocido'
                  let progFut = 'Sin FUT'

                  if (typeof tprog.tramite_proceso === 'object') {
                    const proc = tprog.tramite_proceso
                    if (typeof proc.tramite === 'object') {
                      const tr = proc.tramite
                      progFut = tr.fut || 'Sin FUT'
                      if (typeof tr.ciudadano === 'object') {
                        const c = tr.ciudadano
                        progCiudadano = `${c.dni} - ${c.nombre} ${c.apellido}`
                      }
                    }
                  }

                  return (
                    <tr key={item.id}>
                      <td>
                        <div className="font-bold">Etapa {tprog.etapa}</div>
                        <div className="text-sm">{progCiudadano}</div>
                        <div className="text-xs opacity-60">FUT: {progFut}</div>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            tprog.estado === 'FINALIZADO'
                              ? 'badge-success'
                              : tprog.estado === 'CANCELADO'
                                ? 'badge-error'
                                : 'badge-ghost'
                          }`}
                        >
                          {tprog.estado}
                        </span>
                      </td>

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
            <TramiteProgresoForm
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
