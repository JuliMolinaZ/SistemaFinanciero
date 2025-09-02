#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Corrigiendo rutas con esquemas de validación...\n');

// Mapeo de esquemas a corregir
const schemaMappings = {
  'userSchema': 'userSchemas',
  'clientSchema': 'clientSchemas',
  'projectSchema': 'projectSchemas',
  'providerSchema': 'providerSchemas',
  'cuentaPagarSchema': 'cuentaPagarSchemas',
  'cuentaCobrarSchema': 'cuentaCobrarSchemas',
  'contabilidadSchema': 'contabilidadSchemas',
  'categoriaSchema': 'categoriaSchemas',
  'phaseSchema': 'phaseSchemas',
  'costoFijoSchema': 'costoFijoSchemas',
  'cotizacionSchema': 'cotizacionSchemas'
};

// Función para procesar un archivo de rutas
function processRouteFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Corregir importaciones
    for (const [oldSchema, newSchema] of Object.entries(schemaMappings)) {
      // Corregir importación
      if (content.includes(`const { ${oldSchema} }`)) {
        content = content.replace(
          new RegExp(`const \\{ ${oldSchema} \\}`, 'g'),
          `const { ${newSchema} }`
        );
        modified = true;
      }
      
      // Corregir referencias en las rutas
      const regex = new RegExp(`${oldSchema}\\.(create|update|login)`, 'g');
      if (content.match(regex)) {
        content = content.replace(regex, `${newSchema}.$1`);
        modified = true;
      }
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

// Procesar archivos de rutas
const routesDir = 'src/routes';
const routeFiles = [
  'clients.js',
  'projects.js',
  'proveedores.js',
  'cuentasPagar.js',
  'cuentasCobrar.js',
  'contabilidad.js',
  'categorias.js',
  'phases.js',
  'costosFijos.js',
  'cotizaciones.js'
];

let totalFixed = 0;

for (const file of routeFiles) {
  const filePath = path.join(routesDir, file);
  if (fs.existsSync(filePath)) {
    console.log(`📁 Procesando: ${file}`);
    if (processRouteFile(filePath)) {
      totalFixed++;
    }
  }
}

console.log(`\n🎉 Total de archivos de rutas corregidos: ${totalFixed}`);
console.log('✅ Esquemas de validación corregidos exitosamente!'); 