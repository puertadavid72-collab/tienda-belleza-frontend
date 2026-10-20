import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Páginas con datos de la API: se renderizan en cada visita para mostrar
  // siempre los productos y categorías actuales (y que Google las lea).
  { path: '', renderMode: RenderMode.Server },
  { path: 'inicio', renderMode: RenderMode.Server },
  { path: 'catalogo', renderMode: RenderMode.Server },

  // Contenido fijo: se genera una sola vez al compilar.
  { path: 'nosotros', renderMode: RenderMode.Prerender },

  // Páginas de cada persona (carrito en el navegador, sesión del admin):
  // no tiene sentido renderizarlas en el servidor.
  { path: 'carrito', renderMode: RenderMode.Client },
  { path: 'login', renderMode: RenderMode.Client },
  { path: 'admin', renderMode: RenderMode.Client },

  { path: '**', renderMode: RenderMode.Server }
];
