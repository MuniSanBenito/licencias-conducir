# Sistema de Gestión de Licencias de Conducir
## Municipalidad de San Benito

Este repositorio contiene el sistema integral para la administración y seguimiento de trámites de licencias de conducir de la Municipalidad de San Benito. El objetivo principal de la plataforma es centralizar la información del padrón de ciudadanos y optimizar los flujos de trabajo administrativos.

---

### Descripción del Proyecto

La aplicación permite la gestión del ciclo de vida completo de un trámite de licencia, desde la solicitud inicial hasta su finalización. Está construida sobre una arquitectura robusta que garantiza la integridad de los datos y la escalabilidad del sistema.

#### Funcionalidades Principales
*   **Administración de Ciudadanos**: Registro y consulta centralizada de datos personales e historial.
*   **Gestión de Trámites**: Control de estados, requisitos y fechas del proceso de licencias.
*   **Gestión Documental**: Almacenamiento y validación de la documentación requerida por normativa.
*   **Seguridad y Auditoría**: Control de acceso basado en roles para el personal municipal.

### Especificaciones Técnicas

El proyecto está desarrollado utilizando una pila tecnológica moderna y estable:

*   **Framework**: Next.js 15
*   **Gestor de Contenidos (CMS)**: Payload CMS 3.0
*   **Lenguaje**: TypeScript
*   **Interfaz de Usuario**: daisyUI y Tailwind CSS
*   **Base de Datos**: MongoDB
*   **Entorno de Ejecución**: Bun

### Arquitectura

El sistema sigue los principios de **Screaming Architecture** y **SOLID**, asegurando que la estructura del código refleje el dominio del negocio (Gestión Municipal).

```text
src/
├── app/             # Rutas y disposición de páginas (App Router)
├── payload/         # Configuración del motor de datos y colecciones
├── web/             # Lógica de interfaz y componentes
│   └── ui/          # Componentes organizados bajo Atomic Design
└── constants/       # Definiciones estáticas y configuraciones
```

### Configuración del Entorno

1.  **Instalación de dependencias**:
    ```bash
    bun install
    ```

2.  **Variables de entorno**:
    Configurar un archivo `.env` con los siguientes parámetros básicos:
    *   `DATABASE_URI`
    *   `PAYLOAD_SECRET`
    *   `NEXT_PUBLIC_SERVER_URL`

3.  **Ejecución en desarrollo**:
    ```bash
    bun dev
    ```

### Estándares de Desarrollo

Todas las contribuciones deben seguir las normativas técnicas definidas en el archivo [AGENTS.md](AGENTS.md):
*   Uso estricto de **Atomic Design** en `src/web/ui/`.
*   Implementación de tablas mediante `@tanstack/react-table`.
*   Uso de iconos de `@tabler/icons-react`.
*   Validación de formularios con `react-hook-form`.

---
© 2026 Municipalidad de San Benito.
