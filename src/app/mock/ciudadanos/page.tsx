'use client'

import { useState } from 'react'
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
      alert('Completá al menos DNI, nombre y apellido')
      return
    }
    const yaExiste = ciudadanos.some((c) => c.dni === form.dni)
    if (yaExiste) {
      alert('Ya existe un ciudadano con ese DNI')
      return
    }
    addCiudadano({ ...form })
    setForm({ dni: '', nombre: '', apellido: '', celular: '', fechaNacimiento: '', domicilio: '' })
    setShowForm(false)
  }

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 8,
    border: '1.5px solid #d0d0d0',
    fontSize: 14,
    fontFamily: "'Segoe UI', Roboto, Arial, sans-serif",
    outline: 'none',
    boxSizing: 'border-box' as const,
  }

  const labelStyle = {
    display: 'block' as const,
    fontSize: 12,
    fontWeight: 600 as const,
    color: '#555',
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
    marginBottom: 6,
  }

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>Ciudadanos Registrados</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '10px 20px',
            background: showForm ? '#e0e0e0' : 'linear-gradient(135deg, #1a237e, #283593)',
            color: showForm ? '#333' : '#fff',
            border: 'none',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: showForm ? 'none' : '0 2px 8px rgba(26,35,126,0.3)',
          }}
        >
          {showForm ? '✕ Cancelar' : '➕ Nuevo Ciudadano'}
        </button>
      </div>

      {/* Formulario nuevo ciudadano */}
      {showForm && (
        <div
          style={{
            background: '#fff',
            borderRadius: 12,
            padding: 28,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            marginBottom: 24,
            border: '2px solid #c5cae9',
          }}
        >
          <h3 style={{ margin: '0 0 20px 0', fontSize: 16, fontWeight: 600, color: '#1a237e' }}>
            Registrar nuevo ciudadano
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <div>
              <label style={labelStyle}>DNI</label>
              <input
                style={inputStyle}
                placeholder="Ej: 30456789"
                value={form.dni}
                onChange={(e) => setForm({ ...form, dni: e.target.value })}
              />
            </div>
            <div>
              <label style={labelStyle}>Nombre</label>
              <input
                style={inputStyle}
                placeholder="Nombre"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              />
            </div>
            <div>
              <label style={labelStyle}>Apellido</label>
              <input
                style={inputStyle}
                placeholder="Apellido"
                value={form.apellido}
                onChange={(e) => setForm({ ...form, apellido: e.target.value })}
              />
            </div>
            <div>
              <label style={labelStyle}>Celular</label>
              <input
                style={inputStyle}
                placeholder="Ej: 3436401234"
                value={form.celular}
                onChange={(e) => setForm({ ...form, celular: e.target.value })}
              />
            </div>
            <div>
              <label style={labelStyle}>Fecha de Nacimiento</label>
              <input
                type="date"
                style={inputStyle}
                value={form.fechaNacimiento}
                onChange={(e) => setForm({ ...form, fechaNacimiento: e.target.value })}
              />
            </div>
            <div style={{ gridColumn: '2 / -1' }}>
              <label style={labelStyle}>Domicilio</label>
              <input
                style={inputStyle}
                placeholder="Dirección completa"
                value={form.domicilio}
                onChange={(e) => setForm({ ...form, domicilio: e.target.value })}
              />
            </div>
          </div>
          <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
            <button
              onClick={handleSubmit}
              style={{
                padding: '10px 24px',
                background: 'linear-gradient(135deg, #2e7d32, #43a047)',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(46,125,50,0.3)',
              }}
            >
              💾 Guardar Ciudadano
            </button>
            <button
              onClick={() => setShowForm(false)}
              style={{
                padding: '10px 24px',
                background: '#f5f5f5',
                color: '#666',
                border: '1px solid #ddd',
                borderRadius: 8,
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Barra de búsqueda */}
      <div style={{ marginBottom: 20 }}>
        <input
          style={{
            ...inputStyle,
            maxWidth: 400,
            background: '#fff',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}
          placeholder="🔍 Buscar por DNI, nombre o apellido..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/* Tabla */}
      <div
        style={{
          background: '#fff',
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          overflow: 'hidden',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #e0e0e0' }}>
              {['DNI', 'Apellido', 'Nombre', 'Celular', 'Fecha Nac.', 'Domicilio'].map((col) => (
                <th
                  key={col}
                  style={{
                    padding: '14px 16px',
                    textAlign: 'left',
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#666',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtrados.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: 40, textAlign: 'center', color: '#999' }}>
                  {busqueda ? 'No se encontraron resultados' : 'No hay ciudadanos registrados'}
                </td>
              </tr>
            ) : (
              filtrados.map((c) => (
                <tr
                  key={c.dni}
                  style={{ borderBottom: '1px solid #f0f0f0' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#fafafa'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                  }}
                >
                  <td
                    style={{
                      padding: '14px 16px',
                      fontFamily: 'monospace',
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    {c.dni}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 500 }}>
                    {c.apellido}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 14 }}>{c.nombre}</td>
                  <td
                    style={{
                      padding: '14px 16px',
                      fontSize: 13,
                      color: '#666',
                      fontFamily: 'monospace',
                    }}
                  >
                    {c.celular || '—'}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: '#666' }}>
                    {c.fechaNacimiento}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: '#666' }}>
                    {c.domicilio}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div
          style={{
            padding: '12px 16px',
            borderTop: '1px solid #f0f0f0',
            fontSize: 12,
            color: '#999',
          }}
        >
          {filtrados.length} ciudadano{filtrados.length !== 1 ? 's' : ''}
          {busqueda && ` encontrado${filtrados.length !== 1 ? 's' : ''}`}
        </div>
      </div>
    </div>
  )
}
