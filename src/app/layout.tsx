import type { PropsWithChildren } from 'react'

// TODO: cuando se solucione el error de HMR de nextjs/payloadcms, remover por completo este archivo

export default async function RootLayout({ children }: PropsWithChildren) {
  // Dynamic import in root /app/layout.ts to re-import on each render
  await import('./(payload)/admin/importMap')

  return children
}
