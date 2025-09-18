import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCostosFijos } from '../../hooks/useCostosFijos';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Grid,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Snackbar,
  Alert,
  Slide,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faClose, faPaperPlane, faSync } from '@fortawesome/free-solid-svg-icons';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
  ReferenceLine,
} from 'recharts';

// Formateadores de moneda
const formatterMXN = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  minimumFractionDigits: 2,
});
const formatterUSD = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});

// Transición deslizante para el Snackbar
function SlideTransition(props) {
  return <Slide {...props} direction="left" />;
}

// Tooltip personalizado para la gráfica
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          backgroundColor: 'rgba(255,255,255,0.95)',
          border: '1px solid #ccc',
          p: 1,
          borderRadius: 1,
          boxShadow: 1,
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
          {label}
        </Typography>
        {payload.map((entry, index) => (
          <Typography key={`item-${index}`} sx={{ color: entry.color }}>
            {entry.name}: {formatterMXN.format(entry.value)}
          </Typography>
        ))}
      </Box>
    );
  }
  return null;
};

// Componente de la gráfica mejorado
const ChartComponent = ({ dataGrafica, totalCostos }) => (
  <Box
    sx={{
      width: '100%',
      maxWidth: 1200,
      mb: 5,
      backgroundColor: '#ffffff',
      p: 4,
      borderRadius: 4,
      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      border: '1px solid rgba(255,255,255,0.8)',
      mx: 'auto',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, #667eea, #764ba2, #f093fb)',
        borderRadius: '4px 4px 0 0',
      }
    }}
  >
    {/* Título del gráfico */}
    <Box sx={{ mb: 3, textAlign: 'center' }}>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          color: '#2d3748',
          mb: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2
        }}
      >
        📊 Análisis de Costos y Utilidad
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: '#718096',
          fontStyle: 'italic'
        }}
      >
        Visualización interactiva de costos fijos vs proyección de utilidad
      </Typography>
    </Box>

    <ResponsiveContainer width="100%" height={450}>
      <BarChart data={dataGrafica} margin={{ top: 60, right: 40, left: 40, bottom: 60 }}>
        <defs>
          {/* Gradientes mejorados */}
          <linearGradient id="colorCostosFijos" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#667eea" stopOpacity={1} />
            <stop offset="50%" stopColor="#764ba2" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#667eea" stopOpacity={0.3} />
          </linearGradient>
          <linearGradient id="colorCostosFijosUtilidad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f093fb" stopOpacity={1} />
            <stop offset="50%" stopColor="#f5576c" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#4facfe" stopOpacity={0.3} />
          </linearGradient>
          
          {/* Sombras para las barras */}
          <filter id="dropshadow" height="130%">
            <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.3"/>
          </filter>
        </defs>
        
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
        <XAxis 
          dataKey="name" 
          tick={{ fill: "#4a5568", fontSize: 14, fontWeight: 600 }}
          axisLine={{ stroke: '#cbd5e0' }}
          tickLine={{ stroke: '#cbd5e0' }}
        />
        <YAxis 
          tick={{ fill: "#4a5568", fontSize: 12 }}
          axisLine={{ stroke: '#cbd5e0' }}
          tickLine={{ stroke: '#cbd5e0' }}
        >
          <text
            x={-60}
            y={15}
            angle={-90}
            textAnchor="middle"
            fill="#4a5568"
            fontSize="14px"
            fontWeight="600"
          >
            💵 Monto en MXN
          </text>
        </YAxis>
        <RechartsTooltip content={<CustomTooltip />} />
        <Legend 
          verticalAlign="top" 
          height={50}
          iconType="rect"
          wrapperStyle={{
            paddingBottom: '20px',
            fontSize: '14px',
            fontWeight: '600'
          }}
        />
        
        {/* Barra de Costos Fijos */}
        <Bar
          dataKey="Costos Fijos"
          fill="url(#colorCostosFijos)"
          animationDuration={2000}
          radius={[12, 12, 0, 0]}
          filter="url(#dropshadow)"
        >
          <LabelList 
            dataKey="Costos Fijos" 
            position="top" 
            formatter={(value) => formatterMXN.format(value)}
            style={{
              fontSize: '12px',
              fontWeight: 'bold',
              fill: '#2d3748'
            }}
          />
        </Bar>
        
        {/* Barra de Costos + Utilidad */}
        <Bar
          dataKey="Costos Fijos + Utilidad"
          fill="url(#colorCostosFijosUtilidad)"
          animationDuration={2000}
          radius={[12, 12, 0, 0]}
          filter="url(#dropshadow)"
        >
          <LabelList 
            dataKey="Costos Fijos + Utilidad" 
            position="top" 
            formatter={(value) => formatterMXN.format(value)}
            style={{
              fontSize: '12px',
              fontWeight: 'bold',
              fill: '#2d3748'
            }}
          />
        </Bar>
        
        {/* Línea de referencia mejorada */}
        {totalCostos > 0 && (
          <ReferenceLine
            y={totalCostos}
            stroke="#f56565"
            strokeWidth={2}
            strokeDasharray="8 4"
            label={{
              position: 'insideTopRight',
              value: '📈 Total Costos',
              fill: '#f56565',
              fontSize: 13,
              fontWeight: 'bold',
              offset: 10
            }}
          />
        )}
      </BarChart>
    </ResponsiveContainer>
  </Box>
);

// Componente para mostrar totales y utilidad con cards modernos
const TotalsComponent = ({ totalCostos, porcentajeUtilidad, setPorcentajeUtilidad, resultadoUtilidad }) => (
  <Box sx={{ width: '100%', maxWidth: 1200, mb: 5, mx: 'auto' }}>
    <Grid container spacing={3}>
      {/* Card de Total Costos */}
      <Grid item xs={12} md={4}>
  <Box
    sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 3,
      p: 3,
      textAlign: 'center',
            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
            border: '1px solid rgba(255,255,255,0.2)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              width: '100px',
              height: '100px',
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
              borderRadius: '50%',
              transform: 'translate(30px, -30px)',
            }
          }}
        >
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', mb: 1, fontWeight: 600 }}>
            💰 Total Costos Fijos
    </Typography>
          <Typography 
            variant="h4" 
            sx={{ 
              color: '#ffffff', 
              fontWeight: 800,
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              mb: 1
            }}
          >
            {formatterMXN.format(totalCostos)}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
            Gastos mensuales recurrentes
          </Typography>
        </Box>
      </Grid>

      {/* Card de Configuración de Utilidad */}
      <Grid item xs={12} md={4}>
        <Box
          sx={{
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            borderRadius: 3,
            p: 3,
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(240, 147, 251, 0.3)',
            border: '1px solid rgba(255,255,255,0.2)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '80px',
              height: '80px',
              background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
              borderRadius: '50%',
              transform: 'translate(-20px, -20px)',
            }
          }}
        >
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', mb: 2, fontWeight: 600 }}>
            📈 Porcentaje de Utilidad
          </Typography>
          <FormControl sx={{ mb: 2, minWidth: 160 }}>
      <Select
        value={porcentajeUtilidad}
        onChange={(e) => setPorcentajeUtilidad(Number(e.target.value))}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                borderRadius: 2,
                '& .MuiSelect-select': {
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  color: '#2d3748'
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none'
                }
              }}
      >
        {[30, 40, 50, 60, 80, 100, 120].map((porcentaje) => (
          <MenuItem key={porcentaje} value={porcentaje}>
            {porcentaje}%
          </MenuItem>
        ))}
      </Select>
    </FormControl>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
            Margen de ganancia objetivo
    </Typography>
        </Box>
      </Grid>

      {/* Card de Resultado de Utilidad */}
      <Grid item xs={12} md={4}>
        <Box
          sx={{
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            borderRadius: 3,
            p: 3,
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(79, 172, 254, 0.3)',
            border: '1px solid rgba(255,255,255,0.2)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: '120px',
              height: '120px',
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
              borderRadius: '50%',
              transform: 'translate(40px, 40px)',
            }
          }}
        >
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', mb: 1, fontWeight: 600 }}>
            💎 Utilidad Proyectada
          </Typography>
          <Typography 
            variant="h4" 
            sx={{ 
              color: '#ffffff', 
              fontWeight: 800,
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              mb: 1
            }}
          >
            {formatterMXN.format(resultadoUtilidad)}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
            Ganancia estimada ({porcentajeUtilidad}%)
    </Typography>
        </Box>
      </Grid>
    </Grid>
  </Box>
);

// Componente del formulario moderno (dentro de un Dialog)
const FixedCostFormDialog = ({ open, onClose, isEditing, formData, onChange, onSubmit }) => (
  <Dialog 
    open={open} 
    onClose={onClose} 
    fullWidth 
    maxWidth="md"
    PaperProps={{
      sx: {
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
      }
    }}
  >
    <DialogTitle
      sx={{
        p: 0,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          width: '100px',
          height: '100px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          transform: 'translate(30px, -30px)',
        }
      }}
    >
      <Box sx={{ p: 3, position: 'relative', zIndex: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          {isEditing ? '✏️ Actualizar Costo Fijo' : '➕ Registrar Nuevo Costo Fijo'}
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
          {isEditing ? 'Modifica la información del colaborador' : 'Ingresa los datos del nuevo colaborador'}
        </Typography>
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
            right: 16,
            top: 16,
            color: 'rgba(255,255,255,0.8)',
            backgroundColor: 'rgba(255,255,255,0.1)',
            '&:hover': { 
          color: '#fff',
              backgroundColor: 'rgba(255,255,255,0.2)',
              transform: 'scale(1.1)'
            },
        }}
      >
        <FontAwesomeIcon icon={faClose} />
      </IconButton>
      </Box>
    </DialogTitle>
    
    <DialogContent sx={{ backgroundColor: '#f8fafc', p: 4 }}>
      <Grid container spacing={3}>
        {/* Información personal */}
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ color: '#2d3748', fontWeight: 600, mb: 2 }}>
            👤 Información Personal
          </Typography>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            label="👤 Nombre del Colaborador"
            name="colaborador"
            value={formData.colaborador}
            onChange={onChange}
            fullWidth
            required
            variant="outlined"
            sx={{ 
              backgroundColor: '#ffffff',
              borderRadius: 2,
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: '#667eea',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#667eea',
                },
              }
            }}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            label="💼 Puesto de Trabajo"
            name="puesto"
            value={formData.puesto}
            onChange={onChange}
            fullWidth
            required
            variant="outlined"
            sx={{ 
              backgroundColor: '#ffffff',
              borderRadius: 2,
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: '#667eea',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#667eea',
                },
              }
            }}
          />
        </Grid>

        {/* Información financiera */}
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ color: '#2d3748', fontWeight: 600, mb: 2, mt: 2 }}>
            💰 Información Financiera
          </Typography>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            label="💵 Monto en USD"
            name="monto_usd"
            type="number"
            value={formData.monto_usd}
            onChange={onChange}
            fullWidth
            required
            inputProps={{ step: "0.01", min: "0" }}
            variant="outlined"
            helperText="Se calculará automáticamente MXN e IMSS"
            sx={{ 
              backgroundColor: '#ffffff',
              borderRadius: 2,
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: '#667eea',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#667eea',
                },
              }
            }}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            label="📅 Fecha de Registro"
            name="fecha"
            type="date"
            value={formData.fecha}
            onChange={onChange}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            sx={{ 
              backgroundColor: '#ffffff',
              borderRadius: 2,
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: '#667eea',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#667eea',
                },
              }
            }}
          />
        </Grid>

        {/* Comentarios */}
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ color: '#2d3748', fontWeight: 600, mb: 2, mt: 2 }}>
            📝 Información Adicional
          </Typography>
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            label="📝 Comentarios y Observaciones"
            name="comentarios"
            value={formData.comentarios}
            onChange={onChange}
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            placeholder="Agrega cualquier información relevante sobre el colaborador..."
            sx={{ 
              backgroundColor: '#ffffff',
              borderRadius: 2,
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: '#667eea',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#667eea',
                },
              }
            }}
          />
        </Grid>
      </Grid>
    </DialogContent>
    
    <DialogActions sx={{ p: 4, backgroundColor: '#f8fafc', gap: 2 }}>
      <Button
        onClick={onClose}
        variant="outlined"
        sx={{
          borderColor: '#cbd5e0',
          color: '#4a5568',
          px: 4,
          py: 1.2,
          fontWeight: 600,
          borderRadius: 2,
          '&:hover': { 
            borderColor: '#a0aec0',
            backgroundColor: '#f7fafc'
          },
        }}
      >
        ❌ Cancelar
      </Button>
      <Button
        type="submit"
        onClick={onSubmit}
        variant="contained"
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          px: 4,
          py: 1.2,
          fontWeight: 700,
          borderRadius: 2,
          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
          transition: 'all 0.3s ease',
          '&:hover': { 
            background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.5)'
          },
        }}
      >
        {isEditing ? '✅ Actualizar Registro' : '🚀 Crear Registro'}
      </Button>
    </DialogActions>
  </Dialog>
);

// Componente para la tabla de costos fijos moderna
const FixedCostTable = ({ costosFijos, handleEdit, handleDelete, handleEnviarACuenta }) => {
  // Asegurar que costosFijos sea siempre un array
  const costosFijosArray = Array.isArray(costosFijos) ? costosFijos : [];
  
  return (
  <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', mb: 4 }}>
    {/* Título de la tabla */}
    <Box sx={{ mb: 3, textAlign: 'center' }}>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          color: '#2d3748',
          mb: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2
        }}
      >
        👥 Registro de Colaboradores
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: '#718096',
          fontStyle: 'italic'
        }}
      >
        {costosFijosArray.length} colaboradores registrados
      </Typography>
    </Box>

  <TableContainer
    component={Paper}
      sx={{ 
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #667eea, #764ba2, #f093fb)',
        }
      }}
  >
    <Table>
        <TableHead 
          sx={{ 
            background: 'linear-gradient(135deg, #2d3748 0%, #4a5568 100%)',
          }}
        >
        <TableRow>
            <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem', py: 2 }}>
              👤 Colaborador
            </TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem', py: 2 }}>
              💼 Puesto
            </TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem', py: 2 }}>
              💵 USD
            </TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem', py: 2 }}>
              💰 MXN
            </TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem', py: 2 }}>
              🏛️ IMSS
            </TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem', py: 2 }}>
              📊 Estado
            </TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem', py: 2 }}>
              📝 Comentarios
            </TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem', py: 2 }}>
              📅 Fecha
            </TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem', py: 2 }}>
              ⚙️ Acciones
            </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
          {costosFijosArray.map((costo, index) => (
            <TableRow 
              key={costo.id} 
              sx={{ 
                backgroundColor: index % 2 === 0 ? '#fafafa' : '#ffffff',
                '&:hover': { 
                  backgroundColor: '#f0f4ff',
                  transform: 'scale(1.001)',
                  transition: 'all 0.2s ease'
                },
                borderLeft: `4px solid ${costo.cuenta_creada ? '#48bb78' : '#ed8936'}`,
              }}
            >
            <TableCell sx={{ py: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: '#48bb78'
                  }}
                />
                <Typography sx={{ fontWeight: 600, color: '#2d3748' }}>
                  {costo.colaborador}
                </Typography>
              </Box>
            </TableCell>
            <TableCell sx={{ py: 2 }}>
              <Typography sx={{ color: '#4a5568', fontWeight: 500 }}>
                {costo.puesto}
              </Typography>
            </TableCell>
            <TableCell sx={{ py: 2 }}>
              <Box
                sx={{
                  backgroundColor: '#e6fffa',
                  color: '#234e52',
                  px: 2,
                  py: 0.5,
                  borderRadius: 2,
                  display: 'inline-block',
                  fontWeight: 600,
                  fontSize: '0.875rem'
                }}
              >
                {formatterUSD.format(costo.monto_usd)}
              </Box>
            </TableCell>
            <TableCell sx={{ py: 2 }}>
              <Box
                sx={{
                  backgroundColor: '#f0fff4',
                  color: '#22543d',
                  px: 2,
                  py: 0.5,
                  borderRadius: 2,
                  display: 'inline-block',
                  fontWeight: 600,
                  fontSize: '0.875rem'
                }}
              >
                {formatterMXN.format(costo.monto_mxn)}
              </Box>
            </TableCell>
            <TableCell sx={{ py: 2 }}>
              <Box
                sx={{
                  backgroundColor: '#fef5e7',
                  color: '#744210',
                  px: 2,
                  py: 0.5,
                  borderRadius: 2,
                  display: 'inline-block',
                  fontWeight: 600,
                  fontSize: '0.875rem'
                }}
              >
                {formatterMXN.format(costo.impuestos_imss)}
              </Box>
            </TableCell>
            <TableCell>
              <Box
                sx={{
                  display: 'inline-block',
                  px: 2,
                  py: 0.5,
                  borderRadius: 1,
                  backgroundColor: costo.cuenta_creada ? '#d4edda' : '#fff3cd',
                  color: costo.cuenta_creada ? '#155724' : '#856404',
                  border: `1px solid ${costo.cuenta_creada ? '#c3e6cb' : '#ffeaa7'}`,
                  fontSize: '0.875rem',
                  fontWeight: 'bold'
                }}
              >
                {costo.cuenta_creada ? '✅ Enviado' : '⏳ Pendiente'}
              </Box>
            </TableCell>
            <TableCell sx={{ py: 2, maxWidth: 200 }}>
              <Typography 
                sx={{ 
                  color: '#4a5568', 
                  fontSize: '0.875rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
                title={costo.comentarios}
              >
                {costo.comentarios || '📝 Sin comentarios'}
              </Typography>
            </TableCell>
            <TableCell sx={{ py: 2 }}>
              <Box
                sx={{
                  backgroundColor: '#edf2f7',
                  color: '#2d3748',
                  px: 2,
                  py: 0.5,
                  borderRadius: 2,
                  display: 'inline-block',
                  fontWeight: 600,
                  fontSize: '0.875rem'
                }}
              >
                {costo.fecha ? new Date(costo.fecha).toLocaleDateString('es-MX') : '📅 Sin fecha'}
              </Box>
            </TableCell>
            <TableCell sx={{ py: 2 }}>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                <Tooltip title={costo.cuenta_creada ? "✅ Ya enviado a Cuentas por Pagar" : "📤 Duplicar en Cuentas por Pagar"}>
                  <IconButton
                    onClick={() => handleEnviarACuenta(costo)}
                    disabled={costo.cuenta_creada}
                    sx={{
                      backgroundColor: costo.cuenta_creada ? '#e2e8f0' : '#fed7d7',
                      color: costo.cuenta_creada ? '#a0aec0' : '#c53030',
                      borderRadius: 2,
                      width: 36,
                      height: 36,
                      transition: 'all 0.2s ease',
                      '&:hover': { 
                        backgroundColor: costo.cuenta_creada ? '#e2e8f0' : '#feb2b2',
                        transform: costo.cuenta_creada ? 'none' : 'scale(1.1)'
                      },
                      '&:disabled': {
                        backgroundColor: '#e2e8f0',
                        color: '#a0aec0',
                      }
                    }}
                  >
                    <FontAwesomeIcon icon={faPaperPlane} size="sm" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="✏️ Editar registro">
                  <IconButton
                    onClick={() => handleEdit(costo)}
                    sx={{ 
                      backgroundColor: '#bee3f8',
                      color: '#2b6cb0',
                      borderRadius: 2,
                      width: 36,
                      height: 36,
                      transition: 'all 0.2s ease',
                      '&:hover': { 
                        backgroundColor: '#90cdf4',
                        transform: 'scale(1.1)'
                      }
                    }}
                  >
                    <FontAwesomeIcon icon={faEdit} size="sm" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="🚫 Eliminar (Protegido)">
                  <IconButton
                    onClick={() => handleDelete(costo.id)}
                    sx={{ 
                      backgroundColor: '#fed7d7',
                      color: '#c53030',
                      borderRadius: 2,
                      width: 36,
                      height: 36,
                      transition: 'all 0.2s ease',
                      '&:hover': { 
                        backgroundColor: '#feb2b2',
                        transform: 'scale(1.1)'
                      }
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} size="sm" />
                  </IconButton>
                </Tooltip>
              </Box>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
  
  {/* Mensaje cuando no hay datos */}
  {costosFijosArray.length === 0 && (
    <Box
      sx={{
        textAlign: 'center',
        py: 6,
        backgroundColor: '#ffffff',
        borderRadius: 3,
        border: '2px dashed #cbd5e0',
        mt: 3
      }}
    >
      <Typography variant="h6" sx={{ color: '#a0aec0', mb: 1 }}>
        📋 No hay costos fijos registrados
      </Typography>
      <Typography variant="body2" sx={{ color: '#718096' }}>
        Comienza registrando tu primer colaborador
      </Typography>
    </Box>
  )}
  </Box>
  );
};

const CostosFijos = () => {
  // Hook personalizado para manejo de costos fijos
  const { 
    costosFijos, 
    loading, 
    error, 
    fetchCostosFijos, 
    createCostoFijo, 
    updateCostoFijo, 
    enviarACuentasPagar,
    clearError 
  } = useCostosFijos();

  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCostoId, setEditingCostoId] = useState(null);
  const [formData, setFormData] = useState({
    colaborador: '',
    puesto: '',
    monto_usd: '',
    comentarios: '',
    fecha: '',
  });
  const [mesFiltro, setMesFiltro] = useState('');
  const tipoCambio = 20;
  const [porcentajeUtilidad, setPorcentajeUtilidad] = useState(40);
  const [resultadoUtilidad, setResultadoUtilidad] = useState(0);
  const [totalCostos, setTotalCostos] = useState(0);

  // Estado para notificaciones
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
  };

  // Refrescar cuando cambia el filtro de mes
  useEffect(() => {
    fetchCostosFijos(mesFiltro);
  }, [mesFiltro, fetchCostosFijos]);

  useEffect(() => {
    calcularUtilidad();
  }, [costosFijos, porcentajeUtilidad]);

  // Mostrar errores del hook en snackbar
  useEffect(() => {
    if (error) {
      setSnackbar({ 
        open: true, 
        message: error, 
        severity: 'error' 
      });
      clearError();
    }
  }, [error, clearError]);

  const toggleForm = () => {
    setShowForm((prev) => !prev);
    if (showForm) {
      setFormData({
        colaborador: '',
        puesto: '',
        monto_usd: '',
        comentarios: '',
        fecha: '',
      });
      setIsEditing(false);
      setEditingCostoId(null);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.colaborador.trim()) {
      setSnackbar({ open: true, message: 'El nombre del colaborador es requerido.', severity: 'error' });
      return;
    }
    if (!formData.puesto.trim()) {
      setSnackbar({ open: true, message: 'El puesto es requerido.', severity: 'error' });
      return;
    }
    if (!formData.monto_usd || parseFloat(formData.monto_usd) <= 0) {
      setSnackbar({ open: true, message: 'El monto en USD debe ser mayor a 0.', severity: 'error' });
      return;
    }
    if (!formData.fecha) {
      setSnackbar({ open: true, message: 'La fecha es requerida.', severity: 'error' });
      return;
    }
    
    const monto_usd = parseFloat(formData.monto_usd) || 0;
    const monto_mxn = monto_usd * tipoCambio;
    const impuestos_imss = monto_mxn * 0.35;
    
    const dataToSend = {
          ...formData,
          monto_usd,
          monto_mxn,
          impuestos_imss,
    };
    
    let result;
    if (isEditing) {
      result = await updateCostoFijo(editingCostoId, dataToSend);
    } else {
      result = await createCostoFijo(dataToSend);
    }
    
    if (result.success) {
      setSnackbar({ 
        open: true, 
        message: isEditing ? 'Costo fijo actualizado exitosamente.' : 'Costo fijo registrado exitosamente.', 
        severity: 'success' 
      });
      toggleForm();
      } else {
      setSnackbar({ 
        open: true, 
        message: result.error || 'Error al enviar el formulario.', 
        severity: 'error' 
      });
    }
  };

  const handleDelete = async (id) => {
    // Protección contra eliminación de datos según política del usuario
    setSnackbar({ 
      open: true, 
      message: 'No se permite eliminar datos. Los registros deben mantenerse por razones de auditoría.', 
      severity: 'warning' 
    });
    return;
    
    /* CÓDIGO ORIGINAL COMENTADO POR POLÍTICA DE NO ELIMINACIÓN
    const confirmDelete = window.confirm('¿Estás seguro de que quieres eliminar este costo fijo?');
    if (!confirmDelete) return;
    try {
      await axios.delete(`/api/costos-fijos/${id}`);
      setCostosFijos(prev => prev.filter(costo => costo.id !== id));
      setSnackbar({ open: true, message: 'Costo fijo eliminado exitosamente.', severity: 'success' });
    } catch (error) {
      console.error('Error al eliminar el costo fijo:', error.response?.data || error.message);
      setSnackbar({ open: true, message: 'Error al eliminar el costo fijo.', severity: 'error' });
    }
    */
  };

  const handleEdit = (costo) => {
    setIsEditing(true);
    setEditingCostoId(costo.id);
    // Formatear fecha para el input type="date" (YYYY-MM-DD)
    const fechaFormateada = costo.fecha ? new Date(costo.fecha).toISOString().split('T')[0] : '';
    setFormData({
      colaborador: costo.colaborador,
      puesto: costo.puesto,
      monto_usd: costo.monto_usd,
      comentarios: costo.comentarios,
      fecha: fechaFormateada,
    });
    setShowForm(true);
  };

  const handleEnviarACuenta = async (costo) => {
    const result = await enviarACuentasPagar(costo.id);
    
    if (result.success) {
      setSnackbar({ 
        open: true, 
        message: result.data.message || 'Costo fijo enviado a cuentas por pagar exitosamente.', 
        severity: 'success' 
      });
    } else {
      setSnackbar({ 
        open: true, 
        message: result.error || 'Error al enviar a cuentas por pagar', 
        severity: 'error' 
      });
    }
  };

  const calcularUtilidad = () => {
    const total = costosFijos.reduce((acc, costo) => acc + (isNaN(costo.monto_mxn) ? 0 : costo.monto_mxn), 0);
    setTotalCostos(total);
    const utilidad = total * (porcentajeUtilidad / 100);
    setResultadoUtilidad(utilidad);
  };

  const dataGrafica =
    costosFijos.length > 0
      ? [
          {
            name: mesFiltro ? `Mes ${mesFiltro}` : 'Total',
            'Costos Fijos': totalCostos,
            'Costos Fijos + Utilidad': totalCostos + resultadoUtilidad,
          },
        ]
      : [];

  return (
    <Container sx={{ py: 4, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header moderno con gradiente */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 3,
          p: 4,
          mb: 4,
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M20 20c0 11.046-8.954 20-20 20v20h40V20H20z"/%3E%3C/g%3E%3C/svg%3E")',
          }
        }}
      >
      <Typography
        variant="h3"
        sx={{
            color: '#ffffff',
            fontWeight: 800,
            mb: 2,
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            position: 'relative',
            zIndex: 1,
          }}
        >
          💰 Gestión de Costos Fijos
      </Typography>
        <Typography
          variant="h6"
          sx={{
            color: 'rgba(255,255,255,0.9)',
            fontWeight: 400,
            position: 'relative',
            zIndex: 1,
          }}
        >
          Administración inteligente de colaboradores y gastos recurrentes
        </Typography>
      </Box>
      {loading ? (
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            my: 8,
            gap: 3
          }}
        >
          <Box sx={{ position: 'relative' }}>
            <CircularProgress 
              size={60}
              thickness={4}
              sx={{
                color: '#667eea',
                animationDuration: '550ms',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '1.5rem'
              }}
            >
              💰
            </Box>
          </Box>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#4a5568',
              fontWeight: 600,
              textAlign: 'center'
            }}
          >
            ⏳ Cargando costos fijos...
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#718096',
              textAlign: 'center'
            }}
          >
            Obteniendo información de colaboradores
          </Typography>
        </Box>
      ) : (
        <>
          <ChartComponent dataGrafica={dataGrafica} totalCostos={totalCostos} />
          <TotalsComponent
            totalCostos={totalCostos}
            porcentajeUtilidad={porcentajeUtilidad}
            setPorcentajeUtilidad={setPorcentajeUtilidad}
            resultadoUtilidad={resultadoUtilidad}
          />
          {/* Panel de controles mejorado */}
          <Box
            sx={{
              backgroundColor: '#ffffff',
              borderRadius: 3,
              p: 4,
              mb: 5,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '1px solid #e2e8f0',
              mx: 'auto',
              maxWidth: 1200
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 3,
                color: '#2d3748',
                fontWeight: 700,
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1
              }}
            >
              🎛️ Panel de Control
            </Typography>
            
            <Grid container spacing={3} alignItems="center">
              {/* Filtro de mes elegante */}
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel 
                    id="mes-filtro-label"
                    sx={{ 
                      color: '#4a5568',
                      '&.Mui-focused': { color: '#667eea' }
                    }}
                  >
                    📅 Filtrar por Mes
                  </InputLabel>
                  <Select
                    labelId="mes-filtro-label"
                    value={mesFiltro}
                    label="📅 Filtrar por Mes"
                    onChange={(e) => setMesFiltro(e.target.value)}
                    sx={{
                      borderRadius: 2,
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: '#667eea',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#667eea',
                        },
                      }
                    }}
                  >
                    <MenuItem value="">🗓️ Todos los meses</MenuItem>
                    <MenuItem value="2025-01">🟦 Enero 2025</MenuItem>
                    <MenuItem value="2025-02">🟩 Febrero 2025</MenuItem>
                    <MenuItem value="2025-03">🟨 Marzo 2025</MenuItem>
                    <MenuItem value="2025-04">🟧 Abril 2025</MenuItem>
                    <MenuItem value="2025-05">🟥 Mayo 2025</MenuItem>
                    <MenuItem value="2025-06">🟪 Junio 2025</MenuItem>
                    <MenuItem value="2025-07">🟫 Julio 2025</MenuItem>
                    <MenuItem value="2025-08">⬛ Agosto 2025</MenuItem>
                    <MenuItem value="2025-09">🔵 Septiembre 2025</MenuItem>
                    <MenuItem value="2025-10">🟢 Octubre 2025</MenuItem>
                    <MenuItem value="2025-11">🟡 Noviembre 2025</MenuItem>
                    <MenuItem value="2025-12">🔴 Diciembre 2025</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              {/* Botón refrescar mejorado */}
              <Grid item xs={12} md={4}>
                <Button
                  variant="outlined"
                  onClick={() => fetchCostosFijos(mesFiltro)}
                  disabled={loading}
                  fullWidth
                  sx={{
                    borderColor: '#667eea',
                    color: '#667eea',
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderRadius: 2,
                    borderWidth: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': { 
                      backgroundColor: '#667eea', 
                      color: '#fff',
                      borderColor: '#667eea',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)'
                    },
                    '&:disabled': {
                      borderColor: '#cbd5e0',
                      color: '#a0aec0'
                    }
                  }}
                >
                  <FontAwesomeIcon icon={faSync} style={{ marginRight: '8px' }} />
                  {loading ? '⏳ Cargando...' : '🔄 Refrescar Datos'}
                </Button>
              </Grid>
              
              {/* Botón registrar mejorado */}
              <Grid item xs={12} md={4}>
            <Button
              variant="contained"
              onClick={toggleForm}
                  fullWidth
              sx={{
                    background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                color: '#fff',
                    py: 1.5,
                fontSize: '1rem',
                    fontWeight: 600,
                borderRadius: 2,
                    boxShadow: '0 4px 15px rgba(72, 187, 120, 0.4)',
                    transition: 'all 0.3s ease',
                    '&:hover': { 
                      background: 'linear-gradient(135deg, #38a169 0%, #2f855a 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(72, 187, 120, 0.5)'
                    },
                  }}
                >
                  {showForm ? '❌ Cerrar formulario' : '➕ Registrar costo fijo'}
            </Button>
              </Grid>
            </Grid>
          </Box>
          <FixedCostFormDialog
            open={showForm}
            onClose={toggleForm}
            isEditing={isEditing}
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />
          <FixedCostTable
            costosFijos={costosFijos}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            handleEnviarACuenta={handleEnviarACuenta}
          />
        </>
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        TransitionComponent={SlideTransition}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity} 
          variant="filled" 
          sx={{ 
            width: '100%',
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            '& .MuiAlert-icon': {
              fontSize: '1.5rem'
            },
            '& .MuiAlert-message': {
              fontWeight: 600,
              fontSize: '0.95rem'
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CostosFijos;
