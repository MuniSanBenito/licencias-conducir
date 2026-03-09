'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useCiudadanos } from '../../hooks'
import type { Ciudadano, ClaseLicencia, TipoTramite } from '../../types'
import { CLASES_LICENCIA, TIPO_TRAMITE_LABELS, getPasosParaTramite } from '../../types'

interface ItemForm {
  clase: ClaseLicencia
  tipo: TipoTramite
}

export default function NuevoTramitePage() {
  const router = useRouter()
  const ciudadanos = useCiudadanos()

  // Búsqueda y selección de ciudadano
  const [busqueda, setBusqueda] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [ciudadanoSeleccionado, setCiudadanoSeleccionado] = useState<Ciudadano | null>(null)

  const [items, setItems] = useState<ItemForm[]>([{ clase: 'B1', tipo: 'nueva' }])

  const q = busqueda.toLowerCase().trim()
  const resultados = q
    ? ciudadanos
        .filter(
          (c) =>
            c.dni.includes(q) ||
            c.nombre.toLowerCase().includes(q) ||
            c.apellido.toLowerCase().includes(q),
        )
        .slice(0, 8)
    : []

  const seleccionarCiudadano = (c: Ciudadano) => {
    setCiudadanoSeleccionado(c)
    setBusqueda('')
    setShowDropdown(false)
  }

  const deseleccionarCiudadano = () => {
    setCiudadanoSeleccionado(null)
    setBusqueda('')
  }

  const agregarItem = () => {
    setItems([...items, { clase: 'B1', tipo: 'nueva' }])
  }

  const eliminarItem = (index: number) => {
    if (items.length <= 1) return
    setItems(items.filter((_, i) => i !== index))
  }

  const actualizarItem = (index: number, campo: keyof ItemForm, valor: string) => {
    const nuevos = [...items]
    nuevos[index] = { ...nuevos[index], [campo]: valor }
    setItems(nuevos)
  }

  const pasosPreview = getPasosParaTramite(items)

  const handleSubmit = () => {
    if (!ciudadanoSeleccionado) {
      alert('Seleccioná un ciudadano antes de continuar')
      return
    }
    alert('Trámite creado exitosamente (simulado)')
    router.push('/mock')
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
    transition: 'border-color 0.15s ease',
  }

  const labelStyle = {
    display: 'block',
    fontSize: 12,
    fontWeight: 600 as const,
    color: '#555',
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
    marginBottom: 6,
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ marginBottom: 24, fontSize: 13, color: '#888' }}>
        <Link href="/mock" style={{ color: '#1a237e', textDecoration: 'none' }}>
          Dashboard
        </Link>
        <span style={{ margin: '0 8px' }}>/</span>
        <span>Nuevo Trámite</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
        {/* Formulario */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Selección de ciudadano */}
          <div
            style={{
              background: '#fff',
              borderRadius: 12,
              padding: 28,
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20,
              }}
            >
              <h2 style={{ margin: 0, fontSize: 17, fontWeight: 600, color: '#1a237e' }}>
                👤 Ciudadano
              </h2>
              {!ciudadanoSeleccionado && (
                <Link
                  href="/mock/ciudadanos"
                  style={{
                    fontSize: 13,
                    color: '#1a237e',
                    textDecoration: 'none',
                    opacity: 0.7,
                  }}
                >
                  Gestionar ciudadanos →
                </Link>
              )}
            </div>

            {ciudadanoSeleccionado ? (
              /* Ciudadano seleccionado - tarjeta */
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 20,
                  background: '#e8eaf6',
                  borderRadius: 10,
                  border: '2px solid #c5cae9',
                }}
              >
                <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #1a237e, #3949ab)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: 20,
                      fontWeight: 700,
                    }}
                  >
                    {ciudadanoSeleccionado.nombre[0]}
                    {ciudadanoSeleccionado.apellido[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 600 }}>
                      {ciudadanoSeleccionado.apellido}, {ciudadanoSeleccionado.nombre}
                    </div>
                    <div style={{ fontSize: 13, color: '#555', marginTop: 2 }}>
                      DNI:{' '}
                      <strong style={{ fontFamily: 'monospace' }}>
                        {ciudadanoSeleccionado.dni}
                      </strong>
                      <span style={{ margin: '0 8px', color: '#ccc' }}>|</span>
                      📱 {ciudadanoSeleccionado.celular || '—'}
                      <span style={{ margin: '0 8px', color: '#ccc' }}>|</span>
                      {ciudadanoSeleccionado.domicilio}
                    </div>
                  </div>
                </div>
                <button
                  onClick={deseleccionarCiudadano}
                  style={{
                    padding: '8px 16px',
                    background: '#fff',
                    color: '#c62828',
                    border: '1px solid #ef9a9a',
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  ✕ Cambiar
                </button>
              </div>
            ) : (
              /* Buscador */
              <div style={{ position: 'relative' }}>
                <input
                  style={{
                    ...inputStyle,
                    paddingLeft: 38,
                    fontSize: 15,
                    border: '2px solid #c5cae9',
                  }}
                  placeholder="Buscar por DNI, nombre o apellido..."
                  value={busqueda}
                  onChange={(e) => {
                    setBusqueda(e.target.value)
                    setShowDropdown(true)
                  }}
                  onFocus={() => setShowDropdown(true)}
                  onBlur={() => {
                    // Delay para permitir click en dropdown
                    setTimeout(() => setShowDropdown(false), 200)
                  }}
                />
                <span
                  style={{
                    position: 'absolute',
                    left: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: 16,
                    opacity: 0.5,
                  }}
                >
                  🔍
                </span>

                {/* Dropdown resultados */}
                {showDropdown && busqueda.length > 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      background: '#fff',
                      borderRadius: '0 0 10px 10px',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                      border: '1px solid #e0e0e0',
                      borderTop: 'none',
                      zIndex: 100,
                      maxHeight: 300,
                      overflow: 'auto',
                    }}
                  >
                    {resultados.length === 0 ? (
                      <div
                        style={{ padding: 20, textAlign: 'center', color: '#999', fontSize: 14 }}
                      >
                        No se encontraron ciudadanos
                        <div style={{ marginTop: 8 }}>
                          <Link href="/mock/ciudadanos" style={{ color: '#1a237e', fontSize: 13 }}>
                            ➕ Registrar nuevo ciudadano
                          </Link>
                        </div>
                      </div>
                    ) : (
                      resultados.map((c) => (
                        <button
                          key={c.dni}
                          onClick={() => seleccionarCiudadano(c)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 14,
                            width: '100%',
                            padding: '12px 16px',
                            background: 'transparent',
                            border: 'none',
                            borderBottom: '1px solid #f5f5f5',
                            cursor: 'pointer',
                            textAlign: 'left',
                            fontSize: 14,
                            transition: 'background 0.1s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#f5f7ff'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent'
                          }}
                        >
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: '50%',
                              background: '#e8eaf6',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 13,
                              fontWeight: 700,
                              color: '#1a237e',
                              flexShrink: 0,
                            }}
                          >
                            {c.nombre[0]}
                            {c.apellido[0]}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600 }}>
                              {c.apellido}, {c.nombre}
                            </div>
                            <div style={{ fontSize: 12, color: '#888' }}>
                              DNI: {c.dni} · {c.domicilio}
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Items de licencia */}
          <div
            style={{
              background: '#fff',
              borderRadius: 12,
              padding: 28,
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20,
              }}
            >
              <h2 style={{ margin: 0, fontSize: 17, fontWeight: 600, color: '#1a237e' }}>
                📋 Clases / Categorías
              </h2>
              <button
                onClick={agregarItem}
                style={{
                  padding: '8px 16px',
                  background: '#e8eaf6',
                  color: '#1a237e',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                ➕ Agregar otra
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {items.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: 16,
                    background: '#fafafa',
                    borderRadius: 8,
                    border: '1px solid #eee',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Clase</label>
                    <select
                      style={{ ...inputStyle, cursor: 'pointer' }}
                      value={item.clase}
                      onChange={(e) => actualizarItem(index, 'clase', e.target.value)}
                    >
                      {CLASES_LICENCIA.map((clase) => (
                        <option key={clase} value={clase}>
                          {clase}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Tipo</label>
                    <select
                      style={{ ...inputStyle, cursor: 'pointer' }}
                      value={item.tipo}
                      onChange={(e) => actualizarItem(index, 'tipo', e.target.value)}
                    >
                      {(Object.entries(TIPO_TRAMITE_LABELS) as [TipoTramite, string][]).map(
                        ([key, label]) => (
                          <option key={key} value={key}>
                            {label}
                          </option>
                        ),
                      )}
                    </select>
                  </div>

                  <button
                    onClick={() => eliminarItem(index)}
                    disabled={items.length <= 1}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 6,
                      border: 'none',
                      background: items.length <= 1 ? '#f0f0f0' : '#ffebee',
                      color: items.length <= 1 ? '#ccc' : '#c62828',
                      fontSize: 16,
                      cursor: items.length <= 1 ? 'not-allowed' : 'pointer',
                      marginTop: 22,
                      flexShrink: 0,
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Botón submit */}
          <button
            onClick={handleSubmit}
            disabled={!ciudadanoSeleccionado}
            style={{
              padding: '14px 28px',
              background: ciudadanoSeleccionado
                ? 'linear-gradient(135deg, #1a237e, #283593)'
                : '#e0e0e0',
              color: ciudadanoSeleccionado ? '#fff' : '#999',
              border: 'none',
              borderRadius: 10,
              fontSize: 16,
              fontWeight: 700,
              cursor: ciudadanoSeleccionado ? 'pointer' : 'not-allowed',
              boxShadow: ciudadanoSeleccionado ? '0 4px 12px rgba(26,35,126,0.3)' : 'none',
              alignSelf: 'flex-start',
            }}
          >
            🚀 Iniciar Trámite
          </button>
        </div>

        {/* Preview pasos */}
        <div
          style={{
            background: '#fff',
            borderRadius: 12,
            padding: 24,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            alignSelf: 'flex-start',
            position: 'sticky',
            top: 24,
          }}
        >
          <h3 style={{ margin: '0 0 16px 0', fontSize: 15, fontWeight: 600, color: '#1a237e' }}>
            📌 Pasos del Trámite
          </h3>
          <p style={{ fontSize: 12, color: '#888', margin: '0 0 16px 0' }}>
            Vista previa basada en las clases y tipos seleccionados
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {pasosPreview.map((paso, i) => (
              <div key={paso.id} style={{ display: 'flex', gap: 10 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: '#e8eaf6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 11,
                      fontWeight: 700,
                      color: '#1a237e',
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </div>
                  {i < pasosPreview.length - 1 && (
                    <div style={{ width: 2, flex: 1, minHeight: 16, background: '#e0e0e0' }} />
                  )}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    paddingTop: 3,
                    paddingBottom: 12,
                    color: '#333',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  {paso.label}
                  {paso.requiereTurno && (
                    <span
                      style={{
                        fontSize: 9,
                        padding: '1px 5px',
                        borderRadius: 3,
                        background: '#fff3e0',
                        color: '#e65100',
                        fontWeight: 600,
                      }}
                    >
                      🎫
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Resumen items */}
          <div style={{ marginTop: 16, borderTop: '1px solid #eee', paddingTop: 16 }}>
            <div style={{ fontSize: 12, color: '#888', fontWeight: 600, marginBottom: 8 }}>
              Resumen:
            </div>
            {items.map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '4px 0',
                  fontSize: 13,
                }}
              >
                <span style={{ fontWeight: 600 }}>{item.clase}</span>
                <span
                  style={{
                    color:
                      item.tipo === 'nueva'
                        ? '#1565c0'
                        : item.tipo === 'renovacion'
                          ? '#e65100'
                          : '#6a1b9a',
                    fontSize: 12,
                  }}
                >
                  {TIPO_TRAMITE_LABELS[item.tipo]}
                </span>
              </div>
            ))}
            <div style={{ fontSize: 12, color: '#888', marginTop: 8 }}>
              Total: {pasosPreview.length} pasos
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
