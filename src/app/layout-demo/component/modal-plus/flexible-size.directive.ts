/**
 * 拖动和调整尺寸功能指令
 */
import {AfterViewInit, Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {ModalPlusService} from './modal-plus.service';
import {DragDrop, DragRef} from '@angular/cdk/drag-drop';
import {getCdkGlobalOverlayWrapper, getSize} from './utils';

@Directive({
  selector: '[apsFlexibleSize]',
  exportAs: 'apsFlexibleSize',
})
export class FlexibleSizeDirective implements OnInit, AfterViewInit, OnDestroy {
  // 是否需要拖动功能
  @Input()
  draggable = true;

  // 能否拖动，若没开启拖动功能，则该属性无效
  @Input()
  dragDisabled = false;

  // 变更尺寸大小的最小值，-1为不设置
  @Input()
  min = -1;

  // 变更尺寸大小的最大值，-1为不设置
  @Input()
  max = -1;

  // 拖动句柄
  @Input()
  dragHandles: (HTMLElement | ElementRef<HTMLElement>)[] | null = null;

  // 当缩放采用scaleMode模式时，作为弹框有自身起始宽高记录以及总差值记录
  scaleModeInf = {
    size: {width: 0, height: 0},
    totalDeviation: {
      _width: 0, _height: 0,
      set width(val: number) {
        this._width = val;
      },
      get width(): number {
        return this._width;
      },
      set height(val) {
        this._height = val;
      },
      get height(): number {
        return this._height;
      },
    },
  };

  isResize = false; // 判断是否处于拖拉尺寸状态
  dragRef: DragRef | null = null;
  dragAndResizeRecord = {};

  private _mousedownHandle = this._mouseDown.bind(this);

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private dragDrop: DragDrop,
    private modalPlusService: ModalPlusService,
  ) {
  }

  ngOnInit(): void {
    if (this.draggable) {
      this.dragRef = this.dragDrop.createDrag(this.elementRef);
      if (this.dragHandles) {
        this.dragRef.withHandles(this.dragHandles);
      }
    }
    this.renderer.addClass(this.elementRef.nativeElement, 'aps-modal-plus');
    this.modalPlusService.addResizeElement(this.elementRef, this.dragRef, this.scaleModeInf, this.min, this.max);
  }

  private _mouseDown(e) {
    const html = getCdkGlobalOverlayWrapper(e.target);
    if (html && this.modalPlusService.lastModalPlus !== html) {
      this.displayTop(html);
    }
  }

  ngAfterViewInit(): void {
    this.modalPlusService.enableDocumentMouseListener();
    this.elementRef.nativeElement.addEventListener('mousedown', this._mousedownHandle);
    // 记录组件起始尺寸
    const {width, height} = getSize(this.elementRef.nativeElement);
    this.scaleModeInf.size.width = width;
    this.scaleModeInf.size.height = height;
  }

  ngOnDestroy(): void {
    this.modalPlusService.deleteResizeElement(this.elementRef);
    this.elementRef.nativeElement.removeEventListener('mousedown', this._mousedownHandle);
  }

  setDragHandle(handles: (HTMLElement | ElementRef<HTMLElement>)[] | null) {
    if (this.dragRef) {
      this.dragRef.withHandles(handles);
    } else {
      console.warn('please enable drag');
    }
  }

  displayTop(el: HTMLElement) {
    this.modalPlusService.showCurrentModalPlus(el);
  }

}
