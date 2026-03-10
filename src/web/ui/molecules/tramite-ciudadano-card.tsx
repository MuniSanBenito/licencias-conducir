import type { Ciudadano } from '@/app/(frontend)/(protected)/types'
import { IconUser } from '@tabler/icons-react'

interface TramiteCiudadanoCardProps {
  ciudadano: Ciudadano
}

export function TramiteCiudadanoCard({ ciudadano }: TramiteCiudadanoCardProps) {
  return (
    <article className="card card-border bg-base-100 card-sm">
      <section className="card-body">
        <h3 className="card-title text-sm">
          <IconUser size={16} />
          Datos del Ciudadano
        </h3>
        <dl className="mt-2 grid gap-2">
          {[
            { dt: 'DNI', dd: ciudadano.dni },
            { dt: 'Nombre', dd: `${ciudadano.nombre} ${ciudadano.apellido}` },
            { dt: 'Celular', dd: ciudadano.celular || '—' },
            { dt: 'Nacimiento', dd: ciudadano.fechaNacimiento },
            { dt: 'Domicilio', dd: ciudadano.domicilio },
          ].map((campo) => (
            <section key={campo.dt}>
              <dt className="text-[10px] tracking-wider uppercase opacity-40">{campo.dt}</dt>
              <dd className="text-sm font-medium">{campo.dd}</dd>
            </section>
          ))}
        </dl>
      </section>
    </article>
  )
}
