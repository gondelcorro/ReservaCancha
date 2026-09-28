import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ReservaService} from '../../../service/reserva.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Reserva} from '../../../model/reserva';

@Component({
  selector: 'app-abonar-fecha',
  templateUrl: './abonar-fecha.component.html',
  styleUrls: ['./abonar-fecha.component.css']
})
export class AbonarFechaComponent implements OnInit {

  importeAPagar = 0;

  constructor(private dialogRefAbonarFecha: MatDialogRef<AbonarFechaComponent>, @Inject(MAT_DIALOG_DATA) public reserva: Reserva,
              private reservaService: ReservaService, private matBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.reservaService.calcularImporte(this.reserva).subscribe(importe => {
      this.importeAPagar = importe;
    });
  }

  public confirmarAbonarFecha() {
    this.reservaService.configurarPreferenciaPago(this.reserva).subscribe(urlCheckout => {
      if (urlCheckout != undefined && urlCheckout != '') {
        console.log('URL MP: ' + urlCheckout);
        window.open(urlCheckout, '_self');
      }
    }, error => {
      console.log('Error configurando preferencia de pago', error._body);
    });
  }
}
