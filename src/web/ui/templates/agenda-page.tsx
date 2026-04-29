'use client'

import type {
  DiaInhabil,
  HorarioPsicofisico,
  HorarioPsicofisicoExcepcion,
} from '@/payload-types'
import { sdk } from '@/web/libs/payload/client'
import { IconClock, IconPlus, IconTrash } from '@tabler/icons-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface Props {
  diasInhabiles: DiaInhabil[]
  horariosPsicofisico: HorarioPsicofisico[]
  excepcionesPsicofisico: HorarioPsicofisicoExcepcion[]
}

type DiaInhabilForm = { fecha: string; motivo: string }
type DiaSemana = '1' | '2' | '3' | '4' | '5'
type HorarioForm = { diaSemana: DiaSemana; inicio: string; fin: string; activo: boolean }
type ExcepcionForm = { fecha: string; inicio: string; fin: string; activo: boolean; motivo: string }

const DIA_LABELS: Record<DiaSemana, string> = {
  '1': 'Lunes',
  '2': 'Martes',
  '3': 'Miércoles',
  '4': 'Jueves',
  '5': 'Viernes',
}

function formatFecha(value: string): string {
  return value.split('T')[0]
}

export function AgendaPage({ diasInhabiles, horariosPsicofisico, excepcionesPsicofisico }: Props) {
  const [dias, setDias] = useState(diasInhabiles)
  const [horarios, setHorarios] = useState(horariosPsicofisico)
  const [excepciones, setExcepciones] = useState(excepcionesPsicofisico)
  const [isSaving, setIsSaving] = useState(false)

  const diaForm = useForm<DiaInhabilForm>({ defaultValues: { fecha: '', motivo: '' } })
  const horarioForm = useForm<HorarioForm>({
    defaultValues: { diaSemana: '1', inicio: '08:00', fin: '11:00', activo: true },
  })
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

  async function guardarHorario(values: HorarioForm) {
    setIsSaving(true)
    try {
      const existente = horarios.find((horario) => horario.diaSemana === values.diaSemana)
      if (existente) {
        const updated = await sdk.update({
          collection: 'horario-psicofisico',
          id: existente.id,
          data: values,
        })
        setHorarios((prev) =>
          prev.map((item) => (item.id === existente.id ? (updated as HorarioPsicofisico) : item)),
        )
      } else {
        const created = await sdk.create({ collection: 'horario-psicofisico', data: values })
        setHorarios((prev) => [...prev, created as HorarioPsicofisico])
      }
      toast.success('Horario guardado')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'No se pudo guardar el horario')
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

  return (
    <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
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
          <h2 className="card-title">
            <IconClock size={18} />
            Horarios psicofísico
          </h2>

          <form className="grid gap-3" onSubmit={horarioForm.handleSubmit(guardarHorario)}>
            <select className="select select-bordered" {...horarioForm.register('diaSemana', { required: true })}>
              {(Object.entries(DIA_LABELS) as [DiaSemana, string][]).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <section className="grid grid-cols-2 gap-2">
              <input
                type="time"
                className="input input-bordered"
                {...horarioForm.register('inicio', { required: true })}
              />
              <input
                type="time"
                className="input input-bordered"
                {...horarioForm.register('fin', { required: true })}
              />
            </section>
            <label className="label cursor-pointer justify-start gap-2">
              <input type="checkbox" className="checkbox checkbox-sm" {...horarioForm.register('activo')} />
              <span className="label-text">Horario activo</span>
            </label>
            <button className="btn btn-info" disabled={isSaving}>
              Guardar horario
            </button>
          </form>

          <ul className="mt-2 grid gap-2" role="list">
            {horarios.map((horario) => (
              <li key={horario.id} className="bg-base-200 rounded-lg px-3 py-2 text-sm">
                <strong>{DIA_LABELS[horario.diaSemana as DiaSemana]}</strong>: {horario.inicio} - {horario.fin}{' '}
                {!horario.activo && <span className="opacity-50">(inactivo)</span>}
              </li>
            ))}
          </ul>
        </section>
      </article>

      <article className="card card-border bg-base-100">
        <section className="card-body">
          <h2 className="card-title">Excepciones por fecha (psicofísico)</h2>
          <p className="text-xs opacity-70">
            Los horarios por defecto quedan en código; acá solo cargás excepciones para fechas puntuales.
          </p>

          <form className="mt-2 grid gap-3" onSubmit={excepcionForm.handleSubmit(guardarExcepcion)}>
            <input
              type="date"
              className="input input-bordered"
              {...excepcionForm.register('fecha', { required: true })}
            />
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
              <input
                type="checkbox"
                className="checkbox checkbox-sm"
                {...excepcionForm.register('activo')}
              />
              <span className="label-text">Agenda habilitada para este día</span>
            </label>
            <button className="btn btn-primary" disabled={isSaving}>
              Guardar excepción
            </button>
          </form>

          <ul className="mt-2 grid gap-2" role="list">
            {excepciones.map((item) => (
              <li key={item.id} className="bg-base-200 flex items-center justify-between rounded-lg px-3 py-2">
                <section>
                  <p className="font-medium">{new Date(item.fecha).toLocaleDateString('es-AR')}</p>
                  <p className="text-xs opacity-70">
                    {item.activo ? `${item.inicio} - ${item.fin}` : 'Sin atención'}
                    {item.motivo ? ` · ${item.motivo}` : ''}
                  </p>
                </section>
                <button
                  className="btn btn-ghost btn-error btn-xs"
                  onClick={() => eliminarExcepcion(item.id)}
                  disabled={isSaving}
                >
                  <IconTrash size={14} />
                </button>
              </li>
            ))}
          </ul>
        </section>
      </article>
    </section>
  )
}
