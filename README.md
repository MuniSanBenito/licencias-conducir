# Turnero de Licencias de Conducir
## Municipalidad de San Benito

Proyecto enfocado en un **MVP de turnero** para el área de Licencias. El alcance actual prioriza agenda, asignación y seguimiento operativo de turnos.

## Alcance del Producto

- **Incluye en esta etapa**: asignación de turnos, agenda operativa, seguimiento de estados de atención y soporte administrativo interno.
- **No incluye por ahora**: sistema integral completo de licencias, gestión documental avanzada y flujos administrativos extendidos.

## Stack y Arquitectura

- **Framework**: Next.js 15
- **CMS**: Payload CMS 3.0
- **Lenguaje**: TypeScript
- **UI**: daisyUI + Tailwind CSS (solo para layout)
- **Base de datos**: MongoDB
- **Runtime**: Bun

```text
src/
├── app/             # Rutas y layouts (App Router)
├── payload/         # Configuración de Payload y colecciones
├── web/             # Capa de interfaz y componentes
│   └── ui/          # Atomic Design
└── constants/       # Constantes y configuraciones estáticas
```

## Inicio Rápido

1. Instalar dependencias:
   ```bash
   bun install
   ```
2. Configurar `.env` con:
   - `DATABASE_URI`
   - `PAYLOAD_SECRET`
   - `NEXT_PUBLIC_SERVER_URL`
3. Levantar entorno de desarrollo:
   ```bash
   bun dev
   ```

## Convenciones y Reglas

Las reglas técnicas y de contribución obligatorias están en [AGENTS.md](AGENTS.md).

---
© 2026 Municipalidad de San Benito
