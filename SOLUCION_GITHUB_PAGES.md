# 🔧 Solución para Errores de GitHub Pages

## ❌ Errores que estás viendo:
```
GET https://ericcgame.github.io/coi-serviceworker.js net::ERR_ABORTED 404 (Not Found)
GET https://ericcgame.github.io/src/main.jsx net::ERR_ABORTED 404 (Not Found)
GET https://ericcgame.github.io/vite.svg 404 (Not Found)
```

## ✅ Solución Paso a Paso:

### 1. **Verificar que coi-serviceworker.js existe**
```bash
# Verificar que el archivo existe
ls ai-chat/public/coi-serviceworker.js
```

Si no existe, descárgalo:
```bash
curl -o ai-chat/public/coi-serviceworker.js https://github.com/gzuidhof/coi-serviceworker/raw/master/coi-serviceworker.js
```

### 2. **Hacer un nuevo build y deploy**
```bash
cd ai-chat

# Limpiar build anterior
rm -rf dist

# Nuevo build con el archivo coi-serviceworker.js incluido
npm run build

# Deploy a GitHub Pages
npm run deploy
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
