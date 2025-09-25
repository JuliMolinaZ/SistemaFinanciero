#!/bin/bash

# ==================================================
# SCRIPT DE DESPLIEGUE AUTOMÁTICO - SIGMA
# Resuelve todos los problemas de producción
# ==================================================

echo "🚀 Iniciando despliegue en producción..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para mostrar errores
error_exit() {
    echo -e "${RED}❌ ERROR: $1${NC}" >&2
    exit 1
}

# Función para mostrar éxito
success_msg() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Función para mostrar advertencias
warning_msg() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "server.js" ]; then
    error_exit "No se encontró server.js. Ejecuta este script desde el directorio Backend"
fi

echo "📍 Directorio de trabajo: $(pwd)"

# 1. Actualizar dependencias si es necesario
echo "📦 Verificando dependencias..."
if [ -f "package.json" ]; then
    npm install --production
    success_msg "Dependencias actualizadas"
fi

# 2. Regenerar cliente Prisma (FIX CRÍTICO)
echo "🔄 Regenerando cliente Prisma..."
if command -v npx >/dev/null 2>&1; then
    npx prisma db pull || warning_msg "No se pudo actualizar el schema desde la DB"
    npx prisma generate || error_exit "No se pudo generar el cliente Prisma"
    success_msg "Cliente Prisma regenerado exitosamente"
else
    error_exit "npx no está disponible. Instala Node.js y npm"
fi

# 3. Verificar variables de entorno críticas
echo "🔐 Verificando variables de entorno..."

if [ ! -f ".env" ]; then
    warning_msg "Archivo .env no encontrado. Creando uno básico..."
    cat > .env << EOF
# Variables de entorno para producción
NODE_ENV=production
PORT=8765

# Base de datos
DATABASE_URL="mysql://user:password@localhost:3306/database_name"

# Firebase (REQUERIDO)
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----"

# JWT
JWT_SECRET=your-jwt-secret-here
JWT_EXPIRES_IN=24h
EOF
    warning_msg "Archivo .env creado. DEBES configurar las variables de Firebase manualmente"
fi

# Verificar variables críticas
source .env 2>/dev/null || true

if [ -z "$FIREBASE_PROJECT_ID" ] || [ "$FIREBASE_PROJECT_ID" = "your-firebase-project-id" ]; then
    warning_msg "FIREBASE_PROJECT_ID no está configurado correctamente"
    echo "Por favor, edita el archivo .env y configura:"
    echo "- FIREBASE_PROJECT_ID"
    echo "- FIREBASE_CLIENT_EMAIL"
    echo "- FIREBASE_PRIVATE_KEY"
fi

# 4. Compilar frontend si existe
if [ -d "../Frontend" ]; then
    echo "🏗️  Compilando frontend..."
    cd ../Frontend
    if [ -f "package.json" ]; then
        npm install --production
        npm run build || warning_msg "No se pudo compilar el frontend"
        success_msg "Frontend compilado"
    fi
    cd ../Backend
fi

# 5. Detener proceso PM2 existente
echo "🔄 Gestionando proceso PM2..."
if command -v pm2 >/dev/null 2>&1; then
    pm2 delete sigma 2>/dev/null || true
    success_msg "Proceso anterior detenido"
else
    warning_msg "PM2 no está instalado. Instalando..."
    npm install -g pm2
fi

# 6. Iniciar nueva instancia
echo "🚀 Iniciando aplicación..."
pm2 start server.js --name sigma --log-date-format="YYYY-MM-DD HH:mm:ss Z" || error_exit "No se pudo iniciar la aplicación"

# 7. Verificar que esté funcionando
echo "🔍 Verificando estado..."
sleep 3
pm2 status sigma

# 8. Mostrar logs recientes
echo "📋 Logs recientes:"
pm2 logs sigma --lines 10 --nostream

# 9. Test de funcionamiento básico
echo "🧪 Probando endpoints críticos..."
if command -v curl >/dev/null 2>&1; then
    sleep 5

    # Test endpoint básico
    response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8765/api/usuarios || echo "000")
    if [ "$response" = "200" ]; then
        success_msg "API funcionando correctamente (HTTP $response)"
    else
        warning_msg "API no responde correctamente (HTTP $response)"
        echo "Revisa los logs con: pm2 logs sigma"
    fi
else
    warning_msg "curl no disponible, no se puede hacer test automático"
fi

# 10. Guardar configuración PM2
pm2 save
pm2 startup || warning_msg "No se pudo configurar auto-inicio de PM2"

echo ""
echo "🎉 ¡Despliegue completado!"
echo ""
echo "📊 Para monitorear la aplicación:"
echo "   pm2 status"
echo "   pm2 logs sigma"
echo "   pm2 monit"
echo ""
echo "🔄 Para reiniciar:"
echo "   pm2 restart sigma"
echo ""
echo "🛑 Para detener:"
echo "   pm2 stop sigma"
echo ""

if [ -z "$FIREBASE_PROJECT_ID" ] || [ "$FIREBASE_PROJECT_ID" = "your-firebase-project-id" ]; then
    echo -e "${YELLOW}⚠️  ACCIÓN REQUERIDA:${NC}"
    echo "   1. Edita el archivo .env con las credenciales de Firebase correctas"
    echo "   2. Ejecuta: pm2 restart sigma"
    echo ""
fi

success_msg "Script de despliegue finalizado"