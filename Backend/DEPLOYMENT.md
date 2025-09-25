# 🚀 Guía de Despliegue en Producción

## Problemas Identificados en Producción

Los logs de PM2 muestran estos errores:

1. **SystemNotification model not found in Prisma client** - Cliente Prisma desactualizado
2. **FIREBASE_PROJECT_ID no está configurado** - Variables de entorno faltantes

## ⚡ Solución Rápida (Automática)

### Paso 1: Subir archivos al servidor

```bash
# Copiar archivos al servidor de producción
scp deploy.sh root@tu-servidor:/root/SistemaFinanciero/Backend/
scp .env.production.example root@tu-servidor:/root/SistemaFinanciero/Backend/
```

### Paso 2: Ejecutar script de despliegue

```bash
# SSH al servidor
ssh root@tu-servidor

# Navegar al directorio
cd /root/SistemaFinanciero/Backend

# Ejecutar script automático
./deploy.sh
```

## 🔧 Solución Manual (Paso a Paso)

Si prefieres hacerlo manualmente:

### 1. Conectar al servidor

```bash
ssh root@tu-servidor
cd /root/SistemaFinanciero/Backend
```

### 2. Regenerar cliente Prisma

```bash
npx prisma db pull
npx prisma generate
```

### 3. Configurar variables de entorno

```bash
# Copiar archivo ejemplo
cp .env.production.example .env

# Editar con tus credenciales reales
nano .env
```

**Variables críticas que DEBES configurar:**

- `FIREBASE_PROJECT_ID` - ID de tu proyecto Firebase
- `FIREBASE_CLIENT_EMAIL` - Email del service account
- `FIREBASE_PRIVATE_KEY` - Clave privada del service account

### 4. Reiniciar aplicación

```bash
pm2 restart sigma
pm2 logs sigma --lines 20
```

## 🔑 Configuración de Firebase

Para obtener las credenciales de Firebase:

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Selecciona tu proyecto
3. Project Settings → Service accounts
4. Generate new private key
5. Copia los valores al archivo `.env`

## 📊 Monitoreo

```bash
# Ver estado
pm2 status

# Ver logs en tiempo real
pm2 logs sigma

# Ver logs específicos
pm2 logs sigma --lines 50

# Monitor en tiempo real
pm2 monit
```

## 🧪 Verificación

```bash
# Test básico API
curl http://localhost:8765/api/usuarios

# Test notificaciones
curl http://localhost:8765/api/notifications/user/29

# Test proyectos
curl http://localhost:8765/api/management-projects
```

## 🔄 Para futuros despliegues

Simplemente ejecuta:

```bash
cd /root/SistemaFinanciero/Backend
./deploy.sh
```

## ❌ Troubleshooting

### Error: "SystemNotification model not found"
**Solución**: Ejecutar `npx prisma generate`

### Error: "FIREBASE_PROJECT_ID no está configurado"
**Solución**: Configurar variables en `.env`

### Error: "pm2 command not found"
**Solución**: `npm install -g pm2`

### Error: "Cannot connect to database"
**Solución**: Verificar DATABASE_URL en `.env`

---

## 📝 Notas Importantes

- ✅ El script de despliegue maneja automáticamente todos los errores identificados
- ✅ Incluye verificaciones de funcionamiento
- ✅ Configura PM2 para auto-reinicio
- ⚠️ **DEBES** configurar las credenciales de Firebase manualmente

**Contacto**: Si tienes problemas, revisa los logs con `pm2 logs sigma`