'use client'

import Link from 'next/link'
import { useTramites } from './hooks'
import type { Tramite } from './types'
import { TIPO_TRAMITE_LABELS } from './types'

function getEstadoActual(tramite: Tramite): string {
  const pasoActivo = tramite.pasos.find((p) => p.estado === 'en_curso')
  if (pasoActivo) return pasoActivo.label

  const todosCompletados = tramite.pasos.every((p) => p.estado === 'completado')
  if (todosCompletados) return '✅ Completado'

  return 'Pendiente de inicio'
}

function getEstadoColor(tramite: Tramite): string {
  if (tramite.estado === 'completado') return '#2e7d32'
  if (tramite.estado === 'cancelado') return '#c62828'
  return '#e65100'
}

function getProgreso(tramite: Tramite): number {
  const completados = tramite.pasos.filter((p) => p.estado === 'completado').length
  return Math.round((completados / tramite.pasos.length) * 100)
}

export default function MockDashboardPage() {
  const tramites = useTramites()

  const totalTramites = tramites.length
  const enCurso = tramites.filter((t) => t.estado === 'en_curso').length
  const completados = tramites.filter((t) => t.estado === 'completado').length
  const pendientes = tramites.filter(
    (t) => t.estado === 'en_curso' && t.pasos[0].estado === 'pendiente',
  ).length

  const stats = [
    { label: 'Total Trámites', value: totalTramites, color: '#1a237e', bg: '#e8eaf6' },
    { label: 'En Curso', value: enCurso, color: '#e65100', bg: '#fff3e0' },
    { label: 'Completados', value: completados, color: '#2e7d32', bg: '#e8f5e9' },
    { label: 'Sin Iniciar', value: pendientes, color: '#6a1b9a', bg: '#f3e5f5' },
  ]

  return (
    <div>
      {/* Stats Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 20,
          marginBottom: 32,
        }}
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            style={{
              background: '#fff',
              borderRadius: 12,
              padding: '20px 24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              borderLeft: `4px solid ${stat.color}`,
            }}
          >
            <div style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>{stat.label}</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Header de tabla */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Trámites Recientes</h2>
        <Link
          href="/mock/tramite/nuevo"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 20px',
            background: 'linear-gradient(135deg, #1a237e, #283593)',
            color: '#fff',
            borderRadius: 8,
            textDecoration: 'none',
            fontSize: 14,
            fontWeight: 600,
            boxShadow: '0 2px 8px rgba(26,35,126,0.3)',
            transition: 'transform 0.15s ease',
          }}
        >
          ➕ Nuevo Trámite
        </Link>
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
              {['ID', 'DNI', 'Ciudadano', 'Clases', 'Etapa Actual', 'Progreso', 'Fecha Inicio'].map(
                (col) => (
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
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {tramites.map((tramite) => {
              const progreso = getProgreso(tramite)
              return (
                <tr
                  key={tramite.id}
                  style={{
                    borderBottom: '1px solid #f0f0f0',
                    cursor: 'pointer',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#fafafa'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                  }}
                >
                  <td style={{ padding: '14px 16px' }}>
                    <Link
                      href={`/mock/tramite/${tramite.id}`}
                      style={{
                        color: '#1a237e',
                        textDecoration: 'none',
                        fontWeight: 600,
                        fontSize: 13,
                      }}
                    >
                      {tramite.id}
                    </Link>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 14, fontFamily: 'monospace' }}>
                    {tramite.ciudadano.dni}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 500 }}>
                    {tramite.ciudadano.apellido}, {tramite.ciudadano.nombre}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {tramite.items.map((item, i) => (
                        <span
                          key={i}
                          style={{
                            display: 'inline-block',
                            padding: '2px 8px',
                            borderRadius: 4,
                            fontSize: 11,
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
                          {item.clase} · {TIPO_TRAMITE_LABELS[item.tipo]}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: getEstadoColor(tramite),
                      }}
                    >
                      {getEstadoActual(tramite)}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div
                        style={{
                          flex: 1,
                          height: 6,
                          background: '#e0e0e0',
                          borderRadius: 3,
                          overflow: 'hidden',
                          maxWidth: 100,
                        }}
                      >
                        <div
                          style={{
                            height: '100%',
                            width: `${progreso}%`,
                            background:
                              progreso === 100
                                ? 'linear-gradient(90deg, #43a047, #66bb6a)'
                                : 'linear-gradient(90deg, #1a237e, #3949ab)',
                            borderRadius: 3,
                            transition: 'width 0.3s ease',
                          }}
                        />
                      </div>
                      <span style={{ fontSize: 12, color: '#888', minWidth: 32 }}>{progreso}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: '#666' }}>
                    {tramite.fechaInicio}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
