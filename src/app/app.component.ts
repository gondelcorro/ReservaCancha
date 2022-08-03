import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from 'src/environments/environment';
import * as decode from 'jwt-decode';
import {Subject} from 'rxjs';
import {LoaderService} from './shared/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  isLoading: Subject<boolean> = this.loader.isLoading;

  constructor(private router: Router, public activeRoute: ActivatedRoute, private loader: LoaderService) {

  }

  ngOnInit(): void{
    this.activeRoute.queryParams.subscribe(queryParams => {
      if (queryParams.token != null) { // El parametro q viene del login en la url se llama token
        const token = queryParams.token;
        console.log('TOKEN COMPLETO: ' + token);
        const jsonToken = JSON.parse(queryParams.token); // CONVIERTO LA RESP A UN JSON
        const decodedToken = decode(jsonToken.access_token); // DECODIFICO EL access_token
        const user = decodedToken.user_name;  // EXTRAIGO EL USER
        // let rol = decodedToken.authorities[0];  // EXTRAIGO EL ROL
        console.log('USER: ' + user);
        sessionStorage.setItem(environment.token, jsonToken.access_token); // Guardo unicamente el access token
        sessionStorage.setItem(environment.user, user); // Guardo el user
        this.router.navigate(['main-layout/dashboard']); // Fuerzo a q se actualice la navegacion para borrar el token de la url
      }
    });
  }

}


