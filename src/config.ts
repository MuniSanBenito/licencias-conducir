export const {
  PAYLOAD_SECRET = '',
  DATABASE_URI = '',
  NODE_ENV,
  R2_ENDPOINT = '',
  R2_ACCESS_KEY_ID = '',
  R2_SECRET_ACCESS_KEY = '',
  R2_BUCKET = '',
} = process.env

export const HIDE_API_URL = NODE_ENV === 'production'
