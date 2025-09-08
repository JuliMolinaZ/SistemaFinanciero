#!/bin/bash

# Script de despliegue para producción
echo "🚀 Iniciando despliegue a producción..."

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encontró package.json. Ejecuta este script desde el directorio Frontend"
    exit 1
fi

# Limpiar builds anteriores
echo "🧹 Limpiando builds anteriores..."
rm -rf build/

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# Crear build de producción
echo "🔨 Creando build de producción..."
npm run build

# Verificar que el build se creó correctamente
if [ ! -d "build" ]; then
    echo "❌ Error: El build no se creó correctamente"
    exit 1
fi

echo "✅ Build de producción creado exitosamente!"
echo "📁 Archivos generados en: $(pwd)/build"
echo "🌐 URL de API configurada: https://sigma.runsolutions-services.com"
echo ""
echo "📋 Próximos pasos:"
echo "1. Copiar los archivos de la carpeta 'build' a tu servidor web"
echo "2. Configurar tu servidor web para servir archivos estáticos desde la carpeta build"
echo "3. Asegurarte de que el backend esté corriendo en https://sigma.runsolutions-services.com"
echo ""
echo "🔧 Para servir localmente (solo para pruebas):"
echo "   npx serve -s build"
