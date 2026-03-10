'use client'

import { BuscarCiudadanoInput } from '@/web/ui/molecules/buscar-ciudadano-input'
import { PasosPreview } from '@/web/ui/molecules/pasos-preview'
import { LicenciaItemsForm, type ItemForm } from '@/web/ui/organisms/licencia-items-form'
import { IconArrowLeft, IconFileText, IconRocket, IconUser } from '@tabler/icons-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { twJoin } from 'tailwind-merge'
import { useCiudadanos } from '../../hooks'
import { addTramite, getTramites } from '../../store'
import type { Ciudadano } from '../../types'
import { getPasosParaTramite } from '../../types'

export default function NuevoTramitePage() {
  const router = useRouter()
  const ciudadanos = useCiudadanos()

  const [ciudadanoSeleccionado, setCiudadanoSeleccionado] = useState<Ciudadano | null>(null)
  const [fut, setFut] = useState('')
  const [items, setItems] = useState<ItemForm[]>([{ clase: 'B1', tipo: 'nueva' }])

  const pasosPreview = getPasosParaTramite(items)

  const handleSubmit = () => {
    if (!fut.trim()) {
      toast.error('Ingresá el número de FUT')
      return
    }
    if (!ciudadanoSeleccionado) {
      toast.error('Seleccioná un ciudadano antes de continuar')
      return
    }

    const totalTramites = getTramites().length
    const nuevoId = `TRM-2026-${String(totalTramites + 1).padStart(3, '0')}`
    const pasos = getPasosParaTramite(items)
    pasos[0].estado = 'en_curso'

    addTramite({
      id: nuevoId,
      fut: fut.trim(),
      ciudadano: ciudadanoSeleccionado,
      items: items.map((item) => ({ clase: item.clase, tipo: item.tipo })),
      pasos,
      estado: 'en_curso',
      fechaInicio: new Date().toISOString().slice(0, 10),
    })

    toast.success('Trámite creado exitosamente')
    router.push(`/tramite/${nuevoId}`)
  }

  return (
    <section>
      {/* Breadcrumb */}
      <nav className="breadcrumbs mb-6 text-sm" aria-label="Navegación">
        <ul>
          <li>
            <Link href="/" className="gap-1">
              <IconArrowLeft size={14} />
              Tablero
            </Link>
          </li>
          <li className="font-semibold">Nuevo Trámite</li>
        </ul>
      </nav>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        {/* Formulario */}
        <section className="flex flex-col gap-6">
          {/* FUT */}
          <article className="card card-border bg-base-100">
            <section className="card-body">
              <h2 className="card-title text-base">
                <IconFileText size={18} />
                Formulario Único de Trámite (FUT)
              </h2>
              <fieldset className="fieldset mt-2">
                <label className="fieldset-legend" htmlFor="fut">
                  Número de FUT
                </label>
                <input
                  id="fut"
                  className="input input-bordered input-primary w-full max-w-xs font-mono"
                  placeholder="Ej: FUT-10482"
                  value={fut}
                  onChange={(e) => setFut(e.target.value)}
                  required
                  aria-required="true"
                />
              </fieldset>
            </section>
          </article>

          {/* Selección de ciudadano */}
          <article className="card card-border bg-base-100">
            <section className="card-body">
              <header className="flex items-center justify-between">
                <h2 className="card-title text-base">
                  <IconUser size={18} />
                  Ciudadano
                </h2>
                {!ciudadanoSeleccionado && (
                  <Link href="/ciudadanos" className="link link-primary text-sm opacity-70">
                    Gestionar ciudadanos →
                  </Link>
                )}
              </header>
              <BuscarCiudadanoInput
                ciudadanos={ciudadanos}
                seleccionado={ciudadanoSeleccionado}
                onSeleccionar={setCiudadanoSeleccionado}
                onDeseleccionar={() => setCiudadanoSeleccionado(null)}
              />
            </section>
          </article>

          {/* Items de licencia */}
          <LicenciaItemsForm items={items} onItemsChange={setItems} />

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
        <PasosPreview pasos={pasosPreview} items={items} />
      </section>
    </section>
  )
}
