// Script para crear la tabla de impuestos e IMSS
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createImpuestosIMSSTable() {
  try {

    // Verificar si la tabla ya existe
    const existingTable = await prisma.$queryRaw`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = 'runsolutions_runite' 
      AND TABLE_NAME = 'impuestos_imss'
    `;
    
    if (existingTable.length > 0) {

      return;
    }
    
    // Crear la tabla
    await prisma.$executeRaw`
      CREATE TABLE impuestos_imss (
        id INT AUTO_INCREMENT PRIMARY KEY,
        concepto VARCHAR(255) NOT NULL,
        tipo_impuesto VARCHAR(100) NOT NULL,
        monto_base DECIMAL(10,2),
        monto_impuesto DECIMAL(10,2),
        monto_total DECIMAL(10,2) NOT NULL,
        fecha_vencimiento DATE,
        fecha_pago DATE,
        estado VARCHAR(50) DEFAULT 'pendiente',
        periodo VARCHAR(50) NOT NULL,
        proveedor_id INT,
        factura_pdf VARCHAR(255),
        factura_xml VARCHAR(255),
        comentarios TEXT,
        autorizado BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX impuestos_imss_proveedor_id_idx (proveedor_id),
        FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE NO ACTION ON UPDATE NO ACTION
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;

    // Insertar algunos datos de ejemplo
    const sampleData = [
      {
        concepto: 'ISR Mensual Enero 2024',
        tipo_impuesto: 'ISR',
        monto_base: 50000.00,
        monto_impuesto: 5000.00,
        monto_total: 55000.00,
        fecha_vencimiento: '2024-02-17',
        periodo: 'Enero 2024',
        estado: 'pendiente',
        comentarios: 'ISR retenido a empleados'
      },
      {
        concepto: 'IVA Mensual Enero 2024',
        tipo_impuesto: 'IVA',
        monto_base: 100000.00,
        monto_impuesto: 16000.00,
        monto_total: 116000.00,
        fecha_vencimiento: '2024-02-17',
        periodo: 'Enero 2024',
        estado: 'pendiente',
        comentarios: 'IVA retenido de facturas'
      },
      {
        concepto: 'Cuotas IMSS Enero 2024',
        tipo_impuesto: 'IMSS',
        monto_base: 25000.00,
        monto_impuesto: 3750.00,
        monto_total: 28750.00,
        fecha_vencimiento: '2024-02-17',
        periodo: 'Enero 2024',
        estado: 'pendiente',
        comentarios: 'Cuotas patronales IMSS'
      },
      {
        concepto: 'INFONAVIT Enero 2024',
        tipo_impuesto: 'INFONAVIT',
        monto_base: 15000.00,
        monto_impuesto: 1500.00,
        monto_total: 16500.00,
        fecha_vencimiento: '2024-02-17',
        periodo: 'Enero 2024',
        estado: 'pendiente',
        comentarios: 'Cuotas patronales INFONAVIT'
      }
    ];
    
    for (const data of sampleData) {
      await prisma.$executeRaw`
        INSERT INTO impuestos_imss (
          concepto, tipo_impuesto, monto_base, monto_impuesto, monto_total, 
          fecha_vencimiento, periodo, estado, comentarios
        ) VALUES (
          ${data.concepto}, ${data.tipo_impuesto}, ${data.monto_base}, 
          ${data.monto_impuesto}, ${data.monto_total}, ${data.fecha_vencimiento}, 
          ${data.periodo}, ${data.estado}, ${data.comentarios}
        )
      `;

    }

    // Verificar la creación
    const count = await prisma.$queryRaw`SELECT COUNT(*) as total FROM impuestos_imss`;

  } catch (error) {
    console.error('❌ Error durante la creación de la tabla:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
if (require.main === module) {
  createImpuestosIMSSTable()
    .then(() => {

      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error en la ejecución del script:', error);
      process.exit(1);
    });
}

module.exports = { createImpuestosIMSSTable };
