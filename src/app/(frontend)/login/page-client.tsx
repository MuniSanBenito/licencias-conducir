'use client'
import { Logo } from '@/payload/brand/logo'
import { sdk } from '@/web/libs/payload/client'
import { useRouter } from 'next/navigation'
import { type SubmitEvent, useState } from 'react'
import { toast } from 'sonner'

export function LoginPageClient() {
  const router = useRouter()

  const [loading, setLoading] = useState(false)

  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const email: string = e.currentTarget.email.value
    const password: string = e.currentTarget.password.value

    if (!email || !password) {
      setLoading(false)
      toast.error('Por favor, completa todos los campos')
      return
    }

    try {
      const response = await sdk.login({
        collection: 'usuario',
        data: {
          email,
          password,
        },
      })
      if (response.user) {
        toast.success('Inicio de sesión exitoso')
        router.replace('/')
      } else {
        console.log(response)
        toast.error('Ocurrió un error al iniciar sesión')
      }
    } catch (error) {
      console.error(error)
      toast.error(error instanceof Error ? error.message : 'Ocurrió un error al iniciar sesión')
    }

    setLoading(false)
  }

  return (
    <main className="bg-base-200 flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <section className="w-full max-w-md space-y-8" aria-labelledby="login-heading">
        <header className="text-center">
          <Logo />
          <h1 id="login-heading" className="mt-3 text-2xl font-bold">
            Gestión de Licencias
          </h1>
          <p className="mt-2 text-sm opacity-70">Ingresá a tu cuenta para continuar</p>
        </header>

        <form
          className="mt-8 space-y-6"
          aria-label="Formulario de inicio de sesión"
          onSubmit={handleSubmit}
        >
          <div className="space-y-4" role="group" aria-label="Credenciales de acceso">
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
                aria-required="true"
                className="input input-bordered w-full"
                placeholder="ejemplo@correo.com"
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
                aria-required="true"
                aria-describedby="toggle-password-visibility"
                className="input input-bordered w-full"
                placeholder="Tu contraseña"
              />
              <label id="toggle-password-visibility" className="label cursor-pointer">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                  aria-label="Mostrar contraseña"
                />
                <span className="label-text">Mostrar contraseña</span>
              </label>
            </fieldset>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </section>
    </main>
  )
}
