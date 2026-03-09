'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { TRAMITES_MOCK } from '../../data'
import type { EstadoTurno, PasoTramite, Tramite, Turno } from '../../types'
import { TIPO_TRAMITE_LABELS } from '../../types'

// ─── Helpers ───

function StepIcon({ estado }: { estado: PasoTramite['estado'] }) {
  if (estado === 'completado') {
    return (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #43a047, #66bb6a)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: 16,
          fontWeight: 700,
          boxShadow: '0 2px 6px rgba(67,160,71,0.4)',
        }}
      >
        ✓
      </div>
    )
  }
  if (estado === 'en_curso') {
    return (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #1a237e, #3949ab)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: 14,
          boxShadow: '0 2px 8px rgba(26,35,126,0.4)',
        }}
      >
        ●
      </div>
    )
  }
  return (
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        background: '#e0e0e0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#999',
        fontSize: 14,
      }}
    >
      ○
    </div>
  )
}

const ESTADO_TURNO_CONFIG: Record<EstadoTurno, { label: string; color: string; bg: string }> = {
  programado: { label: 'Programado', color: '#1565c0', bg: '#e3f2fd' },
  confirmado: { label: 'Confirmado', color: '#2e7d32', bg: '#e8f5e9' },
  ausente: { label: 'Ausente', color: '#c62828', bg: '#ffebee' },
  completado: { label: 'Completado', color: '#2e7d32', bg: '#e8f5e9' },
  cancelado: { label: 'Cancelado', color: '#666', bg: '#f5f5f5' },
}

function TurnoBadge({ turno }: { turno: Turno }) {
  const config = ESTADO_TURNO_CONFIG[turno.estado]
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '2px 8px',
        borderRadius: 4,
        fontSize: 11,
        fontWeight: 600,
        background: config.bg,
        color: config.color,
      }}
    >
      {config.label}
    </span>
  )
}

// ─── Componente principal ───

export default function TramiteDetallePage() {
  const params = useParams()
  const tramiteId = params.id as string
  const [tramite, setTramite] = useState<Tramite | undefined>(
    TRAMITES_MOCK.find((t) => t.id === tramiteId),
  )

  // Estado para modal de asignar turno
  const [turnoModal, setTurnoModal] = useState<{
    pasoIndex: number
    fecha: string
    hora: string
  } | null>(null)

  if (!tramite) {
    return (
      <div style={{ textAlign: 'center', padding: 60 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
        <h2 style={{ color: '#666' }}>Trámite no encontrado</h2>
        <p style={{ color: '#999' }}>ID: {tramiteId}</p>
        <Link href="/mock" style={{ color: '#1a237e', textDecoration: 'underline' }}>
          Volver al dashboard
        </Link>
      </div>
    )
  }

  const pasoActualIndex = tramite.pasos.findIndex((p) => p.estado === 'en_curso')
  const todosCompletados = tramite.pasos.every((p) => p.estado === 'completado')
  const progreso = Math.round(
    (tramite.pasos.filter((p) => p.estado === 'completado').length / tramite.pasos.length) * 100,
  )

  const avanzarPaso = () => {
    if (pasoActualIndex === -1) return
    const paso = tramite.pasos[pasoActualIndex]

    // Si requiere turno y no tiene uno asignado, no avanzar
    if (paso.requiereTurno && !paso.turno) {
      alert('Este paso requiere un turno asignado antes de poder completarlo.')
      return
    }

    const nuevosPasos = tramite.pasos.map((p, i) => {
      if (i === pasoActualIndex) {
        return {
          ...p,
          estado: 'completado' as const,
          fecha: new Date().toISOString().slice(0, 10),
          turno: p.turno ? { ...p.turno, estado: 'completado' as const } : undefined,
        }
      }
      if (i === pasoActualIndex + 1) return { ...p, estado: 'en_curso' as const }
      return p
    })
    const todosOk = nuevosPasos.every((p) => p.estado === 'completado')
    setTramite({ ...tramite, pasos: nuevosPasos, estado: todosOk ? 'completado' : 'en_curso' })
  }

  const asignarTurno = () => {
    if (!turnoModal) return
    const nuevosPasos = tramite.pasos.map((p, i) => {
      if (i === turnoModal.pasoIndex) {
        return {
          ...p,
          turno: {
            fecha: turnoModal.fecha,
            hora: turnoModal.hora,
            estado: 'programado' as const,
          },
        }
      }
      return p
    })
    setTramite({ ...tramite, pasos: nuevosPasos })
    setTurnoModal(null)
  }

  const cancelarTurno = (pasoIndex: number) => {
    const nuevosPasos = tramite.pasos.map((p, i) => {
      if (i === pasoIndex && p.turno) {
        return { ...p, turno: { ...p.turno, estado: 'cancelado' as const } }
      }
      return p
    })
    setTramite({ ...tramite, pasos: nuevosPasos })
  }

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    borderRadius: 6,
    border: '1.5px solid #d0d0d0',
    fontSize: 14,
    fontFamily: "'Segoe UI', Roboto, Arial, sans-serif",
    outline: 'none',
    boxSizing: 'border-box' as const,
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ marginBottom: 24, fontSize: 13, color: '#888' }}>
        <Link href="/mock" style={{ color: '#1a237e', textDecoration: 'none' }}>
          Dashboard
        </Link>
        <span style={{ margin: '0 8px' }}>/</span>
        <span>{tramite.id}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24 }}>
        {/* Columna izquierda: Stepper */}
        <div
          style={{
            background: '#fff',
            borderRadius: 12,
            padding: 32,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 24,
            }}
          >
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Progreso del Trámite</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 120,
                  height: 8,
                  background: '#e0e0e0',
                  borderRadius: 4,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${progreso}%`,
                    background: todosCompletados
                      ? 'linear-gradient(90deg, #43a047, #66bb6a)'
                      : 'linear-gradient(90deg, #1a237e, #3949ab)',
                    borderRadius: 4,
                  }}
                />
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#666' }}>{progreso}%</span>
            </div>
          </div>

          {/* Steps */}
          <div style={{ position: 'relative' }}>
            {tramite.pasos.map((paso, index) => (
              <div key={paso.id} style={{ display: 'flex', gap: 16 }}>
                {/* Icono + línea */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <StepIcon estado={paso.estado} />
                  {index < tramite.pasos.length - 1 && (
                    <div
                      style={{
                        width: 2,
                        flex: 1,
                        minHeight: 32,
                        background: paso.estado === 'completado' ? '#43a047' : '#e0e0e0',
                      }}
                    />
                  )}
                </div>
                {/* Contenido */}
                <div
                  style={{
                    flex: 1,
                    paddingBottom: index < tramite.pasos.length - 1 ? 12 : 0,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      fontSize: 15,
                      fontWeight: paso.estado === 'en_curso' ? 700 : 500,
                      color: paso.estado === 'pendiente' ? '#999' : '#1a1a2e',
                      paddingTop: 5,
                    }}
                  >
                    {paso.label}
                    {paso.requiereTurno && (
                      <span
                        style={{
                          fontSize: 10,
                          padding: '1px 6px',
                          borderRadius: 3,
                          background: '#fff3e0',
                          color: '#e65100',
                          fontWeight: 600,
                        }}
                      >
                        🎫 Turno
                      </span>
                    )}
                  </div>

                  {paso.fecha && (
                    <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>📅 {paso.fecha}</div>
                  )}

                  {/* Turno info */}
                  {paso.requiereTurno && paso.turno && (
                    <div
                      style={{
                        marginTop: 8,
                        padding: '10px 14px',
                        background: '#fafafa',
                        borderRadius: 8,
                        border: '1px solid #eee',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div>
                          <div style={{ fontSize: 12, color: '#888' }}>Turno asignado</div>
                          <div style={{ fontSize: 14, fontWeight: 600 }}>
                            📅 {paso.turno.fecha} · 🕐 {paso.turno.hora}
                          </div>
                        </div>
                        <TurnoBadge turno={paso.turno} />
                      </div>
                      {paso.estado === 'en_curso' && paso.turno.estado === 'programado' && (
                        <button
                          onClick={() => cancelarTurno(index)}
                          style={{
                            padding: '4px 10px',
                            background: '#ffebee',
                            color: '#c62828',
                            border: 'none',
                            borderRadius: 4,
                            fontSize: 12,
                            cursor: 'pointer',
                          }}
                        >
                          Cancelar turno
                        </button>
                      )}
                    </div>
                  )}

                  {/* Acciones del paso activo */}
                  {paso.estado === 'en_curso' && (
                    <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                      {paso.requiereTurno && !paso.turno && (
                        <button
                          onClick={() => setTurnoModal({ pasoIndex: index, fecha: '', hora: '' })}
                          style={{
                            padding: '8px 16px',
                            background: 'linear-gradient(135deg, #e65100, #f57c00)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 6,
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: 'pointer',
                            boxShadow: '0 2px 6px rgba(230,81,0,0.3)',
                          }}
                        >
                          🎫 Asignar Turno
                        </button>
                      )}
                      {paso.requiereTurno && paso.turno?.estado === 'cancelado' && (
                        <button
                          onClick={() => setTurnoModal({ pasoIndex: index, fecha: '', hora: '' })}
                          style={{
                            padding: '8px 16px',
                            background: 'linear-gradient(135deg, #e65100, #f57c00)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 6,
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          🎫 Reasignar Turno
                        </button>
                      )}
                      <button
                        onClick={avanzarPaso}
                        disabled={
                          paso.requiereTurno && (!paso.turno || paso.turno.estado === 'cancelado')
                        }
                        style={{
                          padding: '8px 16px',
                          background:
                            paso.requiereTurno && (!paso.turno || paso.turno.estado === 'cancelado')
                              ? '#e0e0e0'
                              : 'linear-gradient(135deg, #1a237e, #283593)',
                          color:
                            paso.requiereTurno && (!paso.turno || paso.turno.estado === 'cancelado')
                              ? '#999'
                              : '#fff',
                          border: 'none',
                          borderRadius: 6,
                          fontSize: 13,
                          fontWeight: 600,
                          cursor:
                            paso.requiereTurno && (!paso.turno || paso.turno.estado === 'cancelado')
                              ? 'not-allowed'
                              : 'pointer',
                          boxShadow:
                            paso.requiereTurno && (!paso.turno || paso.turno.estado === 'cancelado')
                              ? 'none'
                              : '0 2px 6px rgba(26,35,126,0.3)',
                        }}
                      >
                        ✅ Completar paso
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {todosCompletados && (
            <div
              style={{
                marginTop: 24,
                padding: 16,
                background: '#e8f5e9',
                borderRadius: 8,
                textAlign: 'center',
                color: '#2e7d32',
                fontWeight: 600,
                fontSize: 15,
              }}
            >
              🎉 Trámite completado exitosamente
            </div>
          )}
        </div>

        {/* Columna derecha: Info del trámite */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Datos ciudadano */}
          <div
            style={{
              background: '#fff',
              borderRadius: 12,
              padding: 24,
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
          >
            <h3 style={{ margin: '0 0 16px 0', fontSize: 15, fontWeight: 600, color: '#1a237e' }}>
              👤 Datos del Ciudadano
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'DNI', value: tramite.ciudadano.dni },
                {
                  label: 'Nombre',
                  value: `${tramite.ciudadano.nombre} ${tramite.ciudadano.apellido}`,
                },
                { label: 'Celular', value: tramite.ciudadano.celular || '—' },
                { label: 'Nacimiento', value: tramite.ciudadano.fechaNacimiento },
                { label: 'Domicilio', value: tramite.ciudadano.domicilio },
              ].map((campo) => (
                <div key={campo.label}>
                  <div
                    style={{
                      fontSize: 11,
                      color: '#888',
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                      marginBottom: 2,
                    }}
                  >
                    {campo.label}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{campo.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Items de licencia */}
          <div
            style={{
              background: '#fff',
              borderRadius: 12,
              padding: 24,
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
          >
            <h3 style={{ margin: '0 0 16px 0', fontSize: 15, fontWeight: 600, color: '#1a237e' }}>
              📋 Licencias Solicitadas
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {tramite.items.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    background: '#f5f5f5',
                    borderRadius: 8,
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: 16, color: '#1a237e' }}>
                    {item.clase}
                  </span>
                  <span
                    style={{
                      padding: '3px 10px',
                      borderRadius: 4,
                      fontSize: 12,
                      fontWeight: 600,
                      background:
                        item.tipo === 'nueva'
                          ? '#e3f2fd'
                          : item.tipo === 'renovacion'
                            ? '#fff3e0'
                            : '#f3e5f5',
                      color:
                        item.tipo === 'nueva'
                          ? '#1565c0'
                          : item.tipo === 'renovacion'
                            ? '#e65100'
                            : '#6a1b9a',
                    }}
                  >
                    {TIPO_TRAMITE_LABELS[item.tipo]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Resumen de turnos */}
          {tramite.pasos.some((p) => p.requiereTurno) && (
            <div
              style={{
                background: '#fff',
                borderRadius: 12,
                padding: 24,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}
            >
              <h3 style={{ margin: '0 0 16px 0', fontSize: 15, fontWeight: 600, color: '#1a237e' }}>
                🎫 Turnos
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {tramite.pasos
                  .filter((p) => p.requiereTurno)
                  .map((paso) => (
                    <div
                      key={paso.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        background: '#fafafa',
                        borderRadius: 6,
                        border: '1px solid #eee',
                      }}
                    >
                      <span style={{ fontSize: 13, fontWeight: 500 }}>{paso.label}</span>
                      {paso.turno ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: 12, color: '#666' }}>
                            {paso.turno.fecha} {paso.turno.hora}
                          </span>
                          <TurnoBadge turno={paso.turno} />
                        </div>
                      ) : (
                        <span style={{ fontSize: 12, color: '#ccc' }}>Sin turno</span>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Info del trámite */}
          <div
            style={{
              background: '#fff',
              borderRadius: 12,
              padding: 24,
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
          >
            <h3 style={{ margin: '0 0 16px 0', fontSize: 15, fontWeight: 600, color: '#1a237e' }}>
              📁 Información
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <div
                  style={{
                    fontSize: 11,
                    color: '#888',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    marginBottom: 2,
                  }}
                >
                  ID Trámite
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, fontFamily: 'monospace' }}>
                  {tramite.id}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: 11,
                    color: '#888',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    marginBottom: 2,
                  }}
                >
                  Fecha Inicio
                </div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{tramite.fechaInicio}</div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: 11,
                    color: '#888',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    marginBottom: 2,
                  }}
                >
                  Total Pasos
                </div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>
                  {tramite.pasos.filter((p) => p.estado === 'completado').length} /{' '}
                  {tramite.pasos.length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal asignar turno */}
      {turnoModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 16,
              padding: 32,
              width: 420,
              boxShadow: '0 16px 48px rgba(0,0,0,0.2)',
            }}
          >
            <h3 style={{ margin: '0 0 8px 0', fontSize: 18, fontWeight: 600, color: '#1a237e' }}>
              🎫 Asignar Turno
            </h3>
            <p style={{ margin: '0 0 20px 0', fontSize: 14, color: '#666' }}>
              {tramite.pasos[turnoModal.pasoIndex]?.label} — {tramite.ciudadano.apellido},{' '}
              {tramite.ciudadano.nombre}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#555',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    marginBottom: 6,
                  }}
                >
                  Fecha
                </label>
                <input
                  type="date"
                  style={inputStyle}
                  value={turnoModal.fecha}
                  onChange={(e) => setTurnoModal({ ...turnoModal, fecha: e.target.value })}
                />
              </div>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#555',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    marginBottom: 6,
                  }}
                >
                  Hora
                </label>
                <input
                  type="time"
                  style={inputStyle}
                  value={turnoModal.hora}
                  onChange={(e) => setTurnoModal({ ...turnoModal, hora: e.target.value })}
                />
              </div>
            </div>

            <div style={{ marginTop: 24, display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setTurnoModal(null)}
                style={{
                  padding: '10px 20px',
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
              <button
                onClick={asignarTurno}
                disabled={!turnoModal.fecha || !turnoModal.hora}
                style={{
                  padding: '10px 20px',
                  background:
                    !turnoModal.fecha || !turnoModal.hora
                      ? '#e0e0e0'
                      : 'linear-gradient(135deg, #e65100, #f57c00)',
                  color: !turnoModal.fecha || !turnoModal.hora ? '#999' : '#fff',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: !turnoModal.fecha || !turnoModal.hora ? 'not-allowed' : 'pointer',
                  boxShadow:
                    !turnoModal.fecha || !turnoModal.hora ? 'none' : '0 2px 8px rgba(230,81,0,0.3)',
                }}
              >
                🎫 Confirmar Turno
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
