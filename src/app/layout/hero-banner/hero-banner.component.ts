import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { animate, style, transition, trigger } from '@angular/animations';
import { MovieDetail } from '@shared/interfaces/movie.interface';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-hero-banner',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule],
  templateUrl: './hero-banner.component.html',
  styleUrl: './hero-banner.component.scss',
  animations: [
    trigger('fadeZoom', [
      transition('* => *', [
        style({ opacity: 0, transform: 'scale(1.03)' }),
        animate('800ms ease-in-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class HeroBannerComponent {
  @Input() movie: MovieDetail | null = null;
  
  get backdropUrl(): string {
    if (this.movie?.backdrop_path) {
      return `${environment.tmdbBackdropUrl}${this.movie.backdrop_path}`;
    }
    return '';
  }
}

