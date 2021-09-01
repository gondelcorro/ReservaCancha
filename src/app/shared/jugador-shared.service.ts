import {Injectable} from '@angular/core';
import {Jugador} from '../model/jugador';

@Injectable({
  providedIn: 'root'
})
export class JugadorSharedService {

  private jugador: Jugador;

  constructor() {
    this.jugador = new Jugador();
  }

  public getJugador(): Jugador {
    return this.jugador;
  }

  public setJugador(jugador: Jugador) {
    this.jugador = jugador;
  }
}
