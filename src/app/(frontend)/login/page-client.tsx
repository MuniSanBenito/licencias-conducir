'use client'
import { signIn } from '@/app/actions/auth'
import { Logo } from '@/payload/brand/logo'
import { useRouter } from 'next/navigation'
import { type FormEvent, useState } from 'react'
import { toast } from 'sonner'

export function LoginPageClient() {
  const router = useRouter()

  const [loading, setLoading] = useState(false)

  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const email: string = e.currentTarget.email.value
    const password: string = e.currentTarget.password.value

    if (!email || !password) {
      setLoading(false)
      toast.error('Por favor, completa todos los campos')
      return
    }

    const response = await signIn({ email, password })
    if (response.ok) {
      toast.success('Inicio de sesión exitoso')
      router.replace('/')
    } else {
      toast.error(response.message)
    }
    setLoading(false)
  }

  return (
    <div className="bg-base-200 flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <Logo />
          <h3 className="mt-3 text-center text-2xl font-bold">Gestion de Licencias</h3>
          <p className="mt-2 text-center text-sm opacity-70">Ingresa a tu cuenta para continuar</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <fieldset className="fieldset">
              <label className="fieldset-legend" htmlFor="email-address">
                Correo electrónico
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="input input-bordered w-full"
                placeholder="Correo electrónico"
              />
            </fieldset>
            <fieldset className="fieldset">
              <label className="fieldset-legend" htmlFor="password">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                className="input input-bordered w-full"
                placeholder="Contraseña"
              />
              <label className="label">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                />
                Mostrar contraseña
              </label>
            </fieldset>
          </div>

          <div>
            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              Ingresar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
