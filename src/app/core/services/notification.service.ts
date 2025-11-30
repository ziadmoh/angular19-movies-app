import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private snackBar = inject(MatSnackBar);
  
  private readonly defaultDuration = 4000;
  private readonly horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  private readonly verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  private getDefaultConfig(): MatSnackBarConfig {
    return {
      duration: this.defaultDuration,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: ['custom-snackbar']
    };
  }

  showError(message: string, duration?: number): void {
    const config = {
      ...this.getDefaultConfig(),
      duration: duration || this.defaultDuration,
      panelClass: ['custom-snackbar', 'error-snackbar']
    };
    
    this.snackBar.open(message, 'Close', config);
  }

  showSuccess(message: string, duration?: number): void {
    const config = {
      ...this.getDefaultConfig(),
      duration: duration || this.defaultDuration,
      panelClass: ['custom-snackbar', 'success-snackbar']
    };
    
    this.snackBar.open(message, 'Close', config);
  }

  showInfo(message: string, duration?: number): void {
    const config = {
      ...this.getDefaultConfig(),
      duration: duration || this.defaultDuration,
      panelClass: ['custom-snackbar', 'info-snackbar']
    };
    
    this.snackBar.open(message, 'Close', config);
  }
}

