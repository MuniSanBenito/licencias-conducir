# Turnero de Licencias de Conducir
## Municipalidad de San Benito

Este repositorio contiene el turnero para la gestión de atención del área de licencias de conducir de la Municipalidad de San Benito. El objetivo principal de esta primera etapa es ordenar la demanda, asignar turnos y mejorar la trazabilidad operativa de la atención.

---

### Estado y Alcance del Proyecto

El proyecto originalmente fue concebido como un sistema integral de gestión de licencias.  
Por requerimientos del área de Licencias, el alcance actual se enfoca exclusivamente en un **MVP de turnero**.

La aplicación está orientada a gestionar el circuito de turnos y su operación diaria, con una arquitectura preparada para crecer en fases posteriores.

#### Funcionalidades Principales (MVP Turnero)
*   **Asignación de turnos**: Registro y gestión de turnos para la atención de licencias.
*   **Agenda operativa**: Visualización y seguimiento de disponibilidad por día y franja horaria.
*   **Gestión de atención**: Estado de turnos (pendiente, atendido, reprogramado, cancelado).
*   **Soporte administrativo**: Herramientas para el personal municipal y control de acceso por roles.

### Especificaciones Técnicas

El proyecto está desarrollado utilizando una pila tecnológica moderna y estable:

*   **Framework**: Next.js 15
*   **Gestor de Contenidos (CMS)**: Payload CMS 3.0
*   **Lenguaje**: TypeScript
*   **Interfaz de Usuario**: daisyUI y Tailwind CSS
*   **Base de Datos**: MongoDB
*   **Entorno de Ejecución**: Bun

### Arquitectura y Organización

El sistema sigue los principios de **Screaming Architecture** y **SOLID**, asegurando que la estructura del código refleje el dominio del negocio actual: **Turnero de Licencias**.

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

Todas las contribuciones deben seguir las normativas técnicas definidas en [AGENTS.md](AGENTS.md):
*   Uso estricto de **Atomic Design** en `src/web/ui/`.
*   Implementación de tablas mediante `@tanstack/react-table`.
*   Uso de iconos de `@tabler/icons-react`.
*   Validación de formularios con `react-hook-form`.

### Roadmap de Producto

El objetivo actual es estabilizar y poner en producción el módulo de turnero.  
Los módulos de gestión integral de licencias (expedientes, documentación completa y circuito administrativo extendido) se consideran evolución futura y quedan fuera del alcance inmediato.

---
© 2026 Municipalidad de San Benito.
