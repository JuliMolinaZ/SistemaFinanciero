const { PrismaClient } = require('@prisma/client');
const { logEvent } = require('./logger');

const prisma = new PrismaClient();

// Tabla de auditoría
const AUDIT_TABLE = 'audit_logs';

// Tipos de acciones auditables
const AUDIT_ACTIONS = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  EXPORT: 'EXPORT',
  IMPORT: 'IMPORT',
  ACCESS: 'ACCESS',
  PERMISSION_CHANGE: 'PERMISSION_CHANGE'
};

// Campos que no se auditan (por privacidad o tamaño)
const EXCLUDED_FIELDS = ['password', 'token', 'session_data', 'avatar'];

// Función para crear registro de auditoría
const createAuditLog = async (data) => {
  try {
    const {
      userId,
      userEmail,
      action,
      tableName,
      recordId,
      oldData,
      newData,
      ipAddress,
      userAgent,
      details
    } = data;

    const result = await prisma.auditLog.create({
      data: {
        user_id: userId,
        user_email: userEmail,
        action: action,
        table_name: tableName,
        record_id: recordId,
        old_data: oldData,
        new_data: newData,
        ip_address: ipAddress,
        user_agent: userAgent,
        details: details
      }
    });

    // Log del evento
    logEvent('audit_log_created', {
      auditId: result.id,
      action,
      tableName,
      recordId,
      userId
    });

    return result.id;
  } catch (error) {
    console.error('Error creando registro de auditoría:', error);
    throw error;
  }
};

// Función para limpiar datos sensibles antes de auditar
const sanitizeDataForAudit = (data) => {
  if (!data || typeof data !== 'object') return data;
  
  const sanitized = { ...data };
  
  EXCLUDED_FIELDS.forEach(field => {
    if (sanitized[field] !== undefined) {
      delete sanitized[field];
    }
  });
  
  return sanitized;
};

// Middleware para auditar operaciones CRUD - VERSIÓN MEJORADA ANTI-BUCLE
const auditCRUD = (tableName, action) => {
  return async (req, res, next) => {
    // Verificar si ya estamos auditando esta petición para evitar bucles infinitos
    if (req._auditing) {
      return next();
    }
    
    req._auditing = true; // Marcar que estamos auditando
    
    const originalSend = res.send;
    const originalJson = res.json;
    
    // Capturar datos antes de la operación
    const oldData = req.params.id ? await getRecordData(tableName, req.params.id) : null;
    
    // Interceptar respuesta
    res.json = function(data) {
      // Verificar si la respuesta ya fue procesada
      if (res._auditProcessed) {
        return originalJson.call(this, data);
      }
      
      res._auditProcessed = true;
      
      const auditData = {
        userId: req.user?.userId || req.user?.firebase_uid,
        userEmail: req.user?.email,
        action,
        tableName,
        recordId: req.params.id || (data?.id || data?.insertId),
        oldData: sanitizeDataForAudit(oldData),
        newData: sanitizeDataForAudit(action === 'DELETE' ? oldData : req.body),
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        details: {
          method: req.method,
          url: req.originalUrl,
          statusCode: res.statusCode
        }
      };

      // Crear registro de auditoría de forma asíncrona con timeout
      const auditPromise = createAuditLog(auditData).catch(error => {
        console.error('Error en auditoría:', error);
      });
      
      // Timeout para evitar que la auditoría bloquee la respuesta
      setTimeout(() => {
        auditPromise.catch(() => {}); // Ignorar errores del timeout
      }, 1000);

      return originalJson.call(this, data);
    };

    res.send = function(data) {
      // Verificar si la respuesta ya fue procesada
      if (res._auditProcessed) {
        return originalSend.call(this, data);
      }
      
      res._auditProcessed = true;
      
      const auditData = {
        userId: req.user?.userId || req.user?.firebase_uid,
        userEmail: req.user?.email,
        action,
        tableName,
        recordId: req.params.id,
        oldData: sanitizeDataForAudit(oldData),
        newData: sanitizeDataForAudit(action === 'DELETE' ? oldData : req.body),
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        details: {
          method: req.method,
          url: req.originalUrl,
          statusCode: res.statusCode
        }
      };

      // Crear registro de auditoría de forma asíncrona con timeout
      const auditPromise = createAuditLog(auditData).catch(error => {
        console.error('Error en auditoría:', error);
      });
      
      // Timeout para evitar que la auditoría bloquee la respuesta
      setTimeout(() => {
        auditPromise.catch(() => {}); // Ignorar errores del timeout
      }, 1000);

      return originalSend.call(this, data);
    };

    next();
  };
};

// Función para obtener datos de un registro
const getRecordData = async (tableName, recordId) => {
  try {
    const [rows] = await db.query(`SELECT * FROM ${tableName} WHERE id = ?`, [recordId]);
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error(`Error obteniendo datos de ${tableName}:`, error);
    return null;
  }
};

// Función para auditar eventos específicos
const auditEvent = async (eventData) => {
  try {
    const auditData = {
      userId: eventData.userId,
      userEmail: eventData.userEmail,
      action: eventData.action,
      tableName: eventData.tableName || 'system',
      recordId: eventData.recordId,
      oldData: null,
      newData: null,
      ipAddress: eventData.ipAddress,
      userAgent: eventData.userAgent,
      details: eventData.details
    };

    return await createAuditLog(auditData);
  } catch (error) {
    console.error('Error auditando evento:', error);
    throw error;
  }
};

// Función para obtener logs de auditoría
const getAuditLogs = async (filters = {}) => {
  try {
    let query = `SELECT * FROM ${AUDIT_TABLE}`;
    const params = [];
    const conditions = [];

    // Filtros
    if (filters.userId) {
      conditions.push('user_id = ?');
      params.push(filters.userId);
    }

    if (filters.action) {
      conditions.push('action = ?');
      params.push(filters.action);
    }

    if (filters.tableName) {
      conditions.push('table_name = ?');
      params.push(filters.tableName);
    }

    if (filters.recordId) {
      conditions.push('record_id = ?');
      params.push(filters.recordId);
    }

    if (filters.dateFrom) {
      conditions.push('created_at >= ?');
      params.push(filters.dateFrom);
    }

    if (filters.dateTo) {
      conditions.push('created_at <= ?');
      params.push(filters.dateTo);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC';

    // Paginación
    if (filters.limit) {
      query += ' LIMIT ?';
      params.push(parseInt(filters.limit));
    }

    if (filters.offset) {
      query += ' OFFSET ?';
      params.push(parseInt(filters.offset));
    }

    const [rows] = await db.query(query, params);
    return rows;
  } catch (error) {
    console.error('Error obteniendo logs de auditoría:', error);
    throw error;
  }
};

// Función para limpiar logs antiguos
const cleanupOldAuditLogs = async (daysToKeep = 90) => {
  try {
    const query = `DELETE FROM ${AUDIT_TABLE} WHERE created_at < DATE_SUB(NOW(), INTERVAL ? DAY)`;
    const [result] = await db.query(query, [daysToKeep]);

    return result.affectedRows;
  } catch (error) {
    console.error('Error limpiando logs de auditoría:', error);
    throw error;
  }
};

// Middleware para auditar acceso a rutas sensibles
const auditAccess = (routeName) => {
  return async (req, res, next) => {
    const auditData = {
      userId: req.user?.userId || req.user?.firebase_uid,
      userEmail: req.user?.email,
      action: AUDIT_ACTIONS.ACCESS,
      tableName: 'routes',
      recordId: null,
      oldData: null,
      newData: null,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      details: {
        route: routeName,
        method: req.method,
        url: req.originalUrl,
        params: req.params,
        query: req.query
      }
    };

    // Crear registro de auditoría de forma asíncrona
    createAuditLog(auditData).catch(error => {
      console.error('Error en auditoría de acceso:', error);
    });

    next();
  };
};

module.exports = {
  createAuditLog,
  auditCRUD,
  auditEvent,
  getAuditLogs,
  cleanupOldAuditLogs,
  auditAccess,
  AUDIT_ACTIONS,
  sanitizeDataForAudit
}; 