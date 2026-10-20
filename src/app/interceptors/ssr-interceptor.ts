import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';

// Cuando Angular renderiza en el servidor, todas las visitas consultan la API
// desde la misma IP. Esta clave (variable de entorno SSR_API_KEY, igual en ambos
// servidores) le indica a la API que no aplique el límite de peticiones.
// Solo se lee en el servidor: nunca llega al navegador.
export const ssrInterceptor: HttpInterceptorFn = (req, next) => {
  if (!isPlatformServer(inject(PLATFORM_ID))) return next(req);

  const clave = (globalThis as any).process?.env?.['SSR_API_KEY'];
  if (!clave) return next(req);

  return next(req.clone({ setHeaders: { 'X-Clave-SSR': clave } }));
};
