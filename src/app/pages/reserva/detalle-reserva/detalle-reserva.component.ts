import {Component, Input, OnInit} from '@angular/core';
import {Reserva} from '../../../model/reserva';
import {PagoService} from '../../../service/pago.service';
import {Pago} from '../../../model/pago';
import {AbonarFechaComponent} from '../abonar-fecha/abonar-fecha.component';
import {MatDialog} from '@angular/material/dialog';
import {EstadoReserva} from '../../../model/estadoReserva';

@Component({
  selector: 'app-detalle-reserva',
  templateUrl: './detalle-reserva.component.html',
  styleUrls: ['./detalle-reserva.component.css']
})
export class DetalleReservaComponent implements OnInit {

  @Input() reservaSelected: Reserva;
  @Input() listaPagos: Pago[];

  public turnoFijoText: string;
  public reservaConfirmada = EstadoReserva.CONFIRMADA;
  public reservaAnulada = EstadoReserva.ANULADA;
  public reservaFinalizada = EstadoReserva.FINALIZADA;

  constructor(private dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.turnoFijoText = this.reservaSelected.esTurnoFijo ? 'Turno Fijo' : 'Turno Libre';
  }

  public abonarFecha(){
    this.dialog.open(AbonarFechaComponent, {
      width: '350px',
      disableClose: false,
      data: this.reservaSelected
    });
  }

}
