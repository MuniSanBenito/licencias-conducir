export function formatDate(value: string | null | undefined): string {
  if (!value) {
    return '—'
  }

  const isoDate = value.split('T')[0]
  const date = new Date(`${isoDate}T12:00:00`)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleDateString('es-AR')
}
