#!/bin/bash

echo "🚀 DESPLIEGUE A PRODUCCIÓN - SIGMA"
echo "=================================="

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encontró package.json. Ejecuta este script desde el directorio Frontend"
    exit 1
fi

# Verificar que el backend esté corriendo
echo "🔍 Verificando backend..."
if curl -s https://sigma.runsolutions-services.com/api/usuarios > /dev/null; then
    echo "✅ Backend funcionando correctamente"
else
    echo "❌ Error: Backend no responde. Verifica que esté corriendo."
    exit 1
fi

# Limpiar builds anteriores
echo "🧹 Limpiando builds anteriores..."
rm -rf build/

# Crear build de producción
echo "🔨 Creando build de producción..."
npm run build:prod

# Verificar que el build se creó correctamente
if [ ! -d "build" ]; then
    echo "❌ Error: El build no se creó correctamente"
    exit 1
fi

# Verificar que el nuevo JS está en el build
if grep -q "main.280475ec.js" build/index.html; then
    echo "✅ Build correcto con configuración de producción"
else
    echo "❌ Error: El build no tiene la configuración correcta"
    exit 1
fi

echo ""
echo "✅ BUILD DE PRODUCCIÓN CREADO EXITOSAMENTE!"
echo "============================================="
echo "📁 Archivos generados en: $(pwd)/build"
echo "🌐 URL de API configurada: https://sigma.runsolutions-services.com"
echo "📦 Archivo JS: main.280475ec.js (NUEVO)"
echo ""
echo "📋 PRÓXIMOS PASOS PARA DESPLEGAR:"
echo "1. Copiar todo el contenido de la carpeta 'build/' a tu servidor web"
echo "2. Reemplazar los archivos existentes en el servidor"
echo "3. Verificar que el servidor sirva los nuevos archivos estáticos"
echo ""
echo "🔧 Para probar localmente:"
echo "   npx serve -s build"
echo ""
echo "🎯 El problema era que estabas viendo un build VIEJO (main.ab120072.js)"
echo "   Ahora tienes el build CORRECTO (main.280475ec.js) con las URLs arregladas"
