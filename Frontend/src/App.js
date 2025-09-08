// src/App.js
import React, { useContext } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { GlobalContext } from './context/GlobalState';
import LoadingScreen from './components/LoadingScreen';
import BackendError from './components/BackendError';

import AuthForm from './modules/Usuarios/AuthForm';
import ProfileSetup from './modules/Usuarios/ProfileSetup';
import Home from './modules/Home/Home';
import DashboardUltra from './modules/Dashboard/DashboardUltra';

import Header from './components/Header';
import Sidebar from './components/Sidebar';

import ClientModule from './modules/Clientes/ClientModule';
import ProyectosForm from './modules/Proyectos/ProyectosForm';
import ProveedoresForm from './modules/Proveedores/ProveedoresForm';
import CuentasPagarForm from './modules/CuentasPorPagar/CuentasPagarForm';
import CuentasCobrarForm from './modules/CuentasPorCobrar/CuentasCobrarForm';
import ImpuestosIMSSModule from './modules/ImpuestosIMSS/ImpuestosIMSSModule';
import ContabilidadForm from './modules/Contabilidad/ContabilidadForm';
import CategoriasForm from './modules/Categorias/CategoriasForm';
import RecuperacionForm from './modules/Recuperacion/RecuperacionForm';

import UsersManagementMain from './modules/Usuarios/UsersManagementMain';
import MyProfile from './modules/Usuarios/MyProfile';
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

// Componente completamente aislado para usuarios invitados
const InvitationProfile = () => {
  console.log('🚀 COMPONENTE INVITATION PROFILE RENDERIZADO');
  console.log('🚀 URL actual:', window.location.pathname);
  console.log('🚀 Timestamp:', new Date().toISOString());
  console.log('🚀 User Agent:', navigator.userAgent);
  return <CompleteProfile />;
};

// Componente interno que maneja la lógica de invitación
function AppContent() {
  const { 
    currentUser, 
    profileComplete, 
    sidebarCollapsed, 
    profileData, 
    authLoading,
    backendConnected,
    backendError,
    checkBackendConnection
  } = useContext(GlobalContext);
  
  // Detectar si es un usuario invitado basado en la URL - DETECCIÓN AGRESIVA
  const isInvitedUser = window.location.pathname.includes('/complete-profile/');
  
  // Debug: Log para verificar la detección
  console.log('🔍 DEBUG - AppContent RENDERIZADO');
  console.log('🔍 DEBUG - URL actual:', window.location.pathname);
  console.log('🔍 DEBUG - ¿Es usuario invitado?', isInvitedUser);
  console.log('🔍 DEBUG - currentUser:', currentUser);
  console.log('🔍 DEBUG - profileComplete:', profileComplete);
  console.log('🔍 DEBUG - authLoading:', authLoading);
  console.log('🔍 DEBUG - Timestamp:', new Date().toISOString());

  const mainMarginLeft = sidebarCollapsed ? '70px' : '280px';

  if (authLoading) {
    return <LoadingScreen />;
  }

  // PRIORIDAD 1: Si hay error de backend, mostrar pantalla de error bonita
  if (!backendConnected && backendError) {
    console.log('🔌 RENDERIZANDO BackendError por problema de conexión');
    return (
      <BackendError 
        errorType={backendError.type}
        onRetry={checkBackendConnection}
      />
    );
  }

  // PRIORIDAD 2: Si es un usuario invitado, mostrar CompleteProfile directamente
  if (isInvitedUser) {
    console.log('🎯 RENDERIZANDO CompleteProfile para usuario invitado - DETECCIÓN AGRESIVA');
    return <InvitationProfile />;
  }

  // PREVENCIÓN ADICIONAL: Si la URL contiene complete-profile, NO mostrar nada más
  if (window.location.pathname.includes('/complete-profile/')) {
    console.log('🚫 PREVENCIÓN ADICIONAL: URL contiene complete-profile, bloqueando AppContent');
    return <InvitationProfile />;
  }

  return (
    <>
      {currentUser ? (
        !profileComplete ? (
          <ProfileSetup />
        ) : (
          <>
            <Header />
            <Sidebar />
            <main
              style={{
                marginLeft: mainMarginLeft,
                padding: '1rem',
                marginTop: '80px'
              }}
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard-ultra" element={<DashboardUltra />} />

                <Route path="/clientes" element={<ClientModule />} />
                <Route path="/horas-extra" element={<HorasExtra />} />
                <Route path="/fases" element={<PhasesModule />} />
                <Route path="/mi-perfil" element={<MyProfile />} />

                <Route
                  path="/proyectos"
                  element={
                    <PrivateRoute allowedRoles={['super administrador', 'administrador']} moduleName="proyectos">
                      <ProyectosForm />
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
                      <CuentasPagarForm />
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
                      <CuentasCobrarForm />
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
            </main>
          </>
        )
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
  console.log('🚀 APP COMPONENT RENDERIZADO');
  console.log('🚀 URL actual:', window.location.pathname);
  console.log('🚀 Timestamp:', new Date().toISOString());
  console.log('🚀 ===========================================');
  console.log('🚀 SISTEMA DE INVITACIONES ACTIVADO');
  console.log('🚀 ===========================================');
  
  return (
    <Router>
      <Routes>
        {/* RUTA PRIORITARIA para usuarios invitados - SIEMPRE PRIMERA */}
        <Route path="/complete-profile/:token" element={<InvitationProfile />} />
        <Route path="*" element={<AppContent />} />
      </Routes>
    </Router>
  );
}

export default App;
