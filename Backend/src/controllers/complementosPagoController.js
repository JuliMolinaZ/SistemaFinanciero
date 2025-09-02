const { prisma } = require('../config/database');

// Obtener todos los complementos de pago de una cuenta
exports.getComplementosByCuenta = async (req, res) => {
  try {
    const { cuentaId } = req.params;
    const complementos = await prisma.complementos_pago.findMany({
      where: { cuenta_id: parseInt(cuentaId) },
      orderBy: {
        fecha_pago: 'desc'
      }
    });
    res.json(complementos);
  } catch (error) {
    console.error('Error al obtener complementos:', error);
    res.status(500).json({ error: error.message });
  }
};

// Crear un nuevo complemento de pago para una cuenta
exports.createComplemento = async (req, res) => {
  try {
    const { cuentaId } = req.params;
    const { fecha_pago, concepto, monto_sin_iva, monto_con_iva } = req.body;
    
    const complemento = await prisma.complementos_pago.create({
      data: {
        cuenta_id: parseInt(cuentaId),
        fecha_pago: fecha_pago ? new Date(fecha_pago) : null,
        concepto,
        monto_sin_iva: monto_sin_iva ? parseFloat(monto_sin_iva) : null,
        monto_con_iva: monto_con_iva ? parseFloat(monto_con_iva) : null
      }
    });
    
    res.status(201).json(complemento);
  } catch (error) {
    console.error('Error al crear complemento:', error);
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un complemento (opcional)
exports.updateComplemento = async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha_pago, concepto, monto_sin_iva, monto_con_iva } = req.body;
    
    const complemento = await prisma.complementos_pago.update({
      where: { id: parseInt(id) },
      data: {
        fecha_pago: fecha_pago ? new Date(fecha_pago) : null,
        concepto,
        monto_sin_iva: monto_sin_iva ? parseFloat(monto_sin_iva) : null,
        monto_con_iva: monto_con_iva ? parseFloat(monto_con_iva) : null
      }
    });
    
    res.json(complemento);
  } catch (error) {
    console.error('Error al actualizar complemento:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Complemento no encontrado' });
    }
    res.status(500).json({ error: error.message });
  }
};

// Eliminar un complemento de pago
exports.deleteComplemento = async (req, res) => {
  try {
    const { id } = req.params;
    
    // En lugar de eliminar, marcamos como inactivo
    // Como no existe un campo de status en el esquema actual,
    // comentamos esta funcionalidad para evitar borrar datos
    res.status(403).json({ 
      message: 'No se permite eliminar complementos de pago. Los datos deben mantenerse por razones de auditoría.',
      error: 'DELETE_OPERATION_NOT_ALLOWED'
    });
    
    // Alternativa: si se quiere implementar un soft delete, se necesitaría:
    // 1. Agregar un campo 'status' o 'deleted_at' al esquema
    // 2. Cambiar delete por update con el nuevo campo
  } catch (error) {
    console.error('Error al procesar solicitud de eliminación:', error);
    res.status(500).json({ error: error.message });
  }
};