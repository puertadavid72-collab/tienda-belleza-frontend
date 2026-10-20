# Tienda de Belleza – Front-end

Front-end en **Angular** de una plataforma de comercio electrónico para una tienda de belleza real, con catálogo público, carrito de compras y panel administrativo.

🔗 **Backend (API REST):** [tienda-belleza](https://github.com/puertadavid72-collab/tienda-belleza)

## Funcionalidades

- **Catálogo público** de productos reales (más de 370 productos y 400 variantes), con filtro por categoría.
- **Carrito de compras** sin necesidad de crear cuenta.
- **Panel administrativo** con CRUD de categorías, marcas y productos.
- **Inicio de sesión** del administrador con JWT, rutas protegidas con guard e interceptor que agrega el token automáticamente.
- Contacto con la tienda por **WhatsApp**.

## Tecnologías

- Angular (componentes standalone, SSR)
- TypeScript
- HttpClient, RxJS (Observables, BehaviorSubject, async pipe)
- HTML y CSS

## Cómo ejecutarlo

1. Tener corriendo la API del [backend](https://github.com/puertadavid72-collab/tienda-belleza) en `http://localhost:3000`.
2. Instalar dependencias: `npm install`
3. Iniciar el servidor de desarrollo: `ng serve`
4. Abrir `http://localhost:4200` en el navegador.

## Estado del proyecto

Front-end conectado a la API. Pendiente: despliegue en producción, gestión de colores y variantes desde el panel, y pasarela de pagos.

## Autor

Diego David Muñetón Puerta – Estudiante de Tecnología en Desarrollo de Software, Politécnico Internacional.