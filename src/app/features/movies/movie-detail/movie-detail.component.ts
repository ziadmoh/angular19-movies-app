import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MovieDetail } from '../../../shared/interfaces/movie.interface';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [
    CommonModule,
    DecimalPipe,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule
  ],
  templateUrl: './movie-detail.component.html',
  styleUrl: './movie-detail.component.scss'
})
export class MovieDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  
  movie: MovieDetail | null = null;

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.movie = data['movie'];
    });
  }

  get posterUrl(): string {
    if (this.movie?.poster_path) {
      return `${environment.tmdbImageUrl}${this.movie.poster_path}`;
    }
    return 'https://placehold.co/300x450?text=No+Image';
  }

  get backdropUrl(): string {
    if (this.movie?.backdrop_path) {
      return `${environment.tmdbBackdropUrl}${this.movie.backdrop_path}`;
    }
    return '';
  }
}

