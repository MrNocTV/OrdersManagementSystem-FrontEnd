import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { TOKEN, AUTHENTICATED_USER } from 'src/app/app.constants';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    let basicAuthHeaderString = sessionStorage.getItem(TOKEN)
    let username = sessionStorage.getItem(AUTHENTICATED_USER);
    console.log('interfere')
    if (basicAuthHeaderString && username) {
      request = request.clone({
        setHeaders: {
          Authorization: basicAuthHeaderString
        }
      })
    }

    return next.handle(request)
  }
}
