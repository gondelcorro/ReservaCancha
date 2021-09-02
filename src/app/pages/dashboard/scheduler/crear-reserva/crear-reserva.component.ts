import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DatePipe} from '@angular/common';
import {FormControl, FormGroup} from '@angular/forms';
import {ReservaService} from '../../../../service/reserva.service';
import {Reserva} from '../../../../model/reserva';
import {MatSnackBar} from '@angular/material/snack-bar';
import {JugadorSharedService} from '../../../../shared/jugador-shared.service';
import {EstadoReserva} from '../../../../model/estadoReserva';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-crear-reserva',
  templateUrl: './crear-reserva.component.html',
  styleUrls: ['./crear-reserva.component.css']
})
export class CrearReservaComponent implements OnInit {
  form: FormGroup;
  format = 24;
  minutesGap = 30;
  fechaFormateada: string;
  horaInicio: string;
  horaMin: string;
  selectedTime;
  mostrarImporte = false;
  importeAPagar = 0;

  constructor(public dialogRef: MatDialogRef<CrearReservaComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
              private datePipe: DatePipe, private reservaService: ReservaService, private snackBar: MatSnackBar,
              private jugadorServiceShared: JugadorSharedService) {

    this.form = new FormGroup({'horaFin': new FormControl(''),});
    this.fechaFormateada = this.datePipe.transform(data.fechaReserva, 'dd-MM-yyyy');
    this.horaInicio = this.datePipe.transform(data.fechaReserva, 'HH:mm');
  }

  ngOnInit(): void {
  }

  reservarCancha() {
    let horaFin = Number(this.form.controls['horaFin'].value.substring(0, 2));
    let minFin = Number(this.form.controls['horaFin'].value.substring(3, 5));
    let horaInicioAsDate = new Date(this.data.fechaReserva);
    let horaFinAsDate = new Date(this.data.fechaReserva);
    if(horaFin == 0){
      horaFin = 23;
      minFin = 59;
    }
    horaFinAsDate.setHours(horaFin, minFin);
    console.log('HORA INICIO: ' + horaInicioAsDate);
    console.log('HORA FIN: ' + horaFinAsDate);
    if (horaFinAsDate.getTime() <= horaInicioAsDate.getTime()) {
      this.snackBar.open('La hora de fin debe ser posterior a la hora de inicio', 'Error', {
        duration: 5000
      });
    } else {
      //NUEVA RESERVA
      if(this.data.reservaEdicion == null){
        let reserva = new Reserva();
        reserva.fecha = this.fechaFormateada;
        reserva.horaInicio = this.horaInicio;
        reserva.horaFin =  this.datePipe.transform(horaFinAsDate, 'HH:mm');
        reserva.complejo = this.data.complejo;
        reserva.cancha = this.data.cancha;
        reserva.jugador = this.jugadorServiceShared.getJugador();
        reserva.automatica = true;
        reserva.estado = EstadoReserva.CONFIRMADA;
        this.dialogRef.close();
        this.reservaService.validarReglasReservaCreacion(reserva).subscribe(resp => {
          if (resp.codigo == 99) {
            this.reservaService.configurarPreferenciaPago(reserva).subscribe(urlCheckout =>{
              if (urlCheckout != undefined && urlCheckout != "") {
                console.log("URL MP: " + urlCheckout);
                window.open(urlCheckout, '_self');
              }
            }, error => {
              console.log("Error configurando preferencia de pago", error._body);
            });
          } else {
            this.snackBar.open(resp.descripcion, 'Error', {
              duration: 5000
            });
          }
        });
      }else{
        //EDICION DE RESERVA - SOLO LE MODIFICO LA CANCHA Y LA FECHA Y HORARIOS
        this.data.reservaEdicion.cancha = this.data.cancha;
        this.data.reservaEdicion.fecha = this.fechaFormateada;
        this.data.reservaEdicion.horaInicio = this.horaInicio;
        this.data.reservaEdicion.horaFin = this.datePipe.transform(horaFinAsDate, 'HH:mm');
        this.reservaService.validarReglasEdicion(this.data.reservaEdicion, "otrasReglas").subscribe(resp =>{
          if (resp.codigo == 99) {
          this.reservaService.modificar(this.data.reservaEdicion).subscribe(data =>{
            if(data == 1){
              this.reservaService.listarPorUsuario(sessionStorage.getItem(environment.user)).subscribe(reservas => {
                this.reservaService.listadoReservasCambio.next(reservas);
              });
              this.dialogRef.close();
              this.snackBar.open("Reserva modificada exitosamente", 'Aviso', {
                duration: 5000
              });
            }else{
              this.snackBar.open("Error al modificar la reserva", 'Error', {
                duration: 5000
              });
            }
          });
          } else {
            this.dialogRef.close();
            this.snackBar.open(resp.descripcion, 'Error', {
              duration: 5000
            });
          }
        });
      }
    }
  }

  calcularImporte(event: string) {
    if (this.selectedTime != null) {
      let horaFin = Number(this.form.controls['horaFin'].value.substring(0, 2));
      let minFin = Number(this.form.controls['horaFin'].value.substring(3, 5));
      let horaInicioAsDate = new Date(this.data.fechaReserva);
      let horaFinAsDate = new Date(this.data.fechaReserva);
      if (horaFin == 0) {
        horaFin = 23;
        minFin = 59;
      }
      horaFinAsDate.setHours(horaFin, minFin);
      if (horaFinAsDate.getTime() <= horaInicioAsDate.getTime()) {
        this.snackBar.open('La hora de fin debe ser posterior a la hora de inicio', 'Error', {
          duration: 5000
        });
      } else {
        let reserva = new Reserva();
        reserva.cancha = this.data.cancha;
        reserva.horaInicio = this.horaInicio;
        reserva.horaFin = this.datePipe.transform(horaFinAsDate, 'HH:mm');
        reserva.complejo = this.data.complejo;
        this.reservaService.calcularImporte(reserva).subscribe(importe => {
          this.importeAPagar = importe;
          this.mostrarImporte = true;
        });
      }
    }
  }

}
