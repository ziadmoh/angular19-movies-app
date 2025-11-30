import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { MovieListResponse } from '@shared/interfaces/movie.interface';
import { MovieDetail } from '@shared/interfaces/movie.interface';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private http = inject(HttpClient);
  private apiUrl = environment.tmdbApiUrl;
  private apiKey = environment.tmdbApiKey;

  getPopularMovies(page: number = 1): Observable<MovieListResponse> {
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('page', page.toString());

    return this.http.get<MovieListResponse>(`${this.apiUrl}/movie/popular`, { params });
  }

  getTopRatedMovies(page: number = 1): Observable<MovieListResponse> {
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('page', page.toString());

    return this.http.get<MovieListResponse>(`${this.apiUrl}/movie/top_rated`, { params });
  }

  getMovieById(id: number): Observable<MovieDetail> {
    const params = new HttpParams().set('api_key', this.apiKey);
    return this.http.get<MovieDetail>(`${this.apiUrl}/movie/${id}`, { params });
  }

  searchMovies(query: string, page: number = 1): Observable<MovieListResponse> {
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('query', query)
      .set('page', page.toString());

    return this.http.get<MovieListResponse>(`${this.apiUrl}/search/movie`, { params });
  }
}

