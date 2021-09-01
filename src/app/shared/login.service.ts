import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {JwtHelperService} from '@auth0/angular-jwt'; // npm install @auth0/angular-jwt

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  private jwtHelperService = new JwtHelperService();

  constructor() {
  }

  public logout(): void {
    sessionStorage.clear();
    document.location.href = environment.url_login;
  }

  public isLoggedIn(){
    const token = sessionStorage.getItem(environment.token);
    return token != null;
  }

  public isTokenExpired(): boolean{
    const token = sessionStorage.getItem(environment.token);
    return this.jwtHelperService.isTokenExpired(token);
  }

  public getToken(): string{
    return sessionStorage.getItem(environment.token);
  }
}
