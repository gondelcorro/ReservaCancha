import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Complejo} from '../../model/complejo';
import {Cancha} from '../../model/cancha';
import {ComplejoService} from '../../service/complejo.service';
import {CanchaService} from '../../service/cancha.service';
import {ReservaService} from '../../service/reserva.service';
import {DatePipe} from '@angular/common';
import {Reserva} from '../../model/reserva';
import {ActivatedRoute, Router} from '@angular/router';
import {AnimationOptions} from 'ngx-lottie';
import {MatStepper} from '@angular/material/stepper';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {ProcesandoReservaComponent} from './procesando-reserva/procesando-reserva.component';
import {CierreTemporalComponent} from './cierre-temporal/cierre-temporal.component';
import {BreakpointObserver} from '@angular/cdk/layout';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public formGroupComplejo: FormGroup;
  public formGroupCancha: FormGroup;
  public formGroupFecha: FormGroup;

  public complejos: Complejo[] = [];
  public canchas: Cancha[] = [];
  public selectedComplejo: Complejo;
  public selectedCancha: Cancha;
  public selectedFecha: Date;
  public minDate: Date;
  public maxDate: Date;
  public mostrarScheduler = false;
  public mostrarStepper = true;
  public reservas: Reserva[];
  options1: AnimationOptions = {
    path: './assets/animations/goal.json', // download the JSON version of animation in your project directory and add the path to it like ./assets/animations/example.json
  };
  options: AnimationOptions = {
    path: './assets/animations/drone.json', // download the JSON version of animation in your project directory and add the path to it like ./assets/animations/example.json
  };
  reservaEdion: Reserva = null;//DESDE EL DASHBOARD SOLO SE CREA ASI Q LA PASO NULL

  constructor(private complejoService: ComplejoService, private canchaService: CanchaService,
              private reservaService: ReservaService, private datePipe: DatePipe, private router: Router,
              private activeRoute: ActivatedRoute, private snackbar: MatSnackBar, private dialog: MatDialog,
              private mediaObserver: BreakpointObserver) {

    this.formGroupComplejo = new FormGroup({
      'complejo': new FormControl('', [Validators.required])
    });
    this.formGroupCancha = new FormGroup({
      'cancha': new FormControl('', [Validators.required])
    });
    this.formGroupFecha = new FormGroup({
      'fecha': new FormControl('', [Validators.required])
    });

    this.minDate = new Date(); //Fecha actual
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate() + 7);
  }

  ngOnInit(): void {
    this.mediaObserver.observe(['(min-width: 0px)','(max-width: 750px)']).subscribe(result => {
      if(result.matches && this.mostrarScheduler){
        this.mostrarStepper = false;
        this.mostrarScheduler = true;
      }
    });
    this.mediaObserver.observe('(min-width: 750px)').subscribe(result => {
      if(result.matches && this.mostrarScheduler){
        this.mostrarStepper = true;
      }
    });

    this.activeRoute.queryParams.subscribe(queryParams => {
      if (queryParams.external_reference != null) {
        if (queryParams.status == 'approved') {
          this.dialog.open(ProcesandoReservaComponent, {
            width: '350px',
            disableClose: true,
            data: queryParams
          });
        } else {
          this.snackbar.open('Su pago no fué aprobado. Intente abonar con otro medio de pago', 'Aviso', {
            duration: 7000, horizontalPosition: 'end', panelClass: ['background-snackbar', 'text-snackbar']
          });
        }
        this.router.navigate(['main-layout/dashboard']);
      }
    });
    this.cargarComplejo();
  }

  private async cargarComplejo() {
    this.complejos = await this.complejoService.listarComplejos().toPromise();
    console.log(this.complejos);
  }

  public async cargarCancha(stepper: MatStepper) {
      this.canchaService.listarPorComplejo(this.selectedComplejo.idComplejo).subscribe(canchas => {
        canchas.forEach( cancha => {
          if(cancha.habilitada){
            this.canchas.push(cancha);
          }
          else{
            let dia = Number(cancha.fechaDeshabilitada.substring(0,2));
            let mes = Number(cancha.fechaDeshabilitada.substring(3,5));
            let anio = Number(cancha.fechaDeshabilitada.substring(6,10));
            let fechaDeshabilitacion: Date = new Date(anio, mes-1, dia)
            const fechaActual = new Date();
            console.log(fechaDeshabilitacion);
            if(fechaActual.getTime() < fechaDeshabilitacion.getTime()){
              this.canchas.push(cancha);
            }
          }
        });
      });
    stepper.next();
  }

  public stepFecha(stepper: MatStepper) {
    stepper.next();
  }

  public stepConfirmacion(stepper: MatStepper) {
    stepper.next();
  }

  public setMostrarScheduler() {
    this.mostrarScheduler =true;
    this.mediaObserver.observe('(max-width: 750px)').subscribe(result => {
      if(result.matches && this.mostrarScheduler){
        this.mostrarStepper = false;
      }
    });
    if (!this.selectedComplejo.cierreTemporal) {
      console.log('SELECTED FECHA: ' + this.selectedFecha);
      if (this.validarDiasAtencion(this.selectedFecha)){
        this.snackbar.open("El complejo esta cerrado para el dia seleccionado", "INFO", {duration: 5000});
      }else{
        const fechaFormateada = this.datePipe.transform(this.selectedFecha, 'dd-MM-yyyy');
        this.reservaService.verDisponibilidad(this.selectedComplejo.idComplejo, this.selectedCancha.idCancha, fechaFormateada).subscribe(resp => {
          console.log('RESPUESTA: ' + JSON.stringify(resp));
          this.reservas = resp;
          /*Actualizo los subject con la respuesa del service que es un Reserva[]*/
          this.reservaService.listadoReservasCambio.next(this.reservas);
          this.reservaService.complejoCambio.next(this.selectedComplejo);
          this.reservaService.canchaCambio.next(this.selectedCancha);
          this.reservaService.fechaCambio.next(this.selectedFecha);
          this.mostrarScheduler = true;
          this.router.navigate(['main-layout/dashboard']);
        });
      }
    } else {
      this.dialog.open(CierreTemporalComponent, {
        width: '600px',
        data: this.selectedComplejo,
        disableClose: true
      });
    }

  }

  private validarDiasAtencion(fecha: Date) {
    let diasDeAtencion: number[] = [];
    if (this.selectedComplejo.diasAtencion.domingo) {
      diasDeAtencion.push(0);
    }
    if (this.selectedComplejo.diasAtencion.lunes) {
      diasDeAtencion.push(1);
    }
    if (this.selectedComplejo.diasAtencion.martes) {
      diasDeAtencion.push(2);
    }
    if (this.selectedComplejo.diasAtencion.miercoles) {
      diasDeAtencion.push(3);
    }
    if (this.selectedComplejo.diasAtencion.jueves) {
      diasDeAtencion.push(4);
    }
    if (this.selectedComplejo.diasAtencion.viernes) {
      diasDeAtencion.push(5);
    }
    if (this.selectedComplejo.diasAtencion.sabado) {
      diasDeAtencion.push(6);
    }
    return !diasDeAtencion.includes(fecha.getDay());
  }

}
