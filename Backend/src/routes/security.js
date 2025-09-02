const express = require('express');
const router = express.Router();
const { verifyAuth, requireRole } = require('../middlewares/auth');
const { auditAccess } = require('../middlewares/audit');
const { createBackup, listBackups, restoreBackup, getBackupStats } = require('../utils/backup');
const { getAuditLogs, cleanupOldAuditLogs } = require('../middlewares/audit');
const { logEvent } = require('../middlewares/logger');

// =====================================================
// RUTAS DE AUTENTICACIÓN Y JWT
// =====================================================

// Renovar token JWT
router.post('/auth/refresh', verifyAuth, (req, res) => {
  try {
    const { refreshJWT } = require('../middlewares/auth');
    refreshJWT(req, res);
  } catch (error) {
    console.error('Error renovando JWT:', error);
    res.status(500).json({
      success: false,
      message: 'Error renovando token',
      errors: [{
        field: 'auth',
        message: 'Error interno en renovación de token'
      }]
    });
  }
});

// Invalidar token JWT
router.post('/auth/logout', verifyAuth, async (req, res) => {
  try {
    const db = require('../config/database');
    const { JWT_SECRET } = require('../middlewares/auth');
    const jwt = require('jsonwebtoken');
    
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token) {
      // Agregar token a la lista de tokens invalidados
      const tokenHash = require('crypto').createHash('sha256').update(token).digest('hex');
      await db.query(
        'INSERT INTO jwt_tokens (user_id, token_hash, expires_at) VALUES (?, ?, NOW())',
        [req.user.userId || req.user.firebase_uid, tokenHash]
      );
    }
    
    res.json({
      success: true,
      message: 'Sesión cerrada exitosamente'
    });
  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({
      success: false,
      message: 'Error cerrando sesión',
      errors: [{
        field: 'auth',
        message: 'Error interno en logout'
      }]
    });
  }
});

// =====================================================
// RUTAS DE AUDITORÍA
// =====================================================

// Obtener logs de auditoría (solo admin)
router.get('/audit/logs', verifyAuth, requireRole(['admin']), auditAccess('audit_logs'), async (req, res) => {
  try {
    const filters = {
      userId: req.query.userId,
      action: req.query.action,
      tableName: req.query.tableName,
      recordId: req.query.recordId,
      dateFrom: req.query.dateFrom,
      dateTo: req.query.dateTo,
      limit: parseInt(req.query.limit) || 50,
      offset: parseInt(req.query.offset) || 0
    };
    
    const logs = await getAuditLogs(filters);
    
    res.json({
      success: true,
      data: logs,
      count: logs.length
    });
  } catch (error) {
    console.error('Error obteniendo logs de auditoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo logs de auditoría',
      errors: [{
        field: 'audit',
        message: 'Error interno en auditoría'
      }]
    });
  }
});

// Limpiar logs antiguos (solo admin)
router.delete('/audit/cleanup', verifyAuth, requireRole(['admin']), async (req, res) => {
  try {
    const daysToKeep = parseInt(req.query.days) || 90;
    const deletedCount = await cleanupOldAuditLogs(daysToKeep);
    
    logEvent('audit_cleanup', {
      deletedCount,
      daysToKeep,
      userId: req.user.userId || req.user.firebase_uid
    });
    
    res.json({
      success: true,
      message: `Limpieza completada: ${deletedCount} registros eliminados`,
      data: { deletedCount, daysToKeep }
    });
  } catch (error) {
    console.error('Error limpiando logs de auditoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error limpiando logs de auditoría',
      errors: [{
        field: 'audit',
        message: 'Error interno en limpieza'
      }]
    });
  }
});

// =====================================================
// RUTAS DE BACKUP
// =====================================================

// Crear backup manual (solo admin)
router.post('/backup/create', verifyAuth, requireRole(['admin']), async (req, res) => {
  try {
    const backupPath = await createBackup();
    
    logEvent('backup_created_manual', {
      backupPath,
      userId: req.user.userId || req.user.firebase_uid
    });
    
    res.json({
      success: true,
      message: 'Backup creado exitosamente',
      data: {
        path: backupPath,
        filename: require('path').basename(backupPath)
      }
    });
  } catch (error) {
    console.error('Error creando backup:', error);
    res.status(500).json({
      success: false,
      message: 'Error creando backup',
      errors: [{
        field: 'backup',
        message: 'Error interno en backup'
      }]
    });
  }
});

// Listar backups disponibles (solo admin)
router.get('/backup/list', verifyAuth, requireRole(['admin']), async (req, res) => {
  try {
    const backups = await listBackups();
    
    res.json({
      success: true,
      data: backups,
      count: backups.length
    });
  } catch (error) {
    console.error('Error listando backups:', error);
    res.status(500).json({
      success: false,
      message: 'Error listando backups',
      errors: [{
        field: 'backup',
        message: 'Error interno listando backups'
      }]
    });
  }
});

// Restaurar backup (solo admin)
router.post('/backup/restore/:filename', verifyAuth, requireRole(['admin']), async (req, res) => {
  try {
    const { filename } = req.params;
    const { BACKUP_CONFIG } = require('../utils/backup');
    const path = require('path');
    
    const backupPath = path.join(BACKUP_CONFIG.backupDir, filename);
    await restoreBackup(backupPath);
    
    logEvent('backup_restored', {
      filename,
      userId: req.user.userId || req.user.firebase_uid
    });
    
    res.json({
      success: true,
      message: 'Backup restaurado exitosamente',
      data: { filename }
    });
  } catch (error) {
    console.error('Error restaurando backup:', error);
    res.status(500).json({
      success: false,
      message: 'Error restaurando backup',
      errors: [{
        field: 'backup',
        message: 'Error interno restaurando backup'
      }]
    });
  }
});

// Estadísticas de backup (solo admin)
router.get('/backup/stats', verifyAuth, requireRole(['admin']), async (req, res) => {
  try {
    const stats = await getBackupStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas de backup:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo estadísticas de backup',
      errors: [{
        field: 'backup',
        message: 'Error interno obteniendo estadísticas'
      }]
    });
  }
});

// =====================================================
// RUTAS DE SEGURIDAD
// =====================================================

// Obtener estadísticas de seguridad (solo admin)
router.get('/security/stats', verifyAuth, requireRole(['admin']), async (req, res) => {
  try {
    const db = require('../config/database');
    
    // Obtener estadísticas usando el procedimiento almacenado
    const [stats] = await db.query('CALL GetSecurityStats()');
    
    res.json({
      success: true,
      data: stats[0]
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas de seguridad:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo estadísticas de seguridad',
      errors: [{
        field: 'security',
        message: 'Error interno obteniendo estadísticas'
      }]
    });
  }
});

// Obtener configuración de seguridad (solo admin)
router.get('/security/config', verifyAuth, requireRole(['admin']), async (req, res) => {
  try {
    const db = require('../config/database');
    
    const [config] = await db.query('SELECT * FROM security_config ORDER BY config_key');
    
    res.json({
      success: true,
      data: config
    });
  } catch (error) {
    console.error('Error obteniendo configuración de seguridad:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo configuración de seguridad',
      errors: [{
        field: 'security',
        message: 'Error interno obteniendo configuración'
      }]
    });
  }
});

// Actualizar configuración de seguridad (solo admin)
router.put('/security/config/:key', verifyAuth, requireRole(['admin']), async (req, res) => {
  try {
    const { key } = req.params;
    const { value, description } = req.body;
    const db = require('../config/database');
    
    await db.query(
      'UPDATE security_config SET config_value = ?, description = ?, updated_by = ?, updated_at = NOW() WHERE config_key = ?',
      [value, description, req.user.userId || req.user.firebase_uid, key]
    );
    
    logEvent('security_config_updated', {
      configKey: key,
      newValue: value,
      userId: req.user.userId || req.user.firebase_uid
    });
    
    res.json({
      success: true,
      message: 'Configuración actualizada exitosamente',
      data: { key, value }
    });
  } catch (error) {
    console.error('Error actualizando configuración de seguridad:', error);
    res.status(500).json({
      success: false,
      message: 'Error actualizando configuración de seguridad',
      errors: [{
        field: 'security',
        message: 'Error interno actualizando configuración'
      }]
    });
  }
});

// =====================================================
// RUTAS DE MONITOREO
// =====================================================

// Obtener logs recientes de auditoría (vista)
router.get('/monitoring/recent-logs', verifyAuth, requireRole(['admin']), async (req, res) => {
  try {
    const db = require('../config/database');
    const limit = parseInt(req.query.limit) || 50;
    
    const [logs] = await db.query(
      'SELECT * FROM recent_audit_logs LIMIT ?',
      [limit]
    );
    
    res.json({
      success: true,
      data: logs,
      count: logs.length
    });
  } catch (error) {
    console.error('Error obteniendo logs recientes:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo logs recientes',
      errors: [{
        field: 'monitoring',
        message: 'Error interno obteniendo logs'
      }]
    });
  }
});

// Obtener estadísticas de seguridad (vista)
router.get('/monitoring/security-stats', verifyAuth, requireRole(['admin']), async (req, res) => {
  try {
    const db = require('../config/database');
    const days = parseInt(req.query.days) || 30;
    
    const [stats] = await db.query(
      'SELECT * FROM security_statistics WHERE date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)',
      [days]
    );
    
    res.json({
      success: true,
      data: stats,
      count: stats.length
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas de seguridad:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo estadísticas de seguridad',
      errors: [{
        field: 'monitoring',
        message: 'Error interno obteniendo estadísticas'
      }]
    });
  }
});

module.exports = router; 