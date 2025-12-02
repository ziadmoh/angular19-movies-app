import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { MovieDetail } from '@shared/interfaces/movie.interface';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrl: './movie-detail.component.scss',
  standalone: false,
})
export class MovieDetailComponent {
  private route = inject(ActivatedRoute);
  
  // Convert route data observable to signal
  private routeData = toSignal(
    this.route.data.pipe(map(data => data['movie'] as MovieDetail | null)),
    { initialValue: null }
  );
  
  movie = this.routeData;

  // Computed signals for URLs
  posterUrl = computed(() => {
    const currentMovie = this.movie();
    if (currentMovie?.poster_path) {
      return `${environment.tmdbImageUrl}${currentMovie.poster_path}`;
    }
    return 'https://placehold.co/300x450?text=No+Image';
  });

  backdropUrl = computed(() => {
    const currentMovie = this.movie();
    if (currentMovie?.backdrop_path) {
      return `${environment.tmdbBackdropUrl}${currentMovie.backdrop_path}`;
    }
    return '';
  });
}

