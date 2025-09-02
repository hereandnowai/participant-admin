import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../environments/environment';

/**
 * HTTP Interceptor that adds API authentication headers to all requests
 * Adds the API key header as specified in environment configuration
 */
export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  // Only add headers for API requests
  if (req.url.includes(environment.apiBaseUrl)) {
    const authReq = req.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        [environment.apiKeyHeaderName]: environment.apiKeyValue
      }
    });
    return next(authReq);
  }
  
  return next(req);
};
