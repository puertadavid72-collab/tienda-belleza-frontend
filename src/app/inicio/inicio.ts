import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Footer } from '../footer/footer';
import { Categoria } from '../services/categoria';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink, Footer, CommonModule],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio {
  categorias$: Observable<any[]>;

  constructor(private categoriaService: Categoria) {
    this.categorias$ = this.categoriaService.obtenerCategorias();
  }

  scrollCards(container: HTMLElement, distance: number) {
    container.scrollBy({ left: distance, behavior: 'smooth' });
  }
}




