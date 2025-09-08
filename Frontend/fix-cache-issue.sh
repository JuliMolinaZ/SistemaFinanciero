#!/bin/bash

echo "🔧 SOLUCIONANDO PROBLEMA DE CACHE"
echo "=================================="

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encontró package.json. Ejecuta este script desde el directorio Frontend"
    exit 1
fi

echo "🧹 Limpiando builds anteriores..."
rm -rf build/

echo "🔨 Creando build con versión única (cache-busting)..."
npm run build:force

# Verificar que el build se creó correctamente
if [ ! -d "build" ]; then
    echo "❌ Error: El build no se creó correctamente"
    exit 1
fi

# Obtener el hash del nuevo archivo JS
NEW_JS_HASH=$(grep -o "main\.[a-f0-9]*\.js" build/index.html)
echo "📦 Nuevo archivo JS generado: $NEW_JS_HASH"

# Verificar que el build tenga la configuración correcta
if grep -q "http://localhost:8765" build/static/js/main.*.js; then
    echo "✅ Build correcto con configuración local"
elif grep -q "https://sigma.runsolutions-services.com" build/static/js/main.*.js; then
    echo "✅ Build correcto con configuración de producción"
else
    echo "⚠️ Advertencia: No se pudo verificar la configuración de URLs"
fi

echo ""
echo "✅ BUILD CON CACHE-BUSTING CREADO EXITOSAMENTE!"
echo "================================================"
echo "📁 Archivos generados en: $(pwd)/build"
echo "📦 Archivo JS: $NEW_JS_HASH (NUEVO CON VERSIÓN ÚNICA)"
echo ""
echo "📋 PRÓXIMOS PASOS:"
echo "1. Copiar todo el contenido de la carpeta 'build/' a tu servidor web"
echo "2. Reemplazar los archivos existentes en el servidor"
echo "3. Limpiar cache del navegador (Ctrl+F5 o Cmd+Shift+R)"
echo "4. Verificar que el servidor sirva los nuevos archivos estáticos"
echo ""
echo "🔧 Para probar localmente:"
echo "   npx serve -s build -p 3005"
echo ""
echo "🎯 Este build tiene una versión única que forzará al navegador"
echo "   a descargar los archivos nuevos en lugar de usar el cache"
