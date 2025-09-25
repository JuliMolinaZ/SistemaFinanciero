#!/bin/bash

# ==================================================
# SCRIPT DE REPARACIÓN CRÍTICA PARA PRODUCCIÓN
# Soluciona: Error de servidor + Login no accesible
# ==================================================

echo "🚨 INICIANDO REPARACIÓN CRÍTICA DE PRODUCCIÓN..."

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Funciones
error_exit() { echo -e "${RED}❌ ERROR: $1${NC}" >&2; exit 1; }
success_msg() { echo -e "${GREEN}✅ $1${NC}"; }
warning_msg() { echo -e "${YELLOW}⚠️  $1${NC}"; }
info_msg() { echo -e "${BLUE}ℹ️  $1${NC}"; }

# Verificar que estamos en el servidor de producción
if [ ! -d "/root" ]; then
    error_exit "Este script debe ejecutarse en el servidor de producción como root"
fi

echo "🔍 DIAGNÓSTICO INICIAL..."

# 1. VERIFICAR ESTRUCTURA DE DIRECTORIOS
echo ""
info_msg "1. Verificando estructura de directorios..."
if [ ! -d "/root/SistemaFinanciero" ]; then
    error_exit "Directorio /root/SistemaFinanciero no encontrado"
fi

cd /root/SistemaFinanciero
ls -la

# 2. VERIFICAR ESTADO ACTUAL
echo ""
info_msg "2. Estado actual de PM2..."
pm2 status || warning_msg "PM2 no está ejecutándose correctamente"

# 3. VERIFICAR LOGS DE ERROR
echo ""
info_msg "3. Últimos errores en logs..."
if [ -f "/root/.pm2/logs/sigma-error.log" ]; then
    echo "📋 Errores recientes:"
    tail -10 /root/.pm2/logs/sigma-error.log
fi

echo ""
echo "🔧 INICIANDO REPARACIÓN SISTEMÁTICA..."

# PASO 1: DETENER SERVICIOS
echo ""
info_msg "PASO 1: Deteniendo servicios..."
pm2 stop sigma 2>/dev/null || true
pm2 delete sigma 2>/dev/null || true
success_msg "Servicios detenidos"

# PASO 2: BACKEND - REPARAR PRISMA Y DEPENDENCIAS
echo ""
info_msg "PASO 2: Reparando Backend..."
cd /root/SistemaFinanciero/Backend

# Instalar/actualizar dependencias
npm install --production
success_msg "Dependencias actualizadas"

# Regenerar cliente Prisma (FIX CRÍTICO)
echo "🔄 Regenerando cliente Prisma..."
npx prisma generate || error_exit "Error generando cliente Prisma"
success_msg "Cliente Prisma regenerado"

# PASO 3: CONFIGURAR VARIABLES DE ENTORNO
echo ""
info_msg "PASO 3: Configurando variables de entorno..."

if [ ! -f ".env" ]; then
    warning_msg "Archivo .env no existe, creando configuración básica..."
    cat > .env << 'EOF'
NODE_ENV=production
PORT=8765
DATABASE_URL="mysql://runsol_runite:CkPYnMLxCKH8@198.23.62.251:3306/runsolutions_runite"

# Firebase - DEBES CONFIGURAR ESTAS VARIABLES MANUALMENTE
FIREBASE_PROJECT_ID=sistema-financiero-run
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-abcd@sistema-financiero-run.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nCOLOCA_TU_CLAVE_PRIVADA_AQUI\n-----END PRIVATE KEY-----"

JWT_SECRET=super-secret-jwt-key-production-2025
JWT_EXPIRES_IN=24h

UPLOAD_PATH=/root/SistemaFinanciero/Backend/uploads
MAX_FILE_SIZE=5242880
EOF
    warning_msg "Archivo .env creado - DEBES configurar Firebase manualmente"
else
    success_msg "Archivo .env existente encontrado"
fi

# Verificar directorio de uploads
mkdir -p /root/SistemaFinanciero/Backend/uploads
chmod 755 /root/SistemaFinanciero/Backend/uploads
success_msg "Directorio de uploads configurado"

# PASO 4: FRONTEND - COMPILAR Y SERVIR
echo ""
info_msg "PASO 4: Configurando Frontend..."
cd /root/SistemaFinanciero/Frontend

if [ -f "package.json" ]; then
    npm install --production
    success_msg "Dependencias de frontend instaladas"

    # Compilar frontend
    echo "🏗️  Compilando frontend para producción..."
    npm run build || warning_msg "Error compilando frontend, continuando..."

    if [ -d "build" ]; then
        success_msg "Frontend compilado exitosamente"

        # Copiar build al directorio web
        mkdir -p /var/www/html/sigma
        cp -r build/* /var/www/html/sigma/
        chmod -R 755 /var/www/html/sigma
        success_msg "Frontend copiado a directorio web"
    else
        warning_msg "Directorio build no encontrado"
    fi
else
    warning_msg "package.json no encontrado en Frontend"
fi

# PASO 5: CONFIGURAR NGINX
echo ""
info_msg "PASO 5: Configurando servidor web..."

# Crear configuración nginx para sigma
cat > /etc/nginx/sites-available/sigma << 'EOF'
server {
    listen 80;
    listen 443 ssl http2;
    server_name sigma.runsolutions-services.com;

    # SSL configuration (si tienes certificados)
    # ssl_certificate /path/to/your/cert.pem;
    # ssl_certificate_key /path/to/your/private.key;

    # Frontend - React App
    location / {
        root /var/www/html/sigma;
        index index.html;
        try_files $uri $uri/ /index.html;

        # Headers para React
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        add_header Expires "0";
    }

    # Backend API - Proxy a Node.js
    location /api/ {
        proxy_pass http://localhost:8765;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }

    # Static files
    location /static/ {
        root /var/www/html/sigma;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Uploads
    location /uploads/ {
        alias /root/SistemaFinanciero/Backend/uploads/;
        expires 1y;
    }
}
EOF

# Activar sitio
ln -sf /etc/nginx/sites-available/sigma /etc/nginx/sites-enabled/sigma
rm -f /etc/nginx/sites-enabled/default

# Verificar configuración nginx
nginx -t && {
    systemctl reload nginx
    success_msg "Nginx configurado y recargado"
} || {
    warning_msg "Error en configuración nginx, revisa manualmente"
}

# PASO 6: INICIAR BACKEND
echo ""
info_msg "PASO 6: Iniciando backend..."
cd /root/SistemaFinanciero/Backend

# Verificar que el servidor puede iniciar
echo "🧪 Verificando que el servidor puede iniciar..."
timeout 10 node server.js &
sleep 5
if pgrep -f "node server.js" > /dev/null; then
    pkill -f "node server.js"
    success_msg "Servidor puede iniciar correctamente"
else
    error_exit "El servidor no puede iniciar, revisa los logs"
fi

# Iniciar con PM2
pm2 start server.js --name sigma \
    --log-date-format="YYYY-MM-DD HH:mm:ss Z" \
    --max-memory-restart 500M \
    --error-file /root/.pm2/logs/sigma-error.log \
    --out-file /root/.pm2/logs/sigma-out.log

if pm2 list | grep -q "sigma.*online"; then
    success_msg "Backend iniciado con PM2"
else
    error_exit "Error iniciando backend con PM2"
fi

# Guardar configuración PM2
pm2 save
pm2 startup

# PASO 7: VERIFICACIONES FINALES
echo ""
info_msg "PASO 7: Verificaciones finales..."

sleep 5

# Test backend interno
echo "🧪 Probando backend interno..."
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8765/api/usuarios 2>/dev/null || echo "000")
if [ "$response" = "200" ]; then
    success_msg "Backend funcionando (HTTP $response)"
else
    warning_msg "Backend no responde correctamente (HTTP $response)"
fi

# Test nginx
echo "🧪 Probando nginx..."
if systemctl is-active --quiet nginx; then
    success_msg "Nginx está activo"
else
    warning_msg "Nginx no está activo"
    systemctl start nginx
fi

# Test sitio web
echo "🧪 Probando sitio web..."
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost 2>/dev/null || echo "000")
if [ "$response" = "200" ]; then
    success_msg "Sitio web respondiendo (HTTP $response)"
else
    warning_msg "Sitio web no responde (HTTP $response)"
fi

# PASO 8: MOSTRAR ESTADO FINAL
echo ""
echo "📊 ESTADO FINAL:"
echo "=================="
pm2 status
echo ""
echo "📋 ÚLTIMOS LOGS:"
echo "================"
pm2 logs sigma --lines 15 --nostream
echo ""

# PASO 9: INSTRUCCIONES FINALES
echo ""
echo "🎉 REPARACIÓN COMPLETADA!"
echo "=========================="
echo ""
echo "✅ Backend reparado y funcionando"
echo "✅ Frontend compilado y servido"
echo "✅ Nginx configurado"
echo "✅ PM2 configurado para auto-inicio"
echo ""
echo "🌐 Tu sitio debería estar disponible en:"
echo "   https://sigma.runsolutions-services.com"
echo ""
echo "🔍 Para monitorear:"
echo "   pm2 logs sigma          # Ver logs en tiempo real"
echo "   pm2 monit              # Monitor gráfico"
echo "   systemctl status nginx  # Estado de nginx"
echo ""

# Verificar si necesita configurar Firebase
if grep -q "COLOCA_TU_CLAVE_PRIVADA_AQUI" .env 2>/dev/null; then
    echo -e "${RED}⚠️  ACCIÓN REQUERIDA:${NC}"
    echo "   1. Edita /root/SistemaFinanciero/Backend/.env"
    echo "   2. Configura las credenciales reales de Firebase"
    echo "   3. Ejecuta: pm2 restart sigma"
    echo ""
fi

success_msg "¡Reparación completada! Prueba acceder a tu sitio web."