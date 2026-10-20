import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './navbar/navbar';
import { ProductCardComponent } from './product-card/product-card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, ProductCardComponent, CommonModule], // <--- ¡Asegúrate de incluirlo aquí!
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  title = 'Lúa'; // Esto seguramente ya estaba ahí, déjalo.

}
