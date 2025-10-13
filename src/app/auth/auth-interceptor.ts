import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth-service';
import { catchError, switchMap, throwError } from 'rxjs';

let isRefreshing: boolean = false;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.token;

  if (!token) return next(req);

  if (isRefreshing) {
    return refreshAndProceed({ req, next, authService });
  }

  return next(addToken({ req, token })).pipe(
    catchError((error) => {
      if (error.status === 403) {
        return refreshAndProceed({ req, next, authService });
      }
      return throwError(error);
    }),
  );
};

const refreshAndProceed = ({
  req,
  next,
  authService,
}: {
  req: HttpRequest<any>;
  next: HttpHandlerFn;
  authService: AuthService;
}) => {
  if (!isRefreshing) {
    isRefreshing = true;
    return authService.refreshAuthToken().pipe(
      switchMap((res) => {
        isRefreshing = false;
        return next(addToken({ req, token: res.access_token }));
      }),
    );
  }
  return next(addToken({ req, token: authService.token! }));
};

const addToken = ({ req, token }: { req: HttpRequest<any>; token: string }) => {
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
};
