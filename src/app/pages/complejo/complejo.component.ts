import {Component, OnInit} from '@angular/core';
import {ComplejoService} from '../../service/complejo.service';
import {Complejo} from '../../model/complejo';
import {DomSanitizer} from '@angular/platform-browser';
import {ComplejoConImg} from '../../model/complejoConImg';
import {MatDialog} from '@angular/material/dialog';
import {CanchaComponent} from './cancha/cancha.component';
import {CanchaService} from '../../service/cancha.service';

@Component({
    selector: 'app-complejo',
    templateUrl: './complejo.component.html',
    styleUrls: ['./complejo.component.css'],
    standalone: false
})
export class ComplejoComponent implements OnInit {

  public complejos: Complejo[];
  listaComplejoConImg: ComplejoConImg[] = [];

  constructor(private complejoService: ComplejoService, private sanitization: DomSanitizer,
              private dialog: MatDialog, private canchaService: CanchaService) {
  }

  ngOnInit(): void {
    this.listarComplejos();
  }

  private async listarComplejos() {
    //Este método es asincrono, se espera la respuesta del service q tiene await y desp se ejecuta getImgComplejos();
    this.complejos = await this.complejoService.listarComplejos().toPromise();
    this.getImgComplejos();
  }

  private getImgComplejos() {
    this.complejos.forEach((complejo, index) => {
      let complejoConImg = new ComplejoConImg();
      complejoConImg.complejo = complejo;
      this.complejoService.leerArchivo(complejo.idComplejo, 0).subscribe(data => {
        this.convertirLogo(data, complejoConImg);
      });
      this.complejoService.leerArchivo(complejo.idComplejo, 1).subscribe(data => {
        this.convertirImg(data, complejoConImg);
      });
      this.listaComplejoConImg[index] = complejoConImg;
    });
  }

  convertirLogo(data: any, complejoConImg: ComplejoConImg) {
    var reader = new FileReader(); //transforma la data en un archivo de lectura de js
    reader.readAsDataURL(data);
    reader.onloadend = () => {
      complejoConImg.logo = this.sanitization.bypassSecurityTrustResourceUrl(reader.result as string);  //proteje la url para que puede ser accesible y leida por angular
    };
  }

  convertirImg(data: any, complejoConImg: ComplejoConImg) {
    var reader = new FileReader(); //transforma la data en un archivo de lectura de js
    reader.readAsDataURL(data);
    reader.onloadend = () => {
      complejoConImg.imagen = this.sanitization.bypassSecurityTrustResourceUrl(reader.result as string);  //proteje la url para que puede ser accesible y leida por angular
    };
  }

  async verCanchas(idComplejo: number) {
    let canchas = await this.canchaService.listarCanchas(idComplejo).toPromise();
    this.dialog.open(CanchaComponent, {
      width: '430px',
      disableClose: true,
      data: canchas
    });
  }

}
