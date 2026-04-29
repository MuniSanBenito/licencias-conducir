'use client'

import { HORARIOS_PSICOFISICO } from '@/constants/turnos'
import type { DiaInhabil, HorarioPsicofisicoExcepcion } from '@/payload-types'
import { sdk } from '@/web/libs/payload/client'
import { IconChevronLeft, IconChevronRight, IconPlus, IconTrash } from '@tabler/icons-react'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { twJoin } from 'tailwind-merge'

interface Props {
  diasInhabiles: DiaInhabil[]
  excepcionesPsicofisico: HorarioPsicofisicoExcepcion[]
}

type DiaInhabilForm = { fecha: string; motivo: string }
type ExcepcionForm = { fecha: string; inicio: string; fin: string; activo: boolean; motivo: string }

const DAY_LABELS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'] as const
const MONTH_LABELS = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
] as const

function formatDateISO(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatFecha(value: string): string {
  return value.split('T')[0]
}

function mondayFirstDay(day: number): number {
  return day === 0 ? 6 : day - 1
}

function defaultHorarioByDate(dateISO: string): { inicio: string; fin: string; activo: boolean } {
  const day = new Date(`${dateISO}T12:00:00`).getDay()
  const horario = HORARIOS_PSICOFISICO[day]
  if (!horario) return { inicio: '07:00', fin: '11:00', activo: false }
  return { inicio: horario.inicio, fin: horario.fin, activo: true }
}

export function AgendaPage({ diasInhabiles, excepcionesPsicofisico }: Props) {
  const [dias, setDias] = useState(diasInhabiles)
  const [excepciones, setExcepciones] = useState(excepcionesPsicofisico)
  const [isSaving, setIsSaving] = useState(false)
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })
  const [selectedDateISO, setSelectedDateISO] = useState<string>(() => formatDateISO(new Date()))

  const diaForm = useForm<DiaInhabilForm>({ defaultValues: { fecha: '', motivo: '' } })
  const excepcionForm = useForm<ExcepcionForm>({
    defaultValues: { fecha: '', inicio: '07:00', fin: '11:00', activo: true, motivo: '' },
  })

  async function crearDiaInhabil(values: DiaInhabilForm) {
    setIsSaving(true)
    try {
      const created = await sdk.create({
        collection: 'dia-inhabil',
        data: { fecha: values.fecha, motivo: values.motivo, activo: true },
      })
      setDias((prev) => [created, ...prev])
      diaForm.reset({ fecha: '', motivo: '' })
      toast.success('Día inhábil agregado')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'No se pudo crear el día inhábil')
    } finally {
      setIsSaving(false)
    }
  }

  async function eliminarDiaInhabil(id: string) {
    setIsSaving(true)
    try {
      await sdk.delete({ collection: 'dia-inhabil', id })
      setDias((prev) => prev.filter((dia) => dia.id !== id))
      toast.success('Día inhábil eliminado')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'No se pudo eliminar el día inhábil')
    } finally {
      setIsSaving(false)
    }
  }

  async function guardarExcepcion(values: ExcepcionForm) {
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
          prev.map((item) => (item.id === existente.id ? (updated as HorarioPsicofisicoExcepcion) : item)),
        )
      } else {
        const created = await sdk.create({
          collection: 'horario-psicofisico-excepcion',
          data: values,
        })
        setExcepciones((prev) => [created as HorarioPsicofisicoExcepcion, ...prev])
      }
      toast.success('Excepción de horario guardada')
      excepcionForm.reset({ fecha: '', inicio: '07:00', fin: '11:00', activo: true, motivo: '' })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'No se pudo guardar la excepción')
    } finally {
      setIsSaving(false)
    }
  }

  async function eliminarExcepcion(id: string) {
    setIsSaving(true)
    try {
      await sdk.delete({ collection: 'horario-psicofisico-excepcion', id })
      setExcepciones((prev) => prev.filter((item) => item.id !== id))
      toast.success('Excepción eliminada')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'No se pudo eliminar la excepción')
    } finally {
      setIsSaving(false)
    }
  }

  const monthDays = useMemo(() => {
    const firstDay = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1)
    const offset = mondayFirstDay(firstDay.getDay())
    const start = new Date(firstDay)
    start.setDate(firstDay.getDate() - offset)

    const days: Date[] = []
    for (let i = 0; i < 42; i++) {
      const date = new Date(start)
      date.setDate(start.getDate() + i)
      days.push(date)
    }
    return days
  }, [calendarMonth])

  const excepcionesMap = useMemo(() => {
    const map = new Map<string, HorarioPsicofisicoExcepcion>()
    for (const item of excepciones) {
      map.set(formatFecha(item.fecha), item)
    }
    return map
  }, [excepciones])

  const selectedExcepcion = excepcionesMap.get(selectedDateISO)

  function selectDate(dateISO: string) {
    setSelectedDateISO(dateISO)
    const current = excepcionesMap.get(dateISO)
    if (current) {
      excepcionForm.reset({
        fecha: dateISO,
        inicio: current.inicio,
        fin: current.fin,
        activo: current.activo ?? true,
        motivo: current.motivo ?? '',
      })
      return
    }
    const defaults = defaultHorarioByDate(dateISO)
    excepcionForm.reset({
      fecha: dateISO,
      inicio: defaults.inicio,
      fin: defaults.fin,
      activo: defaults.activo,
      motivo: '',
    })
  }

  useEffect(() => {
    selectDate(selectedDateISO)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDateISO, excepciones.length])

  return (
    <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1.4fr]">
      <article className="card card-border bg-base-100">
        <section className="card-body">
          <h2 className="card-title">Días inhábiles</h2>

          <form className="grid gap-3" onSubmit={diaForm.handleSubmit(crearDiaInhabil)}>
            <input
              type="date"
              className="input input-bordered"
              {...diaForm.register('fecha', { required: true })}
            />
            <input
              type="text"
              className="input input-bordered"
              placeholder="Motivo"
              {...diaForm.register('motivo', { required: true })}
            />
            <button className="btn btn-warning" disabled={isSaving}>
              <IconPlus size={16} />
              Agregar día inhábil
            </button>
          </form>

          <ul className="mt-2 grid gap-2" role="list">
            {dias.map((dia) => (
              <li key={dia.id} className="bg-base-200 flex items-center justify-between rounded-lg px-3 py-2">
                <section>
                  <p className="font-medium">{new Date(dia.fecha).toLocaleDateString('es-AR')}</p>
                  <p className="text-xs opacity-70">{dia.motivo}</p>
                </section>
                <button
                  className="btn btn-ghost btn-error btn-xs"
                  onClick={() => eliminarDiaInhabil(dia.id)}
                  disabled={isSaving}
                >
                  <IconTrash size={14} />
                </button>
              </li>
            ))}
          </ul>
        </section>
      </article>

      <article className="card card-border bg-base-100">
        <section className="card-body">
          <header className="mb-2 flex items-center justify-between">
            <h2 className="card-title">Excepciones psicofísico</h2>
            <section className="join">
              <button
                className="btn btn-ghost btn-sm join-item"
                onClick={() =>
                  setCalendarMonth(
                    new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1),
                  )
                }
              >
                <IconChevronLeft size={16} />
              </button>
              <button
                className="btn btn-ghost btn-sm join-item"
                onClick={() =>
                  setCalendarMonth(
                    new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1),
                  )
                }
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

          <section className="mt-1 grid grid-cols-7 gap-1">
            {monthDays.map((date) => {
              const dateISO = formatDateISO(date)
              const isCurrentMonth = date.getMonth() === calendarMonth.getMonth()
              const isSelected = selectedDateISO === dateISO
              const excepcion = excepcionesMap.get(dateISO)
              const buttonClass = excepcion
                ? excepcion.activo
                  ? 'btn-success'
                  : 'btn-error'
                : 'btn-ghost'

              return (
                <button
                  key={dateISO}
                  className={twJoin(
                    'btn btn-sm',
                    buttonClass,
                    !isCurrentMonth && 'btn-disabled',
                    isSelected && 'ring ring-primary ring-offset-1',
                  )}
                  onClick={() => selectDate(dateISO)}
                  disabled={!isCurrentMonth}
                >
                  {date.getDate()}
                </button>
              )
            })}
          </section>

          <form className="mt-4 grid gap-3" onSubmit={excepcionForm.handleSubmit(guardarExcepcion)}>
            <input type="hidden" {...excepcionForm.register('fecha', { required: true })} />
            <section className="grid grid-cols-2 gap-2">
              <input
                type="time"
                className="input input-bordered"
                {...excepcionForm.register('inicio', { required: true })}
              />
              <input
                type="time"
                className="input input-bordered"
                {...excepcionForm.register('fin', { required: true })}
              />
            </section>
            <input
              type="text"
              className="input input-bordered"
              placeholder="Motivo (opcional)"
              {...excepcionForm.register('motivo')}
            />
            <label className="label cursor-pointer justify-start gap-2">
              <input type="checkbox" className="checkbox checkbox-sm" {...excepcionForm.register('activo')} />
              <span className="label-text">Agenda habilitada para este día</span>
            </label>
            <section className="flex gap-2">
              <button className="btn btn-primary flex-1" disabled={isSaving}>
                Guardar excepción
              </button>
              {selectedExcepcion && (
                <button
                  type="button"
                  className="btn btn-error btn-outline"
                  onClick={() => eliminarExcepcion(selectedExcepcion.id)}
                  disabled={isSaving}
                >
                  <IconTrash size={14} />
                </button>
              )}
            </section>
          </form>
        </section>
      </article>
    </section>
  )
}
