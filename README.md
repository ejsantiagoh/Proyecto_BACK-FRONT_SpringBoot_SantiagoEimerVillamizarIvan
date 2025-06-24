# Proyecto SpringBoot con React
# Backend - Atunes del Pacífico S.A.

Este es el backend del sistema para la empresa **Atunes del Pacífico S.A.**, desarrollado con **Spring Boot**. Gestiona las operaciones de producción, inventario, pedidos, usuarios, clientes y reportes.

## 🧾 Descripción General

El sistema busca centralizar la información y automatizar procesos claves como:
- Registro y control de lotes de atún (en agua, aceite, salsa).
- Administración de pedidos por parte de los clientes.
- Control de inventario actualizado en tiempo real.
- Gestión de usuarios y roles (cliente, operador, administrador).
- Generación de reportes de producción y ventas.

---

## 📁 Estructura del Proyecto

```
proyecto/
  backend/              # Código de Spring Boot
    src/
    pom.xml
    Dockerfile
  frontend/             # Código de React
    src/
    package.json
    Dockerfile
  docker-compose.yml
  .env
```

---

## ⚙️ Configuración del Entorno

Crea un archivo `.env` con las siguientes variables de entorno (para configuración con Spring Boot o contenedores) en la raiz del proyecto:

```
MYSQL_ROOT_PASSWORD=R00tP@ssw0rd2025
MYSQL_DATABASE=escribe su bd
MYSQL_USER=app_user
MYSQL_PASSWORD=escribe su passwprd
SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/${MYSQL_DATABASE}?createDatabaseIfNotExist=true&serverTimezone=UTC&useSSL=false
SPRING_DATASOURCE_USERNAME=${MYSQL_USER}
SPRING_DATASOURCE_PASSWORD=${MYSQL_PASSWORD}
SPRING_PROFILES_ACTIVE=prod
```

## 🔐 Seguridad

- Implementada con **Spring Security** y **JWT**.
- Filtro personalizado `JwtAuthenticationFilter` para validar cada solicitud.
- Configuración de CORS incluida en `SecurityConfig.java`:

```java
configuration.addAllowedOrigin("http://localhost:3000"); // Cambia al puerto de tu frontend
```

## 🚀 Endpoints

Todos los endpoints están documentados con **Swagger**.

Accede a la documentación interactiva en: `http://localhost:8081/swagger-ui.html` (si está habilitado).

## 📦 Tecnologías

- **Java 17+**
- **Spring Boot**
- **Spring Security + JWT**
- **JPA / Hibernate**
- **MySQL**
- **Swagger**
- **Docker**

---

## 📝 Repositorio

Repositorio oficial:  
👉 https://github.com/ejsantiagoh/Proyecto_BACK-FRONT_SpringBoot_SantiagoEimerVillamizarIvan.git

Si no funciona correctamente, puedes clonar la versión de solo frontend desde:  
👉 https://github.com/ivillamizar5/frontedAtunDelPacifico

---

## 👥 Autores

- Eimer Santiago
- Iván Villamizar

---

## 📌 Notas Adicionales

- Se recomienda usar docker como servidor para el backend. http://localhost:8081/api/auth/login
- El frontend puede ser servido desde [docker](http://localhost:3000/) o desde un servidor React local.