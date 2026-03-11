'use client'

import { CLASES_LICENCIA, type ClaseLicencia } from '@/constants/clases'
import { TIPO_TRAMITE_LABELS, type TipoTramite } from '@/constants/tramites'
import { IconLicense, IconPlus, IconTrash } from '@tabler/icons-react'
import { twJoin } from 'tailwind-merge'

export interface ItemForm {
  clase: ClaseLicencia
  tipo: TipoTramite
}

interface LicenciaItemsFormProps {
  items: ItemForm[]
  onItemsChange: (items: ItemForm[]) => void
}

export function LicenciaItemsForm({ items, onItemsChange }: LicenciaItemsFormProps) {
  const agregarItem = () => {
    onItemsChange([...items, { clase: 'B1', tipo: 'nueva' }])
  }

  const eliminarItem = (index: number) => {
    if (items.length <= 1) return
    onItemsChange(items.filter((_, i) => i !== index))
  }

  const actualizarItem = (index: number, campo: keyof ItemForm, valor: string) => {
    const nuevos = [...items]
    nuevos[index] = { ...nuevos[index], [campo]: valor }
    onItemsChange(nuevos)
  }

  return (
    <article className="card card-border bg-base-100">
      <section className="card-body">
        <header className="flex items-center justify-between">
          <h2 className="card-title text-base">
            <IconLicense size={18} />
            Clases / Categorías
          </h2>
          <button className="btn btn-ghost btn-sm" onClick={agregarItem}>
            <IconPlus size={16} />
            Agregar otra
          </button>
        </header>

        <section className="mt-4 flex flex-col gap-3">
          {items.map((item, index) => (
            <section key={index} className="bg-base-200 flex items-end gap-3 rounded-lg p-4">
              <fieldset className="fieldset flex-1">
                <label className="fieldset-legend" htmlFor={`clase-${index}`}>
                  Clase
                </label>
                <select
                  id={`clase-${index}`}
                  className="select select-bordered w-full"
                  value={item.clase}
                  onChange={(e) => actualizarItem(index, 'clase', e.target.value)}
                >
                  {CLASES_LICENCIA.map((clase) => (
                    <option key={clase} value={clase}>
                      {clase}
                    </option>
                  ))}
                </select>
              </fieldset>

              <fieldset className="fieldset flex-1">
                <label className="fieldset-legend" htmlFor={`tipo-${index}`}>
                  Tipo
                </label>
                <select
                  id={`tipo-${index}`}
                  className="select select-bordered w-full"
                  value={item.tipo}
                  onChange={(e) => actualizarItem(index, 'tipo', e.target.value)}
                >
                  {(Object.entries(TIPO_TRAMITE_LABELS) as [TipoTramite, string][]).map(
                    ([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ),
                  )}
                </select>
              </fieldset>

              <button
                className={twJoin(
                  'btn btn-square btn-sm',
                  items.length <= 1 ? 'btn-disabled' : 'btn-error btn-ghost',
                )}
                onClick={() => eliminarItem(index)}
                disabled={items.length <= 1}
                aria-label={`Eliminar clase ${item.clase}`}
              >
                <IconTrash size={16} />
              </button>
            </section>
          ))}
        </section>
      </section>
    </article>
  )
}
