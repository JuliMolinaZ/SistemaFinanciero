#!/bin/bash

echo "🚀 DESPLIEGUE A PRODUCCIÓN - SIGMA"
echo "=================================="

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encontró package.json. Ejecuta este script desde el directorio Frontend"
    exit 1
fi

echo "🔍 Verificando conexión al servidor de producción..."
if curl -s -I https://sigma.runsolutions-services.com > /dev/null; then
    echo "✅ Servidor de producción accesible"
else
    echo "❌ Error: No se puede conectar al servidor de producción"
    exit 1
fi

echo "🧹 Limpiando builds anteriores..."
rm -rf build/

echo "🔨 Creando build de producción..."
npm run build:prod

# Verificar que el build se creó correctamente
if [ ! -d "build" ]; then
    echo "❌ Error: El build no se creó correctamente"
    exit 1
fi

# Obtener el hash del nuevo archivo JS
NEW_JS_HASH=$(grep -o "main\.[a-f0-9]*\.js" build/index.html)
echo "📦 Nuevo archivo JS generado: $NEW_JS_HASH"

# Verificar que el build tenga la configuración correcta
if grep -q "sigma.runsolutions-services.com" build/static/js/main.*.js; then
    echo "✅ Build configurado correctamente para producción"
else
    echo "❌ Error: El build no tiene la configuración de producción correcta"
    exit 1
fi

echo ""
echo "🎯 BUILD DE PRODUCCIÓN LISTO"
echo "============================"
echo "📁 Directorio: build/"
echo "📦 Archivo JS: $NEW_JS_HASH"
echo "🌐 URL de producción: https://sigma.runsolutions-services.com"
echo ""
echo "📋 INSTRUCCIONES DE DESPLIEGUE:"
echo "1. Copia todo el contenido de la carpeta 'build/' al servidor de producción"
echo "2. Asegúrate de que el servidor web (nginx) esté configurado para servir desde esa ubicación"
echo "3. Verifica que el backend esté funcionando en el servidor de producción"
echo ""
echo "🔧 Para copiar al servidor:"
echo "   scp -r build/* usuario@servidor:/ruta/del/servidor/web/"
echo ""
echo "✅ ¡Despliegue completado exitosamente!"
