import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Angular Material Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';

// Components
import { MovieListComponent } from './movie-list/movie-list.component';
import { MovieDetailComponent } from './movie-detail/movie-detail.component';

// Standalone Components (imported)
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card.component';
import { HeroBannerComponent } from '../../layout/hero-banner/hero-banner.component';

// Routing
import { MoviesRoutingModule } from './movies-routing.module';

@NgModule({
  declarations: [
    MovieListComponent,
    MovieDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    // Angular Material
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    // Standalone components
    MovieCardComponent,
    HeroBannerComponent,
    // Routing (exports RouterModule)
    MoviesRoutingModule
  ]
})
export class MoviesModule { }

