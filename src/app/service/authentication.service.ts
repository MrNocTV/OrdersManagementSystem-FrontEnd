import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_URL, AUTHENTICATED_USER, TOKEN, API_URL_PROD } from '../app.constants';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) { }

  authenticate(username, password) {
    let basicAuthHeaderString = 'Basic ' + window.btoa(username + ':' + password);
    let headers = new HttpHeaders({
      Authorization: basicAuthHeaderString
    })
    return this.http.get(`${API_URL_PROD}/basicauth/${basicAuthHeaderString}`, { headers }).subscribe(
      data => {
        console.log(data);
        sessionStorage.setItem(AUTHENTICATED_USER, username);
        sessionStorage.setItem(TOKEN, basicAuthHeaderString);
      },
      error => {
        console.log(error);
      }
    );
  }

  getAuthenticatedUser() {
    return sessionStorage.getItem(AUTHENTICATED_USER);
  }

  getAuthenticatedToken() {
    if (this.getAuthenticatedUser())
      return sessionStorage.getItem(TOKEN);
  }

  isUserLoggedIn() {
    let user = sessionStorage.getItem(AUTHENTICATED_USER);
    let token = sessionStorage.getItem(TOKEN);
    return !(user === null && token === null);
  }
  
  logout() {
    sessionStorage.removeItem(AUTHENTICATED_USER);
    sessionStorage.removeItem(TOKEN);
  }
}
