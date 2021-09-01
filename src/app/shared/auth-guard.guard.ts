import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import {LoginService} from './login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate {

  constructor(private loginService: LoginService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const estaLogueado = this.loginService.isLoggedIn();
    const tokenExpirado = this.loginService.isTokenExpired();
    if(estaLogueado && !tokenExpirado){
      return true;
    }else{
      this.loginService.logout();
      return false;
    }
  }

}
