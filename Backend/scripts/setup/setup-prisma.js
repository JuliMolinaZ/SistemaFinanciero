#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Configurando Prisma para Sistema Financiero...\n');

// Función para ejecutar comandos
function runCommand(command, description) {
  console.log(`📋 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completado\n`);
  } catch (error) {
    console.error(`❌ Error en ${description}:`, error.message);
    process.exit(1);
  }
}

// Función para verificar si existe el archivo .env
function checkEnvFile() {
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) {
    console.log('⚠️  Archivo .env no encontrado');
    console.log('📝 Creando archivo .env con configuración de ejemplo...');
    
    const envContent = `# =====================================================
# CONFIGURACIÓN DE BASE DE DATOS
# =====================================================

# URL de la base de datos para Prisma
DATABASE_URL="mysql://usuario:password@host:puerto/nombre_base_datos"

# Configuración actual de la base de datos (mantener compatibilidad)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=sistema_financiero

# =====================================================
# CONFIGURACIÓN DE SEGURIDAD
# =====================================================

# JWT
JWT_SECRET=tu_jwt_secret_super_seguro_cambiar_en_produccion
JWT_EXPIRES_IN=24h

# Encriptación
ENCRYPTION_KEY=tu_clave_de_encriptacion_super_segura_32_caracteres

# Backup
BACKUP_DIR=./backups
BACKUP_RETENTION_DAYS=30
BACKUP_COMPRESS=true
BACKUP_ENCRYPT=false
BACKUP_ENCRYPTION_KEY=clave_encriptacion_backup

# =====================================================
# CONFIGURACIÓN DEL SERVIDOR
# =====================================================

PORT=8765
NODE_ENV=development
`;
    
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Archivo .env creado');
    console.log('⚠️  IMPORTANTE: Actualiza las credenciales de la base de datos en el archivo .env\n');
  } else {
    console.log('✅ Archivo .env encontrado\n');
  }
}

// Función para verificar conexión a la base de datos
function checkDatabaseConnection() {
  console.log('🔍 Verificando conexión a la base de datos...');
  try {
    execSync('npx prisma db pull', { stdio: 'pipe' });
    console.log('✅ Conexión a la base de datos exitosa\n');
  } catch (error) {
    console.error('❌ Error conectando a la base de datos');
    console.error('💡 Asegúrate de:');
    console.error('   1. Actualizar DATABASE_URL en el archivo .env');
    console.error('   2. Que la base de datos esté accesible');
    console.error('   3. Que las credenciales sean correctas\n');
    process.exit(1);
  }
}

// Función principal
async function main() {
  try {
    // Verificar archivo .env
    checkEnvFile();
    
    // Verificar conexión a la base de datos
    checkDatabaseConnection();
    
    // Generar cliente de Prisma
    runCommand('npx prisma generate', 'Generando cliente de Prisma');
    
    // Crear migración inicial
    runCommand('npx prisma migrate dev --name init-security-tables', 'Creando migración inicial');
    
    // Insertar datos de configuración inicial
    runCommand('npx prisma db seed', 'Insertando datos de configuración inicial');
    
    console.log('🎉 ¡Configuración de Prisma completada exitosamente!');
    console.log('\n📋 Próximos pasos:');
    console.log('   1. Actualiza las credenciales en el archivo .env');
    console.log('   2. Ejecuta: npm run dev');
    console.log('   3. Verifica que las nuevas tablas se crearon correctamente');
    
  } catch (error) {
    console.error('❌ Error durante la configuración:', error);
    process.exit(1);
  }
}

// Ejecutar script
main(); 