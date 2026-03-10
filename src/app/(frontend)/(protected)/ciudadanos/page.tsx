'use client'

import { IconSearch, IconUserPlus, IconX } from '@tabler/icons-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useCiudadanos } from '../hooks'
import { addCiudadano } from '../store'
import type { Ciudadano } from '../types'

export default function CiudadanosPage() {
  const ciudadanos = useCiudadanos()
  const [busqueda, setBusqueda] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<Ciudadano>({
    dni: '',
    nombre: '',
    apellido: '',
    celular: '',
    fechaNacimiento: '',
    domicilio: '',
  })

  const q = busqueda.toLowerCase().trim()
  const filtrados = q
    ? ciudadanos.filter(
        (c) =>
          c.dni.includes(q) ||
          c.nombre.toLowerCase().includes(q) ||
          c.apellido.toLowerCase().includes(q),
      )
    : ciudadanos

  const handleSubmit = () => {
    if (!form.dni || !form.nombre || !form.apellido) {
      toast.error('Completá al menos DNI, nombre y apellido')
      return
    }
    const yaExiste = ciudadanos.some((c) => c.dni === form.dni)
    if (yaExiste) {
      toast.error('Ya existe un ciudadano con ese DNI')
      return
    }
    addCiudadano({ ...form })
    setForm({ dni: '', nombre: '', apellido: '', celular: '', fechaNacimiento: '', domicilio: '' })
    setShowForm(false)
    toast.success(`Ciudadano ${form.apellido}, ${form.nombre} registrado correctamente`)
  }

  return (
    <section>
      {/* Header */}
      <header className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">Ciudadanos Registrados</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
          aria-expanded={showForm}
          aria-controls="form-ciudadano"
        >
          {showForm ? (
            <>
              <IconX size={18} />
              Cancelar
            </>
          ) : (
            <>
              <IconUserPlus size={18} />
              Nuevo Ciudadano
            </>
          )}
        </button>
      </header>

      {/* Búsqueda */}
      <label className="input input-bordered mb-6 flex max-w-md items-center gap-2">
        <IconSearch size={16} className="opacity-50" />
        <input
          type="search"
          className="grow"
          placeholder="Buscar por DNI, nombre o apellido..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          aria-label="Buscar ciudadanos"
        />
      </label>

      {/* Formulario inline */}
      {showForm && (
        <section
          id="form-ciudadano"
          className="card card-border bg-base-100 mb-6"
          aria-label="Formulario de nuevo ciudadano"
        >
          <article className="card-body">
            <h3 className="card-title text-base">Registrar Nuevo Ciudadano</h3>
            <section className="mt-2 grid grid-cols-3 gap-4">
              <fieldset className="fieldset">
                <label className="fieldset-legend" htmlFor="ciudadano-dni">
                  DNI
                </label>
                <input
                  id="ciudadano-dni"
                  className="input input-bordered w-full"
                  placeholder="Ej: 30456789"
                  value={form.dni}
                  onChange={(e) => setForm({ ...form, dni: e.target.value })}
                  required
                  aria-required="true"
                />
              </fieldset>
              <fieldset className="fieldset">
                <label className="fieldset-legend" htmlFor="ciudadano-nombre">
                  Nombre
                </label>
                <input
                  id="ciudadano-nombre"
                  className="input input-bordered w-full"
                  placeholder="Nombre"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  required
                  aria-required="true"
                />
              </fieldset>
              <fieldset className="fieldset">
                <label className="fieldset-legend" htmlFor="ciudadano-apellido">
                  Apellido
                </label>
                <input
                  id="ciudadano-apellido"
                  className="input input-bordered w-full"
                  placeholder="Apellido"
                  value={form.apellido}
                  onChange={(e) => setForm({ ...form, apellido: e.target.value })}
                  required
                  aria-required="true"
                />
              </fieldset>
              <fieldset className="fieldset">
                <label className="fieldset-legend" htmlFor="ciudadano-celular">
                  Celular
                </label>
                <input
                  id="ciudadano-celular"
                  className="input input-bordered w-full"
                  placeholder="Ej: 3436401234"
                  value={form.celular}
                  onChange={(e) => setForm({ ...form, celular: e.target.value })}
                />
              </fieldset>
              <fieldset className="fieldset">
                <label className="fieldset-legend" htmlFor="ciudadano-nacimiento">
                  Fecha de Nacimiento
                </label>
                <input
                  id="ciudadano-nacimiento"
                  type="date"
                  className="input input-bordered w-full"
                  value={form.fechaNacimiento}
                  onChange={(e) => setForm({ ...form, fechaNacimiento: e.target.value })}
                />
              </fieldset>
              <fieldset className="fieldset">
                <label className="fieldset-legend" htmlFor="ciudadano-domicilio">
                  Domicilio
                </label>
                <input
                  id="ciudadano-domicilio"
                  className="input input-bordered w-full"
                  placeholder="Dirección completa"
                  value={form.domicilio}
                  onChange={(e) => setForm({ ...form, domicilio: e.target.value })}
                />
              </fieldset>
            </section>
            <section className="card-actions mt-4">
              <button className="btn btn-primary" onClick={handleSubmit}>
                <IconUserPlus size={16} />
                Registrar
              </button>
              <button className="btn btn-ghost" onClick={() => setShowForm(false)}>
                Cancelar
              </button>
            </section>
          </article>
        </section>
      )}

      {/* Tabla */}
      <section className="card card-border bg-base-100 overflow-x-auto">
        <table className="table" aria-label="Lista de ciudadanos">
          <thead>
            <tr>
              <th>DNI</th>
              <th>Apellido</th>
              <th>Nombre</th>
              <th>Celular</th>
              <th>Fecha Nac.</th>
              <th>Domicilio</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center opacity-50">
                  {busqueda ? 'No se encontraron resultados' : 'No hay ciudadanos registrados'}
                </td>
              </tr>
            ) : (
              filtrados.map((c) => (
                <tr key={c.dni} className="hover:bg-base-200/50">
                  <td className="font-mono font-semibold">{c.dni}</td>
                  <td className="font-medium">{c.apellido}</td>
                  <td>{c.nombre}</td>
                  <td className="font-mono text-sm opacity-70">{c.celular || '—'}</td>
                  <td className="text-sm opacity-70">{c.fechaNacimiento}</td>
                  <td className="text-sm opacity-70">{c.domicilio}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <footer className="border-base-200 border-t px-4 py-3 text-xs opacity-50">
          {filtrados.length} ciudadano{filtrados.length !== 1 ? 's' : ''}
          {busqueda && ` encontrado${filtrados.length !== 1 ? 's' : ''}`}
        </footer>
      </section>
    </section>
  )
}
