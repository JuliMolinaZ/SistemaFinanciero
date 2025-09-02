// Script para restaurar datos básicos del sistema
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function restoreBasicData() {
  try {
    console.log('🔄 Iniciando restauración de datos básicos...');
    
    // 1. Crear roles básicos
    console.log('👑 Creando roles básicos...');
    const roles = [
      { name: 'Administrador' },
      { name: 'Usuario' },
      { name: 'Juan Carlos' }
    ];
    
    for (const role of roles) {
      const existingRole = await prisma.roles.findFirst({
        where: { name: role.name }
      });
      
      if (!existingRole) {
        await prisma.roles.create({
          data: role
        });
        console.log(`✅ Rol creado: ${role.name}`);
      } else {
        console.log(`ℹ️  Rol ya existe: ${role.name}`);
      }
    }
    
    // 2. Crear permisos básicos
    console.log('🔐 Creando permisos básicos...');
    const permisos = [
      { modulo: 'usuarios', acceso_administrador: 1 },
      { modulo: 'clientes', acceso_administrador: 1 },
      { modulo: 'proyectos', acceso_administrador: 1 },
      { modulo: 'contabilidad', acceso_administrador: 1 },
      { modulo: 'costos_fijos', acceso_administrador: 1 },
      { modulo: 'cotizaciones', acceso_administrador: 1 },
      { modulo: 'cuentas_por_cobrar', acceso_administrador: 1 },
      { modulo: 'cuentas_por_pagar', acceso_administrador: 1 },
      { modulo: 'proveedores', acceso_administrador: 1 },
      { modulo: 'categorias', acceso_administrador: 1 },
      { modulo: 'fases', acceso_administrador: 1 },
      { modulo: 'permisos', acceso_administrador: 1 }
    ];
    
    for (const permiso of permisos) {
      const existingPermiso = await prisma.permisos.findFirst({
        where: { modulo: permiso.modulo }
      });
      
      if (!existingPermiso) {
        await prisma.permisos.create({
          data: permiso
        });
        console.log(`✅ Permiso creado: ${permiso.modulo}`);
      } else {
        console.log(`ℹ️  Permiso ya existe: ${permiso.modulo}`);
      }
    }
    
    // 3. Crear usuario administrador
    console.log('👤 Creando usuario administrador...');
    const adminUser = await prisma.users.findFirst({
      where: { email: 'admin@runsolutions.com' }
    });
    
    if (!adminUser) {
      await prisma.users.create({
        data: {
          email: 'admin@runsolutions.com',
          name: 'Administrador del Sistema',
          role: 'Administrador',
          firebase_uid: 'admin-system-uid'
        }
      });
      console.log('✅ Usuario administrador creado');
    } else {
      console.log('ℹ️  Usuario administrador ya existe');
    }
    
    // 4. Crear algunos clientes de ejemplo
    console.log('🏢 Creando clientes de ejemplo...');
    const clientes = [
      {
        run_cliente: 'R107',
        nombre: 'RAYMOND',
        rfc: 'CRM9307216Z4',
        direccion: 'Desarrollo Montaña 2000, Sección III, 76150 Santiago de Querétaro, Qro',
        pais: 'México',
        estado: 'Querétaro',
        ciudad: 'Santiago de Querétaro'
      },
      {
        run_cliente: 'RCM03',
        nombre: 'INSTALACIONES PROFESIONALES Y SERVICIOS',
        rfc: 'IPS100803CY4',
        direccion: 'CARRETERA QUERETARO SAN LUIS POTOSI #24100 INT 1 COL AMPLIACION NUEVO SANTA CATARINA, SANTA CATARINA, QUERETARO',
        pais: 'México',
        estado: 'Querétaro',
        ciudad: 'Santa Catarina'
      }
    ];
    
    for (const cliente of clientes) {
      const existingCliente = await prisma.client.findFirst({
        where: { run_cliente: cliente.run_cliente }
      });
      
      if (!existingCliente) {
        await prisma.client.create({
          data: cliente
        });
        console.log(`✅ Cliente creado: ${cliente.nombre}`);
      } else {
        console.log(`ℹ️  Cliente ya existe: ${cliente.nombre}`);
      }
    }
    
    console.log('🎉 Restauración de datos básicos completada exitosamente!');
    
  } catch (error) {
    console.error('❌ Error durante la restauración:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la restauración
restoreBasicData();
