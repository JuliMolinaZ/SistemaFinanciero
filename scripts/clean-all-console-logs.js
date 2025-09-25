#!/usr/bin/env node

// 🧹 SCRIPT ULTRA PROFESIONAL PARA LIMPIAR TODOS LOS CONSOLE LOGS
// ==============================================================
// Versión más agresiva para producción

const fs = require('fs');
const path = require('path');

// Configuración ultra limpia
const CONFIG = {
  directories: [
    './Backend/src',
    './Frontend/src'
  ],
  extensions: ['.js', '.jsx', '.ts', '.tsx'],

  // TODOS los console logs a eliminar (más agresivo)
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

  // Archivos críticos donde MANTENER algunos logs
  keepErrorLogsInFiles: [
    'emailService.js',
    'logger.js',
    'audit.js'
  ],

  excludeDirs: [
    'node_modules',
    '.git',
    'build',
    'dist',
    'coverage'
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

function shouldKeepErrorLogs(filePath) {
  const fileName = path.basename(filePath);
  return CONFIG.keepErrorLogsInFiles.some(file => fileName.includes(file));
}

function ultraCleanFile(filePath) {
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
        const ext = path.extname(fullPath);
        if (CONFIG.extensions.includes(ext)) {
          ultraCleanFile(fullPath);
        }
      }
    }
  } catch (error) {
    console.error(`❌ Error procesando directorio ${dirPath}:`, error.message);
  }
}

function main() {
  console.log('🧹 === LIMPIEZA ULTRA PROFESIONAL DE CONSOLE LOGS ===\n');

  console.log('🚀 Iniciando limpieza ultra agresiva...\n');

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
  }
}

if (require.main === module) {
  main();
}

module.exports = { ultraCleanFile, processDirectory, CONFIG, stats };