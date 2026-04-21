# Backend - Shopping Car API

## 📋 Descripción

Backend de la aplicación Shopping Car construido con Spring Boot 3.2, JPA/Hibernate y PostgreSQL. Proporciona una API REST completa para gestionar clientes, productos, facturas y detalles.

## 🎯 Características

- **API REST completa**: CRUD para todas las entidades
- **Base de datos relacional**: PostgreSQL con JPA/Hibernate ORM
- **Documentación automática**: Swagger/OpenAPI integrado
- **CORS habilitado**: Permite requests desde cualquier origen
- **DevTools**: Hot reload durante desarrollo

## 📁 Estructura de Carpetas

```
backend/
├── pom.xml
├── src/
│   ├── main/
│   │   ├── java/com/corhuila/shoppingcar/
│   │   │   ├── ShoppingCarApplication.java
│   │   │   ├── Controller/
│   │   │   ├── Service/
│   │   │   ├── Entity/
│   │   │   ├── IRepository/
│   │   │   └── IService/
│   │   └── resources/
│   │       └── application.properties
│   └── test/
└── README.md
```

## 🚀 Instalación y Ejecución

### Requisitos
- JDK 17+
- Maven 3.6+
- PostgreSQL 15+
- pgAdmin (opcional, para gestión visual)

### 1. Crear Base de Datos
En pgAdmin o psql:
```sql
CREATE DATABASE distribuidos;
```

### 2. Configurar Conexión
Editar `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://127.0.0.1:5432/distribuidos
spring.datasource.username=postgres
spring.datasource.password=1234
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
```

### 3. Compilar y Ejecutar
```bash
cd backend
mvn spring-boot:run
```

El servidor estará disponible en: `http://127.0.0.1:9000/shopping-car`

## 📚 Endpoints de la API

### Clientes
- `GET    /api/cliente`       - Listar todos
- `GET    /api/cliente/{id}`  - Obtener uno
- `POST   /api/cliente`       - Crear
- `PUT    /api/cliente/{id}`  - Actualizar
- `DELETE /api/cliente/{id}`  - Eliminar

### Productos
- `GET    /api/producto`
- `POST   /api/producto`
- `PUT    /api/producto/{id}`
- `DELETE /api/producto/{id}`

### Facturas
- `GET    /api/factura`
- `POST   /api/factura`
- `PUT    /api/factura/{id}`
- `DELETE /api/factura/{id}`

### Detalles de Factura
- `GET    /api/detalleFactura`
- `POST   /api/detalleFactura`
- `PUT    /api/detalleFactura/{id}`
- `DELETE /api/detalleFactura/{id}`

## 📖 Documentación Swagger

```
http://127.0.0.1:9000/shopping-car/swagger-ui/index.html
```

## ⚙️ application.properties completo

```properties
server.servlet.context-path=/shopping-car
server.port=9000
spring.application.name=shopping-car

spring.datasource.url=jdbc:postgresql://127.0.0.1:5432/distribuidos
spring.datasource.username=postgres
spring.datasource.password=1234
spring.datasource.driver-class-name=org.postgresql.Driver

spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
```

## 🔗 Relaciones

```
Cliente (1) ──── (n) Factura
Factura (1) ──── (n) DetalleFactura
Producto (1) ──── (n) DetalleFactura
```

## 🐛 Solución de Problemas

### Error: `Connection refused`
Verificar que PostgreSQL esté corriendo en el puerto 5432.
Desde pgAdmin: verificar que el servidor esté activo.

### Error: `Access denied`
Verificar usuario y contraseña en `application.properties`.

### Error: `Database distribuidos doesn't exist`
Crear la base de datos desde pgAdmin:
- Clic derecho en Databases → Create → Database → `distribuidos`

## 📊 Testing Manual

```bash
# Listar clientes
curl http://127.0.0.1:9000/shopping-car/api/cliente

# Crear cliente
curl -X POST http://127.0.0.1:9000/shopping-car/api/cliente \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Juan","documento":"12345","metodoPago":"Efectivo"}'
```

Con Postman: base URL `http://127.0.0.1:9000/shopping-car`

---
**Última actualización**: Abril 2026
