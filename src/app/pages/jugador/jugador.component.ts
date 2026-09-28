import {Component, OnInit} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, NgForm, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Jugador} from '../../model/jugador';
import {JugadorService} from '../../service/jugador.service';
import {JugadorSharedService} from '../../shared/jugador-shared.service';

@Component({
    selector: 'app-jugador',
    templateUrl: './jugador.component.html',
    styleUrls: ['./jugador.component.css'],
    standalone: false
})
export class JugadorComponent implements OnInit {

  form: UntypedFormGroup;
  public hidePass = true;
  public hidePassConfirm = true;
  jugador: Jugador;

  constructor(private _snackBar: MatSnackBar, private jugadorService: JugadorService, private jugadorShared: JugadorSharedService) {
    this.form = new UntypedFormGroup({
      'nomyape': new UntypedFormControl('', [Validators.pattern('^[a-zA-Z ]*$')]),
      'telefono': new UntypedFormControl('', [Validators.required, Validators.minLength(6),
        Validators.maxLength(11), Validators.pattern('^([0-9])*$')]),
      'correo': new UntypedFormControl('', [Validators.required, , Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
      'clave': new UntypedFormControl('', [Validators.required, Validators.pattern('^(?=.*[A-Za-z])(?=.*[0-9]).{10,}$')]),
      'confirmaClave': new UntypedFormControl()
    });
    this.form.controls['confirmaClave'].setValidators([Validators.required, this.coincidenClaves.bind(this)]);
  }

  ngOnInit(): void {
    this.jugador = this.jugadorShared.getJugador();
  }


  modificar(modificarForm) {// quitar el : NgForm cuando paso el form xq da error
    let newJugador = new Jugador();
    newJugador.idJugador = this.jugador.idJugador
    newJugador.nomYApe = this.form.value.nomyape;
    newJugador.telefono = this.form.value.telefono;
    newJugador.correo = this.form.value.correo;
    newJugador.clave = this.form.value.clave;
    if (this.form.valid) {
      this.jugadorService.modificarDatos(newJugador).subscribe(data => {
        if (data == 1) { // MODIFICACION EXITOSA
          this._snackBar.open('Sus datos se modificaron correctamente', 'Info', {
            duration: 6000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['background-snackbar', 'text-snackbar']
          });
          this.jugadorService.jugadorCambioDatos.next(newJugador);
          this.clearForm(modificarForm);
        }
      }, err => {
        if (err.status == 500 || err.status == 401 || err.status == 402) {
          this._snackBar.open('' + err.statusText, 'Error', {
            duration: 6000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['background-snackbar', 'text-snackbar']
          });
        }
      });
    }
  }

  clearForm(form): void {
    form.resetForm();
    Object.keys(form.controls).forEach(key => {
      form.controls[key].setErrors(null);
    });
  }

  coincidenClaves(control: UntypedFormControl): { [s: string]: boolean } {
    return control.value != this.form.controls['clave'].value ? {coinciden: false} : null;
  }

}
