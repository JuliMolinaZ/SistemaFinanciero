// Backend/routes/flowRecoveryV2.js
const express = require('express');
const router = express.Router();
const flowRecoveryV2Controller = require('../controllers/flowRecoveryV2Controller');

router.get('/', flowRecoveryV2Controller.getAllFlowRecoveryV2);
router.get('/:id', flowRecoveryV2Controller.getFlowRecoveryV2ById);
router.post('/', flowRecoveryV2Controller.createFlowRecoveryV2);
router.put('/:id', flowRecoveryV2Controller.updateFlowRecoveryV2);
router.delete('/:id', flowRecoveryV2Controller.deleteFlowRecoveryV2);
router.put('/:id/toggle', flowRecoveryV2Controller.toggleFlowRecoveryV2);

module.exports = router;

