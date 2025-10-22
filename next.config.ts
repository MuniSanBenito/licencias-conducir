import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Your Next.js config here
  /* turbopack: (turbopack) => {
    turbopack.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return turbopack
  }, */
  reactCompiler: true,
  turbopack: {},
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
