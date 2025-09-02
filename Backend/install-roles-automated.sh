#!/bin/bash

# =====================================================
# INSTALADOR AUTOMÁTICO DEL SISTEMA DE ROLES
# Sistema Financiero - Backend
# =====================================================

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir mensajes
print_message() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Función para verificar si un comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Función para verificar si MySQL está disponible
check_mysql() {
    if command_exists mysql; then
        print_success "MySQL encontrado en el sistema"
        return 0
    else
        print_error "MySQL no está instalado o no está en el PATH"
        return 1
    fi
}

# Función para verificar si Node.js está disponible
check_node() {
    if command_exists node; then
        print_success "Node.js encontrado en el sistema"
        return 0
    else
        print_error "Node.js no está instalado o no está en el PATH"
        return 1
    fi
}

# Función para verificar si npm está disponible
check_npm() {
    if command_exists npm; then
        print_success "npm encontrado en el sistema"
        return 0
    else
        print_error "npm no está instalado o no está en el PATH"
        return 1
    fi
}

# Función para crear backup de la base de datos
create_backup() {
    local db_name="$1"
    local backup_file="backup_before_roles_$(date +%Y%m%d_%H%M%S).sql"
    
    print_message "Creando backup de la base de datos '$db_name'..."
    
    if mysqldump -u root -p "$db_name" > "$backup_file" 2>/dev/null; then
        print_success "Backup creado exitosamente: $backup_file"
        return 0
    else
        print_error "Error al crear backup. Verificar credenciales de MySQL"
        return 1
    fi
}

# Función para ejecutar script SQL
execute_sql_script() {
    local db_name="$1"
    local script_file="$2"
    
    print_message "Ejecutando script SQL: $script_file"
    
    if mysql -u root -p "$db_name" < "$script_file" 2>/dev/null; then
        print_success "Script SQL ejecutado exitosamente"
        return 0
    else
        print_error "Error al ejecutar script SQL. Verificar el archivo y la base de datos"
        return 1
    fi
}

# Función para instalar dependencias npm
install_dependencies() {
    print_message "Instalando dependencias npm..."
    
    if npm install; then
        print_success "Dependencias instaladas exitosamente"
        return 0
    else
        print_error "Error al instalar dependencias npm"
        return 1
    fi
}

# Función para ejecutar pruebas del sistema
run_tests() {
    print_message "Ejecutando pruebas del sistema de roles..."
    
    if node test-roles-system.js; then
        print_success "Pruebas ejecutadas exitosamente"
        return 0
    else
        print_warning "Algunas pruebas fallaron. Revisar logs para más detalles"
        return 1
    fi
}

# Función para verificar archivos necesarios
check_required_files() {
    local required_files=(
        "sql/roles-system-migration.sql"
        "src/controllers/rolController.js"
        "src/middlewares/permissions.js"
        "src/routes/roles.js"
        "test-roles-system.js"
        "package.json"
    )
    
    print_message "Verificando archivos necesarios..."
    
    for file in "${required_files[@]}"; do
        if [ -f "$file" ]; then
            print_success "Archivo encontrado: $file"
        else
            print_error "Archivo no encontrado: $file"
            return 1
        fi
    done
    
    return 0
}

# Función para mostrar resumen de instalación
show_summary() {
    echo ""
    echo "====================================================="
    echo "🎉 INSTALACIÓN COMPLETADA EXITOSAMENTE"
    echo "====================================================="
    echo ""
    echo "📋 ARCHIVOS INSTALADOS:"
    echo "   ✅ Script de migración SQL"
    echo "   ✅ Controlador de roles mejorado"
    echo "   ✅ Middleware de permisos"
    echo "   ✅ Rutas actualizadas"
    echo "   ✅ Script de pruebas"
    echo ""
    echo "🔐 FUNCIONALIDADES DISPONIBLES:"
    echo "   ✅ Sistema de roles jerárquico"
    echo "   ✅ Permisos granulares por módulo"
    echo "   ✅ Middleware de verificación"
    echo "   ✅ Cache inteligente"
    echo "   ✅ Auditoría completa"
    echo ""
    echo "🚀 PRÓXIMOS PASOS:"
    echo "   1. Reiniciar el servidor backend"
    echo "   2. Probar endpoints de roles"
    echo "   3. Configurar permisos específicos"
    echo "   4. Monitorear logs de auditoría"
    echo ""
    echo "📚 DOCUMENTACIÓN:"
    echo "   📖 install-roles-system.md - Guía completa"
    echo "   🧪 test-roles-system.js - Script de pruebas"
    echo "   🔧 Archivos de configuración en src/"
    echo ""
    echo "====================================================="
}

# Función principal de instalación
main() {
    echo ""
    echo "====================================================="
    echo "🚀 INSTALADOR AUTOMÁTICO DEL SISTEMA DE ROLES"
    echo "====================================================="
    echo ""
    
    # Verificar directorio actual
    if [ ! -f "package.json" ]; then
        print_error "Este script debe ejecutarse desde el directorio Backend del proyecto"
        exit 1
    fi
    
    # Verificar dependencias del sistema
    print_message "Verificando dependencias del sistema..."
    
    if ! check_mysql; then
        print_error "MySQL es requerido para la instalación"
        exit 1
    fi
    
    if ! check_node; then
        print_error "Node.js es requerido para la instalación"
        exit 1
    fi
    
    if ! check_npm; then
        print_error "npm es requerido para la instalación"
        exit 1
    fi
    
    # Verificar archivos necesarios
    if ! check_required_files; then
        print_error "Faltan archivos necesarios para la instalación"
        exit 1
    fi
    
    # Solicitar nombre de la base de datos
    echo ""
    read -p "Ingrese el nombre de la base de datos MySQL: " db_name
    
    if [ -z "$db_name" ]; then
        print_error "El nombre de la base de datos es requerido"
        exit 1
    fi
    
    # Confirmar instalación
    echo ""
    print_warning "¿Está seguro de que desea continuar con la instalación?"
    print_warning "Esto modificará la estructura de la base de datos '$db_name'"
    read -p "¿Continuar? (y/N): " confirm
    
    if [[ ! $confirm =~ ^[Yy]$ ]]; then
        print_message "Instalación cancelada por el usuario"
        exit 0
    fi
    
    # Crear backup
    if ! create_backup "$db_name"; then
        print_error "No se pudo crear el backup. Abortando instalación"
        exit 1
    fi
    
    # Instalar dependencias npm
    if ! install_dependencies; then
        print_error "No se pudieron instalar las dependencias. Abortando instalación"
        exit 1
    fi
    
    # Ejecutar script de migración
    if ! execute_sql_script "$db_name" "sql/roles-system-migration.sql"; then
        print_error "No se pudo ejecutar la migración. Abortando instalación"
        exit 1
    fi
    
    # Ejecutar pruebas
    if ! run_tests; then
        print_warning "Las pruebas fallaron, pero la instalación continuará"
    fi
    
    # Mostrar resumen
    show_summary
    
    # Preguntar si reiniciar el servidor
    echo ""
    read -p "¿Desea reiniciar el servidor backend ahora? (y/N): " restart_server
    
    if [[ $restart_server =~ ^[Yy]$ ]]; then
        print_message "Reiniciando servidor backend..."
        if npm start; then
            print_success "Servidor reiniciado exitosamente"
        else
            print_warning "No se pudo reiniciar el servidor automáticamente"
            print_message "Ejecute 'npm start' manualmente"
        fi
    fi
    
    echo ""
    print_success "¡Instalación completada! 🎉"
    print_message "Revise la documentación para más detalles"
}

# Ejecutar función principal
main "$@"
