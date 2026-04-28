'use client'

import { TIPO_TURNO_LABELS, type TipoTurno } from '@/constants/tramites'
import type { Ciudadano, Tramite, TurnoCurso, TurnoPsicofisico } from '@/payload-types'
import { TurnoBadge } from '@/web/ui/atoms/turno-badge'
import { formatDate } from '@/web/utils/fechas'
import { IconCalendar, IconClock } from '@tabler/icons-react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import Link from 'next/link'

type TurnoPopulated = (TurnoCurso | TurnoPsicofisico) & {
  tramite: Tramite & { ciudadano: Ciudadano }
}

interface Props {
  tipoTurno: TipoTurno
  turnos: TurnoPopulated[]
  icon: React.ReactNode
}

const columnHelper = createColumnHelper<TurnoPopulated>()

function buildColumns() {
  return [
    columnHelper.accessor((row) => `${row.tramite.ciudadano.apellido}, ${row.tramite.ciudadano.nombre}`, {
      id: 'ciudadano',
      header: 'Ciudadano',
      cell: (info) => <p className="font-medium">{info.getValue()}</p>,
    }),
    columnHelper.accessor((row) => row.tramite.ciudadano.dni, {
      id: 'dni',
      header: 'DNI',
      cell: (info) => <p className="font-mono text-sm">{info.getValue()}</p>,
    }),
    columnHelper.accessor('fecha', {
      id: 'fecha',
      header: 'Fecha',
      cell: (info) => (
        <p className="flex items-center gap-1 text-sm">
          <IconCalendar size={14} className="opacity-50" />
          {formatDate(info.getValue())}
        </p>
      ),
    }),
    columnHelper.accessor('hora', {
      id: 'hora',
      header: 'Hora',
      cell: (info) => {
        const hora = info.getValue()
        return hora ? (
          <p className="flex items-center gap-1 text-sm">
            <IconClock size={14} className="opacity-50" />
            {hora}
          </p>
        ) : (
          <p className="text-sm opacity-40">—</p>
        )
      },
    }),
    columnHelper.accessor('estado', {
      id: 'estado',
      header: 'Estado',
      cell: ({ row }) => <TurnoBadge estado={row.original.estado} />,
    }),
    columnHelper.accessor((row) => row.tramite.fut ?? '—', {
      id: 'fut',
      header: 'FUT',
      cell: ({ row }) => (
        <Link
          href={`/tramite/${row.original.tramite.id}`}
          className="link link-primary font-mono text-sm"
          aria-label={`Ver trámite ${row.original.tramite.fut || row.original.tramite.id}`}
        >
          {row.original.tramite.fut || 'Ver trámite →'}
        </Link>
      ),
    }),
  ]
}

export function TurnosListPage({ tipoTurno, turnos, icon }: Props) {
  const columns = buildColumns()

  const table = useReactTable({
    data: turnos,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <section>
      <header className="mb-6">
        <h2 className="flex items-center gap-2 text-xl font-bold">
          {icon}
          Turnos — {TIPO_TURNO_LABELS[tipoTurno]}
        </h2>
        <p className="mt-1 text-sm opacity-60">
          {turnos.length === 0
            ? 'No hay turnos asignados'
            : `${turnos.length} turno${turnos.length !== 1 ? 's' : ''} asignado${turnos.length !== 1 ? 's' : ''}`}
        </p>
      </header>

      <section className="bg-base-100 rounded-box overflow-hidden shadow">
        <section className="overflow-x-auto">
          <table className="table-zebra table w-full" aria-label={`Turnos de ${TIPO_TURNO_LABELS[tipoTurno]}`}>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="py-8 text-center">
                    No hay turnos para mostrar
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </section>
    </section>
  )
}
