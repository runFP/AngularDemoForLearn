import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {ReactDndDirective} from '../../../share/directives/react-dnd/react-dnd.directive';

@Component({
  selector: 'app-ng-drag-and-drop',
  templateUrl: './ng-drag-and-drop.component.html',
  styleUrls: ['./ng-drag-and-drop.component.scss'],
})
export class NgDragAndDropComponent implements OnInit {
  @ViewChild('dnd', {static: false}) dnd: ReactDndDirective;

  containerWidth = 1000;
  eleWidth = 0;
  padding = 22;
  gutter = 14;
  col = 4;
  row = 4;
  colWidths = [];
  translateXs = [];


  constructor() {
  }

  ngOnInit() {
  }

  calculate() {
    this.colWidths.length = this.translateXs.length = 0;
    this.eleWidth = (this.containerWidth - this.padding * 2 - this.gutter * 2 * this.col) / this.col;
    for (let i = 0; i < this.col; i++) {
      this.translateXs.push(Number(this.gutter) + Number((this.gutter * 2 + this.eleWidth) * i));
      this.colWidths.push(Number(this.eleWidth * (i + 1)) + Number(this.gutter * 2 * i));
    }
  }

  activeDragAndDrop(): void {
    this.dnd.activeDnd();
  }

  destroyDragAndDrOP(): void {
  }
}



