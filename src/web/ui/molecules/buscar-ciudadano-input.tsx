'use client'
import type { Ciudadano } from '@/payload-types'
import {
  IconChevronLeft,
  IconChevronRight,
  IconPhone,
  IconUserPlus,
  IconX,
} from '@tabler/icons-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { twJoin } from 'tailwind-merge'
import { BuscarForm } from '../atoms/buscar-form'

interface BuscarCiudadanoInputProps {
  ciudadanos: Ciudadano[]
  seleccionado: Ciudadano | null
  onSeleccionar: (ciudadano: Ciudadano) => void
  onDeseleccionar: () => void
  page: number
  totalPages: number
  totalDocs: number
  currentQuery: string
}

export function BuscarCiudadanoInput({
  ciudadanos,
  seleccionado,
  onSeleccionar,
  onDeseleccionar,
  page,
  totalPages,
  currentQuery,
}: BuscarCiudadanoInputProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [searchTerm, setSearchTerm] = useState(currentQuery)

  const hasPrevPage = page > 1
  const hasNextPage = page < totalPages

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString())
    if (searchTerm) {
      params.set('q', searchTerm)
    } else {
      params.delete('q')
    }
    params.set('page', '1')
    router.push(`?${params.toString()}`)
  }

  const handleClear = () => {
    setSearchTerm('')
    const params = new URLSearchParams(searchParams.toString())
    params.delete('q')
    params.set('page', '1')
    router.push(`?${params.toString()}`)
  }

  const navigateToPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(newPage))
    router.push(`?${params.toString()}`)
  }

  if (seleccionado) {
    return (
      <section
        aria-label={`Ciudadano seleccionado: ${seleccionado.apellido}, ${seleccionado.nombre}`}
        className="bg-primary/10 mt-4 flex items-center justify-between rounded-lg p-4"
      >
        <div>
          <p className="font-semibold">
            {seleccionado.apellido}, {seleccionado.nombre}
          </p>
          <p className="text-sm opacity-60">
            DNI: <strong className="font-mono">{seleccionado.dni}</strong>
            <span className="mx-2 opacity-30">|</span>
            {seleccionado.celular && (
              <>
                <IconPhone size={12} className="inline" aria-hidden="true" /> {seleccionado.celular}
                <span className="mx-2 opacity-30">|</span>
              </>
            )}
            {seleccionado.domicilio}
          </p>
        </div>
        <button
          className="btn btn-error btn-outline btn-sm"
          onClick={onDeseleccionar}
          aria-label={`Cambiar ciudadano seleccionado: ${seleccionado.apellido}, ${seleccionado.nombre}`}
        >
          <IconX size={14} aria-hidden="true" />
          Cambiar
        </button>
      </section>
    )
  }

  return (
    <section aria-label="Buscar ciudadano" className="mt-4 flex flex-col gap-3">
      <BuscarForm
        value={searchTerm}
        onChange={setSearchTerm}
        onSearch={handleSearch}
        onClear={handleClear}
        label="Buscar ciudadano por DNI, nombre o apellido"
        placeholder="Buscar por DNI, nombre o apellido..."
        clearDisabled={!(searchTerm || currentQuery)}
        className="flex gap-2"
      />

      {currentQuery && (
        <div className="flex flex-col gap-2">
          {ciudadanos.length === 0 ? (
            <div className="py-4 text-center opacity-60">
              <p>No se encontraron ciudadanos</p>
              <Link
                href="/ciudadanos"
                className="link link-primary mt-1 inline-flex items-center gap-1 text-xs"
              >
                <IconUserPlus size={14} aria-hidden="true" />
                Registrar nuevo ciudadano
              </Link>
            </div>
          ) : (
            <ul
              className="bg-base-100 border-base-300 divide-base-300 rounded-box divide-y border shadow"
              aria-label="Resultados de búsqueda"
            >
              {ciudadanos.map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold">
                      {c.apellido}, {c.nombre}
                    </p>
                    <p className="text-xs opacity-50">
                      DNI: {c.dni} · {c.domicilio}
                    </p>
                  </div>
                  <button
                    className="btn btn-primary btn-xs"
                    aria-label={`Seleccionar ciudadano ${c.apellido}, ${c.nombre}`}
                    onClick={() => onSeleccionar(c)}
                  >
                    Seleccionar
                  </button>
                </li>
              ))}
            </ul>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <output className="text-base-content/60 text-sm" aria-live="polite">
                Página {page} de {totalPages}
              </output>
              <nav aria-label="Paginación de resultados">
                <div className="join">
                  <button
                    className={twJoin('join-item btn btn-xs', !hasPrevPage && 'btn-disabled')}
                    onClick={() => navigateToPage(page - 1)}
                    disabled={!hasPrevPage}
                    aria-label="Página anterior"
                  >
                    <IconChevronLeft size={14} aria-hidden="true" />
                  </button>
                  <button
                    className={twJoin('join-item btn btn-xs', !hasNextPage && 'btn-disabled')}
                    onClick={() => navigateToPage(page + 1)}
                    disabled={!hasNextPage}
                    aria-label="Página siguiente"
                  >
                    <IconChevronRight size={14} aria-hidden="true" />
                  </button>
                </div>
              </nav>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
