'use client'

import { ESTADO_TRAMITE, ESTADO_TURNO, TIPO_TURNO, type TipoTurno } from '@/constants/tramites'
import type { Ciudadano, Tramite, TurnoCurso, TurnoPsicofisico } from '@/payload-types'
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

interface Props {
  tramite: TramiteConCiudadano
  turnoCurso: TurnoCurso | null
  turnoPsicofisico: TurnoPsicofisico | null
  turnosCursoActivos: { fecha: string; hora: string }[]
  turnosPsicoActivos: { fecha: string; hora: string }[]
}

export function TramiteDetallePage({
  tramite,
  turnoCurso: initialTurnoCurso,
  turnoPsicofisico: initialTurnoPsicofisico,
  turnosCursoActivos,
  turnosPsicoActivos,
}: Props) {
  const router = useRouter()

  const [tramiteState, setTramiteState] = useState<TramiteConCiudadano>(tramite)
  const [turnoCurso, setTurnoCurso] = useState<TurnoCurso | null>(initialTurnoCurso)
  const [turnoPsicofisico, setTurnoPsicofisico] = useState<TurnoPsicofisico | null>(initialTurnoPsicofisico)
  const [isSaving, setIsSaving] = useState(false)

  // Modal state: null = cerrado, objeto = abrir modal con datos
  const [turnoModalConfig, setTurnoModalConfig] = useState<{
    tipoTurno: TipoTurno
    turnoExistente?: TurnoCurso | TurnoPsicofisico
  } | null>(null)

  const [confirmCancelTurno, setConfirmCancelTurno] = useState<TipoTurno | null>(null)
  const [confirmCompletar, setConfirmCompletar] = useState(false)

  const estaCompletado = tramiteState.estado === ESTADO_TRAMITE.COMPLETADO
  const estaCancelado = tramiteState.estado === ESTADO_TRAMITE.CANCELADO
  const tramiteActivo = !estaCompletado && !estaCancelado

  // ─── Turno CRUD ───

  const handleAsignarOModificarTurno = async (fecha: string, hora: string, observaciones?: string) => {
    if (!turnoModalConfig) return

    const { tipoTurno, turnoExistente } = turnoModalConfig
    setIsSaving(true)

    try {
      if (turnoExistente) {
        // Modificar turno existente
        const collection = tipoTurno === TIPO_TURNO.CURSO ? 'turno-curso' : 'turno-psicofisico'
        const response = await sdk.update({
          collection: collection as 'turno-curso',
          id: turnoExistente.id,
          data: { fecha, hora, observaciones },
        })

        if (!response?.id) throw new Error('No se pudo actualizar el turno')

        if (tipoTurno === TIPO_TURNO.CURSO) {
          setTurnoCurso(response as unknown as TurnoCurso)
        } else {
          setTurnoPsicofisico(response as unknown as TurnoPsicofisico)
        }

        toast.success('Turno modificado exitosamente')
      } else {
        // Crear turno nuevo
        const collection = tipoTurno === TIPO_TURNO.CURSO ? 'turno-curso' : 'turno-psicofisico'
        const response = await sdk.create({
          collection: collection as 'turno-curso',
          data: {
            tramite: tramiteState.id,
            fecha,
            hora,
            estado: ESTADO_TURNO.PROGRAMADO,
            observaciones,
          },
        })

        if (!response?.id) throw new Error('No se pudo crear el turno')

        if (tipoTurno === TIPO_TURNO.CURSO) {
          setTurnoCurso(response as unknown as TurnoCurso)
        } else {
          setTurnoPsicofisico(response as unknown as TurnoPsicofisico)
        }

        const fechaDisplay = new Date(fecha + 'T12:00:00').toLocaleDateString('es-AR')
        toast.success(`Turno asignado para el ${fechaDisplay} a las ${hora}`)
      }

      setTurnoModalConfig(null)
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error(error instanceof Error ? error.message : 'Error al gestionar el turno')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancelarTurno = async (tipoTurno: TipoTurno) => {
    const turno = tipoTurno === TIPO_TURNO.CURSO ? turnoCurso : turnoPsicofisico
    if (!turno) return

    setIsSaving(true)

    try {
      const collection = tipoTurno === TIPO_TURNO.CURSO ? 'turno-curso' : 'turno-psicofisico'
      await sdk.delete({
        collection: collection as 'turno-curso',
        id: turno.id,
      })

      if (tipoTurno === TIPO_TURNO.CURSO) {
        setTurnoCurso(null)
      } else {
        setTurnoPsicofisico(null)
      }

      setConfirmCancelTurno(null)
      toast.success('Turno eliminado')
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error(error instanceof Error ? error.message : 'Error al eliminar el turno')
    } finally {
      setIsSaving(false)
    }
  }

  // ─── Tramite actions ───

  const handleCompletarTramite = async () => {
    setIsSaving(true)

    try {
      const response = await sdk.update({
        collection: 'tramite',
        id: tramiteState.id,
        data: {
          estado: ESTADO_TRAMITE.COMPLETADO,
          fechaFin: new Date().toISOString(),
        },
      })

      if (!response?.id) throw new Error('No se pudo completar el trámite')

      setTramiteState((prev) => ({
        ...prev,
        estado: ESTADO_TRAMITE.COMPLETADO,
        fechaFin: new Date().toISOString(),
      }) as TramiteConCiudadano)

      setConfirmCompletar(false)
      toast.success('Trámite completado exitosamente')
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error(error instanceof Error ? error.message : 'Error al completar el trámite')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <section className="flex flex-col gap-6">
          <TramiteTurnosCard
            tipo={tramiteState.tipo}
            turnoCurso={turnoCurso}
            turnoPsicofisico={turnoPsicofisico}
            onAsignarTurnoCurso={
              tramiteActivo && !turnoCurso
                ? () => setTurnoModalConfig({ tipoTurno: TIPO_TURNO.CURSO })
                : undefined
            }
            onAsignarTurnoPsicofisico={
              tramiteActivo && !turnoPsicofisico
                ? () => setTurnoModalConfig({ tipoTurno: TIPO_TURNO.PSICOFISICO })
                : undefined
            }
            onModificarTurnoCurso={
              tramiteActivo && turnoCurso
                ? () => setTurnoModalConfig({ tipoTurno: TIPO_TURNO.CURSO, turnoExistente: turnoCurso })
                : undefined
            }
            onModificarTurnoPsicofisico={
              tramiteActivo && turnoPsicofisico
                ? () => setTurnoModalConfig({ tipoTurno: TIPO_TURNO.PSICOFISICO, turnoExistente: turnoPsicofisico })
                : undefined
            }
            onCancelarTurnoCurso={
              tramiteActivo && turnoCurso
                ? () => setConfirmCancelTurno(TIPO_TURNO.CURSO)
                : undefined
            }
            onCancelarTurnoPsicofisico={
              tramiteActivo && turnoPsicofisico
                ? () => setConfirmCancelTurno(TIPO_TURNO.PSICOFISICO)
                : undefined
            }
            disabled={isSaving}
          />

          {tramiteActivo && (
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
          <TramiteInfoCard
            tramite={tramiteState}
            disabled={isSaving || !tramiteActivo}
            onFutUpdate={async (fut) => {
              setIsSaving(true)
              try {
                const response = await sdk.update({
                  collection: 'tramite',
                  id: tramiteState.id,
                  data: { fut: fut || undefined },
                })
                if (!response?.id) throw new Error('No se pudo actualizar el FUT')
                setTramiteState((prev) => ({ ...prev, fut: fut || null }) as TramiteConCiudadano)
                router.refresh()
                toast.success(fut ? 'FUT actualizado' : 'FUT eliminado')
                return true
              } catch (error) {
                console.error(error)
                toast.error(error instanceof Error ? error.message : 'Error al actualizar el FUT')
                return false
              } finally {
                setIsSaving(false)
              }
            }}
          />
        </aside>
      </section>

      {turnoModalConfig !== null && (
        <AsignarTurnoModal
          tipoTurno={turnoModalConfig.tipoTurno}
          ciudadanoNombre={`${tramiteState.ciudadano.nombre} ${tramiteState.ciudadano.apellido}`}
          turnosExistentes={
            turnoModalConfig.tipoTurno === TIPO_TURNO.CURSO
              ? turnosCursoActivos
              : turnosPsicoActivos
          }
          turnoExistente={turnoModalConfig.turnoExistente}
          onConfirm={handleAsignarOModificarTurno}
          onCancel={() => setTurnoModalConfig(null)}
        />
      )}

      <ConfirmDialog
        open={confirmCancelTurno !== null}
        title="Eliminar turno"
        description={
          <>
            ¿Estás seguro de que querés eliminar el turno de{' '}
            <strong>
              {confirmCancelTurno === TIPO_TURNO.CURSO ? 'Curso Presencial' : 'Examen Psicofísico'}
            </strong>
            ? Esta acción no se puede deshacer.
          </>
        }
        confirmLabel="Sí, eliminar turno"
        confirmIcon={<IconCalendarX size={16} />}
        variant="error"
        onConfirm={() => confirmCancelTurno !== null && handleCancelarTurno(confirmCancelTurno)}
        onCancel={() => setConfirmCancelTurno(null)}
      />

      <ConfirmDialog
        open={confirmCompletar}
        title="Completar trámite"
        description="¿Estás seguro de que querés marcar este trámite como completado?"
        confirmLabel="Sí, completar"
        confirmIcon={<IconCheck size={16} />}
        variant="primary"
        onConfirm={handleCompletarTramite}
        onCancel={() => setConfirmCompletar(false)}
      />
    </>
  )
}
