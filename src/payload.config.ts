import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { es } from 'payload/i18n/es'
import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { DATABASE_URI, PAYLOAD_SECRET } from './config'
import { DISPLAY_DATE_FORMAT } from './constants/fechas'
import { Archivo } from './payload/collections/archivo'
import { Ciudadano } from './payload/collections/ciudadano'
import { Dev } from './payload/collections/dev'
import { Examen } from './payload/collections/examen'
import { Pregunta } from './payload/collections/pregunta'
import { Tramite } from './payload/collections/tramite'
import { Usuario } from './payload/collections/usuario'
import { storagePlugin } from './payload/plugins/storage'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Dev.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    avatar: 'default',
    theme: 'light',
    dateFormat: DISPLAY_DATE_FORMAT,
    meta: {
      titleSuffix: '| Licencias San Benito',
    },
    components: {
      graphics: {
        Logo: '/payload/brand/logo#Logo',
        Icon: '/payload/brand/icon#Icon',
      },
    },
  },
  collections: [Dev, Archivo, Usuario, Ciudadano, Tramite, Pregunta, Examen],
  editor: lexicalEditor(),
  secret: PAYLOAD_SECRET,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: DATABASE_URI,
  }),
  sharp,
  plugins: [payloadCloudPlugin(), storagePlugin],
  i18n: {
    fallbackLanguage: 'es',
    supportedLanguages: {
      es,
    },
  },
})
