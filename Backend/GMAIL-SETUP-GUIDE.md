# 🚀 GUÍA DE CONFIGURACIÓN DE GMAIL PARA RUNSOLUTIONS

## 📋 REQUISITOS PREVIOS

### ✅ Cuenta de Gmail
- Debe ser una cuenta de Gmail válida
- No puede ser una cuenta corporativa con restricciones

### ✅ Verificación en 2 Pasos
- **OBLIGATORIO** para generar contraseñas de aplicación
- Sin esto, no se pueden enviar emails

---

## 🔐 PASO 1: ACTIVAR VERIFICACIÓN EN 2 PASOS

### 1.1 Ir a Configuración de Gmail
```
Gmail → Configuración (⚙️) → Ver todas las configuraciones
```

### 1.2 Activar Verificación en 2 Pasos
```
Pestaña "Cuentas e importación" → Verificación en 2 pasos → Activar
```

### 1.3 Seguir el Proceso
- Confirmar contraseña
- Agregar número de teléfono
- Recibir código de verificación
- Activar verificación

---

## 🔑 PASO 2: GENERAR CONTRASEÑA DE APLICACIÓN

### 2.1 Ir a Contraseñas de Aplicación
```
Gmail → Configuración → Ver todas las configuraciones
→ Pestaña "Cuentas e importación" → Verificación en 2 pasos
→ Contraseñas de aplicación
```

### 2.2 Seleccionar Aplicación
```
Seleccionar aplicación: "Correo"
Seleccionar dispositivo: "Otro (nombre personalizado)"
Nombre: "RunSolutions Sistema"
```

### 2.3 Copiar Contraseña
```
Se generará una contraseña de 16 caracteres
Ejemplo: "abcd efgh ijkl mnop"
⚠️ IMPORTANTE: Copiar SIN espacios
```

---

## ⚙️ PASO 3: CONFIGURAR VARIABLES DE ENTORNO

### 3.1 Ejecutar Script de Configuración
```bash
cd Backend
node configure-gmail.js
```

### 3.2 Seguir las Instrucciones
- Ingresar email de Gmail
- Ingresar contraseña de aplicación (16 caracteres)
- El script actualizará automáticamente `config.env`

### 3.3 Verificar Configuración
```bash
# Verificar que las variables estén configuradas
grep -E "GMAIL_USER|GMAIL_APP_PASSWORD" config.env
```

---

## 🧪 PASO 4: PROBAR EL SISTEMA

### 4.1 Reiniciar Servidor
```bash
# Detener servidor (Ctrl+C)
npm start
```

### 4.2 Registrar Usuario de Prueba
- Ir al módulo USUARIOS
- Registrar usuario con email válido
- Verificar logs del servidor

### 4.3 Verificar Email
- Revisar bandeja de entrada
- Verificar que el email llegue correctamente
- Probar enlace de acceso

---

## ❌ PROBLEMAS COMUNES Y SOLUCIONES

### 🔴 Error: "Invalid login"
**Causa:** Credenciales incorrectas
**Solución:**
- Verificar que la verificación en 2 pasos esté activada
- Usar contraseña de aplicación, NO contraseña normal
- Verificar que no haya espacios en la contraseña

### 🔴 Error: "Username and Password not accepted"
**Causa:** Gmail bloquea el acceso
**Solución:**
- Verificar que la cuenta no esté bloqueada
- Revisar actividad reciente de la cuenta
- Generar nueva contraseña de aplicación

### 🔴 Error: "Less secure app access"
**Causa:** Configuración de seguridad antigua
**Solución:**
- **NO** usar "Acceso de aplicaciones menos seguras"
- **SÍ** usar contraseñas de aplicación

---

## 📧 ESTRUCTURA DEL EMAIL ENVIADO

### ✅ Características del Email
- **Asunto:** "🎉 ¡Bienvenido a RunSolutions! Tu cuenta está lista"
- **Formato:** HTML responsive y profesional
- **Contenido:** Información del usuario, rol, instrucciones
- **Enlace:** Botón directo para completar perfil
- **Vigencia:** Token válido por 24 horas

### ✅ Información Incluida
- Email del usuario
- Rol asignado
- Descripción del rol
- Instrucciones paso a paso
- Enlace de acceso directo
- Información de seguridad

---

## 🎯 VERIFICACIÓN FINAL

### ✅ Checklist de Verificación
- [ ] Verificación en 2 pasos activada
- [ ] Contraseña de aplicación generada
- [ ] Variables configuradas en `config.env`
- [ ] Servidor reiniciado
- [ ] Usuario de prueba registrado
- [ ] Email recibido correctamente
- [ ] Enlace de acceso funcional

### 🎉 Sistema Listo
Una vez completado el checklist, el sistema enviará emails automáticamente cada vez que se registre un nuevo usuario.

---

## 📞 SOPORTE

### 🔧 Si algo no funciona
1. Verificar logs del servidor
2. Ejecutar `node test-email-service.js`
3. Verificar configuración de Gmail
4. Revisar variables de entorno

### 📚 Recursos Adicionales
- [Documentación de Gmail](https://support.google.com/mail/)
- [Contraseñas de Aplicación](https://support.google.com/accounts/answer/185833)
- [Soporte de Nodemailer](https://nodemailer.com/)

---

**¡Con esta configuración, tu sistema RunSolutions enviará emails profesionales automáticamente!** 🚀📧
