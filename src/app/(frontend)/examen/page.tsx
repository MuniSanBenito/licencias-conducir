import { Logo } from '@/payload/brand/logo'

export default function ExamenPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-8">
      <Logo height={100} />
      <form>
        <h2 className="text-xl font-bold">Ingrese su DNI para comenzar el examen</h2>
        <label className="fieldset">
          <span className="label">DNI</span>
          <input type="text" className="input" />
        </label>
      </form>
    </main>
  )
}
