'use client'

import { useTramites } from '@/web/hooks/use-tramites'
import { AsignarTurnoModal } from '@/web/ui/molecules/asignar-turno-modal'
import { ConfirmDialog } from '@/web/ui/molecules/confirm-dialog'
import { TramiteCiudadanoCard } from '@/web/ui/molecules/tramite-ciudadano-card'
import { TramiteInfoCard } from '@/web/ui/molecules/tramite-info-card'
import { TramiteLicenciasCard } from '@/web/ui/molecules/tramite-licencias-card'
import { TramiteTurnosCard } from '@/web/ui/molecules/tramite-turnos-card'
import { TramiteTimeline } from '@/web/ui/organisms/tramite-timeline'
import { IconArrowBackUp, IconArrowLeft, IconCalendarX, IconId } from '@tabler/icons-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { updateTramite } from '../../store'

export default function TramiteDetallePage() {
  const params = useParams()
  const tramiteId = params.id as string
  const tramites = useTramites()
  const tramite = tramites.find((t) => t.id === tramiteId)

  const [turnoModalPasoIndex, setTurnoModalPasoIndex] = useState<number | null>(null)
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

  const asignarTurno = (fecha: string, hora: string) => {
    if (turnoModalPasoIndex === null) return
    const nuevosPasos = tramite.pasos.map((p, i) => {
      if (i === turnoModalPasoIndex) {
        return {
          ...p,
          turno: { fecha, hora, estado: 'programado' as const },
        }
      }
      return p
    })
    updateTramite(tramite.id, { pasos: nuevosPasos })
    setTurnoModalPasoIndex(null)
    toast.success(`Turno asignado para el ${fecha} a las ${hora}`)
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

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        {/* Columna izquierda: Stepper */}
        <TramiteTimeline
          pasos={tramite.pasos}
          progreso={progreso}
          todosCompletados={todosCompletados}
          onAvanzarPaso={avanzarPaso}
          onAsignarTurno={setTurnoModalPasoIndex}
          onCancelarTurno={setConfirmCancelTurno}
          onRevertirPaso={setConfirmRevertPaso}
        />

        {/* Columna derecha: Info */}
        <aside className="flex flex-col gap-5">
          <TramiteCiudadanoCard ciudadano={tramite.ciudadano} />
          <TramiteLicenciasCard items={tramite.items} />
          <TramiteTurnosCard pasos={tramite.pasos} />
          <TramiteInfoCard tramite={tramite} />
        </aside>
      </section>

      {/* Modal asignar turno */}
      {turnoModalPasoIndex !== null && (
        <AsignarTurnoModal
          pasoLabel={tramite.pasos[turnoModalPasoIndex]?.label ?? ''}
          ciudadanoNombre={`${tramite.ciudadano.apellido}, ${tramite.ciudadano.nombre}`}
          onConfirm={asignarTurno}
          onCancel={() => setTurnoModalPasoIndex(null)}
        />
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
