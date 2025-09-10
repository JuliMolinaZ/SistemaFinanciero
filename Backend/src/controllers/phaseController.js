// controllers/phaseController.js
const { prisma } = require('../config/database');

exports.getAllPhases = async (req, res) => {
  try {
    const phases = await prisma.Phase.findMany({
      orderBy: { created_at: 'desc' }
    });
    res.json(phases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createPhase = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    const phase = await prisma.Phase.create({
      data: {
        nombre,
        descripcion
      }
    });
    res.status(201).json(phase);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePhase = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;
    
    const phase = await prisma.Phase.update({
      where: { id: parseInt(id) },
      data: {
        nombre,
        descripcion
      }
    });
    res.json(phase);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deletePhase = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.Phase.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Fase eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};