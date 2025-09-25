# 🚨 REPARACIÓN URGENTE - SITIO WEB CAÍDO

## Problema:
- ❌ https://sigma.runsolutions-services.com muestra error de servidor
- ❌ No se puede acceder al login
- ❌ Sitio completamente inaccesible

## 🚀 SOLUCIÓN INMEDIATA (5 minutos)

### Paso 1: Subir el script de reparación
```bash
# Desde tu máquina local, sube el archivo al servidor:
scp fix-production.sh root@tu-servidor-ip:/root/
```

### Paso 2: Ejecutar reparación automática
```bash
# Conectar al servidor
ssh root@tu-servidor-ip

# Ejecutar script de reparación
cd /root
chmod +x fix-production.sh
./fix-production.sh
```

**El script hace AUTOMÁTICAMENTE:**
- ✅ Repara el cliente Prisma (error SystemNotification)
- ✅ Configura variables de entorno
- ✅ Compila el frontend React
- ✅ Configura Nginx para servir frontend + backend
- ✅ Reinicia todos los servicios
- ✅ Verifica que todo funcione

### Paso 3: Configurar Firebase (IMPORTANTE)
```bash
# Después de que el script termine, edita:
nano /root/SistemaFinanciero/Backend/.env

# Cambia estas líneas con tus credenciales reales:
FIREBASE_PROJECT_ID=tu-proyecto-real
FIREBASE_CLIENT_EMAIL=tu-service-account-real@proyecto.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
TU-CLAVE-PRIVADA-REAL-AQUÍ
-----END PRIVATE KEY-----"

# Luego reinicia:
pm2 restart sigma
```

## 🆘 ALTERNATIVA MANUAL (si el script falla)

```bash
# 1. Conectar al servidor
ssh root@tu-servidor-ip

# 2. Parar servicios
pm2 stop all
pm2 delete all

# 3. Regenerar Prisma
cd /root/SistemaFinanciero/Backend
npx prisma generate

# 4. Compilar frontend
cd /root/SistemaFinanciero/Frontend
npm run build

# 5. Configurar nginx
mkdir -p /var/www/html/sigma
cp -r build/* /var/www/html/sigma/

# 6. Crear config nginx
cat > /etc/nginx/sites-available/sigma << 'EOF'
server {
    listen 80;
    server_name sigma.runsolutions-services.com;

    location / {
        root /var/www/html/sigma;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:8765;
        proxy_set_header Host $host;
    }
}
EOF

ln -sf /etc/nginx/sites-available/sigma /etc/nginx/sites-enabled/
systemctl reload nginx

# 7. Iniciar backend
cd /root/SistemaFinanciero/Backend
pm2 start server.js --name sigma
```

## ✅ VERIFICAR QUE FUNCIONA

Después de cualquiera de las opciones:

```bash
# Ver estado
pm2 status
systemctl status nginx

# Ver logs
pm2 logs sigma

# Probar sitio
curl http://localhost
curl http://localhost:8765/api/usuarios
```

## 📞 SI SIGUE FALLANDO

Ejecuta estos comandos y envíame el output:

```bash
pm2 logs sigma --lines 50
systemctl status nginx
ls -la /var/www/html/sigma/
curl -I http://localhost
```

---

## ⚡ RESUMEN EJECUTIVO:

1. **Sube y ejecuta**: `./fix-production.sh`
2. **Configura Firebase**: Edita `.env` con credenciales reales
3. **Reinicia**: `pm2 restart sigma`
4. **Verifica**: https://sigma.runsolutions-services.com

**Tiempo estimado de reparación: 5-10 minutos**