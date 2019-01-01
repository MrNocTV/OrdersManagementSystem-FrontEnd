import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_URL, AUTHENTICATED_USER, TOKEN } from '../app.constants';
import { map } from 'rxjs/operators';
import { AuthenticationService } from '../service/authentication.service';
import { Router } from '@angular/router';
import { routerNgProbeToken } from '@angular/router/src/router_module';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string = ""
  password: string = ""
  errorMessage: string


  constructor(private http: HttpClient, 
    private authenticationService : AuthenticationService,
    private router : Router) { }

  ngOnInit() {
    if(this.authenticationService.isUserLoggedIn()) {
      this.router.navigate(['home'])
    }
  }

  handleAuthLogin() {
    let basicAuthHeaderString = 'Basic ' + window.btoa(this.username + ':' + this.password);
    let headers = new HttpHeaders({
      Authorization: basicAuthHeaderString
    })
    return this.http.get(`${API_URL}/basicauth/${basicAuthHeaderString}`, { headers }).subscribe(
      data => {
        console.log(data);
        sessionStorage.setItem(AUTHENTICATED_USER, this.username);
        sessionStorage.setItem(TOKEN, basicAuthHeaderString);
        this.router.navigate(['home'])
      },
      error => {
        this.errorMessage = "Invalid username or password"
      }
    );
  }
}
