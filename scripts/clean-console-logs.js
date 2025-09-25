#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Función para limpiar console.logs de un archivo
function cleanConsoleLogs(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Patrones para eliminar console.logs
    const patterns = [
      // console.log simple
      /console\.log\([^)]*\);\s*/g,
      // console.log con múltiples líneas
      /console\.log\(\s*[^)]*\s*\);\s*/g,
      // console.log con template strings
      /console\.log\(`[^`]*`\);\s*/g,
      // console.log con strings multilinea
      /console\.log\(\s*"[^"]*"\s*\);\s*/g,
      // console.log con objetos complejos
      /console\.log\(\s*\{[^}]*\}\s*\);\s*/g,
      // console.log con arrays
      /console\.log\(\s*\[[^\]]*\]\s*\);\s*/g,
      // console.log con variables
      /console\.log\(\s*[a-zA-Z_$][a-zA-Z0-9_$]*\s*\);\s*/g,
      // console.log con múltiples argumentos
      /console\.log\(\s*[^)]*,\s*[^)]*\s*\);\s*/g,
      // console.log con comentarios
      /\/\/.*console\.log.*\n/g,
      // console.log con espacios y saltos de línea
      /console\.log\(\s*\n\s*[^)]*\n\s*\);\s*/g
    ];
    
    let originalContent = content;
    
    // Aplicar cada patrón
    patterns.forEach(pattern => {
      content = content.replace(pattern, '');
    });
    
    // Limpiar líneas vacías múltiples
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    // Solo escribir si hubo cambios
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Limpiado: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error procesando ${filePath}:`, error.message);
    return false;
  }
}

// Función para recorrer directorios recursivamente
function walkDirectory(dir, extensions = ['.js', '.jsx', '.ts', '.tsx']) {
  const files = [];
  
  function walk(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    items.forEach(item => {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Saltar node_modules y otros directorios innecesarios
        if (!['node_modules', '.git', 'dist', 'build'].includes(item)) {
          walk(fullPath);
        }
      } else if (stat.isFile()) {
        const ext = path.extname(fullPath);
        if (extensions.includes(ext)) {
          files.push(fullPath);
        }
      }
    });
  }
  
  walk(dir);
  return files;
}

// Función principal
function main() {
  const frontendDir = path.join(__dirname, '..', 'Frontend', 'src');
  
  console.log('🧹 Iniciando limpieza de console.logs...');
  console.log(`📁 Directorio: ${frontendDir}`);
  
  if (!fs.existsSync(frontendDir)) {
    console.error('❌ Directorio Frontend/src no encontrado');
    process.exit(1);
  }
  
  const files = walkDirectory(frontendDir);
  console.log(`📄 Encontrados ${files.length} archivos para procesar`);
  
  let cleanedCount = 0;
  
  files.forEach(file => {
    if (cleanConsoleLogs(file)) {
      cleanedCount++;
    }
  });
  
  console.log(`\n🎉 Limpieza completada!`);
  console.log(`✅ Archivos limpiados: ${cleanedCount}`);
  console.log(`📄 Total archivos procesados: ${files.length}`);
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main();
}

module.exports = { cleanConsoleLogs, walkDirectory };