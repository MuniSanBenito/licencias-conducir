'use client'

import {
  IconArrowLeft,
  IconCheck,
  IconCircle,
  IconLicense,
  IconPhone,
  IconPlus,
  IconRocket,
  IconSearch,
  IconTicket,
  IconTrash,
  IconUser,
  IconUserPlus,
  IconX,
} from '@tabler/icons-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { twJoin } from 'tailwind-merge'
import { useCiudadanos } from '../../hooks'
import type { Ciudadano, ClaseLicencia, TipoTramite } from '../../types'
import { CLASES_LICENCIA, TIPO_TRAMITE_LABELS, getPasosParaTramite } from '../../types'

interface ItemForm {
  clase: ClaseLicencia
  tipo: TipoTramite
}

export default function NuevoTramitePage() {
  const router = useRouter()
  const ciudadanos = useCiudadanos()

  const [busqueda, setBusqueda] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [ciudadanoSeleccionado, setCiudadanoSeleccionado] = useState<Ciudadano | null>(null)

  const [items, setItems] = useState<ItemForm[]>([{ clase: 'B1', tipo: 'nueva' }])

  const q = busqueda.toLowerCase().trim()
  const resultados = q
    ? ciudadanos
        .filter(
          (c) =>
            c.dni.includes(q) ||
            c.nombre.toLowerCase().includes(q) ||
            c.apellido.toLowerCase().includes(q),
        )
        .slice(0, 8)
    : []

  const seleccionarCiudadano = (c: Ciudadano) => {
    setCiudadanoSeleccionado(c)
    setBusqueda('')
    setShowDropdown(false)
  }

  const deseleccionarCiudadano = () => {
    setCiudadanoSeleccionado(null)
    setBusqueda('')
  }

  const agregarItem = () => {
    setItems([...items, { clase: 'B1', tipo: 'nueva' }])
  }

  const eliminarItem = (index: number) => {
    if (items.length <= 1) return
    setItems(items.filter((_, i) => i !== index))
  }

  const actualizarItem = (index: number, campo: keyof ItemForm, valor: string) => {
    const nuevos = [...items]
    nuevos[index] = { ...nuevos[index], [campo]: valor }
    setItems(nuevos)
  }

  const pasosPreview = getPasosParaTramite(items)

  const handleSubmit = () => {
    if (!ciudadanoSeleccionado) {
      alert('Seleccioná un ciudadano antes de continuar')
      return
    }
    alert('Trámite creado exitosamente (simulado)')
    router.push('/mock')
  }

  return (
    <section>
      {/* Breadcrumb */}
      <nav className="breadcrumbs mb-6 text-sm" aria-label="Navegación">
        <ul>
          <li>
            <Link href="/mock" className="gap-1">
              <IconArrowLeft size={14} />
              Tablero
            </Link>
          </li>
          <li className="font-semibold">Nuevo Trámite</li>
        </ul>
      </nav>

      <section className="grid grid-cols-[1fr_320px] gap-6">
        {/* Formulario */}
        <section className="flex flex-col gap-6">
          {/* Selección de ciudadano */}
          <article className="card card-border bg-base-100">
            <section className="card-body">
              <header className="flex items-center justify-between">
                <h2 className="card-title text-base">
                  <IconUser size={18} />
                  Ciudadano
                </h2>
                {!ciudadanoSeleccionado && (
                  <Link href="/mock/ciudadanos" className="link link-primary text-sm opacity-70">
                    Gestionar ciudadanos →
                  </Link>
                )}
              </header>

              {ciudadanoSeleccionado ? (
                <section className="bg-primary/10 mt-4 flex items-center justify-between rounded-lg p-4">
                  <section className="flex items-center gap-4">
                    <figure className="avatar avatar-placeholder">
                      <section className="bg-primary text-primary-content w-12 rounded-full">
                        <span className="text-lg">
                          {ciudadanoSeleccionado.nombre[0]}
                          {ciudadanoSeleccionado.apellido[0]}
                        </span>
                      </section>
                    </figure>
                    <section>
                      <p className="font-semibold">
                        {ciudadanoSeleccionado.apellido}, {ciudadanoSeleccionado.nombre}
                      </p>
                      <p className="text-sm opacity-60">
                        DNI: <strong className="font-mono">{ciudadanoSeleccionado.dni}</strong>
                        <span className="mx-2 opacity-30">|</span>
                        {ciudadanoSeleccionado.celular && (
                          <>
                            <IconPhone size={12} className="inline" />{' '}
                            {ciudadanoSeleccionado.celular}
                            <span className="mx-2 opacity-30">|</span>
                          </>
                        )}
                        {ciudadanoSeleccionado.domicilio}
                      </p>
                    </section>
                  </section>
                  <button
                    className="btn btn-error btn-outline btn-sm"
                    onClick={deseleccionarCiudadano}
                  >
                    <IconX size={14} />
                    Cambiar
                  </button>
                </section>
              ) : (
                <section className="relative mt-4">
                  <label className="input input-bordered input-primary flex items-center gap-2">
                    <IconSearch size={16} className="opacity-50" />
                    <input
                      type="search"
                      className="grow"
                      placeholder="Buscar por DNI, nombre o apellido..."
                      value={busqueda}
                      onChange={(e) => {
                        setBusqueda(e.target.value)
                        setShowDropdown(true)
                      }}
                      onFocus={() => setShowDropdown(true)}
                      onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                      aria-label="Buscar ciudadano"
                      aria-expanded={showDropdown && busqueda.length > 0}
                    />
                  </label>

                  {showDropdown && busqueda.length > 0 && (
                    <ul
                      className="menu bg-base-100 rounded-box border-base-300 absolute top-full right-0 left-0 z-50 mt-1 max-h-72 overflow-auto border shadow-xl"
                      role="listbox"
                      aria-label="Resultados de búsqueda"
                    >
                      {resultados.length === 0 ? (
                        <li className="disabled">
                          <section className="flex flex-col items-center py-4 opacity-60">
                            <span>No se encontraron ciudadanos</span>
                            <Link
                              href="/mock/ciudadanos"
                              className="link link-primary mt-1 text-xs"
                            >
                              <IconUserPlus size={14} />
                              Registrar nuevo ciudadano
                            </Link>
                          </section>
                        </li>
                      ) : (
                        resultados.map((c) => (
                          <li key={c.dni} role="option" aria-selected={false}>
                            <button
                              className="flex items-center gap-3"
                              onClick={() => seleccionarCiudadano(c)}
                            >
                              <figure className="avatar avatar-placeholder">
                                <section className="bg-base-200 text-base-content w-9 rounded-full">
                                  <span className="text-xs font-bold">
                                    {c.nombre[0]}
                                    {c.apellido[0]}
                                  </span>
                                </section>
                              </figure>
                              <section>
                                <p className="text-sm font-semibold">
                                  {c.apellido}, {c.nombre}
                                </p>
                                <p className="text-xs opacity-50">
                                  DNI: {c.dni} · {c.domicilio}
                                </p>
                              </section>
                            </button>
                          </li>
                        ))
                      )}
                    </ul>
                  )}
                </section>
              )}
            </section>
          </article>

          {/* Items de licencia */}
          <article className="card card-border bg-base-100">
            <section className="card-body">
              <header className="flex items-center justify-between">
                <h2 className="card-title text-base">
                  <IconLicense size={18} />
                  Clases / Categorías
                </h2>
                <button className="btn btn-ghost btn-sm" onClick={agregarItem}>
                  <IconPlus size={16} />
                  Agregar otra
                </button>
              </header>

              <section className="mt-4 flex flex-col gap-3">
                {items.map((item, index) => (
                  <section key={index} className="bg-base-200 flex items-end gap-3 rounded-lg p-4">
                    <fieldset className="fieldset flex-1">
                      <label className="fieldset-legend" htmlFor={`clase-${index}`}>
                        Clase
                      </label>
                      <select
                        id={`clase-${index}`}
                        className="select select-bordered w-full"
                        value={item.clase}
                        onChange={(e) => actualizarItem(index, 'clase', e.target.value)}
                      >
                        {CLASES_LICENCIA.map((clase) => (
                          <option key={clase} value={clase}>
                            {clase}
                          </option>
                        ))}
                      </select>
                    </fieldset>

                    <fieldset className="fieldset flex-1">
                      <label className="fieldset-legend" htmlFor={`tipo-${index}`}>
                        Tipo
                      </label>
                      <select
                        id={`tipo-${index}`}
                        className="select select-bordered w-full"
                        value={item.tipo}
                        onChange={(e) => actualizarItem(index, 'tipo', e.target.value)}
                      >
                        {(Object.entries(TIPO_TRAMITE_LABELS) as [TipoTramite, string][]).map(
                          ([key, label]) => (
                            <option key={key} value={key}>
                              {label}
                            </option>
                          ),
                        )}
                      </select>
                    </fieldset>

                    <button
                      className={twJoin(
                        'btn btn-square btn-sm',
                        items.length <= 1 ? 'btn-disabled' : 'btn-error btn-ghost',
                      )}
                      onClick={() => eliminarItem(index)}
                      disabled={items.length <= 1}
                      aria-label={`Eliminar clase ${item.clase}`}
                    >
                      <IconTrash size={16} />
                    </button>
                  </section>
                ))}
              </section>
            </section>
          </article>

          {/* Botón submit */}
          <button
            className={twJoin(
              'btn btn-lg self-start',
              ciudadanoSeleccionado ? 'btn-primary' : 'btn-disabled',
            )}
            onClick={handleSubmit}
            disabled={!ciudadanoSeleccionado}
          >
            <IconRocket size={20} />
            Iniciar Trámite
          </button>
        </section>

        {/* Preview pasos */}
        <aside className="card card-border bg-base-100 sticky top-6 self-start">
          <section className="card-body">
            <h3 className="card-title text-sm">
              <IconCheck size={16} />
              Pasos del Trámite
            </h3>
            <p className="mb-4 text-xs opacity-50">
              Vista previa basada en las clases y tipos seleccionados
            </p>

            {/* Mini timeline */}
            <ul
              className="timeline timeline-vertical timeline-compact"
              aria-label="Preview de pasos"
            >
              {pasosPreview.map((paso, i) => (
                <li key={paso.id}>
                  {i > 0 && <hr />}
                  <section className="timeline-middle">
                    <IconCircle size={16} className="opacity-30" />
                  </section>
                  <section className="timeline-end pb-2">
                    <span className="flex items-center gap-1 text-sm">
                      {paso.label}
                      {paso.requiereTurno && (
                        <span className="badge badge-warning badge-outline badge-xs">
                          <IconTicket size={8} />
                        </span>
                      )}
                    </span>
                  </section>
                  {i < pasosPreview.length - 1 && <hr />}
                </li>
              ))}
            </ul>

            {/* Resumen items */}
            <section className="border-base-200 mt-4 border-t pt-4">
              <p className="mb-2 text-xs font-semibold opacity-50">Resumen:</p>
              {items.map((item, i) => (
                <section key={i} className="flex items-center justify-between py-1">
                  <span className="text-sm font-bold">{item.clase}</span>
                  <span
                    className={twJoin(
                      'text-xs',
                      item.tipo === 'nueva'
                        ? 'text-info'
                        : item.tipo === 'renovacion'
                          ? 'text-warning'
                          : 'text-secondary',
                    )}
                  >
                    {TIPO_TRAMITE_LABELS[item.tipo]}
                  </span>
                </section>
              ))}
              <p className="mt-2 text-xs opacity-40">Total: {pasosPreview.length} pasos</p>
            </section>
          </section>
        </aside>
      </section>
    </section>
  )
}
