import {Component, Inject, OnInit} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {ReservaService} from '../../../service/reserva.service';
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef} from '@angular/material/legacy-dialog';
import {Reserva} from '../../../model/reserva';
import {MatLegacySnackBar as MatSnackBar} from '@angular/material/legacy-snack-bar';
import {ReservaComponent} from '../reserva.component';

@Component({
  selector: 'app-anulacion',
  templateUrl: './anulacion.component.html',
  styleUrls: ['./anulacion.component.css']
})
export class AnulacionComponent implements OnInit {

  reservaAAnular: Reserva;

  constructor(@Inject(MAT_DIALOG_DATA) private reservaSelected: Reserva, private reservaService: ReservaService,
              private snackbar: MatSnackBar, private dialogRef: MatDialogRef<ReservaComponent>) {
    this.reservaAAnular = this.reservaSelected;
  }

  ngOnInit(): void {
  }

  confirmarAnulacion() {
    this.reservaService.anular(this.reservaAAnular).subscribe(anulacion => {
      if (anulacion == 1) {
        this.dialogRef.close();
        this.reservaService.listarPorUsuario(sessionStorage.getItem(environment.user)).subscribe(reservas =>{
          this.reservaService.listadoReservasCambio.next(reservas);
          this.snackbar.open('Se anuló correctamente su reserva', 'Aviso', {duration: 5000});
        });
      } else {
        this.snackbar.open('Error anulando la reserva', 'Error', {duration: 5000});
      }
    });
  }

}
