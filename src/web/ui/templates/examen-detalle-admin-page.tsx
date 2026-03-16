'use client'

import type { Ciudadano, Examan as Examen, Tramite, Pregunta } from '@/payload-types'
import { IconArrowLeft, IconCheck, IconX, IconClock, IconUser, IconFileText, IconClipboardList } from '@tabler/icons-react'
import Link from 'next/link'

interface Props {
  examen: Examen
}

export function ExamenDetallePage({ examen }: Props) {
  const rs = examen.resultado
  
  const ciudadano = examen.ciudadano as Ciudadano
  const tramite = examen.tramite as Tramite
  
  const isCerrado = examen.estado === 'cerrado'
  const isAprobado = rs?.aprobado
  
  const percentage = rs && typeof rs.puntajeTotal === 'number' && rs.puntajeTotal > 0 && typeof rs.puntajeObtenido === 'number'
    ? Math.round((rs.puntajeObtenido / rs.puntajeTotal) * 100) 
    : 0

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleString('es-AR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }

  return (
    <section className="space-y-6">
      <nav className="breadcrumbs mb-6 text-sm">
        <ul>
          <li>
            <Link href="/gestion-examenes" className="gap-1">
              <IconArrowLeft size={14} />
              Exámenes
            </Link>
          </li>
          <li className="font-semibold">Detalle de Examen</li>
        </ul>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Columna Izquierda: Detalles del Ciudadano y Trámite */}
        <div className="md:col-span-1 space-y-6">
          <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body">
              <h2 className="card-title text-base flex gap-2">
                <IconUser size={18} /> Ciudadano
              </h2>
              <ul className="text-sm mt-2 space-y-2">
                <li><strong>Nombre:</strong> {ciudadano?.nombre} {ciudadano?.apellido}</li>
                <li><strong>DNI:</strong> {ciudadano?.dni}</li>
                <li><strong>Email:</strong> {ciudadano?.email || '-'}</li>
              </ul>
            </div>
          </div>

          <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body">
              <h2 className="card-title text-base flex gap-2">
                <IconFileText size={18} /> Trámite Asociado
              </h2>
              <ul className="text-sm mt-2 space-y-2">
                <li><strong>FUT:</strong> {tramite?.fut}</li>
                <li>
                  <Link href={`/tramite/${tramite?.id}`} className="link link-primary text-xs">
                    Ver Expediente
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body">
              <h2 className="card-title text-base flex gap-2">
                <IconClock size={18} /> Tiempos
              </h2>
              <ul className="text-sm mt-2 space-y-2">
                <li><strong>Inicio:</strong> {formatearFecha(examen.fechaInicio)}</li>
                <li><strong>Límite:</strong> {formatearFecha(examen.fechaFin)}</li>
                <li>
                  <span className={`badge ${isCerrado ? 'badge-neutral' : 'badge-success'}`}>
                    {isCerrado ? 'Finalizado' : 'En Curso'}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Resultado */}
        <div className="md:col-span-2 space-y-6">
          
          <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body">
              <h2 className="card-title text-base flex gap-2">
                <IconClipboardList size={18} /> Resultado de Evaluación
              </h2>
              
              {!isCerrado ? (
                <div className="text-center py-10 opacity-60">
                  El examen todavía no ha sido finalizado por el ciudadano.
                </div>
              ) : (
                <div className="flex flex-col md:flex-row items-center gap-6 mt-4 p-4 bg-base-200 rounded-box">
                  <div className={`p-4 rounded-full ${isAprobado ? 'bg-success/20 text-success' : 'bg-error/20 text-error'}`}>
                    {isAprobado ? <IconCheck size={48} /> : <IconX size={48} />}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold">{isAprobado ? 'Aprobado' : 'Desaprobado'}</h3>
                    <p className="text-sm opacity-80 mt-1">Calificación obtenida sobre el total posible.</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black">{percentage}%</div>
                    <div className="text-sm font-medium">{rs?.puntajeObtenido} / {rs?.puntajeTotal} pts</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {isCerrado && examen.respuestasCiudadano && (
            <div className="card bg-base-100 shadow-sm border border-base-200">
              <div className="card-body">
                 <h2 className="card-title text-base flex gap-2 mb-4">Detalle de Respuestas</h2>
                 <div className="space-y-6">
                   {examen.preguntasGeneradas?.map((preg, idx) => {
                     const pId = preg.preguntaOriginal as string
                     const respuestaDelCiudadano = examen.respuestasCiudadano?.find(r => r.preguntaRef === pId)
                     const sel = (respuestaDelCiudadano?.opcionesSeleccionadas as string[]) || []
                     
                     // Calcular si tuvo al menos alguna correcta o se equivocó
                     const correctas = preg.opciones.filter(o => o.esCorrecta).map(o => o.idOp)
                     const aciertos = correctas.filter((c: string) => sel.includes(c)).length
                     const errores = sel.filter((s: string) => !correctas.includes(s)).length
                     const isPerfect = aciertos === correctas.length && errores === 0
                     
                     return (
                       <div key={pId} className={`p-4 rounded-lg border-l-4 ${isPerfect ? 'border-success bg-success/5' : 'border-error bg-error/5'}`}>
                         <h4 className="font-medium mb-3">{idx + 1}. {preg.consigna}</h4>
                         <ul className="space-y-2 pl-2">
                           {preg.opciones.map((opt) => {
                             const wasSelected = sel.includes(opt.idOp)
                             const isCorrect = opt.esCorrecta

                             return (
                               <li key={opt.idOp} className={`flex items-start gap-2 text-sm ${wasSelected ? 'font-semibold' : ''}`}>
                                 <div className="mt-0.5">
                                   {isCorrect ? (
                                     <IconCheck size={16} className="text-success" />
                                   ) : (
                                     <span className="w-[16px] inline-block" />
                                   )}
                                 </div>
                                 <span className={wasSelected ? (isCorrect ? 'text-success' : 'text-error line-through') : 'opacity-70'}>
                                   {opt.texto} {wasSelected ? '(Elegida)' : ''}
                                 </span>
                               </li>
                             )
                           })}
                         </ul>
                       </div>
                     )
                   })}
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
