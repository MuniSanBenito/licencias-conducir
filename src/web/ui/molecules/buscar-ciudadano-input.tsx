'use client'
import type { Ciudadano } from '@/types'
import { IconPhone, IconSearch, IconUserPlus, IconX } from '@tabler/icons-react'
import Link from 'next/link'
import { useState } from 'react'

interface BuscarCiudadanoInputProps {
  ciudadanos: Ciudadano[]
  seleccionado: Ciudadano | null
  onSeleccionar: (ciudadano: Ciudadano) => void
  onDeseleccionar: () => void
}

export function BuscarCiudadanoInput({
  ciudadanos,
  seleccionado,
  onSeleccionar,
  onDeseleccionar,
}: BuscarCiudadanoInputProps) {
  const [busqueda, setBusqueda] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)

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

  const handleSeleccionar = (c: Ciudadano) => {
    onSeleccionar(c)
    setBusqueda('')
    setShowDropdown(false)
  }

  const handleDeseleccionar = () => {
    onDeseleccionar()
    setBusqueda('')
  }

  if (seleccionado) {
    return (
      <section className="bg-primary/10 mt-4 flex items-center justify-between rounded-lg p-4">
        <section className="flex items-center gap-4">
          <section>
            <p className="font-semibold">
              {seleccionado.apellido}, {seleccionado.nombre}
            </p>
            <p className="text-sm opacity-60">
              DNI: <strong className="font-mono">{seleccionado.dni}</strong>
              <span className="mx-2 opacity-30">|</span>
              {seleccionado.celular && (
                <>
                  <IconPhone size={12} className="inline" /> {seleccionado.celular}
                  <span className="mx-2 opacity-30">|</span>
                </>
              )}
              {seleccionado.domicilio}
            </p>
          </section>
        </section>
        <button className="btn btn-error btn-outline btn-sm" onClick={handleDeseleccionar}>
          <IconX size={14} />
          Cambiar
        </button>
      </section>
    )
  }

  return (
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
                <Link href="/ciudadanos" className="link link-primary mt-1 text-xs">
                  <IconUserPlus size={14} />
                  Registrar nuevo ciudadano
                </Link>
              </section>
            </li>
          ) : (
            resultados.map((c) => (
              <li key={c.dni} role="option" aria-selected={false}>
                <button className="flex items-center gap-3" onClick={() => handleSeleccionar(c)}>
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
  )
}
