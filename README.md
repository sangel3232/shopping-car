# Frontend - Shopping Car

SPA (Single Page Application) en HTML/CSS/JS puro con arquitectura modular.

## Estructura

```
frontend/
├── index.html              # Entrada principal con todos los modales
├── package.json            # Config Vite (servidor de desarrollo)
├── src/
│   ├── config.js           # URL de la API y helper fetch
│   ├── utils.js            # Funciones reutilizables (toast, modal, formato)
│   ├── css/
│   │   └── style.css       # Estilos dark mode completos
│   └── js/
│       └── app.js          # Lógica CRUD de todos los módulos
└── README.md
```

## Módulos

- **Dashboard** — Contadores en tiempo real
- **Clientes** — CRUD completo
- **Productos** — CRUD completo (accesorios de ropa)
- **Facturas** — CRUD con selector de cliente
- **Detalle Factura** — CRUD con autocálculo de totales (descuento, IVA, neto)

## Cómo correr

```bash
cd frontend
npm install
npm run dev
```

Abre: `http://localhost:5173`

## Requisitos

El backend debe estar corriendo en `http://127.0.0.1:9000/shopping-car`

Ver instrucciones en `../backend/README.md`
