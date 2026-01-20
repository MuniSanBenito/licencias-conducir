'use client'

import { deleteCiudadano } from '@/app/actions/ciudadano'
import { deleteTramite, deleteTramiteProceso, deleteTramiteProgreso } from '@/app/actions/tramites'
import { deleteTurno } from '@/app/actions/turnos'
import type { Ciudadano, Tramite, TramiteProceso, TramiteProgreso, Turno } from '@/payload-types'
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react'
import { useState, type ComponentType } from 'react'
import { toast } from 'sonner'

interface ResourceManagerProps {
  collection: string
  title: string
  data: any[]
  FormComponent: ComponentType<{
    initialData?: any
    onSuccess: () => void
    onCancel: () => void
  }>
}

export function ResourceManager({ collection, title, data, FormComponent }: ResourceManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('¿Está seguro de eliminar este registro?')) return

    let res
    switch (collection) {
      case 'ciudadano':
        res = await deleteCiudadano(id)
        break
      case 'tramite':
        res = await deleteTramite(id)
        break
      case 'tramite-proceso':
        res = await deleteTramiteProceso(id)
        break
      case 'tramite-progreso':
        res = await deleteTramiteProgreso(id)
        break
      case 'turno':
        res = await deleteTurno(id)
        break
    }

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

  const renderHeaders = () => {
    switch (collection) {
      case 'ciudadano':
        return (
          <>
            <th>Ciudadano (DNI - Nombre)</th>
            <th>Email</th>
            <th>Fecha Nacimiento</th>
          </>
        )
      case 'tramite':
        return (
          <>
            <th>Tramite (Ciudadano)</th>
            <th>FUT</th>
            <th>Fecha Inicio</th>
          </>
        )
      case 'tramite-proceso':
        return (
          <>
            <th>Tramite (Ciudadano)</th>
            <th>Proceso</th>
          </>
        )
      case 'tramite-progreso':
        return (
          <>
            <th>Progreso (Ciudadano - Etapa)</th>
            <th>Estado</th>
          </>
        )
      case 'turno':
        return (
          <>
            <th>Ciudadano</th>
            <th>Área</th>
            <th>Inicio</th>
            <th>Fin</th>
            <th>Estado</th>
          </>
        )
      default:
        return <th>Item</th>
    }
  }

  const renderRow = (item: any) => {
    switch (collection) {
      case 'ciudadano':
        const c = item as Ciudadano
        return (
          <>
            <td>
              <div className="font-bold">{c.dni}</div>
              <div className="text-sm opacity-60">
                {c.nombre} {c.apellido}
              </div>
            </td>
            <td>{c.email}</td>
            <td>{new Date(c.fecha_nacimiento).toLocaleDateString()}</td>
          </>
        )
      case 'tramite':
        const t = item as Tramite
        const ciudadanoName =
          typeof t.ciudadano === 'object'
            ? `${t.ciudadano.dni} - ${t.ciudadano.nombre} ${t.ciudadano.apellido}`
            : 'ID: ' + t.ciudadano
        return (
          <>
            <td>{ciudadanoName}</td>
            <td>{t.fut || '-'}</td>
            <td>{new Date(t.createdAt).toLocaleDateString()}</td>
          </>
        )
      case 'tramite-proceso':
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
          <>
            <td>
              <div className="font-bold">{tpDesc}</div>
              <div className="text-xs opacity-60">FUT: {tpFut}</div>
            </td>
            <td>{tp.proceso}</td>
          </>
        )
      case 'tramite-progreso':
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
          <>
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
          </>
        )
      case 'turno':
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
          <>
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
          </>
        )
      default:
        return <td>{JSON.stringify(item).substring(0, 50)}...</td>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{title}</h2>
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
                {renderHeaders()}
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
