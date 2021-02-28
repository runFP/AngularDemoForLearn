/**
 * 拖动和调整尺寸功能指令
 */
import {AfterViewInit, Directive, ElementRef, Input, OnDestroy, OnInit, Optional, Renderer2} from '@angular/core';
import {ModalPlusService} from './modal-plus.service';
import {DragDrop, DragRef} from '@angular/cdk/drag-drop';

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

  isResize = false; // 判断是否处于拖拉尺寸状态
  dragRef: DragRef | null = null;

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
    }
    this.renderer.addClass(this.elementRef.nativeElement, 'aps-modal-plus');
    this.modalPlusService.addResizeElement(this.elementRef, this.dragRef);
  }

  ngAfterViewInit(): void {
    this.modalPlusService.enableDocumentMouseListener();
  }

  ngOnDestroy(): void {
    this.modalPlusService.deleteResizeElement(this.elementRef);
  }


}
