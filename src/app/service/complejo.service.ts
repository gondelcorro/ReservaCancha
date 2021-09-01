import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Complejo} from '../model/complejo';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComplejoService {

  constructor(private http: HttpClient) { }

  public listarComplejos(){
    return this.http.get<Complejo[]>(environment.url_gestionComplejos + `/complejo/listar`);
  }

  leerArchivo(idComplejo: number, imgOrLogo:  number) {
    return this.http.get(environment.url_gestionComplejos + "/complejo/leerArchivo/" + `${idComplejo}` + "/" + `${imgOrLogo}` , {
      responseType: 'blob' //es blob xq recibe una secuencia de bytes
    });
  }

}
