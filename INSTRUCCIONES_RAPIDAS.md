# 🚀 Instrucciones Rápidas - AI Chat Multimodo

## ⚡ Setup Rápido

### 1. Instalar Dependencias
```bash
cd ai-chat
npm install
```

### 2. **CRÍTICO**: Descargar coi-serviceworker.js
```bash
# Opción 1: Con curl
curl -o public/coi-serviceworker.js https://github.com/gzuidhof/coi-serviceworker/raw/master/coi-serviceworker.js

# Opción 2: Descarga manual
# Ir a: https://github.com/gzuidhof/coi-serviceworker/raw/master/coi-serviceworker.js
# Guardar como: public/coi-serviceworker.js
```

### 3. Ejecutar en Desarrollo
```bash
npm run dev
```

## 🌐 Despliegue GitHub Pages

### 1. Configurar Repositorio
En `vite.config.js`, cambiar:
```javascript
base: '/nombre-de-tu-repo/', // ⚠️ CAMBIAR ESTO
```

### 2. Desplegar
```bash
npm run build
npm run deploy
```

### 3. Configurar GitHub
- Repositorio → Settings → Pages
- Source: Deploy from a branch
- Branch: `gh-pages` / `/ (root)`

## 🔧 Archivos Clave

| Archivo | Descripción |
|---------|-------------|
| `src/App.jsx` | Componente principal con toda la lógica |
| `vite.config.js` | Configuración para GitHub Pages |
| `public/coi-serviceworker.js` | **REQUERIDO** para WebGPU |
| `index.html` | Incluye coi-serviceworker |

## 🎯 Modos Disponibles

La aplicación incluye **6 modos predefinidos + modo personalizado**:

| Modo | Icono | Especialidad |
|------|-------|-------------|
| **Maestro Albañil** | 🏗️ | Construcción y albañilería (MODO BASE) |
| **Asistente General** | 🤖 | Ayuda con cualquier tema |
| **Programador** | 💻 | Desarrollo de software |
| **Tutor** | 📚 | Enseñanza y educación |
| **Consultor** | 💼 | Negocios y estrategia |
| **Salud & Bienestar** | 🏥 | Información de salud general |
| **Personalizado** | ⚙️ | Tu propio prompt customizado |

### 🔄 Cambiar Modo
1. Haz clic en **"⚙️ Cambiar Modo"** en el header
2. Selecciona el modo deseado
3. O crea tu propio prompt personalizado
4. La conversación se reinicia con el nuevo modo

## 🎯 Personalización Avanzada

### Agregar Nuevos Modos Predefinidos
En `src/App.jsx`, editar `DEFAULT_PROMPTS`:
```javascript
const DEFAULT_PROMPTS = {
  // ... modos existentes
  tu_modo: `Eres un experto en [TU_ESPECIALIDAD]...`
};
```

### Cambiar Modelo de IA
En `src/App.jsx`, cambiar:
```javascript
const MODEL_ID = 'Llama-3-8B-Instruct-q4f32_1'; // Cambiar por otro modelo
```

## ⚠️ Requisitos Críticos

1. **WebGPU**: Chrome/Edge 113+ con WebGPU habilitado
2. **coi-serviceworker.js**: DEBE estar en `public/`
3. **HTTPS**: Requerido para SharedArrayBuffer
4. **GPU**: Necesaria para ejecutar el modelo

## 🐛 Problemas Comunes

| Error | Solución |
|-------|----------|
| "WebGPU no soportado" | Habilitar en chrome://flags |
| "SharedArrayBuffer no disponible" | Verificar coi-serviceworker.js |
| Modelo no carga | Verificar conexión a internet |
| Deploy falla | Verificar `base` en vite.config.js |

## 📱 Navegadores Soportados

- ✅ Chrome 113+
- ✅ Edge 113+
- ❌ Firefox (en desarrollo)
- ❌ Safari (en desarrollo)

---

**🔥 IMPORTANTE**: Sin `coi-serviceworker.js` la aplicación NO funcionará en GitHub Pages.
