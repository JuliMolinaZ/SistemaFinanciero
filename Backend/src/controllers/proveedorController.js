const { prisma } = require('../config/database');

// Obtener todos los proveedores
exports.getAllProveedores = async (req, res) => {
  try {
    const proveedores = await prisma.provider.findMany({
      orderBy: {
        nombre: 'asc'
      }
    });

    res.json({
      success: true,
      data: proveedores,
      message: 'Proveedores obtenidos exitosamente'
    });
  } catch (error) {
    console.error('Error al obtener proveedores:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Error al obtener proveedores'
    });
  }
};

// Obtener un proveedor por ID
exports.getProveedorById = async (req, res) => {
  try {
    const { id } = req.params;
    const proveedor = await prisma.provider.findUnique({
      where: { id: parseInt(id) }
    });

    if (!proveedor) {
      return res.status(404).json({ 
        success: false, 
        message: 'Proveedor no encontrado' 
      });
    }

    res.json({
      success: true,
      data: proveedor,
      message: 'Proveedor obtenido exitosamente'
    });
  } catch (error) {
    console.error('Error al obtener proveedor:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Error al obtener proveedor'
    });
  }
};

// Crear un nuevo proveedor
exports.createProveedor = async (req, res) => {
  try {
    const { 
      nombre, 
      run_proveedor, 
      direccion, 
      elemento, 
      datos_bancarios, 
      contacto,
      telefono,
      email,
      tipo_proveedor,
      estado
    } = req.body;

    const proveedor = await prisma.provider.create({
      data: {
        nombre: nombre?.trim(),
        run_proveedor: run_proveedor?.trim() || null,
        direccion: direccion?.trim() || null,
        elemento: elemento?.trim() || '',
        datos_bancarios: datos_bancarios?.trim() || '',
        contacto: contacto?.trim() || '',
        telefono: telefono?.trim() || null,
        email: email?.trim() || null,
        tipo_proveedor: tipo_proveedor || 'producto',
        estado: estado || 'activo'
      }
    });

    res.status(201).json({
      success: true,
      data: proveedor,
      message: 'Proveedor creado exitosamente'
    });
  } catch (error) {
    console.error('Error al crear proveedor:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Error al crear proveedor'
    });
  }
};

// Actualizar un proveedor
exports.updateProveedor = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      nombre, 
      run_proveedor, 
      direccion, 
      elemento, 
      datos_bancarios, 
      contacto,
      telefono,
      email,
      tipo_proveedor,
      estado
    } = req.body;



    // Verificar si existe el proveedor
    const proveedorExistente = await prisma.provider.findUnique({
      where: { id: parseInt(id) }
    });

    if (!proveedorExistente) {
      return res.status(404).json({ 
        success: false, 
        message: 'Proveedor no encontrado' 
      });
    }

    const updateData = {};
    
    // Solo incluir campos que se envían en el request
    if (nombre !== undefined) updateData.nombre = nombre?.trim();
    if (run_proveedor !== undefined) updateData.run_proveedor = run_proveedor?.trim();
    if (direccion !== undefined) updateData.direccion = direccion?.trim();
    if (elemento !== undefined) updateData.elemento = elemento?.trim();
    if (datos_bancarios !== undefined) updateData.datos_bancarios = datos_bancarios?.trim();
    if (contacto !== undefined) updateData.contacto = contacto?.trim();
    if (telefono !== undefined) updateData.telefono = telefono?.trim();
    if (email !== undefined) updateData.email = email?.trim();
    if (tipo_proveedor !== undefined) updateData.tipo_proveedor = tipo_proveedor;
    if (estado !== undefined) updateData.estado = estado;

    const proveedor = await prisma.provider.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    res.json({
      success: true,
      data: proveedor,
      message: 'Proveedor actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar proveedor:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Error al actualizar proveedor'
    });
  }
};

// Eliminar un proveedor
exports.deleteProveedor = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si existe el proveedor
    const proveedorExistente = await prisma.provider.findUnique({
      where: { id: parseInt(id) }
    });

    if (!proveedorExistente) {
      return res.status(404).json({ 
        success: false, 
        message: 'Proveedor no encontrado' 
      });
    }

    await prisma.provider.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      success: true,
      message: 'Proveedor eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar proveedor:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Error al eliminar proveedor'
    });
  }
};
