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
backend/
├── .mvn/
├── src/
│   └── main/
│       ├── java/com/c4/atunesdelpacifico/
│       │   ├── config/                  # Configuración general y de seguridad (JWT, CORS, filtros)
│       │   │   ├── GlobalExceptionHandler.java
│       │   │   ├── JwtAuthenticationFilter.java
│       │   │   ├── JwtUtil.java
│       │   │   └── SecurityConfig.java
│       │   ├── controller/             # Controladores REST
│       │   ├── dto/                    # Clases DTO para transferencias de datos
│       │   ├── model/                  # Entidades JPA
│       │   ├── repository/             # Repositorios JPA (interfaces)
│       │   ├── service/                # Lógica de negocio
│       │   └── AtunesdelpacificoApplication.java
│       └── resources/
│           ├── application.properties  # Configuración de la aplicación (DB, JWT, etc.)
│           └── data.sql                # Script inicial para carga de datos
├── test/                               # Tests de unidad y de integración
├── mvnw, mvnw.cmd                      # Wrappers de Maven
└── pom.xml                             # Archivo de configuración del proyecto Maven
```

---

## ⚙️ Configuración del Entorno

Crea un archivo `.env` con las siguientes variables de entorno (para configuración con Spring Boot si se usa alguna integración externa como dotenv o contenedores):

```
DB_URL=jdbc:mysql://localhost:3306/atunesdelpacifico
DB_USERNAME=root
DB_PASSWORD=ivan1703
```

O configura directamente en `application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/atunesdelpacifico
spring.datasource.username=root
spring.datasource.password=ivan1703
spring.jpa.hibernate.ddl-auto=update
```

## 🔐 Seguridad

- Implementada con **Spring Security** y **JWT**.
- Filtro personalizado `JwtAuthenticationFilter` para validar cada solicitud.
- Configuración de CORS incluida en `SecurityConfig.java`:

```java
configuration.addAllowedOrigin("http://localhost:5173"); // Cambia al puerto de tu frontend
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

---

## 📝 Repositorio

Repositorio oficial:  
👉 https://github.com/ejsantiagoh/Proyecto_BACK-FRONT_SpringBoot_SantiagoEimerVillamizarIvan/tree/dario

Si no funciona correctamente, puedes clonar la versión de solo frontend desde:  
👉 https://github.com/ivillamizar5/frontedAtunDelPacifico

---

## 👥 Autores

- Eimer Santiago
- Iván Villamizar

---

## 📌 Notas Adicionales

- Se recomienda usar Apache Tomcat como servidor para el backend.
- El frontend puede ser servido desde Apache Web Server o desde un servidor React local.