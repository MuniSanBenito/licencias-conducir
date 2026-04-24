'use client'

import { ESTADO_TRAMITE, TIPO_TRAMITE, TIPO_TRAMITE_LABELS, type TipoTramite, tipoRequiereCurso } from '@/constants/tramites'
import type { Ciudadano } from '@/payload-types'
import { sdk } from '@/web/libs/payload/client'
import { BuscarCiudadanoInput } from '@/web/ui/molecules/buscar-ciudadano-input'
import { PayloadSDKError } from '@payloadcms/sdk'
import { IconArrowLeft, IconFileText, IconLoader2, IconRocket, IconSchool, IconStethoscope, IconUser } from '@tabler/icons-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { twJoin } from 'tailwind-merge'

interface Props {
  ciudadanos: Ciudadano[]
  page: number
  totalPages: number
  totalDocs: number
  currentQuery: string
}

export function NuevoTramitePage({ ciudadanos, page, totalPages, totalDocs, currentQuery }: Props) {
  const router = useRouter()

  const [ciudadanoSeleccionado, setCiudadanoSeleccionado] = useState<Ciudadano | null>(null)
  const [fut, setFut] = useState('')
  const [tipo, setTipo] = useState<TipoTramite>(TIPO_TRAMITE.ORIGINAL)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const requiereCurso = tipoRequiereCurso(tipo)

  const handleSubmit = async () => {
    if (!ciudadanoSeleccionado) {
      toast.error('Seleccioná un ciudadano antes de continuar')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await sdk.create({
        collection: 'tramite',
        data: {
          ciudadano: ciudadanoSeleccionado.id,
          tipo,
          fut: fut.trim() || undefined,
          estado: ESTADO_TRAMITE.EN_CURSO,
          fechaInicio: new Date().toISOString(),
        },
      })

      if (response?.id) {
        toast.success('Trámite creado exitosamente')
        router.push(`/tramite/${response.id}`)
      } else {
        throw new Error('Error al crear el trámite')
      }
    } catch (error) {
      console.error(error)
      if (error instanceof PayloadSDKError) {
        error.errors.forEach((err) => toast.error(err.message))
      } else {
        toast.error('Error al crear el trámite')
      }
    }

    setIsSubmitting(false)
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
                page={page}
                totalPages={totalPages}
                totalDocs={totalDocs}
                currentQuery={currentQuery}
              />
            </section>
          </article>

          {/* Tipo de trámite */}
          <article className="card card-border bg-base-100">
            <section className="card-body">
              <h2 className="card-title text-base">
                <IconFileText size={18} />
                Tipo de Trámite
              </h2>
              <fieldset className="fieldset mt-2">
                <label className="fieldset-legend" htmlFor="tipo-tramite">
                  Seleccionar tipo
                </label>
                <select
                  id="tipo-tramite"
                  className="select select-bordered w-full max-w-xs"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value as TipoTramite)}
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
            </section>
          </article>

          {/* FUT (opcional) */}
          <article className="card card-border bg-base-100">
            <section className="card-body">
              <h2 className="card-title text-base">
                <IconFileText size={18} />
                FUT
                <span className="badge badge-ghost badge-sm">Opcional</span>
              </h2>
              <fieldset className="fieldset mt-2">
                <label className="fieldset-legend" htmlFor="fut">
                  Número de FUT
                </label>
                <input
                  id="fut"
                  className="input input-bordered w-full max-w-xs font-mono"
                  placeholder="Ej: FUT-10482"
                  value={fut}
                  onChange={(e) => setFut(e.target.value)}
                />
              </fieldset>
            </section>
          </article>

          {/* Botón submit */}
          <button
            className={twJoin(
              'btn btn-lg self-start',
              ciudadanoSeleccionado ? 'btn-primary' : 'btn-disabled',
            )}
            onClick={handleSubmit}
            disabled={!ciudadanoSeleccionado || isSubmitting}
          >
            {isSubmitting ? (
              <IconLoader2 size={20} className="animate-spin" aria-hidden="true" />
            ) : (
              <IconRocket size={20} aria-hidden="true" />
            )}
            {isSubmitting ? 'Creando...' : 'Iniciar Trámite'}
          </button>
        </section>

        {/* Preview lateral */}
        <aside className="card card-border bg-base-100 sticky top-6 self-start">
          <section className="card-body">
            <h3 className="card-title text-sm">Resumen del Trámite</h3>
            <p className="mb-4 text-xs opacity-50">
              Vista previa basada en el tipo seleccionado
            </p>

            <dl className="grid gap-3">
              <section>
                <dt className="text-[10px] tracking-wider uppercase opacity-40">Tipo</dt>
                <dd className="text-sm font-semibold">{TIPO_TRAMITE_LABELS[tipo]}</dd>
              </section>

              {fut && (
                <section>
                  <dt className="text-[10px] tracking-wider uppercase opacity-40">FUT</dt>
                  <dd className="font-mono text-sm">{fut}</dd>
                </section>
              )}
            </dl>

            <section className="border-base-200 mt-4 border-t pt-4">
              <p className="mb-2 text-xs font-semibold opacity-50">Turnos requeridos:</p>
              <section className="flex flex-col gap-2">
                {requiereCurso && (
                  <p className="flex items-center gap-2 text-sm">
                    <IconSchool size={14} className="text-warning" />
                    Curso Presencial
                  </p>
                )}
                <p className="flex items-center gap-2 text-sm">
                  <IconStethoscope size={14} className="text-info" />
                  Examen Psicofísico
                </p>
              </section>
            </section>
          </section>
        </aside>
      </section>
    </section>
  )
}
