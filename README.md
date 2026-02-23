# Proyecto Landing Page - SeguraB

Landing page moderna y escalable, construida para **SeguraB** utilizando tecnologías de alto rendimiento y una arquitectura modular.

## Cómo ejecutar el proyecto

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Iniciar servidor de desarrollo**:
   ```bash
   npm run dev
   ```
   *Nota: Por defecto corre en `http://localhost:5173/` (o el siguiente puerto libre).*

3. **Construir para producción**:
   ```bash
   npm run build
   ```
   Los archivos optimizados se generan en `dist/`.

## Arquitectura y Estructura

El proyecto ha sido refactorizado para ser **escalable** y permitir la integración sencilla de servicios externos (específicamente un Agente de IA).

### Directorios Clave
- `index.html`: Punto de entrada HTML con estructura semántica y atributos ARIA para accesibilidad.
- `style.css`: Configuración de **Tailwind CSS v4** y estilos personalizados para el chat y componentes.
- `main.js`: Punto de entrada de JavaScript, coordina la inicialización de módulos.
- **`src/modules/`**:
  - `ai-agent.js`: Cliente que maneja la comunicación con el agente de IA (Modos Mock y API).
  - `modal.js`: Gestiona la interfaz del chat, transiciones y renderizado de mensajes.
  - `nav.js`: Controla la navegación, scroll suave y el menú móvil optimizado.

## Integración del Agente de IA

El sistema está diseñado para integrarse con un agente vía API en pocos segundos.

**Para migrar al agente real:**
1. Ve a `src/modules/ai-agent.js`.
2. Cambia `AI_MODE = 'mock'` por `AI_MODE = 'api'`.
3. Define tu endpoint en `AI_API_URL`.

## Tecnologías
- **Vite**: Bundler ultra-rápido.
- **Tailwind CSS v4**: Estilizado moderno y eficiente.
- **Vanilla JS (ES6+)**: Lógica limpia y modular sin dependencias pesadas.
- **HTML5/ARIA**: Accesibilidad y SEO optimizado.

## Licencia
Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.
