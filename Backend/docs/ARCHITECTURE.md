# 🏗️ Arquitectura del Sistema Financiero Backend

## 📋 Descripción General

El backend del Sistema Financiero está organizado siguiendo una arquitectura modular y escalable, con separación clara de responsabilidades y patrones de diseño modernos.

## 🗂️ Estructura de Directorios

```
Backend/
├── src/                          # Código fuente principal
│   ├── config/                   # Configuraciones
│   │   ├── app.js               # Configuración de la aplicación
│   │   └── database.js          # Configuración de Prisma
│   ├── controllers/             # Controladores de la API
│   │   ├── index.js            # Exportación de controladores
│   │   ├── usuarioController.js
│   │   ├── clientController.js
│   │   └── ...
│   ├── middlewares/            # Middlewares de Express
│   │   ├── index.js           # Exportación de middlewares
│   │   ├── auth.js            # Autenticación JWT
│   │   ├── validation.js      # Validación de datos
│   │   ├── security.js        # Seguridad
│   │   ├── logger.js          # Logging
│   │   ├── audit.js           # Auditoría
│   │   ├── errorHandler.js    # Manejo de errores
│   │   └── pagination.js      # Paginación
│   ├── routes/                # Rutas de la API
│   │   ├── index.js          # Rutas principales
│   │   ├── auth.js           # Rutas de autenticación
│   │   ├── usuarios.js       # Rutas de usuarios
│   │   └── ...
│   ├── services/             # Lógica de negocio
│   │   ├── userService.js    # Servicios de usuario
│   │   ├── clientService.js  # Servicios de cliente
│   │   └── ...
│   ├── utils/                # Utilidades
│   │   ├── index.js         # Exportación de utilidades
│   │   ├── auth.js          # Utilidades de autenticación
│   │   ├── encryption.js    # Encriptación
│   │   └── ...
│   ├── validations/         # Esquemas de validación
│   │   └── schemas.js       # Esquemas Joi
│   ├── types/               # Tipos TypeScript (opcional)
│   ├── app.js              # Aplicación Express
│   └── server.js           # Servidor principal
├── scripts/                 # Scripts de utilidad
│   ├── setup/              # Scripts de configuración
│   │   ├── index.js       # Menú de scripts
│   │   ├── create-tables-simple.js
│   │   └── ...
│   ├── maintenance/        # Scripts de mantenimiento
│   └── deployment/         # Scripts de despliegue
├── tests/                  # Pruebas
│   ├── unit/              # Pruebas unitarias
│   ├── integration/       # Pruebas de integración
│   └── e2e/              # Pruebas end-to-end
├── docs/                  # Documentación
│   ├── api/              # Documentación de API
│   ├── deployment/       # Guías de despliegue
│   └── security/         # Documentación de seguridad
├── prisma/               # Configuración de Prisma
│   ├── schema.prisma     # Esquema de base de datos
│   └── seed.js          # Datos iniciales
├── sql/                  # Scripts SQL
│   └── create-security-tables.sql
├── logs/                 # Logs de la aplicación
├── backups/              # Backups de base de datos
├── .env                  # Variables de entorno
├── .env.example          # Ejemplo de variables de entorno
├── package.json          # Dependencias y scripts
└── README.md            # Documentación principal
```

## 🔧 Capas de la Arquitectura

### 1. **Capa de Configuración** (`src/config/`)
- **Responsabilidad**: Configuración centralizada de la aplicación
- **Archivos**:
  - `app.js`: Configuración general de la aplicación
  - `database.js`: Configuración de Prisma y base de datos

### 2. **Capa de Controladores** (`src/controllers/`)
- **Responsabilidad**: Manejo de requests HTTP y respuestas
- **Características**:
  - Validación de entrada
  - Llamada a servicios
  - Formateo de respuestas
  - Manejo de errores HTTP

### 3. **Capa de Servicios** (`src/services/`)
- **Responsabilidad**: Lógica de negocio
- **Características**:
  - Operaciones de base de datos
  - Validaciones de negocio
  - Transformaciones de datos
  - Integración con servicios externos

### 4. **Capa de Middlewares** (`src/middlewares/`)
- **Responsabilidad**: Procesamiento de requests
- **Tipos**:
  - **Autenticación**: JWT, Firebase
  - **Validación**: Joi schemas
  - **Seguridad**: Helmet, CORS, Rate limiting
  - **Logging**: Requests, errores, auditoría
  - **Paginación**: Procesamiento de parámetros

### 5. **Capa de Rutas** (`src/routes/`)
- **Responsabilidad**: Definición de endpoints
- **Características**:
  - Agrupación por módulos
  - Middlewares específicos
  - Validación de entrada
  - Documentación de endpoints

## 🔒 Características de Seguridad

### **Autenticación y Autorización**
- JWT tokens con expiración configurable
- Integración con Firebase Authentication
- Roles y permisos granulares
- Sesiones de usuario

### **Validación y Sanitización**
- Validación con Joi schemas
- Sanitización de entrada
- Validación de tipos de contenido
- Límites de tamaño de payload

### **Protección de Datos**
- Headers de seguridad con Helmet
- CORS configurado
- Rate limiting por IP
- Logs de auditoría completos

### **Encriptación**
- Contraseñas hasheadas con bcrypt
- Datos sensibles encriptados
- Tokens JWT seguros
- Backups encriptados

## 📊 Base de Datos

### **ORM: Prisma**
- **Ventajas**:
  - Type safety completo
  - Auto-completado inteligente
  - Migraciones versionadas
  - Relaciones automáticas
  - Performance optimizada

### **Modelos Principales**
- **Usuarios**: Gestión de usuarios y roles
- **Clientes**: Información de clientes
- **Proyectos**: Gestión de proyectos
- **Finanzas**: Cuentas por pagar/cobrar
- **Seguridad**: Logs de auditoría y seguridad

## 🚀 Scripts y Comandos

### **Desarrollo**
```bash
npm run dev          # Servidor de desarrollo
npm run start        # Servidor de producción
npm run test         # Ejecutar pruebas
npm run lint         # Verificar código
npm run format       # Formatear código
```

### **Configuración**
```bash
npm run setup        # Menú de configuración
npm run setup:prisma # Configurar Prisma
npm run setup:security # Crear tablas de seguridad
```

### **Base de Datos**
```bash
npm run prisma:generate  # Generar cliente Prisma
npm run prisma:migrate   # Ejecutar migraciones
npm run prisma:studio    # Abrir Prisma Studio
npm run db:seed         # Insertar datos iniciales
```

## 📝 Logging y Monitoreo

### **Tipos de Logs**
1. **Request Logs**: Todas las peticiones HTTP
2. **Error Logs**: Errores de la aplicación
3. **Audit Logs**: Cambios en datos sensibles
4. **Security Logs**: Eventos de seguridad
5. **Performance Logs**: Métricas de rendimiento

### **Niveles de Log**
- **ERROR**: Errores críticos
- **WARN**: Advertencias
- **INFO**: Información general
- **DEBUG**: Información de depuración

## 🔄 Flujo de Datos

```
Request → Middlewares → Routes → Controllers → Services → Database
   ↑                                                              ↓
Response ← Middlewares ← Controllers ← Services ← Database ← Response
```

### **Proceso Detallado**
1. **Request llega** al servidor
2. **Middlewares de seguridad** procesan la petición
3. **Middleware de logging** registra la petición
4. **Rutas** dirigen a el controlador correcto
5. **Controlador** valida entrada y llama al servicio
6. **Servicio** ejecuta lógica de negocio
7. **Prisma** ejecuta consultas en la base de datos
8. **Respuesta** se forma y envía de vuelta
9. **Middleware de auditoría** registra cambios

## 🎯 Beneficios de esta Arquitectura

### **Mantenibilidad**
- Separación clara de responsabilidades
- Código modular y reutilizable
- Fácil testing y debugging

### **Escalabilidad**
- Arquitectura horizontal
- Servicios independientes
- Base de datos optimizada

### **Seguridad**
- Múltiples capas de protección
- Validación en cada nivel
- Logs de auditoría completos

### **Performance**
- Caching inteligente
- Consultas optimizadas
- Compresión de respuestas

## 🔮 Próximos Pasos

### **Mejoras Planificadas**
1. **Microservicios**: Separar en servicios independientes
2. **Caching**: Implementar Redis para caché
3. **Queue System**: Colas para tareas pesadas
4. **API Documentation**: Swagger/OpenAPI
5. **Monitoring**: Métricas y alertas
6. **CI/CD**: Pipeline de despliegue automático

### **Optimizaciones**
1. **Database Indexing**: Índices optimizados
2. **Query Optimization**: Consultas más eficientes
3. **Connection Pooling**: Pool de conexiones
4. **Load Balancing**: Balanceador de carga
5. **CDN**: Contenido estático distribuido 