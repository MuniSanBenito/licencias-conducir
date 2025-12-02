import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Your Next.js config here
  webpack: (webpack) => {
    webpack.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpack
  },
  reactCompiler: true, 
  devIndicators: false
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
