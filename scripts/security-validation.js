#!/usr/bin/env node

// 🔒 SCRIPT DE VALIDACIÓN DE SEGURIDAD PARA PRODUCCIÓN
// =====================================================
// Verifica que no haya datos sensibles expuestos antes del despliegue

const fs = require('fs');
const path = require('path');

// Patrones de datos sensibles a buscar
const SENSITIVE_PATTERNS = {
  // Credenciales de base de datos
  database: [
    /password\s*[:=]\s*['"][^'"]+['"]/gi,
    /DB_PASSWORD\s*[:=]\s*['"][^'"]+['"]/gi,
    /DATABASE_URL\s*[:=]\s*['"][^:]+:[^@]+@[^'"]+['"]/gi,
    /mysql:\/\/[^:]+:[^@]+@[^\/]+/gi
  ],
  
  // Claves API y tokens
  apiKeys: [
    /SG\.[a-zA-Z0-9_-]+/g, // SendGrid
    /sk-[a-zA-Z0-9_-]+/g,  // Stripe
    /pk_[a-zA-Z0-9_-]+/g,  // Stripe public
    /AIza[0-9A-Za-z_-]{35}/g, // Google API
    /ya29\.[0-9A-Za-z_-]+/g, // Google OAuth
    /[a-zA-Z0-9]{32,}/g // Tokens genéricos largos
  ],
  
  // Emails y dominios sensibles
  emails: [
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
  ],
  
  // IPs y hosts sensibles
  hosts: [
    /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g, // IPs
    /[a-zA-Z0-9.-]+\.(com|net|org|io|co)\b/g // Dominios
  ],
  
  // JWT y claves de encriptación
  secrets: [
    /JWT_SECRET\s*[:=]\s*['"][^'"]+['"]/gi,
    /ENCRYPTION_KEY\s*[:=]\s*['"][^'"]+['"]/gi,
    /SECRET\s*[:=]\s*['"][^'"]+['"]/gi
  ]
};

// Archivos a excluir de la búsqueda
const EXCLUDE_FILES = [
  'node_modules',
  '.git',
  'build',
  'dist',
  'coverage',
  'logs',
  'uploads',
  '.env',
  'config.env',
  'clean-console-logs.js',
  'clean-all-console-logs.js',
  'clean-complete-console-logs.js'
];

// Archivos donde es normal encontrar ciertos patrones
const ALLOWED_PATTERNS = {
  'config.env.example': ['password', 'secret', 'key'],
  'INSTRUCCIONES_EMAIL_SENDGRID.md': ['password', 'key', 'email'],
  'README.md': ['email', 'host'],
  'package.json': ['email', 'host']
};

let findings = {
  critical: [],
  warning: [],
  info: [],
  filesChecked: 0,
  totalIssues: 0
};

function shouldExcludeFile(filePath) {
  const fileName = path.basename(filePath);
  const relativePath = path.relative('.', filePath);
  
  return EXCLUDE_FILES.some(excluded => 
    fileName.includes(excluded) || relativePath.includes(excluded)
  );
}

function isAllowedPattern(filePath, patternType) {
  const fileName = path.basename(filePath);
  const allowedPatterns = ALLOWED_PATTERNS[fileName] || [];
  return allowedPatterns.includes(patternType);
}

function scanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);
    const relativePath = path.relative('.', filePath);
    
    findings.filesChecked++;
    
    // Buscar cada tipo de patrón sensible
    Object.entries(SENSITIVE_PATTERNS).forEach(([patternType, patterns]) => {
      patterns.forEach(pattern => {
        const matches = content.match(pattern);
        
        if (matches) {
          matches.forEach(match => {
            // Verificar si es un patrón permitido para este archivo
            if (isAllowedPattern(filePath, patternType)) {
              findings.info.push({
                file: relativePath,
                type: patternType,
                match: match.substring(0, 50) + (match.length > 50 ? '...' : ''),
                severity: 'info',
                message: `Patrón permitido en ${fileName}`
              });
            } else {
              // Determinar severidad
              let severity = 'warning';
              if (patternType === 'database' || patternType === 'apiKeys' || patternType === 'secrets') {
                severity = 'critical';
              }
              
              findings[severity].push({
                file: relativePath,
                type: patternType,
                match: match.substring(0, 50) + (match.length > 50 ? '...' : ''),
                severity,
                message: `Datos sensibles encontrados en ${fileName}`
              });
              
              findings.totalIssues++;
            }
          });
        }
      });
    });
    
  } catch (error) {
    console.error(`❌ Error escaneando ${filePath}:`, error.message);
  }
}

function scanDirectory(dirPath) {
  try {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        if (!shouldExcludeFile(fullPath)) {
          scanDirectory(fullPath);
        }
      } else if (stat.isFile()) {
        if (!shouldExcludeFile(fullPath)) {
          const ext = path.extname(fullPath);
          if (['.js', '.jsx', '.ts', '.tsx', '.json', '.md', '.env', '.config'].includes(ext)) {
            scanFile(fullPath);
          }
        }
      }
    }
  } catch (error) {
    console.error(`❌ Error escaneando directorio ${dirPath}:`, error.message);
  }
}

function generateReport() {
  console.log('🔒 === REPORTE DE VALIDACIÓN DE SEGURIDAD ===\n');
  
  console.log(`📊 Estadísticas:`);
  console.log(`   📁 Archivos escaneados: ${findings.filesChecked}`);
  console.log(`   🚨 Problemas críticos: ${findings.critical.length}`);
  console.log(`   ⚠️ Advertencias: ${findings.warning.length}`);
  console.log(`   ℹ️ Información: ${findings.info.length}`);
  console.log(`   📈 Total de problemas: ${findings.totalIssues}\n`);
  
  // Mostrar problemas críticos
  if (findings.critical.length > 0) {
    console.log('🚨 === PROBLEMAS CRÍTICOS ===');
    findings.critical.forEach((finding, index) => {
      console.log(`${index + 1}. ${finding.file}`);
      console.log(`   Tipo: ${finding.type}`);
      console.log(`   Contenido: ${finding.match}`);
      console.log(`   Mensaje: ${finding.message}\n`);
    });
  }
  
  // Mostrar advertencias
  if (findings.warning.length > 0) {
    console.log('⚠️ === ADVERTENCIAS ===');
    findings.warning.forEach((finding, index) => {
      console.log(`${index + 1}. ${finding.file}`);
      console.log(`   Tipo: ${finding.type}`);
      console.log(`   Contenido: ${finding.match}`);
      console.log(`   Mensaje: ${finding.message}\n`);
    });
  }
  
  // Resumen final
  if (findings.critical.length === 0 && findings.warning.length === 0) {
    console.log('✅ === VALIDACIÓN EXITOSA ===');
    console.log('   🎉 No se encontraron datos sensibles expuestos');
    console.log('   🚀 El código está listo para producción');
    console.log('   🔒 Seguridad validada correctamente');
  } else {
    console.log('❌ === VALIDACIÓN FALLIDA ===');
    console.log('   🚨 Se encontraron datos sensibles expuestos');
    console.log('   ⛔ NO desplegar a producción hasta resolver');
    console.log('   🔧 Revisar y corregir los problemas encontrados');
    
    if (findings.critical.length > 0) {
      console.log('\n🔴 ACCIÓN INMEDIATA REQUERIDA:');
      console.log('   1. Eliminar credenciales hardcodeadas');
      console.log('   2. Mover datos sensibles a variables de entorno');
      console.log('   3. Usar archivos .env protegidos por .gitignore');
      console.log('   4. Revisar todos los archivos críticos listados');
    }
  }
  
  console.log('\n📋 === RECOMENDACIONES DE SEGURIDAD ===');
  console.log('   🔐 Usar variables de entorno para credenciales');
  console.log('   📁 Mantener .env fuera del control de versiones');
  console.log('   🔒 Implementar rotación de claves regularmente');
  console.log('   📊 Monitorear logs por accesos no autorizados');
  console.log('   🛡️ Usar HTTPS en producción');
  console.log('   🔑 Implementar autenticación de dos factores');
}

function main() {
  console.log('🔒 Iniciando validación de seguridad...\n');
  
  // Escanear directorios principales
  const directories = ['./Backend', './Frontend'];
  
  directories.forEach(dir => {
    if (fs.existsSync(dir)) {
      console.log(`📁 Escaneando: ${dir}`);
      scanDirectory(dir);
    }
  });
  
  generateReport();
}

if (require.main === module) {
  main();
}

module.exports = { scanFile, scanDirectory, SENSITIVE_PATTERNS };
