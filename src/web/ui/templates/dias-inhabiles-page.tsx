'use client'

import type { DiaInhabil } from '@/payload-types'
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
import { IconChevronLeft, IconChevronRight, IconTrash } from '@tabler/icons-react'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { twJoin } from 'tailwind-merge'

interface Props {
  diasInhabiles: DiaInhabil[]
}

type DiaPanelForm = { motivo: string; activo: boolean }

function formatFecha(value: string): string {
  return value.split('T')[0]
}

export function DiasInhabilesPage({ diasInhabiles }: Props) {
  const [dias, setDias] = useState(diasInhabiles)
  const [isSaving, setIsSaving] = useState(false)
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })
  const [selectedDateISO, setSelectedDateISO] = useState(() => {
    const hoy = formatDateISO(new Date())
    return asegurarFechaGestionable(hoy, hoy)
  })

  const form = useForm<DiaPanelForm>({ defaultValues: { motivo: '', activo: true } })

  const monthDays = useMemo(() => getMonthGridDays(calendarMonth), [calendarMonth])

  const diasMap = useMemo(() => {
    const map = new Map<string, DiaInhabil>()
    for (const dia of dias) {
      map.set(formatFecha(dia.fecha), dia)
    }
    return map
  }, [dias])

  const selectedDia = diasMap.get(selectedDateISO)
  const todayISO = formatDateISO(new Date())

  useEffect(() => {
    const next = asegurarFechaGestionable(selectedDateISO, todayISO)
    if (next !== selectedDateISO) {
      setSelectedDateISO(next)
    }
  }, [selectedDateISO, todayISO])

  useEffect(() => {
    const current = dias.find((item) => formatFecha(item.fecha) === selectedDateISO)
    if (current) {
      form.reset({ motivo: current.motivo, activo: current.activo ?? true })
    } else {
      form.reset({ motivo: '', activo: true })
    }
    // form.reset es estable en react-hook-form
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDateISO, dias])

  const guardarDia = async (values: DiaPanelForm) => {
    if (esFechaAnteriorAHoy(selectedDateISO, todayISO)) {
      toast.error('No se pueden modificar fechas pasadas')
      return
    }

    if (esFinDeSemanaDesdeISO(selectedDateISO)) {
      toast.error('No hay actividad los sábados ni domingos')
      return
    }

    const motivo = values.motivo.trim()
    if (!motivo) {
      toast.error('El motivo es obligatorio')
      return
    }

    setIsSaving(true)
    try {
      if (selectedDia) {
        const updated = await sdk.update({
          collection: 'dia-inhabil',
          id: selectedDia.id,
          data: { motivo, activo: values.activo },
        })
        setDias((prev) => prev.map((d) => (d.id === selectedDia.id ? (updated as DiaInhabil) : d)))
        toast.success('Día inhábil actualizado')
      } else {
        const created = await sdk.create({
          collection: 'dia-inhabil',
          data: { fecha: selectedDateISO, motivo, activo: values.activo },
        })
        setDias((prev) => [created as DiaInhabil, ...prev])
        toast.success('Día inhábil registrado')
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'No se pudo guardar el día inhábil')
    } finally {
      setIsSaving(false)
    }
  }

  const eliminarDia = async () => {
    if (!selectedDia) return
    if (esFechaAnteriorAHoy(selectedDateISO, todayISO)) {
      toast.error('No se pueden eliminar registros de fechas pasadas')
      return
    }

    if (esFinDeSemanaDesdeISO(selectedDateISO)) {
      toast.error('No hay actividad los sábados ni domingos')
      return
    }

    setIsSaving(true)
    try {
      await sdk.delete({ collection: 'dia-inhabil', id: selectedDia.id })
      setDias((prev) => prev.filter((d) => d.id !== selectedDia.id))
      form.reset({ motivo: '', activo: true })
      toast.success('Día inhábil eliminado')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'No se pudo eliminar el día inhábil')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_380px]">
      <article className="card card-border bg-base-100">
        <section className="card-body">
          <header className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <h2 className="card-title">Calendario — días inhábiles</h2>
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
              const dia = diasMap.get(dateISO)
              const buttonClass = dia ? (dia.activo ? 'btn-error' : 'btn-warning') : 'btn-ghost'

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
          <h3 className="card-title text-base">Detalle del día</h3>
          <p className="text-sm opacity-80">
            Fecha seleccionada:{' '}
            <time dateTime={selectedDateISO}>
              {new Date(`${selectedDateISO}T12:00:00`).toLocaleDateString('es-AR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </time>
          </p>

          <form className="mt-4 grid gap-3" onSubmit={form.handleSubmit(guardarDia)}>
            <label className="fieldset">
              <span className="fieldset-legend">Motivo</span>
              <input
                type="text"
                className="input input-bordered"
                placeholder="Ej. Feriado nacional, cierre administrativo"
                {...form.register('motivo', { required: 'El motivo es obligatorio' })}
              />
              {form.formState.errors.motivo && (
                <p className="text-error text-xs">{form.formState.errors.motivo.message}</p>
              )}
            </label>

            <label className="label cursor-pointer justify-start gap-2">
              <input
                type="checkbox"
                className="checkbox checkbox-sm"
                {...form.register('activo')}
              />
              <span className="label-text">Bloquear turnos en esta fecha</span>
            </label>

            <section className="flex flex-wrap gap-2">
              <button type="submit" className="btn btn-warning flex-1" disabled={isSaving}>
                {selectedDia ? 'Guardar cambios' : 'Guardar día inhábil'}
              </button>
              {selectedDia && (
                <button
                  type="button"
                  className="btn btn-error btn-outline"
                  onClick={() => void eliminarDia()}
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
    </section>
  )
}
