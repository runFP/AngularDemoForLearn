/**
 * 拖动和调整尺寸功能指令
 */
import {AfterViewInit, Directive, ElementRef, Input, OnInit, Optional, Renderer2} from '@angular/core';
import {ModalPlusService} from './modal-plus.service';
import {DragDrop, DragRef} from '@angular/cdk/drag-drop';

// 鼠标离边缘位置多少时可以调整
const offsetDistance = 5;

export enum RESIZE_TYPE {
  NW = 'nw-resize',
  NE = 'ne-resize',
  N = 'n-resize',
  SW = 'sw-resize',
  W = 'w-resize',
  SE = 'se-resize',
  E = 'e-resize',
  S = 's-resize',
}


@Directive({
  selector: '[apsFlexibleSize]',
  exportAs: 'apsFlexibleSize',
})
export class FlexibleSizeDirective implements OnInit, AfterViewInit {
  // 是否需要拖动功能
  @Input()
  draggable = true;

  // 能否拖动，若没开启拖动功能，则该属性无效
  @Input()
  dragDisabled = false;

  currentMouseClassName: string;
  isResize = false; // 判断是否处于拖拉尺寸状态
  lastPosition = {x: 0, y: 0}; // 上一次鼠标位置
  dragRef: DragRef | null = null;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private dragDrop: DragDrop,
    @Optional() private modalPlusService: ModalPlusService,
  ) {
  }

  ngOnInit(): void {
    if (this.draggable) {
      this.dragRef = this.dragDrop.createDrag(this.elementRef);
    }
    console.log(this.elementRef.nativeElement.getBoundingClientRect());
    this.renderer.addClass(this.elementRef.nativeElement, 'aps-modal-plus');
  }

  ngAfterViewInit(): void {
    this.elementRef.nativeElement.addEventListener('mousemove', (e) => {
      const {width, height} = this.getSize();
      const layerY = e.y - this.elementRef.nativeElement.getBoundingClientRect().top;
      const layerX = e.x - this.elementRef.nativeElement.getBoundingClientRect().left;

      if (layerX - offsetDistance <= 0 && layerY - offsetDistance <= 0) {
        this.addClass(RESIZE_TYPE.NW);
        this.activeDragDisable(true);
      } else if (layerX + offsetDistance >= width && layerY - offsetDistance <= 0) {
        this.addClass(RESIZE_TYPE.NE);
        this.activeDragDisable(true);
      } else if (layerY - offsetDistance <= 0) {
        this.addClass(RESIZE_TYPE.N);
        this.activeDragDisable(true);
        this.resize(e, this.currentMouseClassName, width, height);
      } else if (layerX - offsetDistance <= 0 && layerY + offsetDistance >= height) {
        this.addClass(RESIZE_TYPE.SW);
        this.activeDragDisable(true);
      } else if (layerX - offsetDistance <= 0) {
        this.addClass(RESIZE_TYPE.W);
        this.activeDragDisable(true);
      } else if (layerX + offsetDistance >= width && layerY + offsetDistance >= height) {
        this.addClass(RESIZE_TYPE.SE);
        this.activeDragDisable(true);
      } else if (layerX + offsetDistance >= width) {
        this.addClass(RESIZE_TYPE.E);
        this.activeDragDisable(true);
      } else if (layerY + offsetDistance >= height) {
        this.addClass(RESIZE_TYPE.S);
        this.activeDragDisable(true);
      } else if (this.currentMouseClassName !== '') {
        this.removeClass(this.currentMouseClassName);
        this.activeDragDisable(false);
      }
    });

    this.elementRef.nativeElement.addEventListener('mousedown', e => {
      this.lastPosition = {x: e.x, y: e.y,};
      if (this.currentMouseClassName) {
        this.isResize = true;
      }
      console.log('positionY', this.elementRef.nativeElement.getBoundingClientRect().y);
    });

    this.elementRef.nativeElement.addEventListener('mouseup', e => {
      this.isResize = false;
    });
  }

  private activeDragDisable(active: boolean) {
    if (this.dragRef !== null) {
      this.dragRef.disabled = active;
    }
  }

  private addClass(className: string, el = this.elementRef.nativeElement) {
    this.removeClass(this.currentMouseClassName);
    this.renderer.addClass(el, className);
    this.currentMouseClassName = className;
  }

  private removeClass(className: string, el = this.elementRef.nativeElement) {
    if (this.currentMouseClassName !== '') {
      this.renderer.removeClass(el, className);
      this.currentMouseClassName = '';
    }
  }

  private resize(e, type, width, height) {
    const delta = {x: 1, y: 1};
    if (this.isResize) {
      const movementX = this.lastPosition.x - e.x;
      const movementY = this.lastPosition.y - e.y;
      this.lastPosition = {x: e.x, y: e.y,};
      const lastTranslate = getTransform(this.elementRef.nativeElement.style.transform);
      console.log('------------------');
      console.log('positionY', this.elementRef.nativeElement.getBoundingClientRect().top);
      console.log('movementY', movementY);
      console.log(lastTranslate.y - movementY);
      this.renderer.setStyle(this.elementRef.nativeElement, 'height', `${height + movementY}px`);
      this.renderer.setStyle(this.elementRef.nativeElement, 'transform', `translate3d(0px, ${lastTranslate.y - movementY / 2}px, 0px)`);
    }

    function getTransform(transform: string): { x: number, y: number, z: number } {
      const reg = /^.+\((.*)\)/;
      const match = transform.match(reg);
      const transValue = {x: 0, y: 0, z: 0};
      if (match) {
        const valueArr: number | string[] = match[1].split(',');
        valueArr.forEach((v, i) => {
          valueArr[i] = v.replace('px', '');
        });
        transValue.x = Number(valueArr[0]);
        transValue.y = Number(valueArr[1]);
        transValue.z = Number(valueArr[2]);
      }
      return transValue;
    }
  }

  private getSize(): { width: number, height: number } {
    return {
      width: this.elementRef.nativeElement.offsetWidth,
      height: this.elementRef.nativeElement.offsetHeight,
    };
  }


}
