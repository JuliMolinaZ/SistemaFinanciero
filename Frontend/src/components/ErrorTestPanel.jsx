import React, { useState, useContext } from 'react';
import {
  Paper,
  Typography,
  Button,
  Stack,
  Alert,
  Box,
  Chip
} from '@mui/material';
import {
  BugReport as TestIcon,
  NetworkCheck as NetworkIcon,
  Error as ErrorIcon,
  CheckCircle as SuccessIcon
} from '@mui/icons-material';
import { GlobalContext } from '../context/GlobalState';
import axios from 'axios';

const ErrorTestPanel = () => {
  const { checkBackendConnection, backendConnected, backendError } = useContext(GlobalContext);
  const [testResults, setTestResults] = useState([]);

  const addTestResult = (test, success, message) => {
    setTestResults(prev => [...prev, {
      id: Date.now(),
      test,
      success,
      message,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const testBackendConnection = async () => {
    try {
      const result = await checkBackendConnection();
      addTestResult(
        'Backend Connection', 
        result, 
        result ? 'Backend conectado correctamente' : 'Backend no disponible'
      );
    } catch (error) {
      addTestResult('Backend Connection', false, `Error: ${error.message}`);
    }
  };

  const testAuthError = async () => {
    try {
      // Hacer una llamada que debería fallar con 401
      await axios.get('/api/roles');
      addTestResult('Auth Error', false, 'No se produjo error 401 como esperado');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        addTestResult('Auth Error', true, 'Error 401 manejado correctamente por el interceptor');
      } else {
        addTestResult('Auth Error', false, `Error inesperado: ${error.message}`);
      }
    }
  };

  const testNetworkError = async () => {
    try {
      // Hacer una llamada a un endpoint inexistente para simular error de red
      await axios.get('http://localhost:9999/api/test');
      addTestResult('Network Error', false, 'No se produjo error de red como esperado');
    } catch (error) {
      addTestResult('Network Error', true, `Error de red manejado: ${error.message}`);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, m: 2 }}>
      <Stack spacing={3}>
        <Box display="flex" alignItems="center" gap={1}>
          <TestIcon color="primary" />
          <Typography variant="h5">Panel de Pruebas de Errores</Typography>
        </Box>

        {/* Estado actual del backend */}
        <Alert 
          severity={backendConnected ? 'success' : 'error'} 
          icon={backendConnected ? <SuccessIcon /> : <ErrorIcon />}
        >
          <Typography variant="body2">
            <strong>Estado del Backend:</strong>{' '}
            {backendConnected ? 'Conectado' : 'Desconectado'}
            {backendError && (
              <>
                <br />
                <strong>Error:</strong> {backendError.message}
              </>
            )}
          </Typography>
        </Alert>

        {/* Botones de prueba */}
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <Button
            variant="contained"
            startIcon={<NetworkIcon />}
            onClick={testBackendConnection}
            size="large"
          >
            Probar Conexión Backend
          </Button>
          
          <Button
            variant="outlined"
            color="error"
            onClick={testAuthError}
            size="large"
          >
            Simular Error 401
          </Button>
          
          <Button
            variant="outlined"
            color="warning"
            onClick={testNetworkError}
            size="large"
          >
            Simular Error de Red
          </Button>
          
          <Button
            variant="text"
            onClick={clearResults}
            size="large"
          >
            Limpiar Resultados
          </Button>
        </Stack>

        {/* Resultados de las pruebas */}
        {testResults.length > 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Resultados de Pruebas:
            </Typography>
            <Stack spacing={1}>
              {testResults.map((result) => (
                <Alert
                  key={result.id}
                  severity={result.success ? 'success' : 'error'}
                  action={
                    <Chip
                      size="small"
                      label={result.timestamp}
                      variant="outlined"
                    />
                  }
                >
                  <Typography variant="body2">
                    <strong>{result.test}:</strong> {result.message}
                  </Typography>
                </Alert>
              ))}
            </Stack>
          </Box>
        )}

        {/* Instrucciones */}
        <Alert severity="info">
          <Typography variant="body2">
            <strong>💡 Cómo usar este panel:</strong><br />
            • <strong>Probar Conexión Backend:</strong> Verifica si el backend está funcionando<br />
            • <strong>Simular Error 401:</strong> Prueba el manejo de errores de autenticación<br />
            • <strong>Simular Error de Red:</strong> Prueba el manejo de errores de conexión<br /><br />
            
            <strong>🎯 ¿Qué esperar?</strong><br />
            • Los errores ahora muestran modales bonitos en lugar de errores crudos<br />
            • Los errores de conexión muestran la pantalla de "Backend Error"<br />
            • Los errores 401 muestran el modal de autenticación amigable
          </Typography>
        </Alert>
      </Stack>
    </Paper>
  );
};

export default ErrorTestPanel;