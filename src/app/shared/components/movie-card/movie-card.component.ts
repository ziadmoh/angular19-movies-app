import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Movie } from '../../interfaces/movie.interface';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss'
})
export class MovieCardComponent {
  @Input() movie!: Movie;

  get posterUrl(): string {
    if (this.movie.poster_path) {
      return `${environment.tmdbImageUrl}${this.movie.poster_path}`;
    }
    return 'https://placehold.co/300x450?text=No+Image';
  }

  get hoverPosterUrl(): string {
    if (this.movie.backdrop_path) {
      return `${environment.tmdbBackdropUrl}${this.movie.backdrop_path}`;
    }
    if (this.movie.poster_path) {
      return `${environment.tmdbImageUrl}${this.movie.poster_path}`;
    }
    return 'https://placehold.co/300x450?text=No+Image';
  }
}

