import {Component, ElementRef, Inject, OnInit, Renderer2} from '@angular/core';
import {DragDrop, DragRef} from '@angular/cdk/drag-drop';
import {NgDragAndDropService} from './ng-drag-and-drop.service';
import {DOCUMENT} from '@angular/common';
import {DNDContainerService, ElementInf} from './dndcontainer.service';

@Component({
  selector: 'app-ng-drag-and-drop',
  templateUrl: './ng-drag-and-drop.component.html',
  styleUrls: ['./ng-drag-and-drop.component.scss'],
})
export class NgDragAndDropComponent implements OnInit {

  private boundary: HTMLElement;
  private _document: Document;
  private children: HTMLCollection;
  private elementInf: ElementInf[];

  constructor(
    @Inject(DOCUMENT) _document: any,
    private dr: DragDrop,
    private el: ElementRef,
    private renderer: Renderer2,
    private dnd: NgDragAndDropService,
    private dndcontiner: DNDContainerService
  ) {
    console.log(dr);
  }

  ngOnInit() {
    this.boundary = this.el.nativeElement.querySelector('.example-boundary');
    this.children = this.boundary.children;
    this.elementInf = this.dndcontiner.collectElementPosition(this.children);
    this.renderer.setStyle(this.boundary, 'height', `${this.dndcontiner.getContainerHeight()}px`);
    console.log(this.elementInf);
  }

  activeCustom(): void {
    const dragRefs = this.createDrag(this.children);
  }

  createDrag(children: HTMLCollection): DragRef[] {
    const dragRefs: DragRef[] = [];
    for (let i = 0, ii = children.length; i < ii; i++) {
      const ele: HTMLElement = <HTMLElement>children[i];
      const shadowDom = this.dnd.createShadowElement(ele);

      const dragRef = this.dr.createDrag(ele);
      dragRef.withBoundaryElement(this.boundary);

      dragRef.started.subscribe(e => {
        console.log('before:');
        shadowDom.style.transform = ele.style.transform;
        this.renderer.appendChild(this.boundary, shadowDom);
      });

      dragRef.moved.subscribe(e => {
        const dragElement = e.source.getRootElement();
        const boundaryPoint = this.dnd.getBoundaryPoint(dragElement);
        const boundaryInf = this.dnd.boundaryHit(boundaryPoint, dragElement, this.elementInf);
        if (!boundaryInf.boundary) {
          /** 无任何碰撞*/

        } else {
          /** 碰撞*/
          if (boundaryInf.bestBoundaryElement !== null) {
            const bestDE = boundaryInf.bestBoundaryElement.element;
            shadowDom.style.transform = bestDE.style.transform;
          }
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



