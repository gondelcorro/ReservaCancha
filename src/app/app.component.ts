import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from 'src/environments/environment';
import {Subject} from 'rxjs';
import {LoaderService} from './shared/loader.service';
import decode from 'jwt-decode';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: false
})

export class AppComponent implements OnInit {
  isLoading: Subject<boolean> = this.loader.isLoading;

  constructor(private router: Router, public activeRoute: ActivatedRoute,
              private loader: LoaderService) {

  }

  ngOnInit(): void{
    this.activeRoute.queryParams.subscribe(queryParams => {
      if (queryParams.token != null) { //El parametro q viene del login en la url se llama token
        let tokenString = queryParams.token;
        console.log("TOKEN AS STRING: " + tokenString)
        const tokenJson = JSON.parse(tokenString); // Convierto a json el token
        const accessToken = tokenJson.access_token; // Obtengo el access_token
        const decodedToken = decode(accessToken); // lo decodifico
        sessionStorage.setItem(environment.token, accessToken); //Guardo el acces_token
        sessionStorage.setItem(environment.user, decodedToken.user_name); //Guardo el user
        this.router.navigate(['/main-layout/dashboard']);// Fuerzo a q se actualice la navegacion para borrar el token de la url
      }
    });
  }

}


