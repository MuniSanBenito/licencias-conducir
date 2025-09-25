import Image from 'next/image'

const ASPECT = 2865 / 1252

const HEIGHT = 200
const WIDTH = HEIGHT * ASPECT

export function Logo() {
  return <Image src="/logo.webp" alt="Logo San Benito" height={HEIGHT} width={WIDTH} />
}
