/**
 * 拖动和调整尺寸功能指令
 */
import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ModalPlusService } from './modal-plus.service';
import { DragDrop, DragRef } from '@angular/cdk/drag-drop';
import { getCdkGlobalOverlayWrapper } from './utils';

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
    this.modalPlusService.addResizeElement(this.elementRef, this.dragRef, this.min, this.max);
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
