import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private apiUrl = environment.apiUrl;
  private esNavegador: boolean;

  constructor(private http: HttpClient, private router: Router, @Inject(PLATFORM_ID) platformId: Object) {
    this.esNavegador = isPlatformBrowser(platformId);
  }

  login(email: string, contrasena: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/usuarios/login`, { email, contrasena }).pipe(
      tap(respuesta => {
        if (this.esNavegador) {
          localStorage.setItem('token', respuesta.token);
          localStorage.setItem('usuario', JSON.stringify(respuesta.usuario));
        }
      })
    );
  }

  logout(): void {
    if (this.esNavegador) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
    }
    this.router.navigate(['/login']);
  }

  obtenerToken(): string | null {
    return this.esNavegador ? localStorage.getItem('token') : null;
  }

  estaLogueado(): boolean {
    return !!this.obtenerToken();
  }
}