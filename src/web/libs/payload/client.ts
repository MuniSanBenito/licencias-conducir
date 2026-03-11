import 'client-only'

import type { Config } from '@/payload-types'
import { PayloadSDK } from '@payloadcms/sdk'

export const sdk = new PayloadSDK<Config>({
  baseURL: '/api',
})
