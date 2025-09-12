# Entrega final
Entrega final del curso - Programación Backend I: Desarrollo Avanzado de Backend #76500

## 🎯 Objetivos de la entrega

Desarrollar un servidor que contenga los endpoints, vistas y servicios necesarios para gestionar productos y carrito de compra.

## 🖥️ Desarrollo del Servidor
El servidor está basado en Node.js y Express, escuchando en el puerto 8080. Se disponen de dos grupos principales de rutas:

/products

/carts

Estos endpoints están implementados mediante el router de Express y cuentan con las siguientes características:
- MongoDB como sistema de persistencia principal.
- Todos los endpoints necesarios para trabajar con productos y carritos están definidos y funcionales.
- Se utiliza Handlebars como motor de plantillas para las vistas.
- Se implementa WebSocket (Socket.io) para comunicación en tiempo real entre cliente y servidor.

# 📍 API

La API estará disponible en `http://localhost:8080` con los siguientes endpoints:

### Productos
- `GET /api/products?param=value` - Obtener todos los productos -- Se pueden utilizar filtros de busqueda por parametros(sort [asc, desc], page, status[true, false], category["Alimentos", "Bebidas", "Higiene", "Limpieza", "Cosmetica", "Ropa", "Juguetes"], limit).
- `POST /api/products/` - Crear un nuevo producto.
- `GET /api/products/:id` - Obtener un producto por ID.
- `PUT /api/products/:id` - Actualizar producto.
- `DELETE /api/products/:id` - Eliminar un producto.

### Carrito
- `GET /api/carts/:id` - Obtener productos de un carrito.
- `POST /api/carts/` -  Crear un carrito vacío.
- `POST /api/carts/:cid/product/:pid?quantity=` - Agregar un producto a un carrito --- Se puede agregar cantidad de productos.
- `PUT /api/carts/:id` - Reescribir un carrito.
- `DELETE /api/carts/:cid/product/:pid?quantity=` - Agregar un producto a un carrito --- Se puede agregar cantidad de productos a eliminar.
- `DELETE /api/carts/:id` - Vaciar un carrito.

# 🛒 Vistas
Las vistas estarán disponibles en `http://localhost:8080/views` con los siguientes endpoints:
- `realTimeProducts /realTimeProducts` - Formulario CRUD en tiempo real utilizando websockets + HTTP.
- `home /home` - Listado en tiempo real de todos los productos ingresados con su respectiva descripción, paginado y ordenamiento. Además la vista cuenta con un el botón "+" para añadir el producto al carrito y un pequeño carrito de compras para visualizar cantidad de productos, total y un botón de ver carrito.
- `cart /cart` - Listado de todos los productos añadidos al carrito.

## Build
```bash
npm run build
```

## Seed de productos
```bash
npm run seed
```

## Ejecución
```bash
npm run start
```