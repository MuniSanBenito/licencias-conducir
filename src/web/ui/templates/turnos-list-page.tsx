'use client'

import {
  CURSO_MSJ_CONFIRMACION_FECHA_NO_LUNES,
  CURSO_MSJ_DIA_INHABIL,
  CURSO_MSJ_FIN_DE_SEMANA,
  DIA_CURSO,
  TIPO_TURNO_LABELS,
  type TipoTurno,
} from '@/constants/turnos'
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
import { isCiudadanoDocument } from '@/web/utils/is-ciudadano-document'
import {
  contarTurnosCursoPorFecha,
  formatFechaISO,
  getSlotsPsicofisicoConConfiguracion,
  isDiaInhabil,
  validarDisponibilidadCurso,
  validarDisponibilidadPsicofisico,
} from '@/web/utils/turnos'
import {
  IconAlertTriangle,
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
import { useForm, type FieldErrors } from 'react-hook-form'
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

async function fetchCiudadanoDocumentPorId(ciudadanoId: string): Promise<Ciudadano | null> {
  try {
    const result = await sdk.find({
      collection: 'ciudadano',
      limit: 1,
      depth: 0,
      where: { id: { equals: ciudadanoId } },
    })
    const doc = result.docs[0]
    return isCiudadanoDocument(doc) ? doc : null
  } catch {
    return null
  }
}

async function resolveCiudadanoDesdeTurno(
  turno: TurnoCurso | TurnoPsicofisico,
  ciudadanoId: string,
  candidatosBusqueda: Ciudadano[],
): Promise<Ciudadano | null> {
  if (isCiudadanoDocument(turno.ciudadano)) return turno.ciudadano
  const hit = candidatosBusqueda.find((c) => c.id === ciudadanoId)
  if (isCiudadanoDocument(hit)) return hit
  return fetchCiudadanoDocumentPorId(ciudadanoId)
}

function formatCiudadanoNombreTabla(row: TurnoPopulated): string {
  if (!isCiudadanoDocument(row.ciudadano)) return 'Ciudadano no disponible'
  return `${row.ciudadano.apellido}, ${row.ciudadano.nombre}`
}

function formatCiudadanoDniTabla(row: TurnoPopulated): string {
  if (!isCiudadanoDocument(row.ciudadano)) return '—'
  return row.ciudadano.dni
}

const columnHelper = createColumnHelper<TurnoPopulated>()

function buildColumns() {
  return [
    columnHelper.accessor((row) => formatCiudadanoNombreTabla(row), {
      id: 'ciudadano',
      header: 'Ciudadano',
      cell: (info) => <p className="font-medium">{info.getValue()}</p>,
    }),
    columnHelper.accessor((row) => formatCiudadanoDniTabla(row), {
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

function normalizeDate(dateValue: string | null | undefined): string {
  if (dateValue == null || dateValue === '') {
    return ''
  }
  return dateValue.split('T')[0]
}

function getFirstFormErrorMessage(errors: FieldErrors<TurnoFormValues>): string {
  for (const value of Object.values(errors)) {
    if (
      value &&
      typeof value === 'object' &&
      'message' in value &&
      typeof value.message === 'string'
    ) {
      return value.message
    }
  }
  return 'Completá los campos obligatorios del formulario.'
}

function getTodayISODate(): string {
  return formatFechaISO(new Date())
}

function getTurnoSaveErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return 'No se pudo guardar el turno'
  }

  return error.message
}

function buildTurnoPayload(values: TurnoFormValues, hora: string) {
  return {
    ciudadano: values.ciudadanoId,
    fecha: values.fecha,
    hora,
    observaciones: values.observaciones || undefined,
  }
}

async function createTurno(
  collection: TurnoCollection,
  values: TurnoFormValues,
  hora: string,
): Promise<TurnoCurso | TurnoPsicofisico> {
  const response = await fetch(`/api/${collection}?depth=1`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...buildTurnoPayload(values, hora),
      estado: 'programado',
    }),
  })

  const payload = await response.json()
  if (!response.ok) {
    throw new Error(
      payload?.errors?.[0]?.message ?? payload?.message ?? 'No se pudo guardar el turno',
    )
  }

  return payload as TurnoCurso | TurnoPsicofisico
}

async function updateTurno(
  collection: TurnoCollection,
  turnoId: string,
  values: TurnoFormValues,
  hora: string,
): Promise<TurnoCurso | TurnoPsicofisico> {
  const response = await fetch(`/api/${collection}/${turnoId}?depth=1`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(buildTurnoPayload(values, hora)),
  })

  const payload = await response.json()
  if (!response.ok) {
    throw new Error(
      payload?.errors?.[0]?.message ?? payload?.message ?? 'No se pudo guardar el turno',
    )
  }

  return payload as TurnoCurso | TurnoPsicofisico
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
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [cursoNoLunesConfirmOpen, setCursoNoLunesConfirmOpen] = useState(false)
  const searchBlockRef = useRef<HTMLLabelElement>(null)
  const pendingCursoSubmitRef = useRef<TurnoFormValues | null>(null)

  const form = useForm<TurnoFormValues>({
    defaultValues: { ciudadanoId: '', fecha: '', hora: '', observaciones: '' },
  })

  const fechaSeleccionada = form.watch('fecha')
  const esCurso = tipoTurno === 'curso'
  const turnosExistentes = useMemo(
    () =>
      rows
        .map((row) => ({ fecha: normalizeDate(row.fecha), hora: row.hora ?? '' }))
        .filter((t) => t.fecha !== ''),
    [rows],
  )
  const diasInhabilesISO = useMemo(
    () =>
      diasInhabiles
        .filter((dia) => dia.activo)
        .map((dia) => normalizeDate(dia.fecha))
        .filter((iso) => iso !== ''),
    [diasInhabiles],
  )
  const excepcionesConfig = useMemo(
    () =>
      excepcionesPsicofisico
        .map((item) => ({
          fecha: normalizeDate(item.fecha),
          inicio: item.inicio,
          fin: item.fin,
          activo: item.activo ?? true,
        }))
        .filter((item) => item.fecha !== ''),
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
      const root = searchBlockRef.current
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

  async function persistTurno(values: TurnoFormValues) {
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
        const updated = await updateTurno(collection, editingTurno.id, values, horaFinal)
        const ciudadano = await resolveCiudadanoDesdeTurno(
          updated,
          values.ciudadanoId,
          searchResults,
        )
        if (!ciudadano) {
          toast.error(
            'El turno se guardó, pero no pudimos cargar los datos del ciudadano. Recargá la página.',
          )
          setIsFormModalOpen(false)
          resetFormState()
          return
        }
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
        const created = await createTurno(collection, values, horaFinal)
        const ciudadano = await resolveCiudadanoDesdeTurno(
          created,
          values.ciudadanoId,
          searchResults,
        )
        if (!ciudadano) {
          toast.error(
            'El turno se creó, pero no pudimos cargar los datos del ciudadano. Recargá la página.',
          )
          setIsFormModalOpen(false)
          resetFormState()
          return
        }
        setRows((prev) => [...prev, { ...(created as TurnoCurso | TurnoPsicofisico), ciudadano }])
        toast.success('Turno creado')
      }

      form.reset({ ciudadanoId: '', fecha: '', hora: '', observaciones: '' })
      setSearchCiudadano('')
      setSearchResults([])
      setSearchOverlayOpen(false)
      setEditingTurno(null)
      setIsFormModalOpen(false)
    } catch (error) {
      toast.error(getTurnoSaveErrorMessage(error))
    } finally {
      setIsSaving(false)
    }
  }

  async function onSubmit(values: TurnoFormValues) {
    if (esCurso) {
      const date = new Date(`${values.fecha}T12:00:00`)
      if (date.getDay() !== DIA_CURSO) {
        pendingCursoSubmitRef.current = values
        setCursoNoLunesConfirmOpen(true)
        return
      }
    }
    await persistTurno(values)
  }

  async function onConfirmarCursoNoLunes() {
    const values = pendingCursoSubmitRef.current
    setCursoNoLunesConfirmOpen(false)
    pendingCursoSubmitRef.current = null
    if (!values) return
    await persistTurno(values)
  }

  function onCancelarCursoNoLunes() {
    setCursoNoLunesConfirmOpen(false)
    pendingCursoSubmitRef.current = null
  }

  function resetFormState() {
    setCursoNoLunesConfirmOpen(false)
    pendingCursoSubmitRef.current = null
    setEditingTurno(null)
    form.reset({ ciudadanoId: '', fecha: '', hora: '', observaciones: '' })
    setSearchCiudadano('')
    setSearchResults([])
    setSearchOverlayOpen(false)
  }

  function onCreateTurno() {
    resetFormState()
    setIsFormModalOpen(true)
  }

  function onCloseModal() {
    setIsFormModalOpen(false)
    resetFormState()
  }

  function onEdit(turno: TurnoPopulated) {
    if (!isCiudadanoDocument(turno.ciudadano)) {
      toast.error(
        'Este turno no tiene los datos del ciudadano disponibles. Recargá la página o revisá el registro en el panel admin.',
      )
      return
    }
    setCursoNoLunesConfirmOpen(false)
    pendingCursoSubmitRef.current = null
    setEditingTurno(turno)
    setSearchCiudadano(
      `${turno.ciudadano.apellido}, ${turno.ciudadano.nombre} (${turno.ciudadano.dni})`,
    )
    setSearchResults([])
    setSearchOverlayOpen(false)
    form.reset({
      ciudadanoId: turno.ciudadano.id,
      fecha: normalizeDate(turno.fecha),
      hora: turno.hora ?? '',
      observaciones: turno.observaciones ?? '',
    })
    setIsFormModalOpen(true)
  }

  const columns = buildColumns()

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: { onDelete, onEdit },
  })

  return (
    <section className="grid gap-6">
      <header className="flex items-start justify-between gap-4">
        <section>
          <h2 className="flex items-center gap-2 text-xl font-bold">
            {icon}
            Turnos — {TIPO_TURNO_LABELS[tipoTurno]}
          </h2>
          <p className="mt-1 text-sm opacity-60">
            {rows.length === 0
              ? 'No hay turnos asignados'
              : `${rows.length} turno${rows.length !== 1 ? 's' : ''} asignado${rows.length !== 1 ? 's' : ''}`}
          </p>
        </section>
        <button type="button" className="btn btn-warning" onClick={onCreateTurno}>
          <IconCalendarPlus size={16} />
          Crear turno
        </button>
      </header>

      <section className="bg-base-100 rounded-box min-w-0 overflow-hidden shadow">
        <section className="overflow-x-auto">
          <table
            className="table-zebra table w-full"
            aria-label={`Turnos de ${TIPO_TURNO_LABELS[tipoTurno]}`}
          >
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

      <dialog
        className={twJoin('modal', isFormModalOpen && 'modal-open')}
        aria-label="Formulario de turno"
      >
        <aside className="modal-box max-w-xl">
          <section className="card-body">
            <h3 className="card-title text-base">
              <IconCalendarPlus size={18} />
              {editingTurno ? 'Editar turno' : 'Nuevo turno'}
            </h3>

            <form
              className="grid gap-3"
              onSubmit={form.handleSubmit(onSubmit, (errors) => {
                toast.error(getFirstFormErrorMessage(errors))
              })}
            >
              <label className="fieldset relative" ref={searchBlockRef}>
                <span className="fieldset-legend">Ciudadano</span>
                <section className="flex gap-2">
                  <input
                    type="text"
                    className="input input-bordered flex-1"
                    placeholder="DNI, apellido"
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
                {searchOverlayOpen && (
                  <section
                    id="resultados-ciudadano-turno"
                    className="bg-base-100 border-base-300 rounded-box absolute top-full right-0 left-0 z-50 mt-1 max-h-60 overflow-y-auto border shadow-lg"
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

              <input
                type="hidden"
                {...form.register('ciudadanoId', {
                  required: 'Seleccioná un ciudadano desde la búsqueda superior.',
                })}
              />

              <label className="fieldset">
                <span className="fieldset-legend">Fecha</span>
                <input
                  type="date"
                  className="input input-bordered"
                  min={getTodayISODate()}
                  {...form.register('fecha', {
                    required: true,
                    validate: (value) => {
                      const date = new Date(`${value}T12:00:00`)
                      if (isDiaInhabil(date, diasInhabilesISO)) {
                        return esCurso
                          ? CURSO_MSJ_DIA_INHABIL
                          : 'Esta fecha está marcada como inhábil y no admite turnos de examen psicofísico.'
                      }
                      if (esCurso) {
                        if (date.getDay() === 0 || date.getDay() === 6) {
                          return CURSO_MSJ_FIN_DE_SEMANA
                        }
                        return true
                      }
                      if (date.getDay() === 0 || date.getDay() === 6) {
                        return 'El examen psicofísico solo se agenda de lunes a viernes.'
                      }
                      return true
                    },
                  })}
                />
              </label>

              {!esCurso && (
                <label className="fieldset">
                  <span className="fieldset-legend">Hora</span>
                  <select
                    className="select select-bordered"
                    {...form.register('hora', { required: true })}
                  >
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
                <textarea
                  className="textarea textarea-bordered"
                  {...form.register('observaciones')}
                />
              </label>

              {esCurso && fechaSeleccionada && (
                <p className="text-xs opacity-70">Cupo utilizado: {turnosDelDiaCurso} / 20</p>
              )}

              <section className="mt-2 flex gap-2">
                <button
                  type="submit"
                  className={twJoin('btn btn-warning', isSaving && 'btn-disabled')}
                  disabled={isSaving}
                >
                  <IconUser size={16} />
                  {editingTurno ? 'Guardar cambios' : 'Crear turno'}
                </button>
                <button type="button" className="btn btn-ghost" onClick={onCloseModal}>
                  <IconX size={16} />
                  Cancelar
                </button>
              </section>
            </form>
          </section>
        </aside>
        <form method="dialog" className="modal-backdrop">
          <button type="button" onClick={onCloseModal}>
            Cerrar
          </button>
        </form>
      </dialog>

      <dialog
        className={twJoin('modal', cursoNoLunesConfirmOpen && 'modal-open')}
        aria-labelledby="titulo-confirmacion-curso-no-lunes"
        aria-describedby="texto-confirmacion-curso-no-lunes"
      >
        <aside className="modal-box max-w-lg">
          <section className="card-body gap-4">
            <h3 id="titulo-confirmacion-curso-no-lunes" className="card-title text-base">
              <IconAlertTriangle size={20} className="text-warning" aria-hidden />
              Confirmar fecha del curso
            </h3>
            <p id="texto-confirmacion-curso-no-lunes" className="text-sm leading-relaxed">
              {CURSO_MSJ_CONFIRMACION_FECHA_NO_LUNES}
            </p>
            <section className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                className={twJoin('btn btn-warning', isSaving && 'btn-disabled')}
                disabled={isSaving}
                onClick={() => void onConfirmarCursoNoLunes()}
              >
                Sí, confirmar fecha
              </button>
              <button type="button" className="btn btn-ghost" onClick={onCancelarCursoNoLunes}>
                Volver y revisar
              </button>
            </section>
          </section>
        </aside>
        <form method="dialog" className="modal-backdrop">
          <button type="button" onClick={onCancelarCursoNoLunes}>
            Cerrar
          </button>
        </form>
      </dialog>
    </section>
  )
}
