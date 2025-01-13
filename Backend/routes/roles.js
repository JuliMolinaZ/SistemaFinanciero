// routes/roles.js
const express = require('express');
const router = express.Router();
const rolController = require('../controllers/rolController');

router.get('/', rolController.getAllRoles);

module.exports = router;