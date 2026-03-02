'use client'

import { updateCiudadano } from '@/app/actions/ciudadano'
import type { Ciudadano } from '@/payload-types'
import { CiudadanoForm, type CiudadanoFormData } from '@/web/ui/organisms/ciudadano-form'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface Props {
  ciudadano: Ciudadano
}

export function EditarCiudadanoClient({ ciudadano }: Props) {
  const router = useRouter()

  const defaultValues: Partial<CiudadanoFormData> = {
    dni: ciudadano.dni,
    nombre: ciudadano.nombre,
    apellido: ciudadano.apellido,
    email: ciudadano.email ?? '',
    fecha_nacimiento: ciudadano.fecha_nacimiento
      ? new Date(ciudadano.fecha_nacimiento).toISOString().split('T')[0]
      : '',
  }

  const onSubmit = async (data: CiudadanoFormData) => {
    const res = await updateCiudadano(ciudadano.id, data)

    if (res.ok) {
      toast.success(res.message)
      router.push('/ciudadano')
    } else {
      toast.error(res.message)
    }
  }

  return (
    <CiudadanoForm
      title={`Editar Ciudadano — ${ciudadano.apellido}, ${ciudadano.nombre}`}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
    />
  )
}
