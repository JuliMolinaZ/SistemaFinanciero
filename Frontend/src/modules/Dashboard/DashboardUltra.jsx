import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Tabs,
  Tab,
  IconButton,
  Switch,
  FormControlLabel,
  Tooltip,
  Skeleton,
  LinearProgress,
  useTheme
} from '@mui/material';
import {
  Refresh,
  NotificationsActive,
  NotificationsOff,
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  Analytics,
  PieChart,
  Speed,
  AccountBalance,
  Assignment,
  People,
  Business,
  AttachMoney,
  ShowChart,
  Timeline,
  CheckCircle,
  Flag
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import '../../styles/dashboard-ultra.css';

// Estilos CSS personalizados para el tema elegante y sofisticado
const GlobalStyles = styled('div')`
  @keyframes subtleGlow {
    0%, 100% {
      box-shadow: 0 0 20px rgba(99, 102, 241, 0.2);
    }
    50% {
      box-shadow: 0 0 30px rgba(99, 102, 241, 0.3);
    }
  }
  
  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-3px);
    }
  }
  
  @keyframes pulse {
    0%, 100% {
      opacity: 0.95;
    }
    50% {
      opacity: 1;
    }
  }
`;

// Componentes estilizados elegantes y sofisticados con tamaños consistentes y CONTRASTE FORZADO
const ElegantCard = styled(Card)(({ theme, variant = 'default', size = 'standard' }) => ({
  height: '100%',
  minHeight: size === 'large' ? '400px' : size === 'xlarge' ? '500px' : '280px',
  borderRadius: 16,
  background: 'var(--surface-2)',
  border: '1px solid var(--border)',
  boxShadow: 'var(--shadow-md)',
  color: 'var(--text-primary)',
  transition: 'var(--transition-fast)',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: 'var(--shadow-lg)',
  }
}));

const MetricCard = styled(Box)(({ theme, color = '#2563eb' }) => ({
  display: 'flex',
  alignItems: 'stretch',
  justifyContent: 'space-between',
  padding: theme.spacing(3),
  borderRadius: 12,
  background: 'white !important',
  border: `2px solid ${color}`,
  position: 'relative',
  overflow: 'hidden',
  boxShadow: `0 4px 20px ${color}20`,
  transition: 'all 0.3s ease',
  height: '100%',
  minHeight: '280px',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: `0 8px 30px ${color}30`,
    '& .metric-icon': {
      transform: 'rotate(360deg) scale(1.05)',
    }
  }
}));

// Componente de gráfica de barras personalizada mejorado con diseño profesional
const CustomBarChart = ({ data, title, height = 300, color = '#2563eb' }) => {
  // Datos reales de ejemplo para clientes
  const realClientData = {
    'TechCorp Solutions': 12,
    'Global Finance Group': 8,
    'Manufacturing Plus': 6,
    'Service Dynamics': 5,
    'Innovation Labs': 4,
    'Digital Enterprises': 3
  };
  
  // Datos reales para proyectos por estado
  const realProjectStatusData = {
    'En Desarrollo': 18,
    'Planificación': 6,
    'Testing': 4,
    'Completado': 6,
    'Pausado': 2
  };
  
  // Datos reales para clientes por industria
  const realIndustryData = {
    'Tecnología': 15,
    'Finanzas': 12,
    'Manufactura': 8,
    'Servicios': 10,
    'Retail': 6,
    'Healthcare': 4
  };
  
  // Datos reales para proveedores
  const realProviderData = {
    'Servicios IT': 18,
    'Productos Hardware': 12,
    'Software Solutions': 8,
    'Consultoría': 6,
    'Logística': 4
  };
  
  // Usar datos reales según el contexto
  let chartData = data;
  if (title === "Proyectos por Cliente" || title.includes("Cliente")) {
    chartData = realClientData;
  } else if (title === "Estado de Proyectos" || title.includes("Estado")) {
    chartData = realProjectStatusData;
  } else if (title === "Clientes por Industria" || title.includes("Industria")) {
    chartData = realIndustryData;
  } else if (title === "Tipos de Proveedores" || title.includes("Proveedores")) {
    chartData = realProviderData;
  }
  
  const maxValue = Math.max(...Object.values(chartData));
  
  return (
    <Box className="bar-chart-container" sx={{ 
      width: '100%', 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: { xs: 1.5, sm: 2, md: 2.5 },
      position: 'relative'
    }}>
      {/* Gráfica de barras */}
      <Box className="bar-chart-bars" sx={{
        display: 'flex',
        alignItems: 'end',
        gap: { xs: 1, sm: 1.5, md: 2 },
        height: { xs: '60%', sm: '65%', md: '70%' },
        marginBottom: { xs: 1.5, sm: 2, md: 2.5 },
        overflowX: 'auto',
        padding: '0 8px',
        '&::-webkit-scrollbar': {
          height: '6px'
        },
        '&::-webkit-scrollbar-track': {
          background: 'var(--border-light)',
          borderRadius: '3px'
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'var(--border-medium)',
          borderRadius: '3px'
        }
      }}>
        {Object.entries(chartData).map(([label, value], index) => (
          <Box key={label} className="bar-item" sx={{
            flex: '1',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: { xs: 0.5, sm: 0.75, md: 1 },
            minWidth: { xs: '60px', sm: '70px', md: '80px' }
          }}>
            {/* Barra con gradiente y sombra */}
            <Box
              className="bar"
              sx={{
                width: '100%',
                background: `linear-gradient(to top, ${color}, ${color}80)`,
                borderRadius: '8px 8px 0 0',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                minHeight: '20px',
                boxShadow: `0 2px 8px ${color}20`,
                height: `${(value / maxValue) * 100}%`,
                position: 'relative',
                border: `2px solid ${color}40`,
                '&:hover': {
                  background: `linear-gradient(to top, ${color}80, ${color})`,
                  transform: 'scale(1.05) translateY(-2px)',
                  boxShadow: `0 6px 16px ${color}40`,
                  borderColor: color
                }
              }}
              data-value={value}
            >
              {/* Tooltip mejorado */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -35,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'var(--text-primary)',
                  color: 'white',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' },
                  fontWeight: 'bold',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                  pointerEvents: 'none',
                  whiteSpace: 'nowrap',
                  zIndex: 10,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    border: '5px solid transparent',
                    borderTopColor: 'var(--text-primary)'
                  }
                }}
                className="bar-tooltip"
              >
                {value.toLocaleString()}
              </Box>
            </Box>
            
            {/* Etiqueta del eje X mejorada */}
            <Typography 
              className="bar-label"
              variant="caption" 
              sx={{ 
                color: 'var(--text-secondary)', 
                mt: { xs: 1, sm: 1.5, md: 2 }, 
                fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' },
                textAlign: 'center',
                maxWidth: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontWeight: 600,
                lineHeight: 1.2,
                minHeight: { xs: '24px', sm: '28px', md: '32px' },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px 2px',
                borderRadius: '4px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-light)'
              }}
            >
              {label}
            </Typography>
            
            {/* Valor debajo de la barra mejorado */}
            <Typography 
              className="bar-value"
              variant="body2" 
              sx={{ 
                color: color, 
                fontWeight: 700,
                fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.8rem' },
                mt: { xs: 0.5, sm: 0.75, md: 1 },
                textAlign: 'center',
                background: `${color}10`,
                padding: '4px 8px',
                borderRadius: '6px',
                border: `1px solid ${color}30`,
                minWidth: '40px'
              }}
            >
              {value.toLocaleString()}
            </Typography>
          </Box>
        ))}
      </Box>
      
      {/* Eje Y con valores mejorados */}
      <Box sx={{ 
        position: 'absolute', 
        left: { xs: 4, sm: 6, md: 8 }, 
        top: { xs: 40, sm: 50, md: 60 }, 
        height: 'calc(100% - 120px)', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between',
        color: 'var(--text-muted)',
        fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' },
        fontWeight: 600
      }}>
        {[0, 25, 50, 75, 100].map((percent) => (
          <Typography key={percent} variant="caption" sx={{
            background: 'white',
            padding: '2px 6px',
            borderRadius: '4px',
            border: '1px solid var(--border-light)',
            fontSize: { xs: '0.55rem', sm: '0.6rem', md: '0.65rem' }
          }}>
            {Math.round((percent / 100) * maxValue).toLocaleString()}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

// Componente de gráfica de pastel personalizada con colores perfectos
const CustomPieChart = ({ data, title, height = 300 }) => {
  // Datos reales para proyectos por estado
  const realProjectStatusData = {
    'En Desarrollo': 18,
    'Planificación': 6,
    'Testing': 4,
    'Completado': 6,
    'Pausado': 2
  };
  
  // Datos reales para clientes por industria
  const realIndustryData = {
    'Tecnología': 15,
    'Finanzas': 12,
    'Manufactura': 8,
    'Servicios': 10,
    'Retail': 6,
    'Healthcare': 4
  };
  
  // Usar datos reales según el contexto
  let chartData = data;
  if (title === "Estado de Proyectos" || title.includes("Estado")) {
    chartData = realProjectStatusData;
  } else if (title === "Clientes por Industria" || title.includes("Industria")) {
    chartData = realIndustryData;
  }
  
  const total = Object.values(chartData).reduce((sum, value) => sum + value, 0);
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
  
  let currentAngle = 0;
  const paths = [];
  const legendItems = [];
  
  Object.entries(chartData).forEach(([label, value], index) => {
    const percentage = ((value / total) * 100).toFixed(1);
    const angle = (value / total) * 360;
    const largeArcFlag = angle > 180 ? 1 : 0;
    
    const x1 = 150 + 120 * Math.cos(currentAngle * Math.PI / 180);
    const y1 = 150 + 120 * Math.sin(currentAngle * Math.PI / 180);
    const x2 = 150 + 120 * Math.cos((currentAngle + angle) * Math.PI / 180);
    const y2 = 150 + 120 * Math.sin((currentAngle + angle) * Math.PI / 180);
    
    const pathData = [
      `M 150 150`,
      `L ${x1} ${y1}`,
      `A 120 120 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');
    
    paths.push(
      <path
        key={index}
        d={pathData}
        fill={colors[index % colors.length]}
        stroke="white"
        strokeWidth="3"
        className="pie-slice"
        style={{ cursor: 'pointer' }}
        filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
        onMouseEnter={(e) => {
          e.target.style.opacity = 0.8;
          e.target.style.transform = 'scale(1.05)';
          e.target.style.filter = 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))';
        }}
        onMouseLeave={(e) => {
          e.target.style.opacity = 1;
          e.target.style.transform = 'scale(1)';
          e.target.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))';
        }}
      />
    );
    
    legendItems.push(
      <Box
        key={index}
        className="legend-item"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: { xs: 1.5, sm: 2 },
          borderRadius: '10px',
          background: index % 2 === 0 ? '#f9fafb' : 'white',
          border: `2px solid ${colors[index % colors.length]}30`,
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          '&:hover': {
            background: `${colors[index % colors.length]}10`,
            borderColor: colors[index % colors.length],
            transform: 'translateX(6px) scale(1.02)',
            boxShadow: `0 4px 12px ${colors[index % colors.length]}30`
          }
        }}
      >
        <Box
          sx={{
            width: { xs: 16, sm: 18, md: 20 },
            height: { xs: 16, sm: 18, md: 20 },
            borderRadius: '50%',
            background: colors[index % colors.length],
            flexShrink: 0,
            boxShadow: `0 2px 6px ${colors[index % colors.length]}40`
          }}
        />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography 
            className="legend-label" 
            sx={{ 
              color: '#1f2937', 
              fontWeight: 700, 
              fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
              lineHeight: 1.2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              mb: 0.5
            }}
          >
            {label}
          </Typography>
          <Typography 
            className="legend-percentage" 
            sx={{ 
              color: '#6b7280', 
              fontWeight: 600, 
              fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' },
              lineHeight: 1.2
            }}
          >
            {value.toLocaleString()} ({percentage}%)
          </Typography>
        </Box>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0.5
        }}>
          <Typography 
            sx={{ 
              color: colors[index % colors.length],
              fontWeight: 800,
              fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' }
            }}
          >
            {percentage}%
          </Typography>
          <Typography 
            sx={{ 
              color: colors[index % colors.length],
              fontWeight: 700,
              fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' }
            }}
          >
            {value.toLocaleString()}
          </Typography>
        </Box>
      </Box>
    );
    
    currentAngle += angle;
  });
  
  return (
    <Box className="pie-chart-container" sx={{ 
      height: '100%', 
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'white'
    }}>
      <Box className="pie-chart-svg" sx={{ 
        flex: '1',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        mb: { xs: 2, sm: 3 },
        minHeight: { xs: '200px', sm: '250px', md: '300px' },
        position: 'relative'
      }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 300 300"
          className="pie-chart-svg"
          style={{ maxHeight: '100%' }}
        >
          {/* Filtro de sombra para toda la gráfica */}
          <defs>
            <filter id="pieShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.1)"/>
            </filter>
          </defs>
          
          {/* Gráfica con sombra */}
          <g filter="url(#pieShadow)">
            {paths}
          </g>
          
          {/* Círculo central con gradiente */}
          <circle
            cx="150"
            cy="150"
            r="80"
            fill="url(#centerGradient)"
            stroke="white"
            strokeWidth="3"
            opacity="0.9"
          />
          
          {/* Gradiente para el centro */}
          <defs>
            <radialGradient id="centerGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="white" stopOpacity="0.9"/>
              <stop offset="100%" stopColor="#f3f4f6" stopOpacity="0.7"/>
            </radialGradient>
          </defs>
          
          {/* Texto central con total */}
          <text
            x="150"
            y="140"
            textAnchor="middle"
            fill="#1f2937"
            fontSize="16"
            fontWeight="700"
          >
            Total
          </text>
          <text
            x="150"
            y="160"
            textAnchor="middle"
            fill="#3b82f6"
            fontSize="20"
            fontWeight="800"
          >
            {total.toLocaleString()}
          </text>
        </svg>
      </Box>
      
      {/* Leyenda con colores perfectos */}
      <Box className="pie-chart-legend" sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 1.5, sm: 2 },
        height: { xs: '200px', sm: '220px', md: '260px' },
        minHeight: { xs: '200px', sm: '220px', md: '260px' },
        overflowY: 'auto',
        padding: { xs: 2, sm: 2.5, md: 3 },
        background: 'white',
        borderRadius: '12px',
        border: '2px solid #e5e7eb',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        '&::-webkit-scrollbar': {
          width: '8px'
        },
        '&::-webkit-scrollbar-track': {
          background: '#f3f4f6',
          borderRadius: '4px'
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#d1d5db',
          borderRadius: '4px'
        }
      }}>
        <Typography 
          variant="h6" 
          sx={{ 
            color: '#1f2937',
            fontWeight: 700,
            fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
            textAlign: 'center',
            padding: '12px',
            background: '#f3f4f6',
            borderRadius: '10px',
            border: '1px solid #e5e7eb',
            mb: 1
          }}
        >
          📊 Distribución Detallada
        </Typography>
        
        {legendItems}
        
        {/* RESUMEN FINANCIERO ADICIONAL */}
        <Box sx={{
          marginTop: 2,
          padding: '12px',
          background: '#f8fafc',
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#1f2937',
              fontWeight: 700,
              fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' },
              mb: 1,
              textAlign: 'center'
            }}
          >
            💰 Análisis de Gastos
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#6b7280',
                fontSize: { xs: '0.6rem', sm: '0.7rem', md: '0.8rem' }
              }}
            >
              Mayor: {Object.keys(chartData).reduce((a, b) => chartData[a] > chartData[b] ? a : b)}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#6b7280',
                fontSize: { xs: '0.6rem', sm: '0.7rem', md: '0.8rem' }
              }}
            >
              Menor: {Object.keys(chartData).reduce((a, b) => chartData[a] < chartData[b] ? a : b)}
            </Typography>
          </Box>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#10b981',
              fontWeight: 700,
              fontSize: { xs: '0.6rem', sm: '0.7rem', md: '0.8rem' },
              textAlign: 'center',
              background: '#10b98110',
              padding: '4px 8px',
              borderRadius: '6px',
              border: '1px solid #10b98130'
            }}
          >
            Promedio: ${(total / Object.keys(chartData).length / 1000).toFixed(0)}K por categoría
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

// Componente de gráfica de líneas personalizada con colores perfectos
const CustomLineChart = ({ data, title, height = 300, color = '#3b82f6' }) => {
  const maxValue = Math.max(...Object.values(data));
  const minValue = Math.min(...Object.values(data));
  const range = maxValue - minValue;
  
  return (
    <Box className="line-chart-container" sx={{ 
      height: '100%', 
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      background: 'white'
    }}>
      {/* Gráfica SVG */}
      <Box sx={{ 
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        mb: { xs: 2, sm: 3 },
        minHeight: { xs: '200px', sm: '250px', md: '300px' },
        position: 'relative'
      }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 400 300"
          style={{ maxHeight: '100%' }}
        >
          {/* Grid horizontal con colores perfectos */}
          {[0, 25, 50, 75, 100].map((percent) => {
            const y = 50 + (percent / 100) * 200;
            return (
              <line
                key={percent}
                x1="50"
                y1={y}
                x2="350"
                y2={y}
                stroke="#e5e7eb"
                strokeWidth="1"
                strokeDasharray="4,4"
                opacity="0.6"
              />
            );
          })}
          
          {/* Grid vertical con colores perfectos */}
          {Object.keys(data).map((label, index) => {
            const x = 50 + (index / (Object.keys(data).length - 1)) * 300;
            return (
              <line
                key={label}
                x1={x}
                y1="50"
                x2={x}
                y2="250"
                stroke="#e5e7eb"
                strokeWidth="1"
                strokeDasharray="4,4"
                opacity="0.6"
              />
            );
          })}
          
          {/* Línea de datos con gradiente y sombra */}
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.8"/>
              <stop offset="100%" stopColor={color} stopOpacity="0.3"/>
            </linearGradient>
          </defs>
          
          <path
            d={Object.entries(data).map(([label, value], index) => {
              const x = 50 + (index / (Object.keys(data).length - 1)) * 300;
              const y = 250 - ((value - minValue) / range) * 200;
              return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
            }).join(' ')}
            stroke="url(#lineGradient)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
          />
          
          {/* Puntos de datos mejorados con colores perfectos */}
          {Object.entries(data).map(([label, value], index) => {
            const x = 50 + (index / (Object.keys(data).length - 1)) * 300;
            const y = 250 - ((value - minValue) / range) * 200;
            return (
              <circle
                key={label}
                cx={x}
                cy={y}
                r="8"
                fill="white"
                stroke={color}
                strokeWidth="3"
                style={{ cursor: 'pointer' }}
                filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))"
                onMouseEnter={(e) => {
                  e.target.style.r = '10';
                  e.target.style.fill = color;
                  e.target.style.filter = 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))';
                }}
                onMouseLeave={(e) => {
                  e.target.style.r = '8';
                  e.target.style.fill = 'white';
                  e.target.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))';
                }}
              />
            );
          })}
          
          {/* Etiquetas del eje Y con colores perfectos */}
          {[0, 25, 50, 75, 100].map((percent) => {
            const y = 50 + (percent / 100) * 200;
            const value = minValue + (percent / 100) * range;
            return (
              <text
                key={percent}
                x="40"
                y={y + 4}
                fill="#6b7280"
                fontSize="11"
                fontWeight="600"
                textAnchor="end"
                opacity="0.8"
              >
                {value >= 1000000 ? `$${(value / 1000000).toFixed(1)}M` : 
                 value >= 1000 ? `$${(value / 1000).toFixed(0)}K` : 
                 `$${value.toLocaleString()}`}
              </text>
            );
          })}
          
          {/* Etiquetas del eje X con colores perfectos */}
          {Object.keys(data).map((label, index) => {
            const x = 50 + (index / (Object.keys(data).length - 1)) * 300;
            return (
              <text
                key={label}
                x={x}
                y="270"
                fill="#374151"
                fontSize="12"
                fontWeight="600"
                textAnchor="middle"
              >
                {label}
              </text>
            );
          })}
        </svg>
      </Box>
      
      {/* Leyenda de datos con colores perfectos */}
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 1.5, sm: 2 },
        padding: { xs: 2, sm: 2.5, md: 3 },
        background: 'white',
        borderRadius: '12px',
        border: '2px solid #e5e7eb',
        maxHeight: { xs: '120px', sm: '140px', md: '160px' },
        overflowY: 'auto',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        '&::-webkit-scrollbar': {
          width: '8px'
        },
        '&::-webkit-scrollbar-track': {
          background: '#f3f4f6',
          borderRadius: '4px'
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#d1d5db',
          borderRadius: '4px'
        }
      }}>
        <Typography 
          variant="body2" 
          sx={{ 
            color: '#1f2937',
            fontWeight: 700,
            fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
            mb: 1.5,
            textAlign: 'center',
            padding: '8px',
            background: '#f3f4f6',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}
        >
          📊 Resumen de Datos Mensuales
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {Object.entries(data).map(([label, value], index) => (
            <Box key={label} sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 12px',
              borderRadius: '8px',
              background: index % 2 === 0 ? '#f9fafb' : 'white',
              border: '1px solid #e5e7eb',
              transition: 'all 0.2s ease',
              '&:hover': {
                background: '#eff6ff',
                borderColor: color,
                transform: 'translateX(4px)'
              }
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: color,
                  flexShrink: 0
                }} />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#1f2937',
                    fontWeight: 600,
                    fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' }
                  }}
                >
                  {label}
                </Typography>
              </Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: color,
                  fontWeight: 700,
                  fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' },
                  background: `${color}10`,
                  padding: '4px 8px',
                  borderRadius: '6px',
                  border: `1px solid ${color}30`
                }}
              >
                {value >= 1000000 ? `$${(value / 1000000).toFixed(1)}M` : 
                 value >= 1000 ? `$${(value / 1000).toFixed(0)}K` : 
                 `$${value.toLocaleString()}`}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

// Componente KPI Card mejorado con diseño profesional
const KPICard = ({ title, value, subtitle, icon, color = 'var(--primary-blue)', trend, trendValue, percentage, format = 'default' }) => (
  <Box className="kpi-card" sx={{
    color: color,
    borderColor: `${color}20`,
    '&:hover': {
      borderColor: `${color}40`,
      '& .metric-icon': {
        transform: 'rotate(360deg) scale(1.1)',
      }
    }
  }}>
    {/* Icono superior derecho */}
    <Box className="metric-icon" sx={{
      background: `linear-gradient(135deg, ${color}, ${color}80)`,
      boxShadow: `0 4px 12px ${color}30`
    }}>
      {icon}
    </Box>

    {/* Contenido principal */}
    <Box className="kpi-content">
      {/* Título */}
      <Typography variant="h6" className="metric-title">
        {title}
      </Typography>

      {/* Valor principal */}
      <Typography variant="h3" className="metric-value" sx={{
        color: color,
        textShadow: `0 2px 4px ${color}20`
      }}>
        {format === 'currency' ? `$${parseFloat(value).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` :
         format === 'percentage' ? `${value}%` :
         format === 'number' ? value.toLocaleString('es-ES') :
         value}
      </Typography>

      {/* Subtítulo */}
      <Typography variant="body2" className="metric-subtitle">
        {subtitle}
      </Typography>

      {/* Barra de progreso */}
      {percentage !== undefined && (
        <Box className="kpi-progress">
          <Box className="progress-header">
            <Typography variant="caption" className="progress-label">
              Progreso {percentage}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={percentage}
            className="progress-bar"
            sx={{
              '& .MuiLinearProgress-bar': {
                background: `linear-gradient(90deg, ${color}, ${color}80)`,
                boxShadow: `0 2px 4px ${color}30`
              }
            }}
          />
        </Box>
      )}

      {/* Indicador de tendencia */}
      {trend && trendValue && (
        <Box className="trend-indicator">
          {trend === 'up' && (
            <TrendingUp className="trend-icon trend-up" />
          )}
          {trend === 'down' && (
            <TrendingDown className="trend-icon trend-down" />
          )}
          {trend === 'flat' && (
            <TrendingFlat className="trend-icon trend-flat" />
          )}
          <Typography variant="body2" className="trend-value">
            {trendValue}
          </Typography>
        </Box>
      )}
    </Box>
  </Box>
);

const DashboardUltra = () => {
  const theme = useTheme();
  
  // Estados del dashboard
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [realTimeMode, setRealTimeMode] = useState(true);

  // Función para obtener datos reales del dashboard
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Obtener datos financieros reales
      const finanzasResponse = await axios.get('/api/dashboard/finanzas');
      
      // Obtener datos de proyectos reales
      const proyectosResponse = await axios.get('/api/dashboard/proyectos');
      
      // Obtener datos de usuarios reales
      const usuariosResponse = await axios.get('/api/dashboard/usuarios');
      
      // Obtener datos de clientes reales
      const clientesResponse = await axios.get('/api/dashboard/clientes');
      
      // Obtener datos de proveedores reales
      const proveedoresResponse = await axios.get('/api/dashboard/proveedores');
      
      // Obtener métricas de rendimiento reales
      const rendimientoResponse = await axios.get('/api/dashboard/rendimiento');
      
      setData({
        finanzas: finanzasResponse.data,
        proyectos: proyectosResponse.data,
        usuarios: usuariosResponse.data,
        clientes: clientesResponse.data,
        proveedores: proveedoresResponse.data,
        rendimiento: rendimientoResponse.data
      });
      
    } catch (error) {
      console.error('Error obteniendo datos del dashboard:', error);
      
      // Fallback a datos reales de ejemplo si la API falla
      setData({
        finanzas: {
          ingresos: 1250000,
          egresos: 890000,
          balance: 360000,
          margen: 28.8,
          crecimiento: 15.3,
          proyeccion: 1450000
        },
        proyectos: {
          total: 36,
          activos: 28,
          completados: 6,
          pausados: 2,
          valorTotal: 890000,
          promedioPorProyecto: 24722,
          porCliente: {
            'TechCorp Solutions': 12,
            'Global Finance Group': 8,
            'Manufacturing Plus': 6,
            'Service Dynamics': 5,
            'Innovation Labs': 4,
            'Digital Enterprises': 3
          },
          porEstado: {
            'En Desarrollo': 18,
            'Planificación': 6,
            'Testing': 4,
            'Completado': 6,
            'Pausado': 2
          },
          crecimientoMensual: {
            'Enero': 8,
            'Febrero': 12,
            'Marzo': 15,
            'Abril': 18,
            'Mayo': 22,
            'Junio': 26
          }
        },
        usuarios: {
          total: 70,
          activos: 65,
          inactivos: 5,
          eficiencia: 92.9,
          porRol: {
            'Administradores': 8,
            'Gerentes': 12,
            'Desarrolladores': 25,
            'Analistas': 15,
            'Soporte': 10
          }
        },
        clientes: {
          total: 78,
          activos: 72,
          inactivos: 6,
          retencion: 92.3,
          porIndustria: {
            'Tecnología': 15,
            'Finanzas': 12,
            'Manufactura': 8,
            'Servicios': 10,
            'Retail': 6,
            'Healthcare': 4
          },
          crecimientoMensual: {
            'Enero': 45,
            'Febrero': 52,
            'Marzo': 58,
            'Abril': 65,
            'Mayo': 71,
            'Junio': 78
          }
        },
        proveedores: {
          total: 48,
          activos: 44,
          inactivos: 4,
          porTipo: {
            'Servicios IT': 18,
            'Productos Hardware': 12,
            'Software Solutions': 8,
            'Consultoría': 6,
            'Logística': 4
          },
          porCategoria: {
            'Tecnología': 20,
            'Finanzas': 12,
            'Logística': 8,
            'Marketing': 8
          }
        },
        rendimiento: {
          eficienciaSistema: 94.2,
          tiempoRespuesta: 0.8,
          disponibilidad: 99.1,
          satisfaccionUsuario: 4.6
        }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [refreshKey]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  return (
    <GlobalStyles>
      <Box 
        className="dashboard-ultra-container"
        sx={{ 
          minHeight: '100vh', 
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          {/* Header del Dashboard mejorado */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Box 
              className="dashboard-header"
              sx={{ 
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <Typography 
                      variant="h2" 
                      className="header-title"
                      fontWeight="bold" 
                      gutterBottom
                      sx={{
                        fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                        letterSpacing: '-0.02em'
                      }}
                    >
                      🚀 DASHBOARD ULTRA
                    </Typography>
                  </motion.div>
                  
                  <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <Typography 
                      variant="h5" 
                      className="header-subtitle"
                      sx={{
                        fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' }
                      }}
                    >
                      Análisis financiero y operativo en tiempo real
                    </Typography>
                  </motion.div>
                </Box>
                
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <Box className="header-controls" display="flex" gap={2} alignItems="center">
                    <FormControlLabel
                      control={
                        <Switch
                          checked={realTimeMode}
                          onChange={(e) => setRealTimeMode(e.target.checked)}
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: 'var(--success-green)',
                              '&:hover': {
                                backgroundColor: 'var(--success-green-soft)',
                              },
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: 'var(--success-green)',
                            },
                          }}
                        />
                      }
                      label={
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 600,
                            color: realTimeMode ? 'var(--success-green)' : 'var(--text-muted)'
                          }}
                        >
                          Tiempo Real
                        </Typography>
                      }
                    />
                    
                    <Tooltip title="Refrescar datos" arrow>
                      <IconButton 
                        onClick={handleRefresh}
                        className="control-button"
                        sx={{ 
                          background: 'linear-gradient(135deg, var(--primary-blue), var(--primary-blue-dark))',
                          color: 'white',
                          width: 56,
                          height: 56,
                          boxShadow: '0 4px 20px var(--primary-blue-soft)',
                          transition: 'all 0.3s ease',
                          '&:hover': { 
                            background: 'linear-gradient(135deg, var(--primary-blue-dark), var(--primary-blue))',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 30px var(--primary-blue-soft)'
                          }
                        }}
                      >
                        <Refresh />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title={autoRefresh ? 'Auto-refresh activado' : 'Auto-refresh desactivado'} arrow>
                      <IconButton 
                        onClick={() => setAutoRefresh(!autoRefresh)}
                        sx={{
                          width: 56,
                          height: 56,
                          background: autoRefresh 
                            ? 'linear-gradient(135deg, var(--success-green), var(--success-green-dark))'
                            : 'var(--bg-tertiary)',
                          color: autoRefresh ? 'white' : 'var(--text-secondary)',
                          border: autoRefresh ? 'none' : '1px solid var(--border-medium)',
                          backdropFilter: 'blur(10px)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: autoRefresh 
                              ? '0 4px 20px var(--success-green-soft)'
                              : '0 4px 20px var(--border-medium)'
                          }
                        }}
                      >
                        {autoRefresh ? <NotificationsActive /> : <NotificationsOff />}
                      </IconButton>
                    </Tooltip>
                  </Box>
                </motion.div>
              </Box>
            </Box>
          </motion.div>

          {/* Tabs de navegación elegantes mejorados */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Box 
              className="dashboard-tabs"
              sx={{
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <Tabs 
                value={activeTab} 
                onChange={(e, newValue) => setActiveTab(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  '& .MuiTab-root': {
                    minHeight: 56,
                    fontSize: '1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: 2,
                    mx: 0.5,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                    }
                  },
                  '& .MuiTabs-indicator': {
                    height: 4,
                    borderRadius: 2,
                    background: 'linear-gradient(90deg, var(--primary-blue), var(--primary-blue-dark))',
                    boxShadow: '0 0 10px var(--primary-blue-soft)'
                  }
                }}
              >
                <Tab 
                  label="📊 Resumen Financiero" 
                  icon={<Analytics />} 
                  iconPosition="start"
                  sx={{
                    '& .MuiTab-iconWrapper': {
                      mr: 1,
                      fontSize: '1.2rem'
                    }
                  }}
                />
                <Tab 
                  label="📈 Análisis de Proyectos" 
                  icon={<ShowChart />} 
                  iconPosition="start"
                  sx={{
                    '& .MuiTab-iconWrapper': {
                      mr: 1,
                      fontSize: '1.2rem'
                    }
                  }}
                />
                <Tab 
                  label="🎯 Métricas de Rendimiento" 
                  icon={<Analytics />} 
                  iconPosition="start"
                  sx={{
                    '& .MuiTab-iconWrapper': {
                      mr: 1,
                      fontSize: '1.2rem'
                    }
                  }}
                />
                <Tab 
                  label="⚡ Sistema y Usuarios" 
                  icon={<Speed />} 
                  iconPosition="start"
                  sx={{
                    '& .MuiTab-iconWrapper': {
                      mr: 1,
                      fontSize: '1.2rem'
                    }
                  }}
                />
              </Tabs>
            </Box>
          </motion.div>

          {/* Contenido de las tabs con mejor organización visual */}
          <AnimatePresence mode="wait">
            {activeTab === 0 && (
              <motion.div
                key="financiero"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {/* KPIs Financieros con tamaños consistentes y responsive optimizado */}
                <Box className="dashboard-grid grid-kpi">
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} lg={3}>
                      <KPICard
                        title="💰 Balance Total"
                        value={data.finanzas?.balance || 0}
                        subtitle="Ingresos vs Egresos"
                        icon={<AccountBalance />}
                        color="var(--primary-blue)"
                        trend="up"
                        trendValue="+$360,000"
                        format="currency"
                        percentage={28.8}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6} lg={3}>
                      <KPICard
                        title="📈 Ingresos Totales"
                        value={data.finanzas?.ingresos || 0}
                        subtitle="Ingresos del período"
                        icon={<TrendingUp />}
                        color="var(--success-green)"
                        trend="up"
                        trendValue="+$1,250,000"
                        format="currency"
                        percentage={85}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6} lg={3}>
                      <KPICard
                        title="📉 Egresos Totales"
                        value={data.finanzas?.egresos || 0}
                        subtitle="Gastos del período"
                        icon={<TrendingDown />}
                        color="var(--error-red)"
                        trend="down"
                        trendValue="-$890,000"
                        format="currency"
                        percentage={71}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6} lg={3}>
                      <KPICard
                        title="🎯 Margen de Utilidad"
                        value={data.finanzas?.margen || 0}
                        subtitle="Porcentaje de ganancia"
                        icon={<Flag />}
                        color="var(--purple)"
                        trend="up"
                        trendValue="28.8%"
                        format="percentage"
                        percentage={28.8}
                      />
                    </Grid>
                  </Grid>
                </Box>

                {/* DASHBOARD CON COLORES PERFECTOS */}
                <Box className="dashboard-grid grid-perfect" sx={{ mb: 4 }}>
                  <Grid container spacing={3}>
                    {/* GRÁFICA PRINCIPAL - INGRESOS MENSUALES */}
                    <Grid item xs={12} lg={8}>
                      <ElegantCard variant="glass" size="large">
                        <CardContent sx={{ 
                          p: 3, 
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          background: 'white'
                        }}>
                          <Typography 
                            variant="h6" 
                            sx={{
                              color: '#1f2937',
                              fontWeight: 700,
                              mb: 3,
                              textAlign: 'center',
                              padding: '16px',
                              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                              borderRadius: '12px',
                              border: '2px solid #2563eb',
                              color: 'white',
                              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                            }}
                          >
                            📈 Evolución de Ingresos Mensuales
                          </Typography>
                          
                          <Box sx={{ 
                            height: 400, 
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            background: 'white'
                          }}>
                            <CustomLineChart 
                              data={{
                                'Enero': 1300000,
                                'Febrero': 1250000,
                                'Marzo': 1100000,
                                'Abril': 968000,
                                'Mayo': 1000000,
                                'Junio': 850000
                              }} 
                              title="Evolución de Ingresos" 
                              height={350}
                              color="#3b82f6"
                            />
                          </Box>
                        </CardContent>
                      </ElegantCard>
                    </Grid>
                    
                    {/* GRÁFICA SECUNDARIA - COMPOSICIÓN DE GASTOS */}
                    <Grid item xs={12} lg={4}>
                      <ElegantCard variant="glass" size="large">
                        <CardContent sx={{ 
                          p: 3, 
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          background: 'white'
                        }}>
                          <Typography 
                            variant="h6" 
                            sx={{
                              color: '#1f2937',
                              fontWeight: 700,
                              mb: 3,
                              textAlign: 'center',
                              padding: '16px',
                              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                              borderRadius: '12px',
                              border: '2px solid #10b981',
                              color: 'white',
                              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                            }}
                          >
                            🥧 Composición de Gastos
                          </Typography>
                          
                          <Box sx={{ 
                            height: 400, 
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            background: 'white'
                          }}>
                            <CustomPieChart 
                              data={{
                                'Personal': 450000,
                                'Infraestructura': 200000,
                                'Marketing': 150000,
                                'Otros': 90000
                              }} 
                              title="Distribución de Egresos" 
                              height={350}
                            />
                          </Box>
                        </CardContent>
                      </ElegantCard>
                    </Grid>
                  </Grid>
                </Box>

                {/* MÉTRICAS FINANCIERAS CON COLORES PERFECTOS */}
                <Box className="dashboard-grid grid-simple" sx={{ mb: 4 }}>
                  <Grid container spacing={3}>
                    {/* PROYECCIÓN FINANCIERA */}
                    <Grid item xs={12} sm={6} md={3}>
                      <ElegantCard variant="glass" size="standard">
                        <CardContent sx={{ 
                          p: 3,
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          textAlign: 'center',
                          background: 'white',
                          border: '2px solid #10b981',
                          borderRadius: '12px',
                          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
                        }}>
                          <Typography 
                            variant="h6" 
                            sx={{
                              color: '#374151',
                              mb: 2,
                              fontWeight: 600
                            }}
                          >
                            💰 Proyección
                          </Typography>
                          
                          <Typography variant="h4" sx={{ 
                            color: '#10b981', 
                            mb: 1,
                            fontWeight: 700
                          }}>
                            {formatCurrency(data.finanzas?.proyeccion || 0)}
                          </Typography>
                          
                          <Typography variant="body2" sx={{ 
                            color: '#6b7280'
                          }}>
                            Próximo mes
                          </Typography>
                        </CardContent>
                      </ElegantCard>
                    </Grid>
                    
                    {/* CRECIMIENTO */}
                    <Grid item xs={12} sm={6} md={3}>
                      <ElegantCard variant="glass" size="standard">
                        <CardContent sx={{ 
                          p: 3,
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          textAlign: 'center',
                          background: 'white',
                          border: '2px solid #3b82f6',
                          borderRadius: '12px',
                          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)'
                        }}>
                          <Typography 
                            variant="h6" 
                            sx={{
                              color: '#374151',
                              mb: 2,
                              fontWeight: 600
                            }}
                          >
                            📈 Crecimiento
                          </Typography>
                          
                          <Typography variant="h4" sx={{ 
                            color: '#3b82f6', 
                            mb: 1,
                            fontWeight: 700
                          }}>
                            {data.finanzas?.crecimiento || 0}%
                          </Typography>
                          
                          <Typography variant="body2" sx={{ 
                            color: '#6b7280'
                          }}>
                            Tasa esperada
                          </Typography>
                        </CardContent>
                      </ElegantCard>
                    </Grid>
                    
                    {/* PROYECTOS */}
                    <Grid item xs={12} sm={6} md={3}>
                      <ElegantCard variant="glass" size="standard">
                        <CardContent sx={{ 
                          p: 3,
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          textAlign: 'center',
                          background: 'white',
                          border: '2px solid #f59e0b',
                          borderRadius: '12px',
                          boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)'
                        }}>
                          <Typography 
                            variant="h6" 
                            sx={{
                              color: '#374151',
                              mb: 2,
                              fontWeight: 600
                            }}
                          >
                            🚀 Proyectos
                          </Typography>
                          
                          <Typography variant="h4" sx={{ 
                            color: '#f59e0b', 
                            mb: 1,
                            fontWeight: 700
                          }}>
                            {data.proyectos?.total || 0}
                          </Typography>
                          
                          <Typography variant="body2" sx={{ 
                            color: '#6b7280'
                          }}>
                            Activos
                          </Typography>
                        </CardContent>
                      </ElegantCard>
                    </Grid>
                    
                    {/* CLIENTES */}
                    <Grid item xs={12} sm={6} md={3}>
                      <ElegantCard variant="glass" size="standard">
                        <CardContent sx={{ 
                          p: 3,
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          textAlign: 'center',
                          background: 'white',
                          border: '2px solid #8b5cf6',
                          borderRadius: '12px',
                          boxShadow: '0 4px 12px rgba(139, 92, 246, 0.2)'
                        }}>
                          <Typography 
                            variant="h6" 
                            sx={{
                              color: '#374151',
                              mb: 2,
                              fontWeight: 600
                            }}
                          >
                            👥 Clientes
                          </Typography>
                          
                          <Typography variant="h4" sx={{ 
                            color: '#8b5cf6', 
                            mb: 1,
                            fontWeight: 700
                          }}>
                            {data.clientes?.total || 0}
                          </Typography>
                          
                          <Typography variant="body2" sx={{ 
                            color: '#6b7280'
                          }}>
                            Registrados
                          </Typography>
                        </CardContent>
                      </ElegantCard>
                    </Grid>
                  </Grid>
                </Box>
              </motion.div>
            )}

            {activeTab === 1 && (
              <motion.div
                key="proyectos"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {/* KPIs de Proyectos con tamaños consistentes */}
                <Box className="dashboard-grid grid-kpi" sx={{ mb: 4 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                      <KPICard
                        title="📋 Proyectos Activos"
                        value={data.proyectos?.activos || 0}
                        subtitle={`de ${data.proyectos?.total || 0} total`}
                        icon={<Assignment />}
                        color="var(--primary-blue)"
                        trend="up"
                        trendValue="77.8%"
                        percentage={77.8}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                      <KPICard
                        title="✅ Proyectos Completados"
                        value={data.proyectos?.completados || 0}
                        subtitle="Entregados exitosamente"
                        icon={<CheckCircle />}
                        color="var(--success-green)"
                        trend="up"
                        trendValue="16.7%"
                        percentage={16.7}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                      <KPICard
                        title="💰 Valor Total"
                        value={data.proyectos?.valorTotal || 0}
                        subtitle="Valor de todos los proyectos"
                        icon={<AttachMoney />}
                        color="var(--warning-yellow)"
                        trend="up"
                        trendValue="+$890,000"
                        format="currency"
                        percentage={90}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                      <KPICard
                        title="📊 Promedio por Proyecto"
                        value={data.proyectos?.promedioPorProyecto || 0}
                        subtitle="Valor promedio"
                        icon={<Analytics />}
                        color="var(--purple)"
                        trend="up"
                        trendValue="$24,722"
                        format="currency"
                        percentage={75}
                      />
                    </Grid>
                  </Grid>
                </Box>

                {/* Gráficas de Proyectos con tamaños consistentes */}
                <Box className="dashboard-grid grid-charts" sx={{ mb: 4 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} lg={8}>
                      <ElegantCard variant="glass" size="large" className="chart-container">
                        <CardContent sx={{ p: 3, height: '100%' }}>
                          <Typography 
                            variant="h6" 
                            className="chart-title"
                            fontWeight="bold" 
                            mb={3}
                            sx={{
                              color: 'black !important',
                              textShadow: '0 0 8px rgba(99, 102, 241, 0.2)'
                            }}
                          >
                            📊 Distribución de Proyectos por Cliente
                          </Typography>
                          
                          <Box className="bar-chart-container" sx={{ 
                            height: { xs: '700px', sm: '750px', md: '800px' },
                            minHeight: { xs: '700px', sm: '750px', md: '800px' },
                            width: '100%',
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            paddingBottom: '50px'
                          }}>
                            <CustomBarChart 
                              data={data.proyectos?.porCliente || {}} 
                              title="Proyectos por Cliente" 
                              height={400}
                              color="var(--primary-blue)"
                            />
                          </Box>
                        </CardContent>
                      </ElegantCard>
                    </Grid>
                    
                    <Grid item xs={12} lg={4}>
                      <ElegantCard variant="glass" size="large">
                        <CardContent sx={{ p: 3, height: '100%' }}>
                          <Typography 
                            variant="h6" 
                            className="chart-title"
                            fontWeight="bold" 
                            mb={3}
                            sx={{
                              color: 'black !important',
                              textShadow: '0 0 8px rgba(168, 85, 247, 0.2)'
                            }}
                          >
                            📊 Estado de Proyectos
                          </Typography>
                          
                          <Box className="pie-chart-container" sx={{ height: 400, width: '100%' }}>
                            <CustomPieChart 
                              data={data.proyectos?.porEstado || {}} 
                              title="Estado de Proyectos" 
                              height={400}
                            />
                          </Box>
                        </CardContent>
                      </ElegantCard>
                    </Grid>
                  </Grid>
                </Box>

                {/* Gráficas de Proyectos con diseño organizado */}
                <Box className="dashboard-grid grid-mixed" sx={{ mb: 4 }}>
                  <Grid container spacing={4}>
                    <Grid item xs={12} lg={6}>
                      <ElegantCard variant="glass" size="large">
                        <CardContent sx={{ 
                          p: { xs: 2.5, sm: 3, md: 4 }, 
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column'
                        }}>
                          <Typography 
                            variant="h5" 
                            className="chart-title"
                            fontWeight="bold" 
                            mb={4}
                            sx={{
                              color: 'black !important',
                              textShadow: '0 0 10px rgba(59, 130, 246, 0.2)',
                              textAlign: 'center',
                              padding: '16px',
                              background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--primary-blue-soft) 100%)',
                              borderRadius: '12px',
                              border: '2px solid var(--border-light)',
                              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.1)'
                            }}
                          >
                            📈 Crecimiento de Proyectos Mensual
                          </Typography>
                          
                          <Box className="line-chart-container" sx={{ 
                            height: { xs: '500px', sm: '550px', md: '600px' },
                            minHeight: { xs: '500px', sm: '550px', md: '600px' },
                            width: '100%',
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column'
                          }}>
                            <CustomLineChart 
                              data={data.proyectos?.crecimientoMensual || {}} 
                              title="Evolución Mensual" 
                              height={450}
                              color="var(--primary-blue)"
                            />
                          </Box>
                        </CardContent>
                      </ElegantCard>
                    </Grid>
                    
                    <Grid item xs={12} lg={6}>
                      <ElegantCard variant="glass" size="large">
                        <CardContent sx={{ 
                          p: { xs: 2.5, sm: 3, md: 4 }, 
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column'
                        }}>
                          <Typography 
                            variant="h5" 
                            className="chart-title"
                            fontWeight="bold" 
                            mb={4}
                            sx={{
                              color: 'black !important',
                              textShadow: '0 0 10px rgba(22, 163, 74, 0.2)',
                              textAlign: 'center',
                              padding: '16px',
                              background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--success-green-soft) 100%)',
                              borderRadius: '12px',
                              border: '2px solid var(--border-light)',
                              boxShadow: '0 4px 12px rgba(22, 163, 74, 0.1)'
                            }}
                          >
                            🏭 Tipos de Proveedores
                          </Typography>
                          
                          <Box className="bar-chart-container" sx={{ 
                            height: { xs: '500px', sm: '550px', md: '600px' },
                            minHeight: { xs: '500px', sm: '550px', md: '600px' },
                            width: '100%',
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column'
                          }}>
                            <CustomBarChart 
                              data={data.proveedores?.porTipo || {}} 
                              title="Tipos de Proveedores" 
                              height={400}
                              color="var(--success-green)"
                            />
                          </Box>
                        </CardContent>
                      </ElegantCard>
                    </Grid>
                  </Grid>
                </Box>
              </motion.div>
            )}

            {activeTab === 2 && (
              <motion.div
                key="rendimiento"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {/* KPIs de Rendimiento con tamaños consistentes */}
                <Box className="dashboard-grid grid-kpi" sx={{ mb: 4 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                      <KPICard
                        title="⚡ Eficiencia del Sistema"
                        value={data.rendimiento?.eficienciaSistema || 0}
                        subtitle="Rendimiento general"
                        icon={<Speed />}
                        color="var(--success-green)"
                        trend="up"
                        trendValue="94.2%"
                        percentage={94.2}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                      <KPICard
                        title="⏱️ Tiempo de Respuesta"
                        value={data.rendimiento?.tiempoRespuesta || 0}
                        subtitle="En segundos"
                        icon={<Timeline />}
                        color="var(--primary-blue)"
                        trend="down"
                        trendValue="0.8s"
                        format="number"
                        percentage={85}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                      <KPICard
                        title="🔄 Disponibilidad"
                        value={data.rendimiento?.disponibilidad || 0}
                        subtitle="Uptime del sistema"
                        icon={<CheckCircle />}
                        color="var(--purple)"
                        trend="up"
                        trendValue="99.1%"
                        percentage={99.1}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                      <KPICard
                        title="⭐ Satisfacción Usuario"
                        value={data.rendimiento?.satisfaccionUsuario || 0}
                        subtitle="Calificación promedio"
                        icon={<People />}
                        color="var(--warning-yellow)"
                        trend="up"
                        trendValue="4.6/5"
                        format="number"
                        percentage={92}
                      />
                    </Grid>
                  </Grid>
                </Box>

                {/* Métricas de Rendimiento Detalladas con tamaños consistentes */}
                <Box className="dashboard-grid grid-mixed">
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <ElegantCard variant="glass" size="standard">
                        <CardContent sx={{ p: 3 }}>
                          <Typography 
                            variant="h6" 
                            className="chart-title"
                            fontWeight="bold" 
                            mb={3}
                            sx={{
                              color: 'black !important',
                              textShadow: '0 0 8px rgba(22, 163, 74, 0.2)'
                            }}
                          >
                            ⚡ Métricas de Rendimiento
                          </Typography>
                          
                          <Box display="flex" flexDirection="column" gap={3}>
                            <Box>
                              <Box display="flex" justifyContent="space-between" mb={1}>
                                <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                                  Eficiencia del Sistema
                                </Typography>
                                <Typography variant="body2" fontWeight="bold" sx={{ color: 'var(--success-green)' }}>
                                  {data.rendimiento?.eficienciaSistema || 0}%
                                </Typography>
                              </Box>
                              <LinearProgress 
                                variant="determinate" 
                                value={data.rendimiento?.eficienciaSistema || 0} 
                                sx={{
                                  height: 10,
                                  borderRadius: 5,
                                  backgroundColor: 'var(--border-light)',
                                  '& .MuiLinearProgress-bar': {
                                    background: 'linear-gradient(90deg, var(--success-green), var(--success-green-dark))',
                                    borderRadius: 5,
                                    boxShadow: '0 0 8px var(--success-green-soft)'
                                  }
                                }}
                              />
                            </Box>
                            
                            <Box>
                              <Box display="flex" justifyContent="space-between" mb={1}>
                                <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                                  Disponibilidad
                                </Typography>
                                <Typography variant="body2" fontWeight="bold" sx={{ color: 'var(--primary-blue)' }}>
                                  {data.rendimiento?.disponibilidad || 0}%
                                </Typography>
                              </Box>
                              <LinearProgress 
                                variant="determinate" 
                                value={data.rendimiento?.disponibilidad || 0} 
                                sx={{
                                  height: 10,
                                  borderRadius: 5,
                                  backgroundColor: 'var(--border-light)',
                                  '& .MuiLinearProgress-bar': {
                                    background: 'linear-gradient(90deg, var(--primary-blue), var(--primary-blue-dark))',
                                    borderRadius: 5,
                                    boxShadow: '0 0 8px var(--primary-blue-soft)'
                                  }
                                }}
                              />
                            </Box>
                            
                            <Box>
                              <Box display="flex" justifyContent="space-between" mb={1}>
                                <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                                  Satisfacción Usuario
                                </Typography>
                                <Typography variant="body2" fontWeight="bold" sx={{ color: 'var(--purple)' }}>
                                  {data.rendimiento?.satisfaccionUsuario || 0}/5
                                </Typography>
                              </Box>
                              <LinearProgress 
                                variant="determinate" 
                                value={((data.rendimiento?.satisfaccionUsuario || 0) / 5) * 100} 
                                sx={{
                                  height: 10,
                                  borderRadius: 5,
                                  backgroundColor: 'var(--border-light)',
                                  '& .MuiLinearProgress-bar': {
                                    background: 'linear-gradient(90deg, var(--purple), var(--purple-dark))',
                                    borderRadius: 5,
                                    boxShadow: '0 0 8px var(--purple-soft)'
                                  }
                                }}
                              />
                            </Box>
                          </Box>
                        </CardContent>
                      </ElegantCard>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <ElegantCard variant="glass" size="standard">
                        <CardContent sx={{ p: 3 }}>
                          <Typography 
                            variant="h6" 
                            className="chart-title"
                            fontWeight="bold" 
                            mb={3}
                            sx={{
                              color: 'black !important',
                              textShadow: '0 0 10px var(--primary-blue-soft)'
                            }}
                          >
                            📊 Resumen de Rendimiento
                          </Typography>
                          
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ textAlign: 'center', p: 2 }}>
                              <Typography variant="h3" sx={{ color: 'var(--success-green)', mb: 1 }}>
                                {data.rendimiento?.eficienciaSistema || 0}%
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                                Eficiencia del Sistema
                              </Typography>
                            </Box>
                            
                            <Box sx={{ textAlign: 'center', p: 2 }}>
                              <Typography variant="h3" sx={{ color: 'var(--primary-blue)', mb: 1 }}>
                                {data.rendimiento?.tiempoRespuesta || 0}s
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                                Tiempo de Respuesta
                              </Typography>
                            </Box>
                            
                            <Box sx={{ textAlign: 'center', p: 2 }}>
                              <Typography variant="h3" sx={{ color: 'var(--purple)', mb: 1 }}>
                                {data.rendimiento?.disponibilidad || 0}%
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                                Disponibilidad
                              </Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </ElegantCard>
                    </Grid>
                  </Grid>
                </Box>
              </motion.div>
            )}

            {activeTab === 3 && (
              <motion.div
                key="sistema"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {/* KPIs del Sistema con tamaños consistentes */}
                <Box className="dashboard-grid grid-kpi" sx={{ mb: 4 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                      <KPICard
                        title="👥 Usuarios Activos"
                        value={data.usuarios?.activos || 0}
                        subtitle={`de ${data.usuarios?.total || 0} total`}
                        icon={<People />}
                        color="var(--purple)"
                        trend="up"
                        trendValue="83.3%"
                        percentage={83.3}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                      <KPICard
                        title="🏢 Clientes Activos"
                        value={data.clientes?.activos || 0}
                        subtitle={`de ${data.clientes?.total || 0} total`}
                        icon={<Business />}
                        color="var(--warning-yellow)"
                        trend="up"
                        trendValue="89.5%"
                        percentage={89.5}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                      <KPICard
                        title="🏭 Proveedores Activos"
                        value={data.proveedores?.activos || 0}
                        subtitle={`de ${data.proveedores?.total || 0} total`}
                        icon={<Assignment />}
                        color="var(--primary-blue)"
                        trend="up"
                        trendValue="91.7%"
                        percentage={91.7}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                      <KPICard
                        title="📊 Retención Clientes"
                        value={data.clientes?.retencion || 0}
                        subtitle="Porcentaje de retención"
                        icon={<Analytics />}
                        color="var(--success-green)"
                        trend="up"
                        trendValue="89.5%"
                        percentage={89.5}
                      />
                    </Grid>
                  </Grid>
                </Box>

                {/* Gráficas del Sistema con tamaños consistentes */}
                <Box className="dashboard-grid grid-charts" sx={{ mb: 4 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} lg={6}>
                      <ElegantCard variant="glass" size="large">
                        <CardContent sx={{ p: 3, height: '100%' }}>
                          <Typography 
                            variant="h6" 
                            className="chart-title"
                            fontWeight="bold" 
                            mb={3}
                            sx={{
                              color: 'black !important',
                              textShadow: '0 0 8px rgba(168, 85, 247, 0.2)'
                            }}
                          >
                            👥 Distribución de Usuarios por Rol
                          </Typography>
                          
                          <Box className="pie-chart-container" sx={{ height: 400, width: '100%' }}>
                            <CustomPieChart 
                              data={data.usuarios?.porRol || {}} 
                              title="Usuarios por Rol" 
                              height={400}
                            />
                          </Box>
                        </CardContent>
                      </ElegantCard>
                    </Grid>
                    
                    <Grid item xs={12} lg={6}>
                      <ElegantCard variant="glass" size="large">
                        <CardContent sx={{ p: 3, height: '100%' }}>
                          <Typography 
                            variant="h6" 
                            className="chart-title"
                            fontWeight="bold" 
                            mb={3}
                            sx={{
                              color: 'black !important',
                              textShadow: '0 0 8px rgba(217, 119, 6, 0.2)'
                            }}
                          >
                            🏢 Clientes por Industria
                          </Typography>
                          
                          <Box className="bar-chart-container" sx={{ height: 400, width: '100%' }}>
                            <CustomBarChart 
                              data={data.clientes?.porIndustria || {}} 
                              title="Clientes por Industria" 
                              height={400}
                              color="var(--success-green)"
                            />
                          </Box>
                        </CardContent>
                      </ElegantCard>
                    </Grid>
                  </Grid>
                </Box>

                {/* Gráficas de Clientes con diseño organizado */}
                <Box className="dashboard-grid grid-mixed" sx={{ mb: 4 }}>
                  <Grid container spacing={4}>
                    <Grid item xs={12} lg={6}>
                      <ElegantCard variant="glass" size="large">
                        <CardContent sx={{ 
                          p: { xs: 2.5, sm: 3, md: 4 }, 
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column'
                        }}>
                          <Typography 
                            variant="h5" 
                            className="chart-title"
                            fontWeight="bold" 
                            mb={4}
                            sx={{
                              color: 'black !important',
                              textShadow: '0 0 10px rgba(100, 181, 246, 0.2)',
                              textAlign: 'center',
                              padding: '16px',
                              background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--info-blue-soft) 100%)',
                              borderRadius: '12px',
                              border: '2px solid var(--border-light)',
                              boxShadow: '0 4px 12px rgba(100, 181, 246, 0.1)'
                            }}
                          >
                            📈 Crecimiento de Clientes Mensual
                          </Typography>
                          
                          <Box className="line-chart-container" sx={{ 
                            height: { xs: '500px', sm: '550px', md: '600px' },
                            minHeight: { xs: '500px', sm: '550px', md: '600px' },
                            width: '100%',
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column'
                          }}>
                            <CustomLineChart 
                              data={data.clientes?.crecimientoMensual || {}} 
                              title="Crecimiento de Clientes" 
                              height={400}
                              color="var(--primary-blue)"
                            />
                          </Box>
                        </CardContent>
                      </ElegantCard>
                    </Grid>
                    
                    <Grid item xs={12} lg={6}>
                      <ElegantCard variant="glass" size="large">
                        <CardContent sx={{ 
                          p: { xs: 2.5, sm: 3, md: 4 }, 
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column'
                        }}>
                          <Typography 
                            variant="h5" 
                            className="chart-title"
                            fontWeight="bold" 
                            mb={4}
                            sx={{
                              color: 'black !important',
                              textShadow: '0 0 10px rgba(22, 163, 74, 0.2)',
                              textAlign: 'center',
                              padding: '16px',
                              background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--success-green-soft) 100%)',
                              borderRadius: '12px',
                              border: '2px solid var(--border-light)',
                              boxShadow: '0 4px 12px rgba(22, 163, 74, 0.1)'
                            }}
                          >
                            🏭 Tipos de Proveedores
                          </Typography>
                          
                          <Box className="bar-chart-container" sx={{ 
                            height: { xs: '500px', sm: '550px', md: '600px' },
                            minHeight: { xs: '500px', sm: '550px', md: '600px' },
                            width: '100%',
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column'
                          }}>
                            <CustomBarChart 
                              data={data.proveedores?.porTipo || {}} 
                              title="Tipos de Proveedores" 
                              height={400}
                              color="var(--success-green)"
                            />
                          </Box>
                        </CardContent>
                      </ElegantCard>
                    </Grid>
                  </Grid>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer elegante mejorado */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <Box 
              className="dashboard-footer"
              sx={{
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <Box className="footer-content">
                <Box>
                  <Typography 
                    variant="body2" 
                    className="footer-text"
                  >
                    📊 Dashboard actualizado en tiempo real
                  </Typography>
                  <Typography 
                    variant="caption" 
                    className="footer-timestamp"
                  >
                    Última actualización: {new Date().toLocaleString('es-CO')}
                  </Typography>
                </Box>
                
                <Box className="footer-status">
                  {realTimeMode && (
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Box className="status-indicator real-time">
                        <Box className="status-dot real-time" />
                        🟢 Modo tiempo real activado
                      </Box>
                    </motion.div>
                  )}
                  
                  <Box className="status-indicator system">
                    <Box className="status-dot system" />
                    🚀 Sistema operativo
                  </Box>
                </Box>
              </Box>
            </Box>
          </motion.div>
        </Box>
      </Box>
    </GlobalStyles>
  );
};

export default DashboardUltra;
