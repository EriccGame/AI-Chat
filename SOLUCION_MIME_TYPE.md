# 🔧 Solución para Error de MIME Type

## ❌ **Error Actual**:
```
Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/jsx". Strict MIME type checking is enforced for module scripts per HTML spec.
```

## 🔍 **Causa del Problema**:
GitHub Pages está sirviendo el archivo `src/main.jsx` como texto plano (MIME type "text/jsx") en lugar de JavaScript compilado. Esto sucede porque:

1. **GitHub Pages no compila JSX**: Solo sirve archivos estáticos
2. **index.html referencia archivo fuente**: Apunta a `src/main.jsx` en lugar del archivo compilado
3. **Vite debe compilar primero**: El build convierte JSX a JavaScript

## ✅ **Solución Aplicada**:

### 1. **index.html Corregido**:
```html
<!-- ❌ INCORRECTO (causa error MIME type) -->
<script type="module" src="src/main.jsx"></script>

<!-- ✅ CORRECTO (Vite lo reemplaza durante build) -->
<script type="module" src="/src/main.jsx"></script>
```

### 2. **Proceso de Build Correcto**:
```bash
# Durante npm run build, Vite:
# 1. Compila src/main.jsx → assets/index-[hash].js
# 2. Reemplaza la referencia en index.html automáticamente
# 3. Copia archivos de public/ a dist/
```

### 3. **Resultado Final en dist/**:
```html
<!-- index.html después del build -->
<script type="module" crossorigin src="/AI-Chat/assets/index-abc123.js"></script>
```

## 🚀 **Pasos para Resolver**:

### **Opción 1: Script Automático**
```bash
cd ai-chat
chmod +x deploy.sh
./deploy.sh
```

### **Opción 2: Comandos Manuales**
```bash
cd ai-chat

# 1. Verificar que index.html tiene rutas correctas
grep 'src="/src/main.jsx"' index.html  # Debe encontrar la línea

# 2. Build limpio
rm -rf dist node_modules/.vite
npm run build

# 3. Verificar que el build compiló correctamente
ls dist/assets/index-*.js  # Debe existir archivo compilado

# 4. Deploy
npm run deploy-force
```

## 🔍 **Verificación Post-Deploy**:

### **En el navegador**:
1. Abre `https://ericcgame.github.io/AI-Chat/`
2. Abre DevTools → Network
3. Verifica que carga `assets/index-[hash].js` (no `src/main.jsx`)
4. Sin errores de MIME type

### **URLs que DEBEN funcionar**:
- ✅ `https://ericcgame.github.io/AI-Chat/` (página principal)
- ✅ `https://ericcgame.github.io/AI-Chat/coi-serviceworker.js`
- ✅ `https://ericcgame.github.io/AI-Chat/assets/index-[hash].js`

## 🎯 **Por Qué Funciona Ahora**:

1. **Rutas Correctas**: `index.html` tiene `/src/main.jsx` (con barra inicial)
2. **Build Automático**: Vite compila JSX → JavaScript durante `npm run build`
3. **Referencias Actualizadas**: Vite reemplaza automáticamente las rutas en `index.html`
4. **Deploy Limpio**: Script elimina builds anteriores corruptos

## 🚨 **Si Persiste el Error**:

### **Verificar que el build se completó**:
```bash
# Después de npm run build
ls -la dist/
# Debe mostrar:
# - index.html (con rutas actualizadas)
# - assets/index-[hash].js (JavaScript compilado)
# - coi-serviceworker.js
```

### **Verificar contenido de dist/index.html**:
```bash
grep "assets/index" dist/index.html
# Debe mostrar algo como:
# <script type="module" crossorigin src="/AI-Chat/assets/index-abc123.js"></script>
```

Si no ve estas líneas, el build no se completó correctamente.

## ✅ **Resultado Esperado**:
- ✅ Sin errores de MIME type
- ✅ Aplicación carga correctamente
- ✅ Todos los modos de chatbot funcionan
- ✅ WebGPU se inicializa sin problemas
