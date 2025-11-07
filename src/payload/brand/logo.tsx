import Image from 'next/image'

const ASPECT = 2865 / 1252

const HEIGHT = 200
const WIDTH = HEIGHT * ASPECT

interface Props {
  height?: number
}
export function Logo({ height }: Props = {}) {
  return (
    <Image
      src="/logo.webp"
      alt="Logo San Benito"
      height={height || HEIGHT}
      width={height ? height * ASPECT : WIDTH}
    />
  )
}
