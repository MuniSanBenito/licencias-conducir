'use server'

import { CreateAppointmentRequest, mockDb } from '@/lib/mock-db'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createAppointmentAction(data: CreateAppointmentRequest) {
  await mockDb.createAppointment(data)
  revalidatePath('/gestion/turnos')
  redirect('/gestion/turnos')
}
