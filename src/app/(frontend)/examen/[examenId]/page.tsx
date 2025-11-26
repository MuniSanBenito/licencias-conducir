export default async function ExamenPage({ params }: PageProps<'/examen/[examenId]'>) {
  const { examenId } = await params
  return <div>Examen Page {examenId}</div>
}
