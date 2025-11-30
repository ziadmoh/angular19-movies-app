import { inject } from '@angular/core';
import { ResolveFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MovieDetail } from '../../../shared/interfaces/movie.interface';
import { MovieService } from '../services/movie.service';

export const movieResolver: ResolveFn<MovieDetail> = (route: ActivatedRouteSnapshot): Observable<MovieDetail> => {
  const movieService = inject(MovieService);
  const router = inject(Router);
  const id = Number(route.paramMap.get('id'));
  
  return movieService.getMovieById(id).pipe(
    catchError((error) => {
      // If movie not found (404) or invalid ID, navigate to 404 page
      if (error.status === 404 || !id || isNaN(id)) {
        router.navigate(['/404']);
        return throwError(() => error);
      }
      // For other errors, re-throw
      return throwError(() => error);
    })
  );
};

