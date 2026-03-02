'use client'

import { createCiudadano } from '@/app/actions/ciudadano'
import { CiudadanoForm, type CiudadanoFormData } from '@/web/ui/organisms/ciudadano-form'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function NuevoCiudadanoPage() {
  const router = useRouter()

  const onSubmit = async (data: CiudadanoFormData) => {
    const res = await createCiudadano(data)

    if (res.ok) {
      toast.success(res.message)
      router.push('/ciudadano')
    } else {
      toast.error(res.message)
    }
  }

  return <CiudadanoForm title="Nuevo Ciudadano" onSubmit={onSubmit} />
}
