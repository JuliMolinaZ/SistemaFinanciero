// routes/categorias.js
const express = require('express');
const router = express.Router();
const categoriasController = require('../controllers/categoriasController');
const { validateWithJoi, validateId } = require('../middlewares/validation');
const { categoriaSchemas } = require('../validations/schemas');

router.get('/', categoriasController.getAllCategorias);
router.get('/stats', categoriasController.getEstadisticasCategorias);
router.get('/:id', validateId, categoriasController.getCategoriaById);
router.post('/', validateWithJoi(categoriaSchemas.create), categoriasController.createCategoria);
router.put('/:id', validateId, validateWithJoi(categoriaSchemas.update), categoriasController.updateCategoria);
router.delete('/:id', validateId, categoriasController.deleteCategoria);

module.exports = router;