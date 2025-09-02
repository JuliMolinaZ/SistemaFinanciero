// controllers/permisosController.js - VERSIÓN UNIFICADA CON PRISMA
const { prisma } = require('../config/database');

const permisosController = {
  // Obtener todos los permisos
  getPermisos: async (req, res) => {
    try {
      const permisos = await prisma.permisos.findMany({
        orderBy: { id: 'asc' }
      });
      
      res.json({
        success: true,
        data: permisos,
        total: permisos.length
      });
    } catch (error) {
      console.error('Error al obtener permisos:', error);
      res.status(500).json({ 
        success: false,
        error: 'Error al obtener permisos',
        details: error.message 
      });
    }
  },

  // Actualizar el permiso usando el id
  updatePermiso: async (req, res) => {
    try {
      const { id } = req.params;
      const { acceso_administrador } = req.body;
      
      const permiso = await prisma.permisos.update({
        where: { id: parseInt(id) },
        data: { acceso_administrador }
      });
      
      res.json({ 
        success: true,
        message: 'Permiso actualizado correctamente', 
        data: permiso 
      });
    } catch (error) {
      console.error('Error al actualizar permiso:', error);
      
      if (error.code === 'P2025') {
        return res.status(404).json({ 
          success: false,
          error: 'Módulo no encontrado' 
        });
      }
      
      res.status(500).json({ 
        success: false,
        error: 'Error al actualizar permiso',
        details: error.message 
      });
    }
  },

  // Crear nuevo permiso
  createPermiso: async (req, res) => {
    try {
      const { modulo, acceso_administrador } = req.body;
      
      if (!modulo) {
        return res.status(400).json({
          success: false,
          error: 'El nombre del módulo es requerido'
        });
      }

      const permiso = await prisma.permisos.create({
        data: {
          modulo,
          acceso_administrador: acceso_administrador || false
        }
      });

      res.status(201).json({
        success: true,
        message: 'Permiso creado exitosamente',
        data: permiso
      });
    } catch (error) {
      console.error('Error al crear permiso:', error);
      
      if (error.code === 'P2002') {
        return res.status(409).json({
          success: false,
          error: 'Ya existe un permiso para ese módulo'
        });
      }
      
      res.status(500).json({ 
        success: false,
        error: 'Error al crear permiso',
        details: error.message 
      });
    }
  },

  // Eliminar permiso
  deletePermiso: async (req, res) => {
    try {
      const { id } = req.params;
      
      await prisma.permisos.delete({
        where: { id: parseInt(id) }
      });

      res.json({
        success: true,
        message: 'Permiso eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error al eliminar permiso:', error);
      
      if (error.code === 'P2025') {
        return res.status(404).json({
          success: false,
          error: 'Permiso no encontrado'
        });
      }
      
      res.status(500).json({ 
        success: false,
        error: 'Error al eliminar permiso',
        details: error.message 
      });
    }
  }
};

module.exports = permisosController;
