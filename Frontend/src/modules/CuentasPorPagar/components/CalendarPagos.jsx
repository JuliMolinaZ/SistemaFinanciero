// src/modules/CuentasPorPagar/components/CalendarPagos.jsx
import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Avatar,
  Tooltip,
  useTheme,
  useMediaQuery,
  Grid,
  Fade,
  Zoom,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarToday as CalendarIcon,
  Event as EventIcon,
  Payment as PaymentIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  MonetizationOn as MonetizationOnIcon,
  AccountBalance as AccountBalanceIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  FilterList as FilterListIcon,
  ViewDay as ViewDayIcon,
  ViewWeek as ViewWeekIcon,
  ViewModule as ViewModuleIcon,
  List as ListIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Info as InfoIcon,
  AttachMoney as MoneyIcon,
  DateRange as DateRangeIcon,
  AccessTime as TimeIcon,
  Business as BusinessIcon,
  Category as CategoryIcon
} from '@mui/icons-material';

// Componentes estilizados ultra-modernos
const CalendarContainer = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%)',
  borderRadius: 24,
  padding: theme.spacing(3),
  position: 'relative',
  overflow: 'hidden',
  border: '1px solid rgba(102, 126, 234, 0.15)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(102, 126, 234, 0.1)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #667eea, #764ba2, #f093fb)',
    borderRadius: '24px 24px 0 0'
  },
  '&:hover': {
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12), 0 8px 24px rgba(102, 126, 234, 0.15)',
    transform: 'translateY(-2px)'
  }
}));

const CalendarHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(3),
  paddingBottom: theme.spacing(2),
  borderBottom: '2px solid rgba(102, 126, 234, 0.1)',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -2,
    left: 0,
    width: '80px',
    height: '2px',
    background: 'linear-gradient(90deg, #667eea, #764ba2)',
    borderRadius: '1px'
  }
}));

const CalendarTitle = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea, #764ba2)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 700,
  fontSize: '1.4rem',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  textShadow: '0 2px 4px rgba(102, 126, 234, 0.1)'
}));

const ViewToggleButton = styled(Button)(({ theme, active }) => ({
  background: active 
    ? 'linear-gradient(135deg, #667eea, #764ba2)' 
    : 'rgba(255, 255, 255, 0.9)',
  color: active ? '#fff' : 'rgba(0, 0, 0, 0.7)',
  border: `1px solid ${active ? 'transparent' : 'rgba(102, 126, 234, 0.2)'}`,
  borderRadius: 12,
  textTransform: 'none',
  fontWeight: 600,
  padding: theme.spacing(1, 2),
  minWidth: '80px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: active 
    ? '0 4px 15px rgba(102, 126, 234, 0.3)' 
    : '0 2px 8px rgba(0, 0, 0, 0.05)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: active 
      ? '0 6px 20px rgba(102, 126, 234, 0.4)' 
      : '0 4px 15px rgba(102, 126, 234, 0.2)',
    background: active 
      ? 'linear-gradient(135deg, #5a6fd8, #6a4190)' 
      : 'rgba(102, 126, 234, 0.1)'
  }
}));

const CalendarGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: '1px',
  background: 'rgba(102, 126, 234, 0.1)',
  borderRadius: 12,
  padding: '1px',
  marginBottom: theme.spacing(2)
}));

const CalendarDay = styled(Box)(({ theme, isToday, isOtherMonth, hasEvents }) => ({
  aspectRatio: '1',
  background: isToday 
    ? 'linear-gradient(135deg, #667eea, #764ba2)' 
    : isOtherMonth 
      ? 'rgba(255,255,255,0.3)' 
      : 'rgba(255,255,255,0.9)',
  borderRadius: 8,
  padding: theme.spacing(0.5),
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
    zIndex: 5
  },
  '&::before': hasEvents ? {
    content: '""',
    position: 'absolute',
    top: '4px',
    right: '4px',
    width: '6px',
    height: '6px',
    background: '#f093fb',
    borderRadius: '50%'
  } : {}
}));

const DayNumber = styled(Typography)(({ theme, isToday, isOtherMonth }) => ({
  fontWeight: isToday ? 700 : 600,
  fontSize: '0.9rem',
  color: isToday ? '#fff' : isOtherMonth ? 'rgba(0,0,0,0.3)' : '#333',
  textAlign: 'center',
  marginBottom: theme.spacing(0.5)
}));

const EventChip = styled(Chip)(({ theme, type }) => ({
  background: type === 'vencida' 
    ? '#ff6b6b' 
    : type === 'porPagar' 
      ? '#feca57' 
      : '#48dbfb',
  color: '#fff',
  fontWeight: 600,
  fontSize: '0.7rem',
  borderRadius: 6,
  height: '16px',
  margin: '1px',
  '& .MuiChip-label': {
    padding: '0 4px'
  }
}));

const EventDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 16,
    background: 'rgba(255,255,255,0.98)',
    maxWidth: '450px',
    width: '100%'
  }
}));

const EventCard = styled(Card)(({ theme, type }) => ({
  background: type === 'vencida' 
    ? 'rgba(255, 107, 107, 0.1)' 
    : type === 'porPagar' 
      ? 'rgba(254, 202, 87, 0.1)' 
      : 'rgba(72, 219, 251, 0.1)',
  border: `1px solid ${type === 'vencida' 
    ? 'rgba(255, 107, 107, 0.3)' 
    : type === 'porPagar' 
      ? 'rgba(254, 202, 87, 0.3)' 
      : 'rgba(72, 219, 251, 0.3)'}`,
  borderRadius: 12,
  marginBottom: theme.spacing(1.5),
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  }
}));

const CalendarPagos = ({ cuentas = [], onEventClick, onDateClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [currentView, setCurrentView] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [showDaySummary, setShowDaySummary] = useState(false);

  // Generar datos del calendario
  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDateObj = new Date(startDate);
    
    while (currentDateObj <= lastDay || days.length < 42) {
      const dateStr = currentDateObj.toISOString().split('T')[0];
      const dayEvents = cuentas.filter(cuenta => {
        const fechaVencimiento = new Date(cuenta.fechaVencimiento);
        return fechaVencimiento.toDateString() === currentDateObj.toDateString();
      });
      
      days.push({
        date: new Date(currentDateObj),
        dayNumber: currentDateObj.getDate(),
        isToday: currentDateObj.toDateString() === new Date().toDateString(),
        isOtherMonth: currentDateObj.getMonth() !== month,
        events: dayEvents,
        hasEvents: dayEvents.length > 0
      });
      
      currentDateObj.setDate(currentDateObj.getDate() + 1);
    }
    
    return days;
  }, [currentDate, cuentas]);

  // Navegación del calendario
  const goToPreviousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Manejo de eventos
  const handleDayClick = (day) => {
    setSelectedDay(day);
    setShowDaySummary(true);
    
    if (onDateClick) {
      onDateClick(day.date);
    }
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowEventDialog(true);
  };

  const getEventType = (cuenta) => {
    const today = new Date();
    const vencimiento = new Date(cuenta.fechaVencimiento);
    
    if (cuenta.estado === 'pagada') return 'pagada';
    if (vencimiento < today) return 'vencida';
    return 'porPagar';
  };

  const getEventColor = (type) => {
    switch (type) {
      case 'vencida': return '#ff6b6b';
      case 'porPagar': return '#feca57';
      case 'pagada': return '#48dbfb';
      default: return '#667eea';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  // Calcular resumen del día seleccionado
  const getDaySummary = (day) => {
    if (!day || !cuentas.length) return null;

    const dayDate = day.date.toISOString().split('T')[0];
    
    const cuentasDelDia = cuentas.filter(cuenta => {
      const cuentaFecha = new Date(cuenta.fecha).toISOString().split('T')[0];
      return cuentaFecha === dayDate;
    });

    const pagadas = cuentasDelDia.filter(c => c.pagado === 1);
    const porPagar = cuentasDelDia.filter(c => c.pagado === 0);
    const vencidas = cuentasDelDia.filter(c => {
      if (c.pagado === 1) return false;
      const fecha = new Date(c.fecha);
      return fecha < new Date();
    });

    return {
      fecha: day.date,
      total: cuentasDelDia.length,
      pagadas: pagadas.length,
      porPagar: porPagar.length,
      vencidas: vencidas.length,
      montoTotal: cuentasDelDia.reduce((sum, c) => sum + parseFloat(c.monto_con_iva || c.monto_neto || 0), 0),
      montoPagado: pagadas.reduce((sum, c) => sum + parseFloat(c.monto_con_iva || c.monto_neto || 0), 0),
      montoPorPagar: porPagar.reduce((sum, c) => sum + parseFloat(c.monto_con_iva || c.monto_neto || 0), 0),
      cuentas: cuentasDelDia
    };
  };

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  return (
    <CalendarContainer>
      {/* Header del Calendario */}
      <CalendarHeader>
        <CalendarTitle>
          <CalendarIcon />
          Calendario de Pagos
        </CalendarTitle>
        
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {/* Navegación */}
          <IconButton
            onClick={goToPreviousMonth}
            size="small"
            sx={{
              background: 'rgba(102, 126, 234, 0.1)',
              color: '#667eea',
              borderRadius: 10,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                background: 'rgba(102, 126, 234, 0.2)',
                transform: 'translateX(-2px) scale(1.1)',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
              }
            }}
          >
            <TrendingDownIcon />
          </IconButton>
          
          <Button
            onClick={goToToday}
            variant="contained"
            size="small"
            sx={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: '#fff',
              border: 'none',
              fontWeight: 600,
              borderRadius: 12,
              px: 2.5,
              py: 1,
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8, #6a4190)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)'
              }
            }}
          >
            Hoy
          </Button>
          
          <IconButton
            onClick={goToNextMonth}
            size="small"
            sx={{
              background: 'rgba(102, 126, 234, 0.1)',
              color: '#667eea',
              '&:hover': {
                background: 'rgba(102, 126, 234, 0.2)'
              }
            }}
          >
            <TrendingUpIcon />
          </IconButton>

          {/* Toggle de Vistas */}
          <Box sx={{ display: 'flex', gap: 0.5, ml: 2 }}>
            {['month', 'list'].map((view) => (
              <ViewToggleButton
                key={view}
                active={currentView === view}
                onClick={() => setCurrentView(view)}
                size="small"
              >
                {view === 'month' ? 'Mes' : 'Lista'}
              </ViewToggleButton>
            ))}
          </Box>
        </Box>
      </CalendarHeader>

      {/* Mes y Año Actual */}
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ 
          fontWeight: 700, 
          color: '#667eea'
        }}>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </Typography>
      </Box>

      {/* Vista del Mes */}
      {currentView === 'month' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Días de la semana */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(7, 1fr)', 
            gap: '1px', 
            mb: 1 
          }}>
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
              <Box key={day} sx={{ 
                textAlign: 'center', 
                py: 1,
                fontWeight: 700,
                color: '#667eea',
                fontSize: '0.8rem'
              }}>
                {day}
              </Box>
            ))}
          </Box>

          {/* Grilla del calendario */}
          <CalendarGrid>
            {calendarData.map((day, index) => (
              <CalendarDay
                key={index}
                isToday={day.isToday}
                isOtherMonth={day.isOtherMonth}
                hasEvents={day.hasEvents}
                onClick={() => handleDayClick(day)}
              >
                <DayNumber
                  isToday={day.isToday}
                  isOtherMonth={day.isOtherMonth}
                >
                  {day.dayNumber}
                </DayNumber>
                
                {/* Eventos del día */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                  {day.events.slice(0, 2).map((event, eventIndex) => (
                    <EventChip
                      key={eventIndex}
                      type={getEventType(event)}
                      label={`$${parseFloat(event.monto).toLocaleString()}`}
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEventClick(event);
                      }}
                    />
                  ))}
                  {day.events.length > 2 && (
                    <Chip
                      label={`+${day.events.length - 2}`}
                      size="small"
                      sx={{
                        background: 'rgba(102, 126, 234, 0.2)',
                        color: '#667eea',
                        fontSize: '0.6rem',
                        height: '14px'
                      }}
                    />
                  )}
                </Box>
              </CalendarDay>
            ))}
          </CalendarGrid>
        </motion.div>
      )}

      {/* Vista de Lista */}
      {currentView === 'list' && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <List sx={{ maxHeight: 400, overflow: 'auto' }}>
            {cuentas
              .sort((a, b) => new Date(a.fechaVencimiento) - new Date(b.fechaVencimiento))
              .slice(0, 20)
              .map((cuenta, index) => (
                <EventCard key={cuenta.id} type={getEventType(cuenta)}>
                  <CardContent sx={{ py: 1.5, px: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ 
                        bgcolor: getEventColor(getEventType(cuenta)),
                        width: 32,
                        height: 32
                      }}>
                        <PaymentIcon sx={{ fontSize: '1rem' }} />
                      </Avatar>
                      
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {cuenta.concepto}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                          {cuenta.proveedor?.nombre || 'Sin proveedor'}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 0.5 }}>
                          <Chip
                            label={getEventType(cuenta)}
                            size="small"
      sx={{
                              background: getEventColor(getEventType(cuenta)),
                              color: '#fff',
                              fontWeight: 600,
                              height: '20px',
                              fontSize: '0.7rem'
                            }}
                          />
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            Vence: {new Date(cuenta.fechaVencimiento).toLocaleDateString('es-MX')}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Typography variant="body2" sx={{ 
                        fontWeight: 700, 
                        color: getEventColor(getEventType(cuenta)),
                        minWidth: 'fit-content'
                      }}>
                        {formatCurrency(cuenta.monto)}
                      </Typography>
                    </Box>
                  </CardContent>
                </EventCard>
              ))}
          </List>
        </motion.div>
      )}

      {/* Resumen Compacto */}
      <Box sx={{ 
        mt: 2, 
        p: 2, 
        bgcolor: 'rgba(102, 126, 234, 0.05)', 
        borderRadius: 2,
        border: '1px solid rgba(102, 126, 234, 0.1)'
      }}>
        <Grid container spacing={2} sx={{ textAlign: 'center' }}>
          <Grid item xs={4}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#ff6b6b' }}>
              {cuentas.filter(c => getEventType(c) === 'vencida').length}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Vencidas
            </Typography>
          </Grid>
          
          <Grid item xs={4}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#feca57' }}>
              {cuentas.filter(c => getEventType(c) === 'porPagar').length}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Por Pagar
            </Typography>
          </Grid>
          
          <Grid item xs={4}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#48dbfb' }}>
              {cuentas.filter(c => getEventType(c) === 'pagada').length}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Pagadas
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Dialog de Evento */}
      <EventDialog
        open={showEventDialog}
        onClose={() => setShowEventDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        {selectedEvent && (
          <>
            <DialogTitle sx={{ 
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: '#fff',
              borderRadius: '16px 16px 0 0'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PaymentIcon />
                Detalles de la Cuenta
              </Box>
            </DialogTitle>
            
            <DialogContent sx={{ pt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    {selectedEvent.concepto}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                    Proveedor
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {selectedEvent.proveedor?.nombre || 'Sin proveedor'}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                    Monto
                  </Typography>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 800, 
                    color: getEventColor(getEventType(selectedEvent))
                  }}>
                    {formatCurrency(selectedEvent.monto)}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                    Fecha de Vencimiento
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {new Date(selectedEvent.fechaVencimiento).toLocaleDateString('es-MX')}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                    Estado
      </Typography>
                  <Chip
                    label={getEventType(selectedEvent)}
                    sx={{
                      background: getEventColor(getEventType(selectedEvent)),
                      color: '#fff',
                      fontWeight: 600
                    }}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            
            <DialogActions sx={{ p: 2 }}>
              <Button
                onClick={() => setShowEventDialog(false)}
                variant="outlined"
                size="small"
              >
                Cerrar
              </Button>
              
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                size="small"
                sx={{
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8, #6a4190)'
                  }
                }}
              >
                Editar
              </Button>
            </DialogActions>
          </>
        )}
      </EventDialog>

      {/* Dialog de Resumen del Día */}
      <Dialog
        open={showDaySummary}
        onClose={() => setShowDaySummary(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 16,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
          }
        }}
      >
        {selectedDay && getDaySummary(selectedDay) && (() => {
          const summary = getDaySummary(selectedDay);
          return (
            <>
              <DialogTitle sx={{ 
                background: 'rgba(0, 0, 0, 0.8)',
                color: '#fff',
                borderRadius: '16px 16px 0 0',
                pb: 1
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DateRangeIcon />
                  Resumen del {summary.fecha.toLocaleDateString('es-MX', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </Box>
              </DialogTitle>
              
              <DialogContent sx={{ pt: 2 }}>
                {summary.total > 0 ? (
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, textAlign: 'center' }}>
                        {summary.total} cuenta{summary.total !== 1 ? 's' : ''} programada{summary.total !== 1 ? 's' : ''}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center', p: 1 }}>
                        <CheckCircleIcon sx={{ fontSize: 40, color: '#00d4aa', mb: 1 }} />
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#00d4aa' }}>
                          {summary.pagadas}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Pagadas
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center', p: 1 }}>
                        <ScheduleIcon sx={{ fontSize: 40, color: '#ffa726', mb: 1 }} />
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#ffa726' }}>
                          {summary.porPagar}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Por Pagar
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center', p: 1 }}>
                        <WarningIcon sx={{ fontSize: 40, color: '#ff6b6b', mb: 1 }} />
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#ff6b6b' }}>
                          {summary.vencidas}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Vencidas
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Box sx={{ 
                        background: 'rgba(0, 0, 0, 0.03)', 
                        borderRadius: 2, 
                        p: 2, 
                        mt: 2 
                      }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                          Resumen Financiero
                        </Typography>
                        <Grid container spacing={1}>
                          <Grid item xs={6}>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              Total: {formatCurrency(summary.montoTotal)}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              Por Pagar: {formatCurrency(summary.montoPorPagar)}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                  </Grid>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <DateRangeIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      No hay cuentas programadas para este día
                    </Typography>
                  </Box>
                )}
              </DialogContent>
              
              <DialogActions sx={{ p: 2 }}>
                <Button
                  onClick={() => setShowDaySummary(false)}
                  variant="outlined"
                  size="small"
                >
                  Cerrar
                </Button>
              </DialogActions>
            </>
          );
        })()}
      </Dialog>
    </CalendarContainer>
  );
};

export default CalendarPagos;
