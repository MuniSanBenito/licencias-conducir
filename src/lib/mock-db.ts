// Mock Data
const AREAS: Area[] = [
  { id: '1', name: 'Licencias de Conducir' },
  { id: '2', name: 'Catastro' },
  { id: '3', name: 'Rentas' },
]

const USERS: User[] = [
  { id: '1', name: 'Juan Perez', areaId: '1' },
  { id: '2', name: 'Maria Gomez', areaId: '1' },
  { id: '3', name: 'Carlos Lopez', areaId: '2' },
  { id: '4', name: 'Ana Martinez', areaId: '3' },
]

let appointments: Appointment[] = []

export const mockDb = {
  getAreas: async (): Promise<Area[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...AREAS]), 100))
  },

  getUsers: async (areaId?: string): Promise<User[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (areaId) {
          resolve(USERS.filter((u) => u.areaId === areaId))
        } else {
          resolve([...USERS])
        }
      }, 100)
    })
  },

  getAppointments: async (): Promise<Appointment[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...appointments]), 100))
  },

  createAppointment: async (data: CreateAppointmentRequest): Promise<Appointment> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newAppointment: Appointment = {
          id: Math.random().toString(36).substring(7),
          ...data,
          createdAt: new Date().toISOString(),
        }
        appointments.push(newAppointment)
        resolve(newAppointment)
      }, 200)
    })
  },
}

// Types
export interface Area {
  id: string
  name: string
}

export interface User {
  id: string
  name: string
  areaId: string
}

export interface Appointment {
  id: string
  areaId: string
  userId: string
  date: string // ISO string
  time: string // HH:mm
  customerName: string
  customerDni: string
  createdAt: string
}

export interface CreateAppointmentRequest {
  areaId: string
  userId: string
  date: string
  time: string
  customerName: string
  customerDni: string
}
