'use client'

import type { Ciudadano, Tramite } from '@/payload-types'
import { sdk } from '@/web/libs/payload/client'
import { AsignarTurnoModal } from '@/web/ui/molecules/asignar-turno-modal'
import { ConfirmDialog } from '@/web/ui/molecules/confirm-dialog'
import { TramiteCiudadanoCard } from '@/web/ui/molecules/tramite-ciudadano-card'
import { TramiteInfoCard } from '@/web/ui/molecules/tramite-info-card'
import { TramiteLicenciasCard } from '@/web/ui/molecules/tramite-licencias-card'
import { TramiteTurnosCard } from '@/web/ui/molecules/tramite-turnos-card'
import { TramiteTimeline } from '@/web/ui/organisms/tramite-timeline'
import { IconArrowBackUp, IconCalendarX } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

type TramiteConCiudadano = Tramite & { ciudadano: Ciudadano }
type PasoTramite = Tramite['pasos'][number]

interface Props {
  tramite: TramiteConCiudadano
}

function mapPasoForUpdate(paso: PasoTramite) {
  return {
    pasoId: paso.pasoId,
    label: paso.label,
    estado: paso.estado,
    requiereTurno: paso.requiereTurno,
    fecha: paso.fecha,
    observaciones: paso.observaciones,
    turno: paso.turno
      ? {
          fecha: paso.turno.fecha,
          hora: paso.turno.hora,
          estado: paso.turno.estado,
          observaciones: paso.turno.observaciones,
        }
      : undefined,
  }
}

function calcularEstadoTramite(pasos: PasoTramite[]): Tramite['estado'] {
  const todosCompletados = pasos.every((paso) => paso.estado === 'completado')
  return todosCompletados ? 'completado' : 'en_curso'
}

export function TramiteDetallePage({ tramite }: Props) {
  const router = useRouter()

  const [tramiteState, setTramiteState] = useState<TramiteConCiudadano>(tramite)
  const [isSaving, setIsSaving] = useState(false)

  const [turnoModalPasoIndex, setTurnoModalPasoIndex] = useState<number | null>(null)
  const [confirmCancelTurno, setConfirmCancelTurno] = useState<number | null>(null)
  const [confirmRevertPaso, setConfirmRevertPaso] = useState<number | null>(null)

  const pasoActualIndex = tramiteState.pasos.findIndex((paso) => paso.estado === 'en_curso')
  const todosCompletados = tramiteState.pasos.every((paso) => paso.estado === 'completado')
  const progreso = Math.round(
    (tramiteState.pasos.filter((paso) => paso.estado === 'completado').length /
      tramiteState.pasos.length) *
      100,
  )

  async function persistTramite(nextPasos: PasoTramite[], nextEstado: Tramite['estado']) {
    setIsSaving(true)

    try {
      const response = await sdk.update({
        collection: 'tramite',
        id: tramiteState.id,
        data: {
          pasos: nextPasos.map(mapPasoForUpdate),
          estado: nextEstado,
        },
      })

      if (!response?.id) {
        throw new Error('No se pudo actualizar el trámite')
      }

      setTramiteState((prev) => ({
        ...prev,
        pasos: nextPasos,
        estado: nextEstado,
      }))

      router.refresh()
      return true
    } catch (error) {
      console.error(error)
      toast.error(error instanceof Error ? error.message : 'Error al actualizar el trámite')
      return false
    } finally {
      setIsSaving(false)
    }
  }

  async function avanzarPaso() {
    if (pasoActualIndex === -1) return

    const paso = tramiteState.pasos[pasoActualIndex]
    if (paso.requiereTurno && !paso.turno) {
      toast.warning('Este paso requiere un turno asignado antes de poder completarlo.')
      return
    }

    const nuevosPasos = tramiteState.pasos.map((currentPaso, index) => {
      if (index === pasoActualIndex) {
        return {
          ...currentPaso,
          estado: 'completado' as const,
          fecha: new Date().toISOString(),
          turno: currentPaso.turno
            ? { ...currentPaso.turno, estado: 'completado' as const }
            : undefined,
        }
      }

      if (index === pasoActualIndex + 1) {
        return {
          ...currentPaso,
          estado: 'en_curso' as const,
        }
      }

      return currentPaso
    })

    const nextEstado = calcularEstadoTramite(nuevosPasos)
    const ok = await persistTramite(nuevosPasos, nextEstado)

    if (ok) {
      toast.success(`Paso "${paso.label}" completado`)
    }
  }

  async function asignarTurno(fecha: string, hora: string) {
    if (turnoModalPasoIndex === null) return

    const nuevosPasos = tramiteState.pasos.map((paso, index) => {
      if (index !== turnoModalPasoIndex) {
        return paso
      }

      return {
        ...paso,
        turno: {
          fecha,
          hora,
          estado: 'programado' as const,
        },
      }
    })

    const ok = await persistTramite(nuevosPasos, tramiteState.estado)

    if (ok) {
      setTurnoModalPasoIndex(null)
      toast.success(`Turno asignado para el ${fecha} a las ${hora}`)
    }
  }

  async function cancelarTurno(pasoIndex: number) {
    const nuevosPasos = tramiteState.pasos.map((paso, index) => {
      if (index !== pasoIndex || !paso.turno) {
        return paso
      }

      return {
        ...paso,
        turno: {
          ...paso.turno,
          estado: 'cancelado' as const,
        },
      }
    })

    const ok = await persistTramite(nuevosPasos, tramiteState.estado)

    if (ok) {
      setConfirmCancelTurno(null)
      toast.success('Turno cancelado')
    }
  }

  async function revertirAPaso(targetIndex: number) {
    const nuevosPasos = tramiteState.pasos.map((paso, index) => {
      if (index === targetIndex) {
        return {
          ...paso,
          estado: 'en_curso' as const,
          fecha: undefined,
        }
      }

      if (index > targetIndex) {
        return {
          ...paso,
          estado: 'pendiente' as const,
          fecha: undefined,
        }
      }

      return paso
    })

    const ok = await persistTramite(nuevosPasos, 'en_curso')

    if (ok) {
      setConfirmRevertPaso(null)
      toast.success(`Trámite revertido a "${tramiteState.pasos[targetIndex].label}"`)
    }
  }

  return (
    <>
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <TramiteTimeline
          pasos={tramiteState.pasos}
          progreso={progreso}
          todosCompletados={todosCompletados}
          onAvanzarPaso={isSaving ? undefined : avanzarPaso}
          onAsignarTurno={isSaving ? undefined : setTurnoModalPasoIndex}
          onCancelarTurno={isSaving ? undefined : setConfirmCancelTurno}
          onRevertirPaso={isSaving ? undefined : setConfirmRevertPaso}
        />

        <aside className="flex flex-col gap-5">
          <TramiteCiudadanoCard ciudadano={tramiteState.ciudadano} />
          <TramiteLicenciasCard items={tramiteState.items} />
          <TramiteTurnosCard pasos={tramiteState.pasos} />
          <TramiteInfoCard tramite={tramiteState} />
        </aside>
      </section>

      {turnoModalPasoIndex !== null && (
        <AsignarTurnoModal
          pasoLabel={tramiteState.pasos[turnoModalPasoIndex]?.label ?? ''}
          ciudadanoNombre={`${tramiteState.ciudadano.nombre} ${tramiteState.ciudadano.apellido}`}
          onConfirm={asignarTurno}
          onCancel={() => setTurnoModalPasoIndex(null)}
        />
      )}

      <ConfirmDialog
        open={confirmCancelTurno !== null}
        title="Cancelar turno"
        description={
          <>
            ¿Estás seguro de que querés cancelar el turno de{' '}
            <strong>
              {confirmCancelTurno !== null && tramiteState.pasos[confirmCancelTurno]?.label}
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

      <ConfirmDialog
        open={confirmRevertPaso !== null}
        title="Revertir progreso"
        description={
          <>
            ¿Estás seguro de que querés volver al paso{' '}
            <strong>
              {confirmRevertPaso !== null && tramiteState.pasos[confirmRevertPaso]?.label}
            </strong>
            ? Todos los pasos siguientes se marcarán como pendientes.
          </>
        }
        confirmLabel="Sí, revertir"
        confirmIcon={<IconArrowBackUp size={16} />}
        variant="warning"
        onConfirm={() => confirmRevertPaso !== null && revertirAPaso(confirmRevertPaso)}
        onCancel={() => setConfirmRevertPaso(null)}
      />
    </>
  )
}
