# Guía para Agentes de IA

Este documento contiene información importante para agentes de IA que trabajan en este proyecto.

## Información del Proyecto

**Nombre**: Sistema de Licencias de Conducir - Municipalidad de San Benito  
**Ubicación**: San Benito, Entre Ríos, Argentina  
**Repositorio**: MuniSanBenito/licencias-conducir

## Stack Tecnológico

- **Framework**: Next.js 15 (App Router)
- **CMS**: Payload CMS 3.x
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

- **useMemo para datos**: Usar `useMemo` para definir datos computados
- **useCallback para funciones**: Usar `useCallback` para definir funciones
- **Dependencias vacías**: Mantener siempre el arreglo de dependencias vacío `[]` inicialmente, para verificar en pruebas qué dependencias son realmente necesarias

  ```tsx
  // ✅ Preferido
  const datoComputado = useMemo(() => {
    return calcularDato()
  }, [])

  const handleClick = useCallback(() => {
    // lógica
  }, [])
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

11. **Server vs Client**: Server components por defecto, `'use client'` solo cuando sea necesario
12. **Named exports**: Usar named exports excepto en archivos de Next.js
13. **Organización**: Seguir la estructura de carpetas establecida (`components/`, `hooks/`, `lib/`, etc.)
