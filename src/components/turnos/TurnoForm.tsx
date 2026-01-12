'use client'

import { createAppointmentAction } from '@/actions/turnos'
import type { Area, CreateAppointmentRequest, User } from '@/lib/mock-db'
import { useState } from 'react'

interface TurnoFormProps {
  areas: Area[]
  users: User[] // All users, filtered clientside or passed filtered
}

export function TurnoForm({ areas, users }: TurnoFormProps) {
  const [selectedAreaId, setSelectedAreaId] = useState<string>('')
  const [formData, setFormData] = useState({
    userId: '',
    date: '',
    time: '',
    customerName: '',
    customerDni: '',
  })
  const [loading, setLoading] = useState(false)

  const filteredUsers = users.filter((u) => u.areaId === selectedAreaId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const request: CreateAppointmentRequest = {
      areaId: selectedAreaId,
      userId: formData.userId,
      date: formData.date,
      time: formData.time,
      customerName: formData.customerName,
      customerDni: formData.customerDni,
    }

    try {
      await createAppointmentAction(request)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-base-100 rounded-box mx-auto flex max-w-md flex-col gap-4 p-4 shadow-xl"
    >
      <h2 className="mb-4 text-center text-2xl font-bold">Nuevo Turno</h2>

      <fieldset className="fieldset w-full">
        <legend className="fieldset-legend">Area</legend>
        <select
          className="select w-full"
          value={selectedAreaId}
          onChange={(e) => {
            setSelectedAreaId(e.target.value)
            setFormData((prev) => ({ ...prev, userId: '' })) // Reset user
          }}
          required
        >
          <option value="" disabled>
            Seleccione un area
          </option>
          {areas.map((area) => (
            <option key={area.id} value={area.id}>
              {area.name}
            </option>
          ))}
        </select>
      </fieldset>

      <fieldset className="fieldset w-full">
        <legend className="fieldset-legend">Usuario (Profesional)</legend>
        <select
          name="userId"
          className="select w-full"
          value={formData.userId}
          onChange={handleChange}
          disabled={!selectedAreaId}
          required
        >
          <option value="" disabled>
            Seleccione un usuario
          </option>
          {filteredUsers.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </fieldset>

      <div className="flex gap-4">
        <fieldset className="fieldset w-1/2">
          <legend className="fieldset-legend">Fecha</legend>
          <input
            type="date"
            name="date"
            className="input w-full"
            value={formData.date}
            onChange={handleChange}
            required
            min={new Date().toISOString().split('T')[0]}
          />
        </fieldset>
        <fieldset className="fieldset w-1/2">
          <legend className="fieldset-legend">Hora</legend>
          <input
            type="time"
            name="time"
            className="input w-full"
            value={formData.time}
            onChange={handleChange}
            required
          />
        </fieldset>
      </div>

      <fieldset className="fieldset w-full">
        <legend className="fieldset-legend">Nombre del Cliente</legend>
        <input
          type="text"
          name="customerName"
          className="input w-full"
          placeholder="Juan Perez"
          value={formData.customerName}
          onChange={handleChange}
          required
        />
      </fieldset>

      <fieldset className="fieldset w-full">
        <legend className="fieldset-legend">DNI del Cliente</legend>
        <input
          type="text"
          name="customerDni"
          className="input w-full"
          placeholder="12345678"
          value={formData.customerDni}
          onChange={handleChange}
          required
        />
      </fieldset>

      <button type="submit" className="btn btn-primary mt-4 w-full" disabled={loading}>
        {loading ? <span className="loading loading-spinner"></span> : 'Crear Turno'}
      </button>
    </form>
  )
}
