'use client'

import { ESTADO_TRAMITE_LABELS, TIPO_TRAMITE_BADGE_CLASS, TIPO_TRAMITE_LABELS } from '@/constants/tramites'
import type { Tramite } from '@/payload-types'
import { formatDate } from '@/web/utils/fechas'
import { IconCheck, IconEdit, IconId, IconX } from '@tabler/icons-react'
import { useState } from 'react'

interface TramiteInfoCardProps {
  tramite: Tramite
  onFutUpdate?: (fut: string) => Promise<boolean>
  disabled?: boolean
}

export function TramiteInfoCard({ tramite, onFutUpdate, disabled }: TramiteInfoCardProps) {
  const [editingFut, setEditingFut] = useState(false)
  const [futValue, setFutValue] = useState(tramite.fut ?? '')
  const [isSaving, setIsSaving] = useState(false)

  const handleSaveFut = async () => {
    if (!onFutUpdate) return

    const trimmed = futValue.trim()
    if (trimmed === (tramite.fut ?? '')) {
      setEditingFut(false)
      return
    }

    setIsSaving(true)
    const ok = await onFutUpdate(trimmed)
    setIsSaving(false)

    if (ok) {
      setEditingFut(false)
    }
  }

  const handleCancelEdit = () => {
    setFutValue(tramite.fut ?? '')
    setEditingFut(false)
  }

  return (
    <article className="card card-border bg-base-100 card-sm">
      <section className="card-body">
        <h3 className="card-title text-sm">
          <IconId size={16} />
          Información
        </h3>
        <dl className="mt-2 grid gap-2">
          {/* FUT — editable */}
          <section>
            <dt className="text-[10px] tracking-wider uppercase opacity-40">FUT</dt>
            {editingFut ? (
              <dd className="mt-1 flex items-center gap-1">
                <input
                  className="input input-bordered input-sm font-mono flex-1"
                  placeholder="Ej: FUT-10482"
                  value={futValue}
                  onChange={(e) => setFutValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveFut()
                    if (e.key === 'Escape') handleCancelEdit()
                  }}
                  disabled={isSaving}
                  autoFocus
                />
                <button
                  className="btn btn-success btn-xs btn-square"
                  onClick={handleSaveFut}
                  disabled={isSaving}
                  aria-label="Guardar FUT"
                >
                  <IconCheck size={14} />
                </button>
                <button
                  className="btn btn-ghost btn-xs btn-square"
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                  aria-label="Cancelar edición"
                >
                  <IconX size={14} />
                </button>
              </dd>
            ) : (
              <dd className="flex items-center gap-2">
                {tramite.fut ? (
                  <span className="font-mono text-sm font-bold">{tramite.fut}</span>
                ) : (
                  <span className="text-sm opacity-40">Sin FUT</span>
                )}
                {onFutUpdate && !disabled && (
                  <button
                    className="btn btn-ghost btn-xs btn-square"
                    onClick={() => setEditingFut(true)}
                    aria-label="Editar FUT"
                  >
                    <IconEdit size={12} />
                  </button>
                )}
              </dd>
            )}
          </section>

          <section>
            <dt className="text-[10px] tracking-wider uppercase opacity-40">Tipo</dt>
            <dd>
              <span className={TIPO_TRAMITE_BADGE_CLASS[tramite.tipo]}>
                {TIPO_TRAMITE_LABELS[tramite.tipo]}
              </span>
            </dd>
          </section>
          <section>
            <dt className="text-[10px] tracking-wider uppercase opacity-40">Estado</dt>
            <dd className="text-sm font-medium">{ESTADO_TRAMITE_LABELS[tramite.estado]}</dd>
          </section>
          <section>
            <dt className="text-[10px] tracking-wider uppercase opacity-40">Fecha Inicio</dt>
            <dd className="text-sm font-medium">{formatDate(tramite.fechaInicio)}</dd>
          </section>
          <section>
            <dt className="text-[10px] tracking-wider uppercase opacity-40">ID Trámite</dt>
            <dd className="font-mono text-sm font-semibold">{tramite.id}</dd>
          </section>
        </dl>
      </section>
    </article>
  )
}
