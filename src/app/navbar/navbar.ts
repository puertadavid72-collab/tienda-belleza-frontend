import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../services/carrito';
import { Router, RouterLink } from '@angular/router'; // <--- Cambiamos a RouterLink

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink], // <--- Lo ponemos aquí también
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  constructor(public carritoService: CarritoService, private router: Router) {}

  // Lleva al catálogo filtrado: /catalogo?buscar=texto (vacío = catálogo completo)
  buscar(evento: Event, texto: string) {
    evento.preventDefault();
    const termino = texto.trim();
    this.router.navigate(['/catalogo'], { queryParams: termino ? { buscar: termino } : {} });
  }
}
