import Image from 'next/image'

const ASPECT = 2865 / 1252

const HEIGHT = 200

interface Props {
  height?: number
}
export function Logo({ height = HEIGHT }: Props = {}) {
  return <Image src="/logo.webp" alt="Logo San Benito" height={height} width={height * ASPECT} />
}
