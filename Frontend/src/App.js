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

import AuthForm from './modules/Usuarios/AuthForm';
import ProfileSetup from './modules/Usuarios/ProfileSetup';
import Home from './modules/Home/Home';

import Header from './components/Header';
import Sidebar from './components/Sidebar';

import ClientModule from './modules/Clientes/ClientModule';
import ProyectosForm from './modules/Proyectos/ProyectosForm';
import ProveedoresForm from './modules/Proveedores/ProveedoresForm';
import CuentasPagarForm from './modules/CuentasPorPagar/CuentasPagarForm';
import CuentasCobrarForm from './modules/CuentasPorCobrar/CuentasCobrarForm';
import ContabilidadForm from './modules/Contabilidad/ContabilidadForm';
import CategoriasForm from './modules/Categorias/CategoriasForm';
import RecuperacionForm from './modules/Recuperacion/RecuperacionForm';
import RealtimeGraph from './modules/RealtimeGraph/RealtimeGraph';
import UsersList from './modules/Usuarios/UsersList';
import MyProfile from './modules/Usuarios/MyProfile';
import HorasExtra from './modules/HorasExtra/HorasExtra';
import PhasesModule from './modules/Fases/PhasesModule';
import CostosFijos from './modules/CostosFijos/CostosFijos';
import PermisosModule from './modules/Permisos/PermisosModule';
import EmitidasForms from './modules/Emitidas/EmitidasForms';
import CotizacionesForm from './modules/Cotizaciones/CotizacionesForm';
import FlowRecoveryV2Form from './modules/FlowRecoveryV2/FlowRecoveryV2Form';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const { currentUser, profileComplete, sidebarCollapsed, profileData, authLoading } = useContext(GlobalContext);

  const mainMarginLeft = sidebarCollapsed ? '60px' : '220px';

  if (authLoading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
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
                marginTop: '72px'
              }}
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/clientes" element={<ClientModule />} />
                <Route path="/horas-extra" element={<HorasExtra />} />
                <Route path="/fases" element={<PhasesModule />} />
                <Route path="/mi-perfil" element={<MyProfile />} />

                <Route
                  path="/proyectos"
                  element={
                    <PrivateRoute allowedRoles={['juan carlos', 'administrador']} moduleName="proyectos">
                      <ProyectosForm />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/proveedores"
                  element={
                    <PrivateRoute allowedRoles={['juan carlos', 'administrador']} moduleName="proveedores">
                      <ProveedoresForm />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/cuentas-pagar"
                  element={
                    <PrivateRoute allowedRoles={['juan carlos', 'administrador']} moduleName="cuentas_pagar">
                      <CuentasPagarForm />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/costos-fijos"
                  element={
                    <PrivateRoute allowedRoles={['juan carlos', 'administrador']} moduleName="costos_fijos">
                      <CostosFijos />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/cuentas-cobrar"
                  element={
                    <PrivateRoute allowedRoles={['juan carlos', 'administrador']} moduleName="cuentas_cobrar">
                      <CuentasCobrarForm />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/contabilidad"
                  element={
                    <PrivateRoute allowedRoles={['juan carlos', 'administrador']} moduleName="contabilidad">
                      <ContabilidadForm />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/categorias"
                  element={
                    <PrivateRoute allowedRoles={['juan carlos', 'administrador']} moduleName="categorias">
                      <CategoriasForm />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/recuperacion"
                  element={
                    <PrivateRoute allowedRoles={['juan carlos', 'administrador']} moduleName="recuperacion">
                      <RecuperacionForm />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/usuarios"
                  element={
                    <PrivateRoute allowedRoles={['juan carlos', 'administrador']} moduleName="usuarios">
                      <UsersList />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/permisos"
                  element={
                    <PrivateRoute allowedRoles={['juan carlos', 'administrador']} moduleName="permisos">
                      <PermisosModule />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/realtime-graph"
                  element={
                    <PrivateRoute allowedRoles={['juan carlos', 'administrador']} moduleName="realtime_graph">
                      <RealtimeGraph />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/emitidas"
                  element={
                    <PrivateRoute allowedRoles={['juan carlos', 'administrador']} moduleName="emitidas">
                      <EmitidasForms />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/cotizaciones"
                  element={
                    <PrivateRoute allowedRoles={['juan carlos', 'administrador']} moduleName="cotizaciones">
                      <CotizacionesForm />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/flow-recovery-v2"
                  element={
                    <PrivateRoute allowedRoles={['juan carlos', 'administrador']} moduleName="flow_recovery_v2">
                      <FlowRecoveryV2Form />
                    </PrivateRoute>
                  }
                />
                <Route path="/test" element={<div>Ruta de Prueba Exitosa</div>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </>
        )
      ) : (
        <Routes>
          <Route path="*" element={<AuthForm />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
