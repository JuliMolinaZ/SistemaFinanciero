import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
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
import RealtimeGraph from './modules/RealtimeGraph/RealtimeGraph'; // Importa el módulo del gráfico en tiempo real
import UsersList from './modules/Usuarios/UsersList';
import MyProfile from './modules/Usuarios/MyProfile';
import HorasExtra from './modules/HorasExtra/HorasExtra';
import PhasesModule from './modules/Fases/PhasesModule';
import CostosFijos from './modules/CostosFijos/CostosFijos';
import PermisosModule from './modules/Permisos/PermisosModule';

import PrivateRoute from './components/PrivateRoute';

function App() {
  const { currentUser, profileComplete, sidebarCollapsed, profileData, authLoading } = useContext(GlobalContext);
  const [permisos, setPermisos] = useState([]);

  useEffect(() => {
    const fetchPermisos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/permisos');
        setPermisos(response.data);
      } catch (error) {
        console.error('Error al obtener los permisos:', error.response?.data || error.message);
      }
    };

    fetchPermisos();
  }, []); // Este efecto solo se ejecuta al montar el componente

  const mainMarginLeft = sidebarCollapsed ? '60px' : '220px';

  const hasAdminPermission = (modulo) => {
    const permiso = permisos.find((p) => p.modulo === modulo);
    return permiso?.acceso_administrador || false;
  };

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
            <Sidebar permisos={permisos} />
            <main style={{ marginLeft: mainMarginLeft, padding: '1rem', marginTop: '72px' }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/clientes" element={<ClientModule />} />
                <Route
                  path="/proyectos"
                  element={
                    <PrivateRoute
                      role={profileData.role}
                      allowedRoles={['Juan Carlos', 'Administrador']}
                      condition={() => profileData.role === 'Juan Carlos' || hasAdminPermission('proyectos')}
                    >
                      <ProyectosForm />
                    </PrivateRoute>
                  }
                />
                <Route path="/horas-extra" element={<HorasExtra />} />
                <Route path="/fases" element={<PhasesModule />} />
                <Route
                  path="/proveedores"
                  element={
                    <PrivateRoute role={profileData.role} allowedRoles={['Administrador', 'Juan Carlos']}>
                      <ProveedoresForm />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/cuentas-pagar"
                  element={
                    <PrivateRoute role={profileData.role} allowedRoles={['Administrador', 'Juan Carlos']}>
                      <CuentasPagarForm />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/costos-fijos"
                  element={
                    <PrivateRoute role={profileData.role} allowedRoles={['Juan Carlos']}>
                      <CostosFijos />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/cuentas-cobrar"
                  element={
                    <PrivateRoute
                      role={profileData.role}
                      allowedRoles={['Juan Carlos', 'Administrador']}
                      condition={() => profileData.role === 'Juan Carlos' || hasAdminPermission('cuentas_cobrar')}
                    >
                      <CuentasCobrarForm />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/contabilidad"
                  element={
                    <PrivateRoute role={profileData.role} allowedRoles={['Administrador', 'Juan Carlos']}>
                      <ContabilidadForm />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/categorias"
                  element={
                    <PrivateRoute role={profileData.role} allowedRoles={['Administrador', 'Juan Carlos']}>
                      <CategoriasForm />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/recuperacion"
                  element={
                    <PrivateRoute role={profileData.role} allowedRoles={['Juan Carlos']}>
                      <RecuperacionForm />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/usuarios"
                  element={
                    <PrivateRoute role={profileData.role} allowedRoles={['Administrador', 'Juan Carlos']}>
                      <UsersList />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/permisos"
                  element={
                    <PrivateRoute role={profileData.role} allowedRoles={['Juan Carlos']}>
                      <PermisosModule />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/realtime-graph"
                  element={
                    <PrivateRoute role={profileData.role} allowedRoles={['Juan Carlos']}>
                      <RealtimeGraph />
                    </PrivateRoute>
                  }
                />
                <Route path="/mi-perfil" element={<MyProfile />} />
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







