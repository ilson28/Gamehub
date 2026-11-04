# 🎮 GameHub – Sistema de Gestión de Videojuegos

![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen)
![Java](https://img.shields.io/badge/Java-21+-orange)
![React](https://img.shields.io/badge/React-18-blue)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC)
![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED)
![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1)
![JWT](https://img.shields.io/badge/Auth-JWT-red)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-black)
![Render](https://img.shields.io/badge/Backend-Render-purple)
![E2E](https://github.com/ilson28/Gamehub/actions/workflows/e2e.yml/badge.svg)

---

**GameHub** es un sistema web para la **gestión de videojuegos**, que permite administrar inventario, realizar **ventas y alquileres**, registrar **devoluciones** y consultar el **historial de transacciones**, todo desde una interfaz moderna, responsive y segura.

El proyecto sigue una arquitectura **full-stack**, con backend y frontend desacoplados, autenticación mediante **JWT** y despliegue en la nube.

---

## 🌐 Demo en producción

- **Frontend (Vercel)**  
  👉 https://gamehub-six-beta.vercel.app

- **Backend (Render)**  
  👉 Desplegado en Render mediante **Docker**

---

## 📌 Funcionalidades

### 🎯 Gestión de videojuegos
- Registrar videojuegos
- Actualizar videojuegos
- Eliminar videojuegos
- Visualización en grilla con:
  - Título
  - Género
  - Plataforma
  - Precio de venta
  - Precio de alquiler
  - Stock
  - Imagen

### 💰 Ventas y alquileres
- Venta de videojuegos
- Alquiler de videojuegos
- Registro de devoluciones (solo alquileres)
- Actualización automática del stock

### 👤 Información del cliente por transacción
En cada venta o alquiler se registra:
- Cédula
- Nombre
- Dirección
- Teléfono

### 📜 Historial y búsquedas
- Historial completo de transacciones
- Búsqueda de videojuegos por diferentes criterios

---

## 🧠 Reglas de negocio
- El stock disminuye al realizar una venta o alquiler.
- En alquileres, el stock se restablece al registrar la devolución.
- No se permiten transacciones sin stock disponible.
- Todas las transacciones deben estar asociadas a un cliente.

---

## 🖥️ Interfaz de usuario
- Grilla visual de videojuegos con imagen incluida.
- Diseño **responsive**, minimalista y atractivo.
- Construida con **React + Tailwind CSS**.

---

## 🛠️ Tecnologías utilizadas

### Backend
- Java 17+
- Spring Boot
- Spring Security
- JWT (JSON Web Token)
- JPA / Hibernate
- MySQL
- Docker

### Frontend
- React
- Tailwind CSS
- HTML5
- JavaScript (ES6+)
- Vite

---

## 🔐 Seguridad
- Autenticación basada en **JWT**
- Protección de endpoints con **Spring Security**
- Acceso controlado a las operaciones del sistema

---

## 🐳 Docker (Backend)
El backend está **contenedorizado con Docker** para facilitar el despliegue y la portabilidad del entorno.

- Imagen Docker construida a partir del proyecto Spring Boot
- Utilizada para el despliegue en **Render**
- Variables sensibles gestionadas mediante **.env**

---

## ⚙️ Configuración por perfiles

El backend utiliza **perfiles de Spring Boot** para manejar diferentes entornos:

### Perfiles disponibles
- `dev` → Desarrollo local
- `pro` → Producción
- `default` → Configuración estándar

### Archivos de configuración
- `application.properties`
- `application-dev.properties`
- `application-pro.properties`

### Variables de entorno
Se utiliza un archivo `.env` para manejar:
- Credenciales de base de datos
- Claves JWT
- Configuración sensible del sistema

> ⚠️ El archivo `.env` no debe subirse al repositorio.

---

## 🗄️ Base de datos
- **MySQL**
- Modelo relacional orientado a:
  - Videojuegos
  - Clientes
  - Transacciones (ventas y alquileres)

---

## 🚀 Instalación y ejecución local

### Backend
1. Clonar el repositorio
2. Entrar al directorio del backend
3. Crear el archivo `.env` con las variables necesarias
4. Seleccionar el perfil deseado:
   ```bash
   spring.profiles.active=dev
5. Ejecutar la aplicación:
    ```bash
    mvn spring-boot:run

### Frontend
1. Entrar al directorio del frontend
2. Crear el archivo `.env`
3. Definir la variable de entorno con la URL del backend:
   ```bash
   VITE_API_URL=http://localhost:8080
4. Instalar dependencias:
   ```bash
   npm install
5. Ejecutar la aplicación:
   ```bash
   npm run dev

