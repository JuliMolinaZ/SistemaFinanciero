// Script para probar la lógica de getModifiedFields
function getModifiedFields(original, current) {
  console.log('🔍 DEBUG getModifiedFields:');
  console.log('  - Original:', original);
  console.log('  - Current:', current);
  
  const modified = {};
  
  // Solo incluir campos que realmente existen en la base de datos
  const validFields = ['concepto', 'monto', 'fecha', 'cliente_id', 'proyecto_id', 'categoria', 'recuperado'];
  
  // Campos adicionales para gestión interna
  const additionalFields = ['estado', 'descripcion', 'prioridad', 'notas', 'fecha_vencimiento'];
  
  validFields.forEach(key => {
    // Normalizar valores para comparación
    let currentValue = current[key];
    let originalValue = original[key];
    
    // Convertir tipos para comparación
    if (key === 'monto') {
      currentValue = parseFloat(currentValue) || 0;
      originalValue = parseFloat(originalValue) || 0;
    } else if (key === 'cliente_id' || key === 'proyecto_id') {
      currentValue = currentValue ? parseInt(currentValue) : null;
      originalValue = originalValue ? parseInt(originalValue) : null;
    } else if (key === 'recuperado') {
      currentValue = Boolean(currentValue);
      originalValue = Boolean(originalValue);
    }
    
    if (currentValue !== originalValue) {
      console.log(`  - Campo "${key}" ha cambiado de "${originalValue}" a "${currentValue}"`);
      
      // Agregar a campos modificados
      if (key === 'monto') {
        modified[key] = parseFloat(current[key]) || 0;
      } else if (key === 'fecha') {
        modified[key] = new Date(current[key]);
      } else if (key === 'cliente_id' || key === 'proyecto_id') {
        modified[key] = current[key] ? parseInt(current[key]) : null;
      } else if (key === 'recuperado') {
        modified[key] = Boolean(current[key]);
      } else {
        modified[key] = current[key]?.trim() || '';
      }
      
      console.log(`    ✅ Campo "${key}" agregado a modifiedFields con valor:`, modified[key]);
    } else {
      console.log(`  - Campo "${key}" NO ha cambiado (${originalValue} = ${currentValue})`);
    }
  });
  
  // Para los campos adicionales, por ahora solo los registramos en consola
  additionalFields.forEach(key => {
    if (current[key] !== undefined && current[key] !== original[key]) {
      console.log(`  - Campo adicional "${key}" ha cambiado de "${original[key]}" a "${current[key]}"`);
      console.log(`    ℹ️ Campo "${key}" no se enviará a la base de datos (requiere implementación adicional)`);
    }
  });
  
  console.log('📊 RESULTADO FINAL:');
  console.log('  - Campos modificados:', modified);
  console.log('  - Total de campos modificados:', Object.keys(modified).length);
  
  return modified;
}

// Casos de prueba
console.log('🧪 Probando casos de getModifiedFields...\n');

// Caso 1: Cambio en monto
console.log('1️⃣ Caso 1: Cambio en monto');
const original1 = { monto: 100, concepto: 'Test', recuperado: false };
const current1 = { monto: 200, concepto: 'Test', recuperado: false };
const result1 = getModifiedFields(original1, current1);
console.log('Resultado:', result1);
console.log('');

// Caso 2: Cambio en concepto
console.log('2️⃣ Caso 2: Cambio en concepto');
const original2 = { monto: 100, concepto: 'Test', recuperado: false };
const current2 = { monto: 100, concepto: 'Test Modificado', recuperado: false };
const result2 = getModifiedFields(original2, current2);
console.log('Resultado:', result2);
console.log('');

// Caso 3: Cambio en recuperado
console.log('3️⃣ Caso 3: Cambio en recuperado');
const original3 = { monto: 100, concepto: 'Test', recuperado: false };
const current3 = { monto: 100, concepto: 'Test', recuperado: true };
const result3 = getModifiedFields(original3, current3);
console.log('Resultado:', result3);
console.log('');

// Caso 4: Cambio en estado (campo adicional)
console.log('4️⃣ Caso 4: Cambio en estado (campo adicional)');
const original4 = { monto: 100, concepto: 'Test', recuperado: false, estado: 'pendiente' };
const current4 = { monto: 100, concepto: 'Test', recuperado: false, estado: 'en_proceso' };
const result4 = getModifiedFields(original4, current4);
console.log('Resultado:', result4);
console.log('');

// Caso 5: Sin cambios
console.log('5️⃣ Caso 5: Sin cambios');
const original5 = { monto: 100, concepto: 'Test', recuperado: false };
const current5 = { monto: 100, concepto: 'Test', recuperado: false };
const result5 = getModifiedFields(original5, current5);
console.log('Resultado:', result5);
console.log('');

// Caso 6: Monto con tipos diferentes
console.log('6️⃣ Caso 6: Monto con tipos diferentes');
const original6 = { monto: 100, concepto: 'Test', recuperado: false };
const current6 = { monto: '100', concepto: 'Test', recuperado: false };
const result6 = getModifiedFields(original6, current6);
console.log('Resultado:', result6);
console.log('');

console.log('🎉 Todas las pruebas completadas');
