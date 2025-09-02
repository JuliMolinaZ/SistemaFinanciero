#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Corrigiendo importaciones...\n');

// Función para procesar un archivo
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Reemplazar importaciones de config/db
    if (content.includes("require('../config/db')")) {
      content = content.replace(/require\('\.\.\/config\/db'\)/g, "require('../config/database')");
      modified = true;
    }
    
    if (content.includes("require('./config/db')")) {
      content = content.replace(/require\('\.\/config\/db'\)/g, "require('./config/database')");
      modified = true;
    }
    
    // Reemplazar importaciones de config/db en rutas
    if (content.includes("require('../../config/db')")) {
      content = content.replace(/require\('\.\.\/\.\.\/config\/db'\)/g, "require('../../config/database')");
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Corregido: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.log(`❌ Error procesando ${filePath}: ${error.message}`);
    return false;
  }
}

// Función para procesar directorio recursivamente
function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  let totalFixed = 0;
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      totalFixed += processDirectory(filePath);
    } else if (file.endsWith('.js')) {
      if (processFile(filePath)) {
        totalFixed++;
      }
    }
  }
  
  return totalFixed;
}

// Procesar directorios principales
const directories = ['src/controllers', 'src/routes', 'src/middlewares', 'src/services'];

let totalFixed = 0;

for (const dir of directories) {
  if (fs.existsSync(dir)) {
    console.log(`📁 Procesando: ${dir}`);
    totalFixed += processDirectory(dir);
  }
}

console.log(`\n🎉 Total de archivos corregidos: ${totalFixed}`);
console.log('✅ Importaciones corregidas exitosamente!'); 