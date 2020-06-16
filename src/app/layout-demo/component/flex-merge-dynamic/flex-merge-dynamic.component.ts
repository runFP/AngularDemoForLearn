import {Component, OnInit, ViewChild} from '@angular/core';
import {FlexMergeDynamicDirective} from './flex-merge-dynamic.directive';

@Component({
  selector: 'app-flex-merge-dynamic',
  templateUrl: './flex-merge-dynamic.component.html',
  styleUrls: ['./flex-merge-dynamic.component.scss']
})
export class FlexMergeDynamicComponent implements OnInit {

  @ViewChild(FlexMergeDynamicDirective, {static: true}) fmd: FlexMergeDynamicDirective;

  row: number;
  column: number;

  constructor() {
  }

  ngOnInit() {
  }

  create() {
    this.fmd.create(this.row, this.column);
  }

}
