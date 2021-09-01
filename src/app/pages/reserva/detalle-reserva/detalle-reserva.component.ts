import {Component, Input, OnInit} from '@angular/core';
import {Reserva} from '../../../model/reserva';
import {PagoService} from '../../../service/pago.service';
import {Pago} from '../../../model/pago';

@Component({
  selector: 'app-detalle-reserva',
  templateUrl: './detalle-reserva.component.html',
  styleUrls: ['./detalle-reserva.component.css']
})
export class DetalleReservaComponent implements OnInit {

  @Input() reservaSelected: Reserva;
  @Input() litaPagos: Pago[];

  constructor() {

  }

  ngOnInit(): void {

  }

}
