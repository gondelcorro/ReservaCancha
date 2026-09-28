import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Pago} from '../model/pago';

@Injectable({
  providedIn: 'root'
})
export class PagoService {

  constructor(private http: HttpClient) {
  }

  public getDetallePago(codigoReserva: string){
    return this.http.get<Pago[]>(environment.url_sejuegasgo + `/pago/obtener/${codigoReserva}`/*, {
      headers: new HttpHeaders().set('Authorization', `bearer ` + sessionStorage.getItem(environment.token)).set('Content-Type', 'application/json')
    }*/);
  }
}
