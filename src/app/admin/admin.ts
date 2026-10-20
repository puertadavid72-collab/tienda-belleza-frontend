import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Auth } from '../services/auth';
import { Observable, BehaviorSubject, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit {
  private apiUrl = environment.apiUrl;

  // --- Categorias ---
  private recargarCategoriasSubject = new BehaviorSubject<void>(undefined);
  categorias$!: Observable<any[]>;
  nuevaCategoria = { nombre: '', imagen: '' };
  categoriaEditando: any = null;

  // --- Marcas ---
  private recargarMarcasSubject = new BehaviorSubject<void>(undefined);
  marcas$!: Observable<any[]>;
  nuevaMarca = { nombre: '' };
  marcaEditando: any = null;

  // --- Productos ---
  private recargarProductosSubject = new BehaviorSubject<void>(undefined);
  productos$!: Observable<any[]>;
  nuevoProducto: any = { nombre: '', descripcion: '', precio: null, categoria_id: null, marca_id: null };
  productoEditando: any = null;

  constructor(private http: HttpClient, public authService: Auth, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.categorias$ = this.recargarCategoriasSubject.pipe(
      switchMap(() => this.http.get<any[]>(`${this.apiUrl}/categorias`))
    );

    this.marcas$ = this.recargarMarcasSubject.pipe(
      switchMap(() => this.http.get<any[]>(`${this.apiUrl}/marcas`))
    );

    this.productos$ = this.recargarProductosSubject.pipe(
      switchMap(() => this.http.get<any[]>(`${this.apiUrl}/productos`))
    );
        this.colores$ = this.recargarColoresSubject.pipe(
      switchMap(() => this.http.get<any[]>(`${this.apiUrl}/colores`))
    );
  }

  // --- Métodos Categorías ---
  recargarCategorias() {
    this.recargarCategoriasSubject.next();
  }

  crearCategoria() {
    if (!this.nuevaCategoria.nombre) return;
    this.http.post<any>(`${this.apiUrl}/categorias`, this.nuevaCategoria).subscribe(() => {
      this.nuevaCategoria = { nombre: '', imagen: '' };
      this.recargarCategorias();
    });
  }

  editarCategoria(cat: any) {
    this.categoriaEditando = { ...cat };
  }

  guardarEdicionCategoria() {
    this.http.put<any>(`${this.apiUrl}/categorias/${this.categoriaEditando.id}`, this.categoriaEditando).subscribe(() => {
      this.categoriaEditando = null;
      this.recargarCategorias();
    });
  }

  cancelarEdicionCategoria() {
    this.categoriaEditando = null;
  }

  eliminarCategoria(id: number) {
    if (!confirm('¿Seguro que quieres eliminar esta categoría?')) return;
    this.http.delete<any>(`${this.apiUrl}/categorias/${id}`).subscribe({
      next: () => this.recargarCategorias(),
      error: (err) => alert('No se pudo eliminar: ' + (err.error?.error || 'error desconocido'))
    });
  }

  // --- Métodos Marcas ---
  recargarMarcas() {
    this.recargarMarcasSubject.next();
  }

  crearMarca() {
    if (!this.nuevaMarca.nombre) return;
    this.http.post<any>(`${this.apiUrl}/marcas`, this.nuevaMarca).subscribe(() => {
      this.nuevaMarca = { nombre: '' };
      this.recargarMarcas();
    });
  }

  editarMarca(m: any) {
    this.marcaEditando = { ...m };
  }

  guardarEdicionMarca() {
    this.http.put<any>(`${this.apiUrl}/marcas/${this.marcaEditando.id}`, this.marcaEditando).subscribe(() => {
      this.marcaEditando = null;
      this.recargarMarcas();
    });
  }

  cancelarEdicionMarca() {
    this.marcaEditando = null;
  }

  eliminarMarca(id: number) {
    if (!confirm('¿Seguro que quieres eliminar esta marca?')) return;
    this.http.delete<any>(`${this.apiUrl}/marcas/${id}`).subscribe({
      next: () => this.recargarMarcas(),
      error: (err) => alert('No se pudo eliminar: ' + (err.error?.error || 'error desconocido'))
    });
  }

    // --- Colores ---
  private recargarColoresSubject = new BehaviorSubject<void>(undefined);
  colores$!: Observable<any[]>;
  nuevoColor = { nombre: '', codigo_hex: '' };
  colorEditando: any = null;




    // --- Métodos Colores ---
  recargarColores() {
    this.recargarColoresSubject.next();
  }

  crearColor() {
    if (!this.nuevoColor.nombre) return;
    this.http.post<any>(`${this.apiUrl}/colores`, this.nuevoColor).subscribe(() => {
      this.nuevoColor = { nombre: '', codigo_hex: '' };
      this.recargarColores();
    });
  }

  editarColor(c: any) {
    this.colorEditando = { ...c };
  }

  guardarEdicionColor() {
    this.http.put<any>(`${this.apiUrl}/colores/${this.colorEditando.id}`, this.colorEditando).subscribe(() => {
      this.colorEditando = null;
      this.recargarColores();
    });
  }

  cancelarEdicionColor() {
    this.colorEditando = null;
  }

  eliminarColor(id: number) {
    if (!confirm('¿Seguro que quieres eliminar este color?')) return;
    this.http.delete<any>(`${this.apiUrl}/colores/${id}`).subscribe({
      next: () => this.recargarColores(),
      error: (err) => alert('No se pudo eliminar: ' + (err.error?.error || 'error desconocido'))
    });
  }

  // --- Variantes (modal) ---
  mostrarModalVariantes = false;
  productoSeleccionado: any = null;
  variantesDelProducto: any[] = [];
  nuevaVariante = { color_id: null, stock: 0 };
  subiendoVarianteId: number | null = null;


    // --- Métodos Variantes ---
  abrirModalVariantes(prod: any) {
    this.productoSeleccionado = prod;
    this.mostrarModalVariantes = true;
    this.cargarVariantes(prod.id);
  }

  cerrarModalVariantes() {
    this.mostrarModalVariantes = false;
    this.productoSeleccionado = null;
    this.variantesDelProducto = [];
    this.nuevaVariante = { color_id: null, stock: 0 };
  }

    cargarVariantes(productoId: number) {
    this.http.get<any>(`${this.apiUrl}/productos/${productoId}/completo`).subscribe(data => {
      this.variantesDelProducto = data.variantes || [];
      this.cdr.detectChanges();
    });
  }

  agregarVariante() {
    if (!this.nuevaVariante.color_id) {
      alert('Selecciona un color');
      return;
    }
    this.http.post<any>(`${this.apiUrl}/variantes`, {
      producto_id: this.productoSeleccionado.id,
      color_id: this.nuevaVariante.color_id,
      stock: this.nuevaVariante.stock
    }).subscribe(() => {
      this.nuevaVariante = { color_id: null, stock: 0 };
      this.cargarVariantes(this.productoSeleccionado.id);
    });
  }

  actualizarStockVariante(variante: any) {
    this.http.put<any>(`${this.apiUrl}/variantes/${variante.id}`, { stock: variante.stock }).subscribe(() => {
      this.cargarVariantes(this.productoSeleccionado.id);
    });
  }

  cambiarColorVariante(variante: any) {
    this.http.put<any>(`${this.apiUrl}/variantes/${variante.id}`, { color_id: Number(variante.color_id) }).subscribe(() => {
      this.cargarVariantes(this.productoSeleccionado.id);
    });
  }

  eliminarVariante(id: number) {
    if (!confirm('¿Eliminar esta variante de color?')) return;
    this.http.delete<any>(`${this.apiUrl}/variantes/${id}`).subscribe({
      next: () => this.cargarVariantes(this.productoSeleccionado.id),
      error: (err) => alert('No se pudo eliminar: ' + (err.error?.error || 'error desconocido'))
    });
  }

      subirFoto(variante: any, event: Event) {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0];
    if (!archivo) return;

    const formData = new FormData();
    formData.append('variante_id', String(variante.id));
    formData.append('imagen', archivo);

    this.subiendoVarianteId = variante.id;
    this.http.post<any>(`${this.apiUrl}/imagenes`, formData).subscribe({
      next: () => {
        this.subiendoVarianteId = null;
        input.value = '';
        this.cargarVariantes(this.productoSeleccionado.id);
      },
      error: (err) => {
        this.subiendoVarianteId = null;
        input.value = '';
        this.cdr.detectChanges();
        alert('No se pudo subir la foto: ' + (err.error?.error || 'error desconocido'));
      }
    });
  }



  // --- Métodos Productos ---
  recargarProductos() {
    this.recargarProductosSubject.next();
  }

  crearProducto() {
    if (!this.nuevoProducto.nombre || !this.nuevoProducto.precio || !this.nuevoProducto.categoria_id || !this.nuevoProducto.marca_id) {
      alert('Completa nombre, precio, categoría y marca');
      return;
    }
    this.http.post<any>(`${this.apiUrl}/productos`, this.nuevoProducto).subscribe(() => {
      this.nuevoProducto = { nombre: '', descripcion: '', precio: null, categoria_id: null, marca_id: null };
      this.recargarProductos();
    });
  }

  editarProducto(prod: any) {
    this.productoEditando = { ...prod };
  }

  guardarEdicionProducto() {
    this.http.put<any>(`${this.apiUrl}/productos/${this.productoEditando.id}`, this.productoEditando).subscribe(() => {
      this.productoEditando = null;
      this.recargarProductos();
    });
  }

  cancelarEdicionProducto() {
    this.productoEditando = null;
  }

  eliminarProducto(id: number) {
    if (!confirm('¿Seguro que quieres eliminar este producto?')) return;
    this.http.delete<any>(`${this.apiUrl}/productos/${id}`).subscribe({
      next: () => this.recargarProductos(),
      error: (err) => alert('No se pudo eliminar: ' + (err.error?.error || 'error desconocido'))
    });
  }

  cerrarSesion() {
    this.authService.logout();
  }
}