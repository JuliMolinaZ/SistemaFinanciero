// src/App.js
import React, { useContext, useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { GlobalContext } from './context/GlobalState';
import LoadingScreen from './components/LoadingScreen';
import BackendError from './components/BackendError';

import AuthForm from './modules/Usuarios/AuthForm';
import ProfileSetup from './modules/Usuarios/ProfileSetup';
import Home from './modules/Home/Home';
import DashboardUltra from './modules/Dashboard/DashboardUltra';

import Header from './components/Header';
import SidebarNew from './components/SidebarNew';

import ClientModule from './modules/Clientes/ClientModule';
import ProyectosForm from './modules/Proyectos/ProyectosForm';
import ProjectManagementMain from './modules/ProjectManagement/ProjectManagementMain';
import ProveedoresForm from './modules/Proveedores/ProveedoresForm';
import CuentasPagarMain from './modules/CuentasPorPagar/CuentasPagarMain';
import CuentasCobrarMain from './modules/CuentasPorCobrar/CuentasCobrarMain';
import ImpuestosIMSSModule from './modules/ImpuestosIMSS/ImpuestosIMSSModule';
import ContabilidadForm from './modules/Contabilidad/ContabilidadForm';
import CategoriasForm from './modules/Categorias/CategoriasForm';
import RecuperacionForm from './modules/Recuperacion/RecuperacionForm';

import UsersManagementMain from './modules/Usuarios/UsersManagementMain';
import MyProfile from './modules/Usuarios/MyProfileEnhanced';
import ProfileCompletionForm from './modules/Usuarios/ProfileCompletionForm';
import HorasExtra from './modules/HorasExtra/HorasExtra';
import PhasesModule from './modules/Fases/PhasesModule';
import CostosFijos from './modules/CostosFijos/CostosFijos';

import EmitidasForms from './modules/FacturasEmitidas/EmitidasFormsV2';
import CotizacionesForm from './modules/Cotizaciones/CotizacionesForm';
import FlowRecoveryV2Form from './modules/FlowRecoveryV2/FlowRecoveryV2Form';
import MoneyFlowRecoveryForm from './modules/MoneyFlowRecovery/MoneyFlowRecoveryForm';
import PrivateRoute from './components/PrivateRoute';
import CompleteProfile from './modules/Profile/CompleteProfile';
import ErrorTestPanel from './components/ErrorTestPanel';
import RequisicionesForm from './modules/Requisiciones/RequisicionesForm';
import ProjectRedirect from './components/ProjectRedirect';

// Componente wrapper para animaciones de página
const PageTransition = ({ children }) => {
  const location = useLocation();
  const { sidebarFullyMinimized } = useContext(GlobalContext);
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, x: sidebarFullyMinimized ? 0 : 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: sidebarFullyMinimized ? 0 : -20 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{ width: '100%', height: '100%' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// Componente principal de la aplicación
const AppContent = () => {
  const { 
    currentUser, 
    profileComplete, 
    profileData,
    authLoading, 
    backendConnected, 
    backendError, 
    checkBackendConnection,
    sidebarFullyMinimized
  } = useContext(GlobalContext);

  // Detectar si es usuario invitado
  const isInvitedUser = window.location.pathname.includes('/complete-profile/');

  // Calcular margen izquierdo del contenido principal (solo 2 estados)
  const mainMarginLeft = sidebarFullyMinimized ? '0px' : '280px';

  // Estado para prevenir redirecciones múltiples
  const [lastRedirectPath, setLastRedirectPath] = useState(null);
  const [redirectInProgress, setRedirectInProgress] = useState(false);
  const [redirectBlocked, setRedirectBlocked] = useState(false);

  // DESHABILITADO TEMPORALMENTE: Redirecciones automáticas que causan bucles infinitos
  // Las redirecciones se manejan ahora solo a través de PrivateRoute
  
  // useEffect(() => {
  //   // Redirección automática deshabilitada para evitar bucles infinitos
  // }, []);

  // Resetear el estado de redirección cuando cambie la ruta
  useEffect(() => {
    const handleRouteChange = () => {
      setRedirectInProgress(false);
    };

    // Escuchar cambios en la URL
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  // Estilos para el contenido principal con transiciones
  const mainContentStyle = {
    marginLeft: mainMarginLeft,
    transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    width: sidebarFullyMinimized ? '100%' : `calc(100% - ${mainMarginLeft})`,
    minHeight: '100vh',
  };

  if (authLoading) {
    return <LoadingScreen />;
  }

  // PRIORIDAD 1: Si hay error de backend, mostrar pantalla de error bonita
  if (!backendConnected && backendError) {
    return (
      <BackendError 
        errorType={backendError.type}
        onRetry={checkBackendConnection}
      />
    );
  }

  // PRIORIDAD 2: Si es un usuario invitado, mostrar CompleteProfile directamente
  if (isInvitedUser) {
    return <CompleteProfile />;
  }

  // Componente para manejar redirección de usuarios restringidos
  const RestrictedUserRedirect = () => {
    const userRole = profileData?.role?.toLowerCase();
    const isRestrictedUser = ['desarrollador', 'operador'].includes(userRole);
    
    if (isRestrictedUser) {
      return <Navigate to="/project-management" replace />;
    }
    
    return <Home />;
  };

  return (
    <>
      {currentUser ? (
        <>
          <Header />
          <SidebarNew />
          <main
            style={{
              ...mainContentStyle,
              padding: '1rem',
              marginTop: '60px'
            }}
          >
            <PageTransition>
              <Routes>
              <Route path="/" element={<RestrictedUserRedirect />} />
              <Route path="/dashboard-ultra" element={<DashboardUltra />} />

              <Route path="/usuarios" element={<UsersManagementMain />} />
              <Route path="/clientes" element={<ClientModule />} />
              <Route path="/horas-extra" element={<HorasExtra />} />
              <Route path="/fases" element={<PhasesModule />} />
              <Route path="/mi-perfil" element={<MyProfile />} />

              <Route
                path="/proyectos"
                element={
                  <PrivateRoute allowedRoles={['super administrador', 'administrador', 'gerente', 'pm']} moduleName="proyectos">
                    <ProjectRedirect>
                      <ProyectosForm />
                    </ProjectRedirect>
                  </PrivateRoute>
                }
              />
              <Route
                path="/project-management"
                element={
                  <PrivateRoute allowedRoles={['super administrador', 'administrador', 'gerente', 'pm', 'dev', 'desarrollador', 'operador']} moduleName="project_management">
                    <ProjectManagementMain />
                  </PrivateRoute>
                }
              />
              <Route
                path="/projects/new"
                element={
                  <PrivateRoute allowedRoles={['super administrador', 'administrador', 'gerente', 'pm', 'dev', 'desarrollador', 'operador']} moduleName="project_management">
                    <ProjectManagementMain />
                  </PrivateRoute>
                }
              />
                <Route
                  path="/proveedores"
                  element={
                    <PrivateRoute allowedRoles={['super administrador', 'administrador']} moduleName="proveedores">
                      <ProveedoresForm />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/cuentas-pagar"
                  element={
                    <PrivateRoute allowedRoles={['super administrador', 'administrador']} moduleName="cuentas_pagar">
                      <CuentasPagarMain />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/impuestos-imss"
                  element={
                    <PrivateRoute allowedRoles={['super administrador', 'gerente', 'administrador']} moduleName="impuestos_imss">
                      <ImpuestosIMSSModule />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/costos-fijos"
                  element={
                    <PrivateRoute allowedRoles={['super administrador', 'administrador']} moduleName="costos_fijos">
                      <CostosFijos />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/cuentas-cobrar"
                  element={
                    <PrivateRoute allowedRoles={['super administrador', 'administrador']} moduleName="cuentas_cobrar">
                      <CuentasCobrarMain />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/contabilidad"
                  element={
                    <PrivateRoute allowedRoles={['super administrador', 'administrador']} moduleName="contabilidad">
                      <ContabilidadForm />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/categorias"
                  element={
                    <PrivateRoute allowedRoles={['super administrador', 'administrador']} moduleName="categorias">
                      <CategoriasForm />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/requisiciones"
                  element={
                    <PrivateRoute allowedRoles={['administrador', 'juan carlos']} moduleName="requisiciones">
                      <RequisicionesForm />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/recuperacion"
                  element={
                    <PrivateRoute allowedRoles={['super administrador', 'administrador']} moduleName="recuperacion">
                      <RecuperacionForm />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/usuarios"
                  element={
                    <PrivateRoute allowedRoles={['super administrador', 'administrador']} moduleName="usuarios">
                      <UsersManagementMain />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/emitidas"
                  element={
                    <PrivateRoute allowedRoles={['super administrador', 'administrador']} moduleName="emitidas">
                      <EmitidasForms />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/cotizaciones"
                  element={
                    <PrivateRoute allowedRoles={['super administrador', 'administrador']} moduleName="cotizaciones">
                      <CotizacionesForm />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/flow-recovery-v2"
                  element={
                    <PrivateRoute allowedRoles={['super administrador', 'administrador']} moduleName="flow_recovery_v2">
                      <FlowRecoveryV2Form />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/money-flow-recovery"
                  element={
                    <PrivateRoute allowedRoles={['super administrador', 'administrador']} moduleName="flow_recovery_v2">
                      <MoneyFlowRecoveryForm />
                    </PrivateRoute>
                  }
                />
                <Route path="/test" element={<ErrorTestPanel />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </PageTransition>
            </main>
          </>
        ) : (
        // Si no hay usuario pero hay error de backend, mostrar error de backend
        !backendConnected && backendError ? (
          <BackendError 
            errorType={backendError.type}
            onRetry={checkBackendConnection}
          />
        ) : (
          <Routes>
            <Route path="/complete-profile/:token" element={<CompleteProfile />} />
            <Route path="*" element={<AuthForm />} />
          </Routes>
        )
      )}
    </>
  );
}

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <Routes>
        {/* RUTA PRIORITARIA para usuarios invitados - SIEMPRE PRIMERA */}
        <Route path="/complete-profile/:token" element={<ProfileCompletionForm />} />
        <Route path="*" element={<AppContent />} />
      </Routes>
    </Router>
  );
}

export default App;
