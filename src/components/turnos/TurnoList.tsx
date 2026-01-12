'use client'

import type { Appointment, Area, User } from '@/lib/mock-db'
import { IconBuilding, IconCalendar, IconSearch, IconUser } from '@tabler/icons-react'
import { useMemo, useState } from 'react'

interface TurnoListProps {
  initialAppointments: Appointment[]
  areas: Area[]
  users: User[]
}

export function TurnoList({ initialAppointments, areas, users }: TurnoListProps) {
  const [filterAreaId, setFilterAreaId] = useState('')
  const [filterUserId, setFilterUserId] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredAppointments = useMemo(() => {
    return initialAppointments.filter((apt) => {
      const matchArea = filterAreaId ? apt.areaId === filterAreaId : true
      const matchUser = filterUserId ? apt.userId === filterUserId : true
      const matchSearch = searchTerm
        ? apt.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          apt.customerDni.includes(searchTerm)
        : true
      return matchArea && matchUser && matchSearch
    })
  }, [initialAppointments, filterAreaId, filterUserId, searchTerm])

  const getAreaName = (id: string) => areas.find((a) => a.id === id)?.name || 'Desconocido'
  const getUserName = (id: string) => users.find((u) => u.id === id)?.name || 'Desconocido'

  return (
    <div className="space-y-4 p-4">
      <div className="bg-base-100 rounded-box flex flex-col gap-4 p-4 shadow md:flex-row">
        <fieldset className="fieldset w-full md:w-1/3">
          <legend className="fieldset-legend flex items-center gap-2">
            <IconBuilding size={16} /> Filtrar por Area
          </legend>
          <select
            className="select w-full"
            value={filterAreaId}
            onChange={(e) => setFilterAreaId(e.target.value)}
          >
            <option value="">Todas las areas</option>
            {areas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.name}
              </option>
            ))}
          </select>
        </fieldset>

        <fieldset className="fieldset w-full md:w-1/3">
          <legend className="fieldset-legend flex items-center gap-2">
            <IconUser size={16} /> Filtrar por Usuario
          </legend>
          <select
            className="select w-full"
            value={filterUserId}
            onChange={(e) => setFilterUserId(e.target.value)}
          >
            <option value="">Todos los usuarios</option>
            {users
              .filter((u) => !filterAreaId || u.areaId === filterAreaId)
              .map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
          </select>
        </fieldset>

        <fieldset className="fieldset w-full md:w-1/3">
          <legend className="fieldset-legend flex items-center gap-2">
            <IconSearch size={16} /> Buscar Cliente
          </legend>
          <input
            type="text"
            className="input w-full"
            placeholder="Nombre o DNI..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </fieldset>
      </div>

      <div className="bg-base-100 rounded-box overflow-x-auto shadow">
        <table className="table">
          <thead>
            <tr>
              <th>Fecha y Hora</th>
              <th>Cliente</th>
              <th>DNI</th>
              <th>Area</th>
              <th>Profesional</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-base-content/60 py-8 text-center">
                  No se encontraron turnos
                </td>
              </tr>
            ) : (
              filteredAppointments.map((apt) => (
                <tr key={apt.id} className="hover">
                  <td>
                    <div className="flex items-center gap-2">
                      <IconCalendar size={18} className="text-primary" />
                      <span className="font-medium">{new Date(apt.date).toLocaleDateString()}</span>
                      <span className="badge badge-ghost">{apt.time}</span>
                    </div>
                  </td>
                  <td>{apt.customerName}</td>
                  <td>{apt.customerDni}</td>
                  <td>
                    <div className="badge badge-outline">{getAreaName(apt.areaId)}</div>
                  </td>
                  <td>{getUserName(apt.userId)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
