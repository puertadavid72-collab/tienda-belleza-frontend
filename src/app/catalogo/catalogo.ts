import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductCardComponent } from '../product-card/product-card';
import { Producto } from '../services/producto';
import { Observable, map, switchMap } from 'rxjs';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css',
  imports: [CommonModule, ProductCardComponent, RouterLink]
})
export class Catalogo {
  productos$: Observable<any[]>;
  // Texto buscado desde el navbar (?buscar=...), para mostrarlo en el encabezado
  busqueda$: Observable<string>;

  constructor(private productoService: Producto, private route: ActivatedRoute) {
    this.busqueda$ = this.route.queryParams.pipe(
      map(params => String(params['buscar'] || '').trim())
    );

    this.productos$ = this.route.queryParams.pipe(
      switchMap(params => {
        const categoriaId = params['categoria_id'] ? Number(params['categoria_id']) : undefined;
        const buscar = String(params['buscar'] || '').trim() || undefined;
        return this.productoService.obtenerProductos(categoriaId, buscar);
      })
    );
  }
}
