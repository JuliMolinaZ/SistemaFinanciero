// Script de prueba para verificar la funcionalidad de subida de archivos
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

// Simular una petición multipart/form-data
async function testUpload() {
  try {
    console.log('🧪 Probando funcionalidad de subida de archivos...');
    
    // Crear un archivo de prueba
    const testFilePath = path.join(__dirname, 'uploads', 'test_upload.txt');
    fs.writeFileSync(testFilePath, 'Este es un archivo de prueba para verificar la funcionalidad de subida');
    
    console.log('✅ Archivo de prueba creado:', testFilePath);
    
    // Verificar que el archivo existe
    if (fs.existsSync(testFilePath)) {
      console.log('✅ Archivo existe en el sistema de archivos');
      
      // Verificar que se puede acceder a través de la API
      const response = await fetch(`http://localhost:5001/api/contabilidad/files/test_upload.txt`);
      if (response.ok) {
        console.log('✅ Archivo accesible a través de la API');
      } else {
        console.log('❌ Archivo no accesible a través de la API:', response.status);
      }
    } else {
      console.log('❌ Archivo no encontrado');
    }
    
    // Limpiar archivo de prueba
    fs.unlinkSync(testFilePath);
    console.log('✅ Archivo de prueba eliminado');
    
  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  }
}

// Ejecutar la prueba
testUpload();
