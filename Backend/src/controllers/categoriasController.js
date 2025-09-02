// controllers/categoriasController.js
const { prisma } = require('../config/database');

// Obtener todas las categorías
exports.getAllCategorias = async (req, res) => {
  try {
    const categorias = await prisma.categoria.findMany({
      orderBy: {
        nombre: 'asc'
      }
    });

    res.json({
      success: true,
      data: categorias,
      message: 'Categorías obtenidas exitosamente'
    });
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Error al obtener categorías'
    });
  }
};

// Obtener una categoría por ID
exports.getCategoriaById = async (req, res) => {
  try {
    const { id } = req.params;
    const categoria = await prisma.categoria.findUnique({
      where: { id: parseInt(id) }
    });

    if (!categoria) {
      return res.status(404).json({ 
        success: false, 
        message: 'Categoría no encontrada' 
      });
    }

    res.json({
      success: true,
      data: categoria,
      message: 'Categoría obtenida exitosamente'
    });
  } catch (error) {
    console.error('Error al obtener categoría:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Error al obtener categoría'
    });
  }
};

// Crear una nueva categoría
exports.createCategoria = async (req, res) => {
  try {
    const { nombre, descripcion, tipo, estado, color } = req.body;

    if (!nombre || !nombre.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: 'El nombre de la categoría es requerido' 
      });
    }

    // Verificar si ya existe una categoría con el mismo nombre
    const categoriaExistente = await prisma.categoria.findFirst({
      where: { nombre: nombre.trim() }
    });

    if (categoriaExistente) {
      return res.status(400).json({ 
        success: false, 
        message: 'Ya existe una categoría con ese nombre' 
      });
    }

    const categoria = await prisma.categoria.create({
      data: {
        nombre: nombre.trim(),
        descripcion: descripcion?.trim() || null,
        tipo: tipo || 'producto',
        estado: estado || 'activa',
        color: color || '#667eea'
      }
    });

    res.status(201).json({
      success: true,
      data: categoria,
      message: 'Categoría creada exitosamente'
    });
  } catch (error) {
    console.error('Error al crear categoría:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Error al crear categoría'
    });
  }
};

// Actualizar una categoría
exports.updateCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, tipo, estado, color } = req.body;

    if (!nombre || !nombre.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: 'El nombre de la categoría es requerido' 
      });
    }

    // Verificar si existe la categoría
    const categoriaExistente = await prisma.categoria.findUnique({
      where: { id: parseInt(id) }
    });

    if (!categoriaExistente) {
      return res.status(404).json({ 
        success: false, 
        message: 'Categoría no encontrada' 
      });
    }

    // Verificar si ya existe otra categoría con el mismo nombre
    const categoriaDuplicada = await prisma.categoria.findFirst({
      where: { 
        nombre: nombre.trim(),
        id: { not: parseInt(id) }
      }
    });

    if (categoriaDuplicada) {
      return res.status(400).json({ 
        success: false, 
        message: 'Ya existe otra categoría con ese nombre' 
      });
    }

    const categoria = await prisma.categoria.update({
      where: { id: parseInt(id) },
      data: {
        nombre: nombre.trim(),
        descripcion: descripcion?.trim() || null,
        tipo: tipo || 'producto',
        estado: estado || 'activa',
        color: color || '#667eea'
      }
    });

    res.json({
      success: true,
      data: categoria,
      message: 'Categoría actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Error al actualizar categoría'
    });
  }
};

// Eliminar una categoría
exports.deleteCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si existe la categoría
    const categoriaExistente = await prisma.categoria.findUnique({
      where: { id: parseInt(id) }
    });

    if (!categoriaExistente) {
      return res.status(404).json({ 
        success: false, 
        message: 'Categoría no encontrada' 
      });
    }

    // Verificar si la categoría está siendo usada en cuentas por pagar
    const cuentasPagar = await prisma.cuentaPagar.findFirst({
      where: { categoria: categoriaExistente.nombre }
    });

    if (cuentasPagar) {
      return res.status(400).json({ 
        success: false, 
        message: 'No se puede eliminar la categoría porque está siendo usada en cuentas por pagar' 
      });
    }

    // Verificar si la categoría está siendo usada en cuentas por cobrar
    // Nota: CuentaCobrar no tiene campo categoria, solo se verifica en CuentaPagar

    await prisma.categoria.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      success: true,
      message: 'Categoría eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Error al eliminar categoría'
    });
  }
};

// Obtener estadísticas de categorías
exports.getEstadisticasCategorias = async (req, res) => {
  try {
    // Obtener total de categorías
    const totalCategorias = await prisma.categoria.count();
    
    // Obtener categorías activas (que están siendo usadas en cuentas por pagar)
    const categoriasUsadas = await prisma.cuentaPagar.findMany({
      select: { categoria: true },
      where: { categoria: { not: null } },
      distinct: ['categoria']
    });

    const categoriasActivas = categoriasUsadas.length;
    
    // Contar por tipo (asumiendo que las categorías tienen un campo tipo)
    const categoriasProducto = await prisma.categoria.count({
      where: { nombre: { contains: 'Producto', mode: 'insensitive' } }
    });
    
    const categoriasServicio = await prisma.categoria.count({
      where: { nombre: { contains: 'Servicio', mode: 'insensitive' } }
    });

    const estadisticas = {
      totalCategorias,
      categoriasActivas,
      categoriasProducto,
      categoriasServicio
    };

    res.json({
      success: true,
      data: estadisticas,
      message: 'Estadísticas de categorías obtenidas exitosamente'
    });
  } catch (error) {
    console.error('Error al obtener estadísticas de categorías:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Error al obtener estadísticas de categorías'
    });
  }
};