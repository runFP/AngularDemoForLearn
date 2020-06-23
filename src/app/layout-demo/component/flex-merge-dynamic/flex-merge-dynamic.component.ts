import {Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {FlexMergeDynamicDirective} from './flex-merge-dynamic.directive';

@Component({
  selector: 'app-flex-merge-dynamic',
  templateUrl: './flex-merge-dynamic.component.html',
  styleUrls: ['./flex-merge-dynamic.component.scss']
})
export class FlexMergeDynamicComponent implements OnInit {

  @ViewChild('container', {static: true, read: ViewContainerRef}) vcr: ViewContainerRef;
  @ViewChild(FlexMergeDynamicDirective, {static: true}) fmd: FlexMergeDynamicDirective;

  row: number;
  column: number;

  constructor() {
  }

  ngOnInit() {
    this.fmd.setVcr(this.vcr);
  }

  create() {
    this.fmd.create(this.row, this.column);
  }

  showTreeNode() {
    this.fmd.showTreeNode();
  }

}
