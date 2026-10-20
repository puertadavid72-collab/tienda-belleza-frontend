import { Routes } from '@angular/router';
import { Inicio } from './inicio/inicio';
import { Catalogo } from './catalogo/catalogo';
import { Nosotros } from './nosotros/nosotros';
import { Carrito } from './carrito/carrito';
import { Login } from './login/login';
import { Admin } from './admin/admin';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', component: Inicio, pathMatch: 'full' }, 
  { path: 'catalogo', component: Catalogo },
  { path: 'nosotros', component: Nosotros },
  { path: 'carrito', component: Carrito },
  { path: 'inicio', component: Inicio },
  { path: 'login', component: Login },
  { path: 'admin', component: Admin, canActivate: [authGuard] }
];