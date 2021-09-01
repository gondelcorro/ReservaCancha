import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Jugador} from '../../model/jugador';
import {JugadorSharedService} from '../../shared/jugador-shared.service';
import {LoginService} from '../../shared/login.service';
import {JugadorService} from '../../service/jugador.service';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit {

  public sizeAvatar = 35;
  public jugador: Jugador = new Jugador();
  private correoJugador = sessionStorage.getItem(environment.user);
  public urlDashboard = environment.url_dashboard;

  constructor(private router: Router, public activeRoute: ActivatedRoute, private jugadorService: JugadorService,
              private jugadorShared: JugadorSharedService, private loginService: LoginService) {
  }

  ngOnInit(): void {
    this.jugadorService.obtenerJugador(this.correoJugador).subscribe(jugador => {
      this.jugador = jugador;
      this.jugadorShared.setJugador(this.jugador);
    });
    this.jugadorService.jugadorCambioDatos.subscribe(jugador =>{
      this.jugador = jugador;
      this.jugadorShared.setJugador(this.jugador);
    });
  }

  cerrarSesion(): void {
    this.loginService.logout();
  }

}
