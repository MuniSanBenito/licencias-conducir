import { redirect, RedirectType } from 'next/navigation'

export default async function HomePage() {
  redirect('/examen', RedirectType.replace)
}
