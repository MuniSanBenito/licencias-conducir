// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { es } from 'payload/i18n/es'
import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { DATABASE_URI, PAYLOAD_SECRET } from './config'
import { Archivos } from './payload/collections/archivos'
import { Ciudadanos } from './payload/collections/ciudadanos'
import { Consignas } from './payload/collections/consignas'
import { Examenes } from './payload/collections/examenes'
import { ExamenesFinalizados } from './payload/collections/examenes-finalizados'
import { Fut } from './payload/collections/fut'
import { Usuarios } from './payload/collections/usuarios'
import { storagePlugin } from './payload/plugins/storage'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Usuarios.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    avatar: 'default',
    theme: 'light',
    dateFormat: 'dd/MM/yyyy',
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
  collections: [Usuarios, Ciudadanos, Archivos, Fut, Consignas, Examenes, ExamenesFinalizados],
  editor: lexicalEditor(),
  secret: PAYLOAD_SECRET,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: DATABASE_URI,
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    storagePlugin,
    /* formBuilderPlugin({
      fields: {
        checkbox: true,
        select: true,
      },

      formOverrides: {
        labels: {
          singular: 'Formulario',
          plural: 'Formularios',
        },
        fields: ({ defaultFields }) => [
          {
            name: 'fut',
            type: 'relationship',
            label: 'FUT',
            relationTo: 'futs',
            required: true,
          },
          ...defaultFields,
        ],
      },
      formSubmissionOverrides: {
        labels: {
          singular: 'Envío de formulario',
          plural: 'Envíos de formularios',
        },
        fields: ({ defaultFields }) => [...defaultFields],
      },
    }), */
  ],
  i18n: {
    fallbackLanguage: 'es',
    supportedLanguages: {
      es,
    },
  },
})
