import {
  getSlotsPsicofisicoConConfiguracion,
  validarDisponibilidadCurso,
  validarDisponibilidadPsicofisico,
} from '@/web/utils/turnos'
import { describe, expect, it } from 'vitest'

describe('turnos domain rules', () => {
  it('rechaza curso en día inhábil', () => {
    const result = validarDisponibilidadCurso('2026-05-04', [], ['2026-05-04'])
    expect(result.ok).toBe(false)
  })

  it('respeta cupo máximo de curso', () => {
    const turnosExistentes = Array.from({ length: 20 }).map(() => ({
      fecha: '2026-05-11',
      hora: '08:30',
    }))
    const result = validarDisponibilidadCurso('2026-05-11', turnosExistentes, [])
    expect(result.ok).toBe(false)
  })

  it('genera slots psicofísico por configuración diaria', () => {
    const slots = getSlotsPsicofisicoConConfiguracion(
      new Date('2026-05-12T12:00:00'),
      [],
      [{ diaSemana: 2, inicio: '07:00', fin: '08:00', activo: true }],
    )
    expect(slots).toEqual(['07:00', '07:20', '07:40'])
  })

  it('rechaza psicofísico en horario no disponible', () => {
    const result = validarDisponibilidadPsicofisico(
      '2026-05-12',
      '09:00',
      [],
      [],
      [{ diaSemana: 2, inicio: '07:00', fin: '08:00', activo: true }],
    )
    expect(result.ok).toBe(false)
  })
})
