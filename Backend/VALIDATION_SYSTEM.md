# Sistema de Validación y Seguridad - SistemaFinanciero

## 📋 Resumen

Se ha implementado un sistema completo de validación y seguridad para el backend del SistemaFinanciero, incluyendo:

- ✅ Validación de datos con Joi
- ✅ Middleware de seguridad con Helmet
- ✅ Rate limiting
- ✅ Sanitización de inputs
- ✅ Manejo robusto de errores
- ✅ Sistema de logging completo
- ✅ Validación de IDs y paginación

## 🛡️ Middlewares de Seguridad

### 1. Helmet
- Configuración de headers de seguridad
- Content Security Policy (CSP)
- Protección contra ataques XSS

### 2. Rate Limiting
- **API General:** 100 requests por 15 minutos
- **Autenticación:** 5 intentos por 15 minutos
- **Uploads:** 10 archivos por hora

### 3. Sanitización
- Limpieza automática de strings
- Validación de Content-Type
- Límite de tamaño de payload (10MB)

### 4. Validación de Orígenes
- Solo permite solicitudes desde dominios autorizados
- Configuración flexible para desarrollo y producción

## 📝 Esquemas de Validación

### Usuarios
```javascript
{
  firebase_uid: string (requerido, 1-255 chars),
  email: email válido (requerido),
  name: string (2-100 chars, requerido),
  role: enum ['juan carlos', 'administrador', 'usuario', 'defaultRole'],
  avatar: URL válida (opcional)
}
```

### Clientes
```javascript
{
  run_cliente: string (8-20 chars, requerido),
  nombre: string (2-100 chars, requerido),
  rfc: string (10-13 chars, requerido),
  direccion: string (5-255 chars, requerido)
}
```

### Proyectos
```javascript
{
  nombre: string (2-255 chars, requerido),
  cliente_id: number positivo (requerido),
  monto_sin_iva: number positivo con 2 decimales (requerido),
  monto_con_iva: number positivo con 2 decimales (requerido),
  phase_id: number positivo (opcional),
  descripcion: string (max 1000 chars, opcional),
  fecha_inicio: fecha ISO (opcional),
  fecha_fin: fecha ISO (opcional),
  estado: enum ['activo', 'pausado', 'completado', 'cancelado']
}
```

### Cuentas por Pagar
```javascript
{
  concepto: string (2-255 chars, requerido),
  monto_neto: number positivo con 2 decimales (requerido),
  requiere_iva: boolean (requerido),
  categoria: string (2-100 chars, requerido),
  proveedor_id: number positivo (opcional),
  fecha: fecha ISO (requerido),
  pagado: boolean (default: false),
  pagos_parciales: number >= 0 con 2 decimales (default: 0),
  descripcion: string (max 500 chars, opcional),
  numero_factura: string (max 50 chars, opcional)
}
```

### Proveedores
```javascript
{
  nombre: string (2-100 chars, requerido),
  rfc: string (10-13 chars, requerido),
  direccion: string (5-255 chars, requerido),
  telefono: string con formato válido (10-20 chars, opcional),
  email: email válido (opcional),
  contacto: string (max 100 chars, opcional)
}
```

## 🔧 Middlewares de Validación

### 1. validateWithJoi(schema)
Valida el cuerpo de la solicitud contra un esquema Joi específico.

```javascript
router.post('/', validateWithJoi(userSchema.create), controller.createUser);
```

### 2. validateId
Valida que el parámetro ID sea un número entero positivo.

```javascript
router.get('/:id', validateId, controller.getUserById);
```

### 3. validatePagination
Valida parámetros de paginación (page, limit).

```javascript
router.get('/', validatePagination, controller.getAllUsers);
```

## 📊 Sistema de Logging

### Tipos de Logs
- **INFO:** Solicitudes y respuestas
- **ERROR:** Errores de aplicación
- **DATABASE:** Operaciones de base de datos
- **AUTH:** Eventos de autenticación
- **FILE:** Operaciones de archivos
- **PERFORMANCE:** Operaciones lentas (> 1 segundo)

### Estructura del Log
```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "level": "INFO",
  "message": "Request received",
  "method": "POST",
  "url": "/api/users",
  "ip": "192.168.1.1",
  "userAgent": "Mozilla/5.0...",
  "statusCode": 201,
  "duration": "150ms"
}
```

### Limpieza Automática
- Los logs se mantienen por 30 días
- Limpieza automática diaria
- Archivos organizados por fecha

## 🚨 Manejo de Errores

### Tipos de Errores Manejados
1. **Validación Joi:** Errores de esquemas
2. **MySQL:** Errores de base de datos
3. **Archivos:** Errores de upload
4. **Autenticación:** Errores de auth
5. **Permisos:** Errores de acceso
6. **JSON:** Errores de sintaxis
7. **Timeout:** Errores de tiempo
8. **Memoria:** Errores del sistema

### Respuesta de Error Estándar
```json
{
  "success": false,
  "message": "Descripción del error",
  "errors": [
    {
      "field": "campo_específico",
      "message": "Mensaje de error específico",
      "value": "valor_problemático"
    }
  ]
}
```

## 🔄 Rutas Actualizadas

### Usuarios
- ✅ GET `/api/usuarios` - Listar usuarios
- ✅ GET `/api/usuarios/:id` - Obtener usuario por ID
- ✅ POST `/api/usuarios` - Crear usuario
- ✅ PUT `/api/usuarios/:id` - Actualizar usuario
- ✅ DELETE `/api/usuarios/:id` - Eliminar usuario

### Clientes
- ✅ GET `/api/clients` - Listar clientes
- ✅ GET `/api/clients/:id` - Obtener cliente por ID
- ✅ POST `/api/clients` - Crear cliente
- ✅ PUT `/api/clients/:id` - Actualizar cliente
- ✅ DELETE `/api/clients/:id` - Eliminar cliente

### Proyectos
- ✅ GET `/api/projects` - Listar proyectos
- ✅ GET `/api/projects/:id` - Obtener proyecto por ID
- ✅ POST `/api/projects` - Crear proyecto
- ✅ PUT `/api/projects/:id` - Actualizar proyecto
- ✅ DELETE `/api/projects/:id` - Eliminar proyecto

### Cuentas por Pagar
- ✅ GET `/api/cuentas-pagar` - Listar cuentas
- ✅ GET `/api/cuentas-pagar/:id` - Obtener cuenta por ID
- ✅ POST `/api/cuentas-pagar` - Crear cuenta
- ✅ PUT `/api/cuentas-pagar/:id` - Actualizar cuenta
- ✅ PUT `/api/cuentas-pagar/:id/pagado` - Toggle pagado
- ✅ DELETE `/api/cuentas-pagar/:id` - Eliminar cuenta

## 🚀 Beneficios Implementados

### Seguridad
- ✅ Protección contra XSS
- ✅ Rate limiting para prevenir ataques
- ✅ Validación estricta de inputs
- ✅ Sanitización automática
- ✅ Headers de seguridad

### Robustez
- ✅ Validación completa de datos
- ✅ Manejo detallado de errores
- ✅ Logging comprehensivo
- ✅ Respuestas consistentes
- ✅ Validación de tipos

### Mantenibilidad
- ✅ Código modular y reutilizable
- ✅ Esquemas centralizados
- ✅ Middlewares configurables
- ✅ Documentación completa
- ✅ Logs estructurados

## 📈 Próximos Pasos

1. **Implementar validación en controladores restantes**
2. **Agregar tests unitarios para validaciones**
3. **Configurar monitoreo de logs**
4. **Implementar auditoría de cambios**
5. **Agregar validación de archivos**
6. **Configurar alertas de seguridad**

## 🔧 Configuración

### Variables de Entorno Requeridas
```env
NODE_ENV=development
PORT=5001
DB_HOST=localhost
DB_USER=usuario
DB_PASSWORD=contraseña
DB_NAME=base_datos
```

### Dependencias Instaladas
```json
{
  "joi": "^17.0.0",
  "express-validator": "^7.0.0",
  "helmet": "^7.0.0",
  "express-rate-limit": "^7.0.0"
}
```

---

**Sistema de Validación implementado exitosamente** ✅
**Seguridad reforzada** ✅
**Logging comprehensivo** ✅
**Manejo de errores robusto** ✅ 