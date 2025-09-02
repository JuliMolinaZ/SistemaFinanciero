# 🗄️ CONFIGURACIÓN DE BASE DE DATOS - SISTEMA FINANCIERO

## 📋 RESUMEN

Este documento explica cómo configurar y cambiar entre diferentes entornos de base de datos en el Sistema Financiero.

## 🔧 CONFIGURACIONES DISPONIBLES

### 1. **CONFIGURACIÓN ACTUAL** (Comentada)
- **Host**: `198.23.62.251:3306`
- **Base de datos**: `runsolutions_runite`
- **Usuario**: `runsolutions_runite`
- **Estado**: Comentada en `.env`

### 2. **CONFIGURACIÓN REMOTA** (Nueva)
- **Host**: Tu servidor remoto (IP)
- **Base de datos**: Tu base de datos
- **Usuario**: Tu usuario de base de datos
- **Estado**: Activa en `.env`

### 3. **CONFIGURACIÓN LOCAL** (Desarrollo)
- **Host**: `localhost:3306`
- **Base de datos**: `sistema_financiero`
- **Usuario**: `root`
- **Estado**: Para desarrollo local

## 🚀 CAMBIAR CONFIGURACIÓN

### **Opción 1: Script Automático (Recomendado)**

```bash
# Ver configuraciones disponibles
npm run db:show

# Cambiar a configuración remota
npm run db:remote

# Cambiar a configuración actual
npm run db:current

# Cambiar a configuración local
npm run db:local

# Cambiar a configuración específica
npm run db:switch [nombre_config]
```

### **Opción 2: Edición Manual**

1. **Editar archivo `.env`**:
```bash
# Comentar configuración actual
# DATABASE_URL="mysql://runsolutions_runite:KuHh4AW1v2QJS3@198.23.62.251:3306/runsolutions_runite"

# Agregar nueva configuración
DATABASE_URL="mysql://tu_usuario:tu_contraseña@tu_ip:3306/tu_base_datos"
```

2. **Variables individuales** (opcional):
```bash
DB_HOST=tu_ip_del_servidor
DB_PORT=3306
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=tu_base_datos
```

## 📝 EJEMPLOS DE CONFIGURACIÓN

### **Ejemplo 1: Servidor en la misma red**
```bash
DATABASE_URL="mysql://admin:mipassword123@192.168.1.100:3306/sistema_financiero"
```

### **Ejemplo 2: Servidor en internet**
```bash
DATABASE_URL="mysql://usuario:contraseña@203.0.113.45:3306/financiero_db"
```

### **Ejemplo 3: Puerto personalizado**
```bash
DATABASE_URL="mysql://admin:password@servidor.com:3307/sistema_financiero"
```

## 🔍 VERIFICAR CONFIGURACIÓN

### **1. Verificar conexión**
```bash
npm run setup:test
```

### **2. Verificar Prisma**
```bash
npm run prisma:generate
npm run prisma:migrate
```

### **3. Verificar variables de entorno**
```bash
node -e "require('dotenv').config(); console.log('DATABASE_URL:', process.env.DATABASE_URL)"
```

## ⚠️ CONSIDERACIONES IMPORTANTES

### **Seguridad**
- ✅ Usar contraseñas fuertes
- ✅ Limitar acceso por IP si es posible
- ✅ Usar usuarios con permisos mínimos necesarios
- ❌ No compartir credenciales en el código

### **Rendimiento**
- ✅ Usar conexiones persistentes
- ✅ Configurar pool de conexiones
- ✅ Monitorear latencia de red

### **Backup**
- ✅ Configurar backups automáticos
- ✅ Probar restauración de backups
- ✅ Mantener múltiples copias

## 🚨 SOLUCIÓN DE PROBLEMAS

### **Error: "ECONNREFUSED"**
```bash
# Verificar que el servidor esté activo
ping tu_ip_del_servidor

# Verificar que MySQL esté corriendo en el puerto correcto
telnet tu_ip_del_servidor 3306
```

### **Error: "Access denied"**
```bash
# Verificar credenciales
mysql -h tu_ip -u tu_usuario -p

# Verificar permisos del usuario
SHOW GRANTS FOR 'tu_usuario'@'%';
```

### **Error: "Database doesn't exist"**
```bash
# Crear la base de datos
CREATE DATABASE tu_base_datos;

# O usar una base de datos existente
```

## 📚 ARCHIVOS RELACIONADOS

- `config.env` - Configuración principal
- `env.example` - Ejemplo de configuración
- `config/database-config.js` - Configuraciones múltiples
- `scripts/switch-database.js` - Script de cambio automático
- `prisma/schema.prisma` - Schema de Prisma

## 🔄 MIGRACIÓN GRADUAL

### **Paso 1: Configurar nueva base de datos**
```bash
npm run db:remote
```

### **Paso 2: Verificar conexión**
```bash
npm run setup:test
```

### **Paso 3: Aplicar migraciones**
```bash
npm run prisma:migrate
```

### **Paso 4: Insertar datos iniciales**
```bash
npm run prisma:seed
```

### **Paso 5: Probar aplicación**
```bash
npm run dev
```

## 💡 CONSEJOS ADICIONALES

1. **Mantener ambas configuraciones** hasta confirmar que todo funciona
2. **Probar en entorno de desarrollo** antes de producción
3. **Documentar cambios** en el equipo
4. **Configurar monitoreo** de la nueva base de datos
5. **Planificar rollback** en caso de problemas

## 🆘 SOPORTE

Si tienes problemas con la configuración:

1. Verificar logs del servidor
2. Probar conexión manual a la base de datos
3. Verificar firewall y configuración de red
4. Revisar permisos de usuario en MySQL
5. Consultar documentación de Prisma

---

**Última actualización**: Diciembre 2024
**Versión**: 1.0.0
