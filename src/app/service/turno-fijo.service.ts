import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Reserva} from '../model/reserva';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TurnoFijoService {

  constructor(private httpClient: HttpClient) { }

  abonarFecha(reserva: Reserva){
    return this.httpClient.post<boolean>(environment.url_sejuegasgo + `/turno-fijo/abonarFecha`, reserva);
  }
}
