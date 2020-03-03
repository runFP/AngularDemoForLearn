import {Component, ElementRef, Inject, OnInit, Renderer2} from '@angular/core';
import {DragDrop, DragRef, DragRefConfig} from '@angular/cdk/drag-drop';
import {ElementInf, NgDragAndDropService} from './ng-drag-and-drop.service';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-ng-drag-and-drop',
  templateUrl: './ng-drag-and-drop.component.html',
  styleUrls: ['./ng-drag-and-drop.component.scss'],
  providers: [NgDragAndDropService],
})
export class NgDragAndDropComponent implements OnInit {

  private boundary: HTMLElement;
  private _document: Document;
  private elementPositions: ElementInf[];

  constructor(
    @Inject(DOCUMENT) _document: any,
    private dr: DragDrop,
    private el: ElementRef,
    private renderer: Renderer2,
    private dnd: NgDragAndDropService,
  ) {
    console.log(dr);
  }

  ngOnInit() {
  }

  activeCustom(): void {
    this.boundary = this.el.nativeElement.querySelector('.example-boundary');
    const dragBox = this.boundary.children;
    const dragRefs = this.createDrag(dragBox);
  }

  createDrag(children: HTMLCollection): DragRef[] {
    const dragRefs: DragRef[] = [];
    this.elementPositions = this.dnd.collectElementPosition(children);
    console.log(this.elementPositions);
    for (let i = 0, ii = children.length; i < ii; i++) {
      const ele: HTMLElement = <HTMLElement>children[i];
      const shadowDom = this.dnd.createShadowElement(ele);

      const dragRef = this.dr.createDrag(ele);
      dragRef.started.subscribe(e => {
        console.log('before:');
        shadowDom.style.transform = ele.style.transform;
        this.renderer.appendChild(this.boundary, shadowDom);
      });

      dragRef.moved.subscribe(e => {
        console.log(e);
        if (e.delta.x === 1) {
          console.log('right');
        } else if (e.delta.x === -1) {
          console.log('left');
        }
        if (e.delta.y === 1) {
          console.log('down');
        } else if (e.delta.y === -1) {
          console.log('up');
        }
      });

      dragRef.ended.subscribe(e => {
        this.renderer.removeChild(this.boundary, shadowDom, false);
      });

      dragRefs.push(dragRef);
    }
    return dragRefs;
  }
}



