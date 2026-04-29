'use client'

import { TIPO_TURNO_LABELS, type TipoTurno } from '@/constants/turnos'
import type {
  Ciudadano,
  DiaInhabil,
  HorarioPsicofisicoExcepcion,
  TurnoCurso,
  TurnoPsicofisico,
} from '@/payload-types'
import { sdk } from '@/web/libs/payload/client'
import { TurnoBadge } from '@/web/ui/atoms/turno-badge'
import { formatDate } from '@/web/utils/fechas'
import {
  contarTurnosCursoPorFecha,
  getSlotsPsicofisicoConConfiguracion,
  isDiaInhabil,
  validarDisponibilidadCurso,
  validarDisponibilidadPsicofisico,
} from '@/web/utils/turnos'
import {
  IconCalendar,
  IconCalendarPlus,
  IconClock,
  IconSearch,
  IconTrash,
  IconUser,
  IconX,
} from '@tabler/icons-react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { twJoin } from 'tailwind-merge'

type TurnoPopulated = (TurnoCurso | TurnoPsicofisico) & { ciudadano: Ciudadano }
type TurnoCollection = 'turno-curso' | 'turno-psicofisico'
type TurnoFormValues = { ciudadanoId: string; fecha: string; hora: string; observaciones: string }

interface Props {
  tipoTurno: TipoTurno
  turnos: TurnoPopulated[]
  diasInhabiles: DiaInhabil[]
  excepcionesPsicofisico: HorarioPsicofisicoExcepcion[]
  icon: React.ReactNode
}

const columnHelper = createColumnHelper<TurnoPopulated>()

function buildColumns() {
  return [
    columnHelper.accessor((row) => `${row.ciudadano.apellido}, ${row.ciudadano.nombre}`, {
      id: 'ciudadano',
      header: 'Ciudadano',
      cell: (info) => <p className="font-medium">{info.getValue()}</p>,
    }),
    columnHelper.accessor((row) => row.ciudadano.dni, {
      id: 'dni',
      header: 'DNI',
      cell: (info) => <p className="font-mono text-sm">{info.getValue()}</p>,
    }),
    columnHelper.accessor('fecha', {
      id: 'fecha',
      header: 'Fecha',
      cell: (info) => (
        <p className="flex items-center gap-1 text-sm">
          <IconCalendar size={14} className="opacity-50" />
          {formatDate(info.getValue())}
        </p>
      ),
    }),
    columnHelper.accessor('hora', {
      id: 'hora',
      header: 'Hora',
      cell: (info) => {
        const hora = info.getValue()
        return hora ? (
          <p className="flex items-center gap-1 text-sm">
            <IconClock size={14} className="opacity-50" />
            {hora}
          </p>
        ) : (
          <p className="text-sm opacity-40">—</p>
        )
      },
    }),
    columnHelper.accessor('estado', {
      id: 'estado',
      header: 'Estado',
      cell: ({ row }) => <TurnoBadge estado={row.original.estado} />,
    }),
    columnHelper.display({
      id: 'acciones',
      header: 'Acciones',
      cell: ({ row, table }) => (
        <section className="flex gap-2">
          <button
            className="btn btn-ghost btn-xs"
            onClick={() => (table.options.meta as TableMeta).onEdit(row.original)}
          >
            <IconCalendarPlus size={14} />
            Editar
          </button>
          <button
            className="btn btn-ghost btn-error btn-xs"
            onClick={() => (table.options.meta as TableMeta).onDelete(row.original)}
          >
            <IconTrash size={14} />
            Eliminar
          </button>
        </section>
      ),
    }),
  ]
}

interface TableMeta {
  onEdit: (turno: TurnoPopulated) => void
  onDelete: (turno: TurnoPopulated) => void
}

function normalizeDate(dateValue: string): string {
  return dateValue.split('T')[0]
}

export function TurnosListPage({
  tipoTurno,
  turnos,
  diasInhabiles,
  excepcionesPsicofisico,
  icon,
}: Props) {
  const [rows, setRows] = useState(turnos)
  const [isSaving, setIsSaving] = useState(false)
  const [editingTurno, setEditingTurno] = useState<TurnoPopulated | null>(null)
  const [searchCiudadano, setSearchCiudadano] = useState('')
  const [searchResults, setSearchResults] = useState<Ciudadano[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchOverlayOpen, setSearchOverlayOpen] = useState(false)
  const searchFieldRef = useRef<HTMLLabelElement>(null)

  const form = useForm<TurnoFormValues>({
    defaultValues: { ciudadanoId: '', fecha: '', hora: '', observaciones: '' },
  })

  const fechaSeleccionada = form.watch('fecha')
  const esCurso = tipoTurno === 'curso'
  const turnosExistentes = useMemo(
    () => rows.map((row) => ({ fecha: normalizeDate(row.fecha), hora: row.hora ?? '' })),
    [rows],
  )
  const diasInhabilesISO = useMemo(
    () =>
      diasInhabiles
        .filter((dia) => dia.activo)
        .map((dia) => normalizeDate(dia.fecha)),
    [diasInhabiles],
  )
  const excepcionesConfig = useMemo(
    () =>
      excepcionesPsicofisico.map((item) => ({
        fecha: normalizeDate(item.fecha),
        inicio: item.inicio,
        fin: item.fin,
        activo: item.activo ?? true,
      })),
    [excepcionesPsicofisico],
  )

  const slotsDisponibles = useMemo(() => {
    if (esCurso || !fechaSeleccionada) return []
    return getSlotsPsicofisicoConConfiguracion(
      new Date(`${fechaSeleccionada}T12:00:00`),
      turnosExistentes,
      excepcionesConfig,
    )
  }, [esCurso, fechaSeleccionada, turnosExistentes, excepcionesConfig])

  const turnosDelDiaCurso = useMemo(() => {
    if (!esCurso || !fechaSeleccionada) return 0
    return contarTurnosCursoPorFecha(fechaSeleccionada, turnosExistentes)
  }, [esCurso, fechaSeleccionada, turnosExistentes])

  const buscarCiudadanos = async () => {
    const query = searchCiudadano.trim()
    if (query.length < 2) {
      toast.error('Ingresá al menos 2 caracteres para buscar')
      setSearchResults([])
      setSearchOverlayOpen(false)
      return
    }

    setIsSearching(true)
    setSearchOverlayOpen(true)
    try {
      const result = await sdk.find({
        collection: 'ciudadano',
        limit: 15,
        sort: 'apellido',
        where: {
          or: [
            { dni: { contains: query } },
            { apellido: { contains: query } },
            { nombre: { contains: query } },
            { email: { contains: query } },
          ],
        },
      })
      setSearchResults(result.docs)
    } catch {
      setSearchResults([])
      toast.error('No se pudo buscar ciudadanos')
    } finally {
      setIsSearching(false)
    }
  }

  useEffect(() => {
    if (!searchOverlayOpen) return

    const onPointerDown = (event: PointerEvent) => {
      const root = searchFieldRef.current
      if (root && event.target instanceof Node && !root.contains(event.target)) {
        setSearchOverlayOpen(false)
      }
    }

    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [searchOverlayOpen])

  async function onDelete(turno: TurnoPopulated) {
    const collection: TurnoCollection = esCurso ? 'turno-curso' : 'turno-psicofisico'
    setIsSaving(true)
    try {
      await sdk.delete({ collection, id: turno.id })
      setRows((prev) => prev.filter((row) => row.id !== turno.id))
      toast.success('Turno eliminado')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'No se pudo eliminar el turno')
    } finally {
      setIsSaving(false)
    }
  }

  async function onSubmit(values: TurnoFormValues) {
    const collection: TurnoCollection = esCurso ? 'turno-curso' : 'turno-psicofisico'
    const horaFinal = esCurso ? '08:30' : values.hora
    const validacion = esCurso
      ? validarDisponibilidadCurso(values.fecha, turnosExistentes, diasInhabilesISO)
      : validarDisponibilidadPsicofisico(
          values.fecha,
          horaFinal,
          turnosExistentes,
          diasInhabilesISO,
          excepcionesConfig,
        )

    if (!validacion.ok) {
      toast.error(validacion.motivo ?? 'No se puede asignar el turno solicitado')
      return
    }

    setIsSaving(true)
    try {
      if (editingTurno) {
        const updated = await sdk.update({
          collection,
          id: editingTurno.id,
          data: {
            ciudadano: values.ciudadanoId,
            fecha: values.fecha,
            hora: horaFinal,
            observaciones: values.observaciones || undefined,
          },
          depth: 1,
        })
        const ciudadano = updated.ciudadano as Ciudadano
        setRows((prev) =>
          prev.map((row) =>
            row.id === editingTurno.id
              ? ({
                  ...(updated as TurnoCurso | TurnoPsicofisico),
                  ciudadano,
                } as TurnoPopulated)
              : row,
          ),
        )
        toast.success('Turno actualizado')
      } else {
        const created = await sdk.create({
          collection,
          data: {
            ciudadano: values.ciudadanoId,
            fecha: values.fecha,
            hora: horaFinal,
            estado: 'programado',
            observaciones: values.observaciones || undefined,
          },
          depth: 1,
        })
        const ciudadano = created.ciudadano as Ciudadano
        setRows((prev) => [...prev, { ...(created as TurnoCurso | TurnoPsicofisico), ciudadano }])
        toast.success('Turno creado')
      }

      form.reset({ ciudadanoId: '', fecha: '', hora: '', observaciones: '' })
      setSearchCiudadano('')
      setSearchResults([])
      setSearchOverlayOpen(false)
      setEditingTurno(null)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'No se pudo guardar el turno')
    } finally {
      setIsSaving(false)
    }
  }

  function onEdit(turno: TurnoPopulated) {
    setEditingTurno(turno)
    setSearchCiudadano(`${turno.ciudadano.apellido}, ${turno.ciudadano.nombre} (${turno.ciudadano.dni})`)
    setSearchResults([])
    setSearchOverlayOpen(false)
    form.reset({
      ciudadanoId: turno.ciudadano.id,
      fecha: normalizeDate(turno.fecha),
      hora: turno.hora ?? '',
      observaciones: turno.observaciones ?? '',
    })
  }

  const columns = buildColumns()

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: { onDelete, onEdit },
  })

  return (
    <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_380px]">
      <section>
      <header className="mb-6">
        <h2 className="flex items-center gap-2 text-xl font-bold">
          {icon}
          Turnos — {TIPO_TURNO_LABELS[tipoTurno]}
        </h2>
        <p className="mt-1 text-sm opacity-60">
          {rows.length === 0
            ? 'No hay turnos asignados'
            : `${rows.length} turno${rows.length !== 1 ? 's' : ''} asignado${rows.length !== 1 ? 's' : ''}`}
        </p>
      </header>

      <section className="bg-base-100 rounded-box overflow-hidden shadow">
        <section className="overflow-x-auto">
          <table className="table-zebra table w-full" aria-label={`Turnos de ${TIPO_TURNO_LABELS[tipoTurno]}`}>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="py-8 text-center">
                    No hay turnos para mostrar
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </section>
      </section>

      <aside className="card card-border bg-base-100 h-fit">
        <section className="card-body">
          <h3 className="card-title text-base">
            <IconCalendarPlus size={18} />
            {editingTurno ? 'Editar turno' : 'Nuevo turno'}
          </h3>

          <form className="grid gap-3" onSubmit={form.handleSubmit(onSubmit)}>
            <label className="fieldset relative" ref={searchFieldRef}>
              <span className="fieldset-legend">Ciudadano</span>
              <section className="flex gap-2">
                <input
                  type="text"
                  className="input input-bordered flex-1"
                  placeholder="DNI, apellido, nombre o email"
                  value={searchCiudadano}
                  onChange={(e) => setSearchCiudadano(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setSearchOverlayOpen(false)
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      void buscarCiudadanos()
                    }
                  }}
                  autoComplete="off"
                  aria-autocomplete="list"
                  aria-expanded={searchOverlayOpen}
                  aria-controls="resultados-ciudadano-turno"
                />
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => void buscarCiudadanos()}
                  disabled={isSearching}
                >
                  <IconSearch size={16} />
                  Buscar
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => {
                    form.setValue('ciudadanoId', '', { shouldValidate: true })
                    setSearchCiudadano('')
                    setSearchResults([])
                    setSearchOverlayOpen(false)
                  }}
                >
                  <IconX size={16} />
                  Limpiar
                </button>
              </section>
              <input type="hidden" {...form.register('ciudadanoId', { required: true })} />
              {searchOverlayOpen && (
                <section
                  id="resultados-ciudadano-turno"
                  className="bg-base-100 border-base-300 absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-y-auto rounded-box border shadow-lg"
                  role="listbox"
                  aria-label="Resultados de búsqueda de ciudadanos"
                >
                  {isSearching ? (
                    <p className="p-3 text-sm opacity-70">Buscando ciudadanos...</p>
                  ) : searchResults.length === 0 ? (
                    <p className="p-3 text-sm opacity-70">No se encontraron ciudadanos</p>
                  ) : (
                    <ul className="menu menu-sm w-full p-1" role="list">
                      {searchResults.map((ciudadano) => (
                        <li key={ciudadano.id} role="none">
                          <button
                            type="button"
                            role="option"
                            className={twJoin(
                              form.getValues('ciudadanoId') === ciudadano.id && 'active',
                            )}
                            onClick={() => {
                              form.setValue('ciudadanoId', ciudadano.id, { shouldValidate: true })
                              setSearchCiudadano(
                                `${ciudadano.apellido}, ${ciudadano.nombre} (${ciudadano.dni})`,
                              )
                              setSearchOverlayOpen(false)
                            }}
                          >
                            {ciudadano.apellido}, {ciudadano.nombre} · {ciudadano.dni}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              )}
            </label>

            <label className="fieldset">
              <span className="fieldset-legend">Fecha</span>
              <input
                type="date"
                className="input input-bordered"
                min={new Date().toISOString().split('T')[0]}
                {...form.register('fecha', {
                  required: true,
                  validate: (value) => {
                    const date = new Date(`${value}T12:00:00`)
                    if (isDiaInhabil(date, diasInhabilesISO)) return 'Día inhábil'
                    if (esCurso && date.getDay() !== 1) return 'Solo lunes'
                    if (!esCurso && (date.getDay() === 0 || date.getDay() === 6))
                      return 'Solo lunes a viernes'
                    return true
                  },
                })}
              />
            </label>

            {!esCurso && (
              <label className="fieldset">
                <span className="fieldset-legend">Hora</span>
                <select className="select select-bordered" {...form.register('hora', { required: true })}>
                  <option value="">Seleccionar</option>
                  {slotsDisponibles.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <label className="fieldset">
              <span className="fieldset-legend">Observaciones</span>
              <textarea className="textarea textarea-bordered" {...form.register('observaciones')} />
            </label>

            {esCurso && fechaSeleccionada && (
              <p className="text-xs opacity-70">
                Cupo utilizado: {turnosDelDiaCurso} / 20
              </p>
            )}

            <section className="mt-2 flex gap-2">
              <button className={twJoin('btn btn-warning', isSaving && 'btn-disabled')} disabled={isSaving}>
                <IconUser size={16} />
                {editingTurno ? 'Guardar cambios' : 'Crear turno'}
              </button>
              {editingTurno && (
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => {
                    setEditingTurno(null)
                    form.reset({ ciudadanoId: '', fecha: '', hora: '', observaciones: '' })
                    setSearchCiudadano('')
                    setSearchResults([])
                    setSearchOverlayOpen(false)
                  }}
                >
                  <IconX size={16} />
                  Cancelar edición
                </button>
              )}
            </section>
          </form>
        </section>
      </aside>
    </section>
  )
}
