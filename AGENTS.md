# Guía para Agentes de IA

Este documento contiene información importante para agentes de IA que trabajan en este proyecto.

## Información del Proyecto

**Nombre**: Sistema de Licencias de Conducir - Municipalidad de San Benito  
**Ubicación**: San Benito, Entre Ríos, Argentina  
**Repositorio**: MuniSanBenito/licencias-conducir

## Stack Tecnológico

- **Framework**: Next.js
- **CMS**: Payload CMS
- **Base de datos**: MongoDB
- **Estilos**: Tailwind CSS + DaisyUI
- **Lenguaje**: TypeScript
- **Package Manager**: pnpm

## Convenciones de Código

### Estilo

- **Componentes**: PascalCase (`ExamenPageClient`)
- **Archivos**: kebab-case para componentes cliente (`examen-page-client.tsx`)
- **Server Components**: `page.tsx` por defecto
- **Client Components**: Marcar con `'use client'` al inicio
- **Sintaxis de componentes**: Preferir declaración de función sobre constantes con arrow functions
- **Exports**: Usar named exports. Solo usar `export default` en archivos requeridos por Next.js (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, etc.)

  ```tsx
  // ✅ Preferido - Named exports
  export function MiComponente() {}

  // ✅ Solo en archivos de Next.js (page.tsx, layout.tsx, etc.)
  export default function Page() {}

  // ❌ Evitar - Arrow functions y default exports innecesarios
  const MiComponente = () => {}
  export default MiComponente
  ```

### Importaciones

- Usar alias `@/` para imports desde `src/`
- Importar tipos desde `@/payload-types` (generados automáticamente)

### UI/UX

- **Siempre usar componentes de DaisyUI** para diseño (botones, cards, badges, etc.)
- **Iconos**: Usar siempre `@tabler/icons-react` para iconos, nunca SVG directos
- Usar Tailwind solo para layout (flex, grid, spacing)
- Mantener diseño responsivo y accesible
- **Clases dinámicas Tailwind**: Siempre usar `twJoin` o `twMerge` de la librería `tailwind-merge` para componer clases dinámicas. Está prohibido usar string templates (\`${}\`) para clases de Tailwind.

  ```tsx
  // ✅ Preferido - twJoin para concatenar clases condicionales
  import { twJoin } from 'tailwind-merge'

  <div className={twJoin(
    'base-class',
    isActive && 'active-class',
    isDisabled && 'disabled-class'
  )}>

  // ✅ Preferido - twMerge para resolver conflictos de clases
  import { twMerge } from 'tailwind-merge'

  <div className={twMerge('p-4 bg-red-500', customClasses)}>

  // ❌ Evitar - String templates
  <div className={\`base-class ${isActive ? 'active-class' : ''}\`}>
  ```

### Optimización de React

- **NO usar useMemo ni useCallback**: El compilador de React se encarga automáticamente de las optimizaciones de memoización
- **Código directo**: Escribir funciones y cálculos de forma directa sin wrappers de optimización
- **Confiar en el compilador**: React Compiler optimiza automáticamente el código para evitar re-renders innecesarios

  ```tsx
  // ✅ Preferido - El compilador optimiza automáticamente
  const datoComputado = calcularDato()

  const handleClick = () => {
    // lógica
  }

  // ❌ Evitar - Ya no es necesario
  const datoComputado = useMemo(() => calcularDato(), [])
  const handleClick = useCallback(() => {}, [])
  ```

### Internacionalización (i18n)

- **Idioma**: Todos los textos visibles en pantalla deben estar en español
- Evitar textos hardcodeados en inglés en la UI

### Payload CMS

- Usar `basePayload` de `@/web/payload` para Local API
- Los tipos se generan automáticamente en `src/payload-types.ts`
- **Hooks comunes**:
  - `beforeChange` - Validar/modificar datos antes de guardar
  - `afterChange` - Ejecutar lógica después de guardar
  - `beforeValidate` - Validaciones custom
  - `afterRead` - Transformar datos al leer
- **Operaciones CRUD**:

  ```tsx
  // Create
  await basePayload.create({
    collection: 'players',
    data: { name: 'Juan', number: 10 },
  })

  // Read
  const players = await basePayload.find({
    collection: 'players',
    where: { team: { equals: teamId } },
  })

  // Update
  await basePayload.update({
    collection: 'players',
    id: playerId,
    data: { number: 11 },
  })

  // Delete
  await basePayload.delete({
    collection: 'players',
    id: playerId,
  })
  ```

## Los 3 Mandamientos

Se deben cumplir absolutamente siempre:

1. **Siempre respetar principios SOLID**
2. **DRY** (Don't Repeat Yourself)
3. **KISS** (Keep It Simple, Stupid)

## Notas para Agentes

1. **No crear archivos innecesarios**: Solo crear lo estrictamente necesario
2. **KISS (Keep It Simple)**: Preferir soluciones simples y directas
3. **DaisyUI primero**: No inventar componentes custom cuando DaisyUI tiene la solución
4. **Validar tipos**: Siempre verificar que los tipos coincidan con `payload-types.ts`
5. **Hooks de Payload**: Usar `beforeChange`, `afterChange` para lógica de negocio
6. **No adivinar**: Si falta información, preguntar antes de implementar

## 🚨 SEGURIDAD Y DOCUMENTACIÓN - MUY IMPORTANTE

**ESTE ES UN PROYECTO PÚBLICO DE LA MUNICIPALIDAD DE SAN BENITO**

### Reglas estrictas:

1. **NO crear archivos .md innecesarios** (solo README si es absolutamente necesario)
2. **NO agregar comentarios excesivos** en el código
3. **NO documentar información sensible** del sistema
4. **NO incluir detalles de implementación** que puedan exponer vulnerabilidades
5. **NO crear archivos de migración, changelog o documentación técnica detallada**
6. **Comentarios mínimos e indispensables** solamente

### Razones:

- El repositorio es PÚBLICO
- Documentación excesiva puede filtrar información sensible
- Los comentarios innecesarios pueden exponer vulnerabilidades
- Mantener el código limpio y profesional

### Qué SI hacer:

- Código limpio y autoexplicativo
- Nombres de variables/funciones descriptivos
- Tipos de TypeScript claros
- Comentarios solo para lógica compleja no obvia

### Qué NO hacer:

- ❌ Archivos MIGRACION.md, CHANGELOG.md, etc.
- ❌ Comentarios que explican cada línea
- ❌ Documentación de arquitectura detallada
- ❌ Información sobre seguridad o validaciones

## Contexto del Proyecto

Este sistema permite a la Municipalidad de San Benito gestionar exámenes teóricos para licencias de conducir. Los ciudadanos ingresan su DNI, se les asigna un examen con consignas aleatorias según la categoría solicitada, y completan el test. Los administradores gestionan consignas, ciudadanos y exámenes desde el admin de Payload CMS.

### Arquitectura

#### 🎯 Regla de Oro: Client Components por Defecto

**MUY IMPORTANTE**: A diferencia de la convención estándar de Next.js, en este proyecto se debe priorizar el uso de **Client Components** (`'use client'`) por defecto.

- **✅ Client Components**: Usar por defecto para toda la UI interactiva
- **⚠️ Server Components**: SOLO usar en estos casos específicos:
  - Cuando se necesite acceder a `basePayload` de `@/web/libs/payload.ts`
  - Para consultas directas a la base de datos MongoDB vía Payload CMS
  - Para operaciones de lectura que no requieran interactividad

#### 🔄 Server Actions para Mutaciones

**Cuando se necesite modificar datos de Payload** (crear, actualizar o borrar), se DEBE usar Server Actions que:

1. **Retornen obligatoriamente** el tipo `Res<T>` definido en `@/types`:

   ```tsx
   export type Res<T> = ResOK<T> | ResNOK
   ```

2. **Ejemplo de Server Action**:

   ```tsx
   'use server'
   import { basePayload } from '@/web/libs/payload'
   import type { Res } from '@/types'

   export async function createPlayer(data: PlayerData): Promise<Res<Player>> {
     try {
       const player = await basePayload.create({
         collection: 'players',
         data,
       })
       return {
         ok: true,
         message: 'Jugador creado exitosamente',
         data: player,
       }
     } catch (error) {
       return {
         ok: false,
         message: error.message || 'Error al crear jugador',
         data: null,
       }
     }
   }
   ```

3. **Llamar desde Client Components**:

   ```tsx
   'use client'
   import { createPlayer } from './actions'

   export function PlayerForm() {
     const handleSubmit = async (data: PlayerData) => {
       const result = await createPlayer(data)
       if (result.ok) {
         // Éxito: result.data contiene el jugador
       } else {
         // Error: result.message contiene el error
       }
     }
     // ...
   }
   ```

#### Otras Convenciones

11. **Named exports**: Usar named exports excepto en archivos de Next.js
12. **Organización**: Seguir la estructura de carpetas establecida (`components/`, `hooks/`, `lib/`, etc.)

## 🗄️ Estructura de Base de Datos (MongoDB + Payload CMS)

### Collections Implementadas

El sistema utiliza las siguientes collections de Payload CMS:

#### Gestión de Trámites

- `ciudadano` - Datos del ciudadano (DNI, nombre, apellido, email, fecha nacimiento)
- `tramite` - Cabecera del expediente, vincula ciudadano con sus procesos
- `tramite-proceso` - Asocia un trámite con un proceso del `ProcesosEnum`
- `tramite-progreso` - Checklist vivo que controla el estado de cada etapa
- `turno` - Asignación de turnos por área y fecha/hora
- `emision-licencia` - Registro de emisión final de licencias

#### Exámenes Digitales

- `examen` - Banco de exámenes teóricos
- `pregunta` - Preguntas con enunciado e imagen opcional
- `opcion` - Opciones de respuesta (soporta múltiples correctas)
- `examen-pregunta` - Relación examen-pregunta con orden y puntaje
- `intento-examen` - Registro de sesiones de examen
- `respuesta-seleccionada` - Cada opción marcada para auditoría

#### Sistema

- `usuario` - Usuarios del sistema con autenticación
- `archivo` - Gestión de uploads (imágenes, documentos)

### Configuración Basada en Enums

La configuración del sistema se maneja mediante constantes TypeScript en `src/constants/`:

- `ProcesosEnum` - Tipos de trámites y sus pasos
- `EtapasEnum` - Catálogo de etapas (Papeles, Curso, Teórico, Práctico, Psicofísico)
- `AreasEnum` - Áreas para turnos (Teórico, Práctico, Psicofísico, Curso, Licencias)
- `EstadosTramiteEnum` - Estados del trámite (EN CURSO, CANCELADO, FINALIZADO, SUSPENDIDO)
- `LicenciaClaseXEnum` - Clases de licencia (A1.1, A1.2, B1, B2, C1, D1, etc.)
- `TramitesEnum` - Tipos de trámite (Original, Renovación, Ampliación)

### Notas para Desarrolladores

1. **Validación de Pasos:** Antes de permitir interactuar con un paso (ej: rendir examen), verificar siempre que la etapa anterior esté completada.
2. **Client Components:** Recordar usar `'use client'` por defecto. Solo usar Server Components para acceder a `basePayload`.
3. **Server Actions:** Todas las mutaciones de Payload deben usar Server Actions que retornen `Res<T>`.
