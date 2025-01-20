// import { HttpInterceptorFn } from '@angular/common/http';
// import { inject } from '@angular/core';
// import { Router } from '@angular/router';
// import { catchError } from 'rxjs/operators';
// import { throwError } from 'rxjs';

// export const errorInterceptor: HttpInterceptorFn = (req, next) => {
//   const router = inject(Router);

//   return next(req).pipe(
//     catchError((error) => {
//       if (error.status === 401) {
//         // Handle unauthorized error
//         sessionStorage.removeItem('token'); // Clear token
//         router.navigate(['/admin/login']); // Redirect to login page
//       }
//       return throwError(() => error); // Re-throw the error for further handling
//     }),
//   );
// };
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        // Check if the request URL includes '/admin'
        if (req.url.includes('/admin')) {
          // Handle unauthorized error for admin routes
          sessionStorage.removeItem('token'); // Clear token
          router.navigate(['/admin/login']); // Redirect to admin login page
        } else {
          localStorage.removeItem('user');
          router.navigateByUrl('/login');
        }
      }
      return throwError(() => error); // Re-throw the error for further handling
    }),
  );
};
