'use client'

import { useEffect, useRef } from 'react'
import { twJoin } from 'tailwind-merge'

const VARIANT_CLASS = {
  primary: 'btn-primary',
  warning: 'btn-warning',
  error: 'btn-error',
} as const

export interface ConfirmActionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  message: string
  confirmLabel: string
  cancelLabel?: string
  confirmVariant?: keyof typeof VARIANT_CLASS
  onConfirm: () => void
}

export function ConfirmActionDialog({
  open,
  onOpenChange,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancelar',
  confirmVariant = 'primary',
  onConfirm,
}: ConfirmActionDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const el = dialogRef.current
    if (!el) return
    if (open) {
      el.showModal()
    } else if (el.open) {
      el.close()
    }
  }, [open])

  useEffect(() => {
    const el = dialogRef.current
    if (!el) return
    const onClose = () => onOpenChange(false)
    el.addEventListener('close', onClose)
    return () => el.removeEventListener('close', onClose)
  }, [onOpenChange])

  const handleConfirm = () => {
    onConfirm()
    dialogRef.current?.close()
  }

  return (
    <dialog ref={dialogRef} className="modal" aria-labelledby="confirm-action-title">
      <section className="modal-box">
        <h2 id="confirm-action-title" className="text-lg font-bold">
          {title}
        </h2>
        <p className="py-4">{message}</p>
        <section className="modal-action">
          <button type="button" className="btn" onClick={() => dialogRef.current?.close()}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={twJoin('btn', VARIANT_CLASS[confirmVariant])}
            onClick={handleConfirm}
          >
            {confirmLabel}
          </button>
        </section>
      </section>
    </dialog>
  )
}
