'use client'

import { ConfirmDialog } from '@/web/ui/molecules/confirm-dialog'
import {
  IconArrowBackUp,
  IconArrowLeft,
  IconCalendar,
  IconCalendarPlus,
  IconCalendarX,
  IconCheck,
  IconCircle,
  IconCircleCheck,
  IconCircleDot,
  IconClock,
  IconId,
  IconLicense,
  IconTicket,
  IconTrophy,
  IconUser,
} from '@tabler/icons-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { twJoin } from 'tailwind-merge'
import { useTramites } from '../../hooks'
import { updateTramite } from '../../store'
import type { EstadoTurno, PasoTramite, Turno } from '../../types'
import { TIPO_TRAMITE_LABELS } from '../../types'

// ─── Helpers ───

const ESTADO_TURNO_CONFIG: Record<EstadoTurno, { label: string; badgeClass: string }> = {
  programado: { label: 'Programado', badgeClass: 'badge badge-info badge-sm' },
  confirmado: { label: 'Confirmado', badgeClass: 'badge badge-success badge-sm' },
  ausente: { label: 'Ausente', badgeClass: 'badge badge-error badge-sm' },
  completado: { label: 'Completado', badgeClass: 'badge badge-success badge-soft badge-sm' },
  cancelado: { label: 'Cancelado', badgeClass: 'badge badge-ghost badge-sm' },
}

function TurnoBadge({ turno }: { turno: Turno }) {
  const config = ESTADO_TURNO_CONFIG[turno.estado]
  return <span className={config.badgeClass}>{config.label}</span>
}

function getBadgeClass(tipo: string): string {
  if (tipo === 'nueva') return 'badge badge-info'
  if (tipo === 'renovacion') return 'badge badge-warning'
  return 'badge badge-secondary'
}

// ─── Componente principal ───

export default function TramiteDetallePage() {
  const params = useParams()
  const tramiteId = params.id as string
  const tramites = useTramites()
  const tramite = tramites.find((t) => t.id === tramiteId)

  const [turnoModal, setTurnoModal] = useState<{
    pasoIndex: number
    fecha: string
    hora: string
  } | null>(null)

  const [confirmCancelTurno, setConfirmCancelTurno] = useState<number | null>(null)
  const [confirmRevertPaso, setConfirmRevertPaso] = useState<number | null>(null)

  if (!tramite) {
    return (
      <section className="py-16 text-center">
        <IconId size={48} className="mx-auto mb-4 opacity-30" />
        <h2 className="text-lg font-semibold opacity-60">Trámite no encontrado</h2>
        <p className="mb-4 text-sm opacity-40">ID: {tramiteId}</p>
        <Link href="/" className="link link-primary">
          Volver al tablero
        </Link>
      </section>
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

    if (paso.requiereTurno && !paso.turno) {
      toast.warning('Este paso requiere un turno asignado antes de poder completarlo.')
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
    updateTramite(tramite.id, { pasos: nuevosPasos, estado: todosOk ? 'completado' : 'en_curso' })
    toast.success(`Paso "${paso.label}" completado`)
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
    updateTramite(tramite.id, { pasos: nuevosPasos })
    setTurnoModal(null)
    toast.success(`Turno asignado para el ${turnoModal.fecha} a las ${turnoModal.hora}`)
  }

  const cancelarTurno = (pasoIndex: number) => {
    const nuevosPasos = tramite.pasos.map((p, i) => {
      if (i === pasoIndex && p.turno) {
        return { ...p, turno: { ...p.turno, estado: 'cancelado' as const } }
      }
      return p
    })
    updateTramite(tramite.id, { pasos: nuevosPasos })
    setConfirmCancelTurno(null)
    toast.success('Turno cancelado')
  }

  const turnoFalta = (paso: PasoTramite) =>
    paso.requiereTurno && (!paso.turno || paso.turno.estado === 'cancelado')

  const revertirAPaso = (targetIndex: number) => {
    const nuevosPasos = tramite.pasos.map((p, i) => {
      if (i === targetIndex) return { ...p, estado: 'en_curso' as const, fecha: undefined }
      if (i > targetIndex) return { ...p, estado: 'pendiente' as const, fecha: undefined }
      return p
    })
    updateTramite(tramite.id, { pasos: nuevosPasos, estado: 'en_curso' })
    setConfirmRevertPaso(null)
    toast.success(`Trámite revertido a "${tramite.pasos[targetIndex].label}"`)
  }

  return (
    <section>
      {/* Breadcrumb */}
      <nav className="breadcrumbs mb-6 text-sm" aria-label="Navegación">
        <ul>
          <li>
            <Link href="/" className="gap-1">
              <IconArrowLeft size={14} />
              Tablero
            </Link>
          </li>
          <li className="font-semibold">{tramite.id}</li>
        </ul>
      </nav>

      <section className="grid grid-cols-[1fr_360px] gap-6">
        {/* Columna izquierda: Stepper */}
        <article className="card card-border bg-base-100">
          <section className="card-body">
            <header className="mb-4 flex items-center justify-between">
              <h2 className="card-title">Progreso del Trámite</h2>
              <section className="flex items-center gap-3">
                <progress
                  className={twJoin(
                    'progress w-32',
                    todosCompletados ? 'progress-success' : 'progress-primary',
                  )}
                  value={progreso}
                  max={100}
                  aria-label={`${progreso}% completado`}
                />
                <span className="text-sm font-semibold opacity-60">{progreso}%</span>
              </section>
            </header>

            {/* Timeline */}
            <ul
              className="timeline timeline-vertical timeline-compact"
              aria-label="Pasos del trámite"
            >
              {tramite.pasos.map((paso, index) => (
                <li key={paso.id}>
                  {index > 0 && (
                    <hr
                      className={twJoin(
                        tramite.pasos[index - 1].estado === 'completado' && 'bg-success',
                      )}
                    />
                  )}
                  <section className="timeline-middle">
                    {paso.estado === 'completado' ? (
                      <IconCircleCheck size={24} className="text-success" />
                    ) : paso.estado === 'en_curso' ? (
                      <IconCircleDot size={24} className="text-primary" />
                    ) : (
                      <IconCircle size={24} className="opacity-30" />
                    )}
                  </section>
                  <article className="timeline-end pb-6">
                    <header className="flex items-center gap-2">
                      <span
                        className={twJoin(
                          'font-medium',
                          paso.estado === 'en_curso' && 'font-bold',
                          paso.estado === 'pendiente' && 'opacity-50',
                        )}
                      >
                        {paso.label}
                      </span>
                      {paso.requiereTurno && (
                        <span className="badge badge-warning badge-outline badge-xs gap-1">
                          <IconTicket size={10} />
                          Turno
                        </span>
                      )}
                    </header>

                    {paso.fecha && (
                      <p className="mt-1 flex items-center gap-1 text-xs opacity-50">
                        <IconCalendar size={12} />
                        {paso.fecha}
                      </p>
                    )}

                    {/* Botón revertir para pasos completados */}
                    {paso.estado === 'completado' && !todosCompletados && (
                      <button
                        className="btn btn-ghost btn-xs mt-1 opacity-50 hover:opacity-100"
                        onClick={() => setConfirmRevertPaso(index)}
                        aria-label={`Revertir a ${paso.label}`}
                      >
                        <IconArrowBackUp size={14} />
                        Revertir a este paso
                      </button>
                    )}

                    {/* Turno info */}
                    {paso.requiereTurno && paso.turno && (
                      <section
                        className="bg-base-200 mt-2 flex items-center justify-between rounded-lg p-3"
                        aria-label={`Turno para ${paso.label}`}
                      >
                        <section className="flex items-center gap-3">
                          <section>
                            <p className="text-xs opacity-50">Turno asignado</p>
                            <p className="flex items-center gap-2 text-sm font-semibold">
                              <IconCalendar size={14} /> {paso.turno.fecha}
                              <IconClock size={14} /> {paso.turno.hora}
                            </p>
                          </section>
                          <TurnoBadge turno={paso.turno} />
                        </section>
                        {paso.estado === 'en_curso' && paso.turno.estado === 'programado' && (
                          <button
                            className="btn btn-error btn-ghost btn-xs"
                            onClick={() => setConfirmCancelTurno(index)}
                            aria-label={`Cancelar turno de ${paso.label}`}
                          >
                            <IconCalendarX size={14} />
                            Cancelar
                          </button>
                        )}
                      </section>
                    )}

                    {/* Acciones del paso activo */}
                    {paso.estado === 'en_curso' && (
                      <section className="mt-3 flex gap-2">
                        {turnoFalta(paso) && (
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() => setTurnoModal({ pasoIndex: index, fecha: '', hora: '' })}
                          >
                            <IconCalendarPlus size={16} />
                            {paso.turno?.estado === 'cancelado'
                              ? 'Reasignar Turno'
                              : 'Asignar Turno'}
                          </button>
                        )}
                        <button
                          className={twJoin(
                            'btn btn-sm',
                            turnoFalta(paso) ? 'btn-disabled' : 'btn-primary',
                          )}
                          onClick={avanzarPaso}
                          disabled={turnoFalta(paso)}
                          aria-label={`Completar paso ${paso.label}`}
                        >
                          <IconCheck size={16} />
                          Completar paso
                        </button>
                      </section>
                    )}
                  </article>
                  {index < tramite.pasos.length - 1 && (
                    <hr className={twJoin(paso.estado === 'completado' && 'bg-success')} />
                  )}
                </li>
              ))}
            </ul>

            {todosCompletados && (
              <section role="alert" className="alert alert-success mt-4">
                <IconTrophy size={20} />
                <span className="font-semibold">Trámite completado exitosamente</span>
              </section>
            )}
          </section>
        </article>

        {/* Columna derecha: Info */}
        <aside className="flex flex-col gap-5">
          {/* Datos ciudadano */}
          <article className="card card-border bg-base-100 card-sm">
            <section className="card-body">
              <h3 className="card-title text-sm">
                <IconUser size={16} />
                Datos del Ciudadano
              </h3>
              <dl className="mt-2 grid gap-2">
                {[
                  { dt: 'DNI', dd: tramite.ciudadano.dni },
                  { dt: 'Nombre', dd: `${tramite.ciudadano.nombre} ${tramite.ciudadano.apellido}` },
                  { dt: 'Celular', dd: tramite.ciudadano.celular || '—' },
                  { dt: 'Nacimiento', dd: tramite.ciudadano.fechaNacimiento },
                  { dt: 'Domicilio', dd: tramite.ciudadano.domicilio },
                ].map((campo) => (
                  <section key={campo.dt}>
                    <dt className="text-[10px] tracking-wider uppercase opacity-40">{campo.dt}</dt>
                    <dd className="text-sm font-medium">{campo.dd}</dd>
                  </section>
                ))}
              </dl>
            </section>
          </article>

          {/* Items de licencia */}
          <article className="card card-border bg-base-100 card-sm">
            <section className="card-body">
              <h3 className="card-title text-sm">
                <IconLicense size={16} />
                Licencias Solicitadas
              </h3>
              <section className="mt-2 flex flex-col gap-2">
                {tramite.items.map((item, i) => (
                  <section
                    key={i}
                    className="bg-base-200 flex items-center justify-between rounded-lg px-4 py-3"
                  >
                    <span className="text-primary font-bold">{item.clase}</span>
                    <span className={getBadgeClass(item.tipo)}>
                      {TIPO_TRAMITE_LABELS[item.tipo]}
                    </span>
                  </section>
                ))}
              </section>
            </section>
          </article>

          {/* Resumen de turnos */}
          {tramite.pasos.some((p) => p.requiereTurno) && (
            <article className="card card-border bg-base-100 card-sm">
              <section className="card-body">
                <h3 className="card-title text-sm">
                  <IconTicket size={16} />
                  Turnos
                </h3>
                <section className="mt-2 flex flex-col gap-2">
                  {tramite.pasos
                    .filter((p) => p.requiereTurno)
                    .map((paso) => (
                      <section
                        key={paso.id}
                        className="bg-base-200 flex items-center justify-between rounded-md px-3 py-2"
                      >
                        <span className="text-sm font-medium">{paso.label}</span>
                        {paso.turno ? (
                          <section className="flex items-center gap-2">
                            <span className="text-xs opacity-60">
                              {paso.turno.fecha} {paso.turno.hora}
                            </span>
                            <TurnoBadge turno={paso.turno} />
                          </section>
                        ) : (
                          <span className="text-xs opacity-30">Sin turno</span>
                        )}
                      </section>
                    ))}
                </section>
              </section>
            </article>
          )}

          {/* Info del trámite */}
          <article className="card card-border bg-base-100 card-sm">
            <section className="card-body">
              <h3 className="card-title text-sm">
                <IconId size={16} />
                Información
              </h3>
              <dl className="mt-2 grid gap-2">
                <section>
                  <dt className="text-[10px] tracking-wider uppercase opacity-40">FUT</dt>
                  <dd className="font-mono text-sm font-bold">{tramite.fut}</dd>
                </section>
                <section>
                  <dt className="text-[10px] tracking-wider uppercase opacity-40">ID Trámite</dt>
                  <dd className="font-mono text-sm font-semibold">{tramite.id}</dd>
                </section>
                <section>
                  <dt className="text-[10px] tracking-wider uppercase opacity-40">Fecha Inicio</dt>
                  <dd className="text-sm font-medium">{tramite.fechaInicio}</dd>
                </section>
                <section>
                  <dt className="text-[10px] tracking-wider uppercase opacity-40">Total Pasos</dt>
                  <dd className="text-sm font-medium">
                    {tramite.pasos.filter((p) => p.estado === 'completado').length} /{' '}
                    {tramite.pasos.length}
                  </dd>
                </section>
              </dl>
            </section>
          </article>
        </aside>
      </section>

      {/* Modal asignar turno */}
      {turnoModal && (
        <dialog
          className="modal modal-open"
          aria-modal="true"
          role="dialog"
          aria-label="Asignar turno"
        >
          <section className="modal-box">
            <h3 className="flex items-center gap-2 text-lg font-bold">
              <IconCalendarPlus size={20} />
              Asignar Turno
            </h3>
            <p className="mt-1 text-sm opacity-60">
              {tramite.pasos[turnoModal.pasoIndex]?.label} — {tramite.ciudadano.apellido},{' '}
              {tramite.ciudadano.nombre}
            </p>

            <section className="mt-6 grid gap-4">
              <fieldset className="fieldset">
                <label className="fieldset-legend" htmlFor="turno-fecha">
                  Fecha
                </label>
                <input
                  id="turno-fecha"
                  type="date"
                  className="input input-bordered w-full"
                  value={turnoModal.fecha}
                  onChange={(e) => setTurnoModal({ ...turnoModal, fecha: e.target.value })}
                  required
                  aria-required="true"
                />
              </fieldset>
              <fieldset className="fieldset">
                <label className="fieldset-legend" htmlFor="turno-hora">
                  Hora
                </label>
                <input
                  id="turno-hora"
                  type="time"
                  className="input input-bordered w-full"
                  value={turnoModal.hora}
                  onChange={(e) => setTurnoModal({ ...turnoModal, hora: e.target.value })}
                  required
                  aria-required="true"
                />
              </fieldset>
            </section>

            <section className="modal-action">
              <button className="btn btn-ghost" onClick={() => setTurnoModal(null)}>
                Cancelar
              </button>
              <button
                className="btn btn-warning"
                onClick={asignarTurno}
                disabled={!turnoModal.fecha || !turnoModal.hora}
              >
                <IconCalendarPlus size={16} />
                Confirmar Turno
              </button>
            </section>
          </section>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setTurnoModal(null)}>Cerrar</button>
          </form>
        </dialog>
      )}

      {/* Modal confirmación cancelar turno */}
      <ConfirmDialog
        open={confirmCancelTurno !== null}
        title="Cancelar turno"
        description={
          <>
            ¿Estás seguro de que querés cancelar el turno de{' '}
            <strong>
              {confirmCancelTurno !== null && tramite.pasos[confirmCancelTurno]?.label}
            </strong>
            ?
          </>
        }
        confirmLabel="Sí, cancelar turno"
        confirmIcon={<IconCalendarX size={16} />}
        variant="error"
        onConfirm={() => confirmCancelTurno !== null && cancelarTurno(confirmCancelTurno)}
        onCancel={() => setConfirmCancelTurno(null)}
      />

      {/* Modal confirmación revertir paso */}
      <ConfirmDialog
        open={confirmRevertPaso !== null}
        title="Revertir progreso"
        description={
          <>
            ¿Estás seguro de que querés volver al paso{' '}
            <strong>{confirmRevertPaso !== null && tramite.pasos[confirmRevertPaso]?.label}</strong>
            ? Todos los pasos siguientes se marcarán como pendientes.
          </>
        }
        confirmLabel="Sí, revertir"
        confirmIcon={<IconArrowBackUp size={16} />}
        variant="warning"
        onConfirm={() => confirmRevertPaso !== null && revertirAPaso(confirmRevertPaso)}
        onCancel={() => setConfirmRevertPaso(null)}
      />
    </section>
  )
}
