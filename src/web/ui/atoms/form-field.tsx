import type { FieldError } from 'react-hook-form'
import { twJoin } from 'tailwind-merge'

interface FormFieldProps {
  id: string
  label: string
  error?: FieldError
  className?: string
  children: React.ReactNode
}

export function FormField({ id, label, error, className, children }: FormFieldProps) {
  return (
    <div className={twJoin('form-control', className)}>
      <label className="label" htmlFor={id}>
        <span className="label-text">{label}</span>
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="label">
          <span className="label-text-alt text-error">{error.message}</span>
        </p>
      )}
    </div>
  )
}
