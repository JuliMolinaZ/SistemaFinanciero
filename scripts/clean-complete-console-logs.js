#!/usr/bin/env node

// 🧹 SCRIPT COMPLETO PARA LIMPIAR TODOS LOS CONSOLE LOGS DEL PROYECTO
// ====================================================================

const fs = require('fs');
const path = require('path');

// Configuración completa
const CONFIG = {
  directories: [
    './Backend/src',
    './Frontend/src',
    './Backend/scripts',
    './Backend/config',
    './Backend/lib',
    './Backend/utils',
    './Backend/prisma',
    './Backend'
  ],
  extensions: ['.js', '.jsx', '.ts', '.tsx'],

  // Patrones para eliminar console logs
  removePatterns: [
    // Console logs simples
    /^\s*console\.log\s*\([^)]*\)\s*;?\s*$/gm,
    /^\s*console\.debug\s*\([^)]*\)\s*;?\s*$/gm,
    /^\s*console\.info\s*\([^)]*\)\s*;?\s*$/gm,
    /^\s*console\.warn\s*\([^)]*\)\s*;?\s*$/gm,
    /^\s*console\.trace\s*\([^)]*\)\s*;?\s*$/gm,
    /^\s*console\.time\s*\([^)]*\)\s*;?\s*$/gm,
    /^\s*console\.timeEnd\s*\([^)]*\)\s*;?\s*$/gm,
    /^\s*console\.count\s*\([^)]*\)\s*;?\s*$/gm,
    /^\s*console\.table\s*\([^)]*\)\s*;?\s*$/gm,
    /^\s*console\.dir\s*\([^)]*\)\s*;?\s*$/gm,
    /^\s*console\.clear\s*\([^)]*\)\s*;?\s*$/gm,

    // Console logs con template strings multilínea
    /^\s*console\.log\s*\(`[\s\S]*?`\)\s*;?\s*$/gm,
    /^\s*console\.info\s*\(`[\s\S]*?`\)\s*;?\s*$/gm,
    /^\s*console\.warn\s*\(`[\s\S]*?`\)\s*;?\s*$/gm,
    /^\s*console\.debug\s*\(`[\s\S]*?`\)\s*;?\s*$/gm,

    // Console logs con strings multilínea normales
    /^\s*console\.log\s*\("[\s\S]*?"\)\s*;?\s*$/gm,
    /^\s*console\.info\s*\("[\s\S]*?"\)\s*;?\s*$/gm,
    /^\s*console\.warn\s*\("[\s\S]*?"\)\s*;?\s*$/gm,
    /^\s*console\.debug\s*\("[\s\S]*?"\)\s*;?\s*$/gm,

    // Console logs con strings multilínea con comillas simples
    /^\s*console\.log\s*\('[\s\S]*?'\)\s*;?\s*$/gm,
    /^\s*console\.info\s*\('[\s\S]*?'\)\s*;?\s*$/gm,
    /^\s*console\.warn\s*\('[\s\S]*?'\)\s*;?\s*$/gm,
    /^\s*console\.debug\s*\('[\s\S]*?'\)\s*;?\s*$/gm,
  ],

  // Archivos donde mantener algunos logs críticos
  keepErrorLogsInFiles: [
    'emailService.js',
    'logger.js',
    'audit.js'
  ],

  // Archivos a excluir completamente
  excludeFiles: [
    'clean-console-logs.js',
    'clean-all-console-logs.js',
    'CHANGELOG_PRODUCCION.md'
  ],

  excludeDirs: [
    'node_modules',
    '.git',
    'build',
    'dist',
    'coverage',
    'uploads'
  ]
};

let stats = {
  filesProcessed: 0,
  filesModified: 0,
  consoleLogsRemoved: 0,
  linesRemoved: 0
};

function shouldExcludeDir(dirPath) {
  return CONFIG.excludeDirs.some(excluded => dirPath.includes(excluded));
}

function shouldExcludeFile(filePath) {
  const fileName = path.basename(filePath);
  return CONFIG.excludeFiles.some(file => fileName.includes(file));
}

function shouldKeepErrorLogs(filePath) {
  const fileName = path.basename(filePath);
  return CONFIG.keepErrorLogsInFiles.some(file => fileName.includes(file));
}

function cleanFile(filePath) {
  try {
    const originalContent = fs.readFileSync(filePath, 'utf8');
    let cleanedContent = originalContent;
    const originalLines = originalContent.split('\n').length;
    let removedLogs = 0;

    // Para archivos críticos, mantener console.error
    if (shouldKeepErrorLogs(filePath)) {
      console.log(`🔒 ${path.relative('.', filePath)}: Manteniendo logs críticos`);

      // Solo eliminar console.log, console.debug, console.info
      const safePatterns = [
        /^\s*console\.log\s*\([^)]*\)\s*;?\s*$/gm,
        /^\s*console\.debug\s*\([^)]*\)\s*;?\s*$/gm,
        /^\s*console\.info\s*\([^)]*\)\s*;?\s*$/gm,
        /^\s*console\.log\s*\(`[\s\S]*?`\)\s*;?\s*$/gm,
        /^\s*console\.debug\s*\(`[\s\S]*?`\)\s*;?\s*$/gm,
        /^\s*console\.info\s*\(`[\s\S]*?`\)\s*;?\s*$/gm,
      ];

      safePatterns.forEach(pattern => {
        const matches = cleanedContent.match(pattern);
        if (matches) {
          removedLogs += matches.length;
          cleanedContent = cleanedContent.replace(pattern, '');
        }
      });
    } else {
      // Limpieza completa para otros archivos
      CONFIG.removePatterns.forEach(pattern => {
        const matches = cleanedContent.match(pattern);
        if (matches) {
          removedLogs += matches.length;
          cleanedContent = cleanedContent.replace(pattern, '');
        }
      });

      // Limpieza adicional con regex más agresivo
      const aggressivePatterns = [
        // Console con múltiples argumentos
        /^\s*console\.(log|debug|info|warn)\s*\([^;]*\)\s*;?\s*$/gm,
        // Console dentro de comentarios ya comentados
        /^\s*\/\/\s*console\.(log|debug|info|warn).*$/gm,
      ];

      aggressivePatterns.forEach(pattern => {
        const matches = cleanedContent.match(pattern);
        if (matches) {
          removedLogs += matches.length;
          cleanedContent = cleanedContent.replace(pattern, '');
        }
      });
    }

    // Limpiar líneas vacías excesivas
    cleanedContent = cleanedContent.replace(/\n\s*\n\s*\n\s*\n/g, '\n\n');
    cleanedContent = cleanedContent.replace(/\n\s*\n\s*\n/g, '\n\n');

    const finalLines = cleanedContent.split('\n').length;
    const linesRemoved = originalLines - finalLines;

    if (originalContent !== cleanedContent) {
      fs.writeFileSync(filePath, cleanedContent);
      stats.filesModified++;
      stats.consoleLogsRemoved += removedLogs;
      stats.linesRemoved += linesRemoved;

      console.log(`✅ ${path.relative('.', filePath)}: ${removedLogs} logs, ${linesRemoved} líneas`);
    }

    stats.filesProcessed++;

  } catch (error) {
    console.error(`❌ Error procesando ${filePath}:`, error.message);
  }
}

function processDirectory(dirPath) {
  try {
    const items = fs.readdirSync(dirPath);

    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        if (!shouldExcludeDir(fullPath)) {
          processDirectory(fullPath);
        }
      } else if (stat.isFile()) {
        if (shouldExcludeFile(fullPath)) {
          continue;
        }
        
        const ext = path.extname(fullPath);
        if (CONFIG.extensions.includes(ext)) {
          cleanFile(fullPath);
        }
      }
    }
  } catch (error) {
    console.error(`❌ Error procesando directorio ${dirPath}:`, error.message);
  }
}

function main() {
  console.log('🧹 === LIMPIEZA COMPLETA DE CONSOLE LOGS ===\n');

  console.log('🚀 Iniciando limpieza completa del proyecto...\n');

  CONFIG.directories.forEach(dir => {
    if (fs.existsSync(dir)) {
      console.log(`📁 Procesando: ${dir}`);
      processDirectory(dir);
      console.log('');
    } else {
      console.log(`⚠️ Directorio no encontrado: ${dir}`);
    }
  });

  console.log('📊 === ESTADÍSTICAS FINALES ===');
  console.log(`   ✅ Archivos procesados: ${stats.filesProcessed}`);
  console.log(`   🔧 Archivos modificados: ${stats.filesModified}`);
  console.log(`   🧹 Console logs eliminados: ${stats.consoleLogsRemoved}`);
  console.log(`   📝 Líneas eliminadas: ${stats.linesRemoved}`);
  console.log('');

  if (stats.filesModified > 0) {
    console.log('🎉 === CÓDIGO ULTRA PROFESIONAL ===');
    console.log('   🚀 Tu código ahora está LISTO PARA PRODUCCIÓN');
    console.log('   ✨ Limpieza completa de console logs');
    console.log('   🔒 Logs críticos de errores preservados');
    console.log('   💎 Calidad enterprise alcanzada');
  } else {
    console.log('✨ El código ya estaba limpio - ¡Excelente trabajo!');
  }
}

if (require.main === module) {
  main();
}

module.exports = { cleanFile, processDirectory, CONFIG, stats };
