const db = require('../config/database');

// Configuración de paginación por defecto
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

// Función para validar y procesar parámetros de paginación
const processPaginationParams = (req) => {
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);
  const offset = (page - 1) * limit;
  
  return {
    page,
    limit,
    offset,
    isValid: page > 0 && limit > 0
  };
};

// Función para construir consulta con paginación
const buildPaginatedQuery = (baseQuery, params = [], pagination) => {
  const { limit, offset } = pagination;
  
  // Agregar LIMIT y OFFSET a la consulta
  const paginatedQuery = `${baseQuery} LIMIT ? OFFSET ?`;
  const paginatedParams = [...params, limit, offset];
  
  return {
    query: paginatedQuery,
    params: paginatedParams
  };
};

// Función para obtener total de registros
const getTotalCount = async (baseQuery, params = []) => {
  try {
    // Convertir SELECT query a COUNT query
    const countQuery = baseQuery.replace(/SELECT\s+.+?\s+FROM/i, 'SELECT COUNT(*) as total FROM');
    
    const [rows] = await db.query(countQuery, params);
    return rows[0]?.total || 0;
  } catch (error) {
    console.error('Error obteniendo total de registros:', error);
    throw error;
  }
};

// Función para construir respuesta paginada
const buildPaginatedResponse = (data, total, pagination, baseUrl, filters = {}) => {
  const { page, limit } = pagination;
  const totalPages = Math.ceil(total / limit);
  
  // Construir URLs para navegación
  const buildUrl = (pageNum) => {
    const url = new URL(baseUrl, 'http://localhost');
    url.searchParams.set('page', pageNum.toString());
    url.searchParams.set('limit', limit.toString());
    
    // Agregar filtros existentes
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null) {
        url.searchParams.set(key, filters[key].toString());
      }
    });
    
    return url.pathname + url.search;
  };
  
  const response = {
    success: true,
    data: data,
    pagination: {
      currentPage: page,
      totalPages: totalPages,
      totalRecords: total,
      pageSize: limit,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      nextPage: page < totalPages ? page + 1 : null,
      previousPage: page > 1 ? page - 1 : null,
      nextPageUrl: page < totalPages ? buildUrl(page + 1) : null,
      previousPageUrl: page > 1 ? buildUrl(page - 1) : null,
      firstPageUrl: buildUrl(1),
      lastPageUrl: buildUrl(totalPages)
    }
  };
  
  return response;
};

// Middleware para aplicar paginación automática
const paginateResults = (baseQuery, getFilters = () => ({})) => {
  return async (req, res, next) => {
    try {
      const pagination = processPaginationParams(req);
      
      if (!pagination.isValid) {
        return res.status(400).json({
          success: false,
          message: 'Parámetros de paginación inválidos',
          errors: [{
            field: 'pagination',
            message: 'Página y límite deben ser números positivos'
          }]
        });
      }
      
      // Obtener filtros
      const filters = getFilters(req);
      
      // Construir consulta con filtros
      let query = baseQuery;
      let params = [];
      
      if (Object.keys(filters).length > 0) {
        const conditions = [];
        Object.keys(filters).forEach(key => {
          if (filters[key] !== undefined && filters[key] !== null) {
            conditions.push(`${key} = ?`);
            params.push(filters[key]);
          }
        });
        
        if (conditions.length > 0) {
          query += ` WHERE ${conditions.join(' AND ')}`;
        }
      }
      
      // Obtener total de registros
      const total = await getTotalCount(query, params);
      
      // Construir consulta paginada
      const { query: paginatedQuery, params: paginatedParams } = buildPaginatedQuery(query, params, pagination);
      
      // Ejecutar consulta paginada
      const [rows] = await db.query(paginatedQuery, paginatedParams);
      
      // Construir respuesta
      const baseUrl = req.originalUrl.split('?')[0];
      const response = buildPaginatedResponse(rows, total, pagination, baseUrl, req.query);
      
      res.json(response);
    } catch (error) {
      console.error('Error en paginación:', error);
      res.status(500).json({
        success: false,
        message: 'Error en paginación',
        errors: [{
          field: 'pagination',
          message: 'Error interno en el servidor'
        }]
      });
    }
  };
};

// Función para paginación manual
const manualPagination = async (query, params, pagination, req, res) => {
  try {
    // Obtener total de registros
    const total = await getTotalCount(query, params);
    
    // Construir consulta paginada
    const { query: paginatedQuery, params: paginatedParams } = buildPaginatedQuery(query, params, pagination);
    
    // Ejecutar consulta
    const [rows] = await db.query(paginatedQuery, paginatedParams);
    
    // Construir respuesta
    const baseUrl = req.originalUrl.split('?')[0];
    const response = buildPaginatedResponse(rows, total, pagination, baseUrl, req.query);
    
    return response;
  } catch (error) {
    console.error('Error en paginación manual:', error);
    throw error;
  }
};

// Función para paginación con JOINs complejos
const paginateWithJoins = async (baseQuery, joinQuery, params, pagination, req, res) => {
  try {
    // Query para contar total (sin JOINs complejos)
    const countQuery = `SELECT COUNT(DISTINCT ${baseQuery.split('FROM')[0].split('SELECT')[1].trim()}) as total FROM ${baseQuery.split('FROM')[1].split('WHERE')[0].trim()}`;
    
    // Obtener total
    const [countRows] = await db.query(countQuery, params);
    const total = countRows[0]?.total || 0;
    
    // Query paginada con JOINs
    const { query: paginatedQuery, params: paginatedParams } = buildPaginatedQuery(joinQuery, params, pagination);
    
    // Ejecutar consulta
    const [rows] = await db.query(paginatedQuery, paginatedParams);
    
    // Construir respuesta
    const baseUrl = req.originalUrl.split('?')[0];
    const response = buildPaginatedResponse(rows, total, pagination, baseUrl, req.query);
    
    return response;
  } catch (error) {
    console.error('Error en paginación con JOINs:', error);
    throw error;
  }
};

// Función para paginación con búsqueda full-text
const paginateWithSearch = async (baseQuery, searchFields, searchTerm, params, pagination, req, res) => {
  try {
    let query = baseQuery;
    let searchParams = [...params];
    
    if (searchTerm && searchFields.length > 0) {
      const searchConditions = searchFields.map(field => `${field} LIKE ?`);
      const searchParam = `%${searchTerm}%`;
      
      query += ` WHERE ${searchConditions.join(' OR ')}`;
      searchParams = [...params, ...Array(searchFields.length).fill(searchParam)];
    }
    
    // Obtener total
    const total = await getTotalCount(query, searchParams);
    
    // Construir consulta paginada
    const { query: paginatedQuery, params: paginatedParams } = buildPaginatedQuery(query, searchParams, pagination);
    
    // Ejecutar consulta
    const [rows] = await db.query(paginatedQuery, paginatedParams);
    
    // Construir respuesta
    const baseUrl = req.originalUrl.split('?')[0];
    const response = buildPaginatedResponse(rows, total, pagination, baseUrl, req.query);
    
    // Agregar información de búsqueda
    if (searchTerm) {
      response.search = {
        term: searchTerm,
        fields: searchFields,
        resultsFound: total
      };
    }
    
    return response;
  } catch (error) {
    console.error('Error en paginación con búsqueda:', error);
    throw error;
  }
};

// Función para obtener estadísticas de paginación
const getPaginationStats = (total, pagination) => {
  const { page, limit } = pagination;
  const totalPages = Math.ceil(total / limit);
  
  return {
    totalRecords: total,
    totalPages: totalPages,
    currentPage: page,
    pageSize: limit,
    recordsInCurrentPage: Math.min(limit, total - (page - 1) * limit),
    startRecord: (page - 1) * limit + 1,
    endRecord: Math.min(page * limit, total)
  };
};

module.exports = {
  processPaginationParams,
  buildPaginatedQuery,
  getTotalCount,
  buildPaginatedResponse,
  paginateResults,
  manualPagination,
  paginateWithJoins,
  paginateWithSearch,
  getPaginationStats,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE
}; 