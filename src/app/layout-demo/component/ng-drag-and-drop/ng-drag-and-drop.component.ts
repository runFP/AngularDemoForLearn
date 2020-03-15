import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {ReactDndDirective} from '../../../share/directives/react-dnd/react-dnd.directive';

@Component({
  selector: 'app-ng-drag-and-drop',
  templateUrl: './ng-drag-and-drop.component.html',
  styleUrls: ['./ng-drag-and-drop.component.scss'],
})
export class NgDragAndDropComponent implements OnInit {
  @ViewChild('dnd', {static: false}) dnd: ReactDndDirective;

  constructor() {
  }

  ngOnInit() {}

  activeDragAndDrop(): void {
    this.dnd.activeDnd();
  }

  destroyDragAndDrOP(): void {}
}



