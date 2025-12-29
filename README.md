# AI Chat Multimodo - Chatbot Local con WebGPU

Una aplicación web de chatbot de IA versátil que funciona 100% en el navegador del cliente utilizando WebGPU y el modelo Llama-3-8B-Instruct. Incluye múltiples modos especializados y la posibilidad de crear prompts personalizados.

## 🏗️ Características

- **IA Local**: Ejecuta completamente en el navegador sin enviar datos a servidores
- **WebGPU**: Utiliza aceleración por GPU para inferencia rápida
- **Múltiples Modos**: 6 especialidades predefinidas + modo personalizado
- **Cambio Dinámico**: Cambia entre modos sin recargar la aplicación
- **Prompts Personalizados**: Crea tu propio asistente especializado
- **Interfaz Moderna**: Chat tipo WhatsApp/ChatGPT con Tailwind CSS
- **GitHub Pages Ready**: Configurado para despliegue en GitHub Pages

## 🚀 Instalación

### Prerrequisitos

- Node.js 18+ 
- npm o yarn
- Navegador compatible con WebGPU (Chrome/Edge reciente)

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <tu-repositorio>
cd ai-chat
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Descargar coi-serviceworker.js**

**IMPORTANTE**: Debes descargar manualmente el archivo `coi-serviceworker.js` para habilitar los headers COOP/COEP necesarios para SharedArrayBuffer:

```bash
# Crear carpeta public si no existe
mkdir -p public

# Descargar coi-serviceworker.js
curl -o public/coi-serviceworker.js https://github.com/gzuidhof/coi-serviceworker/raw/master/coi-serviceworker.js
```

O descarga manualmente desde: https://github.com/gzuidhof/coi-serviceworker/raw/master/coi-serviceworker.js y colócalo en `public/coi-serviceworker.js`

4. **Ejecutar en desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📦 Despliegue en GitHub Pages

### Configuración del Repositorio

1. **Actualizar vite.config.js**

Cambia la línea en `vite.config.js`:
```javascript
base: '/ai-chat/', // Cambiar por el nombre real de tu repositorio
```

2. **Instalar gh-pages**
```bash
npm install --save-dev gh-pages
```

3. **Construir y desplegar**
```bash
# Construir la aplicación
npm run build

# Desplegar a GitHub Pages
npm run deploy
```

### Configuración en GitHub

1. Ve a tu repositorio en GitHub
2. Settings → Pages
3. Source: Deploy from a branch
4. Branch: `gh-pages` / `/ (root)`
5. Save

Tu aplicación estará disponible en: `https://tu-usuario.github.io/nombre-repositorio/`

## 🔧 Configuración Técnica

### Estructura del Proyecto

```
ai-chat/
├── public/
│   ├── coi-serviceworker.js    # REQUERIDO para WebGPU
│   └── vite.svg
├── src/
│   ├── App.jsx                 # Componente principal
│   ├── main.jsx               # Punto de entrada
│   └── index.css              # Estilos con Tailwind
├── index.html                 # HTML principal
├── vite.config.js             # Configuración de Vite
├── tailwind.config.js         # Configuración de Tailwind
├── postcss.config.js          # Configuración de PostCSS
└── package.json               # Dependencias y scripts
```

### Dependencias Principales

- **@mlc-ai/web-llm**: Motor de IA para WebGPU
- **React 18**: Framework de UI
- **Tailwind CSS**: Framework de estilos
- **Vite**: Build tool y dev server

### Modelo de IA

- **Modelo**: Llama-3-8B-Instruct-q4f32_1
- **Tamaño**: ~2-3 GB (descarga automática desde HuggingFace)
- **Caché**: Se guarda localmente en el navegador
- **Especialización**: Experto en albañilería y construcción

## 🌐 Compatibilidad de Navegadores

### Navegadores Soportados
- ✅ Chrome 113+ (con WebGPU habilitado)
- ✅ Edge 113+ (con WebGPU habilitado)
- ❌ Firefox (WebGPU en desarrollo)
- ❌ Safari (WebGPU en desarrollo)

### Habilitar WebGPU

Si WebGPU no está habilitado:

1. **Chrome/Edge**: Ve a `chrome://flags`
2. Busca "WebGPU"
3. Habilita "Unsafe WebGPU"
4. Reinicia el navegador

## 🔒 Privacidad y Seguridad

- **100% Local**: Toda la IA se ejecuta en tu navegador
- **Sin Servidores**: No se envían datos a servicios externos
- **Privacidad Total**: Las conversaciones no salen de tu dispositivo
- **HTTPS Requerido**: GitHub Pages proporciona HTTPS automáticamente

## 🛠️ Desarrollo

### Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Construir para producción
npm run preview  # Vista previa de la build
npm run deploy   # Desplegar a GitHub Pages
```

### Personalización

#### Cambiar el Prompt del Sistema
Edita la constante `SYSTEM_PROMPT` en `src/App.jsx` para cambiar la especialización de la IA.

#### Cambiar el Modelo
Modifica `MODEL_ID` en `src/App.jsx` para usar un modelo diferente (debe ser compatible con @mlc-ai/web-llm).

#### Estilos
Los estilos están en `src/index.css` y utilizan Tailwind CSS. Personaliza los colores en `tailwind.config.js`.

## 🐛 Solución de Problemas

### Error: "WebGPU no soportado"
- Usa Chrome o Edge reciente
- Habilita WebGPU en chrome://flags
- Actualiza drivers de GPU

### Error: "SharedArrayBuffer no disponible"
- Verifica que `coi-serviceworker.js` esté en `public/`
- Asegúrate de que se carga antes que otros scripts en `index.html`

### Error de carga del modelo
- Verifica conexión a internet (primera carga)
- Limpia caché del navegador
- Verifica que tienes suficiente espacio en disco

### Problemas de despliegue
- Verifica que el `base` en `vite.config.js` coincida con el nombre del repositorio
- Asegúrate de que GitHub Pages esté configurado correctamente
- Verifica que `coi-serviceworker.js` esté incluido en la build

## 📝 Licencia

MIT License - Ver archivo LICENSE para más detalles.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📞 Soporte

Si tienes problemas:

1. Revisa la sección de solución de problemas
2. Verifica que tu navegador soporte WebGPU
3. Abre un issue en GitHub con detalles del error

---

**Nota**: Esta aplicación requiere una GPU compatible y navegador con soporte WebGPU. La primera carga descarga ~2-3 GB del modelo de IA.
