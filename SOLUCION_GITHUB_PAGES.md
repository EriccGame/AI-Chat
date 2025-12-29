# 🔧 Solución DEFINITIVA para Errores de GitHub Pages

## ❌ **Problema Identificado**:
Los archivos se están buscando en la raíz (`https://ericcgame.github.io/`) en lugar de en la subcarpeta del repositorio (`https://ericcgame.github.io/AI-Chat/`).

```
❌ Buscando en: https://ericcgame.github.io/coi-serviceworker.js
✅ Debería ser: https://ericcgame.github.io/AI-Chat/coi-serviceworker.js
```

## 🚨 **SOLUCIÓN INMEDIATA - Usar Script Automático**:

### **Opción 1: Script Automático (RECOMENDADO)**
```bash
cd ai-chat

# Hacer ejecutable el script
chmod +x deploy.sh

# Ejecutar deploy automático
./deploy.sh
```

### **Opción 2: Comandos Manuales**
```bash
cd ai-chat

# 1. Limpiar completamente
rm -rf dist
rm -rf node_modules/.vite

# 2. Verificar que coi-serviceworker.js existe
ls public/coi-serviceworker.js  # DEBE existir

# 3. Build limpio
npm run build

# 4. Verificar que dist/coi-serviceworker.js existe
ls dist/coi-serviceworker.js  # DEBE existir después del build

# 5. Deploy forzado
npm run deploy-force
```

### 3. **Verificar configuración de GitHub Pages**
- Ve a tu repositorio en GitHub
- Settings → Pages
- Source: **Deploy from a branch**
- Branch: **gh-pages** / **/ (root)**
- Save

### 4. **Esperar propagación**
- GitHub Pages puede tardar 5-10 minutos en actualizar
- Verifica en: `https://ericcgame.github.io/AI-Chat/`

## 🔍 Verificación:

### Archivos que DEBEN existir después del build:
```
dist/
├── index.html                    # ✅ HTML principal
├── coi-serviceworker.js         # ✅ Service worker (CRÍTICO)
├── assets/
│   ├── index-[hash].js          # ✅ JavaScript compilado
│   └── index-[hash].css         # ✅ CSS compilado
└── vite.svg                     # ✅ Favicon
```

### Verificar build local:
```bash
# Después de npm run build, verificar:
ls ai-chat/dist/
ls ai-chat/dist/coi-serviceworker.js  # DEBE existir
```

### Verificar URLs en producción:
- ✅ `https://ericcgame.github.io/AI-Chat/` (página principal)
- ✅ `https://ericcgame.github.io/AI-Chat/coi-serviceworker.js` (service worker)

## 🚨 Si sigue fallando:

### Opción 1: Forzar nuevo deploy
```bash
cd ai-chat
rm -rf dist
rm -rf node_modules/.vite
npm run build
npm run deploy -- --force
```

### Opción 2: Verificar vite.config.js
Asegúrate de que el `base` coincida exactamente con el nombre del repositorio:
```javascript
base: '/AI-Chat/',  // Debe coincidir con el nombre real del repo
```

### Opción 3: Deploy manual
```bash
cd ai-chat
npm run build
cd dist
git init
git add .
git commit -m "Deploy"
git branch -M gh-pages
git remote add origin https://github.com/ericcgame/AI-Chat.git
git push -f origin gh-pages
```

## ✅ Resultado Esperado:
Después de seguir estos pasos, la aplicación debería cargar correctamente en:
`https://ericcgame.github.io/AI-Chat/`

Y deberías ver:
- ✅ Pantalla de inicio del chatbot
- ✅ Sin errores 404 en la consola
- ✅ Botón "Inicializar IA" funcional
