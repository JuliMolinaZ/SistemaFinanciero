# 🚀 INSTALACIÓN DEL SISTEMA DE ROLES COMPLETO

## 📋 RESUMEN EJECUTIVO

Este documento describe la instalación paso a paso del nuevo sistema de roles y permisos para el Sistema Financiero.

## 🎯 OBJETIVOS

- ✅ Implementar sistema de roles jerárquico
- ✅ Sistema de permisos granulares por módulo
- ✅ Auditoría completa de accesos
- ✅ Cache inteligente para performance
- ✅ Middleware de verificación de permisos
- ✅ Migración automática de datos existentes

## 🛠️ ARCHIVOS CREADOS

1. **`sql/roles-system-migration.sql`** - Script de migración de base de datos
2. **`src/controllers/rolController.js`** - Controlador mejorado de roles
3. **`src/middlewares/permissions.js`** - Middleware de verificación de permisos
4. **`src/routes/roles.js`** - Rutas actualizadas con permisos
5. **`test-roles-system.js`** - Script de pruebas del sistema

## 📊 ESTRUCTURA DE BASE DE DATOS

### **Tablas Principales:**
- `roles` - Roles del sistema con jerarquía
- `role_permissions` - Permisos específicos por rol y módulo
- `system_modules` - Módulos del sistema
- `role_config` - Configuraciones específicas por rol
- `audit_logs` - Logs de auditoría mejorados

### **Jerarquía de Roles:**
1. **Administrador** (Nivel 1) - Acceso completo
2. **Contador** (Nivel 2) - Acceso financiero completo
3. **Juan Carlos** (Nivel 2) - Usuario especial
4. **Desarrollador** (Nivel 3) - Acceso técnico
5. **Operador** (Nivel 5) - Acceso básico

## 🚀 PASOS DE INSTALACIÓN

### **PASO 1: BACKUP DE BASE DE DATOS**
```bash
# Crear backup completo antes de proceder
mysqldump -u root -p sistema_financiero > backup_before_roles_$(date +%Y%m%d_%H%M%S).sql
```

### **PASO 2: EJECUTAR MIGRACIÓN**
```bash
# Conectar a MySQL y ejecutar el script
mysql -u root -p sistema_financiero < sql/roles-system-migration.sql
```

### **PASO 3: VERIFICAR INSTALACIÓN**
```bash
# Ejecutar script de pruebas
node test-roles-system.js
```

### **PASO 4: REINICIAR SERVIDOR**
```bash
# Reiniciar el servidor backend
npm start
```

## 🔐 SISTEMA DE PERMISOS

### **Tipos de Permisos:**
- **📖 Leer** - Acceso de solo lectura
- **➕ Crear** - Crear nuevos registros
- **✏️ Actualizar** - Modificar registros existentes
- **🗑️ Eliminar** - Eliminar registros
- **📤 Exportar** - Exportar datos
- **✅ Aprobar** - Aprobar operaciones críticas

### **Módulos del Sistema:**
- `usuarios` - Gestión de usuarios y roles
- `clientes` - Gestión de clientes
- `proyectos` - Gestión de proyectos
- `contabilidad` - Gestión contable
- `costos_fijos` - Costos fijos
- `cotizaciones` - Cotizaciones
- `cuentas_por_cobrar` - Cuentas por cobrar
- `cuentas_por_pagar` - Cuentas por pagar
- `proveedores` - Proveedores
- `categorias` - Categorías
- `fases` - Fases de proyectos
- `recuperacion` - Recuperación de costos
- `flow_recovery_v2` - Flow Recovery V2
- `realtime_graph` - Gráficos en tiempo real
- `emitidas` - Facturas emitidas
- `permisos` - Permisos del sistema
- `dashboard` - Panel principal
- `reportes` - Reportes
- `auditoria` - Logs de auditoría

## 🎮 USO DEL SISTEMA

### **Verificar Permisos de Usuario:**
```javascript
const { checkUserPermission } = require('./middlewares/permissions');

// Verificar si puede crear usuarios
const canCreateUsers = await checkUserPermission(userId, 'usuarios', 'create');

// Verificar si puede leer proyectos
const canReadProjects = await checkUserPermission(userId, 'proyectos', 'read');
```

### **Middleware en Rutas:**
```javascript
const { requirePermission, requireModuleAccess } = require('./middlewares/permissions');

// Ruta que requiere permiso específico
router.post('/usuarios', requirePermission('usuarios', 'create'), createUser);

// Ruta que requiere acceso al módulo
router.get('/proyectos', requireModuleAccess('proyectos'), getProjects);
```

### **Verificar Rol del Usuario:**
```javascript
const { requireRole, requireRoleLevel } = require('./middlewares/permissions');

// Solo administradores
router.delete('/usuarios/:id', requireRoleLevel(1), deleteUser);

// Solo super usuarios o administradores
router.put('/config', requireRoleLevel(2), updateConfig);
```

## 📊 MONITOREO Y AUDITORÍA

### **Logs de Auditoría:**
- Accesos exitosos y denegados
- Cambios en roles y permisos
- Operaciones críticas del sistema
- Intentos de acceso no autorizado

### **Métricas de Performance:**
- Cache hit/miss rates
- Tiempo de respuesta de consultas
- Uso de memoria del cache
- Estadísticas de permisos

## 🔧 CONFIGURACIÓN AVANZADA

### **Configuraciones por Rol:**
```sql
-- Duración de sesión por rol
INSERT INTO role_config (config_key, config_value, description, role_id) VALUES
('max_session_duration', '1440', 'Duración máxima de sesión en minutos', 1),
('max_session_duration', '480', 'Duración máxima de sesión en minutos', 2);
```

### **Sincronización de Permisos:**
```bash
# Endpoint para sincronizar permisos automáticamente
POST /api/roles/admin/sync-permissions
```

## 🧪 PRUEBAS Y VERIFICACIÓN

### **Script de Pruebas:**
```bash
# Ejecutar pruebas completas
node test-roles-system.js
```

### **Verificaciones Manuales:**
1. ✅ Tablas creadas correctamente
2. ✅ Roles migrados con permisos
3. ✅ Usuarios asignados a roles
4. ✅ Middleware funcionando
5. ✅ Cache operativo
6. ✅ Logs de auditoría funcionando

## 🚨 TROUBLESHOOTING

### **Problemas Comunes:**

#### **Error: "Table doesn't exist"**
```bash
# Verificar que las tablas se crearon
mysql -u root -p -e "USE sistema_financiero; SHOW TABLES;"
```

#### **Error: "Foreign key constraint fails"**
```bash
# Verificar integridad referencial
mysql -u root -p -e "USE sistema_financiero; SELECT * FROM users WHERE role_id IS NULL;"
```

#### **Error: "Permission denied"**
```bash
# Verificar que el usuario tiene permisos en MySQL
mysql -u root -p -e "SHOW GRANTS FOR 'usuario'@'localhost';"
```

### **Solución de Errores:**
1. **Revisar logs del servidor**
2. **Verificar conexión a base de datos**
3. **Ejecutar script de pruebas**
4. **Revisar permisos de usuario**
5. **Verificar estructura de tablas**

## 📈 MANTENIMIENTO

### **Tareas Periódicas:**
- **Diario**: Revisar logs de auditoría
- **Semanal**: Verificar performance del cache
- **Mensual**: Revisar estadísticas de permisos
- **Trimestral**: Auditoría de roles y permisos

### **Optimizaciones:**
- Ajustar duración del cache según uso
- Limpiar logs antiguos de auditoría
- Optimizar consultas de permisos
- Monitorear uso de memoria

## 🎉 BENEFICIOS IMPLEMENTADOS

1. **🔒 Seguridad**: Control granular de accesos
2. **📊 Auditoría**: Trazabilidad completa de operaciones
3. **⚡ Performance**: Cache inteligente para consultas frecuentes
4. **🔄 Flexibilidad**: Sistema de roles escalable
5. **📱 Usabilidad**: Middleware fácil de implementar
6. **🛡️ Robustez**: Validaciones y transacciones seguras

## 📞 SOPORTE

### **En caso de problemas:**
1. Revisar este documento
2. Ejecutar script de pruebas
3. Verificar logs del servidor
4. Revisar estructura de base de datos
5. Contactar al equipo de desarrollo

---

**¡El sistema de roles está listo para usar! 🎉**
