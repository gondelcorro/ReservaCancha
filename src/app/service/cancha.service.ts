import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Cancha} from '../model/cancha';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CanchaService {

  constructor(private http: HttpClient) {

  }

  public listarCanchas(idComplejo: number){
    return this.http.get<Cancha[]>(environment.url_sejuegasgo + `/cancha/listar/${idComplejo}`/*, {
      headers: new HttpHeaders().set('Authorization', `bearer ` + sessionStorage.getItem(environment.token)).set('Content-Type', 'application/json')
    }*/);
  }

  listarPorComplejo(idComplejo: number){
    return this.http.get<Cancha[]>(environment.url_sejuegasgo + `/cancha/listar/${idComplejo}`);
  }

  listarPorComplejoYHabilitada(idComplejo: number){
    return this.http.get<Cancha[]>(environment.url_sejuegasgo + `/cancha/listarHabilitadas/${idComplejo}`);
  }
}
