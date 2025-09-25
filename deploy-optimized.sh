#!/bin/bash

# ==================================================
# SCRIPT DE DESPLIEGUE OPTIMIZADO - SIGMA
# Maneja desarrollo local y producción automáticamente
# ==================================================

echo "🚀 INICIANDO DESPLIEGUE OPTIMIZADO SIGMA..."

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

error_exit() { echo -e "${RED}❌ ERROR: $1${NC}" >&2; exit 1; }
success_msg() { echo -e "${GREEN}✅ $1${NC}"; }
warning_msg() { echo -e "${YELLOW}⚠️  $1${NC}"; }
info_msg() { echo -e "${BLUE}ℹ️  $1${NC}"; }

# Determinar entorno basado en ubicación
if [ -d "/root/SistemaFinanciero" ]; then
    ENVIRONMENT="production"
    BASE_DIR="/root/SistemaFinanciero"
    info_msg "Modo: PRODUCCIÓN detectado"
else
    ENVIRONMENT="development"
    BASE_DIR="$(pwd)"
    info_msg "Modo: DESARROLLO detectado"
fi

echo ""
echo "🏗️  CONFIGURACIÓN:"
echo "   Entorno: $ENVIRONMENT"
echo "   Directorio: $BASE_DIR"
echo ""

# PASO 1: BACKEND
info_msg "PASO 1: Configurando Backend..."
cd "$BASE_DIR/Backend" || error_exit "Directorio Backend no encontrado"

# Copiar archivo .env apropiado
if [ "$ENVIRONMENT" = "production" ]; then
    if [ -f ".env.production" ]; then
        cp .env.production .env
        success_msg "Archivo .env de producción copiado"
    else
        warning_msg "Archivo .env.production no encontrado"
    fi
else
    info_msg "Usando .env de desarrollo existente"
fi

# Instalar dependencias
npm install --production
success_msg "Dependencias de Backend instaladas"

# Regenerar Prisma client
npx prisma generate || error_exit "Error generando cliente Prisma"
success_msg "Cliente Prisma regenerado"

# PASO 2: FRONTEND
info_msg "PASO 2: Configurando Frontend..."
cd "$BASE_DIR/Frontend" || error_exit "Directorio Frontend no encontrado"

# Copiar archivo .env apropiado
if [ "$ENVIRONMENT" = "production" ]; then
    if [ -f ".env.production" ]; then
        cp .env.production .env
        success_msg "Archivo .env de producción copiado"
    else
        warning_msg "Archivo .env.production no encontrado"
    fi
else
    info_msg "Usando .env de desarrollo existente"
fi

# Instalar dependencias
npm install
success_msg "Dependencias de Frontend instaladas"

# Compilar para producción si es necesario
if [ "$ENVIRONMENT" = "production" ]; then
    info_msg "Compilando Frontend para producción..."
    npm run build:prod || error_exit "Error compilando Frontend"
    success_msg "Frontend compilado"

    # Copiar build a directorio web
    mkdir -p /var/www/html/sigma
    cp -r build/* /var/www/html/sigma/
    chmod -R 755 /var/www/html/sigma
    success_msg "Frontend desplegado en servidor web"
fi

# PASO 3: CONFIGURACIÓN DEL SERVIDOR (solo producción)
if [ "$ENVIRONMENT" = "production" ]; then
    info_msg "PASO 3: Configurando servidor..."

    # Nginx
    if command -v nginx >/dev/null 2>&1; then
        nginx -t && systemctl reload nginx
        success_msg "Nginx reconfigurado"
    else
        warning_msg "Nginx no encontrado"
    fi

    # PM2
    cd "$BASE_DIR/Backend"
    if command -v pm2 >/dev/null 2>&1; then
        pm2 delete sigma 2>/dev/null || true
        pm2 start server.js --name sigma \
            --log-date-format="YYYY-MM-DD HH:mm:ss Z" \
            --max-memory-restart 500M
        pm2 save
        success_msg "PM2 configurado"
    else
        warning_msg "PM2 no encontrado"
    fi
fi

# PASO 4: VERIFICACIONES
info_msg "PASO 4: Verificaciones finales..."

if [ "$ENVIRONMENT" = "production" ]; then
    sleep 3

    # Test backend
    response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8765/api/usuarios 2>/dev/null || echo "000")
    if [ "$response" = "200" ]; then
        success_msg "Backend funcionando (HTTP $response)"
    else
        warning_msg "Backend no responde correctamente (HTTP $response)"
    fi

    # Test frontend
    response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost 2>/dev/null || echo "000")
    if [ "$response" = "200" ]; then
        success_msg "Frontend funcionando (HTTP $response)"
    else
        warning_msg "Frontend no responde correctamente (HTTP $response)"
    fi

    echo ""
    echo "🌐 Sitio disponible en:"
    echo "   https://sigma.runsolutions-services.com"
    echo ""
    echo "📊 Para monitorear:"
    echo "   pm2 status"
    echo "   pm2 logs sigma"
else
    echo ""
    echo "🧪 Para probar en desarrollo:"
    echo "   Backend: cd Backend && npm start"
    echo "   Frontend: cd Frontend && npm start"
fi

echo ""
if [ "$ENVIRONMENT" = "production" ]; then
    if grep -q "TU_CLAVE_PRIVADA_REAL_AQUI" "$BASE_DIR/Backend/.env" 2>/dev/null; then
        echo -e "${RED}⚠️  ACCIÓN REQUERIDA:${NC}"
        echo "   1. Edita $BASE_DIR/Backend/.env"
        echo "   2. Configura las credenciales reales de Firebase"
        echo "   3. Ejecuta: pm2 restart sigma"
        echo ""
    fi
fi

success_msg "¡Despliegue optimizado completado!"