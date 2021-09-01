import {Cancha} from './cancha';
import {DiasAtencion} from './diasAtencion';

export class Complejo {
  idComplejo: number;
  nombre: string;
  direccion: string;
  telefono: string;
  correo: string;
  apertura: string;
  cierre: string;
  canchas: Cancha[];
  cierreTemporal: boolean;
  cierreTempHasta: string;
  hsMinEdiAnu: number;
  diasAtencion: DiasAtencion;
}
