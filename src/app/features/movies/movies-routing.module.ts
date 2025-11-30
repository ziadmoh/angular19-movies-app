import { Routes } from '@angular/router';
import { movieResolver } from './resolvers/movie.resolver';

export const moviesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./movie-list/movie-list.component').then(m => m.MovieListComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./movie-detail/movie-detail.component').then(m => m.MovieDetailComponent),
    resolve: {
      movie: movieResolver
    }
  }
];

