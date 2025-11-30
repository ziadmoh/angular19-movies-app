import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '@core/services/auth.service';
import { NotificationService } from '@core/services/notification.service';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const notificationService = inject(NotificationService);

  // Skip token for login and assets
  if (req.url.includes('/assets/') || req.url.includes('/login')) {
    return next(req);
  }

  const token = authService.getToken();
  let authReq = req;

  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/refresh')) {
        // Try to refresh token
        const refreshToken = authService.getRefreshToken();
        
        if (refreshToken) {
          return authService.refreshToken().pipe(
            switchMap((tokens) => {
              // Retry the original request with new token
              const retryReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${tokens.accessToken}`
                }
              });
              return next(retryReq);
            }),
            catchError((refreshError) => {
              // Refresh failed, logout
              notificationService.showError('Session expired. Please login again.');
              authService.logout();
              return throwError(() => refreshError);
            })
          );
        } else {
          notificationService.showError('Authentication required. Please login again.');
          authService.logout();
          return throwError(() => error);
        }
      }

      // Handle other HTTP errors
      if (error.status === 403) {
        notificationService.showError('Access forbidden. You don\'t have permission to access this resource.');
      } else if (error.status === 500) {
        notificationService.showError('Server error. Please try again later.');
      } else if (error.status === 0 || error.status === 504) {
        notificationService.showError('Network error. Please check your connection.');
      } else if (error.status >= 400 && error.status < 500) {
        notificationService.showError(`Request failed: ${error.message || 'Invalid request'}`);
      }

      return throwError(() => error);
    })
  );
};

