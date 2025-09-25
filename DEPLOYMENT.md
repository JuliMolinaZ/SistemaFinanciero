# =€ GUÍA DE DEPLOYMENT - Sistema SIGMA

Esta guía te llevará paso a paso para desplegar el sistema SIGMA en producción.

## =Ë Pre-requisitos

### 1. Servicios Externos
- [ ] **SendGrid Account** - Para email transaccional
- [ ] **Firebase Project** - Para autenticación
- [ ] **MySQL Database** - Base de datos en producción
- [ ] **Dominio configurado** - Con SSL/HTTPS

### 2. Servidor de Producción
- [ ] **Node.js 18+**
- [ ] **PM2** (Process Manager)
- [ ] **Nginx** (Reverse Proxy)
- [ ] **Git** instalado

## =' PASO 1: Configurar SendGrid

### 1.1 Crear cuenta SendGrid
1. Ir a [SendGrid.com](https://sendgrid.com/)
2. Crear cuenta gratuita/de pago
3. Verificar email y completar setup

### 1.2 Generar API Key
1. Dashboard ’ Settings ’ API Keys
2. Crear nueva API Key con permisos **"Full Access"**
3. **COPIAR Y GUARDAR** la API Key (solo se muestra una vez)

### 1.3 Verificar dominio (Opcional pero recomendado)
1. Dashboard ’ Settings ’ Sender Authentication
2. Authenticate Your Domain
3. Configurar DNS records en tu proveedor de dominio

## =% PASO 2: Configurar Firebase

### 2.1 Proyecto existente
Si ya tienes el proyecto `authenticationrun`:
1. Firebase Console ’ Project Settings
2. Service accounts ’ Generate new private key
3. Descargar archivo JSON con credenciales

### 2.2 Configurar para producción
1. Authentication ’ Settings ’ Authorized domains
2. Agregar tu dominio de producción
3. Anotar: Project ID, Client Email, Private Key

## =Ä PASO 3: Base de Datos

### 3.1 Información necesaria
- **Host**: IP o dominio del servidor MySQL
- **Usuario** y **contraseña**
- **Nombre de la base de datos**
- **Puerto** (generalmente 3306)

### 3.2 URL de conexión
Formato: `mysql://usuario:password@host:puerto/database`

## =Á PASO 4: Clonar y configurar

### 4.1 En tu servidor de producción
```bash
# Clonar repositorio
git clone https://github.com/tuusuario/SistemaFinanciero.git
cd SistemaFinanciero

# Configurar Backend
cd Backend
npm install

# Copiar template de configuración
cp .env.example .env
```

### 4.2 Configurar variables de producción
Editar `Backend/.env`:

```env
# =====================================================
# BASE DE DATOS - PRODUCCIÓN
# =====================================================
DATABASE_URL="mysql://TU_USUARIO:TU_PASSWORD@TU_HOST:3306/TU_DATABASE"
DB_HOST=TU_HOST_DB
DB_USER=TU_USUARIO_DB
DB_PASSWORD=TU_PASSWORD_DB
DB_NAME=TU_DATABASE_NAME
DB_PORT=3306

# =====================================================
# SERVIDOR
# =====================================================
NODE_ENV=production
PORT=8765

# =====================================================
# SEGURIDAD - CAMBIAR ESTOS VALORES
# =====================================================
JWT_SECRET=GENERAR_CLAVE_SUPER_SEGURA_UNICA_64_CARACTERES_MINIMO
ENCRYPTION_KEY=GENERAR_OTRA_CLAVE_SUPER_SEGURA_UNICA_32_CARACTERES

# =====================================================
# FIREBASE
# =====================================================
FIREBASE_PROJECT_ID=authenticationrun
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-abcd@authenticationrun.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
TU_CLAVE_PRIVADA_COMPLETA_DE_FIREBASE_AQUI
-----END PRIVATE KEY-----"

# =====================================================
# SENDGRID - EMAIL PRINCIPAL
# =====================================================
SENDGRID_API_KEY=SG.TU_API_KEY_DE_SENDGRID_AQUI
SENDGRID_FROM_EMAIL=noreply@runsolutions-services.com
SENDGRID_FROM_NAME=RunSolutions

# =====================================================
# SMTP - FALLBACK
# =====================================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=it@runsolutions-services.com
SMTP_PASS=TU_APP_PASSWORD_GMAIL

# =====================================================
# GENERAL
# =====================================================
CORS_ORIGIN=https://sigma.runsolutions-services.com
FRONTEND_URL=https://sigma.runsolutions-services.com
EMAIL_FROM=RunSolutions <noreply@runsolutions-services.com>
FORCE_EMAIL_SEND=true
```

## <× PASO 5: Configurar Base de Datos

```bash
cd Backend

# Generar cliente de Prisma
npx prisma generate

# Migrar base de datos (  CUIDADO: esto puede borrar datos)
npx prisma db push

# Verificar conexión
npx prisma db pull
```

## < PASO 6: Configurar Frontend

```bash
cd ../Frontend

# Instalar dependencias
npm install

# Verificar configuración Firebase en src/firebase.js
# Debe apuntar al proyecto 'authenticationrun'

# Construir para producción
npm run build
```

## =€ PASO 7: Iniciar servicios

### 7.1 Instalar PM2
```bash
npm install -g pm2
```

### 7.2 Iniciar Backend
```bash
cd Backend

# Iniciar con PM2
pm2 start server.js --name "sigma-backend"

# Configurar auto-restart en boot
pm2 startup
pm2 save
```

### 7.3 Configurar Nginx

Crear archivo `/etc/nginx/sites-available/sigma`:

```nginx
server {
    listen 80;
    server_name sigma.runsolutions-services.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name sigma.runsolutions-services.com;

    ssl_certificate /path/to/your/cert.pem;
    ssl_certificate_key /path/to/your/key.pem;

    # Frontend estático
    location / {
        root /path/to/SistemaFinanciero/Frontend/build;
        try_files $uri $uri/ /index.html;
    }

    # API Backend
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
    }
}
```

Activar sitio:
```bash
ln -s /etc/nginx/sites-available/sigma /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

##  PASO 8: Verificación

### 8.1 Servicios funcionando
```bash
# Verificar PM2
pm2 status

# Verificar Nginx
systemctl status nginx

# Verificar logs
pm2 logs sigma-backend
```

### 8.2 Pruebas funcionales
1. **Frontend**: https://sigma.runsolutions-services.com
2. **API Health**: https://sigma.runsolutions-services.com/api/health
3. **Login Firebase**: Probar autenticación
4. **Email**: Crear usuario y verificar email de invitación

## = PASO 9: Monitoreo

### 9.1 Logs
```bash
# Ver logs en tiempo real
pm2 logs --lines 200

# Logs de Nginx
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### 9.2 Comandos útiles PM2
```bash
# Restart aplicación
pm2 restart sigma-backend

# Stop/Start
pm2 stop sigma-backend
pm2 start sigma-backend

# Reload (zero-downtime)
pm2 reload sigma-backend

# Monitoring
pm2 monit
```

## =¨ Solución de Problemas

### Backend no inicia
```bash
cd Backend
node server.js
# Ver errores diretos
```

### Emails no se envían
1. Verificar SENDGRID_API_KEY es válida
2. Verificar dominio en SendGrid está verificado
3. Revisar logs: `pm2 logs sigma-backend`

### Errores de base de datos
```bash
# Regenerar Prisma
npx prisma generate
npx prisma db push
```

### Frontend no carga
1. Verificar `npm run build` se completó
2. Verificar ruta en Nginx
3. Verificar permisos de archivos

## = Seguridad Post-Deploy

### Checklist final
- [ ] Firewall configurado (solo 22, 80, 443, 3306 si es necesario)
- [ ] SSL certificados válidos
- [ ] Backups automáticos configurados
- [ ] Monitoring configurado
- [ ] Variables .env con permisos 600
- [ ] Usuario no-root para la aplicación
- [ ] PM2 configurado para auto-restart

## =Þ Soporte

Si necesitas ayuda durante el deployment:
- **Email**: it@runsolutions-services.com
- **Revisar logs**: `pm2 logs sigma-backend`
- **Estado servicios**: `pm2 status` y `systemctl status nginx`

---

**¡Deployment exitoso! <‰**