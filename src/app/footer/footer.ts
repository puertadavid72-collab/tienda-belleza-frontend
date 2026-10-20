import { Component } from '@angular/core'; // <--- ¡Agrega esta línea arriba del todo!
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink], // <--- ¡Aquí debe estar RouterLink!
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer { }