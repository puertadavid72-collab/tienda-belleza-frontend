import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CarritoService } from '../services/carrito';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css'
})
export class Carrito implements OnInit {
  carrito$!: Observable<any>;

  mostrarModal: boolean = false;
  productoSeleccionado: any = null;
  tonoSeleccionadoIndex: number = 0;

  constructor(public carritoService: CarritoService) {}

  ngOnInit() {
    this.carrito$ = this.carritoService.obtenerCarrito();
  }

  recargarCarrito() {
    this.carrito$ = this.carritoService.obtenerCarrito();
  }

  calcularTotal(items: any[]): number {
    return items.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  }

  aumentarCantidad(item: any) {
    this.carritoService.actualizarCantidad(item.id, item.cantidad + 1).subscribe({
      next: () => {
        this.recargarCarrito();
        this.carritoService.actualizarContador();
      },
      error: (err) => alert(err.error?.error || 'No se pudo cambiar la cantidad. Intenta de nuevo.')
    });
  }

  disminuirCantidad(item: any) {
    if (item.cantidad > 1) {
      this.carritoService.actualizarCantidad(item.id, item.cantidad - 1).subscribe(() => {
        this.recargarCarrito();
        this.carritoService.actualizarContador();
      });
    }
  }

  eliminarProducto(item: any) {
    this.carritoService.eliminarItem(item.id).subscribe(() => {
      this.recargarCarrito();
      this.carritoService.actualizarContador();
    });
  }

  // El pedido se confirma por WhatsApp: abre el chat de la tienda con el resumen listo para enviar
  finalizarCompra(items: any[]) {
    const pesos = (valor: number) => '$' + Number(valor).toLocaleString('es-CO');
    const lineas = items.map(item =>
      `• ${item.producto} (${item.color}) x${item.cantidad}: ${pesos(item.precio * item.cantidad)}`
    );
    const mensaje = [
      '¡Hola Lúa! Quiero hacer este pedido:',
      '',
      ...lineas,
      '',
      `Total: ${pesos(this.calcularTotal(items))}`
    ].join('\n');

    window.open(`https://wa.me/${environment.whatsapp}?text=${encodeURIComponent(mensaje)}`, '_blank', 'noopener');
  }

  vaciarCarrito(): void {
    this.carritoService.vaciarCarrito();
    setTimeout(() => this.recargarCarrito(), 400);
  }
  abrirVistaPrevia(item: any) {
    this.productoSeleccionado = item;
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.productoSeleccionado = null;
  }
}