// 🏗️ COMPONENTE APPSHELL - LAYOUT PRINCIPAL
// =========================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Bell, 
  Settings, 
  Menu, 
  X, 
  Sun, 
  Moon,
  User,
  LogOut
} from 'lucide-react';
import QuickAction from './QuickAction';
import './AppShell.css';

const AppShell = ({
  children,
  sidebar = true,
  topbar = true,
  searchPlaceholder = "Buscar...",
  onSearch,
  onThemeToggle,
  currentTheme = 'dark',
  user,
  onLogout,
  className = ''
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (value) => {
    setSearchValue(value);
    onSearch?.(value);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleThemeToggle = () => {
    onThemeToggle?.();
  };

  return (
    <div className={`app-shell ${className}`} data-theme={currentTheme}>
      {/* 🎯 TOPBAR */}
      {topbar && (
        <header className="app-shell__topbar">
          <div className="app-shell__topbar-left">
            {sidebar && (
              <QuickAction
                variant="ghost"
                size="sm"
                icon={sidebarOpen ? X : Menu}
                onClick={toggleSidebar}
                className="app-shell__menu-toggle"
                aria-label={sidebarOpen ? 'Cerrar menú' : 'Abrir menú'}
              />
            )}
            
            <div className="app-shell__search">
              <Search className="app-shell__search-icon" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => handleSearch(e.target.value)}
                className="app-shell__search-input"
                aria-label="Buscar"
              />
            </div>
          </div>

          <div className="app-shell__topbar-right">
            <QuickAction
              variant="ghost"
              size="sm"
              icon={Bell}
              className="app-shell__notification"
              aria-label="Notificaciones"
            />
            
            <QuickAction
              variant="ghost"
              size="sm"
              icon={currentTheme === 'dark' ? Sun : Moon}
              onClick={handleThemeToggle}
              className="app-shell__theme-toggle"
              aria-label={`Cambiar a tema ${currentTheme === 'dark' ? 'claro' : 'oscuro'}`}
            />
            
            <QuickAction
              variant="ghost"
              size="sm"
              icon={Settings}
              className="app-shell__settings"
              aria-label="Configuración"
            />

            {/* 👤 USER MENU */}
            <div className="app-shell__user-menu">
              <QuickAction
                variant="ghost"
                size="sm"
                icon={User}
                className="app-shell__user-avatar"
                aria-label="Menú de usuario"
              />
            </div>
          </div>
        </header>
      )}

      <div className="app-shell__main">
        {/* 📱 SIDEBAR */}
        {sidebar && (
          <>
            {/* Overlay para móvil */}
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  className="app-shell__sidebar-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSidebarOpen(false)}
                />
              )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
              className={`app-shell__sidebar ${sidebarOpen ? 'app-shell__sidebar--open' : ''}`}
              initial={false}
              animate={{ 
                x: sidebarOpen ? 0 : -280,
                opacity: sidebarOpen ? 1 : 0
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="app-shell__sidebar-content">
                {/* Logo/Title */}
                <div className="app-shell__sidebar-header">
                  <h1 className="app-shell__sidebar-title">
                    Sistema Financiero
                  </h1>
                </div>

                {/* Navigation */}
                <nav className="app-shell__sidebar-nav">
                  <div className="app-shell__nav-section">
                    <h3 className="app-shell__nav-section-title">Principal</h3>
                    <ul className="app-shell__nav-list">
                      <li>
                        <a href="/dashboard" className="app-shell__nav-link">
                          Dashboard
                        </a>
                      </li>
                      <li>
                        <a href="/projects" className="app-shell__nav-link">
                          Proyectos
                        </a>
                      </li>
                      <li>
                        <a href="/tasks" className="app-shell__nav-link">
                          Tareas
                        </a>
                      </li>
                      <li>
                        <a href="/reports" className="app-shell__nav-link">
                          Reportes
                        </a>
                      </li>
                    </ul>
                  </div>

                  <div className="app-shell__nav-section">
                    <h3 className="app-shell__nav-section-title">Gestión</h3>
                    <ul className="app-shell__nav-list">
                      <li>
                        <a href="/users" className="app-shell__nav-link">
                          Usuarios
                        </a>
                      </li>
                      <li>
                        <a href="/clients" className="app-shell__nav-link">
                          Clientes
                        </a>
                      </li>
                      <li>
                        <a href="/settings" className="app-shell__nav-link">
                          Configuración
                        </a>
                      </li>
                    </ul>
                  </div>
                </nav>

                {/* User info */}
                <div className="app-shell__sidebar-footer">
                  <div className="app-shell__user-info">
                    <div className="app-shell__user-avatar-large">
                      <User className="w-6 h-6" />
                    </div>
                    <div className="app-shell__user-details">
                      <div className="app-shell__user-name">
                        {user?.name || 'Usuario'}
                      </div>
                      <div className="app-shell__user-role">
                        {user?.role || 'Administrador'}
                      </div>
                    </div>
                  </div>
                  
                  <QuickAction
                    variant="ghost"
                    size="sm"
                    icon={LogOut}
                    onClick={onLogout}
                    className="app-shell__logout"
                    aria-label="Cerrar sesión"
                  />
                </div>
              </div>
            </motion.aside>
          </>
        )}

        {/* 📄 MAIN CONTENT */}
        <main className={`app-shell__content ${sidebar ? 'app-shell__content--with-sidebar' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppShell;
