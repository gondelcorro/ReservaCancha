import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Jugador} from '../model/jugador';
import {environment} from '../../environments/environment';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JugadorService {

  public jugadorCambioDatos = new Subject<Jugador>();

  constructor(private http: HttpClient) {

  }

  obtenerJugador(correo: string){
    return this.http.get<Jugador>(environment.url_gestionComplejos + `/jugador/obtenerPorCorreo/${correo}`);
  }

  modificarDatos(jugador: Jugador){
    return this.http.put<number>(environment.url_gestionComplejos + `/jugador/modificar-datos`, jugador);
  }
}
