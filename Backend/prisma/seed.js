const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {

  try {
    // Crear roles básicos

    const roles = [
      { name: 'juan carlos' },
      { name: 'administrador' },
      { name: 'usuario' },
      { name: 'defaultRole' }
    ];

    for (const role of roles) {
      const existingRole = await prisma.roles.findUnique({
        where: { name: role.name }
      });

      if (!existingRole) {
        await prisma.roles.create({
          data: role
        });

      } else {

      }
    }

    // Crear permisos básicos

    const permisos = [
      { modulo: 'usuarios', acceso_administrador: true },
      { modulo: 'roles', acceso_administrador: true },
      { modulo: 'permisos', acceso_administrador: true },
      { modulo: 'clientes', acceso_administrador: true },
      { modulo: 'proyectos', acceso_administrador: true },
      { modulo: 'proveedores', acceso_administrador: true },
      { modulo: 'cuentas_pagar', acceso_administrador: true },
      { modulo: 'cuentas_cobrar', acceso_administrador: true },
      { modulo: 'contabilidad', acceso_administrador: true },
      { modulo: 'categorias', acceso_administrador: true },
      { modulo: 'fases', acceso_administrador: true },
      { modulo: 'costos_fijos', acceso_administrador: true },
      { modulo: 'cotizaciones', acceso_administrador: true },
      { modulo: 'assets', acceso_administrador: true },
      { modulo: 'complementos_pago', acceso_administrador: true },
      { modulo: 'emitidas', acceso_administrador: true },
      { modulo: 'flow_recovery', acceso_administrador: true },
      { modulo: 'recuperacion', acceso_administrador: true },
      { modulo: 'security', acceso_administrador: true }
    ];

    for (const permiso of permisos) {
      const existingPermiso = await prisma.permisos.findFirst({
        where: { modulo: permiso.modulo }
      });

      if (!existingPermiso) {
        await prisma.permisos.create({
          data: permiso
        });

      } else {

      }
    }

    // Crear usuario administrador por defecto si no existe

    const adminUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: 'admin@sistema.com' },
          { firebase_uid: 'admin_default' }
        ]
      }
    });

    if (!adminUser) {
      await prisma.user.create({
        data: {
          firebase_uid: 'admin_default',
          email: 'admin@sistema.com',
          name: 'Administrador del Sistema',
          role: 'juan carlos',
          avatar: null
        }
      });

    } else {

    }

    // Mostrar resumen
    const userCount = await prisma.user.count();
    const rolesCount = await prisma.roles.count();
    const permisosCount = await prisma.permisos.count();

  } catch (error) {
    console.error('❌ Error insertando datos iniciales:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();

  }); 