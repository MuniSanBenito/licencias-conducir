import { R2_ACCESS_KEY_ID, R2_BUCKET, R2_ENDPOINT, R2_SECRET_ACCESS_KEY } from '@/config'
import { s3Storage } from '@payloadcms/storage-s3'
import { File } from '../collections/file'

const endpoint = R2_ENDPOINT
const accessKeyId = R2_ACCESS_KEY_ID
const secretAccessKey = R2_SECRET_ACCESS_KEY
const bucket = R2_BUCKET

export const storagePlugin = s3Storage({
  collections: {
    [File.slug]: {
      prefix: 'archivos',
    },
  },
  config: {
    region: 'auto',
    endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  },
  bucket,
})
