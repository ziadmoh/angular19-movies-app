import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { movieResolver } from './resolvers/movie.resolver';
import { MovieListComponent } from './movie-list/movie-list.component';
import { MovieDetailComponent } from './movie-detail/movie-detail.component';

export const moviesRoutes: Routes = [
  {
    path: '',
    component: MovieListComponent
  },
  {
    path: ':id',
    component: MovieDetailComponent,
    resolve: {
      movie: movieResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(moviesRoutes)],
  exports: [RouterModule]
})
export class MoviesRoutingModule { }
