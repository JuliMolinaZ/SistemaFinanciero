# 🚀 Guía de Despliegue a Producción

## Configuración de Entornos

### Archivos de Configuración
- `.env` - Configuración por defecto (desarrollo local)
- `.env.local` - Configuración local (sobrescribe .env)
- `.env.development` - Configuración específica para desarrollo
- `.env.production` - Configuración específica para producción
- `.env.staging` - Configuración para staging/testing

### URLs Configuradas
- **Desarrollo**: `http://localhost:8765`
- **Producción**: `https://sigma.runsolutions-services.com`

## Scripts Disponibles

### Desarrollo
```bash
# Iniciar en modo desarrollo (localhost:8765)
npm start
npm run start:dev

# Iniciar simulando producción (sigma.runsolutions-services.com)
npm run start:prod
```

### Build
```bash
# Build para desarrollo
npm run build:dev

# Build para producción
npm run build:prod

# Build usando archivo .env.production
npm run build
```

### Despliegue
```bash
# Ejecutar script de despliegue completo
npm run deploy
```

## Proceso de Despliegue

### 1. Preparación
```bash
cd /root/SistemaFinanciero/Frontend
npm run build:prod
```

### 2. Verificación
- ✅ Backend corriendo en `https://sigma.runsolutions-services.com`
- ✅ Build creado en carpeta `build/`
- ✅ Variables de entorno configuradas correctamente

### 3. Despliegue
1. Copiar contenido de `build/` al servidor web
2. Configurar servidor para servir archivos estáticos
3. Verificar que las rutas funcionen correctamente

## Verificación Post-Despliegue

### URLs a Probar
- `https://sigma.runsolutions-services.com/` - Página principal
- `https://sigma.runsolutions-services.com/login` - Login
- `https://sigma.runsolutions-services.com/dashboard-ultra` - Dashboard

### Funcionalidades a Verificar
- ✅ Login con Firebase
- ✅ Carga de perfil de usuario
- ✅ Sidebar con módulos correctos
- ✅ Conexión con backend
- ✅ Todos los módulos funcionando

## Troubleshooting

### Problema: Frontend no se conecta al backend
**Solución**: Verificar que `REACT_APP_API_URL` esté configurado correctamente

### Problema: Usuario no carga
**Solución**: Verificar que el backend esté corriendo y accesible

### Problema: Sidebar muestra datos antiguos
**Solución**: Limpiar cache del navegador y verificar configuración de API

## Estructura de Archivos de Producción
```
build/
├── static/
│   ├── css/
│   │   └── main.f7a30293.css
│   └── js/
│       └── main.280475ec.js
├── index.html
└── manifest.json
```
