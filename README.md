# Shopping Car - Sistema de Carrito de Compras

Aplicación completa de gestión de compras con arquitectura separada frontend/backend, desarrollada con Spring Boot y JavaScript vanilla.

---

## 🌿 Ramas del Repositorio

Este proyecto está organizado en ramas separadas para mantener el código limpio y ordenado:

| Rama | Contenido |
|------|-----------|
| `main` | Documentación general del proyecto |
| `BACKEND` | API REST completa con Spring Boot + PostgreSQL |
| `FRONTEND` | SPA con HTML/CSS/JS — panel de gestión visual |

> 💡 Para ver el código fuente cambia a la rama correspondiente desde el selector de ramas en GitHub.

---

## 🏗️ Arquitectura

```
shopping-car/
│
├── RAMA: BACKEND
│   └── backend/
│       ├── pom.xml
│       ├── src/main/java/com/corhuila/shoppingcar/
│       │   ├── Controller/        # Endpoints REST
│       │   ├── Service/           # Lógica de negocio
│       │   ├── IService/          # Interfaces de servicio
│       │   ├── Entity/            # Modelos JPA
│       │   ├── IRepository/       # Interfaces JPA Repository
│       │   └── ShoppingCarApplication.java
│       └── src/main/resources/
│           └── application.properties
│
└── RAMA: FRONTEND
    └── frontend/
        ├── index.html             # SPA con sidebar y modales
        ├── package.json           # Vite
        └── src/
            ├── config.js          # URL de la API
            ├── utils.js           # Funciones reutilizables
            ├── css/style.css      # Diseño dark mode
            └── js/app.js          # Lógica CRUD completa
```

---

## 📊 Tecnologías

| Capa | Tecnología |
|------|-----------|
| Frontend | HTML5, CSS3, JavaScript ES6, Vite |
| Backend | Java 17, Spring Boot 3.2, Spring Data JPA |
| Base de datos | PostgreSQL 18 |
| ORM | Hibernate 6 |
| Docs API | Springdoc OpenAPI / Swagger |

---

## 🚀 Inicio Rápido

### 1. Clonar la rama Backend
```bash
git clone -b BACKEND https://github.com/sangel3232/shopping-car.git backend
cd backend
mvn spring-boot:run
```
API disponible en: `http://127.0.0.1:9000/shopping-car/api`

### 2. Clonar la rama Frontend
```bash
git clone -b FRONTEND https://github.com/sangel3232/shopping-car.git frontend
cd frontend
npm install
npm run dev
```
Aplicación disponible en: `http://localhost:5173`

---

## 🔧 Configuración

### Backend — `application.properties`
```properties
server.servlet.context-path=/shopping-car
server.port=9000
spring.datasource.url=jdbc:postgresql://127.0.0.1:5432/distribuidos
spring.datasource.username=postgres
spring.datasource.password=1234
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
```

### Frontend — `src/config.js`
```javascript
baseUrl: 'http://127.0.0.1:9000/shopping-car/api'
```

---

## 💾 Base de Datos

Crear desde pgAdmin antes de iniciar el backend:
```sql
CREATE DATABASE distribuidos;
```

Las tablas se crean automáticamente con JPA:

| Tabla | Descripción |
|-------|-------------|
| `cliente` | Clientes registrados |
| `producto` | Catálogo de accesorios de ropa |
| `factura` | Facturas de venta |
| `detalle_factura` | Líneas de detalle por factura |

---

## 🌐 API REST

| Recurso | GET | POST | PUT | DELETE |
|---------|-----|------|-----|--------|
| `/api/cliente` | ✅ | ✅ | ✅ | ✅ |
| `/api/producto` | ✅ | ✅ | ✅ | ✅ |
| `/api/factura` | ✅ | ✅ | ✅ | ✅ |
| `/api/detalleFactura` | ✅ | ✅ | ✅ | ✅ |

### Swagger UI
```
http://127.0.0.1:9000/shopping-car/swagger-ui/index.html
```

---

## 📈 Características del Sistema

✅ Dashboard con contadores en tiempo real
✅ CRUD completo para las 4 entidades
✅ Diseño dark mode responsive (desktop y móvil)
✅ Cálculo automático de IVA y descuentos
✅ Auto-completado de precio al seleccionar producto
✅ Notificaciones toast en cada acción
✅ Confirmación modal antes de eliminar
✅ Indicador de estado de la API
✅ Documentación Swagger integrada
✅ Frontend y Backend completamente independientes

---

## 🔗 Relaciones del Modelo

```
Cliente (1) ──────── (n) Factura
Factura (1) ──────── (n) DetalleFactura
Producto (1) ─────── (n) DetalleFactura
```

---

## 📚 Documentación Detallada

- Rama `BACKEND` → ver `backend/README.md` para guía completa del API
- Rama `FRONTEND` → ver `frontend/README.md` para guía completa del cliente web

---

**Versión**: 1.0.0 | **Última actualización**: Abril 2026
