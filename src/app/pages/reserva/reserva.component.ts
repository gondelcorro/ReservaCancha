import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {ReservaService} from '../../service/reserva.service';
import {Reserva} from '../../model/reserva';
import {JugadorSharedService} from '../../shared/jugador-shared.service';
import {environment} from '../../../environments/environment';
import {EditarReservaComponent} from './editar-reserva/editar-reserva.component';
import {EstadoReserva} from '../../model/estadoReserva';
import {Pago} from '../../model/pago';
import {PagoService} from '../../service/pago.service';
import {MatPaginator} from '@angular/material/paginator';
import {AnulacionComponent} from './anulacion/anulacion.component';

@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.component.html',
  styleUrls: ['./reserva.component.css']
})
export class ReservaComponent implements OnInit, AfterViewInit {
  reservaSelect: Reserva;
  listaReservas: any;
  //displayedColumns: string[] = ['codigo', 'complejo', 'cancha', 'fecha', 'horaInicio', 'horaFin', 'automatica', 'estado', 'acciones'];
  displayedColumns: string[] = ['complejo', 'cancha', 'fecha', 'horaInicio', 'horaFin', 'acciones'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  cantidad: number;
  listaPagos: Pago[];

  constructor(private reservaService: ReservaService, private jugadorSharedService: JugadorSharedService,
              private dialog: MatDialog, private snackBar: MatSnackBar, private pagoService: PagoService) {
  }

  ngOnInit(): void {
    this.listarPorUsuario();
    this.reservaService.listadoReservasCambio.subscribe(reservas => {
      this.listaReservas = new MatTableDataSource();
      this.listaReservas.data = reservas;
    });
  }

  ngAfterViewInit() {
    this.listaReservas.paginator = this.paginator;
    this.listaReservas.sort = this.sort;
  }

  listarPorUsuario() {
    this.reservaService.listarPorUsuario(sessionStorage.getItem(environment.user)).subscribe(data => {
      this.listaReservas = new MatTableDataSource();
      this.listaReservas.data = data;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.listaReservas.filter = filterValue.trim().toLowerCase();
    if (this.listaReservas.paginator) {
      this.listaReservas.paginator.firstPage();
    }
  }

  editarReserva(reservaSelect: Reserva) {
    if (reservaSelect.estado == EstadoReserva.FINALIZADA) {
      this.snackBar.open('La reserva está finalizada, no se puede editar', 'Aviso', {duration: 5000});
    }
    if (reservaSelect.estado == EstadoReserva.ANULADA) {
      this.snackBar.open('La reserva está anulada, no se puede editar', 'Aviso', {duration: 5000});
    }
    if (reservaSelect.estado == EstadoReserva.CONFIRMADA) {
      this.reservaService.validarReglasReservaEdiAnu(reservaSelect).subscribe(resp => {
        if (resp.codigo == 99) {
          const dialogRef = this.dialog.open(EditarReservaComponent, {
            width: '900px',
            height: '630px',
            disableClose: true,
            data: reservaSelect
          });
        } else {
          this.snackBar.open(resp.descripcion, 'Aviso', {duration: 5000});
        }
      });
    }
  }

  anularReserva(reservaSelect: Reserva) {
    if (reservaSelect.estado == EstadoReserva.FINALIZADA) {
      this.snackBar.open('La reserva está finalizada, no se puede anular', 'Aviso', {duration: 5000});
    }
    if (reservaSelect.estado == EstadoReserva.ANULADA) {
      this.snackBar.open('Esta reserva ya se encuentra anulada', 'Aviso', {duration: 5000});
    }
    if (reservaSelect.estado == EstadoReserva.CONFIRMADA) {
      this.reservaService.validarReglasReservaEdiAnu(reservaSelect).subscribe(resp => {
        if (resp.codigo == 99) {
          this.dialog.open(AnulacionComponent, {
            data: reservaSelect,
            disableClose: true,
            width: '500px'
          });
        } else {
          this.snackBar.open(resp.descripcion, 'Aviso', {duration: 5000});
        }
      });
    }
  }

  detallePago(reserva: Reserva) {
    this.reservaSelect = reserva;
    this.pagoService.getDetallePago(this.reservaSelect.codigo).subscribe(pagos => {
      this.listaPagos = pagos;
    });
  }

}
