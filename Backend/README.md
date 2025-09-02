# 🏦 Sistema Financiero Backend

Backend robusto y escalable para gestión financiera y contable, construido con Node.js, Express y Prisma.

## 🚀 Características Principales

- ✅ **Arquitectura Modular**: Separación clara de responsabilidades
- ✅ **Autenticación JWT + Firebase**: Sistema de autenticación robusto
- ✅ **Validación Robusta**: Validación de datos con Joi
- ✅ **Seguridad Avanzada**: Múltiples capas de protección
- ✅ **Logs de Auditoría**: Registro completo de cambios
- ✅ **Base de Datos Optimizada**: MySQL con Prisma ORM
- ✅ **API RESTful**: Endpoints bien documentados
- ✅ **Rate Limiting**: Protección contra ataques
- ✅ **Backup Automático**: Sistema de respaldos
- ✅ **Paginación**: Manejo eficiente de listas grandes

## 🏗️ Arquitectura

```
src/
├── config/          # Configuraciones
├── controllers/     # Controladores de API
├── middlewares/     # Middlewares de Express
├── routes/          # Rutas de la API
├── services/        # Lógica de negocio
├── utils/           # Utilidades
├── validations/     # Esquemas de validación
├── app.js          # Aplicación Express
└── server.js       # Servidor principal
```

## 📋 Requisitos Previos

- Node.js 18+ 
- MySQL 8.0+
- npm o yarn

## 🛠️ Instalación

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd SistemaFinanciero/Backend
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env
# Editar .env con tus credenciales
```

### 4. Configurar la base de datos
```bash
# Opción 1: Usar el menú de configuración
npm run setup

# Opción 2: Configurar manualmente
npm run setup:prisma
npm run setup:security
```

### 5. Iniciar el servidor
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## 🔧 Scripts Disponibles

### **Desarrollo**
```bash
npm run dev          # Servidor de desarrollo con nodemon
npm run start        # Servidor de producción
npm run test         # Ejecutar pruebas
npm run lint         # Verificar código
npm run format       # Formatear código
```

### **Configuración**
```bash
npm run setup        # Menú de configuración interactivo
npm run setup:prisma # Configurar Prisma
npm run setup:security # Crear tablas de seguridad
npm run setup:test   # Probar conexión
```

### **Base de Datos**
```bash
npm run prisma:generate  # Generar cliente Prisma
npm run prisma:migrate   # Ejecutar migraciones
npm run prisma:studio    # Abrir Prisma Studio
npm run db:seed         # Insertar datos iniciales
```

## 🌐 Endpoints Principales

### **Información del Sistema**
- `GET /` - Información general
- `GET /api/health` - Estado del sistema
- `GET /api/info` - Información detallada

### **Autenticación**
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/logout` - Cerrar sesión

### **Usuarios**
- `GET /api/users` - Listar usuarios
- `POST /api/users` - Crear usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

### **Clientes**
- `GET /api/clients` - Listar clientes
- `POST /api/clients` - Crear cliente
- `PUT /api/clients/:id` - Actualizar cliente
- `DELETE /api/clients/:id` - Eliminar cliente

### **Proyectos**
- `GET /api/projects` - Listar proyectos
- `POST /api/projects` - Crear proyecto
- `PUT /api/projects/:id` - Actualizar proyecto
- `DELETE /api/projects/:id` - Eliminar proyecto

### **Finanzas**
- `GET /api/cuentas-pagar` - Cuentas por pagar
- `GET /api/cuentas-cobrar` - Cuentas por cobrar
- `GET /api/contabilidad` - Contabilidad

## 🔒 Seguridad

### **Autenticación**
- JWT tokens con expiración configurable
- Integración con Firebase Authentication
- Roles y permisos granulares

### **Validación**
- Validación de entrada con Joi
- Sanitización de datos
- Validación de tipos de contenido

### **Protección**
- Headers de seguridad con Helmet
- CORS configurado
- Rate limiting por IP
- Logs de auditoría completos

## 📊 Base de Datos

### **Modelos Principales**
- **Users**: Gestión de usuarios y roles
- **Clients**: Información de clientes
- **Projects**: Gestión de proyectos
- **Providers**: Proveedores
- **CuentaPagar**: Cuentas por pagar
- **CuentaCobrar**: Cuentas por cobrar
- **Contabilidad**: Registros contables

### **Modelos de Seguridad**
- **AuditLog**: Logs de auditoría
- **JwtToken**: Gestión de tokens
- **SecurityLog**: Logs de seguridad
- **SecurityConfig**: Configuración de seguridad

## 📝 Logging

### **Tipos de Logs**
1. **Request Logs**: Todas las peticiones HTTP
2. **Error Logs**: Errores de la aplicación
3. **Audit Logs**: Cambios en datos sensibles
4. **Security Logs**: Eventos de seguridad

### **Niveles**
- **ERROR**: Errores críticos
- **WARN**: Advertencias
- **INFO**: Información general
- **DEBUG**: Información de depuración

## 🧪 Testing

```bash
# Ejecutar todas las pruebas
npm test

# Modo watch
npm run test:watch

# Con cobertura
npm run test:coverage
```

## 📚 Documentación

- [Arquitectura](./docs/ARCHITECTURE.md) - Documentación de la arquitectura
- [API](./docs/api/) - Documentación de la API
- [Seguridad](./docs/security/) - Guías de seguridad
- [Despliegue](./docs/deployment/) - Guías de despliegue

## 🔧 Configuración

### **Variables de Entorno**
```bash
# Base de datos
DATABASE_URL=mysql://user:password@host:port/database

# Servidor
PORT=5001
NODE_ENV=development

# Seguridad
JWT_SECRET=your-secret-key
ENCRYPTION_KEY=your-encryption-key

# Firebase
FIREBASE_PROJECT_ID=your-project-id

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🚀 Despliegue

### **Desarrollo Local**
```bash
npm run dev
```

### **Producción**
```bash
npm start
```

### **Docker** (Próximamente)
```bash
docker build -t sistema-financiero .
docker run -p 5001:5001 sistema-financiero
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisa la [documentación](./docs/)
2. Busca en los [issues](../../issues)
3. Crea un nuevo issue con detalles del problema

## 🎯 Roadmap

- [ ] Microservicios
- [ ] Caching con Redis
- [ ] Sistema de colas
- [ ] API Documentation con Swagger
- [ ] Métricas y monitoreo
- [ ] CI/CD Pipeline
- [ ] Docker containers
- [ ] Load balancing
- [ ] CDN para archivos estáticos

---

**Desarrollado con ❤️ para el Sistema Financiero** 