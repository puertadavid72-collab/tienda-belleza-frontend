import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Producto } from './producto.model';
import { CarritoService } from '../services/carrito';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.css']
})
export class ProductCardComponent implements OnInit {
  @Input() producto!: Producto;

  varianteSeleccionada: any = null;
  imagenRota = false;

  constructor(private carritoService: CarritoService) {}

  ngOnInit() {
    const variantes = this.producto.variantes || [];
    this.varianteSeleccionada = variantes.find(v => v.stock > 0) || variantes[0] || null;
  }

  get imagenActual(): string {
    return this.varianteSeleccionada?.imagen || this.producto.imagen || '';
  }

  seleccionarVariante(v: any) {
    this.varianteSeleccionada = v;
    this.imagenRota = false;
  }

  etiqueta(v: any): string {
    const variantes = this.producto.variantes || [];
    const iguales = variantes.filter(x => x.color === v.color);
    if (iguales.length <= 1) return v.color;
    return v.color + ' (' + (iguales.indexOf(v) + 1) + ')';
  }

  comprarProducto(producto: Producto) {
    if (!this.varianteSeleccionada) {
      alert('Este producto todavía no tiene colores disponibles');
      return;
    }
    const etiqueta = this.etiqueta(this.varianteSeleccionada);
    this.carritoService.agregarVariante(this.varianteSeleccionada.id, 1).subscribe({
      next: () => alert('¡Se agregó ' + producto.nombre + ' (' + etiqueta + ') al carrito!'),
      error: (err) => alert(err.error?.error || 'No se pudo agregar al carrito. Intenta de nuevo.')
    });
  }
}