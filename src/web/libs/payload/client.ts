import "client-only"

import { PayloadSDK } from '@payloadcms/sdk'

export const sdk = new PayloadSDK({
  baseURL: '/api',
})