#!/bin/bash

# Script de deploy manual para GitHub Pages
# Asegura que todo se configure correctamente

echo "🚀 Iniciando deploy a GitHub Pages..."

# 1. Limpiar builds anteriores
echo "🧹 Limpiando builds anteriores..."
rm -rf dist
rm -rf node_modules/.vite

# 1.5. Verificar que index.html tiene las rutas correctas
echo "🔍 Verificando index.html..."
if grep -q 'src="/src/main.jsx"' index.html; then
    echo "✅ index.html tiene rutas correctas"
else
    echo "❌ Error: index.html tiene rutas incorrectas"
    echo "Debe tener: src=\"/src/main.jsx\" (con barra inicial)"
    exit 1
fi

# 2. Verificar que coi-serviceworker.js existe
if [ ! -f "public/coi-serviceworker.js" ]; then
    echo "❌ Error: coi-serviceworker.js no encontrado en public/"
    echo "Descargando coi-serviceworker.js..."
    curl -o public/coi-serviceworker.js https://github.com/gzuidhof/coi-serviceworker/raw/master/coi-serviceworker.js
fi

# 3. Verificar configuración de vite.config.js
echo "🔍 Verificando configuración..."
if grep -q "base: '/AI-Chat/'" vite.config.js; then
    echo "✅ Base configurado correctamente: /AI-Chat/"
else
    echo "❌ Error: Base no configurado correctamente en vite.config.js"
    exit 1
fi

# 4. Build
echo "🔨 Construyendo aplicación..."
npm run build

# 5. Verificar que los archivos críticos existen en dist
echo "🔍 Verificando archivos en dist..."
if [ ! -f "dist/index.html" ]; then
    echo "❌ Error: dist/index.html no encontrado"
    exit 1
fi

if [ ! -f "dist/coi-serviceworker.js" ]; then
    echo "❌ Error: dist/coi-serviceworker.js no encontrado"
    exit 1
fi

echo "✅ Archivos verificados:"
ls -la dist/

# 6. Deploy a gh-pages
echo "📤 Desplegando a GitHub Pages..."
npx gh-pages -d dist --force

echo "✅ Deploy completado!"
echo "🌐 Tu aplicación estará disponible en:"
echo "   https://ericcgame.github.io/AI-Chat/"
echo ""
echo "⏰ Nota: GitHub Pages puede tardar 5-10 minutos en actualizar"
