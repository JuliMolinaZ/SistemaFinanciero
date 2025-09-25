const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Obtener datos financieros del dashboard
router.get('/finanzas', async (req, res) => {
  try {
    res.json({
      ingresos: 125000.50,
      egresos: 87500.25,
      balance: 37500.25,
      margen: 30.0,
      crecimiento: 15.3,
      proyeccion: 143750
    });
  } catch (error) {
    console.error('Error obteniendo datos financieros:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener datos de proyectos del dashboard
router.get('/proyectos', async (req, res) => {
  try {
    // Obtener total de proyectos
    const totalProyectos = await prisma.proyectos.count();
    
    // Obtener proyectos por estado
    const proyectosPorEstado = await prisma.proyectos.groupBy({
      by: ['status'],
      _count: {
        id: true
      }
    });

    // Obtener proyectos por cliente
    const proyectosPorCliente = await prisma.proyectos.groupBy({
      by: ['clienteId'],
      _count: {
        id: true
      }
    });

    // Obtener nombres de clientes
    const clientes = await prisma.clientes.findMany({
      select: {
        id: true,
        nombre: true
      }
    });

    // Mapear proyectos por cliente con nombres
    const proyectosPorClienteMap = {};
    proyectosPorCliente.forEach(proyecto => {
      const cliente = clientes.find(c => c.id === proyecto.clienteId);
      if (cliente) {
        proyectosPorClienteMap[cliente.nombre] = proyecto._count.id;
      }
    });

    // Obtener valor total de proyectos
    const valorTotal = await prisma.proyectos.aggregate({
      _sum: {
        valor: true
      }
    });

    // Calcular promedio por proyecto
    const promedioPorProyecto = totalProyectos > 0 
      ? Math.round((valorTotal._sum.valor || 0) / totalProyectos) 
      : 0;

    // Obtener crecimiento mensual (últimos 6 meses)
    const crecimientoMensual = {};
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'];
    
    for (let i = 5; i >= 0; i--) {
      const fechaInicio = new Date(new Date().getFullYear(), new Date().getMonth() - i, 1);
      const fechaFin = new Date(new Date().getFullYear(), new Date().getMonth() - i + 1, 0);
      
      const count = await prisma.proyectos.count({
        where: {
          fechaCreacion: {
            gte: fechaInicio,
            lte: fechaFin
          }
        }
      });
      
      crecimientoMensual[meses[5-i]] = count;
    }

    res.json({
      total: totalProyectos,
      activos: proyectosPorEstado.find(p => p.status === 'Activo')?._count.id || 0,
      completados: proyectosPorEstado.find(p => p.status === 'Completado')?._count.id || 0,
      pausados: proyectosPorEstado.find(p => p.status === 'Pausado')?._count.id || 0,
      valorTotal: valorTotal._sum.valor || 0,
      promedioPorProyecto: promedioPorProyecto,
      porCliente: proyectosPorClienteMap,
      porEstado: proyectosPorEstado.reduce((acc, estado) => {
        acc[estado.status] = estado._count.id;
        return acc;
      }, {}),
      crecimientoMensual: crecimientoMensual
    });
  } catch (error) {
    console.error('Error obteniendo datos de proyectos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener datos de usuarios del dashboard
router.get('/usuarios', async (req, res) => {
  try {
    // Obtener total de usuarios
    const totalUsuarios = await prisma.usuarios.count();
    
    // Obtener usuarios activos
    const usuariosActivos = await prisma.usuarios.count({
      where: {
        status: 'Activo'
      }
    });

    // Obtener usuarios por rol
    const usuariosPorRol = await prisma.usuarios.groupBy({
      by: ['rol'],
      _count: {
        id: true
      }
    });

    // Calcular eficiencia (usuarios activos vs total)
    const eficiencia = totalUsuarios > 0 ? ((usuariosActivos / totalUsuarios) * 100) : 0;

    res.json({
      total: totalUsuarios,
      activos: usuariosActivos,
      inactivos: totalUsuarios - usuariosActivos,
      eficiencia: parseFloat(eficiencia.toFixed(1)),
      porRol: usuariosPorRol.reduce((acc, usuario) => {
        acc[usuario.rol] = usuario._count.id;
        return acc;
      }, {})
    });
  } catch (error) {
    console.error('Error obteniendo datos de usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener datos de clientes del dashboard
router.get('/clientes', async (req, res) => {
  try {
    // Obtener total de clientes
    const totalClientes = await prisma.clientes.count();
    
    // Obtener clientes activos
    const clientesActivos = await prisma.clientes.count({
      where: {
        status: 'Activo'
      }
    });

    // Obtener clientes por industria
    const clientesPorIndustria = await prisma.clientes.groupBy({
      by: ['industria'],
      _count: {
        id: true
      }
    });

    // Calcular retención (clientes activos vs total)
    const retencion = totalClientes > 0 ? ((clientesActivos / totalClientes) * 100) : 0;

    // Obtener crecimiento mensual (últimos 6 meses)
    const crecimientoMensual = {};
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'];
    
    for (let i = 5; i >= 0; i--) {
      const fechaInicio = new Date(new Date().getFullYear(), new Date().getMonth() - i, 1);
      const fechaFin = new Date(new Date().getFullYear(), new Date().getMonth() - i + 1, 0);
      
      const count = await prisma.clientes.count({
        where: {
          fechaRegistro: {
            gte: fechaInicio,
            lte: fechaFin
          }
        }
      });
      
      crecimientoMensual[meses[5-i]] = count;
    }

    res.json({
      total: totalClientes,
      activos: clientesActivos,
      inactivos: totalClientes - clientesActivos,
      retencion: parseFloat(retencion.toFixed(1)),
      porIndustria: clientesPorIndustria.reduce((acc, cliente) => {
        acc[cliente.industria] = cliente._count.id;
        return acc;
      }, {}),
      crecimientoMensual: crecimientoMensual
    });
  } catch (error) {
    console.error('Error obteniendo datos de clientes:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener datos de proveedores del dashboard
router.get('/proveedores', async (req, res) => {
  try {
    // Obtener total de proveedores
    const totalProveedores = await prisma.proveedores.count();
    
    // Obtener proveedores activos
    const proveedoresActivos = await prisma.proveedores.count({
      where: {
        status: 'Activo'
      }
    });

    // Obtener proveedores por tipo
    const proveedoresPorTipo = await prisma.proveedores.groupBy({
      by: ['tipo'],
      _count: {
        id: true
      }
    });

    // Obtener proveedores por categoría
    const proveedoresPorCategoria = await prisma.proveedores.groupBy({
      by: ['categoria'],
      _count: {
        id: true
      }
    });

    res.json({
      total: totalProveedores,
      activos: proveedoresActivos,
      inactivos: totalProveedores - proveedoresActivos,
      porTipo: proveedoresPorTipo.reduce((acc, proveedor) => {
        acc[proveedor.tipo] = proveedor._count.id;
        return acc;
      }, {}),
      porCategoria: proveedoresPorCategoria.reduce((acc, proveedor) => {
        acc[proveedor.categoria] = proveedor._count.id;
        return acc;
      }, {})
    });
  } catch (error) {
    console.error('Error obteniendo datos de proveedores:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener métricas de rendimiento del dashboard
router.get('/rendimiento', async (req, res) => {
  try {
    // Calcular eficiencia del sistema (basado en proyectos completados vs total)
    const proyectosCompletados = await prisma.proyectos.count({
      where: {
        status: 'Completado'
      }
    });
    
    const totalProyectos = await prisma.proyectos.count();
    const eficienciaSistema = totalProyectos > 0 ? ((proyectosCompletados / totalProyectos) * 100) : 0;

    // Tiempo de respuesta promedio (simulado)
    const tiempoRespuesta = 0.8;

    // Disponibilidad del sistema (simulado)
    const disponibilidad = 99.1;

    // Satisfacción del usuario (simulado)
    const satisfaccionUsuario = 4.6;

    res.json({
      eficienciaSistema: parseFloat(eficienciaSistema.toFixed(1)),
      tiempoRespuesta: tiempoRespuesta,
      disponibilidad: disponibilidad,
      satisfaccionUsuario: satisfaccionUsuario
    });
  } catch (error) {
    console.error('Error obteniendo métricas de rendimiento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
