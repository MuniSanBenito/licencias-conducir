# Guía para Agentes de IA

Este documento define las reglas base que todo agente de IA debe seguir al interactuar con este proyecto.

## Contexto del Producto

- **Alcance vigente**: El proyecto se encuentra en etapa de **MVP de turnero de licencias**.
- **Prioridad funcional**: Cualquier implementación nueva debe priorizar flujos de turnos, agenda y atención operativa.
- **Fuera de alcance inmediato**: Módulos de sistema integral de licencias (expedientes completos, gestión documental avanzada y flujos administrativos extendidos), salvo requerimiento explícito.
- **Coherencia documental**: Toda actualización técnica o funcional debe mantenerse alineada con el alcance declarado en `README.md`.

## Arquitectura y Principios

- **SOLID**: Respeta estrictamente los principios SOLID en cada desarrollo.
- **Screaming Architecture**: Estructura los directorios, carpetas y archivos para que reflejen claramente la intención y el dominio del negocio.
- **DRY y KISS**: Escribe código evitando la duplicación ("Don't Repeat Yourself") y manteniendo la simplicidad siempre que sea posible ("Keep It Simple, Stupid").

## Interfaz de Usuario (UI)

- **Diseño Responsivo**: Esta web app **no** será utilizada en dispositivos móviles. Todos los diseños deben ser pensados y optimizados para pantallas de tamaño tablet o superiores.
- **daisyUI**: Utiliza exclusivamente la librería daisyUI para todos los componentes de la interfaz gráfica.
- **Tailwind CSS**: El uso de clases de Tailwind CSS está restringido **únicamente** para estructurar layouts específicos (grillas, alineación, flexbox, etc.). No lo uses para estilizar componentes.
- **Clases Dinámicas**: Para `className`s dinámicos, es **obligatorio** utilizar `twJoin` o en su defecto `twMerge` de la librería `tailwind-merge`. Está estrictamente prohibido usar cualquier otra alternativa.
- **Tablas**: Todas las tablas que se utilicen en el proyecto deben implementarse utilizando la librería `@tanstack/react-table`.
- **Iconos**: Es **obligatorio** utilizar los iconos de la librería `@tabler/icons-react`. Está estrictamente prohibido incluir iconos SVG directamente en el código.
- **HTML Semántico**: Es **obligatorio** utilizar etiquetas semánticas (ej. `main`, `section`, `article`, `header`, `footer`) y evitar al máximo el uso de etiquetas genéricas como `div` o `span`.
- **Accesibilidad (A11y)**: La accesibilidad es fundamental. Todo componente debe cumplir con estándares de accesibilidad, incluyendo el uso correcto de roles ARIA y atributos necesarios.
- **Formularios**: Todos los formularios deben implementarse utilizando la librería `react-hook-form`, **exceptuando** los formularios de login y/o logout.
- **Atomic Design**: Todos los componentes ajenos a Next.js (es decir, componentes reutilizables que no corresponden a páginas ni layouts del framework) deben seguir el modelo de **Atomic Design**. Estos componentes deben ubicarse dentro de la carpeta `src/web/ui/` y organizarse en el subdirectorio que corresponda según su nivel de abstracción: `atoms/`, `molecules/`, `organisms/` o `templates/`.

## Convenciones de Código y Nomenclatura

- **Documentación**: El código debe intentar ser lo más autoexplicativo posible. Si de todas formas es necesario explicar algo complejo de documentar, **debe hacerse obligatoriamente a través de comentarios en el mismo código**.
- **Documentación en Archivos**: Está prohibido crear nuevos archivos de documentación. Si se requiere documentación adicional, debe incorporarse en `README.md` o `AGENTS.md`.
- **Archivos y Carpetas**: Todo archivo y directorio debe estar escrito en `kebab-case`.
- **Constantes**: Todas las constantes deben definirse utilizando `SNAKE_CASE` (todo en mayúsculas).
- **Uso de Funciones**:
  - **Nunca** utilices _arrow functions_ fuera de la definición de los componentes (por ejemplo, para funciones utilitarias o _helpers_ emplea la palabra clave `function`).
  - **Siempre** utiliza _arrow functions_ para todas las funciones declaradas **dentro** de un componente.
