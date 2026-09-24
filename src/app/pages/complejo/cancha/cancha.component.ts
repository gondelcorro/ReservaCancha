import {Component, Inject, Input, OnInit} from '@angular/core';
import {Cancha} from '../../../model/cancha';
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA} from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-cancha',
  templateUrl: './cancha.component.html',
  styleUrls: ['./cancha.component.css']
})
export class CanchaComponent implements OnInit {

   public listaCanchas: Cancha[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) private canchas: Cancha[]) {
    this.listaCanchas = canchas;
  }

  ngOnInit(): void {
  }

}
