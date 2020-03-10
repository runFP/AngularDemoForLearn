import {Component, ElementRef, Inject, OnInit, Renderer2} from '@angular/core';
import {NgDragAndDropService} from './ng-drag-and-drop.service';
import {DOCUMENT} from '@angular/common';
import {DNDContainerService, ElementInf} from './dndcontainer.service';
import {getPosition, getTransformByPosition} from './dnd-utils';

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
  private lastBoundaryELement;

  constructor(
    @Inject(DOCUMENT) _document: any,
    private el: ElementRef,
    private renderer: Renderer2,
    private dnd: NgDragAndDropService,
    private dndcontainer: DNDContainerService
  ) {
  }

  ngOnInit() {
    this.boundary = this.el.nativeElement.querySelector('.example-boundary');
    this.children = this.boundary.children;
    this.elementInf = this.dndcontainer.collectElementPosition(this.children);
    this.renderer.setStyle(this.boundary, 'height', `${this.dndcontainer.getContainerHeight()}px`);
    console.log(this.elementInf);
  }

  activeCustom(): void {
    const dragRefs = this.createDrag(this.children);
  }

  getPlace() {
    console.log(this.dndcontainer.getPlaceElement());
  }

  showCollection() {
    console.log(this.dndcontainer.elementInfCollection);
  }

  createDrag(children: HTMLCollection): void {
    let moveFlag = false;
    let moveTarget;
    let oldPosition;
    let newPosition;
    let distance;
    let shadowElementInf;

    /**
     * 阻止浏览器自带事件，当拖动时
     * 创建占位层
     * 记录其实坐标
     */
    this.boundary.addEventListener('mousedown', event => {
      event.preventDefault();
      moveTarget = event.target;
      if (moveTarget.style.transform === '') return;
      moveFlag = true;
      oldPosition = {x: event.pageX, y: event.pageY};
      shadowElementInf = this.dndcontainer.createPlaceDom(moveTarget);
      this.renderer.appendChild(this.boundary, shadowElementInf.element);
      console.log('mousedown');
    });

    /**
     *
     */
    this.boundary.addEventListener('mousemove', event => {
      if (!moveFlag) return;
      newPosition = {x: event.pageX, y: event.pageY};
      distance = {x: newPosition.x - oldPosition.x, y: newPosition.y - oldPosition.y};
      oldPosition = newPosition;
      const targetElementPosition = getPosition(moveTarget);
      if (targetElementPosition !== null) {
        targetElementPosition.x += distance.x;
        targetElementPosition.y += distance.y;
        moveTarget.style.transform = getTransformByPosition(targetElementPosition);
      }

      const dragElementInf = this.dndcontainer.getElementInfByElement(moveTarget);
      const boundaryPoint = this.dnd.getBoundaryPoint(moveTarget);
      const boundaryInf = this.dnd.boundaryHit(boundaryPoint, moveTarget, this.dndcontainer.getElementInfCollection());
      if (!boundaryInf.boundary) {
        /** 无任何碰撞*/

      } else {
        /** 碰撞: 存在最优碰撞元素且不是上一次的最优碰撞元素*/
        if (boundaryInf.bestBoundaryElement !== null && this.lastBoundaryELement !== boundaryInf.bestBoundaryElement.element) {
          const bestDEInf = boundaryInf.bestBoundaryElement;
          this.lastBoundaryELement = bestDEInf.element;
          /**
           * 刷新容器内部元素
           * 刷新占位层
           * 刷新容器内部元素
           */
          this.dndcontainer.refreshElementsPositionBefore(dragElementInf);
          this.dndcontainer.refreshPlace(bestDEInf, dragElementInf);
          this.dndcontainer.refreshElementsPositionAfter(dragElementInf);
        }
      }

    });
    this.boundary.addEventListener('mouseup', event => {
      if (moveFlag) {
        moveFlag = false;
        moveTarget.style.transform = getTransformByPosition(shadowElementInf.position);
        const dragElementInf = this.dndcontainer.getElementInfByElement(moveTarget);
        this.dndcontainer.updateElementCollection(dragElementInf, shadowElementInf.position);
        this.renderer.removeChild(this.boundary, shadowElementInf.element, false);
        console.log('mouseup');
      }
    });
  }
}



