const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// Configuración de encriptación
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'tu_clave_de_encriptacion_super_segura_32_caracteres';
const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16;

// Función para encriptar datos
const encrypt = (text) => {
  try {
    if (!text) return null;
    
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipher(ALGORITHM, ENCRYPTION_KEY);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return iv.toString('hex') + ':' + encrypted;
  } catch (error) {
    console.error('Error encriptando datos:', error);
    throw new Error('Error en encriptación de datos');
  }
};

// Función para desencriptar datos
const decrypt = (encryptedText) => {
  try {
    if (!encryptedText) return null;
    
    const textParts = encryptedText.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedData = textParts.join(':');
    
    const decipher = crypto.createDecipher(ALGORITHM, ENCRYPTION_KEY);
    
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Error desencriptando datos:', error);
    throw new Error('Error en desencriptación de datos');
  }
};

// Función para hashear contraseñas
const hashPassword = async (password) => {
  try {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    console.error('Error hasheando contraseña:', error);
    throw new Error('Error en hash de contraseña');
  }
};

// Función para verificar contraseñas
const verifyPassword = async (password, hash) => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.error('Error verificando contraseña:', error);
    throw new Error('Error en verificación de contraseña');
  }
};

// Función para encriptar datos sensibles específicos
const encryptSensitiveData = (data, fieldsToEncrypt) => {
  const encryptedData = { ...data };
  
  fieldsToEncrypt.forEach(field => {
    if (encryptedData[field] && typeof encryptedData[field] === 'string') {
      encryptedData[field] = encrypt(encryptedData[field]);
    }
  });
  
  return encryptedData;
};

// Función para desencriptar datos sensibles específicos
const decryptSensitiveData = (data, fieldsToDecrypt) => {
  const decryptedData = { ...data };
  
  fieldsToDecrypt.forEach(field => {
    if (decryptedData[field] && typeof decryptedData[field] === 'string') {
      try {
        decryptedData[field] = decrypt(decryptedData[field]);
      } catch (error) {
        console.error(`Error desencriptando campo ${field}:`, error);
        decryptedData[field] = null;
      }
    }
  });
  
  return decryptedData;
};

// Configuración de campos sensibles por tabla
const SENSITIVE_FIELDS = {
  users: ['password', 'personal_info'],
  clients: ['rfc', 'direccion'],
  proveedores: ['rfc', 'direccion', 'telefono'],
  cuentas_por_pagar: ['numero_factura'],
  cuentas_por_cobrar: ['numero_factura'],
  contabilidad: ['numero_comprobante']
};

// Middleware para encriptar automáticamente datos sensibles
const encryptMiddleware = (tableName) => {
  return (req, res, next) => {
    if (req.body && SENSITIVE_FIELDS[tableName]) {
      req.body = encryptSensitiveData(req.body, SENSITIVE_FIELDS[tableName]);
    }
    next();
  };
};

// Middleware para desencriptar automáticamente datos sensibles
const decryptMiddleware = (tableName) => {
  return (req, res, next) => {
    if (res.locals.data && SENSITIVE_FIELDS[tableName]) {
      res.locals.data = decryptSensitiveData(res.locals.data, SENSITIVE_FIELDS[tableName]);
    }
    next();
  };
};

// Función para generar clave de encriptación segura
const generateEncryptionKey = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Función para verificar si un texto está encriptado
const isEncrypted = (text) => {
  if (!text || typeof text !== 'string') return false;
  return text.includes(':') && text.length > 32;
};

module.exports = {
  encrypt,
  decrypt,
  hashPassword,
  verifyPassword,
  encryptSensitiveData,
  decryptSensitiveData,
  encryptMiddleware,
  decryptMiddleware,
  generateEncryptionKey,
  isEncrypted,
  SENSITIVE_FIELDS
}; 