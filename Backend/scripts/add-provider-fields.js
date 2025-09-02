const { prisma } = require('../src/config/database');

async function addProviderFields() {
  try {
    console.log('🔍 Verificando campos de la tabla proveedores...');
    
    // Verificar la estructura actual
    const currentStructure = await prisma.$queryRaw`
      DESCRIBE proveedores
    `;
    
    console.log('📋 Estructura actual:', currentStructure);
    
    // Lista de campos que necesitamos agregar
    const fieldsToAdd = [
      {
        name: 'telefono',
        type: 'VARCHAR(50)',
        nullable: true,
        description: 'Teléfono del proveedor'
      },
      {
        name: 'email',
        type: 'VARCHAR(255)',
        nullable: true,
        description: 'Email del proveedor'
      },
      {
        name: 'tipo_proveedor',
        type: 'ENUM("servicio", "producto")',
        nullable: true,
        default: 'producto',
        description: 'Tipo de proveedor (servicio o producto)'
      },
      {
        name: 'estado',
        type: 'ENUM("activo", "inactivo")',
        nullable: true,
        default: 'activo',
        description: 'Estado del proveedor'
      }
    ];
    
    // Agregar cada campo si no existe
    for (const field of fieldsToAdd) {
      try {
        if (field.type.includes('ENUM')) {
          // Para campos ENUM, necesitamos crear el tipo primero
          if (field.name === 'tipo_proveedor') {
            await prisma.$executeRaw`
              ALTER TABLE proveedores 
              ADD COLUMN ${field.name} ENUM('servicio', 'producto') 
              DEFAULT 'producto' 
              COMMENT '${field.description}'
            `;
            console.log(`✅ Campo ${field.name} agregado correctamente`);
          } else if (field.name === 'estado') {
            await prisma.$executeRaw`
              ALTER TABLE proveedores 
              ADD COLUMN ${field.name} ENUM('activo', 'inactivo') 
              DEFAULT 'activo' 
              COMMENT '${field.description}'
            `;
            console.log(`✅ Campo ${field.name} agregado correctamente`);
          }
        } else {
          // Para campos normales
          await prisma.$executeRaw`
            ALTER TABLE proveedores 
            ADD COLUMN ${field.name} ${field.type} 
            ${field.nullable ? 'NULL' : 'NOT NULL'}
            ${field.default ? `DEFAULT '${field.default}'` : ''}
            COMMENT '${field.description}'
          `;
          console.log(`✅ Campo ${field.name} agregado correctamente`);
        }
      } catch (error) {
        if (error.message.includes('Duplicate column name')) {
          console.log(`ℹ️ Campo ${field.name} ya existe, saltando...`);
        } else {
          console.error(`❌ Error al agregar campo ${field.name}:`, error.message);
        }
      }
    }
    
    // Verificar la estructura final
    const finalStructure = await prisma.$queryRaw`
      DESCRIBE proveedores
    `;
    
    console.log('📋 Estructura final:', finalStructure);
    
    // Actualizar algunos registros existentes con valores por defecto
    try {
      await prisma.$executeRaw`
        UPDATE proveedores 
        SET tipo_proveedor = 'producto' 
        WHERE tipo_proveedor IS NULL
      `;
      console.log('✅ Valores por defecto para tipo_proveedor actualizados');
      
      await prisma.$executeRaw`
        UPDATE proveedores 
        SET estado = 'activo' 
        WHERE estado IS NULL
      `;
      console.log('✅ Valores por defecto para estado actualizados');
      
    } catch (error) {
      console.log('ℹ️ No se pudieron actualizar valores por defecto:', error.message);
    }
    
    console.log('🎉 Migración de campos de proveedores completada exitosamente');
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la migración
addProviderFields();
