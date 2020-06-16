import {AfterViewInit, Directive, ElementRef, Inject, Input, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {NgDragAndDropService, Point} from './ng-drag-and-drop.service';
import {DNDContainerService, ElementInf} from './dndcontainer.service';
import {Observable, Subject} from 'rxjs';
import {getPosition, getTransformByPosition} from './dnd-utils';
import {DOCUMENT} from '@angular/common';
import {debounceTime} from 'rxjs/internal/operators';

@Directive({
  selector: '[appReactDnd]',
  exportAs: 'dnd',
})
export class ReactDndDirective implements OnInit, OnDestroy, AfterViewInit {

  /** 容器内补丁*/
  @Input() padding: number | Padding = 22;

  /** 容器列数*/
  @Input() col = 4;

  /** 元素间凹槽*/
  @Input() gutter: number | Padding = 14;

  /** 设计图尺寸（适配宽度）*/
  @Input() designSize = 1920;

  private fontSize = 0;

  private boundary: HTMLElement;
  private children: HTMLCollection;
  private moveFlag = false;
  private oldPosition: Point;
  private moveTarget: HTMLElement;
  private moveSubject = new Subject();
  private containerWidth = 0;

  private _downHandler = this._pointerDown.bind(this);
  private _moveHandler = this._pointerMove.bind(this);
  private _upHandler = this._pointUp.bind(this);

  constructor(
    @Inject(DOCUMENT) private _document: any,
    private el: ElementRef,
    private renderer: Renderer2,
    private dnd: NgDragAndDropService,
    private dndcontainer: DNDContainerService
  ) {
  }

  ngOnInit(): void {
    this.moveSubject.pipe(debounceTime(60)).subscribe(e => this._moveCalculate(e));
  }

  ngAfterViewInit(): void {
    if (this._document.documentElement.style.fontSize) {
      this.fontSize = this._document.documentElement.style.fontSize.replace('px', '');
    }
  }

  /**
   * 激活拖放功能
   */
  activeDnd(): void {
    this.boundary = this.el.nativeElement;
    this.containerWidth = this.boundary.clientWidth;
    this.children = this.boundary.children;
    this.dndcontainer.init(this.children, this.fontSize, {
      width: this.containerWidth,
      padding: this.padding,
      col: this.col,
      gutter: this.gutter,
      designSize: this.designSize,
    });
    this.createDrag();
  }

  /**
   * 禁用拖放功能并初始化
   */
  destroyDnd(): void {
    this.boundary.removeEventListener('mousedown', this._downHandler);
    this.boundary.removeEventListener('mousemove', this._moveHandler);
    this.boundary.removeEventListener('mouseup', this._upHandler);
    this.boundary.removeEventListener('mouseleave', this._upHandler);
    this.dndcontainer.clear();
  }

  addElement(element: HTMLElement): string {
    const transform = this.dndcontainer.addElement(element);
    this.resetContainerHeight();
    return transform;
  }

  removeElement(element: HTMLElement): void {
    this.dndcontainer.removeElement(element);
    this.resetContainerHeight();
  }

  /**
   * 重设容器高度
   * @param {ElementInf} dragElementInf
   */
  resetContainerHeight(dragElementInf?: ElementInf): void {
    this.dndcontainer.calculateContainerHeight(dragElementInf);
    if (this.dndcontainer.getContainerHeightUpdate()) {
      this.renderer.setStyle(this.boundary, 'height', `${this.dndcontainer.getContainerHeight()}px`);
    }
  }

  private _pointerDown(event: MouseEvent): void {
    event.preventDefault();
    if (!event.target) {
      return;
    }
    const target = this.dndcontainer.getParentElement(<HTMLElement>event.target) as HTMLElement;
    if (!target || target.style.transform === '') {
      return;
    }
    this.moveTarget = target;
    this.moveFlag = true;

    this.oldPosition = {x: event.pageX, y: event.pageY};
    const placeInf = this.dndcontainer.createPlaceDom(target);

    this.renderer.appendChild(this.boundary, placeInf.element);
  }

  private _pointerMove(event: MouseEvent): void {
    if (!this.moveFlag) {
      return;
    }

    const target = this.moveTarget;
    /** 算出偏移值 */
    const newPosition = {x: event.pageX, y: event.pageY};
    const distance = {x: newPosition.x - this.oldPosition.x, y: newPosition.y - this.oldPosition.y};
    this.oldPosition = newPosition;

    /** 1 右，下 -1 左，上*/
    const delta = {x: distance.x > 0 ? 1 : -1, y: distance.y > 0 ? 1 : -1};

    /** 更新拖动元素位置，并获取其原始元素信息*/
    const targetElementPosition = getPosition(target);
    if (targetElementPosition !== null) {
      targetElementPosition.x += distance.x;
      targetElementPosition.y += distance.y;
      target.style.transform = getTransformByPosition(targetElementPosition);
    }
    this.moveSubject.next({target, delta});
  }

  /**
   * 鼠标移动时计算占位层位置，各元素的位置偏移
   * 有防抖操作提高性能
   * @param e
   * @private
   */
  private _moveCalculate(e) {
    const dragElementInf = this.dndcontainer.getElementInfByElement(e.target);

    /** 获取拖动元素的边缘4点*/
    const boundaryPoint = this.dnd.getBoundaryPoint(e.target);

    /** 根据x轴拖动方向，得出拖动元素的碰撞X点，来计算所处列的X坐标 */
    let xPoint;
    let xpKey = 'start';
    if (e.delta.x === 1) {
      xPoint = boundaryPoint.p2.x;
      xpKey = 'end';
    } else if (e.delta.x === -1) {
      xPoint = boundaryPoint.p1.x;
    }

    this.dndcontainer.refreshElementsPositionBefore(dragElementInf);
    this.dndcontainer.refreshPlacePositionFake(xPoint, xpKey, e.target);
    this.dndcontainer.refreshElementsPositionAfter(dragElementInf);

    /** 重新计算容器高度 */
    this.resetContainerHeight(dragElementInf);
  }

  private _pointUp(event: MouseEvent): void {
    if (!this.moveFlag) {
      return;
    }
    this.moveFlag = false;

    const target = this.moveTarget;
    const placeInf = this.dndcontainer.getPlaceElement();
    target.style.transform = getTransformByPosition(placeInf.position);
    const dragElementInf = this.dndcontainer.getElementInfByElement(target);
    this.dndcontainer.updateElementCollection(dragElementInf, placeInf.position);

    this.renderer.removeChild(this.boundary, placeInf.element);
    this.moveTarget = null;
  }

  /**
   * 为容器添加事件监听
   */
  private createDrag(): void {
    this.boundary.addEventListener('mousedown', this._downHandler);
    this.boundary.addEventListener('mousemove', this._moveHandler);
    this.boundary.addEventListener('mouseup', this._upHandler);
    this.boundary.addEventListener('mouseleave', this._upHandler);
  }

  ngOnDestroy(): void {
    this.moveSubject.unsubscribe();
  }

}

export interface Padding {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

