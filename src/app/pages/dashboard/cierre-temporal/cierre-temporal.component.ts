import {Component, Inject, OnInit} from '@angular/core';
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA} from '@angular/material/legacy-dialog';
import {Complejo} from '../../../model/complejo';

@Component({
  selector: 'app-cierre-temporal',
  templateUrl: './cierre-temporal.component.html',
  styles: [
  ]
})
export class CierreTemporalComponent implements OnInit {

  public complejo: Complejo;

  constructor(@Inject(MAT_DIALOG_DATA) private complejoSelected) { }

  ngOnInit(): void {
    this.complejo = this.complejoSelected;
  }

}
