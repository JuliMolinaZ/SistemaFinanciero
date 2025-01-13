// src/App.js
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import UsersList from './modules/Usuarios/UsersList';
import MyProfile from './modules/Usuarios/MyProfile';
import HorasExtra from './modules/HorasExtra/HorasExtra';
import PhasesModule from './modules/Fases/PhasesModule'; // Importación añadida
import PrivateRoute from './components/PrivateRoute';

function App() {
  const { currentUser, profileComplete, sidebarCollapsed, profileData, authLoading } = useContext(GlobalContext);

  if (authLoading) {
    return <LoadingScreen />;
  }

  const mainMarginLeft = sidebarCollapsed ? '60px' : '220px';

  return (
    <Router>
      {currentUser ? (
        !profileComplete ? (
          <ProfileSetup />
        ) : (
          <>
            <Header />
            <Sidebar />
            <main style={{ marginLeft: mainMarginLeft, padding: '1rem', marginTop: '72px' }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/clientes" element={<ClientModule />} />
                <Route path="/proyectos" element={<ProyectosForm />} />
                <Route path="/horas-extra" element={<HorasExtra />} />
                <Route path="/fases" element={<PhasesModule />} /> {/* Nueva ruta */}
                <Route
                  path="/proveedores"
                  element={
                    <PrivateRoute role={profileData.role} allowedRoles={['Administrador']}>
                      <ProveedoresForm />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/cuentas-pagar"
                  element={
                    <PrivateRoute role={profileData.role} allowedRoles={['Administrador']}>
                      <CuentasPagarForm />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/cuentas-cobrar"
                  element={
                    <PrivateRoute role={profileData.role} allowedRoles={['Administrador']}>
                      <CuentasCobrarForm />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/contabilidad"
                  element={
                    <PrivateRoute role={profileData.role} allowedRoles={['Administrador']}>
                      <ContabilidadForm />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/categorias"
                  element={
                    <PrivateRoute role={profileData.role} allowedRoles={['Administrador']}>
                      <CategoriasForm />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/recuperacion"
                  element={
                    <PrivateRoute role={profileData.role} allowedRoles={['Administrador']}>
                      <RecuperacionForm />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/usuarios"
                  element={
                    <PrivateRoute role={profileData.role} allowedRoles={['Administrador']}>
                      <UsersList />
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
