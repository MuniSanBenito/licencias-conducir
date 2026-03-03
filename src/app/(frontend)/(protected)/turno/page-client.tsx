'use client'
import { deleteTurno } from '@/app/actions/turnos'
import type { Turno } from '@/payload-types'
import { TurnoForm } from '@/web/ui/organisms/turno-form'
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface Props {
  turnos: Turno[]
}

export function TurnoPageClient({ turnos }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('¿Está seguro de eliminar este registro?')) return

    const res = await deleteTurno(id)

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
        <h2 className="text-2xl font-bold">Gestión de Turnos</h2>
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
                <th>Ciudadano</th>
                <th>Área</th>
                <th>Inicio</th>
                <th>Fin</th>
                <th>Estado</th>
                <th className="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {turnos.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-4 text-center">
                    No hay registros
                  </td>
                </tr>
              ) : (
                turnos.map((item) => {
                  const tu = item as Turno
                  // Deep access: Turno -> Progreso -> Proceso -> Tramite -> Ciudadano
                  let tuCiudadano = 'Desconocido'

                  // Note: 'tramite' field in Turno relates to TramiteProgreso (confusing name in payload schema but that's what it is)
                  if (typeof tu.tramite === 'object') {
                    const prog = tu.tramite as any // Manual cast to Traverse
                    // Progreso -> Proceso
                    if (typeof prog.tramite_proceso === 'object') {
                      const proc = prog.tramite_proceso
                      // Proceso -> Tramite
                      if (typeof proc.tramite === 'object') {
                        const tram = proc.tramite
                        // Tramite -> Ciudadano
                        if (typeof tram.ciudadano === 'object') {
                          const c = tram.ciudadano
                          tuCiudadano = `${c.dni} - ${c.nombre} ${c.apellido}`
                        }
                      }
                    }
                  }

                  return (
                    <tr key={item.id}>
                      <td>
                        <div className="font-bold">{tuCiudadano}</div>
                      </td>
                      <td>{tu.area}</td>
                      <td>{new Date(tu.fecha_hora_inicio).toLocaleString()}</td>
                      <td>{new Date(tu.fecha_hora_fin).toLocaleString()}</td>
                      <td>
                        <span
                          className={`badge ${
                            tu.estado === 'FINALIZADO'
                              ? 'badge-success'
                              : tu.estado === 'CANCELADO'
                                ? 'badge-error'
                                : tu.estado === 'AUSENTE'
                                  ? 'badge-warning'
                                  : 'badge-info'
                          }`}
                        >
                          {tu.estado}
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
            <TurnoForm
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
