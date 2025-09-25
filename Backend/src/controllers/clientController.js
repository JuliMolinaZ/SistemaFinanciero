// controllers/clientController.js - VERSIÓN UNIFICADA CON PRISMA Y POOL DE CONEXIONES
const { prisma, withConnectionRetry } = require('../config/prisma');

exports.getAllClients = async (req, res) => {
  try {
    const clients = await withConnectionRetry(async () => {
      return await prisma.client.findMany({
        orderBy: { nombre: 'asc' }
      });
    });
    
    res.json({
      success: true,
      data: clients,
      total: clients.length
    });
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al obtener clientes',
      details: error.message 
    });
  }
};

exports.getClientById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const client = await prisma.client.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!client) {
      return res.status(404).json({ 
        success: false,
        message: 'Cliente no encontrado' 
      });
    }
    
    res.json({
      success: true,
      data: client
    });
  } catch (error) {
    console.error('Error al obtener cliente:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al obtener cliente',
      details: error.message 
    });
  }
};

exports.createClient = async (req, res) => {
  try {

    const { 
      run_cliente, 
      nombre, 
      rfc, 
      pais,
      estado,
      ciudad,
      direccion,
      telefono,
      email,
      status
    } = req.body;

    // Validar datos requeridos
    if (!run_cliente || !nombre) {

      return res.status(400).json({
        success: false,
        error: 'El RUN del cliente y nombre son requeridos'
      });
    }

    // Verificar si el cliente ya existe
    const existingClient = await prisma.client.findUnique({
      where: { run_cliente }
    });

    if (existingClient) {

      return res.status(409).json({
        success: false,
        error: 'Ya existe un cliente con ese RUN'
      });
    }

    // Verificar que todos los campos estén definidos
    const dataToSend = {
      run_cliente,
      nombre,
      rfc,
      pais: pais || null,
      estado: estado || null,
      ciudad: ciudad || null,
      direccion,
      telefono: telefono || null,
      email: email || null,
      status: status || 'activo'
    };

    const newClient = await prisma.client.create({
      data: dataToSend
    });

    res.status(201).json({
      success: true,
      message: 'Cliente creado exitosamente',
      data: newClient
    });
  } catch (error) {
    console.error('Error al crear cliente:', error);
    
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        error: 'Ya existe un cliente con ese RUN'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Error al crear cliente',
      details: error.message
    });
  }
};

exports.updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Verificar si el cliente existe
    const existingClient = await prisma.client.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingClient) {

      return res.status(404).json({
        success: false,
        message: 'Cliente no encontrado'
      });
    }

    // Si se está actualizando el RUN, verificar que no exista otro cliente con ese RUN
    if (updateData.run_cliente && updateData.run_cliente !== existingClient.run_cliente) {
      const duplicateClient = await prisma.client.findUnique({
        where: { run_cliente: updateData.run_cliente }
      });

      if (duplicateClient) {

        return res.status(409).json({
          success: false,
          error: 'Ya existe otro cliente con ese RUN'
        });
      }
    }

    const updatedClient = await prisma.client.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    res.json({
      success: true,
      message: 'Cliente actualizado exitosamente',
      data: updatedClient
    });
  } catch (error) {
    console.error('❌ Error al actualizar cliente:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Cliente no encontrado'
      });
    }
    
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        error: 'Ya existe otro cliente con ese RUN'
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Error al actualizar cliente',
      details: error.message 
    });
  }
};

exports.deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si el cliente existe
    const existingClient = await prisma.client.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingClient) {
      return res.status(404).json({
        success: false,
        message: 'Cliente no encontrado'
      });
    }

    // Verificar si el cliente tiene proyectos asociados
    const projectsCount = await prisma.project.count({
      where: { cliente_id: parseInt(id) }
    });

    if (projectsCount > 0) {
      return res.status(400).json({
        success: false,
        error: 'No se puede eliminar el cliente porque tiene proyectos asociados',
        details: `Tiene ${projectsCount} proyecto(s) asociado(s)`
      });
    }

    await prisma.client.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      success: true,
      message: 'Cliente eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Cliente no encontrado'
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Error al eliminar cliente',
      details: error.message 
    });
  }
};

// Función para cerrar la conexión de Prisma
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

// Nuevo endpoint para obtener estadísticas de clientes
exports.getClientStats = async (req, res) => {
  try {
    const stats = await withConnectionRetry(async () => {
      const totalClients = await prisma.client.count();
      const activeClients = await prisma.client.count({
        where: { status: 'activo' }
      });
      const inactiveClients = await prisma.client.count({
        where: { status: 'inactivo' }
      });
      
      // Estadísticas por país
      const clientsByCountry = await prisma.client.groupBy({
        by: ['pais'],
        _count: { pais: true },
        where: { pais: { not: null } }
      });
      
      // Estadísticas por estado
      const clientsByState = await prisma.client.groupBy({
        by: ['estado'],
        _count: { estado: true },
        where: { estado: { not: null } }
      });
      
      return {
        total: totalClients,
        active: activeClients,
        inactive: inactiveClients,
        byCountry: clientsByCountry.map(item => ({
          country: item.pais,
          count: item._count.pais
        })),
        byState: clientsByState.map(item => ({
          state: item.estado,
          count: item._count.estado
        }))
      };
    });
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error al obtener estadísticas de clientes:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al obtener estadísticas de clientes',
      details: error.message 
    });
  }
};