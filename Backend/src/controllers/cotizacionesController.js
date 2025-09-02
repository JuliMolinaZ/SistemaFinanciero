// controllers/cotizacionesController.js

const { prisma } = require('../config/database');
const path = require('path');
const fs = require('fs');

// Función para obtener el nombre del cliente por ID
const getClientNameById = async (clientId) => {
  try {
    const client = await prisma.client.findUnique({
      where: { id: parseInt(clientId) },
      select: { nombre: true }
    });
    return client ? client.nombre : 'Cliente desconocido';
  } catch (error) {
    console.error('Error al obtener nombre del cliente:', error);
    return 'Cliente desconocido';
  }
};

// Función para verificar si existe una cuenta por cobrar
const cuentaCobrarExists = async (cotizacionId, proyectoId, clientName) => {
  try {
    const cuenta = await prisma.cuentaCobrar.findFirst({
      where: {
        proyecto_id: parseInt(proyectoId),
        concepto: {
          contains: clientName
        }
      }
    });
    return !!cuenta;
  } catch (error) {
    console.error('Error al verificar cuenta por cobrar:', error);
    return false;
  }
};

// Obtener todas las cotizaciones
exports.getAllCotizaciones = async (req, res) => {
  try {
    const { page = 1, limit = 50, fecha_inicio, fecha_fin, cliente, estado } = req.query;
    const offset = (page - 1) * limit;

    // Construir filtros
    let whereClause = {};
    
    if (fecha_inicio && fecha_fin) {
      whereClause.created_at = {
        gte: new Date(fecha_inicio),
        lte: new Date(fecha_fin)
      };
    }
    
    if (cliente) {
      whereClause.cliente = { contains: cliente, mode: 'insensitive' };
    }
    
    if (estado) {
      whereClause.estado = estado;
    }

    const [cotizaciones, total] = await Promise.all([
      prisma.cotizacion.findMany({
        where: whereClause,
        orderBy: { created_at: 'desc' },
        skip: offset,
        take: parseInt(limit)
      }),
      prisma.cotizacion.count({ where: whereClause })
    ]);

    res.json({
      success: true,
      data: cotizaciones,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      message: 'Cotizaciones obtenidas exitosamente'
    });
  } catch (error) {
    console.error('Error al obtener cotizaciones:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Error al obtener cotizaciones'
    });
  }
};

// Obtener una cotización por ID
exports.getCotizacionById = async (req, res) => {
  try {
    const { id } = req.params;
    const cotizacion = await prisma.cotizacion.findUnique({
      where: { id: parseInt(id) }
    });

    if (!cotizacion) {
      return res.status(404).json({ 
        success: false, 
        message: 'Cotización no encontrada' 
      });
    }

    res.json({
      success: true,
      data: cotizacion,
      message: 'Cotización obtenida exitosamente'
    });
  } catch (error) {
    console.error('Error al obtener cotización:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Error al obtener cotización'
    });
  }
};

// Crear una nueva cotización
exports.createCotizacion = async (req, res) => {
  try {
    const { cliente, proyecto, monto_neto, monto_con_iva, descripcion, documento, estado } = req.body;

    if (!cliente || !proyecto || !monto_neto || !monto_con_iva) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cliente, proyecto, monto neto y monto con IVA son requeridos' 
      });
    }

    const cotizacion = await prisma.cotizacion.create({
      data: {
        cliente: cliente.trim(),
        proyecto: proyecto.trim(),
        monto_neto: parseFloat(monto_neto),
        monto_con_iva: parseFloat(monto_con_iva),
        descripcion: descripcion?.trim() || '',
        documento: documento?.trim() || '',
        estado: estado?.trim() || 'No_creada'
      }
    });

    res.status(201).json({
      success: true,
      data: cotizacion,
      message: 'Cotización creada exitosamente'
    });
  } catch (error) {
    console.error('Error al crear cotización:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Error al crear cotización'
    });
  }
};

// Actualizar una cotización
exports.updateCotizacion = async (req, res) => {
  try {
    const { id } = req.params;
    const { cliente, proyecto, monto_neto, monto_con_iva, descripcion, documento, estado } = req.body;

    // Verificar si existe la cotización
    const cotizacionExistente = await prisma.cotizacion.findUnique({
      where: { id: parseInt(id) }
    });

    if (!cotizacionExistente) {
      return res.status(404).json({ 
        success: false, 
        message: 'Cotización no encontrada' 
      });
    }

    const cotizacion = await prisma.cotizacion.update({
      where: { id: parseInt(id) },
      data: {
        cliente: cliente?.trim(),
        proyecto: proyecto?.trim(),
        monto_neto: parseFloat(monto_neto) || 0,
        monto_con_iva: parseFloat(monto_con_iva) || 0,
        descripcion: descripcion?.trim(),
        documento: documento?.trim(),
        estado: estado?.trim()
      }
    });

    res.json({
      success: true,
      data: cotizacion,
      message: 'Cotización actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar cotización:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Error al actualizar cotización'
    });
  }
};

// Eliminar una cotización
exports.deleteCotizacion = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si existe la cotización
    const cotizacionExistente = await prisma.cotizacion.findUnique({
      where: { id: parseInt(id) }
    });

    if (!cotizacionExistente) {
      return res.status(404).json({ 
        success: false, 
        message: 'Cotización no encontrada' 
      });
    }

    await prisma.cotizacion.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      success: true,
      message: 'Cotización eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar cotización:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Error al eliminar cotización'
    });
  }
};e
