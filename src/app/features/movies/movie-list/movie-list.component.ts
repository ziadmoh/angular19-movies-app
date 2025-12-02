import { Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { MovieService } from '@features/movies/services/movie.service';
import { Movie } from '@shared/interfaces/movie.interface';
import { MovieDetail } from '@shared/interfaces/movie.interface';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrl: './movie-list.component.scss',
  standalone: false
})
export class MovieListComponent {
  private movieService = inject(MovieService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  // Convert route queryParams to signal
  private routeQueryParams = toSignal(
    this.route.queryParams.pipe(map(params => params['search'] || '')),
    { initialValue: '' }
  );

  // Component state as signals
  popularMovies = signal<Movie[]>([]);
  topRatedMovies = signal<Movie[]>([]);
  featuredMovie = signal<MovieDetail | null>(null);
  isLoading = signal<boolean>(false);
  private featuredIndex = signal<number>(0);
  private rotationInterval?: ReturnType<typeof setInterval>;

  // Computed signal for search query
  searchQuery = this.routeQueryParams;

  constructor() {
    // Effect to watch for search query changes
    effect(() => {
      const query = this.searchQuery();
      if (query) {
        this.searchMovies(query);
      } else {
        this.loadMovies();
      }
    });
  }

  loadMovies(): void {
    this.isLoading.set(true);
    
    this.movieService.getPopularMovies().subscribe({
      next: (response) => {
        this.popularMovies.set(response.results);
        if (response.results.length > 0) {
          const randomIndex = Math.floor(Math.random() * response.results.length);
          this.featuredIndex.set(randomIndex);
          this.loadFeaturedMovie(response.results[randomIndex].id);
          this.startHeroRotation();
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.notificationService.showError('Failed to load popular movies. Please try again later.');
      }
    });

    this.movieService.getTopRatedMovies().subscribe({
      next: (response) => {
        this.topRatedMovies.set(response.results);
      },
      error: () => {
        this.notificationService.showError('Failed to load top rated movies.');
      }
    });
  }

  private startHeroRotation(): void {
    if (!this.popularMovies().length) {
      return;
    }

    // Clear existing interval
    if (this.rotationInterval) {
      clearInterval(this.rotationInterval);
    }

    this.rotationInterval = setInterval(() => {
      const movies = this.popularMovies();
      const query = this.searchQuery();
      if (!movies.length || query) {
        return;
      }
      const currentIndex = this.featuredIndex();
      const nextIndex = (currentIndex + 1) % movies.length;
      this.featuredIndex.set(nextIndex);
      this.loadFeaturedMovie(movies[nextIndex].id);
    }, 8000);
  }

  loadFeaturedMovie(id: number): void {
    this.movieService.getMovieById(id).subscribe({
      next: (movie) => {
        this.featuredMovie.set(movie);
      },
      error: () => {
        // Silently fail for featured movie to avoid too many notifications
      }
    });
  }

  searchMovies(query: string): void {
    if (!query.trim()) {
      this.loadMovies();
      return;
    }

    // Stop rotating hero when searching
    if (this.rotationInterval) {
      clearInterval(this.rotationInterval);
      this.rotationInterval = undefined;
    }

    this.isLoading.set(true);
    this.movieService.searchMovies(query).subscribe({
      next: (response) => {
        this.popularMovies.set(response.results);
        this.topRatedMovies.set([]);
        this.featuredMovie.set(null);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.notificationService.showError('Search failed. Please try again.');
      }
    });
  }

  onSearch(): void {
    const query = this.searchQuery();
    if (query.trim()) {
      this.router.navigate(['/movies'], { queryParams: { search: query } });
    } else {
      this.router.navigate(['/movies']);
    }
  }
}

