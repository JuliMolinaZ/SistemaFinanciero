# 🏢 Sistema Financiero Empresarial

Sistema integral de gestión financiera y administrativa desarrollado con React.js y Node.js.

## 🚀 Características Principales

### 💰 Módulos Financieros
- **Cuentas por Pagar** - Gestión de obligaciones y proveedores
- **Cuentas por Cobrar** - Seguimiento de ingresos y clientes
- **Costos Fijos** - Administración de gastos recurrentes y nómina
- **Contabilidad** - Registro de movimientos contables

### 👥 Gestión Empresarial
- **Usuarios** - Sistema de roles y permisos
- **Clientes** - Base de datos de clientes
- **Proyectos** - Gestión de proyectos y fases
- **Proveedores** - Administración de proveedores

### 📊 Análisis y Reportes
- **Dashboard** - Métricas y KPIs en tiempo real
- **Reportes** - Exportación a Excel y PDF
- **Gráficos** - Visualización interactiva de datos

## 🛠 Tecnologías

### Frontend
- **React.js 19** - Framework principal
- **Material-UI** - Componentes de interfaz
- **Recharts** - Gráficos y visualizaciones
- **Axios** - Cliente HTTP
- **Firebase** - Autenticación

### Backend
- **Node.js** - Servidor backend
- **Express.js** - Framework web
- **Prisma ORM** - Base de datos
- **MySQL** - Base de datos
- **JWT** - Autenticación

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+
- MySQL 8.0+
- npm o yarn

### Backend
```bash
cd Backend
npm install
cp config.env.example config.env
# Configurar variables de entorno en config.env
npm start
```

### Frontend
```bash
cd Frontend
npm install
npm start
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

## 🔐 Seguridad

- Autenticación con Firebase
- Sistema de roles y permisos
- Protección de rutas
- Validación de datos
- Auditoría de acciones

## 📄 Licencia

Proyecto privado - Todos los derechos reservados

## 👥 Equipo de Desarrollo

Sistema desarrollado por el equipo de RunSolutions Services
