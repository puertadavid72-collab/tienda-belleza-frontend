import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private apiUrl = environment.apiUrl;
  private sesionId: string = '';
  private carritoId: number | null = null;
  private esNavegador: boolean;

  private cantidadItemsSubject = new BehaviorSubject<number>(0);
  cantidadItems$ = this.cantidadItemsSubject.asObservable();

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) platformId: Object) {
    this.esNavegador = isPlatformBrowser(platformId);
    if (this.esNavegador) {
      this.sesionId = this.obtenerOCrearSesionId();
      this.inicializarCarrito();
    }
  }

  private obtenerOCrearSesionId(): string {
    let id = localStorage.getItem('sesion_id');
    if (!id) {
      id = 'sesion-' + this.idAleatorio();
      localStorage.setItem('sesion_id', id);
    }
    return id;
  }

  // Identificador imposible de adivinar: es la "llave" del carrito ante la API
  private idAleatorio(): string {
    if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
  }

  // La API solo deja modificar ítems del carrito de esta sesión
  private get conSesion() {
    return { headers: new HttpHeaders({ 'X-Sesion-Id': this.sesionId }) };
  }

  private inicializarCarrito(): void {
    this.http.post<any>(`${this.apiUrl}/carritos`, { sesion_id: this.sesionId })
      .subscribe(carrito => {
        this.carritoId = carrito.id;
        this.actualizarContador();
      });
  }

  obtenerCarrito(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/carritos/${this.sesionId}`);
  }

  agregarProducto(productoId: number, cantidad: number = 1): void {
    this.http.get<any>(`${this.apiUrl}/productos/${productoId}/completo`).subscribe(producto => {
      if (!producto.variantes || producto.variantes.length === 0) {
        alert('Este producto no tiene variantes disponibles todavía');
        return;
      }
      const varianteId = producto.variantes[0].id;
      this.http.post<any>(`${this.apiUrl}/detalle-carrito`, {
        carrito_id: this.carritoId,
        variante_id: varianteId,
        cantidad
      }, this.conSesion).subscribe(() => this.actualizarContador());
    });

  }
  // Devuelve el Observable para que quien llama sepa si se agregó o si no había stock
  agregarVariante(varianteId: number, cantidad: number = 1): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/detalle-carrito`, {
      carrito_id: this.carritoId,
      variante_id: varianteId,
      cantidad
    }, this.conSesion).pipe(tap(() => this.actualizarContador()));
  }
  actualizarCantidad(itemId: number, cantidad: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/detalle-carrito/${itemId}`, { cantidad }, this.conSesion);
  }

  eliminarItem(itemId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/detalle-carrito/${itemId}`, this.conSesion);
  }

  vaciarCarrito(): void {
    this.obtenerCarrito().subscribe(data => {
      data.items.forEach((item: any) => {
        this.eliminarItem(item.id).subscribe();
      });
      setTimeout(() => this.actualizarContador(), 300);
    });
  }

  actualizarContador(): void {
    this.obtenerCarrito().subscribe(data => {
      const total = data.items.reduce((suma: number, item: any) => suma + item.cantidad, 0);
      this.cantidadItemsSubject.next(total);
    });
  }
}