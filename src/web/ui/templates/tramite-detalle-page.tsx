'use client'

import { ESTADO_TRAMITE, ESTADO_TURNO, TIPO_TURNO, type TipoTurno } from '@/constants/tramites'
import type { Ciudadano, Tramite } from '@/payload-types'
import { sdk } from '@/web/libs/payload/client'
import { AsignarTurnoModal } from '@/web/ui/molecules/asignar-turno-modal'
import { ConfirmDialog } from '@/web/ui/molecules/confirm-dialog'
import { TramiteCiudadanoCard } from '@/web/ui/molecules/tramite-ciudadano-card'
import { TramiteInfoCard } from '@/web/ui/molecules/tramite-info-card'
import { TramiteTurnosCard } from '@/web/ui/organisms/tramite-turnos-card'
import { IconCalendarX, IconCheck } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

type TramiteConCiudadano = Tramite & { ciudadano: Ciudadano }
type TurnoGroup = NonNullable<Tramite['turnoCurso']>

interface Props {
  tramite: TramiteConCiudadano
  turnosCursoExistentes: { fecha: string; hora: string }[]
  turnosPsicoExistentes: { fecha: string; hora: string }[]
}

export function TramiteDetallePage({
  tramite,
  turnosCursoExistentes,
  turnosPsicoExistentes,
}: Props) {
  const router = useRouter()

  const [tramiteState, setTramiteState] = useState<TramiteConCiudadano>(tramite)
  const [isSaving, setIsSaving] = useState(false)

  const [turnoModalTipo, setTurnoModalTipo] = useState<TipoTurno | null>(null)
  const [confirmCancelTurno, setConfirmCancelTurno] = useState<TipoTurno | null>(null)
  const [confirmCompletar, setConfirmCompletar] = useState(false)

  async function persistTramite(updates: Partial<Tramite>) {
    setIsSaving(true)

    try {
      const response = await sdk.update({
        collection: 'tramite',
        id: tramiteState.id,
        data: updates,
      })

      if (!response?.id) {
        throw new Error('No se pudo actualizar el trámite')
      }

      setTramiteState((prev) => ({
        ...prev,
        ...updates,
      }) as TramiteConCiudadano)

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

  async function asignarTurno(fecha: string, hora: string) {
    if (turnoModalTipo === null) return

    const fieldName = turnoModalTipo === TIPO_TURNO.CURSO ? 'turnoCurso' : 'turnoPsicofisico'
    const turnoData: TurnoGroup = {
      fecha,
      hora,
      estado: ESTADO_TURNO.PROGRAMADO,
    }

    const ok = await persistTramite({ [fieldName]: turnoData })

    if (ok) {
      setTurnoModalTipo(null)
      toast.success(`Turno asignado para el ${new Date(fecha + 'T12:00:00').toLocaleDateString('es-AR')} a las ${hora}`)
    }
  }

  async function cancelarTurno(tipoTurno: TipoTurno) {
    const fieldName = tipoTurno === TIPO_TURNO.CURSO ? 'turnoCurso' : 'turnoPsicofisico'
    const turnoActual = tramiteState[fieldName]

    if (!turnoActual) return

    const ok = await persistTramite({
      [fieldName]: {
        ...turnoActual,
        estado: ESTADO_TURNO.CANCELADO,
      },
    })

    if (ok) {
      setConfirmCancelTurno(null)
      toast.success('Turno cancelado')
    }
  }

  async function completarTramite() {
    const ok = await persistTramite({
      estado: ESTADO_TRAMITE.COMPLETADO,
      fechaFin: new Date().toISOString(),
    })

    if (ok) {
      setConfirmCompletar(false)
      toast.success('Trámite completado exitosamente')
    }
  }

  const estaCompletado = tramiteState.estado === ESTADO_TRAMITE.COMPLETADO
  const estaCancelado = tramiteState.estado === ESTADO_TRAMITE.CANCELADO

  return (
    <>
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <section className="flex flex-col gap-6">
          <TramiteTurnosCard
            tipo={tramiteState.tipo}
            turnoCurso={tramiteState.turnoCurso}
            turnoPsicofisico={tramiteState.turnoPsicofisico}
            onAsignarTurnoCurso={
              isSaving || estaCompletado || estaCancelado
                ? undefined
                : () => setTurnoModalTipo(TIPO_TURNO.CURSO)
            }
            onAsignarTurnoPsicofisico={
              isSaving || estaCompletado || estaCancelado
                ? undefined
                : () => setTurnoModalTipo(TIPO_TURNO.PSICOFISICO)
            }
            onCancelarTurnoCurso={
              isSaving || estaCompletado || estaCancelado
                ? undefined
                : () => setConfirmCancelTurno(TIPO_TURNO.CURSO)
            }
            onCancelarTurnoPsicofisico={
              isSaving || estaCompletado || estaCancelado
                ? undefined
                : () => setConfirmCancelTurno(TIPO_TURNO.PSICOFISICO)
            }
            disabled={isSaving}
          />

          {!estaCompletado && !estaCancelado && (
            <button
              className="btn btn-success btn-lg self-start"
              onClick={() => setConfirmCompletar(true)}
              disabled={isSaving}
            >
              <IconCheck size={20} />
              Completar Trámite
            </button>
          )}
        </section>

        <aside className="flex flex-col gap-5">
          <TramiteCiudadanoCard ciudadano={tramiteState.ciudadano} />
          <TramiteInfoCard tramite={tramiteState} />
        </aside>
      </section>

      {turnoModalTipo !== null && (
        <AsignarTurnoModal
          tipoTurno={turnoModalTipo}
          ciudadanoNombre={`${tramiteState.ciudadano.nombre} ${tramiteState.ciudadano.apellido}`}
          turnosExistentes={
            turnoModalTipo === TIPO_TURNO.CURSO
              ? turnosCursoExistentes
              : turnosPsicoExistentes
          }
          onConfirm={asignarTurno}
          onCancel={() => setTurnoModalTipo(null)}
        />
      )}

      <ConfirmDialog
        open={confirmCancelTurno !== null}
        title="Cancelar turno"
        description={
          <>
            ¿Estás seguro de que querés cancelar el turno de{' '}
            <strong>
              {confirmCancelTurno === TIPO_TURNO.CURSO ? 'Curso Presencial' : 'Examen Psicofísico'}
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
        open={confirmCompletar}
        title="Completar trámite"
        description="¿Estás seguro de que querés marcar este trámite como completado?"
        confirmLabel="Sí, completar"
        confirmIcon={<IconCheck size={16} />}
        variant="primary"
        onConfirm={completarTramite}
        onCancel={() => setConfirmCompletar(false)}
      />
    </>
  )
}
