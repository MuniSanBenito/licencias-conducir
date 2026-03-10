import type { ReactNode } from 'react'
import { twJoin } from 'tailwind-merge'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description: ReactNode
  confirmLabel: string
  confirmIcon?: ReactNode
  cancelLabel?: string
  variant?: 'error' | 'warning' | 'primary'
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  confirmIcon,
  cancelLabel = 'Volver',
  variant = 'error',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null

  return (
    <dialog className="modal modal-open" aria-modal="true" role="dialog" aria-label={title}>
      <section className="modal-box">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="mt-2 text-sm opacity-70">{description}</p>
        <section className="modal-action">
          <button className="btn btn-ghost" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button className={twJoin('btn', `btn-${variant}`)} onClick={onConfirm}>
            {confirmIcon}
            {confirmLabel}
          </button>
        </section>
      </section>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onCancel}>Cerrar</button>
      </form>
    </dialog>
  )
}
