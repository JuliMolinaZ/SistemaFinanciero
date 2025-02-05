// src/App.js
import React, { useContext, useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import axios from 'axios';
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


// Módulo de Cotizaciones
import CotizacionesForm from './modules/Cotizaciones/CotizacionesForm';

// *** Nuevo Módulo Flow Recovery V2 ***
import FlowRecoveryV2Form from './modules/FlowRecoveryV2/FlowRecoveryV2Form';

import PrivateRoute from './components/PrivateRoute';

function App() {
  const {
    currentUser,
    profileComplete,
    sidebarCollapsed,
    profileData,
    authLoading
  } = useContext(GlobalContext);
  const [localPermisos, setLocalPermisos] = useState([]);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchPermisos = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/permisos`);
        console.log('Permisos obtenidos:', response.data);
        setLocalPermisos(response.data);
      } catch (error) {
        console.error(
          'Error al obtener los permisos:',
          error.response?.data || error.message
        );
      }
    };
    fetchPermisos();
  }, [API_URL]);

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
            <Sidebar permisos={localPermisos} />
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
                    <PrivateRoute allowedRoles={['Juan Carlos', 'Administrador']} condition="proyectos">
                      <ProyectosForm />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/proveedores"
                  element={
                    <PrivateRoute allowedRoles={['Administrador', 'Juan Carlos']} condition="proveedores">
                      <ProveedoresForm />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/cuentas-pagar"
                  element={
                    <PrivateRoute allowedRoles={['Administrador', 'Juan Carlos']} condition="cuentas_pagar">
                      <CuentasPagarForm />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/costos-fijos"
                  element={
                    <PrivateRoute allowedRoles={['Juan Carlos', 'Administrador']} condition="costos_fijos">
                      <CostosFijos />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/cuentas-cobrar"
                  element={
                    <PrivateRoute allowedRoles={['Juan Carlos', 'Administrador']} condition="cuentas_cobrar">
                      <CuentasCobrarForm />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/contabilidad"
                  element={
                    <PrivateRoute allowedRoles={['Administrador', 'Juan Carlos']} condition="contabilidad">
                      <ContabilidadForm />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/categorias"
                  element={
                    <PrivateRoute allowedRoles={['Administrador', 'Juan Carlos']} condition="categorias">
                      <CategoriasForm />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/recuperacion"
                  element={
                    <PrivateRoute allowedRoles={['Juan Carlos']} condition="recuperacion">
                      <RecuperacionForm />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/usuarios"
                  element={
                    <PrivateRoute allowedRoles={['Administrador', 'Juan Carlos']} condition="usuarios">
                      <UsersList />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/permisos"
                  element={
                    <PrivateRoute allowedRoles={['Juan Carlos']} condition="permisos">
                      <PermisosModule />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/realtime-graph"
                  element={
                    <PrivateRoute allowedRoles={['Juan Carlos']} condition="realtime_graph">
                      <RealtimeGraph />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/emitidas"
                  element={
                    <PrivateRoute allowedRoles={['Administrador', 'Juan Carlos']} condition="emitidas">
                      <EmitidasForms />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/cotizaciones"
                  element={
                    <PrivateRoute allowedRoles={['Administrador', 'Juan Carlos']} condition="cotizaciones">
                      <CotizacionesForm />
                    </PrivateRoute>
                  }
                />

                {/* Nueva ruta para Flow Recovery V2 */}
                <Route
                  path="/flow-recovery-v2"
                  element={
                    <PrivateRoute allowedRoles={['Juan Carlos']} condition="flow_recovery_v2">
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











