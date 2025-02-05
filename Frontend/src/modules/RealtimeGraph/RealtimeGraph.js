import React, { useMemo } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  createTheme,
  ThemeProvider,
  CssBaseline,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import useGraphData from '../../hooks/useGraphData';
import useFlowRecoveryV2Data from '../../hooks/useFlowRecoveryV2Data';
import useMoneyFlowRecoveryData from '../../hooks/useMoneyFlowRecoveryData';
import useUsersData from '../../hooks/useUsersData';
import useProjectsData from '../../hooks/useProjectsData';
import ChartWrapper from '../../components/ChartWrapper/ChartWrapper';
// Iconos de Material Design (mejores y modernos)
import {
  MdAccountBalanceWallet,
  MdPayment,
  MdHourglassEmpty,
  MdShowChart,
  MdPieChart,
  MdPeople,
  MdDashboard,
} from 'react-icons/md';

// ===========================
// COMPONENTES ESTILIZADOS CON MUI
// ===========================
const DashboardPaper = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(135deg, #0d0d0d, #1a1a1a)',
  color: theme.palette.common.white,
  padding: theme.spacing(2),
  boxShadow: '0 6px 20px rgba(0,229,255,0.3)',
  borderRadius: theme.spacing(1),
  marginTop: theme.spacing(3),
}));

const KpiCard = styled(Paper)(({ theme }) => ({
  backgroundColor: '#262626',
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.common.white,
  boxShadow: '0 6px 20px rgba(0,229,255,0.3)',
  borderRadius: theme.spacing(1),
  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 10px 30px rgba(0,229,255,0.4)',
  },
}));

const IconBox = styled(Box)(({ theme }) => ({
  fontSize: '2.5rem',
  color: '#00e5ff',
  marginBottom: theme.spacing(1),
}));

// ===========================
// CONFIGURACIÓN DEL TEMA OSCURO
// ===========================
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0d0d0d', // fondo general oscuro
      paper: '#1a1a1a',   // fondo de los Paper
    },
    primary: {
      main: '#00e5ff', // color de acento (azul neón)
    },
    secondary: {
      main: '#ff8c00', // color secundario (naranja neón)
    },
    text: {
      primary: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Montserrat, sans-serif',
  },
});

// ===========================
// CONFIGURACIÓN DE OPCIONES DE GRÁFICOS
// ===========================
const commonBarOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 1200, easing: 'easeOutQuart' },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(30, 30, 30, 0.95)',
      titleFont: { size: 16, weight: 'bold', family: 'Montserrat, sans-serif' },
      bodyFont: { size: 14, family: 'Montserrat, sans-serif' },
      callbacks: {
        label: (context) => {
          const label = context.dataset.label || '';
          const value =
            context.parsed.y !== undefined ? context.parsed.y : context.parsed;
          return `${label}: $${value.toLocaleString()}`;
        },
      },
    },
    title: { display: false },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        color: '#ffffff',
        font: { family: 'Montserrat, sans-serif', weight: '500' },
        callback: (value) => `$${value.toLocaleString()}`,
      },
      grid: { color: 'rgba(255, 255, 255, 0.1)' },
    },
    x: {
      ticks: {
        color: '#ffffff',
        font: { family: 'Montserrat, sans-serif', weight: '500' },
      },
      grid: { display: false },
    },
  },
};

const RealtimeGraph = () => {
  // ===========================
  // OBTENCIÓN DE DATOS
  // ===========================
  const { graphData } = useGraphData('https://sigma.runsolutions-services.com/api/graph', 10000);
  const { data: flowData } = useFlowRecoveryV2Data('https://sigma.runsolutions-services.com/api/flowRecoveryV2', 10000);
  const { data: moneyFlowData } = useMoneyFlowRecoveryData('https://sigma.runsolutions-services.com/api/recuperacion', 10000);
  const { totalUsers, usersByRole } = useUsersData();
  const { totalProjects, projectsStatus } = useProjectsData();

  // ===========================
  // CALCULOS Y VALORES FINANCIEROS
  // ===========================
  const cuentasPorCobrar = (graphData && graphData.cuentasPorCobrar) || 0;
  const cuentasPagadas = (graphData && graphData.cuentasPagadas) || 0;
  const cuentasPorPagarValue = (graphData && graphData.cuentasPorPagar) || 0;
  const costosFijosMXN = (graphData && graphData.costosFijosMXN) || 0;
  const costosFijosUSD = (graphData && graphData.costosFijosUSD) || 0;

  const montoSinIVA_CXC = cuentasPorCobrar / 1.16;
  const pagadoConIVA = cuentasPagadas;
  const porPagarConIVA = Math.abs(cuentasPorPagarValue - cuentasPagadas);
  const pagadoSinIVA = pagadoConIVA / 1.16;
  const porPagarSinIVA = porPagarConIVA / 1.16;

  // ===========================
  // CONFIGURACIÓN DE DATOS PARA LOS GRÁFICOS
  // ===========================
  const barDataCuentasPorCobrar = useMemo(() => ({
    labels: ['Cuentas por Cobrar'],
    datasets: [
      {
        label: 'Con IVA',
        data: [cuentasPorCobrar],
        backgroundColor: '#00e5ff',
      },
      {
        label: 'Sin IVA',
        data: [montoSinIVA_CXC],
        backgroundColor: '#ff8c00',
      },
    ],
  }), [cuentasPorCobrar, montoSinIVA_CXC]);

  const barDataCuentasPorPagarGrouped = useMemo(() => ({
    labels: ['Con IVA', 'Sin IVA'],
    datasets: [
      {
        label: 'Pagadas',
        data: [pagadoConIVA, pagadoSinIVA],
        backgroundColor: '#32cd32',
        borderColor: '#32cd32',
        borderWidth: 1,
        borderRadius: 5,
      },
      {
        label: 'Por Pagar',
        data: [porPagarConIVA, porPagarSinIVA],
        backgroundColor: '#ff1493',
        borderColor: '#ff1493',
        borderWidth: 1,
        borderRadius: 5,
      },
    ],
  }), [pagadoConIVA, porPagarConIVA, pagadoSinIVA, porPagarSinIVA]);

  const totalRecuperado = (moneyFlowData && moneyFlowData.totalRecuperado) || 0;
  const totalPorRecuperar = (moneyFlowData && moneyFlowData.totalPorRecuperar) || 0;
  const barDataMoneyFlow = useMemo(() => ({
    labels: ['Recuperado', 'Por Recuperar'],
    datasets: [
      {
        label: 'MoneyFlow Recovery',
        data: [totalRecuperado, totalPorRecuperar],
        backgroundColor: ['#ff5e5e', '#00e5ff'],
        borderColor: ['#ff073a', '#00bfff'],
        borderWidth: 1,
        borderRadius: 5,
      },
    ],
  }), [totalRecuperado, totalPorRecuperar]);

  const doughnutDataCostosFijos = useMemo(() => ({
    labels: ['Costos Fijos MXN', 'Costos Fijos USD'],
    datasets: [
      {
        data: [costosFijosMXN, costosFijosUSD],
        backgroundColor: ['#ff5e5e', '#00e5ff'],
        borderColor: ['#ff073a', '#00bfff'],
        borderWidth: 1,
      },
    ],
  }), [costosFijosMXN, costosFijosUSD]);

  const barDataFlowV2 = useMemo(() => {
    if (!flowData) return null;
    return {
      labels: ['Recuperado', 'Por Recuperar'],
      datasets: [
        {
          label: 'Flow Recovery V2',
          data: [flowData.totalRecuperado || 0, flowData.totalPorRecuperar || 0],
          backgroundColor: ['#32cd32', '#ff8c00'],
          borderColor: ['#32cd32', '#ff8c00'],
          borderWidth: 1,
          borderRadius: 5,
        },
      ],
    };
  }, [flowData]);

  const lastUpdated = new Date().toLocaleTimeString();

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{ color: darkTheme.palette.primary.main, textShadow: '0 0 10px #00e5ff' }}
        >
          Dashboard
        </Typography>

        {/* Tarjetas KPI organizadas en dos filas (primera fila: 4 tarjetas, segunda: 3) */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {/* Primera fila: 4 tarjetas */}
          <Grid item xs={12} sm={6} md={3}>
            <KpiCard>
              <IconBox><MdAccountBalanceWallet /></IconBox>
              <Typography variant="h6">CxC</Typography>
              <Typography variant="h5">${cuentasPorCobrar.toLocaleString()}</Typography>
            </KpiCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KpiCard>
              <IconBox><MdPayment /></IconBox>
              <Typography variant="h6">CxP Pagadas</Typography>
              <Typography variant="h5">${pagadoConIVA.toLocaleString()}</Typography>
            </KpiCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KpiCard>
              <IconBox><MdHourglassEmpty /></IconBox>
              <Typography variant="h6">CxP Pendientes</Typography>
              <Typography variant="h5">${porPagarConIVA.toLocaleString()}</Typography>
            </KpiCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KpiCard>
              <IconBox><MdShowChart /></IconBox>
              <Typography variant="h6">MoneyFlow Rec.</Typography>
              <Typography variant="h5">${totalRecuperado.toLocaleString()}</Typography>
            </KpiCard>
          </Grid>
          {/* Segunda fila: 3 tarjetas */}
          <Grid item xs={12} sm={4}>
            <KpiCard>
              <IconBox><MdPieChart /></IconBox>
              <Typography variant="h6">MoneyFlow Pend.</Typography>
              <Typography variant="h5">${totalPorRecuperar.toLocaleString()}</Typography>
            </KpiCard>
          </Grid>
          <Grid item xs={12} sm={4}>
            <KpiCard>
              <IconBox><MdPeople /></IconBox>
              <Typography variant="h6">Total Usuarios</Typography>
              <Typography variant="h5">{totalUsers}</Typography>
            </KpiCard>
          </Grid>
          <Grid item xs={12} sm={4}>
            <KpiCard>
              <IconBox><MdDashboard /></IconBox>
              <Typography variant="h6">Total Proyectos</Typography>
              <Typography variant="h5">{totalProjects}</Typography>
            </KpiCard>
          </Grid>
        </Grid>

        <Typography variant="subtitle2" align="right" sx={{ color: darkTheme.palette.secondary.main, mb: 2 }}>
          Última actualización: {lastUpdated}
        </Typography>

        {/* Área de Gráficos */}
        <DashboardPaper>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <ChartWrapper
                title="Comparativo de CxC"
                type="bar"
                data={barDataCuentasPorCobrar}
                options={commonBarOptions}
                legend={
                  <Box sx={{ textAlign: 'center', color: '#ffffff', mt: 1 }}>
                    <Typography variant="body2">
                      Con IVA:{' '}
                      <Box component="span" sx={{ color: darkTheme.palette.primary.main, fontWeight: 'bold' }}>
                        ${cuentasPorCobrar.toLocaleString()}
                      </Box>
                    </Typography>
                    <Typography variant="body2">
                      Sin IVA:{' '}
                      <Box component="span" sx={{ color: darkTheme.palette.primary.main, fontWeight: 'bold' }}>
                        ${montoSinIVA_CXC.toLocaleString()}
                      </Box>
                    </Typography>
                  </Box>
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ChartWrapper
                title="Comparativo de CxP"
                type="bar"
                data={barDataCuentasPorPagarGrouped}
                options={commonBarOptions}
                legend={
                  <Box sx={{ textAlign: 'center', color: '#ffffff', mt: 1 }}>
                    <Typography variant="body2">
                      Pagadas:{' '}
                      <Box component="span" sx={{ color: darkTheme.palette.primary.main, fontWeight: 'bold' }}>
                        ${pagadoConIVA.toLocaleString()}
                      </Box>
                    </Typography>
                    <Typography variant="body2">
                      Por Pagar:{' '}
                      <Box component="span" sx={{ color: darkTheme.palette.primary.main, fontWeight: 'bold' }}>
                        ${porPagarConIVA.toLocaleString()}
                      </Box>
                    </Typography>
                  </Box>
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ChartWrapper
                title="MoneyFlow Recovery"
                type="bar"
                data={barDataMoneyFlow}
                options={commonBarOptions}
                legend={
                  <Box sx={{ textAlign: 'center', color: '#ffffff', mt: 1 }}>
                    <Typography variant="body2">
                      Recuperado:{' '}
                      <Box component="span" sx={{ color: darkTheme.palette.primary.main, fontWeight: 'bold' }}>
                        ${totalRecuperado.toLocaleString()}
                      </Box>
                    </Typography>
                    <Typography variant="body2">
                      Por Recuperar:{' '}
                      <Box component="span" sx={{ color: darkTheme.palette.primary.main, fontWeight: 'bold' }}>
                        ${totalPorRecuperar.toLocaleString()}
                      </Box>
                    </Typography>
                  </Box>
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ChartWrapper
                title="Costos Fijos"
                type="doughnut"
                data={doughnutDataCostosFijos}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                      labels: {
                        color: '#ffffff',
                        font: { size: 14, weight: '600', family: 'Montserrat, sans-serif' },
                      },
                    },
                    tooltip: {
                      backgroundColor: 'rgba(30, 30, 30, 0.95)',
                      titleFont: { size: 16, weight: 'bold', family: 'Montserrat, sans-serif' },
                      bodyFont: { size: 14, family: 'Montserrat, sans-serif' },
                      callbacks: {
                        label: (context) => {
                          const label = context.label || '';
                          const value = context.parsed || 0;
                          return `${label}: $${value.toLocaleString()}`;
                        },
                      },
                    },
                  },
                }}
                legend={
                  <Box sx={{ textAlign: 'center', color: '#ffffff', mt: 1 }}>
                    <Typography variant="body2">
                      MXN:{' '}
                      <Box component="span" sx={{ color: darkTheme.palette.primary.main, fontWeight: 'bold' }}>
                        ${costosFijosMXN.toLocaleString()}
                      </Box>
                    </Typography>
                    <Typography variant="body2">
                      USD:{' '}
                      <Box component="span" sx={{ color: darkTheme.palette.primary.main, fontWeight: 'bold' }}>
                        ${costosFijosUSD.toLocaleString()}
                      </Box>
                    </Typography>
                  </Box>
                }
              />
            </Grid>
            {flowData && (
              <Grid item xs={12}>
                <ChartWrapper
                  title="Flow Recovery V2"
                  type="bar"
                  data={barDataFlowV2}
                  options={commonBarOptions}
                  legend={
                    <Box sx={{ textAlign: 'center', color: '#ffffff', mt: 1 }}>
                      <Typography variant="body2">
                        Recuperado:{' '}
                        <Box component="span" sx={{ color: darkTheme.palette.primary.main, fontWeight: 'bold' }}>
                          ${(flowData.totalRecuperado || 0).toLocaleString()}
                        </Box>
                      </Typography>
                      <Typography variant="body2">
                        Por Recuperar:{' '}
                        <Box component="span" sx={{ color: darkTheme.palette.primary.main, fontWeight: 'bold' }}>
                          ${(flowData.totalPorRecuperar || 0).toLocaleString()}
                        </Box>
                      </Typography>
                    </Box>
                  }
                />
              </Grid>
            )}
            <Grid item xs={12} md={6}>
              <ChartWrapper
                title="Usuarios por Rol"
                type="doughnut"
                data={{
                  labels: Object.keys(usersByRole),
                  datasets: [
                    {
                      data: Object.values(usersByRole),
                      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8e44ad', '#e67e22'],
                      borderColor: '#fff',
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: { color: '#ffffff', font: { family: 'Montserrat, sans-serif', weight: '600' } },
                    },
                  },
                  maintainAspectRatio: false,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ChartWrapper
                title="Estado de Proyectos"
                type="pie"
                data={{
                  labels: Object.keys(projectsStatus),
                  datasets: [
                    {
                      data: Object.values(projectsStatus),
                      backgroundColor: ['#3498db', '#2ecc71', '#e74c3c'],
                      borderColor: '#fff',
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: { color: '#ffffff', font: { family: 'Montserrat, sans-serif', weight: '600' } },
                    },
                  },
                  maintainAspectRatio: false,
                }}
              />
            </Grid>
          </Grid>
        </DashboardPaper>
      </Container>
    </ThemeProvider>
  );
};

export default RealtimeGraph;
















