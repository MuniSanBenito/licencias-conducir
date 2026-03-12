import { IconSearch, IconX } from '@tabler/icons-react'

interface BuscarFormProps {
  value: string
  onChange: (value: string) => void
  onSearch: () => void
  onClear: () => void
  label: string
  placeholder?: string
  clearDisabled?: boolean
  className?: string
}

export function BuscarForm({
  value,
  onChange,
  onSearch,
  onClear,
  label,
  placeholder,
  clearDisabled,
  className,
}: BuscarFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch()
  }

  return (
    <form role="search" className={className} onSubmit={handleSubmit}>
      <input
        type="search"
        className="input input-bordered input-sm flex-1"
        placeholder={placeholder}
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button type="submit" className="btn btn-primary btn-sm">
        <IconSearch size={18} aria-hidden="true" />
        Buscar
      </button>
      <button
        type="button"
        className="btn btn-ghost btn-sm"
        onClick={onClear}
        disabled={clearDisabled}
      >
        <IconX size={18} aria-hidden="true" />
        Limpiar
      </button>
    </form>
  )
}
