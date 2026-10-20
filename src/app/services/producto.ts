import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Producto {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  obtenerProductos(categoriaId?: number, buscar?: string): Observable<any[]> {
    let params = new HttpParams();
    if (categoriaId) params = params.set('categoria_id', categoriaId);
    if (buscar) params = params.set('buscar', buscar);
    return this.http.get<any[]>(`${this.apiUrl}/productos`, { params });
  }

  obtenerProductoPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/productos/${id}`);
  }

  obtenerProductoCompleto(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/productos/${id}/completo`);
  }
}
