import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../services/movie.service';
import { MovieCardComponent } from '../../../shared/components/movie-card/movie-card.component';
import { HeroBannerComponent } from '../../../layout/hero-banner/hero-banner.component';
import { Movie } from '../../../shared/interfaces/movie.interface';
import { MovieDetail } from '../../../shared/interfaces/movie.interface';
import { interval, Subscription } from 'rxjs';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    MovieCardComponent,
    HeroBannerComponent
  ],
  templateUrl: './movie-list.component.html',
  styleUrl: './movie-list.component.scss'
})
export class MovieListComponent implements OnInit, OnDestroy {
  private movieService = inject(MovieService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  popularMovies: Movie[] = [];
  topRatedMovies: Movie[] = [];
  featuredMovie: MovieDetail | null = null;
  searchQuery: string = '';
  isLoading: boolean = false;
  private featuredIndex = 0;
  private rotationSub?: Subscription;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['search'] || '';
      if (this.searchQuery) {
        this.searchMovies(this.searchQuery);
      } else {
        this.loadMovies();
      }
    });
  }

  ngOnDestroy(): void {
    this.rotationSub?.unsubscribe();
  }

  loadMovies(): void {
    this.isLoading = true;
    
    this.movieService.getPopularMovies().subscribe({
      next: (response) => {
        this.popularMovies = response.results;
        if (response.results.length > 0) {
          const randomIndex = Math.floor(Math.random() * response.results.length);
          this.featuredIndex = randomIndex;
          this.loadFeaturedMovie(response.results[randomIndex].id);
          this.startHeroRotation();
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.notificationService.showError('Failed to load popular movies. Please try again later.');
      }
    });

    this.movieService.getTopRatedMovies().subscribe({
      next: (response) => {
        this.topRatedMovies = response.results;
      },
      error: () => {
        this.notificationService.showError('Failed to load top rated movies.');
      }
    });
  }

  private startHeroRotation(): void {
    if (!this.popularMovies.length) {
      return;
    }

    this.rotationSub?.unsubscribe();

    this.rotationSub = interval(8000).subscribe(() => {
      if (!this.popularMovies.length || this.searchQuery) {
        return;
      }
      this.featuredIndex = (this.featuredIndex + 1) % this.popularMovies.length;
      const nextId = this.popularMovies[this.featuredIndex].id;
      this.loadFeaturedMovie(nextId);
    });
  }

  loadFeaturedMovie(id: number): void {
    this.movieService.getMovieById(id).subscribe({
      next: (movie) => {
        this.featuredMovie = movie;
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
    this.rotationSub?.unsubscribe();

    this.isLoading = true;
    this.movieService.searchMovies(query).subscribe({
      next: (response) => {
        this.popularMovies = response.results;
        this.topRatedMovies = [];
        this.featuredMovie = null;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.notificationService.showError('Search failed. Please try again.');
      }
    });
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/movies'], { queryParams: { search: this.searchQuery } });
    } else {
      this.router.navigate(['/movies']);
    }
  }
}

