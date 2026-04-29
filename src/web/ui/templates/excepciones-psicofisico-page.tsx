'use client'

import { HORARIOS_PSICOFISICO } from '@/constants/turnos'
import type { HorarioPsicofisicoExcepcion } from '@/payload-types'
import { sdk } from '@/web/libs/payload/client'
import {
  DAY_LABELS,
  MONTH_LABELS,
  asegurarFechaGestionable,
  esFechaAnteriorAHoy,
  esFinDeSemana,
  esFinDeSemanaDesdeISO,
  formatDateISO,
  getMonthGridDays,
} from '@/web/utils/calendario-mensual'
import { ConfirmActionDialog } from '@/web/ui/molecules/confirm-action-dialog'
import { IconChevronLeft, IconChevronRight, IconTrash } from '@tabler/icons-react'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { twJoin } from 'tailwind-merge'

interface Props {
  excepcionesPsicofisico: HorarioPsicofisicoExcepcion[]
}

type ExcepcionForm = { fecha: string; inicio: string; fin: string; activo: boolean; motivo: string }

function formatFecha(value: string): string {
  return value.split('T')[0]
}

function fechaLargaEsAR(dateISO: string): string {
  return new Date(`${dateISO}T12:00:00`).toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function defaultHorarioByDate(dateISO: string): { inicio: string; fin: string; activo: boolean } {
  const day = new Date(`${dateISO}T12:00:00`).getDay()
  const horario = HORARIOS_PSICOFISICO[day]
  if (!horario) return { inicio: '07:00', fin: '11:00', activo: false }
  return { inicio: horario.inicio, fin: horario.fin, activo: true }
}

export function ExcepcionesPsicofisicoPage({ excepcionesPsicofisico }: Props) {
  const [excepciones, setExcepciones] = useState(excepcionesPsicofisico)
  const [isSaving, setIsSaving] = useState(false)
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })
  const [selectedDateISO, setSelectedDateISO] = useState<string>(() => {
    const hoy = formatDateISO(new Date())
    return asegurarFechaGestionable(hoy, hoy)
  })

  const excepcionForm = useForm<ExcepcionForm>({
    defaultValues: { fecha: '', inicio: '07:00', fin: '11:00', activo: true, motivo: '' },
  })
  const [confirmMode, setConfirmMode] = useState<null | 'guardar' | 'eliminar'>(null)
  const [valoresGuardadoPendiente, setValoresGuardadoPendiente] = useState<ExcepcionForm | null>(null)

  const monthDays = useMemo(() => getMonthGridDays(calendarMonth), [calendarMonth])

  const excepcionesMap = useMemo(() => {
    const map = new Map<string, HorarioPsicofisicoExcepcion>()
    for (const item of excepciones) {
      map.set(formatFecha(item.fecha), item)
    }
    return map
  }, [excepciones])

  const selectedExcepcion = excepcionesMap.get(selectedDateISO)
  const todayISO = formatDateISO(new Date())

  useEffect(() => {
    const next = asegurarFechaGestionable(selectedDateISO, todayISO)
    if (next !== selectedDateISO) {
      setSelectedDateISO(next)
    }
  }, [selectedDateISO, todayISO])

  useEffect(() => {
    const current = excepciones.find((item) => formatFecha(item.fecha) === selectedDateISO)
    if (current) {
      excepcionForm.reset({
        fecha: selectedDateISO,
        inicio: current.inicio,
        fin: current.fin,
        activo: current.activo ?? true,
        motivo: current.motivo ?? '',
      })
    } else {
      const defaults = defaultHorarioByDate(selectedDateISO)
      excepcionForm.reset({
        fecha: selectedDateISO,
        inicio: defaults.inicio,
        fin: defaults.fin,
        activo: defaults.activo,
        motivo: '',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDateISO, excepciones])

  const validarFechaExcepcion = (fecha: string): boolean => {
    if (esFechaAnteriorAHoy(fecha, todayISO)) {
      toast.error('No se pueden modificar fechas pasadas')
      return false
    }
    if (esFinDeSemanaDesdeISO(fecha)) {
      toast.error('No hay actividad los sábados ni domingos')
      return false
    }
    return true
  }

  const abrirConfirmacionGuardar = (values: ExcepcionForm) => {
    if (!validarFechaExcepcion(values.fecha)) return
    setValoresGuardadoPendiente(values)
    setConfirmMode('guardar')
  }

  const ejecutarGuardarExcepcion = async () => {
    const values = valoresGuardadoPendiente
    if (!values) return

    setIsSaving(true)
    try {
      const existente = excepciones.find((item) => formatFecha(item.fecha) === values.fecha)
      if (existente) {
        const updated = await sdk.update({
          collection: 'horario-psicofisico-excepcion',
          id: existente.id,
          data: values,
        })
        setExcepciones((prev) =>
          prev.map((item) =>
            item.id === existente.id ? (updated as HorarioPsicofisicoExcepcion) : item,
          ),
        )
      } else {
        const created = await sdk.create({
          collection: 'horario-psicofisico-excepcion',
          data: values,
        })
        setExcepciones((prev) => [created as HorarioPsicofisicoExcepcion, ...prev])
      }
      toast.success('Excepción de horario guardada')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'No se pudo guardar la excepción')
    } finally {
      setIsSaving(false)
      setValoresGuardadoPendiente(null)
    }
  }

  const abrirConfirmacionEliminar = () => {
    if (!selectedExcepcion) return
    if (!validarFechaExcepcion(selectedDateISO)) return
    setConfirmMode('eliminar')
  }

  const ejecutarEliminarExcepcion = async () => {
    if (!selectedExcepcion) return
    setIsSaving(true)
    try {
      await sdk.delete({ collection: 'horario-psicofisico-excepcion', id: selectedExcepcion.id })
      setExcepciones((prev) => prev.filter((item) => item.id !== selectedExcepcion.id))
      toast.success('Excepción eliminada')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'No se pudo eliminar la excepción')
    } finally {
      setIsSaving(false)
    }
  }

  const cerrarConfirmacion = () => {
    setConfirmMode(null)
    setValoresGuardadoPendiente(null)
  }

  const fechaLargaSeleccion = fechaLargaEsAR(selectedDateISO)

  return (
    <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_380px]">
      <article className="card card-border bg-base-100">
        <section className="card-body">
          <header className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <h2 className="card-title">Calendario — excepciones psicofísico</h2>
            <section className="join">
              <button
                type="button"
                className="btn btn-ghost btn-sm join-item"
                onClick={() =>
                  setCalendarMonth(
                    new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1),
                  )
                }
                aria-label="Mes anterior"
              >
                <IconChevronLeft size={16} />
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm join-item"
                onClick={() =>
                  setCalendarMonth(
                    new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1),
                  )
                }
                aria-label="Mes siguiente"
              >
                <IconChevronRight size={16} />
              </button>
            </section>
          </header>

          <p className="text-sm font-semibold">
            {MONTH_LABELS[calendarMonth.getMonth()]} {calendarMonth.getFullYear()}
          </p>

          <section className="mt-2 grid grid-cols-7 gap-1 text-center text-xs opacity-60">
            {DAY_LABELS.map((label) => (
              <p key={label}>{label}</p>
            ))}
          </section>

          <p className="mt-2 text-xs opacity-70">
            <span className="bg-accent/25 rounded px-2 py-0.5 font-medium">Hoy</span> resaltado. Solo días
            hábiles desde hoy: sábados, domingos y fechas pasadas no se pueden gestionar.
          </p>

          <section className="mt-1 grid grid-cols-7 gap-1">
            {monthDays.map((date) => {
              const dateISO = formatDateISO(date)
              const isCurrentMonth = date.getMonth() === calendarMonth.getMonth()
              const isPastDay = esFechaAnteriorAHoy(dateISO, todayISO)
              const isWeekend = esFinDeSemana(date)
              const isSelectable = isCurrentMonth && !isPastDay && !isWeekend
              const isSelected = selectedDateISO === dateISO
              const isToday = dateISO === todayISO
              const excepcion = excepcionesMap.get(dateISO)
              const buttonClass = excepcion
                ? excepcion.activo
                  ? 'btn-success'
                  : 'btn-error'
                : 'btn-ghost'

              return (
                <button
                  key={dateISO}
                  type="button"
                  className={twJoin(
                    'btn btn-sm',
                    buttonClass,
                    (!isCurrentMonth || isPastDay || isWeekend) && 'btn-disabled opacity-50',
                    isToday && 'bg-accent/25 font-semibold',
                    isSelected && 'ring-primary ring-offset-base-100 ring-2 ring-offset-2',
                  )}
                  onClick={() => setSelectedDateISO(dateISO)}
                  disabled={!isSelectable}
                  aria-pressed={isSelected}
                  aria-label={
                    isWeekend && isCurrentMonth
                      ? `Día ${date.getDate()}, fin de semana, no editable`
                      : isPastDay && isCurrentMonth
                        ? `Día ${date.getDate()}, fecha pasada, no editable`
                        : excepcion && isSelectable
                          ? `Día ${date.getDate()}, excepción registrada, ${isSelected ? 'seleccionado' : 'elegir para editar o eliminar'}`
                          : isToday
                            ? `Hoy ${date.getDate()}, ${isSelected ? 'seleccionado' : ''}`
                            : `Día ${date.getDate()}`
                  }
                >
                  {date.getDate()}
                </button>
              )
            })}
          </section>
        </section>
      </article>

      <aside className="card card-border bg-base-100 h-fit">
        <section className="card-body">
          <h3 className="card-title text-base">
            {selectedExcepcion ? 'Editar excepción' : 'Nueva excepción de horario'}
          </h3>
          <p className="text-sm opacity-80">
            Fecha: <time dateTime={selectedDateISO}>{fechaLargaSeleccion}</time>
          </p>

          {selectedExcepcion ? (
            <p role="status" className="alert alert-warning mt-3 text-sm">
              Ya hay una excepción guardada para esta fecha. Podés ajustar horarios, el estado de la
              agenda o el motivo, o eliminar la excepción para volver al horario por defecto del
              sistema.
            </p>
          ) : (
            <p role="status" className="alert alert-info mt-3 text-sm">
              Esta fecha usa hoy el horario estándar del código. Guardá para definir un horario
              especial o cerrar la agenda solo ese día.
            </p>
          )}

          <form
            className="mt-4 grid gap-3"
            onSubmit={excepcionForm.handleSubmit(abrirConfirmacionGuardar)}
          >
            <input type="hidden" {...excepcionForm.register('fecha', { required: true })} />
            <section className="grid grid-cols-2 gap-2">
              <label className="fieldset">
                <span className="fieldset-legend">Inicio</span>
                <input
                  type="time"
                  className="input input-bordered"
                  {...excepcionForm.register('inicio', { required: true })}
                />
              </label>
              <label className="fieldset">
                <span className="fieldset-legend">Fin</span>
                <input
                  type="time"
                  className="input input-bordered"
                  {...excepcionForm.register('fin', { required: true })}
                />
              </label>
            </section>
            <label className="fieldset">
              <span className="fieldset-legend">Motivo (opcional)</span>
              <input
                type="text"
                className="input input-bordered"
                {...excepcionForm.register('motivo')}
              />
            </label>
            <label className="label cursor-pointer justify-start gap-2">
              <input
                type="checkbox"
                className="checkbox checkbox-sm"
                {...excepcionForm.register('activo')}
              />
              <span className="label-text">Agenda habilitada para este día</span>
            </label>
            <section className="flex flex-wrap gap-2">
              <button type="submit" className="btn btn-primary flex-1" disabled={isSaving}>
                {selectedExcepcion ? 'Guardar cambios' : 'Guardar excepción'}
              </button>
              {selectedExcepcion && (
                <button
                  type="button"
                  className="btn btn-error btn-outline"
                  onClick={abrirConfirmacionEliminar}
                  disabled={isSaving}
                >
                  <IconTrash size={14} />
                  Eliminar
                </button>
              )}
            </section>
          </form>
        </section>
      </aside>

      <ConfirmActionDialog
        open={confirmMode !== null}
        onOpenChange={(next) => {
          if (!next) cerrarConfirmacion()
        }}
        title={
          confirmMode === 'eliminar'
            ? 'Eliminar excepción'
            : selectedExcepcion
              ? 'Confirmar cambios'
              : 'Confirmar registro'
        }
        message={
          confirmMode === 'eliminar'
            ? `¿Eliminar la excepción del ${fechaLargaSeleccion}? Ese día volverá a usar el horario por defecto definido en código.`
            : selectedExcepcion
              ? `¿Guardar los cambios de la excepción para el ${fechaLargaSeleccion}?`
              : `¿Registrar una excepción de horario para el ${fechaLargaSeleccion}?`
        }
        confirmLabel={confirmMode === 'eliminar' ? 'Eliminar' : 'Guardar'}
        confirmVariant={confirmMode === 'eliminar' ? 'error' : 'warning'}
        onConfirm={() => {
          if (confirmMode === 'guardar') void ejecutarGuardarExcepcion()
          if (confirmMode === 'eliminar') void ejecutarEliminarExcepcion()
        }}
      />
    </section>
  )
}
