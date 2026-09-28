import {Injectable, EventEmitter} from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {Reserva} from '../model/reserva';
import {environment} from '../../environments/environment';
import {Subject} from 'rxjs';
import {Complejo} from '../model/complejo';
import {Cancha} from '../model/cancha';
import {ReglasReservaError} from '../model/reglasReservaError';
import {InformePago} from '../model/InformePago';

@Injectable({
  providedIn: 'root'
})

export class ReservaService {

  reservaCambio = new Subject<Reserva>();
  complejoCambio = new Subject<Complejo>();
  canchaCambio = new Subject<Cancha>();
  fechaCambio = new Subject<Date>();
  listadoReservasCambio = new Subject<Reserva[]>();

  constructor(private httpClient: HttpClient) {
  }

  public verDisponibilidad(idComplejo: number, idCancha: number, fecha: string) {
    return this.httpClient.get<Reserva[]>(environment.url_sejuegasgo + `/reserva/verDisponibilidad`, {
   /*   headers: new HttpHeaders().set('Authorization', `bearer ` + sessionStorage.getItem(environment.token)).set('Content-Type', 'application/json'),*/
      params: new HttpParams().set('idComplejo', idComplejo.toString())
        .set('idCancha', idCancha.toString())
        .set('fecha', fecha)
    });
  }

  validarReglasReservaCreacion(reserva: Reserva){
    return this.httpClient.post<ReglasReservaError>(environment.url_sejuegasgo + `/reserva/validarReglasCreacion`, reserva);
  }

  configurarPreferenciaPago(reserva: Reserva){
    return this.httpClient.post(environment.url_sejuegasgo + `/checkout/configurarPreferencia`, reserva, {
      responseType: 'text'
    });
  }

  registrarReservaYPago(informePago: InformePago){
    return this.httpClient.post<number>(environment.url_sejuegasgo + `/reserva/registrarReservaYPago`, informePago/*,{
      headers: new HttpHeaders().set('Authorization', `bearer ` + sessionStorage.getItem(environment.token)).set('Content-Type', 'application/json')
    }*/);
  }

  listarPorUsuario(correo: string){
    return this.httpClient.get<Reserva[]>(environment.url_sejuegasgo + `/reserva/listarPorJugador/${correo}`/*, {
      headers: new HttpHeaders().set('Authorization', `bearer ` + sessionStorage.getItem(environment.token)).set('Content-Type', 'application/json')
    }*/);
  }

  obtenerPorCodigo(codigo: string){
    return this.httpClient.get<Reserva>(environment.url_sejuegasgo + `/reserva/obtenerPorCodigo/${codigo}`);
  }

  validarReglasAnulacion(reserva: Reserva){
    return this.httpClient.post<ReglasReservaError>(environment.url_sejuegasgo + `/reserva/validarReglasAnulacion`, reserva);
  }

  anular(reserva: Reserva){
    return this.httpClient.put<number>(environment.url_sejuegasgo + `/reserva/anular`, reserva);
  }

  calcularImporte(reserva: Reserva){
    return this.httpClient.post<number>(environment.url_sejuegasgo + `/reserva/obtenerImporte`, reserva);
  }

  validarReglasEdicion(reserva: Reserva, reglaAvalidar: string){
    return this.httpClient.post<ReglasReservaError>(environment.url_sejuegasgo + `/reserva/validarReglasEdicion`, reserva, {
      params: new HttpParams().set("reglaAValidar", reglaAvalidar)
    });
  }

  modificar(reserva: Reserva){
    return this.httpClient.put<number>(environment.url_sejuegasgo + `/reserva/modificar`, reserva);
  }
}
