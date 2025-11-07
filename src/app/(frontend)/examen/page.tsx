'use client'
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
      <button
        className="btn"
        onClick={async () => {
          const response = await fetch('/api/examenes/iniciar-examen', {
            method: 'PUT',
            body: JSON.stringify({
              dni: '12345678',
            }),
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          })
          const data = await response.text()
          console.log(data)
        }}
      >
        Peticion
      </button>
    </main>
  )
}
