export function LoadingOverlay() {
  return (
    <div
      className="bg-base-100/30 fixed inset-0 z-9999 flex flex-col items-center justify-center backdrop-blur-sm"
      role="status"
      aria-live="polite"
    >
      <span className="loading loading-spinner loading-lg text-primary" />
      <span className="text-base-content mt-4 text-sm font-medium">Cargando...</span>
    </div>
  )
}
