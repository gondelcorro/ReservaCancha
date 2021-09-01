import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {InformePago} from '../../../model/InformePago';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ReservaService} from '../../../service/reserva.service';

@Component({
  selector: 'app-procesando-reserva',
  templateUrl: './procesando-reserva.component.html',
  styleUrls: ['./procesando-reserva.component.css']
})
export class ProcesandoReservaComponent implements OnInit {

  public informePago: InformePago;

  constructor(@Inject(MAT_DIALOG_DATA) private queryParams, private dialogRef: MatDialogRef<ProcesandoReservaComponent>,
              private snackbar: MatSnackBar, private reservaService: ReservaService) { }

  ngOnInit(): void {
    this.informarPago(this.queryParams);
  }

  private informarPago(queryParams) {
    this.informePago = new InformePago();
    this.informePago.collectionId = queryParams.collection_id;
    this.informePago.collectionStatus = queryParams.collection_status;
    this.informePago.paymentId = queryParams.payment_id;
    this.informePago.status = queryParams.status;
    this.informePago.externalReference = queryParams.external_reference;
    this.informePago.paymentType = queryParams.payment_type;
    this.informePago.merchantOrderId = queryParams.merchant_order_id;
    this.informePago.preferenceId = queryParams.preference_id;
    this.informePago.siteId = queryParams.site_id;
    this.informePago.processingMode = queryParams.processing_mode;
    this.informePago.reservaAutomatica = true;
    console.log(this.informePago);
    this.reservaService.registrarReservaYPago(this.informePago).subscribe(resp => {
      this.dialogRef.close();
      if (resp = 1) {
        this.snackbar.open("Se registró el pago correctamente", "Aviso", {
          duration: 7000, horizontalPosition: 'center', panelClass: ['background-snackbar', 'text-snackbar']
        });
      } else {
        this.snackbar.open("Falló la imputación del pago en el sistema", "Aviso", {
          duration: 7000, horizontalPosition: 'center', panelClass: ['background-snackbar', 'text-snackbar']
        });
      }
    });
  }

}
