import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email: string = '';
  contrasena: string = '';
  mensajeError: string = '';
  cargando: boolean = false;

  constructor(private authService: Auth, private router: Router) {}

  iniciarSesion() {
  this.mensajeError = '';
  this.cargando = true;
  
  

    this.authService.login(this.email, this.contrasena).subscribe({
      next: () => {
        this.cargando = false;
        this.router.navigate(['/admin']);
      },
      error: (err) => {
        this.cargando = false;
        this.mensajeError = 'Correo o contraseña incorrectos';
      }
    });
  }
}