# 🚀 Sistema Financiero RunSolutions - SIGMA

Sistema integral de gestión financiera y administrativa empresarial desarrollado con tecnologías modernas.

## 📋 Descripción

SIGMA es una plataforma completa que incluye:
- 💰 **Gestión Financiera**: Cuentas por pagar/cobrar, contabilidad, recuperación de flujo
- 📊 **Project Management**: Sistema completo de gestión de proyectos con metodologías ágiles
- 👥 **Gestión de Usuarios**: Autenticación Firebase, roles y permisos
- 📧 **Sistema de Notificaciones**: Emails automáticos con SendGrid/SMTP
- 🏢 **Gestión de Clientes**: CRM integrado con proveedores y clientes

## 🚀 Características Principales

### 💰 Módulos Financieros
- **Cuentas por Pagar** - Gestión de obligaciones y proveedores
- **Cuentas por Cobrar** - Seguimiento de ingresos y clientes
- **Costos Fijos** - Administración de gastos recurrentes y nómina
- **Contabilidad** - Registro de movimientos contables
- **Recuperación de Flujo** - Análisis y recuperación de flujo de efectivo

### 👥 Gestión Empresarial
- **Usuarios** - Sistema de roles, permisos e invitaciones
- **Clientes** - Base de datos completa de clientes
- **Proyectos** - Gestión avanzada de proyectos con fases
- **Proveedores** - Administración integral de proveedores
- **Project Management** - Sistema completo con metodologías ágiles

### 📧 Sistema de Notificaciones
- **Emails de Invitación** - Invitaciones automáticas a usuarios
- **Notificaciones de Tareas** - Asignación y seguimiento de tareas
- **Recordatorios** - Notificaciones automáticas de vencimientos
- **SendGrid Integration** - Email transaccional profesional

### 📊 Análisis y Reportes
- **Dashboard Ejecutivo** - Métricas y KPIs en tiempo real
- **Reportes Avanzados** - Exportación a Excel y PDF
- **Gráficos Interactivos** - Visualización avanzada de datos
- **Analytics** - Análisis de tendencias y proyecciones

## 🛠 Tecnologías

### Frontend
- **React.js 19** - Framework principal
- **Material-UI** - Componentes de interfaz
- **Recharts** - Gráficos y visualizaciones
- **Axios** - Cliente HTTP
- **Firebase** - Autenticación

### Backend
- **Node.js** + **Express.js**
- **Prisma ORM** con **MySQL**
- **Firebase Authentication**
- **SendGrid** + **Nodemailer** para emails
- **JWT** para autenticación

## 🚀 Instalación

### 1. Clonar el repositorio
```bash
git clone <url-del-repo>
cd SistemaFinanciero
```

### 2. Configurar Backend
```bash
cd Backend
npm install
cp .env.example .env
# Configurar variables en .env
```

### 3. Configurar Frontend
```bash
cd Frontend
npm install
# Configurar Firebase config si es necesario
```

### 4. Base de Datos
```bash
cd Backend
npx prisma generate
npx prisma db push
```

## ⚙️ Variables de Entorno

### Backend (.env)

#### 🗄️ Base de Datos
```env
DATABASE_URL="mysql://usuario:password@host:puerto/database"
DB_HOST=tu-host-db
DB_USER=tu-usuario-db
DB_PASSWORD=tu-password-db
DB_NAME=tu-database-name
DB_PORT=3306
```

#### 🔐 Seguridad
```env
JWT_SECRET=tu_jwt_secret_super_seguro
ENCRYPTION_KEY=tu_encryption_key_super_segura
```

#### 🔥 Firebase
```env
FIREBASE_PROJECT_ID=tu-proyecto-firebase
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@tu-proyecto.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTU_CLAVE_PRIVADA\n-----END PRIVATE KEY-----"
```

#### 📧 SendGrid (Producción)
```env
SENDGRID_API_KEY=SG.tu_sendgrid_api_key_aqui
SENDGRID_FROM_EMAIL=noreply@tu-dominio.com
SENDGRID_FROM_NAME=TuEmpresa
```

#### 📮 SMTP (Fallback)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-app-password
```

#### 🌐 General
```env
NODE_ENV=production
PORT=8765
CORS_ORIGIN=https://tu-dominio.com
FRONTEND_URL=https://tu-dominio.com
EMAIL_FROM=TuEmpresa <noreply@tu-dominio.com>
```

## 🏃‍♂️ Ejecución

### Desarrollo
```bash
# Backend
cd Backend
npm run dev

# Frontend
cd Frontend
npm start
```

### Producción
```bash
# Backend
cd Backend
npm start

# Frontend
cd Frontend
npm run build
# Servir build/ con nginx o servidor web
```

## 🌐 URLs de Acceso

- **Frontend:** http://localhost:2103
- **Backend API:** http://localhost:8765
- **Documentación API:** http://localhost:8765/api/health

## 📁 Estructura del Proyecto

```
SistemaFinanciero/
├── Backend/                 # Servidor Node.js
│   ├── src/
│   │   ├── controllers/     # Controladores de API
│   │   ├── routes/          # Rutas de la API
│   │   ├── middlewares/     # Middlewares
│   │   └── config/          # Configuración
│   ├── prisma/              # Esquemas de base de datos
│   └── development-files/   # Archivos de desarrollo
├── Frontend/                # Aplicación React
│   ├── src/
│   │   ├── components/      # Componentes reutilizables
│   │   ├── modules/         # Módulos principales
│   │   ├── hooks/           # Hooks personalizados
│   │   └── styles/          # Estilos globales
│   └── development-files/   # Archivos de desarrollo
└── docs/                    # Documentación
```

## 📧 Configuración de Email

El sistema utiliza un enfoque de **fallback múltiple** para emails:

1. **SendGrid** (Principal - Producción)
2. **SMTP Gmail** (Fallback)
3. **Gmail Service** (Desarrollo)

### SendGrid Setup
1. Crear cuenta en [SendGrid](https://sendgrid.com/)
2. Generar API Key
3. Configurar `SENDGRID_API_KEY` en .env
4. Verificar dominio de envío

### Gmail SMTP Setup
1. Activar 2FA en Gmail
2. Generar App Password
3. Configurar credenciales SMTP en .env

## 🔒 Seguridad

### Autenticación
- **Firebase Authentication** para usuarios
- **JWT tokens** para sesiones del backend
- **Middleware de autenticación** en todas las rutas protegidas

### Autorización
- Sistema de **roles y permisos**
- **Validación de invitaciones** para nuevos usuarios
- **Middleware de bloqueo** para usuarios no autorizados

### Base de Datos
- **Prisma ORM** para prevenir SQL injection
- **Encriptación** de datos sensibles
- **Backup automático** configurado

## 🚀 Despliegue en Producción

### 1. Variables de Entorno
- Configurar todas las variables del .env.example
- **Cambiar secrets por valores seguros únicos**
- Configurar URLs de producción

### 2. Base de Datos
```bash
npx prisma db push --accept-data-loss
npx prisma generate
```

### 3. SendGrid
- Configurar API Key
- Verificar dominio
- Configurar templates si es necesario

### 4. Firebase
- Configurar proyecto para producción
- Actualizar reglas de seguridad
- Configurar dominios autorizados

### 5. Servidor
```bash
# Backend
pm2 start server.js --name "sigma-backend"

# Frontend (build y servir)
npm run build
# Configurar nginx para servir build/
```

## 📋 Checklist de Producción

- [ ] ✅ Variables de entorno configuradas
- [ ] ✅ SendGrid API key configurado
- [ ] ✅ Firebase proyecto configurado
- [ ] ✅ Base de datos migrada
- [ ] ✅ Dominio y SSL configurados
- [ ] ✅ CORS configurado correctamente
- [ ] ✅ Backup automático configurado
- [ ] ✅ Monitoring y logs configurados
- [ ] ✅ PM2 o supervisor configurado
- [ ] ✅ Nginx configurado

## 🆘 Solución de Problemas

### Email no se envía
1. Verificar SendGrid API key
2. Verificar configuración SMTP
3. Revisar logs del servidor
4. Verificar que `FORCE_EMAIL_SEND=true`

### Errores de autenticación
1. Verificar configuración Firebase
2. Verificar JWT_SECRET
3. Revisar tokens expirados
4. Verificar middleware de auth

### Errores de base de datos
1. Verificar conexión DATABASE_URL
2. Ejecutar `npx prisma generate`
3. Verificar permisos de usuario DB
4. Revisar logs de Prisma

## 📞 Soporte

Para soporte técnico, contactar a:
- Email: it@runsolutions-services.com
- Sistema: https://sigma.runsolutions-services.com

## 📄 Licencia

Proyecto privado - Todos los derechos reservados

---

**© 2025 RunSolutions - Sistema SIGMA**
