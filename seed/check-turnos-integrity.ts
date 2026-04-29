import { basePayload } from '@/web/libs/payload/server'

async function run() {
  const [turnosCurso, turnosPsico] = await Promise.all([
    basePayload.find({ collection: 'turno-curso', depth: 0, limit: 1000 }),
    basePayload.find({ collection: 'turno-psicofisico', depth: 0, limit: 1000 }),
  ])

  const cursoHuerfanos = turnosCurso.docs.filter((turno) => !turno.ciudadano)
  const psicoHuerfanos = turnosPsico.docs.filter((turno) => !turno.ciudadano)

  console.log(`Turnos curso: ${turnosCurso.totalDocs}`)
  console.log(`Turnos psicofísico: ${turnosPsico.totalDocs}`)
  console.log(`Turnos curso sin ciudadano: ${cursoHuerfanos.length}`)
  console.log(`Turnos psicofísico sin ciudadano: ${psicoHuerfanos.length}`)

  if (cursoHuerfanos.length > 0 || psicoHuerfanos.length > 0) {
    process.exit(1)
  }
}

await run()
