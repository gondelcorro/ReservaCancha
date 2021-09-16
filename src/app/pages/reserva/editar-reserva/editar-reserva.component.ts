import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Reserva} from '../../../model/reserva';
import {Complejo} from '../../../model/complejo';
import {Cancha} from '../../../model/cancha';
import {CanchaService} from '../../../service/cancha.service';
import {ReservaService} from '../../../service/reserva.service';
import {DatePipe} from '@angular/common';
import {Router} from '@angular/router';
import {Form, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-editar-reserva',
  templateUrl: './editar-reserva.component.html',
  styleUrls: ['./editar-reserva.component.css']
})
export class EditarReservaComponent implements OnInit {

  public selectedComplejo: Complejo;
  public canchas: Cancha[];
  public selectedCancha: Cancha;
  public selectedFecha: Date;
  public minDate: Date;
  public maxDate: Date;
  public mostrarScheduler = false;
  public reservas: Reserva[];
  public formGroup: FormGroup;
  public formCtrlCancha: FormControl;
  public formCtrlFecha: FormControl;
  textoEdicion = "En la edición de reserva podrás cambiar de cancha, fecha y horario pero el complejo deberá ser el mismo que seleccionaste en tu reserva" +
    " original, al igual que el tiempo del turno y el importe que abonaste."

  constructor(public dialogRef: MatDialogRef<EditarReservaComponent>,
              @Inject(MAT_DIALOG_DATA) public reservaSelect: Reserva, private canchaService: CanchaService,
              private reservaService: ReservaService, private datePipe: DatePipe, private router: Router)
  {
    this.selectedComplejo = reservaSelect.complejo;
    this.minDate = new Date(); //Fecha actual
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate() + 7);
    this.formGroup = new FormGroup({
      'cancha': new FormControl('', [Validators.required]),
      'fecha': new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.listarCanchas()
  }

  public listarCanchas() {
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
          if(fechaActual.getTime() < fechaDeshabilitacion.getTime()){
            this.canchas.push(cancha);
          }
        }
      });
    });
  }

  cancelar(){
    this.dialogRef.close();
  }

  public setMostrarScheduler(){
    console.log("SELECTED FECHA: " + this.selectedFecha);
    const  fechaFormateada = this.datePipe.transform(this.selectedFecha, 'dd-MM-yyyy');
    this.reservaService.verDisponibilidad(this.selectedComplejo.idComplejo, this.selectedCancha.idCancha, fechaFormateada).subscribe(resp =>{
      console.log("RESPUESTA: " + JSON.stringify(resp));
      this.reservas = resp;
      /*Actualizo los subject con la respuesa del service que es un Reserva[]*/
      this.reservaService.reservaCambio.next(this.reservas);
      this.reservaService.complejoCambio.next(this.selectedComplejo);
      this.reservaService.canchaCambio.next(this.selectedCancha);
      this.reservaService.fechaCambio.next(this.selectedFecha);
      this.mostrarScheduler = true;
    });
  }

}
